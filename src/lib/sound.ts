let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq: number, durationMs: number, type: OscillatorType = "sine", gain = 0.05) {
  const audioCtx = getContext();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gainNode.gain.value = gain;
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + durationMs / 1000);
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + durationMs / 1000);
}

export function playKeyClick(correct: boolean) {
  if (correct) {
    tone(720, 40, "square", 0.04);
  } else {
    tone(160, 90, "sawtooth", 0.05);
  }
}

export function playBlip(seed = 0) {
  // pitch wobbles a bit per call so a run of blips sounds like chatter, not a metronome
  const wobble = ((seed * 37) % 5) * 12;
  tone(320 + wobble, 55, "square", 0.035);
}

export function unlockAudio() {
  getContext();
}
