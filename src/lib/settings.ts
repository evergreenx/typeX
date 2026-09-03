"use client";

import { useCallback, useEffect, useState } from "react";

export type VoiceMode = "blip" | "speak" | "off";

export type Settings = {
  soundEnabled: boolean;
  voiceMode: VoiceMode;
};

const KEY = "typex:settings";

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  voiceMode: "blip",
};

function isBrowser() {
  return typeof window !== "undefined";
}

function load(): Settings {
  if (!isBrowser()) return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function save(settings: Settings) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(settings));
}

const listeners = new Set<(s: Settings) => void>();
let current = DEFAULT_SETTINGS;

function setAndBroadcast(next: Settings) {
  current = next;
  save(next);
  listeners.forEach((l) => l(next));
}

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    current = load();
    setSettings(current);
    const listener = (s: Settings) => setSettings(s);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toggleSound = useCallback(() => {
    setAndBroadcast({ ...current, soundEnabled: !current.soundEnabled });
  }, []);

  const cycleVoiceMode = useCallback(() => {
    const order: VoiceMode[] = ["blip", "speak", "off"];
    const next = order[(order.indexOf(current.voiceMode) + 1) % order.length];
    setAndBroadcast({ ...current, voiceMode: next });
  }, []);

  return { settings, toggleSound, cycleVoiceMode };
}
