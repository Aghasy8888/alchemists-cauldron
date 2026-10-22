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

## How to test (viewport / fullscreen layout)

The play board is a **fixed full-screen viewport with no page scroll** (vertical or horizontal). Layout must fit inside the visible area across device sizes. Do **not** rely on document scrolling when reviewing.

**How to test:** open Chrome (or Edge) DevTools → **Toggle device toolbar** (responsive mode) → set **both** width and height manually for each row below. The min/max heights are real device / usable viewport heights — do not leave height on “responsive” auto-grow; enter the values explicitly.

### Viewport resolution matrix

| Target width | Min height | Max height | Target device / environment               | Critical focus                                                   |
| ------------ | ---------- | ---------- | ----------------------------------------- | ---------------------------------------------------------------- |
| **375px**    | `667px`    | `812px`    | Small–standard mobile (iPhone SE → Pro/X) | Touch targets; dynamic address bars must not hide HUD / actions  |
| **768px**    | `1024px`   | `1024px`   | Tablet portrait (iPad / Android)          | Tall aspect; board centered / scaled without vertical truncation |
| **1200px**   | `800px`    | `900px`    | Compact laptop (~13")                     | HUD vs gameplay; top/bottom margins                              |
| **1500px**   | `864px`    | `960px`    | Mid desktop / scaled monitors             | Mid-tier scaling without overflow                                |
| **1920px**   | `1040px`   | `1080px`   | Full HD desktop                           | Fullscreen fidelity and alignment on large aspect ratios         |

For each width, test **both** the min and max height in DevTools (e.g. `375 × 667` and `375 × 812`). Min heights reflect shorter usable viewports (browser chrome / address bar); max heights reflect taller device viewports.

### Reviewer checks

1. **Zero page scroll** — trackpad, wheel, or swipe must not reveal whitespace or shift the board. Only overlays/dialogs may scroll internally.
2. **Mobile height at 375px** — in responsive mode, set `375 × 667` (compact chrome: bottom controls fully clickable) and `375 × 812` (taller phones: header clears notches / system bars).
3. **Desktop inner height** — set lower bounds such as `1200 × 800` and `1920 × 1040` so shorter windowed / chrome-shrunk viewports do not clip bottom actions.
4. **Aspect fill** — background / letterboxing (if any) fills the viewport cleanly at every matrix boundary.
