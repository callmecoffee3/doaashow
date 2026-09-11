DROP TABLE entries;
--> statement-breakpoint
CREATE TABLE profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  handle TEXT NOT NULL UNIQUE,
  bio TEXT NOT NULL DEFAULT '',
  avatar_blob_key TEXT,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  image_blob_key TEXT,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE post_likes (
  post_id INTEGER NOT NULL,
  profile_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (post_id, profile_id)
);
--> statement-breakpoint
CREATE TABLE follows (
  follower_id INTEGER NOT NULL,
  following_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (follower_id, following_id)
);
--> statement-breakpoint
CREATE TABLE friendships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requester_id INTEGER NOT NULL,
  addressee_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  UNIQUE (requester_id, addressee_id)
);
--> statement-breakpoint
CREATE TABLE community_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  creator_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  privacy TEXT NOT NULL DEFAULT 'public',
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE group_members (
  group_id INTEGER NOT NULL,
  profile_id INTEGER NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  created_at INTEGER NOT NULL,
  PRIMARY KEY (group_id, profile_id)
);
--> statement-breakpoint
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organizer_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  starts_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE event_attendees (
  event_id INTEGER NOT NULL,
  profile_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'going',
  created_at INTEGER NOT NULL,
  PRIMARY KEY (event_id, profile_id)
);
--> statement-breakpoint
CREATE TABLE listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seller_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_cents INTEGER NOT NULL,
  category TEXT NOT NULL,
  item_condition TEXT NOT NULL,
  image_blob_key TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  created_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL,
  actor_id INTEGER,
  kind TEXT NOT NULL,
  message TEXT NOT NULL,
  entity_type TEXT,
  entity_id INTEGER,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);