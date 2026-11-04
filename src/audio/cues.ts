import type { AudioGraph } from './context';

const DEFAULT_PEAK_GAIN = 0.12;
const DEFAULT_DURATION_SEC = 0.18;

type BeepOptions = {
  peakGain?: number;
  durationSec?: number;
};

function scheduleBeep(
  graph: AudioGraph,
  start: number,
  frequency: number,
  options: BeepOptions = {},
): void {
  const peakGain = options.peakGain ?? DEFAULT_PEAK_GAIN;
  const durationSec = options.durationSec ?? DEFAULT_DURATION_SEC;
  const { context, master } = graph;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.value = frequency;
  // Avoid zero for exponentialRampToValueAtTime
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peakGain, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec - 0.02);
  oscillator.connect(gain);
  gain.connect(master);
  oscillator.start(start);
  oscillator.stop(start + durationSec);
}

/** Short dual-tone alert when the HUD timer turns urgent/red. */
export function playUrgentTimerCue(graph: AudioGraph): void {
  const now = graph.context.currentTime;
  scheduleBeep(graph, now, 880);
  scheduleBeep(graph, now + 0.2, 1175);
}

export function playBrewSuccessCue(graph: AudioGraph): void {
  const now = graph.context.currentTime;
  scheduleBeep(graph, now, 523);
  scheduleBeep(graph, now + 0.12, 784);
}

export function playBrewFailCue(graph: AudioGraph): void {
  const now = graph.context.currentTime;
  scheduleBeep(graph, now, 220);
  scheduleBeep(graph, now + 0.1, 185);
}

/** Soft single blip when an ingredient is successfully added. */
export function playAddIngredientCue(graph: AudioGraph): void {
  const now = graph.context.currentTime;
  scheduleBeep(graph, now, 440, { peakGain: 0.08, durationSec: 0.12 });
}

/** Soft descending pair when the cauldron is poured out. */
export function playPourOutCue(graph: AudioGraph): void {
  const now = graph.context.currentTime;
  scheduleBeep(graph, now, 392, { peakGain: 0.1, durationSec: 0.14 });
  scheduleBeep(graph, now + 0.1, 294, { peakGain: 0.09, durationSec: 0.14 });
}

/** Quiet high tick when the HUD score increases. */
export function playScoreUpCue(graph: AudioGraph): void {
  const now = graph.context.currentTime;
  scheduleBeep(graph, now, 660, { peakGain: 0.06, durationSec: 0.1 });
}

/** Soft low thud when a life is lost. */
export function playLifeLostCue(graph: AudioGraph): void {
  const now = graph.context.currentTime;
  scheduleBeep(graph, now, 160, { peakGain: 0.07, durationSec: 0.14 });
}

/** Soft navigation tick for menu / dialog chrome. */
export function playUiClickCue(graph: AudioGraph): void {
  const now = graph.context.currentTime;
  scheduleBeep(graph, now, 520, { peakGain: 0.05, durationSec: 0.08 });
}
