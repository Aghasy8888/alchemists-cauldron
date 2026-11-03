import { getSettings } from '../storage/settings';

export type AudioGraph = {
  context: AudioContext;
  master: GainNode;
};

let sharedGraph: AudioGraph | null = null;

function createAudioGraph(): AudioGraph | null {
  try {
    const context = new AudioContext();
    const master = context.createGain();
    master.connect(context.destination);
    return { context, master };
  } catch {
    return null;
  }
}

/** Lazy shared AudioContext + master gain (null if Web Audio is unavailable). */
export function getAudioGraph(): AudioGraph | null {
  if (sharedGraph === null) {
    sharedGraph = createAudioGraph();
    if (sharedGraph !== null) {
      syncMasterGain();
    }
  }
  return sharedGraph;
}

/** Apply mute / volume from player settings onto the master gain. */
export function syncMasterGain(): void {
  const graph = sharedGraph;
  if (graph === null) {
    return;
  }
  const { muted, volume } = getSettings();
  graph.master.gain.value = muted ? 0 : volume;
}

/** Call from a user gesture so later SFX are not blocked by autoplay policy. */
export function unlockAudio(): void {
  const graph = getAudioGraph();
  if (graph === null) {
    return;
  }
  syncMasterGain();
  if (graph.context.state === 'suspended') {
    void graph.context.resume();
  }
}
