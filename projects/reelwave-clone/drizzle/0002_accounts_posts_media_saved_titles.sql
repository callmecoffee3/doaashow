CREATE TABLE profiles (
  viewer_id TEXT PRIMARY KEY NOT NULL,
  display_name TEXT NOT NULL,
  avatar_seed TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE community_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  topic TEXT NOT NULL,
  body TEXT NOT NULL,
  media_blob_key TEXT,
  media_type TEXT,
  media_name TEXT,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX community_posts_created_at_idx ON community_posts(created_at);
--> statement-breakpoint
CREATE TABLE media_uploads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  viewer_id TEXT NOT NULL,
  blob_key TEXT NOT NULL,
  media_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  byte_size INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX media_uploads_blob_key_idx ON media_uploads(blob_key);
--> statement-breakpoint
CREATE TABLE saved_titles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  viewer_id TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX saved_titles_viewer_title_idx ON saved_titles(viewer_id, title);
