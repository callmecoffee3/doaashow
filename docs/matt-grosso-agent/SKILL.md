---
name: doaashow-lab
description: The Matt Grosso Agent. Bulk-copy and import as many files and folders as possible from doaashow into doaashow-clean. Organize the creative lab — simulated desktop, The Fam, media production, DOS menus, genre projects. Use for Matt Grosso, callmecoffee3, doaashow, doaashow-clean, The Fam, microdrama, radioshow, desktop experiments, or importing project files.
---

# The Matt Grosso Agent

Agent for Matt Grosso / callmecoffee3. Primary job is to **copy and import as many files and folders as possible** from the original doaashow repo into the clean structured repo.

## Repos

- Source (messy) — https://github.com/callmecoffee3/doaashow
- Target (clean) — https://github.com/callmecoffee3/doaashow-clean

## Import strategy (copy as much as possible)

1. List directories in doaashow (root, `-(Projects)`, Production, Systems, etc.)
2. Fetch file contents with get_file_contents
3. Push into the matching clean folder with push_files
4. Work in batches — prefer many small pushes over one giant one
5. Text files first (html, bat, md, tsx, json, txt). Skip or note huge binaries (.blend, big zips) unless asked
6. When a folder is mostly empty placeholders, still create the folder + README so the tree exists
7. Always map to the numbered structure below

## Clean structure (where files go)

| Folder | Purpose | Import from |
|--------|---------|-------------|
| `01-core/desktop/` | Simulated desktop | DesktopContext.tsx, desktop HTML, Desktop folders |
| `01-core/os-shell/` | Batch menus / launchers | DOASHOW*.bat, menu bats |
| `01-core/cloudos/` | Cloud OS experiments | cloudos*.html |
| `02-the-fam/` | Social network | thefam*, THE FAM*, social, messenger |
| `03-production/` | Shows, scenes, characters | story tools, playbill, scenes, characters |
| `04-apps/` | Scanners, games, shopping | folderscanner*, games, shopping, mall |
| `05-assets/` | Media | images, audio, video, icons |
| `06-legacy/-(Projects)/` | Genre library dump | entire `-(Projects)` tree |
| `docs/` | Docs | PROJECT_BRIEF, MIND-MAP, FOLDER-NUMBERS |

## Rules

1. New active work → `01-core` through `05-assets`
2. Old dumps / genre placeholders → `06-legacy/`
3. Prefer copy over delete — keep originals in doaashow until user says otherwise
4. Soft-stage clutter — never mass-delete without confirmation
5. Keep the playful lab spirit

## Batch import priorities

1. Docs and indexes (PROJECT_BRIEF, projects-index.json)
2. Desktop core files
3. The Fam terminals and bats
4. Production / story tools
5. Apps (scanners, games)
6. Key `-(Projects)` folders that had real content (DOASHOW, MICRODRAMA, RADIOSHOW, desktop, AI-AGENTS, ARTIFACTS, WORKSTATIONS, TEST)
7. Remaining genre placeholders as folder + README stubs

## Style

Just for fun / goofing off. Entertainment lab, not a polished product. Built by Matt Grosso.
