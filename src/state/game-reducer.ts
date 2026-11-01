import { GAME_STATUS, type IGameState } from '../data/types';
import { addIngredient } from '../logic/add-ingredient';
import { brew } from '../logic/brew';
import { applyEndChecks } from '../logic/game-over';
import { pauseRun, resumeRun } from '../logic/pause';
import { pourOut } from '../logic/pour-out';
import { applyReactionTransitions } from '../logic/reaction-transitions';
import { createEndTime } from '../logic/timer';
import { GAME_ACTION, type GameAction } from './game-actions';
import { createMenuState, startNewGame } from './game-state';

const {
  startGame,
  continueGame,
  exitToMenu,
  setDifficulty,
  addIngredient: addIngredientAction,
  brew: brewAction,
  pourOut: pourOutAction,
  pause,
  resume,
  syncTimeLeft,
} = GAME_ACTION;

const { menu, playing, paused } = GAME_STATUS;

export function gameReducer(state: IGameState, action: GameAction): IGameState {
  switch (action.type) {
    case startGame: {
      return startNewGame(state);
    }

    case continueGame: {
      return action.state;
    }

    case exitToMenu: {
      return createMenuState(state.difficulty);
    }

    case setDifficulty: {
      if (state.status !== menu) {
        return state;
      }
      return {
        ...state,
        difficulty: action.difficulty,
      };
    }

    case addIngredientAction: {
      if (state.status !== playing) {
        return state;
      }
      const before = state.cauldronIngredients;
      const afterAdd = addIngredient(state, action.id);
      if (afterAdd === state) {
        return state;
      }
      return applyEndChecks(applyReactionTransitions(before, afterAdd));
    }

    case brewAction: {
      if (state.status !== playing) {
        return state;
      }
      return brew(state).state;
    }

    case pourOutAction: {
      if (state.status !== playing) {
        return state;
      }
      return pourOut(state);
    }

    case pause: {
      if (state.status !== playing) {
        return state;
      }
      return pauseRun(state);
    }

    case resume: {
      if (state.status !== paused) {
        return state;
      }
      return resumeRun(state);
    }

    case syncTimeLeft: {
      if (state.status !== playing) {
        return state;
      }
      const timeLeft = Math.max(0, action.timeLeft);
      return applyEndChecks({
        ...state,
        timeLeft,
        endTime: timeLeft > 0 ? createEndTime(timeLeft) : null,
      });
    }

    default: {
      return state;
    }
  }
}
