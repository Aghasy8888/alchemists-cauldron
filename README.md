# Alchemist's Cauldron

Browser mini-game: mix ingredients in a cauldron, match three target ranges (**Temperature**, **Density**, **Magic Power**), and brew potions before time or lives run out.

**Live demo:** [https://aghasy8888.github.io/alchemists-cauldron/](https://aghasy8888.github.io/alchemists-cauldron/)

Deployed from the `gh-pages` branch (GitHub Pages → Deploy from a branch → `gh-pages` / root). Production `base` is `/alchemists-cauldron/`.

## What is implemented

Through **Level 3 (full game)**:

### Level 1 — Basic

- Start screen with **Start Game**, empty shelf / cauldron until the run begins
- Shelf with limited stock (random 2–15), cauldron capacity, recipe panel with ingredient counter
- Three parameter bars (T / D / M) with recipe target zones and smooth updates
- **Brew** with score / time bonus on success, life loss on failure; cauldron clears, stock is not restored
- HUD: score, timer (from timestamps; urgent under 15 s), lives
- Pause (including when the tab is hidden), Game Over, Top-10 leaderboard with safe `localStorage`

### Level 2 — Extended

- **Help** and **Settings** on the start screen
- Difficulty: Easy / Medium / Hard (shelf size, time, lives, tolerance, scoring, reactions)
- Continue Game from a valid save (opens paused; stock restored, not re-rolled)
- Leaderboard per difficulty

### Level 3 — Full game

- Drag and drop ingredients from the shelf into the cauldron
- Ingredient tooltips (T / D / M values)
- Chemical reactions: Easy none, Medium 2, Hard 3 (edge-triggered when a combo becomes active)
- **Pour Out** (clears the cauldron for a time cost; stock not returned)
- Visual feedback: brew success / failure, floating icons in the pot, optional floating time bonus (`+Ns`)
- Keyboard shortcuts while **playing** only (see below)

## How to play

1. On the start screen, open **Settings** to pick Easy / Medium / Hard, read **Help** if needed, then **Start Game** (or **Continue Game** if a save exists).
2. Add ingredients from the shelf by click or drag-and-drop. Stock decreases; you cannot put portions back.
3. Watch the three bars vs the recipe ranges (green zone = in range for display; Brew uses difficulty tolerance).
4. **Brew** when ready. Success: score + time bonus (capped), new recipe, cauldron cleared. Failure: −1 life, cauldron cleared.
5. Use **Pour Out** to dump a bad mix without brewing (costs time; ingredients stay spent).
6. **Pause** (or hide the tab) to freeze the timer; Resume or Exit to Menu from the dialog.
7. The run ends when time is up, lives are 0, or the shelf and cauldron are empty of usable stock. Qualify for the Top-10 to enter a name.

### Keyboard (active play only)

| Key          | Action                                                      |
| ------------ | ----------------------------------------------------------- |
| `Esc` or `P` | Pause                                                       |
| `B`          | Brew                                                        |
| `O`          | Pour Out                                                    |
| `1`–`8`      | Add shelf slot (top number row; slots depend on difficulty) |

On the pause screen, shortcuts are off — use the focused **Resume** button (Enter / Space). Menu and Game Over keep normal browser keys.

## Task set structure

Work is cumulative. You may stop after any finished level.

| Stage                   | What you add                                                          | Total score |
| ----------------------- | --------------------------------------------------------------------- | ----------: |
| **Precondition 1**      | Repository setup, tooling, folder structure, quality checks           |          58 |
| **Level 1 — Basic**     | One full playable game with a fixed rule set                          |         228 |
| **Level 2 — Extended**  | Difficulty selection and save / continue                              |         278 |
| **Level 3 — Full game** | Drag & drop, tooltip, reactions, Pour Out, shortcuts, visual feedback |         393 |

Maximum score: **393**.

## Stack

- **TypeScript** only for application code
- No frameworks, CSS frameworks, game engines, or other runtime libraries
- Plain CSS / SCSS, SVG, or text for visuals
- Vite for development and production builds

## How to run

```bash
npm install
npm run dev       # development server
npm run build     # production build → dist/
npm run preview   # preview the production build
npm run deploy    # build and publish dist/ to the gh-pages branch
```

Do not commit `dist/` on story branches. Redeploy with `npm run deploy` from the branch whose code you want live.
