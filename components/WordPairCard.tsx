import Link from "next/link";
import type { ConfusingWordEntry } from "@/types/content";

export function WordPairCard({ entry }: { entry: ConfusingWordEntry }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md">
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-800">
          {entry.level}
        </span>
        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-800">
          {entry.category}
        </span>
      </div>
      <h2 className="text-xl font-semibold text-slate-950">
        <Link href={`/confusing-words/${entry.slug}`} className="hover:text-sky-800">
          {entry.title}
        </Link>
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{entry.shortSummary}</p>
      <Link
        href={`/confusing-words/${entry.slug}`}
        className="mt-4 inline-flex text-sm font-semibold text-teal-700 hover:text-teal-900"
      >
        Study this pair
      </Link>
    </article>
  );
}
