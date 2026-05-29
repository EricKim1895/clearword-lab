import { confusingWords } from "@/data/confusingWords";

export function getAllWordPairs() {
  return confusingWords;
}

export function getWordPairBySlug(slug: string) {
  return confusingWords.find((entry) => entry.slug === slug);
}

export function getRelatedWordPairs(slugs: string[]) {
  return slugs
    .map((slug) => getWordPairBySlug(slug))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
}

export function getFeaturedWordPairs() {
  const featuredSlugs = ["make-vs-do", "borrow-vs-lend", "say-vs-tell"];
  return getRelatedWordPairs(featuredSlugs);
}
