import { resolveCauldronValues } from '../../logic/resolve-cauldron';
import { GAME_STATUS, type IGameState } from '../../data/types';
import { BAR_KEYS, ensureStructure } from './ensure-structure';
import { updateBar } from './update-bar';

const { menu } = GAME_STATUS;

export function renderBars(container: HTMLElement, state: IGameState): void {
  const list = ensureStructure(container);
  const values =
    state.status === menu
      ? resolveCauldronValues([], state.difficulty)
      : resolveCauldronValues(state.cauldronIngredients, state.difficulty);
  const recipe = state.status === menu ? null : state.activeRecipe;

  for (const key of BAR_KEYS) {
    const row = list.querySelector<HTMLElement>(`[data-bar="${key}"]`);
    if (row === null) {
      continue;
    }
    updateBar(row, values[key], recipe === null ? null : recipe[key]);
  }
}
