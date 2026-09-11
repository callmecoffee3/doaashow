import { defineAction, z, type ActionsModule } from "@hatch/space-sdk";
import { and, desc, eq } from "drizzle-orm";
import * as schema from "./schema";

const SOURCE = "https://bible-api.com";
const TRANSLATION_ID = "web";

const verseSchema = z.object({
  book_id: z.string(),
  book: z.string(),
  chapter: z.number().int(),
  verse: z.number().int(),
  text: z.string(),
});

const translationSchema = z.object({
  identifier: z.string(),
  name: z.string(),
  language: z.string(),
  language_code: z.string(),
  license: z.string(),
});

const chapterPayloadSchema = z.object({
  translation: translationSchema,
  verses: z.array(verseSchema),
});

const chapterResponseSchema = z.object({
  ok: z.boolean(),
  translation: z.object({ id: z.string(), name: z.string(), license: z.string() }).nullable(),
  book_id: z.string(),
  book_name: z.string(),
  chapter: z.number().int(),
  verses: z.array(z.object({ verse: z.number().int(), text: z.string() })),
  cached: z.boolean(),
  error: z.string().nullable(),
});

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

async function fetchJson(url: string) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(9000),
  });
  if (!response.ok) throw new Error(`Source returned ${response.status}`);
  return response.json();
}

async function loadChapterPayload(bookId: string, chapter: number) {
  const raw = await fetchJson(`${SOURCE}/data/${TRANSLATION_ID}/${bookId}/${chapter}`);
  const parsed = chapterPayloadSchema.parse(raw);
  const first = parsed.verses[0];
  if (!first) throw new Error("No verses returned");
  return {
    parsed,
    first,
    verses: parsed.verses.map((v) => ({ verse: v.verse, text: cleanText(v.text) })),
  };
}

export const Actions = {
  listBooks: defineAction({
    request: z.object({}),
    response: z.object({
      ok: z.boolean(),
      translation: z.object({ id: z.string(), name: z.string(), license: z.string() }).nullable(),
      books: z.array(z.object({ id: z.string(), name: z.string() })),
      error: z.string().nullable(),
    }),
    async handler() {
      try {
        const raw = await fetchJson(`${SOURCE}/data/${TRANSLATION_ID}`);
        const parsed = z.object({
          translation: translationSchema,
          books: z.array(z.object({ id: z.string(), name: z.string(), url: z.string() })),
        }).parse(raw);
        return {
          ok: true,
          translation: {
            id: parsed.translation.identifier,
            name: parsed.translation.name,
            license: parsed.translation.license,
          },
          books: parsed.books.map(({ id, name }) => ({ id, name })),
          error: null,
        };
      } catch {
        return {
          ok: false,
          translation: null,
          books: [],
          error: "The book list could not be reached. Please try again.",
        };
      }
    },
  }),

  getBookChapters: defineAction({
    request: z.object({ book_id: z.string().regex(/^[0-9A-Z]{3}$/) }),
    response: z.object({
      ok: z.boolean(),
      book_id: z.string(),
      book_name: z.string(),
      chapters: z.array(z.number().int()),
      error: z.string().nullable(),
    }),
    async handler(_ctx, args) {
      try {
        const raw = await fetchJson(`${SOURCE}/data/${TRANSLATION_ID}/${args.book_id}`);
        const parsed = z.object({
          chapters: z.array(z.object({
            book_id: z.string(),
            book: z.string(),
            chapter: z.number().int(),
            url: z.string(),
          })),
        }).parse(raw);
        return {
          ok: true,
          book_id: args.book_id,
          book_name: parsed.chapters[0]?.book ?? args.book_id,
          chapters: parsed.chapters.map((item) => item.chapter),
          error: null,
        };
      } catch {
        return {
          ok: false,
          book_id: args.book_id,
          book_name: args.book_id,
          chapters: [],
          error: "Chapters could not be reached. Please try again.",
        };
      }
    },
  }),

  getChapter: defineAction({
    request: z.object({
      book_id: z.string().regex(/^[0-9A-Z]{3}$/),
      chapter: z.number().int().min(1).max(150),
      refresh: z.boolean().default(false),
    }),
    response: chapterResponseSchema,
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const cacheKey = `${TRANSLATION_ID}:${args.book_id}:${args.chapter}`;
      const cachedRows = await db
        .select()
        .from(schema.chapterCache)
        .where(eq(schema.chapterCache.cacheKey, cacheKey))
        .limit(1);
      const cached = cachedRows[0];
      if (cached && !args.refresh) {
        try {
          const verses = z.array(z.object({ verse: z.number().int(), text: z.string() })).parse(
            JSON.parse(cached.versesJson),
          );
          return {
            ok: true,
            translation: { id: cached.translationId, name: cached.translationName, license: "Public Domain" },
            book_id: cached.bookId,
            book_name: cached.bookName,
            chapter: cached.chapter,
            verses,
            cached: true,
            error: null,
          };
        } catch {
          // A malformed cache row should never block a fresh source request.
        }
      }
      try {
        const loaded = await loadChapterPayload(args.book_id, args.chapter);
        await db.insert(schema.chapterCache).values({
          cacheKey,
          translationId: loaded.parsed.translation.identifier,
          translationName: loaded.parsed.translation.name,
          bookId: args.book_id,
          bookName: loaded.first.book,
          chapter: args.chapter,
          versesJson: JSON.stringify(loaded.verses),
          fetchedAt: new Date(),
        }).onConflictDoUpdate({
          target: schema.chapterCache.cacheKey,
          set: {
            translationName: loaded.parsed.translation.name,
            bookName: loaded.first.book,
            versesJson: JSON.stringify(loaded.verses),
            fetchedAt: new Date(),
          },
        });
        return {
          ok: true,
          translation: {
            id: loaded.parsed.translation.identifier,
            name: loaded.parsed.translation.name,
            license: loaded.parsed.translation.license,
          },
          book_id: args.book_id,
          book_name: loaded.first.book,
          chapter: args.chapter,
          verses: loaded.verses,
          cached: false,
          error: null,
        };
      } catch {
        if (cached) {
          try {
            const verses = z.array(z.object({ verse: z.number().int(), text: z.string() })).parse(
              JSON.parse(cached.versesJson),
            );
            return {
              ok: true,
              translation: { id: cached.translationId, name: cached.translationName, license: "Public Domain" },
              book_id: cached.bookId,
              book_name: cached.bookName,
              chapter: cached.chapter,
              verses,
              cached: true,
              error: null,
            };
          } catch {
            // Fall through to the honest unavailable state.
          }
        }
        return {
          ok: false,
          translation: null,
          book_id: args.book_id,
          book_name: args.book_id,
          chapter: args.chapter,
          verses: [],
          cached: false,
          error: "This chapter is unavailable right now. Please try again.",
        };
      }
    },
  }),

  warmDefaultChapter: defineAction({
    request: z.object({}),
    response: z.object({ ok: z.boolean() }),
    async handler(ctx) {
      try {
        const loaded = await loadChapterPayload("JHN", 3);
        const db = ctx.db<typeof schema>();
        const cacheKey = "web:JHN:3";
        await db.insert(schema.chapterCache).values({
          cacheKey,
          translationId: loaded.parsed.translation.identifier,
          translationName: loaded.parsed.translation.name,
          bookId: "JHN",
          bookName: loaded.first.book,
          chapter: 3,
          versesJson: JSON.stringify(loaded.verses),
          fetchedAt: new Date(),
        }).onConflictDoUpdate({
          target: schema.chapterCache.cacheKey,
          set: {
            translationName: loaded.parsed.translation.name,
            bookName: loaded.first.book,
            versesJson: JSON.stringify(loaded.verses),
            fetchedAt: new Date(),
          },
        });
        return { ok: true };
      } catch {
        return { ok: false };
      }
    },
  }),

  listBookmarks: defineAction({
    request: z.object({}),
    response: z.object({
      bookmarks: z.array(z.object({
        id: z.number(),
        translation_id: z.string(),
        book_id: z.string(),
        book_name: z.string(),
        chapter: z.number().int(),
        verse: z.number().int(),
        verse_text: z.string(),
        note: z.string().nullable(),
        updated_at: z.string(),
      })),
    }),
    async handler(ctx) {
      const db = ctx.db<typeof schema>();
      const rows = await db.select().from(schema.bookmarks).orderBy(desc(schema.bookmarks.updatedAt));
      return {
        bookmarks: rows.map((row) => ({
          id: row.id,
          translation_id: row.translationId,
          book_id: row.bookId,
          book_name: row.bookName,
          chapter: row.chapter,
          verse: row.verse,
          verse_text: row.verseText,
          note: row.note,
          updated_at: row.updatedAt.toISOString(),
        })),
      };
    },
  }),

  toggleBookmark: defineAction({
    request: z.object({
      translation_id: z.string().min(1).max(20),
      book_id: z.string().regex(/^[0-9A-Z]{3}$/),
      book_name: z.string().min(1).max(80),
      chapter: z.number().int().min(1).max(150),
      verse: z.number().int().min(1).max(200),
      verse_text: z.string().min(1).max(4000),
    }),
    response: z.object({ bookmarked: z.boolean(), id: z.number().nullable() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const where = and(
        eq(schema.bookmarks.translationId, args.translation_id),
        eq(schema.bookmarks.bookId, args.book_id),
        eq(schema.bookmarks.chapter, args.chapter),
        eq(schema.bookmarks.verse, args.verse),
      );
      const existing = await db.select({ id: schema.bookmarks.id }).from(schema.bookmarks).where(where).limit(1);
      if (existing[0]) {
        await db.delete(schema.bookmarks).where(eq(schema.bookmarks.id, existing[0].id));
        ctx.invalidateQueries();
        return { bookmarked: false, id: null };
      }
      const inserted = await db.insert(schema.bookmarks).values({
        translationId: args.translation_id,
        bookId: args.book_id,
        bookName: args.book_name,
        chapter: args.chapter,
        verse: args.verse,
        verseText: cleanText(args.verse_text),
      }).returning({ id: schema.bookmarks.id });
      ctx.invalidateQueries();
      return { bookmarked: true, id: inserted[0]?.id ?? null };
    },
  }),

  updateBookmarkNote: defineAction({
    request: z.object({ id: z.number().int().positive(), note: z.string().max(2000) }),
    response: z.object({ ok: z.boolean() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const updated = await db.update(schema.bookmarks).set({
        note: args.note.trim() || null,
        updatedAt: new Date(),
      }).where(eq(schema.bookmarks.id, args.id)).returning({ id: schema.bookmarks.id });
      ctx.invalidateQueries();
      return { ok: updated.length > 0 };
    },
  }),

  deleteBookmark: defineAction({
    request: z.object({ id: z.number().int().positive() }),
    response: z.object({ ok: z.boolean() }),
    async handler(ctx, args) {
      const db = ctx.db<typeof schema>();
      const deleted = await db.delete(schema.bookmarks).where(eq(schema.bookmarks.id, args.id)).returning({ id: schema.bookmarks.id });
      ctx.invalidateQueries();
      return { ok: deleted.length > 0 };
    },
  }),
} satisfies ActionsModule;
