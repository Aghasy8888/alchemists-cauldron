import { useState, type CSSProperties, type DragEvent } from 'react';
import cauldronArtUrl from '../../assets/images/game-cauldron.png';
import { GAME_STATUS } from '../../data/types';
import { useGame } from '../../hooks/use-game';
import { isCauldronFull } from '../../logic/add-ingredient';
import { GAME_ACTION } from '../../state/game-actions';
import { IngredientIcon } from '../icons';
import { DRAG_MIME } from '../shelf';

const DROP_TARGET_CLASS = 'game__cauldron--drop-target';

const { playing } = GAME_STATUS;
const { addIngredient } = GAME_ACTION;

export function Cauldron() {
  const { state, dispatch } = useGame();
  const [isDropTarget, setIsDropTarget] = useState(false);
  const { cauldronIngredients } = state;
  const canAcceptDrop = state.status === playing && !isCauldronFull(state);

  const sectionClassName = isDropTarget ? `game__cauldron ${DROP_TARGET_CLASS}` : 'game__cauldron';

  const potAriaLabel =
    cauldronIngredients.length === 0
      ? 'Cauldron is empty'
      : `Ingredients in the cauldron: ${cauldronIngredients.map((ingredient) => ingredient.name).join(', ')}`;

  const clearHighlight = () => {
    setIsDropTarget(false);
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    if (!canAcceptDrop) {
      return;
    }
    event.preventDefault();
    if (event.dataTransfer !== null) {
      event.dataTransfer.dropEffect = 'copy';
    }
    setIsDropTarget(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLElement>) => {
    const related = event.relatedTarget;
    if (related instanceof Node && event.currentTarget.contains(related)) {
      return;
    }
    clearHighlight();
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    clearHighlight();
    if (!canAcceptDrop) {
      return;
    }
    const id = event.dataTransfer?.getData(DRAG_MIME).trim() ?? '';
    if (id.length === 0) {
      return;
    }
    dispatch({ type: addIngredient, id });
  };

  return (
    <section
      className={sectionClassName}
      aria-label="Cauldron"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="cauldron__pot" aria-label={potAriaLabel}>
        <img
          className="cauldron__art"
          src={cauldronArtUrl}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
        {cauldronIngredients.map((ingredient, index) => {
          const style = {
            '--i': String(index),
            '--count': String(cauldronIngredients.length),
          } as CSSProperties;

          return (
            <span
              key={`${ingredient.id}-${index}`}
              className="cauldron__float"
              style={style}
              aria-hidden="true"
            >
              <IngredientIcon id={ingredient.icon} />
            </span>
          );
        })}
      </div>
    </section>
  );
}
