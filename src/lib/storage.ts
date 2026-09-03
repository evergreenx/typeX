export type SessionResult = {
  date: string; // YYYY-MM-DD
  timestamp: number;
  mode: "lesson" | "practice";
  lessonId?: string;
  wpm: number;
  accuracy: number;
};

type Progress = {
  completedLessons: string[];
  bestWpm: number;
  streak: { count: number; lastDate: string | null };
  history: SessionResult[];
  keyErrors: Record<string, number>;
};

const KEY = "typex:progress";

const DEFAULT_PROGRESS: Progress = {
  completedLessons: [],
  bestWpm: 0,
  streak: { count: 0, lastDate: null },
  history: [],
  keyErrors: {},
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadProgress(): Progress {
  if (!isBrowser()) return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveProgress(progress: Progress) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(progress));
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function updateStreak(streak: Progress["streak"]): Progress["streak"] {
  const today = todayStr();
  if (streak.lastDate === today) return streak;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const count = streak.lastDate === yesterday ? streak.count + 1 : 1;
  return { count, lastDate: today };
}

export function recordSession(params: {
  mode: "lesson" | "practice";
  lessonId?: string;
  wpm: number;
  accuracy: number;
  keyErrors: Record<string, number>;
}): Progress {
  const progress = loadProgress();

  const result: SessionResult = {
    date: todayStr(),
    timestamp: Date.now(),
    mode: params.mode,
    lessonId: params.lessonId,
    wpm: params.wpm,
    accuracy: params.accuracy,
  };

  const mergedKeyErrors = { ...progress.keyErrors };
  for (const [k, v] of Object.entries(params.keyErrors)) {
    mergedKeyErrors[k] = (mergedKeyErrors[k] ?? 0) + v;
  }

  const completedLessons =
    params.mode === "lesson" && params.lessonId && !progress.completedLessons.includes(params.lessonId)
      ? [...progress.completedLessons, params.lessonId]
      : progress.completedLessons;

  const next: Progress = {
    completedLessons,
    bestWpm: Math.max(progress.bestWpm, params.wpm),
    streak: updateStreak(progress.streak),
    history: [...progress.history, result].slice(-50),
    keyErrors: mergedKeyErrors,
  };

  saveProgress(next);
  return next;
}

export function resetProgress() {
  saveProgress(DEFAULT_PROGRESS);
}
