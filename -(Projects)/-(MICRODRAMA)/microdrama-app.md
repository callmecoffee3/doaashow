# MicroDrama AI

**Big Drama. Small Screen.**

A complete browser-based micro-drama creation studio.  
Build stories with index cards → organize them into decks & projects → generate vertical micro dramas with AI.

---

## Table of Contents

1. [Overview](#overview)
2. [Pages & Navigation](#pages--navigation)
3. [Workspace Hierarchy](#workspace-hierarchy)
4. [Index Card Types](#index-card-types)
5. [Sample Project](#sample-project)
6. [AI Studio](#ai-studio)
7. [Data Persistence](#data-persistence)
8. [How to Use](#how-to-use)
9. [File Structure](#file-structure)
10. [Technical Notes](#technical-notes)

---

## Overview

MicroDrama AI is a single-file web application that lets users:

- Create **Projects** (top-level story containers)
- Create **Decks** inside projects (collections of story elements)
- Create **Index Cards** of five types: Character, Scene, Prop, Animal, Prompt
- Generate a vertical micro-drama video from a free-form prompt and/or the cards in the active deck
- Browse trending sample dramas

Everything runs client-side in the browser. No backend required.

---

## Pages & Navigation

The app is a single-page application (SPA) with four main pages:

| Page        | Route / ID       | Description                                      |
|-------------|------------------|--------------------------------------------------|
| **Home**    | `page-home`      | Landing page with hero and feature highlights    |
| **Workspace** | `page-workspace` | Project → Deck → Card hierarchy                  |
| **AI Studio** | `page-studio`  | Prompt input, generation progress, video player  |
| **Trending**  | `page-trending`| Grid of sample micro dramas                      |

### Navigation

- Desktop: top navigation bar
- Mobile: hamburger menu
- Logo click → returns to Home
- Internal Workspace navigation uses breadcrumbs and back buttons

---

## Workspace Hierarchy

```
Workspace
 └── Projects
      └── Decks
           └── Index Cards
                ├── Character
                ├── Scene
                ├── Prop
                ├── Animal
                └── Prompt
```

### Subviews inside Workspace

1. **Projects List** (`ws-projects`)
   - Grid of all projects
   - Create new project
   - Click a project to open it

2. **Project Detail** (`ws-project`)
   - Shows all decks belonging to the selected project
   - Create new deck
   - Breadcrumb: Workspace / Project Name

3. **Deck Detail** (`ws-deck`)
   - Shows all index cards in the selected deck
   - Filter tabs: All / Characters / Scenes / Props / Animals / Prompts
   - Buttons to add each card type
   - Edit / Delete individual cards
   - Breadcrumb: Workspace / Project Name / Deck Name

---

## Index Card Types

| Type        | Icon          | Color   | Extra Field              | Purpose                              |
|-------------|---------------|---------|--------------------------|--------------------------------------|
| Character   | `fa-user`     | Pink    | Gender / Age / Role      | People in the story                  |
| Scene       | `fa-film`     | Violet  | Location / Time          | Key locations & moments              |
| Prop        | `fa-cube`     | Amber   | —                        | Important objects                    |
| Animal      | `fa-paw`      | Green   | Species                  | Pets or symbolic creatures           |
| Prompt      | `fa-lightbulb`| Blue    | —                        | Story hooks / loglines / ideas       |

Each card has:
- **Title** (required)
- **Description**
- **Extra** (optional, type-specific)

---

## Sample Project

Pre-seeded on first load:

### 📁 Project: Secret Wife Romance

#### 🃏 Deck: Main Story Deck

##### Characters

**Elena**  
- Details: Female, 24  
- Description: Poor but kind-hearted young woman working as a secretary. Soft-spoken, determined.

**Mr. Kane**  
- Details: Male, 32  
- Description: Cold, ruthless CEO of a tech empire. Hides a soft side from his past.

##### Scenes

**Office Confession**  
- Location / Time: Night, Office  
- Description: Late night in the glass office. Rain outside. Elena confronts Kane about the marriage certificate.

##### Props

**Fake Marriage Certificate**  
- Description: A forged document that starts the whole conflict.

##### Animals

**Black Cat (Shadow)**  
- Species: Cat  
- Description: Kane's quiet companion that only appears when he is vulnerable.

##### Prompts

**Core Hook**  
- Description: A poor girl is forced into a contract marriage with a cold CEO who turns out to be the boy who saved her life 10 years ago.

---

## AI Studio

### Features

- Free-form prompt textarea
- Toggle: **“Include active project cards in generation”**
  - When enabled, the system automatically appends characters, scenes, props, and animals from the currently active deck to the prompt
- Multi-step generation animation:
  1. Writing script & dialogue
  2. Casting AI actors
  3. Filming scenes
  4. Editing & rendering video
- Progress bar (0% → 100%)
- Vertical video player (9:16 aspect ratio)
- Play Again / Generate Another controls

### Video

Currently uses a public sample vertical MP4 for demonstration:

```
https://cdn.truefilesize.com/mp4/sample-portrait.mp4
```

(1080×1920, ~10 seconds)

In a production version this would be replaced by a real AI video generation API (Runway, Kling, Luma, etc.).

---

## Data Persistence

All data is stored in the browser using `localStorage` under the key:

```
microdrama_state
```

Structure:

```json
{
  "projects": [
    {
      "id": "uuid",
      "name": "Project Name",
      "decks": [
        {
          "id": "uuid",
          "name": "Deck Name",
          "cards": [
            {
              "id": "uuid",
              "type": "character|scene|prop|animal|prompt",
              "title": "...",
              "desc": "...",
              "extra": "..."
            }
          ]
        }
      ]
    }
  ],
  "activeProjectId": "uuid",
  "activeDeckId": "uuid",
  "currentFilter": "all"
}
```

Data persists across page reloads and browser sessions (until localStorage is cleared).

---

## How to Use

1. Open `microdrama-ai.html` in any modern browser
2. Go to **Workspace**
3. Open the sample project **Secret Wife Romance** (or create a new one)
4. Open the deck **Main Story Deck**
5. Add / edit / delete index cards as needed
6. Go to **AI Studio**
7. (Optional) Check **Include active project cards in generation**
8. Type a prompt or leave blank to use the Core Hook
9. Click **GENERATE MY MICRO DRAMA**
10. Watch the generation steps, then play the resulting video

---

## File Structure

```
artifacts/
├── microdrama-ai.html      ← Main application (single file)
└── microdrama-app.md       ← This documentation
```

The entire application lives in one HTML file. It uses:

- Tailwind CSS (CDN)
- Font Awesome 6 (CDN)
- Vanilla JavaScript
- localStorage for persistence

No build step, no dependencies to install.

---

## Technical Notes

- **Routing**: Simple show/hide of `.page` elements via JavaScript (`navigate()` function)
- **Workspace subviews**: Additional show/hide of `.ws-view` elements
- **Card filtering**: Client-side filter on `state.currentFilter`
- **Generation**: Simulated multi-step progress (not real AI video generation)
- **Video**: HTML5 `<video>` element with vertical sample source
- **IDs**: Generated with `crypto.randomUUID()`
- **XSS protection**: Basic `escapeHtml()` when rendering user content

---

## Future Ideas

- Real AI video generation API integration
- Export project / deck to Markdown or JSON
- Import cards from external sources
- Drag-and-drop reordering of cards
- Dark / light theme toggle
- Multiple video results per generation
- Shareable project links
- User accounts & cloud sync

---

*MicroDrama AI • 2026*  
*Made for drama addicts by drama addicts*
