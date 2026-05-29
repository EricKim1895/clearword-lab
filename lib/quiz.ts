import type { QuizQuestion } from "@/types/content";
import { getAllWordPairs } from "@/lib/words";

export type QuizQuestionWithSource = QuizQuestion & {
  slug: string;
  title: string;
};

export function getAllQuizQuestions(): QuizQuestionWithSource[] {
  return getAllWordPairs().flatMap((entry) =>
    entry.quiz.map((question) => ({
      ...question,
      slug: entry.slug,
      title: entry.title,
    })),
  );
}

export function getRandomQuizQuestions(count = 10) {
  return [...getAllQuizQuestions()]
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}
