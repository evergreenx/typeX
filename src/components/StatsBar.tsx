type Props = {
  wpm: number;
  accuracy: number;
  progress: number;
  timeLeft?: number;
};

export function StatsBar({ wpm, accuracy, progress, timeLeft }: Props) {
  return (
    <div className="w-full max-w-3xl mx-auto flex items-center justify-between mb-8 text-sm">
      <div className="flex gap-6">
        <Stat label="WPM" value={wpm} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
        {timeLeft !== undefined && <Stat label="Time" value={`${timeLeft}s`} />}
      </div>
      <div className="w-40 h-1.5 rounded-full bg-neutral-800 overflow-hidden">
        <div
          className="h-full bg-emerald-400 transition-all"
          style={{ width: `${Math.min(progress, 1) * 100}%` }}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <span className="text-neutral-500 mr-1.5">{label}</span>
      <span className="text-neutral-100 font-semibold tabular-nums">{value}</span>
    </div>
  );
}
