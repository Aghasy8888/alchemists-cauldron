import { createParamIcon, type ParamIconId } from '../assets/param-icons';
import { DIFFICULTY_CONFIG } from '../data/difficulty';
import type { IGameState, IRecipeRange } from '../data/types';

function formatRange(range: IRecipeRange): string {
  return `${range.min}..${range.max}`;
}

/** Recipe name, ranges, and ingredient counter (Brew check comes in US 1.3). */
export function renderRecipePanel(container: HTMLElement, state: IGameState): void {
  container.replaceChildren();

  const title = document.createElement('h2');
  title.className = 'recipe-panel__title';
  title.textContent = 'Recipe';
  container.append(title);

  const config = DIFFICULTY_CONFIG[state.difficulty];
  const added = state.status === 'menu' ? 0 : state.cauldronIngredients.length;
  const maximum = config.maxCauldronIngredients;

  const counter = document.createElement('p');
  counter.className = 'recipe-panel__counter';
  if (added >= maximum && state.status === 'playing') {
    counter.classList.add('recipe-panel__counter--full');
  }
  counter.textContent = `Ingredients: ${added} / ${maximum}`;
  container.append(counter);

  if (state.status === 'menu' || state.activeRecipe === null) {
    const hint = document.createElement('p');
    hint.className = 'recipe-panel__hint';
    hint.textContent = 'Start a game to get a recipe.';
    container.append(hint);
    return;
  }

  const name = document.createElement('p');
  name.className = 'recipe-panel__name';
  name.textContent = state.activeRecipe.name;
  container.append(name);

  const ranges = document.createElement('ul');
  ranges.className = 'recipe-panel__ranges';

  const entries: Array<{ label: string; param: ParamIconId; range: IRecipeRange }> = [
    { label: 'Temp', param: 'temperature', range: state.activeRecipe.temperature },
    { label: 'Density', param: 'density', range: state.activeRecipe.density },
    { label: 'Magic', param: 'magic', range: state.activeRecipe.magicPower },
  ];

  for (const entry of entries) {
    const item = document.createElement('li');
    item.className = 'recipe-panel__range';

    const label = document.createElement('span');
    label.className = 'recipe-panel__range-label';
    label.textContent = `${entry.label}:`;

    const value = document.createElement('span');
    value.className = `recipe-panel__range-value param-label param-label--${entry.param}`;
    value.textContent = formatRange(entry.range);

    item.append(createParamIcon(entry.param), label, value);
    ranges.append(item);
  }

  container.append(ranges);
}
