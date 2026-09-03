"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav";
import { TypingArea } from "@/components/TypingArea";
import { Keyboard } from "@/components/Keyboard";
import { StatsBar } from "@/components/StatsBar";
import { ResultsScreen } from "@/components/ResultsScreen";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { QUOTES, randomQuote } from "@/lib/quotes";
import { recordSession } from "@/lib/storage";
import { sessionResultMessage } from "@/lib/mascot";

export default function PracticePage() {
  const [target, setTarget] = useState(QUOTES[0]);
  const engine = useTypingEngine(target);

  // pick a random quote client-side only, to avoid an SSR/client hydration mismatch
  useEffect(() => {
    setTarget(randomQuote());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleNext() {
    if (engine.result) {
      recordSession({
        mode: "practice",
        wpm: engine.result.wpm,
        accuracy: engine.result.accuracy,
        keyErrors: engine.result.keyErrors,
      });
    }
    setTarget(randomQuote(target));
    engine.reset();
  }

  return (
    <div className="flex-1 flex flex-col">
      <Nav />
      <main className="flex-1 flex flex-col items-center px-6 py-10">
        <p className="text-sm text-neutral-500 mb-8">Free Practice</p>

        {engine.result ? (
          <ResultsScreen
            result={engine.result}
            onRetry={() => engine.reset()}
            onNext={handleNext}
            nextLabel="New Quote"
            mascotMessage={sessionResultMessage(engine.result)}
          />
        ) : (
          <>
            <StatsBar wpm={engine.liveWpm} accuracy={engine.liveAccuracy} progress={engine.progress} />
            <div className="mb-14">
              <TypingArea
                target={target}
                value={engine.value}
                statuses={engine.statuses}
                onChangeValue={engine.onChangeValue}
              />
            </div>
            <Keyboard nextChar={engine.nextChar} />
          </>
        )}
      </main>
    </div>
  );
}
