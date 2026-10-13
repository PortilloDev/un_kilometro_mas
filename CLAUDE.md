# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

**Un kilómetro más** is a local web app for generating Instagram posts for a personal running brand. Each day the user runs, they want to open the app, update stats and text, swap a photo, and export a ready-to-publish 1080×1350 px PNG — without touching Photoshop or any external tool.

The full requirements spec is in `Desarrollo de una aplicación local para generar publicaciones de Instagram — Un kilómetro más.md`. Read it before making architectural decisions. Reference images for the brand identity are `Un Kilómetro Más al Amanecer.png` and `Un Kilómetro Más_ Reto 1_100.png`.

## Tech stack

- **React + TypeScript + Vite** — frontend framework
- **Fabric.js** (preferred) or Konva.js — canvas layer engine (handles selection, drag, resize, z-order)
- **IndexedDB** — persistent storage for projects, templates, and embedded images
- **localStorage** — lightweight user preferences only
- No backend, no auth, no external services; must work fully offline after `npm install`

## Architecture

The codebase must be split by responsibility — do not merge concerns into a single component:

| Module | Responsibility |
|--------|---------------|
| `canvas/` | Fabric.js canvas wrapper, layer rendering, element CRUD |
| `model/` | TypeScript types for Layer, Project, Template, TrainingStats |
| `editor/` | Main editor UI: canvas area + toolbar |
| `layers/` | Layer panel (visibility, lock, reorder, rename) |
| `properties/` | Right-hand properties panel for the selected element |
| `templates/` | Template open/save/duplicate/restore logic |
| `persistence/` | IndexedDB adapter (projects + images) and localStorage helpers |
| `export/` | PNG/JPEG export at 1080×1350 px, stripping selection handles |

## Key constraints

- **Canvas size**: 1080×1350 px (4:5) primary; 1080×1080 px optional
- **Images must not deform** — always use object-fit: contain/cover semantics; crop without stretch
- **Layer order = render order** — what the user sees in the layers panel must match Fabric.js z-index exactly
- **Changing the challenge number** (`RETO X/100`, `DÍA X/100`) must update all linked labels atomically
- **Advancing the day counter** must never silently overwrite saved training stats — require confirmation
- **Template mutations are forbidden** — saving a post must never alter the source template object
- **Export must be pixel-exact** — use Fabric.js `toDataURL` or equivalent at target resolution, not the display scale

## Visual identity

- Background: near-black (`#0a0a0a` range)
- Accent: intense orange (`#ff6b00` range)
- Text: high-contrast white
- Cinematic/editorial composition: large hero photo left, stats right, logo top
- Font: bold, athletic — match what is visible in the reference PNGs

## Development phases

1. **Phase 1** — static template + export: canvas with reference layout, image swap (map + hero), text editing, stats panel, PNG export
2. **Phase 2** — layer editor: element selection, drag/resize, layer panel with visibility/lock/reorder
3. **Phase 3** — sequential numbering, project save/restore, template management, undo/redo
4. **Phase 4** — polish: text overflow handling, export validation, error messages

Start with Phase 1. Ship a working export before adding layer editing.

## Commands

All commands run from `app/`:

```bash
npm install          # install dependencies
npm run dev          # start Vite dev server → http://localhost:5173
npm run build        # production build → app/dist/
npm run preview      # preview production build
npx tsc --noEmit     # type-check without emitting
```

**Note:** Vite 8 uses Rolldown which requires `import type { … }` for TypeScript-only exports. Always use the `type` modifier when importing interfaces, type aliases, or enums that have no runtime value.

## Interface language

The UI must be in **Spanish**. Labels, buttons, tooltips, and error messages are all in Spanish. Code identifiers use English.
