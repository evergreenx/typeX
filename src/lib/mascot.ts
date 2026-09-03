import { TypingResult } from "@/hooks/useTypingEngine";
import { LESSONS } from "@/lib/lessons";

export type MascotMood = "happy" | "excited" | "thinking" | "waving";

export type MascotMessage = {
  mood: MascotMood;
  lines: string[];
};

function weakestKey(keyErrors: Record<string, number>): string | undefined {
  const entries = Object.entries(keyErrors).filter(([, count]) => count > 0);
  if (entries.length === 0) return undefined;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

function displayKey(key: string): string {
  if (key === " ") return "space";
  return `"${key}"`;
}

export function welcomeMessage(): MascotMessage {
  return {
    mood: "waving",
    lines: [
      "Hey! I'm Key.",
      "I'll cheer you on and call out your weak spots as we go.",
    ],
  };
}

export function sessionResultMessage(result: TypingResult): MascotMessage {
  const weak = weakestKey(result.keyErrors);
  const lines: string[] = [];
  let mood: MascotMood = "happy";

  if (result.accuracy === 100 && result.mistakes === 0) {
    mood = "excited";
    lines.push("Flawless! Not a single miss.");
  } else if (result.accuracy >= 95) {
    mood = "excited";
    lines.push(`${result.wpm} WPM at ${result.accuracy}% — that's sharp.`);
  } else if (result.accuracy >= 80) {
    lines.push(`Solid run: ${result.wpm} WPM, ${result.accuracy}% accuracy.`);
  } else {
    mood = "thinking";
    lines.push("Good effort — accuracy dipped a bit there.");
  }

  if (weak) {
    lines.push(`You're fumbling ${displayKey(weak)} the most. Keep an eye on it.`);
  }

  return { mood, lines };
}

export function suggestLessonForWpm(wpm: number): string {
  if (wpm < 15) return "home-row";
  if (wpm < 25) return "home-row-extended";
  if (wpm < 40) return "top-row";
  if (wpm < 55) return "bottom-row";
  if (wpm < 70) return "numbers";
  return "punctuation";
}

export function speedTestMessage(result: TypingResult): MascotMessage {
  const lessonId = suggestLessonForWpm(result.wpm);
  const lesson = LESSONS.find((l) => l.id === lessonId);
  const base = sessionResultMessage(result);
  return {
    mood: base.mood,
    lines: [
      `${result.wpm} WPM — that's your baseline.`,
      lesson ? `I'd start you on "${lesson.title}". Ready?` : base.lines[0],
    ],
  };
}
