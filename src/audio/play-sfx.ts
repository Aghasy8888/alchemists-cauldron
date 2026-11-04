import { getSettings } from '../storage/settings';
import { getAudioGraph, syncMasterGain, type AudioGraph } from './context';
import {
  playAddIngredientCue,
  playBrewFailCue,
  playBrewSuccessCue,
  playLifeLostCue,
  playPourOutCue,
  playScoreUpCue,
  playUiClickCue,
  playUrgentTimerCue,
} from './cues';
import { SFX_ID, type SfxId } from './sfx-id';

const { urgentTimer, brewSuccess, brewFail, addIngredient, pourOut, scoreUp, lifeLost, uiClick } =
  SFX_ID;

type CuePlayer = (graph: AudioGraph) => void;

const CUE_BY_ID = {
  [urgentTimer]: playUrgentTimerCue,
  [brewSuccess]: playBrewSuccessCue,
  [brewFail]: playBrewFailCue,
  [addIngredient]: playAddIngredientCue,
  [pourOut]: playPourOutCue,
  [scoreUp]: playScoreUpCue,
  [lifeLost]: playLifeLostCue,
  [uiClick]: playUiClickCue,
} as const satisfies Record<SfxId, CuePlayer>;

function scheduleCue(id: SfxId): void {
  const graph = getAudioGraph();
  if (graph === null) {
    return;
  }

  syncMasterGain();

  const play = (): void => {
    try {
      CUE_BY_ID[id](graph);
    } catch {
      // Ignore environments where oscillator scheduling fails.
    }
  };

  if (graph.context.state === 'suspended') {
    void graph.context.resume().then(play);
    return;
  }
  play();
}

/** Play a named SFX through the shared graph; no-ops when muted or volume is 0. */
export function playSfx(id: SfxId): void {
  const { muted, volume } = getSettings();
  if (muted || volume === 0) {
    return;
  }
  scheduleCue(id);
}
