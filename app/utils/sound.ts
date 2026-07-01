// Small audio-feedback helpers for QR attendance scanning. Tones are generated
// with the Web Audio API so no audio files are needed. Browser-only (guards for
// SSR) and self-unlocking on a user gesture via primeAudio().

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!audioCtx) {
      const Ctx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return null;
      audioCtx = new Ctx();
    }
    // Autoplay policies suspend the context until a user gesture resumes it.
    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Unlock/warm up the audio context. Call from a user gesture (e.g. opening the
 * scanner) so later, scan-triggered tones are allowed to play.
 */
export function primeAudio() {
  getCtx();
}

function tone(
  ctx: AudioContext,
  freq: number,
  startAt: number,
  duration: number,
  type: OscillatorType,
  peakGain: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);
  // Quick attack + decay so it sounds like a clean beep (no clicks).
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(peakGain, startAt + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
}

/** Pleasant short two-note "ding" for a successful scan. */
export function playSuccessBeep() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  tone(ctx, 880, now, 0.12, "sine", 0.2); // A5
  tone(ctx, 1174.66, now + 0.1, 0.16, "sine", 0.2); // D6
}

/** Harsh low buzzer for a failed / invalid scan. */
export function playErrorBuzzer() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  tone(ctx, 160, now, 0.2, "square", 0.18);
  tone(ctx, 110, now + 0.14, 0.26, "square", 0.18);
}
