import { defineAction, z, type ActionsModule } from "@hatch/space-sdk";
import { and, asc, desc, eq, or } from "drizzle-orm";
import * as schema from "./schema";

const imageInput = {
  imageBase64: z.string().max(15_000_000).optional(),
  imageMime: z.enum(["image/jpeg", "image/png"]).optional(),
};

const profileShape = z.object({
  id: z.number(), name: z.string(), handle: z.string(), bio: z.string(),
  avatar_url: z.string().nullable(), created_at: z.string(),
});

async function saveImage(ctx: any, base64: string | undefined, mime: string | undefined, prefix: string) {
  if (!base64 || !mime) return null;
  const ext = mime === "image/png" ? "png" : "jpg";
  const key = `${prefix}/${crypto.randomUUID()}.${ext}`;
  await ctx.blobs.put(key, Buffer.from(base64, "base64"), { contentType: mime });
  return key;
}

async function profileName(db: any, id: number) {
  const row = await db.select({ name: schema.profiles.name }).from(schema.profiles).where(eq(schema.profiles.id, id)).limit(1);
  return row[0]?.name ?? "Someone";
}

async function notify(db: any, profileId: number, actorId: number | null, kind: string, message: string, entityType?: string, entityId?: number) {
  await db.insert(schema.notifications).values({ profileId, actorId, kind, message, entityType: entityType ?? null, entityId: entityId ?? null });
}

export const Actions = {
  getAppData: defineAction({
    request: z.object({}),
    response: z.object({
      profiles: z.array(profileShape),
      posts: z.array(z.object({
        id: z.number(), profile_id: z.number(), caption: z.string(), image_url: z.string().nullable(),
        created_at: z.string(), liked_by: z.array(z.number()),
      })),
      follows: z.array(z.object({ follower_id: z.number(), following_id: z.number() })),
      friendships: z.array(z.object({ id: z.number(), requester_id: z.number(), addressee_id: z.number(), status: z.string() })),
      groups: z.array(z.object({ id: z.number(), creator_id: z.number(), name: z.string(), description: z.string(), privacy: z.string(), member_ids: z.array(z.number()), created_at: z.string() })),
      events: z.array(z.object({ id: z.number(), organizer_id: z.number(), title: z.string(), details: z.string(), location: z.string(), starts_at: z.string(), attendee_ids: z.array(z.number()), created_at: z.string() })),
      listings: z.array(z.object({ id: z.number(), seller_id: z.number(), title: z.string(), description: z.string(), price_cents: z.number(), category: z.string(), item_condition: z.string(), image_url: z.string().nullable(), status: z.string(), created_at: z.string() })),
      notifications: z.array(z.object({ id: z.number(), profile_id: z.number(), actor_id: z.number().nullable(), kind: z.string(), message: z.string(), entity_type: z.string().nullable(), entity_id: z.number().nullable(), is_read: z.boolean(), created_at: z.string() })),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const [profiles, posts, likes, follows, friendships, groups, members, events, attendees, listings, notifications] = await Promise.all([
        db.select().from(schema.profiles).orderBy(asc(schema.profiles.id)),
        db.select().from(schema.posts).orderBy(desc(schema.posts.createdAt)),
        db.select().from(schema.postLikes),
        db.select().from(schema.follows),
        db.select().from(schema.friendships).orderBy(desc(schema.friendships.id)),
        db.select().from(schema.communityGroups).orderBy(desc(schema.communityGroups.id)),
        db.select().from(schema.groupMembers),
        db.select().from(schema.events).orderBy(asc(schema.events.startsAt)),
        db.select().from(schema.eventAttendees),
        db.select().from(schema.listings).orderBy(desc(schema.listings.id)),
        db.select().from(schema.notifications).orderBy(desc(schema.notifications.id)),
      ]);
      const avatarUrls = new Map<number, string | null>();
      for (const p of profiles) avatarUrls.set(p.id, p.avatarBlobKey ? await ctx.blobs.getUrl(p.avatarBlobKey) : null);
      const postUrls = new Map<number, string | null>();
      for (const p of posts) postUrls.set(p.id, p.imageBlobKey ? await ctx.blobs.getUrl(p.imageBlobKey) : null);
      const listingUrls = new Map<number, string | null>();
      for (const l of listings) listingUrls.set(l.id, l.imageBlobKey ? await ctx.blobs.getUrl(l.imageBlobKey) : null);
      return {
        profiles: profiles.map(p => ({ id: p.id, name: p.name, handle: p.handle, bio: p.bio, avatar_url: avatarUrls.get(p.id) ?? null, created_at: p.createdAt.toISOString() })),
        posts: posts.map(p => ({ id: p.id, profile_id: p.profileId, caption: p.caption, image_url: postUrls.get(p.id) ?? null, created_at: p.createdAt.toISOString(), liked_by: likes.filter(l => l.postId === p.id).map(l => l.profileId) })),
        follows: follows.map(f => ({ follower_id: f.followerId, following_id: f.followingId })),
        friendships: friendships.map(f => ({ id: f.id, requester_id: f.requesterId, addressee_id: f.addresseeId, status: f.status })),
        groups: groups.map(g => ({ id: g.id, creator_id: g.creatorId, name: g.name, description: g.description, privacy: g.privacy, member_ids: members.filter(m => m.groupId === g.id).map(m => m.profileId), created_at: g.createdAt.toISOString() })),
        events: events.map(e => ({ id: e.id, organizer_id: e.organizerId, title: e.title, details: e.details, location: e.location, starts_at: e.startsAt.toISOString(), attendee_ids: attendees.filter(a => a.eventId === e.id && a.status === "going").map(a => a.profileId), created_at: e.createdAt.toISOString() })),
        listings: listings.map(l => ({ id: l.id, seller_id: l.sellerId, title: l.title, description: l.description, price_cents: l.priceCents, category: l.category, item_condition: l.itemCondition, image_url: listingUrls.get(l.id) ?? null, status: l.status, created_at: l.createdAt.toISOString() })),
        notifications: notifications.map(n => ({ id: n.id, profile_id: n.profileId, actor_id: n.actorId, kind: n.kind, message: n.message, entity_type: n.entityType, entity_id: n.entityId, is_read: n.isRead, created_at: n.createdAt.toISOString() })),
      };
    },
  }),

  createProfile: defineAction({
    request: z.object({ name: z.string().trim().min(2).max(60), handle: z.string().trim().min(2).max(30), bio: z.string().trim().max(180).default(""), ...imageInput }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const handle = args.handle.toLowerCase().replace(/^@/, "").replace(/[^a-z0-9_.]/g, "");
      if (handle.length < 2) throw new Error("Choose a handle with at least two letters or numbers.");
      const avatarBlobKey = await saveImage(ctx, args.imageBase64, args.imageMime, "avatars");
      const result = await db.insert(schema.profiles).values({ name: args.name, handle, bio: args.bio, avatarBlobKey }).returning({ id: schema.profiles.id });
      ctx.invalidateQueries();
      return { id: result[0]!.id };
    },
  }),

  updateProfile: defineAction({
    request: z.object({ profileId: z.number().int().positive(), name: z.string().trim().min(2).max(60), bio: z.string().trim().max(180), ...imageInput }),
    response: z.object({ ok: z.boolean() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const current = await db.select().from(schema.profiles).where(eq(schema.profiles.id, args.profileId)).limit(1);
      if (!current[0]) return { ok: false };
      const avatarBlobKey = args.imageBase64 ? await saveImage(ctx, args.imageBase64, args.imageMime, "avatars") : current[0].avatarBlobKey;
      await db.update(schema.profiles).set({ name: args.name, bio: args.bio, avatarBlobKey }).where(eq(schema.profiles.id, args.profileId));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  createPost: defineAction({
    request: z.object({ profileId: z.number().int().positive(), caption: z.string().trim().max(1200).default(""), ...imageInput }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      if (!args.caption && !args.imageBase64) throw new Error("Add a photo or write a caption.");
      const db = ctx.db<typeof schema>();
      const imageBlobKey = await saveImage(ctx, args.imageBase64, args.imageMime, "posts");
      const result = await db.insert(schema.posts).values({ profileId: args.profileId, caption: args.caption, imageBlobKey }).returning({ id: schema.posts.id });
      ctx.invalidateQueries();
      return { id: result[0]!.id };
    },
  }),

  toggleLike: defineAction({
    request: z.object({ postId: z.number().int().positive(), profileId: z.number().int().positive() }),
    response: z.object({ liked: z.boolean() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const existing = await db.select().from(schema.postLikes).where(and(eq(schema.postLikes.postId, args.postId), eq(schema.postLikes.profileId, args.profileId))).limit(1);
      if (existing[0]) {
        await db.delete(schema.postLikes).where(and(eq(schema.postLikes.postId, args.postId), eq(schema.postLikes.profileId, args.profileId)));
        ctx.invalidateQueries();
        return { liked: false };
      }
      await db.insert(schema.postLikes).values({ postId: args.postId, profileId: args.profileId });
      const post = await db.select().from(schema.posts).where(eq(schema.posts.id, args.postId)).limit(1);
      if (post[0] && post[0].profileId !== args.profileId) {
        const name = await profileName(db, args.profileId);
        await notify(db, post[0].profileId, args.profileId, "like", `${name} liked your post`, "post", args.postId);
      }
      ctx.invalidateQueries();
      return { liked: true };
    },
  }),

  toggleFollow: defineAction({
    request: z.object({ followerId: z.number().int().positive(), followingId: z.number().int().positive() }),
    response: z.object({ following: z.boolean() }),
    async handler(ctx, args) {
      if (args.followerId === args.followingId) return { following: false };
      const db = ctx.db<typeof schema>();
      const where = and(eq(schema.follows.followerId, args.followerId), eq(schema.follows.followingId, args.followingId));
      const existing = await db.select().from(schema.follows).where(where).limit(1);
      if (existing[0]) {
        await db.delete(schema.follows).where(where);
        ctx.invalidateQueries();
        return { following: false };
      }
      await db.insert(schema.follows).values({ followerId: args.followerId, followingId: args.followingId });
      const name = await profileName(db, args.followerId);
      await notify(db, args.followingId, args.followerId, "follow", `${name} started following you`, "profile", args.followerId);
      ctx.invalidateQueries();
      return { following: true };
    },
  }),

  requestFriend: defineAction({
    request: z.object({ requesterId: z.number().int().positive(), addresseeId: z.number().int().positive() }),
    response: z.object({ ok: z.boolean() }),
    async handler(ctx, args) {
      if (args.requesterId === args.addresseeId) return { ok: false };
      const db = ctx.db<typeof schema>();
      const existing = await db.select().from(schema.friendships).where(or(
        and(eq(schema.friendships.requesterId, args.requesterId), eq(schema.friendships.addresseeId, args.addresseeId)),
        and(eq(schema.friendships.requesterId, args.addresseeId), eq(schema.friendships.addresseeId, args.requesterId)),
      )).limit(1);
      if (existing[0]) return { ok: true };
      await db.insert(schema.friendships).values({ requesterId: args.requesterId, addresseeId: args.addresseeId });
      const name = await profileName(db, args.requesterId);
      await notify(db, args.addresseeId, args.requesterId, "friend_request", `${name} sent you a friend request`, "profile", args.requesterId);
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  acceptFriend: defineAction({
    request: z.object({ friendshipId: z.number().int().positive(), profileId: z.number().int().positive() }),
    response: z.object({ ok: z.boolean() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const row = await db.select().from(schema.friendships).where(and(eq(schema.friendships.id, args.friendshipId), eq(schema.friendships.addresseeId, args.profileId))).limit(1);
      if (!row[0]) return { ok: false };
      await db.update(schema.friendships).set({ status: "accepted" }).where(eq(schema.friendships.id, args.friendshipId));
      const name = await profileName(db, args.profileId);
      await notify(db, row[0].requesterId, args.profileId, "friend_accept", `${name} accepted your friend request`, "profile", args.profileId);
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  createGroup: defineAction({
    request: z.object({ creatorId: z.number().int().positive(), name: z.string().trim().min(2).max(80), description: z.string().trim().max(300), privacy: z.enum(["public", "private"]) }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const result = await db.insert(schema.communityGroups).values(args).returning({ id: schema.communityGroups.id });
      await db.insert(schema.groupMembers).values({ groupId: result[0]!.id, profileId: args.creatorId, role: "admin" });
      ctx.invalidateQueries();
      return { id: result[0]!.id };
    },
  }),

  toggleGroupMembership: defineAction({
    request: z.object({ groupId: z.number().int().positive(), profileId: z.number().int().positive() }),
    response: z.object({ joined: z.boolean() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const where = and(eq(schema.groupMembers.groupId, args.groupId), eq(schema.groupMembers.profileId, args.profileId));
      const existing = await db.select().from(schema.groupMembers).where(where).limit(1);
      if (existing[0]) {
        if (existing[0].role === "admin") return { joined: true };
        await db.delete(schema.groupMembers).where(where);
        ctx.invalidateQueries();
        return { joined: false };
      }
      await db.insert(schema.groupMembers).values({ groupId: args.groupId, profileId: args.profileId });
      const group = await db.select().from(schema.communityGroups).where(eq(schema.communityGroups.id, args.groupId)).limit(1);
      if (group[0] && group[0].creatorId !== args.profileId) {
        const name = await profileName(db, args.profileId);
        await notify(db, group[0].creatorId, args.profileId, "group_join", `${name} joined ${group[0].name}`, "group", args.groupId);
      }
      ctx.invalidateQueries();
      return { joined: true };
    },
  }),

  createEvent: defineAction({
    request: z.object({ organizerId: z.number().int().positive(), title: z.string().trim().min(2).max(100), details: z.string().trim().max(500), location: z.string().trim().max(120), startsAt: z.string().datetime() }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const result = await db.insert(schema.events).values({ organizerId: args.organizerId, title: args.title, details: args.details, location: args.location, startsAt: new Date(args.startsAt) }).returning({ id: schema.events.id });
      await db.insert(schema.eventAttendees).values({ eventId: result[0]!.id, profileId: args.organizerId, status: "going" });
      ctx.invalidateQueries();
      return { id: result[0]!.id };
    },
  }),

  toggleRsvp: defineAction({
    request: z.object({ eventId: z.number().int().positive(), profileId: z.number().int().positive() }),
    response: z.object({ going: z.boolean() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const where = and(eq(schema.eventAttendees.eventId, args.eventId), eq(schema.eventAttendees.profileId, args.profileId));
      const existing = await db.select().from(schema.eventAttendees).where(where).limit(1);
      if (existing[0]) {
        await db.delete(schema.eventAttendees).where(where);
        ctx.invalidateQueries();
        return { going: false };
      }
      await db.insert(schema.eventAttendees).values({ eventId: args.eventId, profileId: args.profileId });
      const event = await db.select().from(schema.events).where(eq(schema.events.id, args.eventId)).limit(1);
      if (event[0] && event[0].organizerId !== args.profileId) {
        const name = await profileName(db, args.profileId);
        await notify(db, event[0].organizerId, args.profileId, "rsvp", `${name} is going to ${event[0].title}`, "event", args.eventId);
      }
      ctx.invalidateQueries();
      return { going: true };
    },
  }),

  createListing: defineAction({
    request: z.object({ sellerId: z.number().int().positive(), title: z.string().trim().min(2).max(100), description: z.string().trim().max(500), priceCents: z.number().int().min(0).max(100_000_000), category: z.string().trim().min(2).max(40), itemCondition: z.enum(["New", "Like new", "Good", "Fair"]), ...imageInput }),
    response: z.object({ id: z.number() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const imageBlobKey = await saveImage(ctx, args.imageBase64, args.imageMime, "listings");
      const result = await db.insert(schema.listings).values({ sellerId: args.sellerId, title: args.title, description: args.description, priceCents: args.priceCents, category: args.category, itemCondition: args.itemCondition, imageBlobKey }).returning({ id: schema.listings.id });
      ctx.invalidateQueries();
      return { id: result[0]!.id };
    },
  }),

  markListingSold: defineAction({
    request: z.object({ listingId: z.number().int().positive(), sellerId: z.number().int().positive() }),
    response: z.object({ ok: z.boolean() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      await db.update(schema.listings).set({ status: "sold" }).where(and(eq(schema.listings.id, args.listingId), eq(schema.listings.sellerId, args.sellerId)));
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),

  markNotificationsRead: defineAction({
    request: z.object({ profileId: z.number().int().positive(), notificationId: z.number().int().positive().optional() }),
    response: z.object({ ok: z.boolean() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const where = args.notificationId
        ? and(eq(schema.notifications.profileId, args.profileId), eq(schema.notifications.id, args.notificationId))
        : eq(schema.notifications.profileId, args.profileId);
      await db.update(schema.notifications).set({ isRead: true }).where(where);
      ctx.invalidateQueries();
      return { ok: true };
    },
  }),
} satisfies ActionsModule;
