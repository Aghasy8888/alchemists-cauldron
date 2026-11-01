# Alchemist's Cauldron (React)

Browser mini-game: mix ingredients in a cauldron, match three target ranges (**Temperature**, **Density**, **Magic Power**), and brew potions before time or lives run out.

This folder is the **React 19** creative-extension of the game. The completed vanilla TypeScript version lives in [`alchemists-cauldron-pure-ts/`](./alchemists-cauldron-pure-ts/) (reference for rules and behavior).

**Live demo (vanilla deploy, until React is published):** [https://aghasy8888.github.io/alchemists-cauldron/](https://aghasy8888.github.io/alchemists-cauldron/)

Production `base` is `/alchemists-cauldron/`. Deploy with `npm run deploy` (publishes `dist/` to the `gh-pages` branch). Do not commit `dist/` on story branches.

## Migration status

**Complete** for gameplay / UX parity with pure-ts (React-first UI, not 1:1 DOM factories).

Implemented:

- Pure game **data**, **logic**, **utils**, and **storage** (save / leaderboard)
- **State:** `useReducer` + `GameProvider` / `useGame`
- Play board: **HUD**, shelf (tooltips + drag-and-drop), cauldron (floating icons), recipe panel, parameter bars
- Menu / brew **action controls**; dialogs: Help, Settings, Pause, Game Over (+ name entry), Leaderboard (+ clear confirm)
- Hooks: game timer (`endTime` / rAF), pause on hidden / blur, keyboard shortcuts, auto-save, brew FX, urgent timer chime
- Declarative **SVG icon** components (`UiIcon`, `ParamIcon`, `IngredientIcon`, HUD icons)
- Tooling: TypeScript strict, ESLint (`recommended-latest`), Prettier, Husky, **React Compiler**

Gameplay rules and scoring match [`game-alchemists-cauldron֊req`](../game-alchemists-cauldron֊req/README.md) and the pure-ts implementation.

## How to play

1. On the start screen, open **Settings** for Easy / Medium / Hard, read **Help** if needed, then **Start Game** (or **Continue** if a save exists).
2. Add ingredients from the shelf by click or drag-and-drop. Stock decreases; portions are not returned.
3. Watch the three bars vs the recipe ranges. **Brew** when ready (success: score + time bonus, new recipe; failure: −1 life). Cauldron clears either way; stock is not restored.
4. **Pour Out** dumps a bad mix for a time cost. **Pause** (or hide the tab) freezes the timer.
5. The run ends when time is up, lives are 0, or usable shelf stock and cauldron are empty. Qualify for the Top-10 to enter a name.

### Keyboard (active play only)

| Key          | Action     |
| ------------ | ---------- |
| `Esc` or `P` | Pause      |
| `B`          | Brew       |
| `O`          | Pour Out   |
| `1`–`8`      | Shelf slot |

On the pause screen, shortcuts are off — use the focused **Resume** button. Menu and Game Over keep normal browser keys.

## Task set structure

Work is cumulative. You may stop after any finished level.

| Stage                   | What you add                                                          | Total score |
| ----------------------- | --------------------------------------------------------------------- | ----------: |
| **Precondition 1**      | Repository setup, tooling, folder structure, quality checks           |          58 |
| **Level 1 — Basic**     | One full playable game with a fixed rule set                          |         228 |
| **Level 2 — Extended**  | Difficulty selection and save / continue                              |         278 |
| **Level 3 — Full game** | Drag & drop, tooltip, reactions, Pour Out, shortcuts, visual feedback |         393 |

Maximum score: **423**. This React app implements through Level 3 (full game) as a Creative Extension framework migration.

## Stack

- **React 19** + **react-dom** (SPA)
- **React Compiler** enabled (`babel-plugin-react-compiler` via Vite `reactCompilerPreset`)
- **TypeScript** (strict), Vite 8, Sass/SCSS
- No CSS frameworks, game engines, or extra state libraries — `useReducer` + Context only

## How to run

From this directory (`alchemists-cauldron/`):

```bash
npm install
npm run dev          # development server
npm run typecheck    # tsc -b
npm run lint         # eslint --max-warnings 0
npm run format:check # prettier
npm run build        # typecheck + production build → dist/
npm run preview      # preview the production build
npm run deploy       # build and publish dist/ to gh-pages
```

## Cursor rules

Project agent rules live in [`.cursor/rules/`](./.cursor/rules/) and must stay in sync with the workspace copy under [`../.cursor/rules/`](../.cursor/rules/) (`cursor-rules-sync`). Prefer React-idiomatic ports over copying pure-ts DOM/UI factories (`react-19-best-practices`).
