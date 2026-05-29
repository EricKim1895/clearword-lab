"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  clearWrongAnswers,
  getEmptyWrongAnswers,
  getWrongAnswers,
  subscribeLocalStorage,
} from "@/lib/localStorage";

export function ReviewMistakes() {
  const mistakes = useSyncExternalStore(
    subscribeLocalStorage,
    getWrongAnswers,
    getEmptyWrongAnswers,
  );

  if (mistakes.length === 0) {
    return <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">No saved mistakes yet.</p>;
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => clearWrongAnswers()}
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-rose-200 px-3 text-sm font-medium text-rose-700 hover:bg-rose-50"
        >
          Clear Mistakes
        </button>
      </div>
      {mistakes.map((mistake) => (
        <article key={mistake.questionId} className="rounded-lg border border-slate-200 bg-white p-4">
          <Link href={`/confusing-words/${mistake.slug}`} className="text-xs font-semibold uppercase tracking-wide text-teal-700 hover:text-teal-900">
            {mistake.slug.replaceAll("-", " ")}
          </Link>
          <h3 className="mt-2 font-semibold text-slate-950">{mistake.question}</h3>
          <p className="mt-3 text-sm text-rose-800">Your answer: {mistake.selectedAnswer}</p>
          <p className="mt-1 text-sm text-teal-800">Correct answer: {mistake.correctAnswer}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{mistake.explanation}</p>
        </article>
      ))}
    </div>
  );
}
