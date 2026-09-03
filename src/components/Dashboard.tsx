"use client";

import { useEffect, useState } from "react";
import { loadProgress } from "@/lib/storage";
import { LESSONS } from "@/lib/lessons";

export function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(loadProgress());

  useEffect(() => {
    setProgress(loadProgress());
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-24" />;

  const lessonsDone = progress.completedLessons.length;

  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-2xl mx-auto mb-14">
      <StatCard label="Best WPM" value={progress.bestWpm || "—"} />
      <StatCard label="Streak" value={`${progress.streak.count}d`} />
      <StatCard label="Lessons" value={`${lessonsDone}/${LESSONS.length}`} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-neutral-800 py-5 text-center">
      <p className="text-xl font-semibold tabular-nums">{value}</p>
      <p className="text-xs text-neutral-500 mt-1">{label}</p>
    </div>
  );
}
