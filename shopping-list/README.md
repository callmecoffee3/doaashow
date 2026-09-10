# Shopping List

A basic, generic shopping list app. Add items, check them off as you shop, and delete or clear finished items. The list persists between visits.

## Features

- Quick item entry
- One-tap check off / uncheck
- Delete individual items
- Clear all checked items
- Live counts: items left vs. picked up
- Dark, touch-first grocery-note design

## Stack

- React 19 + TypeScript + Tailwind CSS (client)
- Bun server actions + Drizzle ORM (SQLite) for persistence
- React Query for data sync

## Run it

```bash
bun install
bun run build
```

## Layout

- `client/` — React front end (`src/App.tsx` is the whole UI)
- `server/src/` — server actions (`actions.ts`) and DB schema (`schema.ts`)
- `drizzle/` — SQLite migrations
