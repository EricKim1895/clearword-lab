import type { Metadata } from "next";
import { RandomQuiz } from "@/components/RandomQuiz";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "Confusing Words Practice Quiz | ClearWord Lab",
  },
  description: "Practice confusing English words with 10 random questions from ClearWord Lab lessons.",
  alternates: {
    canonical: absoluteUrl("/quiz"),
  },
  openGraph: {
    title: "Confusing Words Practice Quiz | ClearWord Lab",
    description: "Practice confusing English words with 10 random questions from ClearWord Lab lessons.",
    url: absoluteUrl("/quiz"),
  },
};

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Practice</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">Practice Quiz</h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">
        Answer 10 random questions. Mistakes are saved in your browser for review.
      </p>
      <div className="mt-8">
        <RandomQuiz />
      </div>
    </div>
  );
}
