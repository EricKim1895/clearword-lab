import { WordPairCard } from "@/components/WordPairCard";
import { getRelatedWordPairs } from "@/lib/words";

export function RelatedWordPairs({ slugs }: { slugs: string[] }) {
  const related = getRelatedWordPairs(slugs);

  if (related.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {related.map((entry) => (
        <WordPairCard key={entry.slug} entry={entry} />
      ))}
    </div>
  );
}
