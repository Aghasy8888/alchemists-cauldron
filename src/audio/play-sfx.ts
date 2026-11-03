import { getSettings } from '../storage/settings';
import { getAudioGraph, syncMasterGain } from './context';
import { playUrgentTimerCue } from './cues';
import { SFX_ID, type SfxId } from './sfx-id';

const { urgentTimer } = SFX_ID;

function scheduleCue(id: SfxId): void {
  const graph = getAudioGraph();
  if (graph === null) {
    return;
  }

  syncMasterGain();

  const play = (): void => {
    try {
      switch (id) {
        case urgentTimer: {
          playUrgentTimerCue(graph);
          break;
        }
        default: {
          break;
        }
      }
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
