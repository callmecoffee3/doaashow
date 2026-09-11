import { defineAction, z, type ActionsModule } from "@hatch/space-sdk";
import { and, desc, eq, or } from "drizzle-orm";
import * as schema from "./schema";

const visibilitySchema = z.enum(["public", "private"]);
const resultSchema = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true), id: z.number() }),
  z.object({ ok: z.literal(false), error: z.string() }),
]);

function viewerDetails(ctx: { viewer?: { viewerFbid: string; isOwner: boolean; displayName?: string } }) {
  const isOwner = ctx.viewer?.isOwner ?? true;
  return {
    id: ctx.viewer?.viewerFbid ?? "local-owner",
    isOwner,
    name: ctx.viewer?.displayName?.trim() || (isOwner ? "Board owner" : "Community member"),
  };
}

const postResponse = z.object({
  id: z.number(),
  body: z.string(),
  visibility: visibilitySchema,
  author_name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  is_mine: z.boolean(),
  can_edit: z.boolean(),
  can_delete: z.boolean(),
});

export const Actions = {
  listPosts: defineAction({
    request: z.object({
      scope: z.enum(["all", "public", "private"]).default("all"),
      limit: z.number().int().positive().max(100).default(50),
    }),
    response: z.object({
      posts: z.array(postResponse),
      viewer: z.object({ display_name: z.string(), is_owner: z.boolean() }),
      counts: z.object({ public: z.number(), private: z.number() }),
    }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const viewer = viewerDetails(ctx);
      const ownPrivate = and(
        eq(schema.posts.visibility, "private"),
        eq(schema.posts.authorId, viewer.id),
      );
      const publicPosts = eq(schema.posts.visibility, "public");
      const condition =
        args.scope === "public"
          ? publicPosts
          : args.scope === "private"
            ? ownPrivate
            : or(publicPosts, ownPrivate);

      const [rows, publicCountRows, privateCountRows] = await Promise.all([
        db
          .select()
          .from(schema.posts)
          .where(condition)
          .orderBy(desc(schema.posts.createdAt), desc(schema.posts.id))
          .limit(args.limit),
        db
          .select({ id: schema.posts.id })
          .from(schema.posts)
          .where(publicPosts),
        db
          .select({ id: schema.posts.id })
          .from(schema.posts)
          .where(ownPrivate),
      ]);

      return {
        posts: rows.map((row) => {
          const isMine = row.authorId === viewer.id;
          return {
            id: row.id,
            body: row.body,
            visibility: row.visibility,
            author_name: isMine ? "You" : row.authorName,
            created_at: row.createdAt.toISOString(),
            updated_at: row.updatedAt.toISOString(),
            is_mine: isMine,
            can_edit: isMine,
            can_delete: isMine || (viewer.isOwner && row.visibility === "public"),
          };
        }),
        viewer: { display_name: viewer.name, is_owner: viewer.isOwner },
        counts: { public: publicCountRows.length, private: privateCountRows.length },
      };
    },
  }),

  createPost: defineAction({
    request: z.object({ body: z.string().max(500), visibility: visibilitySchema }),
    response: resultSchema,
    async handler(ctx, args) {
      const body = args.body.trim();
      if (!body) return { ok: false as const, error: "Write a message before posting." };
      const viewer = viewerDetails(ctx);
      const db = ctx.db<typeof schema>();
      const now = new Date();
      const inserted = await db
        .insert(schema.posts)
        .values({
          body,
          visibility: args.visibility,
          authorId: viewer.id,
          authorName: viewer.name,
          createdAt: now,
          updatedAt: now,
        })
        .returning({ id: schema.posts.id });
      const id = inserted[0]?.id;
      if (!id) return { ok: false as const, error: "The notice could not be posted." };
      ctx.invalidateQueries();
      return { ok: true as const, id };
    },
  }),

  updatePost: defineAction({
    request: z.object({ id: z.number().int().positive(), body: z.string().max(500) }),
    response: resultSchema,
    async handler(ctx, args) {
      const body = args.body.trim();
      if (!body) return { ok: false as const, error: "A notice cannot be empty." };
      const viewer = viewerDetails(ctx);
      const db = ctx.db<typeof schema>();
      const rows = await db
        .select({ authorId: schema.posts.authorId })
        .from(schema.posts)
        .where(eq(schema.posts.id, args.id))
        .limit(1);
      if (!rows[0]) return { ok: false as const, error: "That notice no longer exists." };
      if (rows[0].authorId !== viewer.id) {
        return { ok: false as const, error: "You can only edit your own notices." };
      }
      await db
        .update(schema.posts)
        .set({ body, updatedAt: new Date() })
        .where(eq(schema.posts.id, args.id));
      ctx.invalidateQueries();
      return { ok: true as const, id: args.id };
    },
  }),

  deletePost: defineAction({
    request: z.object({ id: z.number().int().positive() }),
    response: resultSchema,
    async handler(ctx, args) {
      const viewer = viewerDetails(ctx);
      const db = ctx.db<typeof schema>();
      const rows = await db
        .select({ authorId: schema.posts.authorId, visibility: schema.posts.visibility })
        .from(schema.posts)
        .where(eq(schema.posts.id, args.id))
        .limit(1);
      const post = rows[0];
      if (!post) return { ok: false as const, error: "That notice no longer exists." };
      const canDelete = post.authorId === viewer.id || (viewer.isOwner && post.visibility === "public");
      if (!canDelete) return { ok: false as const, error: "You cannot remove this notice." };
      await db.delete(schema.posts).where(eq(schema.posts.id, args.id));
      ctx.invalidateQueries();
      return { ok: true as const, id: args.id };
    },
  }),
} satisfies ActionsModule;
