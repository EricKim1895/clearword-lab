import { mkdir, readFile, writeFile } from "node:fs/promises";
import dotenv from "dotenv";
import path from "node:path";
import process from "node:process";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

const DEEPSEEK_BASE_URL = "https://api.deepseek.com";
const DEEPSEEK_MODEL = "deepseek-chat";
const CHAT_COMPLETIONS_PATH = "/chat/completions";
const BATCH_SIZE = 4;

const ROOT_DIR = process.cwd();
const PROMPT_PATH = path.join(ROOT_DIR, "prompts", "confusing-word-entry-prompt.md");
const DRAFTS_DIR = path.join(ROOT_DIR, "drafts");
const ERRORS_DIR = path.join(DRAFTS_DIR, "errors");
const GENERATED_DIR = path.join(DRAFTS_DIR, "generated-word-pairs");
const GENERATED_INDEX_PATH = path.join(GENERATED_DIR, "index.json");
const GENERATED_ALL_PATH = path.join(DRAFTS_DIR, "generated-word-pairs.all.json");
const VALIDATION_REPORT_PATH = path.join(DRAFTS_DIR, "validation-report.json");

type GeneratedEntry = {
  slug?: string;
  title?: string;
  words?: string[];
  level?: string;
  category?: string;
  tags?: string[];
  shortSummary?: string;
  quickAnswer?: string;
  coreDifference?: string;
  englishExplanation?: string;
  nativeLanguageNotes?: {
    zh?: string;
  };
  wordDetails?: unknown[];
  examples?: unknown[];
  commonMistakes?: unknown[];
  quiz?: {
    id?: string;
    question?: string;
    options?: string[];
    answer?: string;
    explanation?: string;
  }[];
  faq?: unknown[];
  relatedSlugs?: string[];
  seo?: {
    title?: string;
    description?: string;
    canonicalPath?: string;
    keywords?: string[];
  };
};

type ValidationIssue = {
  slug: string;
  message: string;
};

type ValidationReport = {
  generatedAt: string;
  totalEntries: number;
  validEntries: number;
  invalidEntries: number;
  issues: ValidationIssue[];
};

type GeneratedIndexItem = {
  slug: string;
  title: string;
  file: string;
  status: "generated";
};

const targetWordPairs = [
  { slug: "speak-vs-talk", title: "Speak vs Talk", words: ["speak", "talk"] },
  { slug: "affect-vs-effect", title: "Affect vs Effect", words: ["affect", "effect"] },
  { slug: "job-vs-work", title: "Job vs Work", words: ["job", "work"] },
  { slug: "hear-vs-listen", title: "Hear vs Listen", words: ["hear", "listen"] },
  { slug: "look-vs-see-vs-watch", title: "Look vs See vs Watch", words: ["look", "see", "watch"] },
  { slug: "fun-vs-funny", title: "Fun vs Funny", words: ["fun", "funny"] },
  { slug: "rise-vs-raise", title: "Rise vs Raise", words: ["rise", "raise"] },
  { slug: "since-vs-for", title: "Since vs For", words: ["since", "for"] },
  { slug: "bring-vs-take", title: "Bring vs Take", words: ["bring", "take"] },
  { slug: "fewer-vs-less", title: "Fewer vs Less", words: ["fewer", "less"] },
  { slug: "alone-vs-lonely", title: "Alone vs Lonely", words: ["alone", "lonely"] },
  { slug: "beside-vs-besides", title: "Beside vs Besides", words: ["beside", "besides"] },
  { slug: "remember-vs-remind", title: "Remember vs Remind", words: ["remember", "remind"] },
  { slug: "advice-vs-advise", title: "Advice vs Advise", words: ["advice", "advise"] },
  { slug: "learn-vs-study", title: "Learn vs Study", words: ["learn", "study"] },
  { slug: "sensible-vs-sensitive", title: "Sensible vs Sensitive", words: ["sensible", "sensitive"] },
  { slug: "travel-vs-trip", title: "Travel vs Trip", words: ["travel", "trip"] },
];

const existingSlugs = [
  "make-vs-do",
  "borrow-vs-lend",
  "say-vs-tell",
  ...targetWordPairs.map((pair) => pair.slug),
];

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function extractJsonObject(content: string) {
  const trimmed = content.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  return trimmed;
}

function buildUserPrompt(batch: typeof targetWordPairs, promptTemplate: string) {
  return [
    promptTemplate,
    "",
    "Generate entries for these word pairs only:",
    JSON.stringify(batch, null, 2),
    "",
    "Allowed related slugs:",
    JSON.stringify(existingSlugs, null, 2),
    "",
    "Return a single JSON object with an entries array.",
  ].join("\n");
}

async function callDeepSeek(prompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not set in the local environment.");
  }

  const response = await fetch(`${DEEPSEEK_BASE_URL}${CHAT_COMPLETIONS_PATH}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You generate JSON content drafts for an ESL learning website. Return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
      response_format: {
        type: "json_object",
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`DeepSeek request failed with ${response.status}: ${body}`);
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("DeepSeek response did not include message content.");
  }

  return content;
}

async function saveRawError(batchNumber: number, content: string) {
  await mkdir(ERRORS_DIR, { recursive: true });
  await writeFile(path.join(ERRORS_DIR, `batch-${batchNumber}.txt`), content, "utf8");
}

async function writeGeneratedEntryFiles(entries: GeneratedEntry[]) {
  await mkdir(GENERATED_DIR, { recursive: true });

  const indexItems: GeneratedIndexItem[] = [];
  const writeIssues: ValidationIssue[] = [];

  for (const entry of entries) {
    if (!entry.slug) {
      writeIssues.push({
        slug: "(missing slug)",
        message: "entry was not written to an individual file because slug is missing.",
      });
      continue;
    }

    const file = `${entry.slug}.json`;
    await writeFile(path.join(GENERATED_DIR, file), `${JSON.stringify(entry, null, 2)}\n`, "utf8");

    indexItems.push({
      slug: entry.slug,
      title: entry.title ?? entry.slug,
      file,
      status: "generated",
    });
  }

  await writeFile(GENERATED_INDEX_PATH, `${JSON.stringify(indexItems, null, 2)}\n`, "utf8");
  await writeFile(GENERATED_ALL_PATH, `${JSON.stringify(entries, null, 2)}\n`, "utf8");

  return { indexItems, writeIssues };
}

async function readGeneratedEntryFiles(indexItems: GeneratedIndexItem[]) {
  const entries: GeneratedEntry[] = [];
  const readIssues: ValidationIssue[] = [];

  for (const item of indexItems) {
    try {
      const content = await readFile(path.join(GENERATED_DIR, item.file), "utf8");
      entries.push(JSON.parse(content) as GeneratedEntry);
    } catch (error) {
      readIssues.push({
        slug: item.slug,
        message: `could not read or parse ${item.file}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      });
    }
  }

  return { entries, readIssues };
}

function validateEntries(entries: GeneratedEntry[], initialIssues: ValidationIssue[] = []): ValidationReport {
  const issues: ValidationIssue[] = [...initialIssues];
  const allowedRelatedSlugs = new Set(existingSlugs);
  const requiredFields: (keyof GeneratedEntry)[] = [
    "slug",
    "title",
    "words",
    "level",
    "category",
    "tags",
    "shortSummary",
    "quickAnswer",
    "coreDifference",
    "englishExplanation",
    "wordDetails",
    "examples",
    "quiz",
    "relatedSlugs",
    "seo",
  ];
  const forbiddenQuizOptions = new Set(["both", "neither", "none", "make a travel", "do a trip"]);

  for (const entry of entries) {
    const slug = entry.slug ?? "(missing slug)";

    for (const field of requiredFields) {
      if (entry[field] === undefined || entry[field] === null || entry[field] === "") {
        issues.push({ slug, message: `${field} is missing.` });
      }
    }

    if ("nativeLanguageNotes" in entry) {
      issues.push({ slug, message: "nativeLanguageNotes must not be included." });
    }

    if ("commonMistakes" in entry) {
      issues.push({ slug, message: "commonMistakes must not be included." });
    }

    if ("faq" in entry) {
      issues.push({ slug, message: "faq must not be included." });
    }

    if (!Array.isArray(entry.quiz) || entry.quiz.length !== 5) {
      issues.push({ slug, message: "quiz must contain exactly 5 questions." });
    } else {
      for (const question of entry.quiz) {
        if (!Array.isArray(question.options)) {
          issues.push({
            slug,
            message: `quiz question ${question.id ?? "(missing id)"} options must be an array.`,
          });
          continue;
        }

        if (!question.answer || !question.options.includes(question.answer)) {
          issues.push({
            slug,
            message: `quiz question ${question.id ?? "(missing id)"} answer must exactly match one option.`,
          });
        }

        for (const option of question.options) {
          const normalizedOption = option.toLowerCase().trim();
          if (forbiddenQuizOptions.has(normalizedOption) || /^[a-z]+\/[a-z]+$/i.test(normalizedOption)) {
            issues.push({
              slug,
              message: `quiz question ${question.id ?? "(missing id)"} contains forbidden option "${option}".`,
            });
          }
        }
      }
    }

    if (!Array.isArray(entry.relatedSlugs)) {
      issues.push({ slug, message: "relatedSlugs must be an array." });
    } else {
      for (const relatedSlug of entry.relatedSlugs) {
        if (!allowedRelatedSlugs.has(relatedSlug)) {
          issues.push({
            slug,
            message: `relatedSlug "${relatedSlug}" is not in the allowed slug list.`,
          });
        }
      }
    }

    if (entry.slug && entry.seo?.canonicalPath !== `/confusing-words/${entry.slug}`) {
      issues.push({
        slug,
        message: `seo.canonicalPath must equal /confusing-words/${entry.slug}.`,
      });
    }

    if (entry.seo?.description?.toLowerCase().includes("common mistakes")) {
      issues.push({
        slug,
        message: 'seo.description must not include "common mistakes".',
      });
    }
  }

  const invalidSlugs = new Set(issues.map((issue) => issue.slug));

  return {
    generatedAt: new Date().toISOString(),
    totalEntries: entries.length,
    validEntries: entries.filter((entry) => !invalidSlugs.has(entry.slug ?? "(missing slug)")).length,
    invalidEntries: invalidSlugs.size,
    issues,
  };
}

async function main() {
  await mkdir(DRAFTS_DIR, { recursive: true });
  await mkdir(ERRORS_DIR, { recursive: true });
  await mkdir(GENERATED_DIR, { recursive: true });

  const promptTemplate = await readFile(PROMPT_PATH, "utf8");
  const batches = chunk(targetWordPairs, BATCH_SIZE);
  const generatedEntries: GeneratedEntry[] = [];

  for (const [batchIndex, batch] of batches.entries()) {
    const batchNumber = batchIndex + 1;
    console.log(`Generating batch ${batchNumber}/${batches.length} (${batch.length} entries)...`);

    try {
      const content = await callDeepSeek(buildUserPrompt(batch, promptTemplate));
      const parsed = JSON.parse(extractJsonObject(content)) as { entries?: GeneratedEntry[] };

      if (!Array.isArray(parsed.entries)) {
        await saveRawError(batchNumber, content);
        console.warn(`Batch ${batchNumber} did not return an entries array. Raw response saved.`);
        continue;
      }

      generatedEntries.push(...parsed.entries);
      console.log(`Batch ${batchNumber} parsed successfully.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await saveRawError(batchNumber, message);
      console.warn(`Batch ${batchNumber} failed. Details saved to drafts/errors/batch-${batchNumber}.txt`);
    }
  }

  const { indexItems, writeIssues } = await writeGeneratedEntryFiles(generatedEntries);
  const { entries: entriesFromFiles, readIssues } = await readGeneratedEntryFiles(indexItems);
  const report = validateEntries(entriesFromFiles, [...writeIssues, ...readIssues]);

  await writeFile(VALIDATION_REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`Generated draft entries: ${generatedEntries.length}`);
  console.log(`Individual drafts saved to ${path.relative(ROOT_DIR, GENERATED_DIR)}`);
  console.log(`Draft index saved to ${path.relative(ROOT_DIR, GENERATED_INDEX_PATH)}`);
  console.log(`Backup combined draft saved to ${path.relative(ROOT_DIR, GENERATED_ALL_PATH)}`);
  console.log(`Validation report saved to ${path.relative(ROOT_DIR, VALIDATION_REPORT_PATH)}`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
