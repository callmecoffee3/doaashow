CREATE TABLE chapter_cache (
  cache_key TEXT PRIMARY KEY NOT NULL,
  translation_id TEXT NOT NULL,
  translation_name TEXT NOT NULL,
  book_id TEXT NOT NULL,
  book_name TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verses_json TEXT NOT NULL,
  fetched_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE TABLE bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  translation_id TEXT NOT NULL,
  book_id TEXT NOT NULL,
  book_name TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  verse_text TEXT NOT NULL,
  note TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX bookmarks_reference_idx ON bookmarks (translation_id, book_id, chapter, verse);
