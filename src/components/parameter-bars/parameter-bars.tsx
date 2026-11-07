import { DIFFICULTY_CONFIG } from '../../data/difficulty';
import { GAME_STATUS } from '../../data/types';
import { useGame } from '../../hooks/use-game';
import { resolveCauldronValues } from '../../logic/resolve-cauldron';
import { BAR_KEYS, BAR_LABELS, BAR_PARAM_ID } from './bar-config';
import { ParamBar } from './param-bar';

const { menu } = GAME_STATUS;

export function ParameterBars() {
  const { state } = useGame();
  const values =
    state.status === menu
      ? resolveCauldronValues([], state.difficulty)
      : resolveCauldronValues(state.cauldronIngredients, state.difficulty);
  const recipe = state.status === menu ? null : state.activeRecipe;
  const tolerance = DIFFICULTY_CONFIG[state.difficulty].recipeTolerance;

  return (
    <section className="game__bars" aria-label="Parameter bars">
      <div className="bars__list">
        {BAR_KEYS.map((key) => {
          const param = BAR_PARAM_ID[key];
          return (
            <ParamBar
              key={key}
              barKey={key}
              param={param}
              label={BAR_LABELS[key]}
              value={values[key]}
              range={recipe === null ? null : recipe[key]}
              tolerance={tolerance}
            />
          );
        })}
      </div>
    </section>
  );
}
