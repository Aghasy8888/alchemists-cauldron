import { DIFFICULTY_CONFIG } from '../../data/difficulty';
import { GAME_STATUS, type IRecipeRange } from '../../data/types';
import { useGame } from '../../hooks/use-game';
import type { ParamIconId } from '../../assets/param-icons';
import { ParamIcon } from '../icons';

const { menu, playing } = GAME_STATUS;

function formatRange(range: IRecipeRange): string {
  return `${range.min}..${range.max}`;
}

function ToleranceNote({ tolerance }: { tolerance: number }) {
  return <p className="recipe-panel__tolerance">Tolerance: ±{tolerance}</p>;
}

export function RecipePanel() {
  const { state } = useGame();
  const config = DIFFICULTY_CONFIG[state.difficulty];
  const added = state.status === menu ? 0 : state.cauldronIngredients.length;
  const maximum = config.maxCauldronIngredients;
  const counterFull = added >= maximum && state.status === playing;
  const counterClassName = counterFull
    ? 'recipe-panel__counter recipe-panel__counter--full'
    : 'recipe-panel__counter';

  const entries: Array<{ label: string; param: ParamIconId; range: IRecipeRange }> | null =
    state.activeRecipe === null
      ? null
      : [
          { label: 'Temp', param: 'temperature', range: state.activeRecipe.temperature },
          { label: 'Density', param: 'density', range: state.activeRecipe.density },
          { label: 'Magic', param: 'magic', range: state.activeRecipe.magicPower },
        ];

  return (
    <section className="game__recipe" aria-label="Recipe panel">
      <h2 className="recipe-panel__title">Recipe</h2>
      <p className={counterClassName}>
        Ingredients: {added} / {maximum}
      </p>

      {state.status === menu || state.activeRecipe === null || entries === null ? (
        <>
          <p className="recipe-panel__hint">Start a game to get a recipe.</p>
          <ToleranceNote tolerance={config.recipeTolerance} />
        </>
      ) : (
        <>
          <p className="recipe-panel__name">{state.activeRecipe.name}</p>
          <ul className="recipe-panel__ranges">
            {entries.map((entry) => (
              <li key={entry.param} className="recipe-panel__range">
                <ParamIcon id={entry.param} />
                <span className="recipe-panel__range-label">{entry.label}:</span>
                <span
                  className={`recipe-panel__range-value param-label param-label--${entry.param}`}
                >
                  {formatRange(entry.range)}
                </span>
              </li>
            ))}
          </ul>
          <ToleranceNote tolerance={config.recipeTolerance} />
        </>
      )}
    </section>
  );
}
