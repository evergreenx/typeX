import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <Nav />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <h1 className="text-4xl sm:text-5xl font-semibold text-center tracking-tight mb-4">
          Type faster.<br />Type without looking.
        </h1>
        <p className="text-neutral-400 text-center max-w-md mb-12">
          Structured lessons, a live finger guide, and honest stats — the modern way
          to actually learn touch typing.
        </p>

        <Dashboard />

        <div className="flex gap-4">
          <Link
            href="/lessons"
            className="px-6 py-3 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition"
          >
            Start Lessons
          </Link>
          <Link
            href="/practice"
            className="px-6 py-3 rounded-lg border border-neutral-700 hover:bg-neutral-900 transition"
          >
            Free Practice
          </Link>
        </div>
      </main>
    </div>
  );
}
