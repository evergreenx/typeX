import Link from "next/link";
import { SoundSettings } from "@/components/SoundSettings";

export function Nav() {
  return (
    <header className="w-full max-w-4xl mx-auto flex items-center justify-between px-6 py-6 gap-4">
      <Link href="/" className="font-mono font-bold tracking-tight text-lg shrink-0">
        type<span className="text-emerald-400">X</span>
      </Link>
      <nav className="flex gap-6 text-sm text-neutral-400">
        <Link href="/speed-test" className="hover:text-neutral-100 transition">
          Speed Test
        </Link>
        <Link href="/lessons" className="hover:text-neutral-100 transition">
          Lessons
        </Link>
        <Link href="/practice" className="hover:text-neutral-100 transition">
          Practice
        </Link>
      </nav>
      <SoundSettings />
    </header>
  );
}
