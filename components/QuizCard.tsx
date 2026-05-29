"use client";

import { useState } from "react";
import { saveWrongAnswer } from "@/lib/localStorage";
import type { QuizQuestionWithSource } from "@/lib/quiz";

type AnswerState = {
  selected: string;
  isCorrect: boolean;
};

export function QuizCard({
  questions,
  showSource = false,
}: {
  questions: QuizQuestionWithSource[];
  showSource?: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});

  function chooseAnswer(question: QuizQuestionWithSource, selected: string) {
    if (answers[question.id]) {
      return;
    }

    const isCorrect = selected === question.answer;
    setAnswers((current) => ({
      ...current,
      [question.id]: { selected, isCorrect },
    }));

    if (!isCorrect) {
      saveWrongAnswer({
        questionId: question.id,
        slug: question.slug,
        question: question.question,
        selectedAnswer: selected,
        correctAnswer: question.answer,
        explanation: question.explanation,
      });
    }
  }

  return (
    <div className="grid gap-4">
      {questions.map((question, index) => {
        const answer = answers[question.id];

        return (
          <section key={question.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-1">
              {showSource ? (
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{question.title}</p>
              ) : null}
              <h3 className="text-base font-semibold text-slate-950">
                {index + 1}. {question.question}
              </h3>
            </div>
            <div className="mt-4 grid gap-2">
              {question.options.map((option) => {
                const isSelected = answer?.selected === option;
                const isCorrectAnswer = answer && option === question.answer;
                const optionClass = answer
                  ? isCorrectAnswer
                    ? "border-teal-300 bg-teal-50 text-teal-900"
                    : isSelected
                      ? "border-rose-300 bg-rose-50 text-rose-900"
                      : "border-slate-200 bg-slate-50 text-slate-600"
                  : "border-slate-200 bg-white text-slate-800 hover:border-sky-300 hover:bg-sky-50";

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={Boolean(answer)}
                    onClick={() => chooseAnswer(question, option)}
                    className={`min-h-11 rounded-md border px-3 py-2 text-left text-sm transition ${optionClass}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            {answer ? (
              <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                <p className={answer.isCorrect ? "font-semibold text-teal-800" : "font-semibold text-rose-800"}>
                  {answer.isCorrect ? "Correct" : "Not quite"}
                </p>
                <p>{question.explanation}</p>
                {!answer.isCorrect ? (
                  <p className="mt-1 font-medium text-slate-700">Saved to Review Mistakes.</p>
                ) : null}
              </div>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
