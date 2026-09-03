"use client";

import { useSettings } from "@/lib/settings";
import { unlockAudio } from "@/lib/sound";

const VOICE_LABEL: Record<string, string> = {
  blip: "Key: Blip",
  speak: "Key: Speak",
  off: "Key: Mute",
};

export function SoundSettings() {
  const { settings, toggleSound, cycleVoiceMode } = useSettings();

  return (
    <div className="flex items-center gap-2 text-xs text-neutral-400">
      <button
        onClick={() => {
          unlockAudio();
          toggleSound();
        }}
        className="px-2.5 py-1.5 rounded-md border border-neutral-800 hover:border-neutral-700 hover:text-neutral-100 transition"
        title="Toggle keystroke sound"
      >
        {settings.soundEnabled ? "🔊" : "🔇"}
      </button>
      <button
        onClick={() => {
          unlockAudio();
          cycleVoiceMode();
        }}
        className="px-2.5 py-1.5 rounded-md border border-neutral-800 hover:border-neutral-700 hover:text-neutral-100 transition"
        title="Cycle Key's voice mode"
      >
        {VOICE_LABEL[settings.voiceMode]}
      </button>
    </div>
  );
}
