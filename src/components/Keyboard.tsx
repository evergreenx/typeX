"use client";

import { KEYBOARD_ROWS, FINGER_COLOR, KEY_FINGER_MAP, needsShift, resolveBaseChar } from "@/lib/keyboard";

type Props = {
  nextChar?: string;
  errorCounts?: Record<string, number>;
};

export function Keyboard({ nextChar, errorCounts }: Props) {
  const activeBase = nextChar ? resolveBaseChar(nextChar) : undefined;
  const activeShift = nextChar ? needsShift(nextChar) : false;
  const maxError = errorCounts ? Math.max(1, ...Object.values(errorCounts)) : 1;

  return (
    <div className="w-full max-w-2xl mx-auto select-none">
      <div className="flex flex-col gap-1.5">
        {KEYBOARD_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1.5">
            {row.map((k) => {
              const isActive = !k.special && k.key === activeBase;
              const finger = KEY_FINGER_MAP[k.key];
              const errorCount = errorCounts?.[k.key] ?? 0;
              const heat = errorCounts ? errorCount / maxError : 0;

              return (
                <div
                  key={k.key}
                  style={{
                    flex: k.flex ?? 1,
                    borderColor: finger && !k.special ? FINGER_COLOR[finger] : undefined,
                    boxShadow: isActive ? `0 0 0 2px ${finger ? FINGER_COLOR[finger] : "#fff"}` : undefined,
                    backgroundColor: errorCounts && heat > 0 ? `rgba(239,68,68,${0.15 + heat * 0.55})` : undefined,
                  }}
                  className={[
                    "h-9 rounded-md border text-[11px] flex items-center justify-center font-medium transition-all",
                    k.special
                      ? "border-neutral-700 bg-neutral-900 text-neutral-400"
                      : "bg-neutral-900/60 text-neutral-200",
                    isActive ? "scale-105 bg-neutral-800 text-white" : "",
                  ].join(" ")}
                >
                  {k.label ?? k.key.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {activeShift && (
        <p className="text-center text-xs text-neutral-500 mt-2">hold Shift for this key</p>
      )}
    </div>
  );
}
