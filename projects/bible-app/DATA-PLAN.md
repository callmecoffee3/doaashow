# Data Plan

## Context provenance
- `make a bible app` (verbatim user request; supports a focused scripture-reading experience rather than a commentary or social product).
- No other external user context applied.

## Tested sources
### bible-api.com
**Used by**: `listBooks`, `getBookChapters`, `getChapter`, and `warmDefaultChapter` server actions.
**Test command**: `browser_open https://bible-api.com/`
**Sample output**: Documentation identifies the User Input API and parameterized API, says the default is World English Bible, and reports the service rate limit as 15 requests per 30 seconds. It lists `/data/web` for books, `/data/web/JHN` for John chapters, and `/data/web/JHN/3` for John 3.
**Test command**: `browser_open https://bible-api.com/data/web`
**Sample output**: `{translation:{identifier:"web",name:"World English Bible",license:"Public Domain"},books:[{id:"GEN",name:"Genesis"},...,{id:"REV",name:"Revelation"}]}`
**Test command**: `browser_open https://bible-api.com/data/web/JHN`
**Sample output**: John chapters 1 through 21 with book id `JHN`.
**Test command**: `browser_open https://bible-api.com/data/web/JHN/3`
**Sample output**: World English Bible John 3 with 36 verse records; verse 16 begins `For God so loved the world...`.
**Processing**: Fetch only the requested translation/book/chapter through the server action; validate book id and chapter as narrow alphanumeric/integer inputs; normalize whitespace; cache successful chapter JSON in the artifact database; show an honest retry state when source and cache are both unavailable. Expose the exact verified source home URL `https://bible-api.com/` in attribution.

## Long-term data behavior
- **Refresh policy**: Books and chapters are stable reference data. Read from the local chapter cache first, with a manual retry/fetch path when absent; no timer, cron, or background refresh.
- **Growth**: The chapter cache grows only as chapters are opened. User bookmarks and verse notes grow only through explicit user actions.
- **Ordering**: Books preserve API canonical order; chapters and verses sort numerically; bookmarks sort by most recently updated.
- **Time semantics**: Bookmark/note creation and update timestamps are storage instants and render in viewer-local time only when useful.

## Imagery
- Imagery not needed: this is a text-first scripture reader whose primary visual subject is the typography itself; the shell-provided open-book icon supplies identity without competing with reading.

## Rejected approaches
- **Tried**: jsDelivr-hosted `wldeh/bible-api` chapter JSON for John 3 and Psalm 23 via Python `urllib`.
  **Why rejected**: Both real requests timed out after 15 seconds. bible-api.com returned useful metadata and full chapter JSON in subsequent browser probes.
- **Tried**: Shipping a large bundled or invented scripture dataset.
  **Why rejected**: The source-backed API already returns public-domain text; bundling would add unnecessary bulk, while invented or truncated text would be inappropriate and ungrounded.
