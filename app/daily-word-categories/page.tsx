import type { Metadata } from "next";
import { DailyWordCategoriesGame } from "@/components/DailyWordCategoriesGame";
import { absoluteUrl } from "@/lib/site";

const title = "Daily Word Categories - English Word Sorting Puzzle";
const description =
  "Group 16 English words into 4 hidden categories in this daily vocabulary sorting puzzle from ClearWord Lab.";
const canonical = absoluteUrl("/daily-word-categories");

export const metadata: Metadata = {
  title: {
    absolute: title,
  },
  description,
  alternates: {
    canonical,
  },
  openGraph: {
    title,
    description,
    url: canonical,
  },
};

export default function DailyWordCategoriesPage() {
  return <DailyWordCategoriesGame />;
}
