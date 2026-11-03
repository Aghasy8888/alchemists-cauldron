import type { AudioGraph } from './context';

function scheduleBeep(graph: AudioGraph, start: number, frequency: number): void {
  const { context, master } = graph;
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.value = frequency;
  // Avoid zero for exponentialRampToValueAtTime
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.12, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
  oscillator.connect(gain);
  gain.connect(master);
  oscillator.start(start);
  oscillator.stop(start + 0.18);
}

/** Short dual-tone alert when the HUD timer turns urgent/red. */
export function playUrgentTimerCue(graph: AudioGraph): void {
  const now = graph.context.currentTime;
  scheduleBeep(graph, now, 880);
  scheduleBeep(graph, now + 0.2, 1175);
}
