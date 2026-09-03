"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/Nav";
import { TypingArea } from "@/components/TypingArea";
import { Keyboard } from "@/components/Keyboard";
import { StatsBar } from "@/components/StatsBar";
import { ResultsScreen } from "@/components/ResultsScreen";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { randomWords } from "@/lib/words";
import { recordSession } from "@/lib/storage";
import { speedTestMessage, suggestLessonForWpm } from "@/lib/mascot";

const DURATION = 30;

export default function SpeedTestPage() {
  const router = useRouter();
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState(false);
  const engine = useTypingEngine(target, { durationSeconds: DURATION });

  // generate the word stream client-side only, to avoid an SSR/client hydration mismatch
  useEffect(() => {
    setTarget(randomWords(250));
  }, []);

  useEffect(() => {
    if (!engine.result || saved) return;
    recordSession({
      mode: "practice",
      wpm: engine.result.wpm,
      accuracy: engine.result.accuracy,
      keyErrors: engine.result.keyErrors,
    });
    setSaved(true);
  }, [engine.result, saved]);

  const recommendedLesson = useMemo(
    () => (engine.result ? suggestLessonForWpm(engine.result.wpm) : null),
    [engine.result]
  );

  const timeProgress = engine.timeLeft !== undefined ? 1 - engine.timeLeft / DURATION : 0;

  return (
    <div className="flex-1 flex flex-col">
      <Nav />
      <main className="flex-1 flex flex-col items-center px-6 py-10">
        <p className="text-sm text-neutral-500 mb-8">Speed Test · {DURATION}s</p>

        {engine.result ? (
          <ResultsScreen
            result={engine.result}
            onRetry={() => window.location.reload()}
            onNext={() => recommendedLesson && router.push(`/lessons/${recommendedLesson}`)}
            nextLabel="Start Recommended Lesson"
            mascotMessage={speedTestMessage(engine.result)}
          />
        ) : (
          <>
            <StatsBar
              wpm={engine.liveWpm}
              accuracy={engine.liveAccuracy}
              progress={timeProgress}
              timeLeft={engine.timeLeft}
            />
            <div className="mb-14 w-full">
              <TypingArea
                target={target}
                value={engine.value}
                statuses={engine.statuses}
                onChangeValue={engine.onChangeValue}
                scrollable
              />
            </div>
            <Keyboard nextChar={engine.nextChar} />
          </>
        )}
      </main>
    </div>
  );
}
