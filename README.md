# Alchemist's Cauldron

Browser mini-game: mix ingredients in a cauldron, match three target ranges (**Temperature**, **Density**, **Magic Power**), and brew potions before time or lives run out.

## Game goal

Start a run, add ingredients from the shelf to the cauldron, watch the three parameter bars, and click **Brew** when the mix fits the recipe. Stock is limited; wrong brews cost lives. The run ends when time hits zero, lives are gone, or ingredients run out.

## Task set structure

Work is cumulative. You may stop after any finished level.

| Stage | What you add | Total score |
| --- | --- | ---: |
| **Precondition 1** | Repository setup, tooling, folder structure, quality checks | 58 |
| **Level 1 — Basic** | One full playable game with a fixed rule set | 228 |
| **Level 2 — Extended** | Difficulty selection and save / continue | 278 |
| **Level 3 — Full game** | Drag & drop, tooltip, reactions, Pour Out, shortcuts, visual feedback | 393 |

Maximum score: **393**.

## Stack

- **TypeScript** only for application code
- No frameworks, CSS frameworks, game engines, or other runtime libraries
- Plain CSS, SVG, Canvas, or text symbols for visuals

## How to run

Install and run scripts will be added after the bundler and TypeScript tooling are set up.
