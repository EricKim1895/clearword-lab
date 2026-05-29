import type { Metadata } from "next";
import { ReviewMistakes } from "@/components/ReviewMistakes";
import { SavedWordPairs } from "@/components/SavedWordPairs";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Review Saved Words and Mistakes | ClearWord Lab",
  },
  description: "Review saved confusing word pairs and quiz mistakes stored in your browser.",
  alternates: {
    canonical: absoluteUrl("/review"),
  },
  openGraph: {
    title: "Review Saved Words and Mistakes | ClearWord Lab",
    description: "Review saved confusing word pairs and quiz mistakes stored in your browser.",
    url: absoluteUrl("/review"),
  },
};

export default function ReviewPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Review</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Daily Review</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
        Your saved word pairs and mistakes stay in this browser. No account is required for the MVP.
      </p>
      <div className="mt-8 grid gap-10">
        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Saved Word Pairs</h2>
          <div className="mt-4">
            <SavedWordPairs />
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Review Mistakes</h2>
          <div className="mt-4">
            <ReviewMistakes />
          </div>
        </section>
      </div>
    </div>
  );
}
