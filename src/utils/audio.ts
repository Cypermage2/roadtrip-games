// Web Audio API sound effect generator for road trip games
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playDiceRollSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Series of clacking wooden/plastic dice impacts
    const hitTimes = [0, 0.08, 0.17, 0.28, 0.40, 0.54, 0.70, 0.88];

    hitTimes.forEach((delay, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Pitch varies slightly for each clack
      const baseFreq = 280 + Math.random() * 260 + (index * 25);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now + delay);
      osc.frequency.exponentialRampToValueAtTime(80, now + delay + 0.04);

      // Short decay impulse
      const vol = 0.22 - (index * 0.015);
      gain.gain.setValueAtTime(Math.max(vol, 0.06), now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.06);
    });

    // Final crisp pop at the end
    setTimeout(() => {
      playRollCompleteChime();
    }, 900);
  } catch {
    // Audio context might be restricted, fail gracefully
  }
}

export function playRollCompleteChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 cheerful arpeggio
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.06);

      gain.gain.setValueAtTime(0.18, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.4);
    });
  } catch {
    // Graceful fallback
  }
}

export function playButtonTapSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch {
    // Graceful fallback
  }
}

export function triggerHapticFeedback(pattern = [30]) {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Ignore vibration error
    }
  }
}
