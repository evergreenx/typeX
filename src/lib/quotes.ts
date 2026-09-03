export const QUOTES: string[] = [
  "The best way to predict the future is to invent it, one keystroke at a time.",
  "Typing well is a superpower nobody claps for, until you're the fastest one in the room.",
  "Code is read far more often than it is written, so write it like someone else will type it next.",
  "Practice does not make perfect, only perfect practice makes perfect.",
  "A journey of a thousand words begins with a single keystroke.",
  "Simplicity is the soul of efficiency, on the keyboard and in the code.",
  "Muscle memory turns effort into instinct if you give it enough honest repetition.",
  "Every expert was once a beginner who refused to give up on the home row.",
];

export function randomQuote(exclude?: string): string {
  const pool = exclude ? QUOTES.filter((q) => q !== exclude) : QUOTES;
  return pool[Math.floor(Math.random() * pool.length)];
}
