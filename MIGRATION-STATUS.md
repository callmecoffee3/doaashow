# Migration Status

## New Clean Structure (Aug 2026)

- [x] Created numbered top-level folders:
  - `01-core/` (desktop, os-shell, cloudos)
  - `02-the-fam/` (terminal, bat, feed, messenger, profiles)
  - `03-production/` (story-tools, shows, characters, scenes, pre-production)
  - `04-apps/` (folder-scanner, shopping, games, mall-stores, utilities)
  - `05-assets/` (images, audio, video, icons)
  - `06-legacy/` (old-html, old-bat, archives)
  - `docs/`
- [x] New comprehensive README.md
- [x] README.md files in every new folder
- [x] Started copying key files:
  - `DesktopContext.tsx` → `01-core/desktop/`

## Existing structure (kept for compatibility)
- `01-Production/`, `02-Systems/`, `03-Assets/`, `04-Legacy/`, `05-Trash/`
- `FOLDER-NUMBERS/`, `Production/`, `Systems/`, `Assets/`, `Legacy/`, `Trash/`

## Next steps
- [ ] Continue copying important files into the new folders
- [ ] Stage remaining root clutter into `06-legacy/` or Trash
- [ ] Build a clean main desktop entry point in `01-core/desktop/`
- [ ] Update FOLDER-NUMBERS docs to match the new layout

## Rules
1. New work → `01-core/`, `02-the-fam/`, `03-production/`, `04-apps/`, `05-assets/`
2. Soft-delete → `Trash/` or `05-Trash/` (never hard-delete first)
3. Historical dumps → `06-legacy/`
4. Root originals stay until explicitly moved/deleted

*The personal dump is history. The new numbered folders are the future.*
