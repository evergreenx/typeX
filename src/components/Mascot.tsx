"use client";

import { useEffect, useRef, useState } from "react";
import { MascotMessage } from "@/lib/mascot";
import { playBlip } from "@/lib/sound";
import { useSettings } from "@/lib/settings";

const FACE: Record<MascotMessage["mood"], { eyes: string }> = {
  happy: { eyes: "•‿•" },
  excited: { eyes: "★‿★" },
  thinking: { eyes: "•_•" },
  waving: { eyes: "◕‿◕" },
};

const CHAR_INTERVAL_MS = 22;

export function Mascot({ message, className }: { message: MascotMessage; className?: string }) {
  const { settings } = useSettings();
  const face = FACE[message.mood];
  const fullText = message.lines.join("\n");
  const [revealCount, setRevealCount] = useState(0);
  const blipSeed = useRef(0);

  useEffect(() => {
    setRevealCount(0);

    if (settings.voiceMode === "speak" && settings.soundEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(fullText);
      utterance.rate = 1.05;
      utterance.pitch = 1.3;
      window.speechSynthesis.speak(utterance);
    }

    const id = setInterval(() => {
      setRevealCount((n) => {
        const next = n + 1;
        if (settings.voiceMode === "blip" && settings.soundEnabled && next % 2 === 0 && next <= fullText.length) {
          blipSeed.current += 1;
          playBlip(blipSeed.current);
        }
        if (next >= fullText.length) clearInterval(id);
        return next;
      });
    }, CHAR_INTERVAL_MS);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullText, settings.voiceMode, settings.soundEnabled]);

  const revealedText = fullText.slice(0, revealCount);
  const revealedLines = revealedText.split("\n");

  return (
    <div className={["flex items-end gap-3", className ?? ""].join(" ")}>
      <div
        className="shrink-0 w-14 h-14 rounded-2xl bg-emerald-400 flex items-center justify-center text-black font-mono text-sm font-bold shadow-lg shadow-emerald-500/20"
        style={{ animation: "typex-bounce 2.4s ease-in-out infinite" }}
      >
        {face.eyes}
      </div>
      <div className="relative rounded-2xl rounded-bl-sm border border-neutral-800 bg-neutral-900 px-4 py-3 max-w-xs min-h-[3.25rem]">
        {message.lines.map((line, i) => (
          <p key={i} className={`text-sm ${i === 0 ? "text-neutral-100 font-medium" : "text-neutral-400 mt-1"}`}>
            {revealedLines[i] ?? ""}
            {i === revealedLines.length - 1 && revealCount < fullText.length && (
              <span className="inline-block w-1.5 h-3.5 bg-neutral-500 ml-0.5 align-middle animate-pulse" />
            )}
          </p>
        ))}
      </div>
      <style>{`
        @keyframes typex-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
