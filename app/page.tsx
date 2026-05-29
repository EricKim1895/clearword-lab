import Link from "next/link";
import { WordPairGrid } from "@/components/WordPairGrid";
import { getFeaturedWordPairs } from "@/lib/words";

const entryLinks = [
  {
    href: "/confusing-words",
    title: "Confusing Words",
    description: "Browse short lessons for common English word pairs.",
  },
  {
    href: "/quiz",
    title: "Practice Quiz",
    description: "Try 10 random questions from the local lesson data.",
  },
  {
    href: "/review",
    title: "Daily Review",
    description: "Review saved word pairs and mistakes stored in your browser.",
  },
];

export default function Home() {
  const featured = getFeaturedWordPairs();

  return (
    <div>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Simple English learning tool</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Understand confusing English words with clear examples and practice.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              ClearWord Lab helps A2-B2 ESL learners compare similar English words through simple explanations,
              practical examples, common mistakes, and quick quizzes.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/confusing-words"
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Browse Confusing Words
              </Link>
              <Link
                href="/quiz"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-teal-200 bg-white px-5 text-sm font-semibold text-teal-800 transition hover:bg-teal-50"
              >
                Start Practice
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-950">MVP study flow</p>
            <div className="mt-4 grid gap-3">
              {entryLinks.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-md bg-white p-4 shadow-sm hover:shadow">
                  <span className="font-semibold text-slate-950">{item.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-600">{item.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Featured lessons</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Popular Confusing Word Pairs</h2>
          </div>
          <Link href="/confusing-words" className="text-sm font-semibold text-sky-800 hover:text-sky-950">
            View all word pairs
          </Link>
        </div>
        <WordPairGrid entries={featured} />
      </section>
    </div>
  );
}
