/** Shared AudioContext for short UI chimes (lazy, browser-gated). */
let sharedContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (sharedContext === null) {
      sharedContext = new AudioContext();
    }
    return sharedContext;
  } catch {
    return null;
  }
}

/** Call from a user gesture so later chimes are not blocked by autoplay policy. */
export function unlockAudio(): void {
  const context = getAudioContext();
  if (context === null) {
    return;
  }
  if (context.state === 'suspended') {
    void context.resume();
  }
}

function scheduleBeep(context: AudioContext, start: number, frequency: number): void {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.value = frequency;
  // Avoid zero for exponentialRampToValueAtTime
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.12, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + 0.18);
}

/** Short dual-tone alert when the HUD timer turns urgent/red. */
export function playUrgentTimerChime(): void {
  const context = getAudioContext();
  if (context === null) {
    return;
  }

  const play = (): void => {
    try {
      const now = context.currentTime;
      scheduleBeep(context, now, 880);
      scheduleBeep(context, now + 0.2, 1175);
    } catch {
      // Ignore environments where oscillator scheduling fails.
    }
  };

  if (context.state === 'suspended') {
    void context.resume().then(play);
    return;
  }
  play();
}
