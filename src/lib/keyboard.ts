export type Finger = "LP" | "LR" | "LM" | "LI" | "RI" | "RM" | "RR" | "RP";

export const FINGER_LABEL: Record<Finger, string> = {
  LP: "Left pinky",
  LR: "Left ring",
  LM: "Left middle",
  LI: "Left index",
  RI: "Right index",
  RM: "Right middle",
  RR: "Right ring",
  RP: "Right pinky",
};

export const FINGER_COLOR: Record<Finger, string> = {
  LP: "#fb7185",
  LR: "#fb923c",
  LM: "#fbbf24",
  LI: "#a3e635",
  RI: "#2dd4bf",
  RM: "#38bdf8",
  RR: "#818cf8",
  RP: "#e879f9",
};

// Base-key finger map (lowercase, unshifted characters)
export const KEY_FINGER_MAP: Record<string, Finger> = {
  "`": "LP",
  "1": "LP",
  "2": "LR",
  "3": "LM",
  "4": "LI",
  "5": "LI",
  "6": "RI",
  "7": "RI",
  "8": "RM",
  "9": "RR",
  "0": "RP",
  "-": "RP",
  "=": "RP",
  q: "LP",
  w: "LR",
  e: "LM",
  r: "LI",
  t: "LI",
  y: "RI",
  u: "RI",
  i: "RM",
  o: "RR",
  p: "RP",
  "[": "RP",
  "]": "RP",
  "\\": "RP",
  a: "LP",
  s: "LR",
  d: "LM",
  f: "LI",
  g: "LI",
  h: "RI",
  j: "RI",
  k: "RM",
  l: "RR",
  ";": "RP",
  "'": "RP",
  z: "LP",
  x: "LR",
  c: "LM",
  v: "LI",
  b: "LI",
  n: "RI",
  m: "RI",
  ",": "RM",
  ".": "RR",
  "/": "RP",
  " ": "LI",
};

// shifted-symbol -> base key, so we can resolve which finger types it
const SHIFT_TO_BASE: Record<string, string> = {
  "~": "`",
  "!": "1",
  "@": "2",
  "#": "3",
  $: "4",
  "%": "5",
  "^": "6",
  "&": "7",
  "*": "8",
  "(": "9",
  ")": "0",
  _: "-",
  "+": "=",
  "{": "[",
  "}": "]",
  "|": "\\",
  ":": ";",
  '"': "'",
  "<": ",",
  ">": ".",
  "?": "/",
};

export function resolveBaseChar(char: string): string {
  const lower = char.toLowerCase();
  if (KEY_FINGER_MAP[lower]) return lower;
  if (SHIFT_TO_BASE[char]) return SHIFT_TO_BASE[char];
  return lower;
}

export function fingerForChar(char: string): Finger | undefined {
  return KEY_FINGER_MAP[resolveBaseChar(char)];
}

export function needsShift(char: string): boolean {
  if (char === " ") return false;
  if (/[A-Z]/.test(char)) return true;
  return Boolean(SHIFT_TO_BASE[char]);
}

type KeyDef = { key: string; label?: string; flex?: number; special?: boolean };

export const KEYBOARD_ROWS: KeyDef[][] = [
  [
    { key: "`" },
    { key: "1" },
    { key: "2" },
    { key: "3" },
    { key: "4" },
    { key: "5" },
    { key: "6" },
    { key: "7" },
    { key: "8" },
    { key: "9" },
    { key: "0" },
    { key: "-" },
    { key: "=" },
    { key: "Backspace", label: "⌫", flex: 2, special: true },
  ],
  [
    { key: "Tab", label: "Tab", flex: 1.5, special: true },
    { key: "q" },
    { key: "w" },
    { key: "e" },
    { key: "r" },
    { key: "t" },
    { key: "y" },
    { key: "u" },
    { key: "i" },
    { key: "o" },
    { key: "p" },
    { key: "[" },
    { key: "]" },
    { key: "\\", flex: 1.5 },
  ],
  [
    { key: "CapsLock", label: "Caps", flex: 1.75, special: true },
    { key: "a" },
    { key: "s" },
    { key: "d" },
    { key: "f" },
    { key: "g" },
    { key: "h" },
    { key: "j" },
    { key: "k" },
    { key: "l" },
    { key: ";" },
    { key: "'" },
    { key: "Enter", label: "Enter", flex: 1.75, special: true },
  ],
  [
    { key: "ShiftLeft", label: "Shift", flex: 2.25, special: true },
    { key: "z" },
    { key: "x" },
    { key: "c" },
    { key: "v" },
    { key: "b" },
    { key: "n" },
    { key: "m" },
    { key: "," },
    { key: "." },
    { key: "/" },
    { key: "ShiftRight", label: "Shift", flex: 2.25, special: true },
  ],
  [{ key: " ", label: "", flex: 8 }],
];
