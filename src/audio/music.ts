import musicUrl from '../assets/audio/wizardtorium.mp3';
import { getAudioGraph, unlockAudio, type AudioGraph } from './context';

/**
 * "Wizardtorium" by Kevin MacLeod (incompetech.com)
 * Licensed under Creative Commons Attribution 4.0
 * https://creativecommons.org/licenses/by/4.0/
 */

type MusicBed = {
  stop: () => void;
};

type MusicSession = {
  desired: boolean;
  paused: boolean;
  audible: boolean;
  pending: boolean;
  bed: MusicBed | null;
};

const session: MusicSession = {
  desired: false,
  paused: false,
  audible: false,
  pending: false,
  bed: null,
};

let bufferPromise: Promise<AudioBuffer | null> | null = null;

function loadMusicBuffer(context: AudioContext): Promise<AudioBuffer | null> {
  if (bufferPromise === null) {
    bufferPromise = fetch(musicUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Music file failed to load');
        }
        return response.arrayBuffer();
      })
      .then((data) => context.decodeAudioData(data))
      .catch(() => {
        bufferPromise = null;
        return null;
      });
  }
  return bufferPromise;
}

function createMusicBed(graph: AudioGraph, buffer: AudioBuffer): MusicBed {
  const { context, music } = graph;
  const now = context.currentTime;
  const source = context.createBufferSource();
  const gain = context.createGain();
  source.buffer = buffer;
  source.loop = true;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(1, now + 0.8);
  source.connect(gain);
  gain.connect(music);
  source.start(now);

  return {
    stop: () => {
      const stopAt = context.currentTime;
      try {
        gain.gain.cancelScheduledValues(stopAt);
        gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), stopAt);
        gain.gain.exponentialRampToValueAtTime(0.0001, stopAt + 0.25);
        source.stop(stopAt + 0.3);
      } catch {
        // Already stopped or context closed.
      }
    },
  };
}

function stopAudibleBed(): void {
  if (session.bed !== null) {
    session.bed.stop();
    session.bed = null;
  }
  session.audible = false;
}

function startAudibleBed(): void {
  if (session.audible || session.pending || session.paused) {
    return;
  }
  const graph = getAudioGraph();
  if (graph === null) {
    return;
  }
  unlockAudio();
  session.pending = true;
  void loadMusicBuffer(graph.context).then((buffer) => {
    session.pending = false;
    if (!session.desired || session.paused || session.audible || buffer === null) {
      return;
    }
    const current = getAudioGraph();
    if (current === null) {
      return;
    }
    try {
      session.bed = createMusicBed(current, buffer);
      session.audible = true;
    } catch {
      session.bed = null;
      session.audible = false;
    }
  });
}

/** Begin the background bed (idempotent). Keeps logical “on” even when muted. */
export function startMusic(): void {
  session.desired = true;
  session.paused = false;
  startAudibleBed();
}

/** Silence the bed but remember it should resume later. */
export function pauseMusic(): void {
  if (!session.desired) {
    return;
  }
  session.paused = true;
  stopAudibleBed();
}

/** Restart the bed only after startMusic and while still desired. */
export function resumeMusic(): void {
  if (!session.desired || session.audible) {
    return;
  }
  session.paused = false;
  startAudibleBed();
}

/** Full stop; clear desired so resumeMusic is a no-op until startMusic. */
export function stopMusic(): void {
  session.desired = false;
  session.paused = false;
  stopAudibleBed();
}
