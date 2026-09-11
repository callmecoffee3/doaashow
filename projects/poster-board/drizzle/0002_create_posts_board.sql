DROP TABLE entries;
--> statement-breakpoint
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  body TEXT NOT NULL,
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'private')),
  author_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE INDEX posts_visibility_created_idx ON posts (visibility, created_at DESC);
--> statement-breakpoint
CREATE INDEX posts_author_created_idx ON posts (author_id, created_at DESC);
