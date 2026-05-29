import type { ConfusingWordEntry } from "@/types/content";
import { WordPairCard } from "@/components/WordPairCard";

export function WordPairGrid({ entries }: { entries: ConfusingWordEntry[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry) => (
        <WordPairCard key={entry.slug} entry={entry} />
      ))}
    </div>
  );
}
