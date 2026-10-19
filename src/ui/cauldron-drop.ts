export const CAULDRON_DROP_TARGET_CLASS = 'game__cauldron--drop-target';

const DRAG_MIME = 'text/plain';

export type CauldronDropOptions = {
  onDrop: (ingredientId: string) => void;
};

/**
 * Bind HTML5 drop handlers once on the persistent cauldron section.
 * Highlight while a valid drag is over the zone; clear on leave/drop.
 */
export function setupCauldronDropZone(
  cauldronSlot: HTMLElement,
  options: CauldronDropOptions,
): void {
  const clearHighlight = (): void => {
    cauldronSlot.classList.remove(CAULDRON_DROP_TARGET_CLASS);
  };

  cauldronSlot.addEventListener('dragover', (event) => {
    event.preventDefault();
    if (event.dataTransfer !== null) {
      event.dataTransfer.dropEffect = 'copy';
    }
    cauldronSlot.classList.add(CAULDRON_DROP_TARGET_CLASS);
  });

  cauldronSlot.addEventListener('dragleave', (event) => {
    const related = event.relatedTarget;
    if (related instanceof Node && cauldronSlot.contains(related)) {
      return;
    }
    clearHighlight();
  });

  cauldronSlot.addEventListener('drop', (event) => {
    event.preventDefault();
    clearHighlight();
    const id = event.dataTransfer?.getData(DRAG_MIME).trim() ?? '';
    if (id.length === 0) {
      return;
    }
    options.onDrop(id);
  });
}

export { DRAG_MIME };
