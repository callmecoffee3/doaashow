import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const profiles = sqliteTable("profiles", {
  viewerId: text("viewer_id").primaryKey(),
  displayName: text("display_name").notNull(),
  avatarSeed: text("avatar_seed").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
});

export const communityPosts = sqliteTable("community_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  authorId: text("author_id").notNull(),
  authorName: text("author_name").notNull(),
  topic: text("topic").notNull(),
  body: text("body").notNull(),
  mediaBlobKey: text("media_blob_key"),
  mediaType: text("media_type"),
  mediaName: text("media_name"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
}, (table) => [index("community_posts_created_at_idx").on(table.createdAt)]);

export const mediaUploads = sqliteTable("media_uploads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  viewerId: text("viewer_id").notNull(),
  blobKey: text("blob_key").notNull(),
  mediaType: text("media_type").notNull(),
  fileName: text("file_name").notNull(),
  byteSize: integer("byte_size").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
}, (table) => [uniqueIndex("media_uploads_blob_key_idx").on(table.blobKey)]);

export const savedTitles = sqliteTable("saved_titles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  viewerId: text("viewer_id").notNull(),
  title: text("title").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull().$defaultFn(() => new Date()),
}, (table) => [uniqueIndex("saved_titles_viewer_title_idx").on(table.viewerId, table.title)]);
