import { defineAction, z, type ActionsModule, type PortableCtx } from "@hatch/space-sdk";
import { and, desc, eq } from "drizzle-orm";
import * as schema from "./schema";

const topicSchema = z.enum(["Movies", "TV Shows", "Music", "Radio", "Theater", "Podcasts", "Trailers", "Community"]);

function viewerName(viewer: { displayName?: string }) {
  return viewer.displayName?.trim() || "Reelwave member";
}

async function ensureProfile(ctx: PortableCtx) {
  if (!ctx.viewer) return null;
  const db = ctx.db<typeof schema>();
  const name = viewerName(ctx.viewer);
  await db.insert(schema.profiles).values({
    viewerId: ctx.viewer.viewerFbid,
    displayName: name,
    avatarSeed: name.slice(0, 2).toUpperCase(),
    updatedAt: new Date(),
  }).onConflictDoUpdate({
    target: schema.profiles.viewerId,
    set: { displayName: name, avatarSeed: name.slice(0, 2).toUpperCase(), updatedAt: new Date() },
  });
  return { id: ctx.viewer.viewerFbid, name, initials: name.slice(0, 2).toUpperCase(), isOwner: ctx.viewer.isOwner };
}

export const Actions = {
  getSession: defineAction({
    request: z.object({}),
    response: z.object({
      signedIn: z.boolean(),
      account: z.object({ name: z.string(), initials: z.string(), isOwner: z.boolean() }).nullable(),
      savedFeatured: z.boolean(),
    }),
    async handler(ctx) {
      const account = await ensureProfile(ctx);
      if (!account) return { signedIn: false, account: null, savedFeatured: false };
      const db = ctx.db<typeof schema>();
      const saved = await db.select({ id: schema.savedTitles.id }).from(schema.savedTitles)
        .where(and(eq(schema.savedTitles.viewerId, account.id), eq(schema.savedTitles.title, "Midnight Orbit"))).limit(1);
      return { signedIn: true, account: { name: account.name, initials: account.initials, isOwner: account.isOwner }, savedFeatured: saved.length > 0 };
    },
  }),

  saveFeatured: defineAction({
    request: z.object({}),
    response: z.object({ ok: z.boolean(), saved: z.boolean(), error: z.string().optional() }),
    async handler(ctx) {
      const account = await ensureProfile(ctx);
      if (!account) return { ok: false, saved: false, error: "Sign in with your Muse account to use My List." };
      const db = ctx.db<typeof schema>();
      const existing = await db.select({ id: schema.savedTitles.id }).from(schema.savedTitles)
        .where(and(eq(schema.savedTitles.viewerId, account.id), eq(schema.savedTitles.title, "Midnight Orbit"))).limit(1);
      if (existing[0]) {
        await db.delete(schema.savedTitles).where(eq(schema.savedTitles.id, existing[0].id));
        ctx.invalidateQueries();
        return { ok: true, saved: false };
      }
      await db.insert(schema.savedTitles).values({ viewerId: account.id, title: "Midnight Orbit" });
      ctx.invalidateQueries();
      return { ok: true, saved: true };
    },
  }),

  uploadMedia: defineAction({
    request: z.object({
      fileName: z.string().min(1).max(180),
      mimeType: z.string().regex(/^(image\/(jpeg|png|gif|webp)|video\/(mp4|webm|quicktime))$/),
      dataBase64: z.string().min(1).max(28_000_000),
    }),
    response: z.object({ ok: z.boolean(), blobKey: z.string().optional(), mediaType: z.string().optional(), fileName: z.string().optional(), error: z.string().optional() }),
    async handler(ctx, args) {
      const account = await ensureProfile(ctx);
      if (!account) return { ok: false, error: "Sign in before attaching media." };
      try {
        const binary = atob(args.dataBase64);
        const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
        if (bytes.byteLength > 20 * 1024 * 1024) return { ok: false, error: "Choose a file smaller than 20 MB." };
        const safeName = args.fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-120);
        const key = `community/${account.id}/${crypto.randomUUID()}-${safeName}`;
        await ctx.blobs.put(key, bytes, { contentType: args.mimeType, public: false });
        const db = ctx.db<typeof schema>();
        await db.insert(schema.mediaUploads).values({ viewerId: account.id, blobKey: key, mediaType: args.mimeType, fileName: safeName, byteSize: bytes.byteLength });
        return { ok: true, blobKey: key, mediaType: args.mimeType, fileName: safeName };
      } catch {
        return { ok: false, error: "That file could not be uploaded. Try another image or video." };
      }
    },
  }),

  publishPost: defineAction({
    request: z.object({
      topic: topicSchema,
      body: z.string().trim().min(1).max(280),
      mediaBlobKey: z.string().max(500).nullable(),
    }),
    response: z.object({ ok: z.boolean(), id: z.number().optional(), error: z.string().optional() }),
    async handler(ctx, args) {
      const account = await ensureProfile(ctx);
      if (!account) return { ok: false, error: "Sign in before publishing." };
      const db = ctx.db<typeof schema>();
      let mediaType: string | null = null;
      let mediaName: string | null = null;
      if (args.mediaBlobKey) {
        const upload = await db.select().from(schema.mediaUploads)
          .where(and(eq(schema.mediaUploads.viewerId, account.id), eq(schema.mediaUploads.blobKey, args.mediaBlobKey))).limit(1);
        if (!upload[0]) return { ok: false, error: "That upload is not available to this account." };
        mediaType = upload[0].mediaType;
        mediaName = upload[0].fileName;
      }
      const rows = await db.insert(schema.communityPosts).values({
        authorId: account.id,
        authorName: account.name,
        topic: args.topic,
        body: args.body,
        mediaBlobKey: args.mediaBlobKey,
        mediaType,
        mediaName,
      }).returning({ id: schema.communityPosts.id });
      ctx.invalidateQueries();
      return { ok: true, id: rows[0]?.id };
    },
  }),

  listPosts: defineAction({
    request: z.object({ limit: z.number().int().positive().max(100).default(50) }),
    response: z.object({ posts: z.array(z.object({
      id: z.number(), authorName: z.string(), initials: z.string(), topic: z.string(), body: z.string(),
      mediaUrl: z.string().nullable(), mediaType: z.string().nullable(), mediaName: z.string().nullable(), createdAt: z.string(),
    })) }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.communityPosts).orderBy(desc(schema.communityPosts.createdAt), desc(schema.communityPosts.id)).limit(args.limit);
      return { posts: await Promise.all(rows.map(async (row) => ({
        id: row.id,
        authorName: row.authorName,
        initials: row.authorName.slice(0, 2).toUpperCase(),
        topic: row.topic,
        body: row.body,
        mediaUrl: row.mediaBlobKey ? await ctx.blobs.getUrl(row.mediaBlobKey, { expiresInSeconds: 3600, public: false }) : null,
        mediaType: row.mediaType,
        mediaName: row.mediaName,
        createdAt: row.createdAt.toISOString(),
      }))) };
    },
  }),
} satisfies ActionsModule;
