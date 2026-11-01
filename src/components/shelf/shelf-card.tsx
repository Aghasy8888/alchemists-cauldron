import { useState, type DragEvent, type FocusEvent, type MouseEvent } from 'react';
import type { IIngredient } from '../../data/types';
import { formatSigned } from '../../utils/format-signed';
import { IngredientIcon, ParamIcon } from '../icons';

const DRAG_MIME = 'text/plain';
const TOOLTIP_EDGE_PX = 220;

const PARAM_ROWS = [
  { param: 'temperature' as const, label: 'Temperature', valueKey: 'temperature' as const },
  { param: 'density' as const, label: 'Density', valueKey: 'density' as const },
  { param: 'magic' as const, label: 'Magic Power', valueKey: 'magicPower' as const },
];

type ShelfCardProps = {
  ingredient: IIngredient;
  stock: number;
  canAdd: boolean;
  cauldronFull: boolean;
  onAdd: (id: string) => void;
  onDraggingChange?: (dragging: boolean) => void;
};

export function ShelfCard({
  ingredient,
  stock,
  canAdd,
  cauldronFull,
  onAdd,
  onDraggingChange,
}: ShelfCardProps) {
  const [tooltipUp, setTooltipUp] = useState(false);
  const [dragging, setDragging] = useState(false);
  const isEmpty = stock <= 0;
  const isAddable = !isEmpty && canAdd && !cauldronFull;

  const syncTooltipFlip = (
    event: MouseEvent<HTMLButtonElement> | FocusEvent<HTMLButtonElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipUp(rect.bottom + TOOLTIP_EDGE_PX > window.innerHeight);
  };

  let ariaLabel: string;
  if (isEmpty) {
    ariaLabel = `${ingredient.name}, out of stock`;
  } else if (!canAdd) {
    ariaLabel = `${ingredient.name}, game not in play, temperature ${formatSigned(ingredient.temperature)}, density ${formatSigned(ingredient.density)}, magic ${formatSigned(ingredient.magicPower)}`;
  } else if (cauldronFull) {
    ariaLabel = `${ingredient.name}, cauldron is full, temperature ${formatSigned(ingredient.temperature)}, density ${formatSigned(ingredient.density)}, magic ${formatSigned(ingredient.magicPower)}`;
  } else {
    ariaLabel = `Add ${ingredient.name}, stock ${stock}, temperature ${formatSigned(ingredient.temperature)}, density ${formatSigned(ingredient.density)}, magic ${formatSigned(ingredient.magicPower)}`;
  }

  const cardClassName = [
    'shelf-card',
    isEmpty ? 'shelf-card--empty' : '',
    dragging ? 'shelf-card--dragging' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const tooltipClassName = tooltipUp
    ? 'shelf-card__tooltip shelf-card__tooltip--up'
    : 'shelf-card__tooltip';

  const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
    if (!isAddable || event.dataTransfer === null) {
      event.preventDefault();
      return;
    }
    setDragging(true);
    onDraggingChange?.(true);
    event.dataTransfer.setData(DRAG_MIME, ingredient.id);
    event.dataTransfer.effectAllowed = 'copy';
    const rect = event.currentTarget.getBoundingClientRect();
    event.dataTransfer.setDragImage(
      event.currentTarget,
      event.clientX - rect.left,
      event.clientY - rect.top,
    );
  };

  const handleDragEnd = () => {
    setDragging(false);
    onDraggingChange?.(false);
  };

  return (
    <li className="shelf__item">
      <button
        type="button"
        className={cardClassName}
        data-ingredient-id={ingredient.id}
        disabled={isEmpty || !isAddable}
        tabIndex={isEmpty ? -1 : undefined}
        draggable={isAddable}
        aria-label={ariaLabel}
        onMouseEnter={syncTooltipFlip}
        onFocus={syncTooltipFlip}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={() => {
          if (isAddable) {
            onAdd(ingredient.id);
          }
        }}
      >
        <span className="shelf-card__badge" aria-hidden="true">
          {stock}
        </span>

        {!isEmpty ? (
          <>
            <span className="shelf-card__icon">
              <IngredientIcon id={ingredient.icon} />
            </span>
            <span className="shelf-card__name">{ingredient.name}</span>

            <div className={tooltipClassName} aria-hidden="true">
              <div className="shelf-card__tooltip-header">
                <span className="shelf-card__tooltip-icon">
                  <IngredientIcon id={ingredient.icon} />
                </span>
                <span className="shelf-card__tooltip-title">{ingredient.name}</span>
              </div>
              <div className="shelf-card__tooltip-stats">
                {PARAM_ROWS.map((row) => (
                  <div key={row.param} className="shelf-card__tooltip-row">
                    <span className="shelf-card__tooltip-label">
                      <ParamIcon id={row.param} />
                      <span>{row.label}</span>
                    </span>
                    <span
                      className={`shelf-card__tooltip-value param-label param-label--${row.param}`}
                    >
                      {formatSigned(ingredient[row.valueKey])}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </button>
    </li>
  );
}

export { DRAG_MIME };
