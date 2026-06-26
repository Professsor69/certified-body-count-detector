// Web Audio API sound synthesizer — no audio files needed, fully offline

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.3,
  fadeOut = true
) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    if (fadeOut) {
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + duration
      );
    }

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Silently fail if audio unavailable
  }
}

export const Sounds = {
  click: () => {
    playTone(800, 0.08, "square", 0.2);
  },

  scanStart: () => {
    playTone(200, 0.3, "sawtooth", 0.1);
    setTimeout(() => playTone(400, 0.3, "sawtooth", 0.1), 150);
    setTimeout(() => playTone(600, 0.4, "sawtooth", 0.12), 300);
  },

  warning: () => {
    playTone(880, 0.1, "square", 0.3);
    setTimeout(() => playTone(660, 0.1, "square", 0.3), 120);
    setTimeout(() => playTone(880, 0.2, "square", 0.3), 240);
  },

  complete: () => {
    // Rising triumphant chord
    playTone(523, 0.2, "sine", 0.25); // C5
    setTimeout(() => playTone(659, 0.2, "sine", 0.25), 100); // E5
    setTimeout(() => playTone(784, 0.2, "sine", 0.25), 200); // G5
    setTimeout(() => playTone(1047, 0.5, "sine", 0.3), 300); // C6
  },

  rare: () => {
    // Magical rainbow arpeggio
    const notes = [523, 659, 784, 1047, 1319, 1568];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.4, "sine", 0.2), i * 100);
    });
  },

  gold: () => {
    const notes = [659, 784, 988, 1319];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.5, "triangle", 0.25), i * 120);
    });
  },
};
