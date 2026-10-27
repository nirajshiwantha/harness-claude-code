# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A slide deck, "Harnessing Claude Code", built as a React + Vite + Tailwind app from a Magic Patterns template. It renders one full-screen slide at a time and is also embedded in the Magic Patterns editor (iframe), which drives navigation through `postMessage`.

## Commands

- `npm install`, then `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx tsc --noEmit -p .` — type-check (no `typecheck` script). It already reports `TS6133` unused `React` imports and `TS7016` for `useScreenInit.js`; those are expected, so look only for new errors.

There are no tests.

## Architecture

- **`src/App.tsx` is the deck harness — do not edit.** It owns `slideIndex`, keyboard navigation, the `MP_SLIDE_CHANGED` / `MP_NAVIGATE_SLIDE` host messages, and the cross-dissolve between slides.
- **`src/deckSlides.tsx`** is the ordered slide list (`id`, `title`, `component`). Presentation order is array order.
- **`src/data/deckContent.ts`** holds slide copy as typed objects (types in `src/types/deck.ts`). Most slides are a reusable layout fed from one of these objects: `KeyValueSlide`, `ColumnsSlide`, `CodeSlide`. Cover, agenda, statement and story (recap) slides have their own components in `src/components/deck/`.
- **`src/canvas.manifest.js`** maps each slide `id` to a Magic Patterns screen: `name` (should match the slide title), `state.slideIndex` (its position in `slides`), canvas `position`, and section grouping in `sections` / `layers`. `useScreenInit.js` reads `?mp_screen=<id>` to open the deck on that slide.
- Slide strings support inline `` `code` `` and `**bold**` via `RichText`; `Reveal` staggers secondary content; `?freezeAnimations` disables animation.
- Theme colors are `deck-*` CSS variables in `src/index.css`, exposed as Tailwind colors (`ink`, `panel`, `line`, `dim`, `fg`, `fg-soft`, `coral`, `coral-soft`, `oncoral`). Sizes use `vw`/`vh` units so slides scale with the viewport. Keep the managed font imports and Tailwind import order at the top of `index.css` intact.

## Adding, removing or reordering slides

All of these must stay in sync:

1. `src/deckSlides.tsx` — the entry and its import.
2. `src/data/deckContent.ts` — the content object (delete it when removing a slide; `noUnusedLocals` is on).
3. `src/canvas.manifest.js` — the screen entry, its `layers` reference, and **renumber every later `slideIndex`**. Shift canvas `x` positions (1400px apart) and section `width` to close gaps.
4. `src/data/deckContent.ts` `agendaItems` — if a slide's topic disappears, update the agenda text.
5. `src/docs/harnessing-claude-code-slides.md` — the script with on-slide content and speaker notes; remove the section and renumber the `## Slide N —` headings. Not every slide appears in this doc.

## Content rules

- Slides are shown to the audience: presenter-only text (demo cues, prep tips) goes in the speaker notes in the docs file, not on the slide.
- The cover footer reads "Niraj Ranasinghe · 28 October 2026".
