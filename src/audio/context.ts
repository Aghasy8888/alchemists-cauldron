import { getSettings } from '../storage/settings';

/** Ceiling for the music bus under master (scaled by musicVolume). */
const MUSIC_BUS_GAIN = 0.3;

export type AudioGraph = {
  context: AudioContext;
  master: GainNode;
  music: GainNode;
};

let sharedGraph: AudioGraph | null = null;

function createAudioGraph(): AudioGraph | null {
  try {
    const context = new AudioContext();
    const master = context.createGain();
    const music = context.createGain();
    music.connect(master);
    master.connect(context.destination);
    return { context, master, music };
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
      syncMusicGain();
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

/** Apply musicVolume from player settings onto the music bus gain. */
export function syncMusicGain(): void {
  const graph = sharedGraph;
  if (graph === null) {
    return;
  }
  const { musicVolume } = getSettings();
  graph.music.gain.value = MUSIC_BUS_GAIN * musicVolume;
}

/** Call from a user gesture so later SFX are not blocked by autoplay policy. */
export function unlockAudio(): void {
  const graph = getAudioGraph();
  if (graph === null) {
    return;
  }
  syncMasterGain();
  syncMusicGain();
  if (graph.context.state === 'suspended') {
    void graph.context.resume();
  }
}
