import { useEffect } from 'react';
import { DIFFICULTY_CONFIG } from '../../data/difficulty';
import { getShelfIngredients } from '../../data/ingredients';
import { GAME_STATUS } from '../../data/types';
import { useGame } from '../../hooks/use-game';
import { isCauldronFull } from '../../logic/add-ingredient';
import { GAME_ACTION } from '../../state/game-actions';
import { ShelfCard } from './shelf-card';

const { menu, playing } = GAME_STATUS;
const { addIngredient } = GAME_ACTION;

type ShelfProps = {
  onDraggingChange?: (dragging: boolean) => void;
};

export function Shelf({ onDraggingChange }: ShelfProps) {
  const { state, dispatch } = useGame();
  const config = DIFFICULTY_CONFIG[state.difficulty];

  useEffect(() => {
    return () => {
      onDraggingChange?.(false);
    };
  }, [onDraggingChange]);

  return (
    <section className="game__shelf" aria-label="Shelf">
      <h2 className="shelf__title">Ingredient Shelf</h2>
      {state.status === menu ? null : (
        <ul className="shelf__list" aria-label="Ingredient shelf">
          {getShelfIngredients(config.shelfIngredientCount).map((ingredient) => (
            <ShelfCard
              key={ingredient.id}
              ingredient={ingredient}
              stock={state.shelfStock[ingredient.id] ?? 0}
              canAdd={state.status === playing}
              cauldronFull={isCauldronFull(state)}
              onDraggingChange={onDraggingChange}
              onAdd={(id) => {
                dispatch({ type: addIngredient, id });
              }}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
