"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { LESSONS } from "@/lib/lessons";
import { loadProgress } from "@/lib/storage";

export default function LessonsPage() {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    setCompleted(loadProgress().completedLessons);
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <Nav />
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-8">Lessons</h1>
        <div className="flex flex-col gap-3">
          {LESSONS.map((lesson, i) => {
            const done = completed.includes(lesson.id);
            const locked = i > 0 && !completed.includes(LESSONS[i - 1].id);
            return (
              <Link
                key={lesson.id}
                href={locked ? "#" : `/lessons/${lesson.id}`}
                aria-disabled={locked}
                className={[
                  "flex items-center justify-between rounded-xl border px-5 py-4 transition",
                  locked
                    ? "border-neutral-900 text-neutral-600 cursor-not-allowed"
                    : "border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50",
                ].join(" ")}
              >
                <div>
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-neutral-500">{lesson.description}</p>
                </div>
                <span className="text-sm">
                  {done ? "✅" : locked ? "🔒" : "→"}
                </span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
