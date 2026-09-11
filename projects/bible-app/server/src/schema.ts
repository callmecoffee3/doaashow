import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const chapterCache = sqliteTable("chapter_cache", {
  cacheKey: text("cache_key").primaryKey(),
  translationId: text("translation_id").notNull(),
  translationName: text("translation_name").notNull(),
  bookId: text("book_id").notNull(),
  bookName: text("book_name").notNull(),
  chapter: integer("chapter").notNull(),
  versesJson: text("verses_json").notNull(),
  fetchedAt: integer("fetched_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const bookmarks = sqliteTable(
  "bookmarks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    translationId: text("translation_id").notNull(),
    bookId: text("book_id").notNull(),
    bookName: text("book_name").notNull(),
    chapter: integer("chapter").notNull(),
    verse: integer("verse").notNull(),
    verseText: text("verse_text").notNull(),
    note: text("note"),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("bookmarks_reference_idx").on(
      table.translationId,
      table.bookId,
      table.chapter,
      table.verse,
    ),
  ],
);
