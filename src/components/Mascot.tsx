import { MascotMessage } from "@/lib/mascot";

const FACE: Record<MascotMessage["mood"], { eyes: string; mouth: string }> = {
  happy: { eyes: "•‿•", mouth: "" },
  excited: { eyes: "★‿★", mouth: "" },
  thinking: { eyes: "•_•", mouth: "" },
  waving: { eyes: "◕‿◕", mouth: "" },
};

export function Mascot({ message, className }: { message: MascotMessage; className?: string }) {
  const face = FACE[message.mood];

  return (
    <div className={["flex items-end gap-3", className ?? ""].join(" ")}>
      <div
        className="shrink-0 w-14 h-14 rounded-2xl bg-emerald-400 flex items-center justify-center text-black font-mono text-sm font-bold shadow-lg shadow-emerald-500/20"
        style={{ animation: "typex-bounce 2.4s ease-in-out infinite" }}
      >
        {face.eyes}
      </div>
      <div className="relative rounded-2xl rounded-bl-sm border border-neutral-800 bg-neutral-900 px-4 py-3 max-w-xs">
        {message.lines.map((line, i) => (
          <p key={i} className={`text-sm ${i === 0 ? "text-neutral-100 font-medium" : "text-neutral-400 mt-1"}`}>
            {line}
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
