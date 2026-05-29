"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  getEmptySavedWordPairs,
  getSavedWordPairs,
  removeSavedWordPair,
  subscribeLocalStorage,
} from "@/lib/localStorage";

export function SavedWordPairs() {
  const saved = useSyncExternalStore(
    subscribeLocalStorage,
    getSavedWordPairs,
    getEmptySavedWordPairs,
  );

  function remove(slug: string) {
    removeSavedWordPair(slug);
  }

  if (saved.length === 0) {
    return <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">No saved word pairs yet.</p>;
  }

  return (
    <div className="grid gap-3">
      {saved.map((item) => (
        <div key={item.slug} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href={`/confusing-words/${item.slug}`} className="font-semibold text-slate-950 hover:text-sky-800">
              {item.title}
            </Link>
            <p className="mt-1 text-xs text-slate-500">Saved {new Date(item.savedAt).toLocaleDateString()}</p>
          </div>
          <button
            type="button"
            onClick={() => remove(item.slug)}
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
