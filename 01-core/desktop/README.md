# Desktop — Windows 98 Simulated Desktop

A Windows 98-style simulated desktop environment: teal wallpaper, classic gray windows, blue title bars, green Start button, taskbar, and clock. Built by **Matt Grosso** ([@callmecoffee3](https://github.com/callmecoffee3)).

**Live version:** https://muse.ai/s/desktop-html-prototype-bw6ehvxdmxlxap

> Thanks for checking out my stuff — you can go to github.com, username callmecoffee3 (doashow).

## What it includes

- **Searchable app launcher** — browse the full catalog of **171 apps** by category, or search by name. Start menu includes Quick Links for pinned, favorite, and recently used apps.
- **App Store** — browse, search, install, and manage apps, with an **Add to desktop** form so visitors can create their own custom apps.
- **Settings** — desktop color, style, icon size, clock, welcome-card controls, notification preferences, and appearance panels.
- **Sticky Notes** — popup note pad bar with four note colors; create, drag, layer, and delete notes.
- **Poster Board + User Feed** — post messages to a wall board and browse them in a main feed.
- **The Fam** — family/social feed with Poster Board posts included.
- **Social apps** — Group, Pages, Account.
- **Education apps** — Teacher (lesson plans) and Student (assignments, classes, due dates, study notes).
- **Live Share / Shared Desktop** — two-person peer-to-peer screen, audio, and camera sessions with connection codes, plus a multi-user sharing link section explaining Host/Viewer roles.
- **Media** — Windows Player, Podcast, Plays, Radio (16 stations), video generator.
- **Files** — upload, preview, edit, rename, and download files.

## Session behavior

The desktop is client-only: posts, notes, custom apps, and other entries last for the current page session and clear on refresh or close. The separate private Poster Board app has server-backed storage for saved posts.

## Key files (copied here)

- `DesktopContext.tsx` — Main React context for the desktop (windows, apps, theme, wallpaper, sticky notes, etc.)
- `ALL-APPS.md` — Full catalog of all 171 apps with IDs and categories.

Original still exists in the repo root. This is the new home for desktop-related work.
