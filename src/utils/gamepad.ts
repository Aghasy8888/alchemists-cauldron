export const GAMEPAD_ACTION = {
  pause: 'pause',
  brew: 'brew',
  pourOut: 'pour-out',
  shelf0: 'shelf-0',
  shelf1: 'shelf-1',
  shelf2: 'shelf-2',
  shelf3: 'shelf-3',
  shelf4: 'shelf-4',
  shelf5: 'shelf-5',
  shelf6: 'shelf-6',
  shelf7: 'shelf-7',
} as const;

export type GamepadAction = (typeof GAMEPAD_ACTION)[keyof typeof GAMEPAD_ACTION];

const { pause, brew, pourOut, shelf0, shelf1, shelf2, shelf3, shelf4, shelf5, shelf6, shelf7 } =
  GAMEPAD_ACTION;

/** Analog trigger indices — treat value >= threshold as pressed. */
const ANALOG_TRIGGER_INDICES = new Set([6, 7]);
const ANALOG_PRESS_THRESHOLD = 0.5;

export const GAMEPAD_BUTTON_TO_ACTION = {
  9: pause,
  0: brew,
  1: pourOut,
  4: shelf0,
  5: shelf1,
  6: shelf2,
  7: shelf3,
  12: shelf4,
  13: shelf5,
  14: shelf6,
  15: shelf7,
} as const satisfies Partial<Record<number, GamepadAction>>;

const SHELF_ACTION_TO_INDEX: Readonly<Partial<Record<GamepadAction, number>>> = {
  [shelf0]: 0,
  [shelf1]: 1,
  [shelf2]: 2,
  [shelf3]: 3,
  [shelf4]: 4,
  [shelf5]: 5,
  [shelf6]: 6,
  [shelf7]: 7,
};

/** Shelf slot index (0–7) for shelf actions; otherwise null. */
export function shelfIndexFromAction(action: GamepadAction): number | null {
  const index = SHELF_ACTION_TO_INDEX[action];
  return index === undefined ? null : index;
}

/** First connected pad from `navigator.getGamepads()`, or null. */
export function getPrimaryGamepad(): Gamepad | null {
  if (typeof navigator === 'undefined' || typeof navigator.getGamepads !== 'function') {
    return null;
  }
  const pads = navigator.getGamepads();
  for (const pad of pads) {
    if (pad !== null) {
      return pad;
    }
  }
  return null;
}

function isButtonDown(button: GamepadButton, index: number): boolean {
  if (ANALOG_TRIGGER_INDICES.has(index)) {
    return button.pressed || button.value >= ANALOG_PRESS_THRESHOLD;
  }
  return button.pressed;
}

export type GamepadEdgeTracker = {
  sample: (gamepad: Gamepad) => GamepadAction[];
  reset: () => void;
};

/** Tracks button edges so one physical press yields one action. */
export function createGamepadEdgeTracker(): GamepadEdgeTracker {
  let previousDown = new Map<number, boolean>();

  return {
    sample(gamepad: Gamepad): GamepadAction[] {
      const actions: GamepadAction[] = [];
      const nextDown = new Map<number, boolean>();

      for (const [indexKey, action] of Object.entries(GAMEPAD_BUTTON_TO_ACTION)) {
        const index = Number(indexKey);
        const button = gamepad.buttons[index];
        if (button === undefined) {
          continue;
        }
        const down = isButtonDown(button, index);
        nextDown.set(index, down);
        const wasDown = previousDown.get(index) === true;
        if (down && !wasDown) {
          actions.push(action);
        }
      }

      previousDown = nextDown;
      return actions;
    },

    reset(): void {
      previousDown = new Map();
    },
  };
}
