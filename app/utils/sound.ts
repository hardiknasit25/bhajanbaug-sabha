// Small audio-feedback helpers for QR attendance scanning. Tones are generated
// with the Web Audio API so no audio files are needed. Browser-only (guards for
// SSR) and self-unlocking on a user gesture via primeAudio().

let audioCtx: AudioContext | null = null;
let successAudio: HTMLAudioElement | null = null;

// Public URL of the success sound (lives in /public).
const SUCCESS_SOUND_URL = "/attendance_success.mp3";

function getSuccessAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  try {
    if (!successAudio) {
      successAudio = new Audio(SUCCESS_SOUND_URL);
      successAudio.preload = "auto";
    }
    return successAudio;
  } catch {
    return null;
  }
}

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
  getSuccessAudio(); // create + start preloading the success clip
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

/** Pleasant short two-note "ding" — used as a fallback if the mp3 can't play. */
export function playSuccessBeep() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  tone(ctx, 880, now, 0.12, "sine", 0.2); // A5
  tone(ctx, 1174.66, now + 0.1, 0.16, "sine", 0.2); // D6
}

/**
 * Success feedback for a scan — plays /attendance_success.mp3, falling back to
 * a generated beep if the clip is blocked or missing.
 */
export function playSuccessSound() {
  const audio = getSuccessAudio();
  if (!audio) {
    playSuccessBeep();
    return;
  }
  try {
    audio.currentTime = 0;
    const played = audio.play();
    if (played && typeof played.catch === "function") {
      played.catch(() => playSuccessBeep());
    }
  } catch {
    playSuccessBeep();
  }
}

/** Harsh low buzzer for a failed / invalid scan. */
export function playErrorBuzzer() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  tone(ctx, 160, now, 0.2, "square", 0.18);
  tone(ctx, 110, now + 0.14, 0.26, "square", 0.18);
}
