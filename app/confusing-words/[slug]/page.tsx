import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExampleList } from "@/components/ExampleList";
import { QuizCard } from "@/components/QuizCard";
import { RelatedWordPairs } from "@/components/RelatedWordPairs";
import { SaveButton } from "@/components/SaveButton";
import { absoluteUrl } from "@/lib/site";
import { createArticleJsonLd, createBreadcrumbJsonLd, safeJsonLd } from "@/lib/seo";
import { getAllWordPairs, getWordPairBySlug } from "@/lib/words";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllWordPairs().map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getWordPairBySlug(slug);

  if (!entry) {
    return {
      title: "Confusing Word Pair Not Found",
    };
  }

  return {
    title: {
      absolute: entry.seo.title,
    },
    description: entry.seo.description,
    keywords: entry.seo.keywords,
    alternates: {
      canonical: absoluteUrl(entry.seo.canonicalPath),
    },
    openGraph: {
      title: entry.seo.title,
      description: entry.seo.description,
      url: absoluteUrl(entry.seo.canonicalPath),
      type: "article",
    },
  };
}

export default async function ConfusingWordDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = getWordPairBySlug(slug);

  if (!entry) {
    notFound();
  }

  const quizQuestions = entry.quiz.map((question) => ({
    ...question,
    slug: entry.slug,
    title: entry.title,
  }));

  return (
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(createBreadcrumbJsonLd(entry)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(createArticleJsonLd(entry)) }}
      />

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Confusing Words</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">{entry.title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{entry.shortSummary}</p>
          </div>
          <SaveButton slug={entry.slug} title={entry.title} />
        </div>
      </div>

      <div className="mt-8 grid gap-8">
        <section className="rounded-lg border border-sky-100 bg-sky-50 p-5">
          <h2 className="text-2xl font-semibold text-slate-950">Quick Answer</h2>
          <p className="mt-3 leading-7 text-slate-700">{entry.quickAnswer}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Core Difference</h2>
          <p className="mt-3 leading-7 text-slate-700">{entry.coreDifference}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Simple Explanation</h2>
          <p className="mt-3 leading-7 text-slate-700">{entry.englishExplanation}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Word Details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {entry.wordDetails.map((detail) => (
              <div key={detail.word} className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="text-xl font-semibold text-slate-950">{detail.word}</h3>
                {detail.partOfSpeech ? <p className="mt-1 text-sm text-teal-700">{detail.partOfSpeech}</p> : null}
                <p className="mt-3 text-sm leading-6 text-slate-600">{detail.simpleMeaning}</p>
                {detail.commonPatterns?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {detail.commonPatterns.map((pattern) => (
                      <span key={pattern} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
                        {pattern}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Examples</h2>
          <div className="mt-4">
            <ExampleList examples={entry.examples} />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Practice Quiz</h2>
          <p className="mt-2 text-sm text-slate-600">Choose one answer. Mistakes are saved for review.</p>
          <div className="mt-4">
            <QuizCard questions={quizQuestions} />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-slate-950">Related Word Pairs</h2>
          <div className="mt-4">
            <RelatedWordPairs slugs={entry.relatedSlugs} />
          </div>
        </section>
      </div>
    </article>
  );
}
