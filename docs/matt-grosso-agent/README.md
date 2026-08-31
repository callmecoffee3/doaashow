# The Matt Grosso Agent

Agent for **Matt Grosso** / [@callmecoffee3](https://github.com/callmecoffee3).

## What it does

Primary job is to **copy and import as many files and folders as possible** from the original doaashow repo into this clean structured repo (`doaashow-clean`).

It also organizes the creative lab:
- Simulated desktop / OS
- The Fam social network
- Media production tools
- DOS-style menus
- Genre / project libraries

## Repos

| Role | Repo |
|------|------|
| Source (messy original) | https://github.com/callmecoffee3/doaashow |
| Target (this clean repo) | https://github.com/callmecoffee3/doaashow-clean |

## Import strategy

1. List directories in doaashow (root, `-(Projects)`, Production, Systems, etc.)
2. Fetch file contents
3. Push into the matching clean folder
4. Work in batches (many small pushes)
5. Text files first (html, bat, md, tsx, json, txt)
6. Skip or note huge binaries (.blend, big zips) unless asked
7. Empty placeholder folders still get a folder + README so the tree exists
8. Always map to the numbered structure

## Where files go

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
3. Prefer copy over delete — keep originals in doaashow until told otherwise
4. Soft-stage clutter — never mass-delete without confirmation
5. Keep the playful lab spirit

## Batch import priorities

1. Docs and indexes (PROJECT_BRIEF, projects-index.json)
2. Desktop core files
3. The Fam terminals and bats
4. Production / story tools
5. Apps (scanners, games)
6. Key `-(Projects)` folders with real content (DOASHOW, MICRODRAMA, RADIOSHOW, desktop, AI-AGENTS, ARTIFACTS, WORKSTATIONS, TEST)
7. Remaining genre placeholders as folder + README stubs

## How to use

Say things like:
- “Matt Grosso Agent, import the desktop files”
- “Copy The Fam folders into the clean repo”
- “Import as many files as you can from doaashow”
- “Pull the next batch of -(Projects)”

## Style

Just for fun / goofing off. Entertainment lab, not a polished product.  
Built by **Matt Grosso**.
