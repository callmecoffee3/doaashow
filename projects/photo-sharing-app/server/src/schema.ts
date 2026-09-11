import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const createdAt = () => integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date());

export const profiles = sqliteTable("profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  handle: text("handle").notNull().unique(),
  bio: text("bio").notNull().default(""),
  avatarBlobKey: text("avatar_blob_key"),
  createdAt: createdAt(),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  profileId: integer("profile_id").notNull(),
  caption: text("caption").notNull().default(""),
  imageBlobKey: text("image_blob_key"),
  createdAt: createdAt(),
});

export const postLikes = sqliteTable("post_likes", {
  postId: integer("post_id").notNull(),
  profileId: integer("profile_id").notNull(),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("post_like_unique").on(t.postId, t.profileId)]);

export const follows = sqliteTable("follows", {
  followerId: integer("follower_id").notNull(),
  followingId: integer("following_id").notNull(),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("follow_unique").on(t.followerId, t.followingId)]);

export const friendships = sqliteTable("friendships", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  requesterId: integer("requester_id").notNull(),
  addresseeId: integer("addressee_id").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("friendship_unique").on(t.requesterId, t.addresseeId)]);

export const communityGroups = sqliteTable("community_groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  creatorId: integer("creator_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  privacy: text("privacy").notNull().default("public"),
  createdAt: createdAt(),
});

export const groupMembers = sqliteTable("group_members", {
  groupId: integer("group_id").notNull(),
  profileId: integer("profile_id").notNull(),
  role: text("role").notNull().default("member"),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("group_member_unique").on(t.groupId, t.profileId)]);

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  organizerId: integer("organizer_id").notNull(),
  title: text("title").notNull(),
  details: text("details").notNull().default(""),
  location: text("location").notNull().default(""),
  startsAt: integer("starts_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: createdAt(),
});

export const eventAttendees = sqliteTable("event_attendees", {
  eventId: integer("event_id").notNull(),
  profileId: integer("profile_id").notNull(),
  status: text("status").notNull().default("going"),
  createdAt: createdAt(),
}, (t) => [uniqueIndex("event_attendee_unique").on(t.eventId, t.profileId)]);

export const listings = sqliteTable("listings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sellerId: integer("seller_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  priceCents: integer("price_cents").notNull(),
  category: text("category").notNull(),
  itemCondition: text("item_condition").notNull(),
  imageBlobKey: text("image_blob_key"),
  status: text("status").notNull().default("available"),
  createdAt: createdAt(),
});

export const notifications = sqliteTable("notifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  profileId: integer("profile_id").notNull(),
  actorId: integer("actor_id"),
  kind: text("kind").notNull(),
  message: text("message").notNull(),
  entityType: text("entity_type"),
  entityId: integer("entity_id"),
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  createdAt: createdAt(),
});