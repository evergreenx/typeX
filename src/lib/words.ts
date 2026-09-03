const COMMON_WORDS = [
  "the", "of", "and", "a", "to", "in", "is", "you", "that", "it",
  "he", "was", "for", "on", "are", "as", "with", "his", "they", "at",
  "be", "this", "have", "from", "or", "one", "had", "by", "word", "but",
  "not", "what", "all", "were", "we", "when", "your", "can", "said", "there",
  "use", "each", "which", "she", "how", "their", "will", "up", "other", "about",
  "out", "many", "then", "them", "these", "so", "some", "her", "would", "make",
  "like", "him", "into", "time", "has", "look", "two", "more", "write", "see",
  "number", "way", "could", "people", "than", "first", "water", "after", "call", "who",
  "now", "find", "long", "down", "day", "did", "get", "come", "made", "part",
  "over", "new", "sound", "take", "only", "little", "work", "know", "place", "year",
  "live", "back", "give", "most", "very", "good", "man", "think", "say", "great",
  "where", "help", "through", "line", "before", "turn", "cause", "same", "mean", "differ",
];

export function randomWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)]);
  }
  return words.join(" ");
}
