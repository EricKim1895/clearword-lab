"use client";

import { useEffect, useState } from "react";
import { getRandomQuizQuestions, type QuizQuestionWithSource } from "@/lib/quiz";
import { QuizCard } from "@/components/QuizCard";

export function RandomQuiz() {
  const [questions, setQuestions] = useState<QuizQuestionWithSource[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuestions(getRandomQuizQuestions(10));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function refreshQuiz() {
    setQuestions(getRandomQuizQuestions(10));
  }

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Loading practice questions...
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">Practice 10 randomly selected questions from the local word-pair data.</p>
        <button
          type="button"
          onClick={refreshQuiz}
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          New Questions
        </button>
      </div>
      <QuizCard questions={questions} showSource />
    </div>
  );
}
