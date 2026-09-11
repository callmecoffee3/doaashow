import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SafeAreaTopScrim } from "@hatch/space-sdk/client";
import { api, type ApiResponse } from "./api";

type Bookmark = ApiResponse<typeof api, "listBookmarks">["bookmarks"][number];
type Book = ApiResponse<typeof api, "listBooks">["books"][number];

type View = "reader" | "saved";
type TestamentFilter = "all" | "old" | "new";

type ReadingPlace = { bookId: string; bookName: string; chapter: number };

const SOURCE_URL = "https://bible-api.com/";

function readStartingPlace(): ReadingPlace {
  try {
    const saved = localStorage.getItem("bible-reading-place");
    if (saved) {
      const value = JSON.parse(saved) as ReadingPlace;
      if (/^[0-9A-Z]{3}$/.test(value.bookId) && value.chapter > 0) return value;
    }
  } catch {
    // Use the grounded default chapter.
  }
  return { bookId: "JHN", bookName: "John", chapter: 3 };
}

function IconBookmark({ filled = false }: { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path d="M6.8 4.2A2.2 2.2 0 0 1 9 2h6a2.2 2.2 0 0 1 2.2 2.2v17L12 17.8l-5.2 3.4v-17Z" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path d="M4 5.2c2.9-.5 5.6.2 8 2.1 2.4-1.9 5.1-2.6 8-2.1v13.3c-2.9-.5-5.6.2-8 2.1-2.4-1.9-5.1-2.6-8-2.1V5.2Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 7.3v13.1" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconChevron({ direction }: { direction: "left" | "right" | "down" }) {
  const path = direction === "left" ? "m14.5 5-7 7 7 7" : direction === "right" ? "m9.5 5 7 7-7 7" : "m5 9 7 7 7-7";
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="icon"><path d={path} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function NoteEditor({ bookmark }: { bookmark: Bookmark }) {
  const queryClient = useQueryClient();
  const [note, setNote] = useState(bookmark.note ?? "");
  useEffect(() => setNote(bookmark.note ?? ""), [bookmark.note]);
  const save = useMutation({
    mutationFn: () => api.updateBookmarkNote({ id: bookmark.id, note }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
  });
  const changed = note.trim() !== (bookmark.note ?? "").trim();
  return (
    <div className="note-editor">
      <label htmlFor={`note-${bookmark.id}`}>Personal note</label>
      <textarea id={`note-${bookmark.id}`} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Write what you want to remember…" rows={3} />
      <div className="note-actions">
        <span>{save.isSuccess && !changed ? "Saved" : `${note.length}/2000`}</span>
        <button className="small-action" onClick={() => save.mutate()} disabled={!changed || save.isPending}>{save.isPending ? "Saving…" : "Save note"}</button>
      </div>
    </div>
  );
}

function SavedView({ bookmarks, onOpen }: { bookmarks: Bookmark[]; onOpen: (item: Bookmark) => void }) {
  const queryClient = useQueryClient();
  const remove = useMutation({
    mutationFn: (id: number) => api.deleteBookmark({ id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
  });

  return (
    <section className="saved-view" aria-labelledby="saved-heading">
      <div className="saved-intro">
        <p className="section-number">Saved passages</p>
        <h1 id="saved-heading">Verses to carry with you.</h1>
        <p>{bookmarks.length ? `${bookmarks.length} ${bookmarks.length === 1 ? "verse" : "verses"} marked` : "Bookmark a verse while reading and it will appear here."}</p>
      </div>
      {bookmarks.length === 0 ? (
        <div className="empty-saved"><IconBookmark /><p>No saved verses yet.</p><span>Return to the reader and tap the ribbon beside any verse.</span></div>
      ) : (
        <div className="saved-list">
          {bookmarks.map((bookmark) => (
            <article key={bookmark.id} className="saved-item">
              <button className="saved-reference" onClick={() => onOpen(bookmark)}>{bookmark.book_name} {bookmark.chapter}:{bookmark.verse}<span>Open passage</span></button>
              <blockquote>“{bookmark.verse_text}”</blockquote>
              <NoteEditor bookmark={bookmark} />
              <button className="remove-link" onClick={() => remove.mutate(bookmark.id)} disabled={remove.isPending}>Remove bookmark</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function App() {
  const queryClient = useQueryClient();
  const [place, setPlace] = useState<ReadingPlace>(() => readStartingPlace());
  const [view, setView] = useState<View>("reader");
  const [showBooks, setShowBooks] = useState(false);
  const [bookFilter, setBookFilter] = useState("");
  const [testamentFilter, setTestamentFilter] = useState<TestamentFilter>("all");
  const [fontScale, setFontScale] = useState<"normal" | "large">(() => localStorage.getItem("bible-font-scale") === "large" ? "large" : "normal");

  useEffect(() => {
    localStorage.setItem("bible-reading-place", JSON.stringify(place));
  }, [place]);
  useEffect(() => {
    localStorage.setItem("bible-font-scale", fontScale);
  }, [fontScale]);

  const booksQuery = useQuery({ queryKey: ["bible-books"], queryFn: () => api.listBooks({}), staleTime: 1000 * 60 * 60 });
  const chaptersQuery = useQuery({
    queryKey: ["book-chapters", place.bookId],
    queryFn: () => api.getBookChapters({ book_id: place.bookId }),
    staleTime: 1000 * 60 * 60,
  });
  const chapterQuery = useQuery({
    queryKey: ["chapter", place.bookId, place.chapter],
    queryFn: () => api.getChapter({ book_id: place.bookId, chapter: place.chapter, refresh: false }),
  });
  const bookmarksQuery = useQuery({ queryKey: ["bookmarks"], queryFn: () => api.listBookmarks({}) });

  const bookmarks = bookmarksQuery.data?.bookmarks ?? [];
  const bookmarkRefs = useMemo(() => new Set(bookmarks.map((item) => `${item.book_id}:${item.chapter}:${item.verse}`)), [bookmarks]);

  const toggleBookmark = useMutation({
    mutationFn: (verse: { verse: number; text: string }) => api.toggleBookmark({
      translation_id: chapterQuery.data?.translation?.id ?? "web",
      book_id: place.bookId,
      book_name: chapterQuery.data?.book_name ?? place.bookName,
      chapter: place.chapter,
      verse: verse.verse,
      verse_text: verse.text,
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookmarks"] }),
  });

  const books = booksQuery.data?.books ?? [];
  const filteredBooks = books
    .map((book, index) => ({ book, testament: index < 39 ? "old" as const : "new" as const }))
    .filter(({ book, testament }) => (
      (testamentFilter === "all" || testamentFilter === testament)
      && book.name.toLowerCase().includes(bookFilter.trim().toLowerCase())
    ));
  const chapterCount = chaptersQuery.data?.chapters.length ?? 0;

  function openPlace(next: ReadingPlace) {
    setPlace(next);
    setView("reader");
    setShowBooks(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseBook(book: Book) {
    openPlace({ bookId: book.id, bookName: book.name, chapter: 1 });
  }

  function retryChapter() {
    queryClient.fetchQuery({
      queryKey: ["chapter", place.bookId, place.chapter],
      queryFn: () => api.getChapter({ book_id: place.bookId, chapter: place.chapter, refresh: true }),
    });
  }

  const chapterData = chapterQuery.data;
  const currentName = chapterData?.book_name || place.bookName;

  return (
    <div className="app-shell">
      <SafeAreaTopScrim backgroundColor="var(--bg)" />
      <main className="content-frame">
        {view === "reader" ? (
          <>
            <section className="reader-toolbar" aria-label="Passage controls">
              <button className="book-select" onClick={() => setShowBooks(true)} aria-haspopup="dialog">
                <span>{currentName}</span><IconChevron direction="down" />
              </button>
              <label className="chapter-select-label" htmlFor="chapter-select">Chapter</label>
              <select id="chapter-select" className="chapter-select" value={place.chapter} onChange={(event) => setPlace((current) => ({ ...current, chapter: Number(event.target.value) }))} disabled={!chapterCount}>
                {(chaptersQuery.data?.chapters ?? [place.chapter]).map((chapter) => <option key={chapter} value={chapter}>{chapter}</option>)}
              </select>
              <button className="text-size" onClick={() => setFontScale((size) => size === "normal" ? "large" : "normal")} aria-label={`Use ${fontScale === "normal" ? "larger" : "regular"} scripture text`}>Aa</button>
            </section>

            <header className="passage-header">
              <p>{chapterData?.translation?.name ?? "World English Bible"}</p>
              <h1>{currentName} <span>{place.chapter}</span></h1>
              <div className="rule" />
            </header>

            {chapterQuery.isPending ? (
              <div className="reading-state" role="status"><span className="loading-mark" /> <p>Opening the chapter…</p></div>
            ) : !chapterData?.ok ? (
              <div className="reading-state error-state">
                <h2>We couldn’t open this chapter.</h2>
                <p>{chapterData?.error ?? "Please check your connection and try again."}</p>
                <button className="primary-action" onClick={retryChapter}>Try again</button>
              </div>
            ) : (
              <article className={`scripture ${fontScale === "large" ? "scripture-large" : ""}`} aria-label={`${currentName} chapter ${place.chapter}`}>
                {chapterData.verses.map((verse, index) => {
                  const key = `${place.bookId}:${place.chapter}:${verse.verse}`;
                  const marked = bookmarkRefs.has(key);
                  return (
                    <div className={`verse ${marked ? "verse-marked" : ""}`} key={verse.verse} id={`verse-${verse.verse}`}>
                      <p><sup>{verse.verse}</sup><span className={index === 0 ? "opening-verse" : ""}>{verse.text}</span></p>
                      <button className="bookmark-button" aria-label={`${marked ? "Remove bookmark from" : "Bookmark"} ${currentName} ${place.chapter}:${verse.verse}`} onClick={() => toggleBookmark.mutate(verse)} disabled={toggleBookmark.isPending}><IconBookmark filled={marked} /></button>
                    </div>
                  );
                })}
              </article>
            )}

            <nav className="chapter-nav" aria-label="Chapter navigation">
              <button onClick={() => setPlace((current) => ({ ...current, chapter: current.chapter - 1 }))} disabled={place.chapter <= 1}><IconChevron direction="left" /><span>Previous</span></button>
              <span>{place.chapter}{chapterCount ? ` of ${chapterCount}` : ""}</span>
              <button onClick={() => setPlace((current) => ({ ...current, chapter: current.chapter + 1 }))} disabled={!chapterCount || place.chapter >= chapterCount}><span>Next</span><IconChevron direction="right" /></button>
            </nav>

            <p className="source-note">Scripture: {chapterData?.translation?.name ?? "World English Bible"} · {chapterData?.translation?.license ?? "Public Domain"} · <a href={SOURCE_URL} target="_blank" rel="noreferrer">Source</a></p>
          </>
        ) : (
          <SavedView bookmarks={bookmarks} onOpen={(bookmark) => openPlace({ bookId: bookmark.book_id, bookName: bookmark.book_name, chapter: bookmark.chapter })} />
        )}
      </main>

      <nav className="bottom-nav" aria-label="Main navigation">
        <button className={view === "reader" ? "active" : ""} onClick={() => setView("reader")}><IconBook /><span>Read</span></button>
        <button className={view === "saved" ? "active" : ""} onClick={() => setView("saved")}><span className="nav-icon-wrap"><IconBookmark filled={view === "saved"} />{bookmarks.length > 0 && <b>{bookmarks.length}</b>}</span><span>Saved</span></button>
      </nav>

      {showBooks && (
        <div className="sheet-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowBooks(false); }}>
          <section className="book-sheet" role="dialog" aria-modal="true" aria-labelledby="books-heading">
            <div className="sheet-handle" />
            <div className="sheet-heading"><div><p>Choose a book</p><h2 id="books-heading">The library</h2></div><button onClick={() => setShowBooks(false)} aria-label="Close book chooser">Close</button></div>
            <div className="testament-tabs" role="group" aria-label="Filter books by testament">
              <button className={testamentFilter === "all" ? "active" : ""} onClick={() => setTestamentFilter("all")} aria-pressed={testamentFilter === "all"}>All 66</button>
              <button className={testamentFilter === "old" ? "active" : ""} onClick={() => setTestamentFilter("old")} aria-pressed={testamentFilter === "old"}>Old Testament <span>39</span></button>
              <button className={testamentFilter === "new" ? "active" : ""} onClick={() => setTestamentFilter("new")} aria-pressed={testamentFilter === "new"}>New Testament <span>27</span></button>
            </div>
            <label htmlFor="book-filter" className="sr-only">Find a book</label>
            <input id="book-filter" className="book-filter" value={bookFilter} onChange={(event) => setBookFilter(event.target.value)} placeholder={`Find a book in the ${testamentFilter === "old" ? "Old Testament" : testamentFilter === "new" ? "New Testament" : "Bible"}`} />
            {booksQuery.isPending ? <p className="sheet-status">Loading books…</p> : !booksQuery.data?.ok ? (
              <div className="sheet-status"><p>{booksQuery.data?.error}</p><button className="small-action" onClick={() => booksQuery.refetch()}>Try again</button></div>
            ) : (
              <div className="book-list">
                {filteredBooks.map(({ book, testament }, index) => {
                  const previous = filteredBooks[index - 1];
                  const showLabel = index === 0 || previous?.testament !== testament;
                  return <div key={book.id} className="book-row-wrap">{showLabel && <span className="testament-label">{testament === "old" ? "Old Testament · 39 books" : "New Testament · 27 books"}</span>}<button className={book.id === place.bookId ? "current" : ""} onClick={() => chooseBook(book)}><span>{book.name}</span>{book.id === place.bookId && <small>Reading</small>}<IconChevron direction="right" /></button></div>;
                })}
                {filteredBooks.length === 0 && <p className="sheet-status">No book matches “{bookFilter}” in this testament.</p>}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
