import type { SavedWordPair, WrongAnswerRecord } from "@/types/content";

const SAVED_WORDS_KEY = "clearword_saved_words";
const WRONG_ANSWERS_KEY = "clearword_wrong_answers";
const LOCAL_STORAGE_CHANGE_EVENT = "clearword_storage_change";
const EMPTY_SAVED_WORDS: SavedWordPair[] = [];
const EMPTY_WRONG_ANSWERS: WrongAnswerRecord[] = [];

let savedWordsRaw: string | null | undefined;
let savedWordsSnapshot: SavedWordPair[] = EMPTY_SAVED_WORDS;
let wrongAnswersRaw: string | null | undefined;
let wrongAnswersSnapshot: WrongAnswerRecord[] = EMPTY_WRONG_ANSWERS;

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(LOCAL_STORAGE_CHANGE_EVENT));
}

function readCachedArray<T>(
  key: string,
  emptyValue: T[],
  cache: {
    raw: string | null | undefined;
    snapshot: T[];
    update: (raw: string | null, snapshot: T[]) => void;
  },
) {
  if (typeof window === "undefined") {
    return emptyValue;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === cache.raw) {
      return cache.snapshot;
    }

    if (!raw) {
      cache.update(raw, emptyValue);
      return emptyValue;
    }

    const parsed = JSON.parse(raw);
    const next = Array.isArray(parsed) ? (parsed as T[]) : emptyValue;
    cache.update(raw, next);
    return next;
  } catch {
    return emptyValue;
  }
}

export function subscribeLocalStorage(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, callback);
  };
}

export function getEmptySavedWordPairs() {
  return EMPTY_SAVED_WORDS;
}

export function getEmptyWrongAnswers() {
  return EMPTY_WRONG_ANSWERS;
}

export function getSavedWordPairs() {
  return readCachedArray<SavedWordPair>(SAVED_WORDS_KEY, EMPTY_SAVED_WORDS, {
    raw: savedWordsRaw,
    snapshot: savedWordsSnapshot,
    update: (raw, snapshot) => {
      savedWordsRaw = raw;
      savedWordsSnapshot = snapshot;
    },
  });
}

export function saveWordPair(pair: Omit<SavedWordPair, "savedAt">) {
  const saved = getSavedWordPairs();
  if (saved.some((item) => item.slug === pair.slug)) {
    return saved;
  }

  const next = [{ ...pair, savedAt: new Date().toISOString() }, ...saved];
  writeJson(SAVED_WORDS_KEY, next);
  return next;
}

export function removeSavedWordPair(slug: string) {
  const next = getSavedWordPairs().filter((item) => item.slug !== slug);
  writeJson(SAVED_WORDS_KEY, next);
  return next;
}

export function getWrongAnswers() {
  return readCachedArray<WrongAnswerRecord>(WRONG_ANSWERS_KEY, EMPTY_WRONG_ANSWERS, {
    raw: wrongAnswersRaw,
    snapshot: wrongAnswersSnapshot,
    update: (raw, snapshot) => {
      wrongAnswersRaw = raw;
      wrongAnswersSnapshot = snapshot;
    },
  });
}

export function saveWrongAnswer(record: Omit<WrongAnswerRecord, "savedAt">) {
  const existing = getWrongAnswers();
  const next = [
    { ...record, savedAt: new Date().toISOString() },
    ...existing.filter((item) => item.questionId !== record.questionId),
  ];
  writeJson(WRONG_ANSWERS_KEY, next);
  return next;
}

export function clearWrongAnswers() {
  writeJson(WRONG_ANSWERS_KEY, []);
  return [];
}
