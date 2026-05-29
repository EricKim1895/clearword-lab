"use client";

import { useSyncExternalStore } from "react";
import {
  getEmptySavedWordPairs,
  getSavedWordPairs,
  removeSavedWordPair,
  saveWordPair,
  subscribeLocalStorage,
} from "@/lib/localStorage";

export function SaveButton({ slug, title }: { slug: string; title: string }) {
  const saved = useSyncExternalStore(
    subscribeLocalStorage,
    getSavedWordPairs,
    getEmptySavedWordPairs,
  );
  const isSaved = saved.some((item) => item.slug === slug);

  function handleClick() {
    if (isSaved) {
      removeSavedWordPair(slug);
      return;
    }

    saveWordPair({ slug, title });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex min-h-11 items-center justify-center rounded-md border border-teal-200 bg-white px-4 text-sm font-semibold text-teal-800 transition hover:bg-teal-50"
      aria-pressed={isSaved}
    >
      {isSaved ? "Saved" : "Save Word Pair"}
    </button>
  );
}
