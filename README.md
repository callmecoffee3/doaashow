# doaashow

> Something to play with for creating media like movies, TV shows, games and stuff.

**Entertainment purposes only — just for goofing off and having fun.**

Originally meant to be spelled `doashow`, but we're rolling with `doaashow`.

---

## Vision

A creative playground / simulated OS + media production lab built by Matt Grosso (@callmecoffee3).

Core ideas:
- Simulated desktop / OS environments
- Media production tools (shows, scenes, characters, story tools)
- Social network simulation (**The Fam**)
- DOS-style batch menus and launchers
- Folder scanners, utilities, and experimental apps

---

## Current Structure (Clean Layout)

```
doaashow/
├── 01-core/                 # Heart of the project
│   ├── desktop/             # Main simulated desktop (HTML/JS/React)
│   ├── os-shell/            # DOS-style batch menus & main launchers
│   └── cloudos/             # Cloud OS experiments
│
├── 02-the-fam/              # Social network simulation
│   ├── terminal/            # The Fam terminal UIs
│   ├── bat/                 # Batch launchers for The Fam
│   ├── feed/
│   ├── messenger/
│   └── profiles/
│
├── 03-production/           # Media creation tools
│   ├── story-tools/         # Story writers, playbill, scene generators
│   ├── shows/
│   ├── characters/
│   ├── scenes/
│   └── pre-production/
│
├── 04-apps/                 # Standalone tools & experiments
│   ├── folder-scanner/
│   ├── shopping/
│   ├── games/               # Zombie game, virus simulator, etc.
│   ├── mall-stores/         # 300stores experiments
│   └── utilities/
│
├── 05-assets/               # All shared media
│   ├── images/
│   ├── audio/
│   ├── video/
│   └── icons/
│
├── 06-legacy/               # Old experiments (keep for history)
│   ├── old-html/
│   ├── old-bat/
│   └── archives/            # Large zips and dumps
│
├── docs/                    # Documentation
│   ├── PROJECT_BRIEF.md
│   ├── MIND-MAP.md
│   ├── FOLDER-NUMBERS.md
│   └── how-to-run.md
│
└── (existing folders kept for compatibility)
    ├── 01-Production/
    ├── 02-Systems/
    ├── 03-Assets/
    ├── 04-Legacy/
    ├── 05-Trash/
    ├── FOLDER-NUMBERS/
    ├── Production/
    ├── Systems/
    ├── Assets/
    ├── Legacy/
    └── Trash/
```

---

## Quick Start

1. Clone the repo:
   ```bash
   git clone https://github.com/callmecoffee3/doaashow.git
   ```

2. Open any `.html` file in a browser — most are standalone.

3. For DOS-style menus, run the `.bat` files on Windows.

4. Main entry points (to be refined):
   - Desktop experiments → look in `desktop/` or root `*.html` desktop files
   - The Fam → `thefam*.bat` / `thefamterminal*.html`
   - Main launcher → `DOASHOW - UPDATED.bat`

---

## Rules Going Forward

- **New work** goes into the numbered folders (`01-core/`, `02-the-fam/`, etc.)
- **Old root clutter** stays until explicitly moved or soft-deleted into `05-Trash/` / `Trash/`
- Never hard-delete without staging in Trash first
- Keep the playful spirit — this is a lab, not a polished product

---

## Related Docs

- [PROJECT_BRIEF.md](PROJECT_BRIEF.md)
- [MIND-MAP.md](MIND-MAP.md)
- [MIGRATION-STATUS.md](MIGRATION-STATUS.md)
- [FOLDER-NUMBERS.md](FOLDER-NUMBERS.md)

---

Built by **Matt Grosso** ([@callmecoffee3](https://github.com/callmecoffee3))

*Just for fun.*
