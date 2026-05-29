import type { Metadata } from "next";
import { WordPairGrid } from "@/components/WordPairGrid";
import { absoluteUrl } from "@/lib/site";
import { getAllWordPairs } from "@/lib/words";

export const metadata: Metadata = {
  title: {
    absolute: "Confusing English Words with Examples and Quizzes | ClearWord Lab",
  },
  description: "Browse common confusing English word pairs with simple ESL explanations, examples, and quizzes.",
  alternates: {
    canonical: absoluteUrl("/confusing-words"),
  },
  openGraph: {
    title: "Confusing English Words with Examples and Quizzes | ClearWord Lab",
    description: "Browse common confusing English word pairs with simple ESL explanations, examples, and quizzes.",
    url: absoluteUrl("/confusing-words"),
  },
};

export default function ConfusingWordsPage() {
  const entries = getAllWordPairs();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Confusing Words</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">All Confusing Word Pairs</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Study short, practical explanations for common English words that learners often mix up.
        </p>
      </div>
      <div className="mt-8">
        <WordPairGrid entries={entries} />
      </div>
    </div>
  );
}
