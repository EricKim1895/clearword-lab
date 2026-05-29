import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "About ClearWord Lab | Simple English Learning Tools",
  },
  description: "Learn what ClearWord Lab is, who it is for, and how ESL learners can use it.",
  alternates: {
    canonical: absoluteUrl("/about"),
  },
  openGraph: {
    title: "About ClearWord Lab | Simple English Learning Tools",
    description: "Learn what ClearWord Lab is, who it is for, and how ESL learners can use it.",
    url: absoluteUrl("/about"),
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">About</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">About ClearWord Lab</h1>
      <div className="mt-6 space-y-5 text-lg leading-8 text-slate-600">
        <p>
          ClearWord Lab is a simple English learning tool for ESL learners. It focuses on confusing English
          words that often look similar, sound similar, or appear in similar situations.
        </p>
        <p>
          The first version is intentionally small: clear explanations, natural examples, practice quizzes,
          saved word pairs, and mistake review in the browser.
        </p>
        <p>
          The site is written for global A2-B2 learners, so the main interface and lesson content use English.
          Native-language helper notes may be added where they are useful, but they are not the main learning mode.
        </p>
      </div>
    </div>
  );
}
