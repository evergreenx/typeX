"use client";

import { useEffect, useRef } from "react";
import { CharStatus } from "@/hooks/useTypingEngine";

type Props = {
  target: string;
  value: string;
  statuses: CharStatus[];
  onChangeValue: (value: string) => void;
  disabled?: boolean;
  scrollable?: boolean;
};

export function TypingArea({ target, value, statuses, onChangeValue, disabled, scrollable }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (scrollable) currentRef.current?.scrollIntoView({ block: "center" });
  }, [value.length, scrollable]);

  return (
    <div
      className={[
        "relative w-full max-w-3xl mx-auto cursor-text",
        scrollable ? "max-h-32 overflow-hidden" : "",
      ].join(" ")}
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        value={value}
        disabled={disabled}
        onChange={(e) => onChangeValue(e.target.value)}
        className="absolute inset-0 opacity-0 pointer-events-none"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
      />
      <p className="font-mono text-2xl leading-relaxed tracking-wide">
        {target.split("").map((char, i) => {
          const status = statuses[i];
          const classes: Record<CharStatus, string> = {
            pending: "text-neutral-600",
            current: "text-neutral-100 border-b-2 border-emerald-400 animate-pulse",
            correct: "text-emerald-400",
            incorrect: "text-rose-400 bg-rose-500/10",
          };
          return (
            <span key={i} ref={status === "current" ? currentRef : undefined} className={classes[status]}>
              {char}
            </span>
          );
        })}
      </p>
    </div>
  );
}
