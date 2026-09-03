import { TypingResult } from "@/hooks/useTypingEngine";
import { Keyboard } from "@/components/Keyboard";
import { Mascot } from "@/components/Mascot";
import { MascotMessage } from "@/lib/mascot";

type Props = {
  result: TypingResult;
  onRetry: () => void;
  onNext?: () => void;
  nextLabel?: string;
  mascotMessage?: MascotMessage;
};

export function ResultsScreen({ result, onRetry, onNext, nextLabel, mascotMessage }: Props) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      {mascotMessage && (
        <div className="flex justify-center mb-8">
          <Mascot message={mascotMessage} />
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-10">
        <Metric label="WPM" value={result.wpm} />
        <Metric label="Accuracy" value={`${result.accuracy}%`} />
        <Metric label="Time" value={`${result.timeSeconds}s`} />
        <Metric label="Mistakes" value={result.mistakes} />
      </div>

      {Object.keys(result.keyErrors).length > 0 && (
        <div className="mb-10">
          <p className="text-sm text-neutral-500 mb-3">Keys you fumbled most</p>
          <Keyboard errorCounts={result.keyErrors} />
        </div>
      )}

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-lg border border-neutral-700 text-neutral-200 hover:bg-neutral-900 transition"
        >
          Retry
        </button>
        {onNext && (
          <button
            onClick={onNext}
            className="px-5 py-2.5 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition"
          >
            {nextLabel ?? "Next"}
          </button>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-neutral-800 py-4">
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-neutral-500 mt-1">{label}</p>
    </div>
  );
}
