# Harnessing Claude Code

A slide deck on getting the most out of [Claude Code](https://claude.com/claude-code): setup, plan mode, commands, skills, subagents, hooks, MCP and running many sessions at once. Presented by Niraj Ranasinghe on 28 October 2026.

It's built as a React + Vite + Tailwind app, so it runs in the browser rather than PowerPoint.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |

## Presenting

- **Next slide:** `→`, `Space` or `Page Down`
- **Previous slide:** `←` or `Page Up`
- **Turn off animations:** add `?freezeAnimations`

Slides size themselves in `vw`/`vh`, so go full screen in the browser (`F11`) and they'll scale to fit.

Speaker notes and the full script are in [src/docs/harnessing-claude-code-slides.md](src/docs/harnessing-claude-code-slides.md).

## Slides

1. Harnessing Claude Code
2. Agenda
3. Start with a better setup
4. Better plan mode
5. Slash commands you'll use daily
6. Custom commands: write your own
7. Skills: reusable playbooks
8. Keep the setup lean
9. Subagents: specialists
10. Hooks run every time, whatever the model decides
11. Hooks in practice
12. MCP and plugins
13. Many sessions at once
14. One repo, one story
15. Write one skill for something you repeat every week

## Project layout

```
src/
  App.tsx                  Deck harness: navigation and transitions
  deckSlides.tsx           Ordered list of slides
  data/deckContent.ts      Slide copy as typed objects
  types/deck.ts            Content types
  components/deck/         Slide layouts (KeyValue, Columns, Code) and one-off slides
  docs/                    Script and speaker notes
  index.css                Theme colors (deck-* CSS variables)
```

Most slides are a reusable layout fed from an object in `deckContent.ts`, so editing copy usually means editing that file only. Slide text supports inline `` `code` `` and `**bold**`.

## Editing the deck

To add, remove or reorder slides, keep these in sync (the full checklist is in [CLAUDE.md](CLAUDE.md)):

1. `src/deckSlides.tsx`: the slide entry
2. `src/data/deckContent.ts`: its content object, and the agenda if a topic changes
3. `src/docs/harnessing-claude-code-slides.md`: the script section

Anything only the presenter should see (demo cues, prep tips) belongs in the speaker notes, not on a slide.
