# ReelWave Clone (fullstack)

The full ReelWave streaming app: Movies, TV Shows, Music, Theater, Podcast, Trailers, Community, Guide, and Radio pages, each with genre filters (React client + TypeScript server + SQLite via Drizzle).

## Key files

- `client/src/App.tsx` — app shell
- `client/src/channels.ts` — channel catalog
- `client/src/assets/` — media assets and thumbnails
- `server/src/actions.ts`, `server/src/schema.ts` — backend logic and data model
- `drizzle/` — database migrations
- `package.json`, `space.json` — project config

Note: `cold-case-capital-full-narrated.mp4` (~48 MB) is excluded from this copy to stay under the 25 MB per-file GitHub rule.
