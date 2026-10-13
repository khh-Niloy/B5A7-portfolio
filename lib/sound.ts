// Lightweight Web Audio API click/tap sound generator
// No external assets required, zero network overhead, respectful of user preferences

let audioCtx: AudioContext | null = null;

export const isSoundEnabled = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("portfolio_sound_enabled") === "true";
};

export const setSoundEnabled = (enabled: boolean): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("portfolio_sound_enabled", enabled ? "true" : "false");
};

export const playUiClick = (): void => {
  if (!isSoundEnabled() || typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  } catch {
    // Ignore audio context errors gracefully
  }
};
