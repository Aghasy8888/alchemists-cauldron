import { useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react';

const LONG_PRESS_MS = 400;
const HOLD_SLOP_PX = 10;
const HAPTIC_MS = 12;
const DROP_TARGET_CLASS = 'game__cauldron--drop-target';
const GHOST_CLASS = 'shelf-card--touch-ghost';
const CAULDRON_SELECTOR = '.game__cauldron';

type UseShelfTouchDragOptions = {
  enabled: boolean;
  ingredientId: string;
  onAdd: (id: string) => void;
  onDraggingChange?: (dragging: boolean) => void;
};

type TouchDragSession = {
  pointerId: number;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  armed: boolean;
  armTimerId: number | null;
  ghost: HTMLElement | null;
};

function clearDropTarget(): void {
  document.querySelectorAll(`.${DROP_TARGET_CLASS}`).forEach((element) => {
    element.classList.remove(DROP_TARGET_CLASS);
  });
}

function syncDropTarget(clientX: number, clientY: number): void {
  const underPointer = document.elementFromPoint(clientX, clientY);
  const cauldron = underPointer instanceof Element ? underPointer.closest(CAULDRON_SELECTOR) : null;

  document.querySelectorAll(CAULDRON_SELECTOR).forEach((element) => {
    element.classList.toggle(DROP_TARGET_CLASS, element === cauldron);
  });
}

function createGhost(source: HTMLButtonElement, width: number, height: number): HTMLElement {
  const ghost = source.cloneNode(true);
  if (!(ghost instanceof HTMLButtonElement)) {
    throw new Error('Expected shelf card clone to be a button');
  }

  ghost.removeAttribute('id');
  ghost.disabled = true;
  ghost.draggable = false;
  ghost.tabIndex = -1;
  ghost.setAttribute('aria-hidden', 'true');
  ghost.classList.add(GHOST_CLASS);
  ghost.classList.remove(
    'shelf-card--dragging',
    'shelf-card--touch-pressed',
    'shelf-card--touch-origin',
  );
  ghost.querySelector('.shelf-card__tooltip')?.remove();
  ghost.style.width = `${width}px`;
  ghost.style.height = `${height}px`;

  return ghost;
}

function positionGhost(
  ghost: HTMLElement,
  clientX: number,
  clientY: number,
  offsetX: number,
  offsetY: number,
): void {
  ghost.style.left = `${clientX - offsetX}px`;
  ghost.style.top = `${clientY - offsetY}px`;
}

function releaseCapture(target: HTMLButtonElement, pointerId: number): void {
  if (target.hasPointerCapture(pointerId)) {
    target.releasePointerCapture(pointerId);
  }
}

function clearArmTimer(session: TouchDragSession): void {
  if (session.armTimerId === null) {
    return;
  }
  window.clearTimeout(session.armTimerId);
  session.armTimerId = null;
}

function pulseHaptic(): void {
  try {
    navigator.vibrate?.(HAPTIC_MS);
  } catch {
    // Vibration unsupported or blocked.
  }
}

export function useShelfTouchDrag({
  enabled,
  ingredientId,
  onAdd,
  onDraggingChange,
}: UseShelfTouchDragOptions): {
  cardRef: RefObject<HTMLButtonElement | null>;
  isTouchPressed: boolean;
  isTouchDragging: boolean;
  shouldSuppressNativeDrag: () => boolean;
  consumeClickSuppression: () => boolean;
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerCancel: (event: PointerEvent<HTMLButtonElement>) => void;
} {
  const cardRef = useRef<HTMLButtonElement>(null);
  const sessionRef = useRef<TouchDragSession | null>(null);
  const suppressNativeDragRef = useRef(false);
  const suppressClickRef = useRef(false);
  const enabledRef = useRef(enabled);
  const ingredientIdRef = useRef(ingredientId);
  const onAddRef = useRef(onAdd);
  const onDraggingChangeRef = useRef(onDraggingChange);
  const [isTouchPressed, setIsTouchPressed] = useState(false);
  const [isTouchDragging, setIsTouchDragging] = useState(false);

  useEffect(() => {
    enabledRef.current = enabled;
    ingredientIdRef.current = ingredientId;
    onAddRef.current = onAdd;
    onDraggingChangeRef.current = onDraggingChange;
  }, [enabled, ingredientId, onAdd, onDraggingChange]);

  const resetUiFlags = (): void => {
    setIsTouchPressed(false);
    setIsTouchDragging(false);
  };

  const cleanupSessionDom = (session: TouchDragSession): void => {
    clearArmTimer(session);
    clearDropTarget();
    session.ghost?.remove();
    session.ghost = null;
  };

  const endSession = (event: PointerEvent<HTMLButtonElement>, allowDrop: boolean): void => {
    const session = sessionRef.current;
    if (session === null || session.pointerId !== event.pointerId) {
      return;
    }

    const wasArmed = session.armed;
    cleanupSessionDom(session);

    if (wasArmed && allowDrop && enabledRef.current) {
      const underPointer = document.elementFromPoint(event.clientX, event.clientY);
      const cauldron =
        underPointer instanceof Element ? underPointer.closest(CAULDRON_SELECTOR) : null;
      if (cauldron !== null) {
        onAddRef.current(ingredientIdRef.current);
      }
    }

    if (wasArmed) {
      onDraggingChangeRef.current?.(false);
    }

    resetUiFlags();
    releaseCapture(event.currentTarget, event.pointerId);
    sessionRef.current = null;
    suppressNativeDragRef.current = false;
  };

  const armSession = (): void => {
    const session = sessionRef.current;
    const source = cardRef.current;
    if (session === null || session.armed || source === null) {
      return;
    }

    clearArmTimer(session);

    if (!enabledRef.current) {
      cleanupSessionDom(session);
      resetUiFlags();
      suppressNativeDragRef.current = false;
      sessionRef.current = null;
      return;
    }

    const ghost = createGhost(source, session.width, session.height);
    positionGhost(ghost, session.lastX, session.lastY, session.offsetX, session.offsetY);
    document.body.appendChild(ghost);

    session.armed = true;
    session.ghost = ghost;
    suppressClickRef.current = true;
    setIsTouchPressed(false);
    setIsTouchDragging(true);
    onDraggingChangeRef.current?.(true);
    pulseHaptic();
    syncDropTarget(session.lastX, session.lastY);
  };

  useEffect(() => {
    return () => {
      const session = sessionRef.current;
      if (session === null) {
        return;
      }
      cleanupSessionDom(session);
      sessionRef.current = null;
      suppressNativeDragRef.current = false;
    };
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>): void => {
    if (!enabled || event.pointerType !== 'touch' || event.button !== 0) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    suppressNativeDragRef.current = true;
    suppressClickRef.current = false;
    setIsTouchPressed(true);
    setIsTouchDragging(false);

    const session: TouchDragSession = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      armed: false,
      armTimerId: null,
      ghost: null,
    };
    session.armTimerId = window.setTimeout(() => {
      armSession();
    }, LONG_PRESS_MS);
    sessionRef.current = session;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>): void => {
    const session = sessionRef.current;
    if (session === null || session.pointerId !== event.pointerId) {
      return;
    }

    session.lastX = event.clientX;
    session.lastY = event.clientY;

    if (!session.armed) {
      const deltaX = event.clientX - session.startX;
      const deltaY = event.clientY - session.startY;
      if (Math.hypot(deltaX, deltaY) > HOLD_SLOP_PX) {
        endSession(event, false);
      }
      return;
    }

    event.preventDefault();

    if (session.ghost !== null) {
      positionGhost(session.ghost, event.clientX, event.clientY, session.offsetX, session.offsetY);
    }
    syncDropTarget(event.clientX, event.clientY);
  };

  const onPointerUp = (event: PointerEvent<HTMLButtonElement>): void => {
    endSession(event, true);
  };

  const onPointerCancel = (event: PointerEvent<HTMLButtonElement>): void => {
    endSession(event, false);
  };

  return {
    cardRef,
    isTouchPressed,
    isTouchDragging,
    shouldSuppressNativeDrag: () => suppressNativeDragRef.current,
    consumeClickSuppression: () => {
      if (!suppressClickRef.current) {
        return false;
      }
      suppressClickRef.current = false;
      return true;
    },
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
  };
}
