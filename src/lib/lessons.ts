export type Lesson = {
  id: string;
  title: string;
  description: string;
  keys: string[];
  drills: string[];
};

export const LESSONS: Lesson[] = [
  {
    id: "home-row",
    title: "Home Row Basics",
    description: "Rest your fingers on A S D F and J K L ; — the foundation of touch typing.",
    keys: ["a", "s", "d", "f", "j", "k", "l", ";"],
    drills: [
      "asdf jkl; asdf jkl;",
      "a sad lad; a glass; a flask",
      "ask dad; add a jar; all fall",
      "as a lad, dad; a jak; a flask fall",
    ],
  },
  {
    id: "home-row-extended",
    title: "Home Row Extended",
    description: "Add G and H, reached by your index fingers without leaving the home row.",
    keys: ["g", "h"],
    drills: [
      "fj fj gh gh half a flask",
      "jag a glass; hash a salad",
      "she had a flag; ask half a glass",
      "a lad has a jar; hall gas dash",
    ],
  },
  {
    id: "top-row",
    title: "Top Row",
    description: "Reach up to Q W E R T Y U I O P.",
    keys: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    drills: [
      "the quiet type wrote it quickly",
      "we try to type every word right",
      "your quirky poetry is pretty witty",
      "quiet writers require quite a routine",
    ],
  },
  {
    id: "bottom-row",
    title: "Bottom Row",
    description: "Drop down to Z X C V B N M , . /",
    keys: ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
    drills: [
      "zebras can move very fast",
      "the black cab moved by the barn",
      "vex, mix, box, and fix the van",
      "can, cannot, maybe, never, again",
    ],
  },
  {
    id: "numbers",
    title: "Numbers",
    description: "The top number row, 1 through 0.",
    keys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    drills: [
      "call 1234 or fax 5678 today",
      "we sold 90 units in 2024",
      "room 101 has 20 desks",
      "the score was 7 to 3 in game 9",
    ],
  },
  {
    id: "punctuation",
    title: "Punctuation & Symbols",
    description: "Commas, quotes, and the symbols that make real writing real.",
    keys: [",", ".", ";", "'", "!", "?", "(", ")", "-"],
    drills: [
      "wait, is it done? yes! it's ready.",
      "she said, \"go now; don't wait.\"",
      "cost: $12.50 (tax not included).",
      "well - that's one way to put it!",
    ],
  },
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}
