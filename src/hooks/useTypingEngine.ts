"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type CharStatus = "pending" | "current" | "correct" | "incorrect";

export type TypingResult = {
  wpm: number;
  accuracy: number;
  timeSeconds: number;
  mistakes: number;
  keyErrors: Record<string, number>;
};

type Options = {
  /** If set, the session force-finishes after this many seconds instead of waiting for full-text completion. */
  durationSeconds?: number;
};

export function useTypingEngine(target: string, options?: Options) {
  const durationSeconds = options?.durationSeconds;
  const [value, setValue] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [result, setResult] = useState<TypingResult | null>(null);
  const keyErrorsRef = useRef<Record<string, number>>({});
  const seenErrorAtIndex = useRef<Set<number>>(new Set());

  const reset = useCallback(() => {
    setValue("");
    setStartedAt(null);
    setResult(null);
    keyErrorsRef.current = {};
    seenErrorAtIndex.current = new Set();
  }, []);

  const finalize = useCallback(
    (next: string, elapsedMsOverride?: number) => {
      const elapsedMs = Math.max(elapsedMsOverride ?? Date.now() - (startedAt ?? Date.now()), 1000);
      const minutes = elapsedMs / 60000;
      let correct = 0;
      for (let i = 0; i < next.length; i++) {
        if (next[i] === target[i]) correct++;
      }
      const wpm = Math.round(correct / 5 / minutes);
      const accuracy = next.length === 0 ? 0 : Math.round((correct / next.length) * 100);
      setResult({
        wpm: Number.isFinite(wpm) ? wpm : 0,
        accuracy,
        timeSeconds: Math.round(elapsedMs / 1000),
        mistakes: next.length - correct,
        keyErrors: { ...keyErrorsRef.current },
      });
    },
    [target, startedAt]
  );

  const onChangeValue = useCallback(
    (next: string) => {
      if (result) return; // finished, ignore further input
      if (next.length > target.length) next = next.slice(0, target.length);

      if (startedAt === null && next.length > 0) {
        setStartedAt(Date.now());
      }

      // track first-time mistakes per index for the error heatmap
      for (let i = 0; i < next.length; i++) {
        if (next[i] !== target[i] && !seenErrorAtIndex.current.has(i)) {
          seenErrorAtIndex.current.add(i);
          const key = target[i];
          keyErrorsRef.current[key] = (keyErrorsRef.current[key] ?? 0) + 1;
        }
      }

      setValue(next);

      if (!durationSeconds && next.length === target.length) {
        finalize(next);
      }
    },
    [target, startedAt, result, durationSeconds, finalize]
  );

  const statuses = useMemo<CharStatus[]>(() => {
    return target.split("").map((char, i) => {
      if (i < value.length) return value[i] === char ? "correct" : "incorrect";
      if (i === value.length) return "current";
      return "pending";
    });
  }, [target, value]);

  const nextChar = target[value.length];
  const progress = target.length === 0 ? 0 : value.length / target.length;

  const [, forceTick] = useState(0);
  useEffect(() => {
    if (!startedAt || result) return;
    const id = setInterval(() => forceTick((n) => n + 1), 250);
    return () => clearInterval(id);
  }, [startedAt, result]);

  // force-finish a timed session once the clock runs out
  useEffect(() => {
    if (!durationSeconds || !startedAt || result) return;
    const elapsed = (Date.now() - startedAt) / 1000;
    if (elapsed >= durationSeconds) {
      finalize(value, durationSeconds * 1000);
    }
  });

  const timeLeft = useMemo(() => {
    if (!durationSeconds) return undefined;
    if (!startedAt) return durationSeconds;
    const elapsed = (Date.now() - startedAt) / 1000;
    return Math.max(0, Math.ceil(durationSeconds - elapsed));
  }, [durationSeconds, startedAt]);

  const liveWpm = useMemo(() => {
    if (result) return result.wpm;
    if (!startedAt) return 0;
    const minutes = Math.max(Date.now() - startedAt, 1000) / 60000;
    let correct = 0;
    for (let i = 0; i < value.length; i++) if (value[i] === target[i]) correct++;
    return Math.round(correct / 5 / minutes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, startedAt, result]);

  const liveAccuracy = useMemo(() => {
    if (result) return result.accuracy;
    if (value.length === 0) return 100;
    let correct = 0;
    for (let i = 0; i < value.length; i++) if (value[i] === target[i]) correct++;
    return Math.round((correct / value.length) * 100);
  }, [value, target, result]);

  return {
    value,
    onChangeValue,
    statuses,
    nextChar,
    progress,
    result,
    reset,
    liveWpm,
    liveAccuracy,
    timeLeft,
  };
}
