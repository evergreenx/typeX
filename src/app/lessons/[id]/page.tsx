"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/Nav";
import { TypingArea } from "@/components/TypingArea";
import { Keyboard } from "@/components/Keyboard";
import { StatsBar } from "@/components/StatsBar";
import { ResultsScreen } from "@/components/ResultsScreen";
import { useTypingEngine } from "@/hooks/useTypingEngine";
import { getLesson, LESSONS } from "@/lib/lessons";
import { recordSession } from "@/lib/storage";
import Link from "next/link";

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const lesson = getLesson(id);
  const router = useRouter();

  const [drillIndex, setDrillIndex] = useState(0);
  const drills = lesson?.drills ?? [];
  const target = drills[drillIndex] ?? "";

  const engine = useTypingEngine(target);

  if (!lesson) {
    return (
      <div className="flex-1 flex flex-col">
        <Nav />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-neutral-500">Lesson not found.</p>
        </main>
      </div>
    );
  }

  const isLastDrill = drillIndex === drills.length - 1;

  function handleNext() {
    if (!engine.result) return;
    if (isLastDrill) {
      const currentIdx = LESSONS.findIndex((l) => l.id === lesson!.id);
      const next = LESSONS[currentIdx + 1];
      recordSession({
        mode: "lesson",
        lessonId: lesson!.id,
        wpm: engine.result.wpm,
        accuracy: engine.result.accuracy,
        keyErrors: engine.result.keyErrors,
      });
      router.push(next ? `/lessons/${next.id}` : "/lessons");
    } else {
      setDrillIndex((i) => i + 1);
      engine.reset();
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Nav />
      <main className="flex-1 flex flex-col items-center px-6 py-10">
        <div className="w-full max-w-2xl mx-auto mb-8 text-center">
          <p className="text-sm text-neutral-500 mb-1">
            Lesson · Drill {drillIndex + 1} of {drills.length}
          </p>
          <h1 className="text-xl font-semibold">{lesson.title}</h1>
        </div>

        {engine.result ? (
          <ResultsScreen
            result={engine.result}
            onRetry={() => engine.reset()}
            onNext={handleNext}
            nextLabel={isLastDrill ? "Next Lesson" : "Next Drill"}
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

        <Link href="/lessons" className="text-sm text-neutral-600 hover:text-neutral-400 mt-12">
          ← Back to lessons
        </Link>
      </main>
    </div>
  );
}
