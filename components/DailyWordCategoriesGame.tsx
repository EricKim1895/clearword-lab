"use client";

import { useMemo, useState } from "react";

type PuzzleGroup = {
  name: string;
  words: string[];
  explanation: string;
};

type Puzzle = {
  puzzleId: number;
  date: string;
  words: string[];
  groups: PuzzleGroup[];
};

const puzzle: Puzzle = {
  puzzleId: 1,
  date: "2026-06-26",
  words: [
    "PIANO",
    "LOCK",
    "MAP",
    "INDEX",
    "TOAST",
    "JAM",
    "PLATE",
    "SPOON",
    "MOON",
    "COMET",
    "PLANET",
    "ORBIT",
    "DRAFT",
    "NOVEL",
    "POEM",
    "ESSAY",
  ],
  groups: [
    {
      name: "Things with keys",
      words: ["PIANO", "LOCK", "MAP", "INDEX"],
      explanation: "Each word can be associated with keys: piano keys, lock keys, map keys, and index keys.",
    },
    {
      name: "Breakfast table",
      words: ["TOAST", "JAM", "PLATE", "SPOON"],
      explanation: "These are common items or foods you might find at breakfast.",
    },
    {
      name: "Sky and space words",
      words: ["MOON", "COMET", "PLANET", "ORBIT"],
      explanation: "These words point to astronomy and objects or motion in space.",
    },
    {
      name: "Written works",
      words: ["DRAFT", "NOVEL", "POEM", "ESSAY"],
      explanation: "These are forms or stages of writing.",
    },
  ],
};

const maxMistakes = 4;
const groupStyles = [
  "bg-[#d8bb58]",
  "bg-[#83bc9c]",
  "bg-[#80a7cf]",
  "bg-[#c98794]",
];
const shareRows = ["🟨", "🟩", "🟦", "🟪"];

function normalizeWords(words: string[]) {
  return [...words].map((word) => word.toUpperCase()).sort().join("|");
}

function shuffleWords(words: string[]) {
  const copy = [...words];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function copyTextFallback(text: string) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("aria-hidden", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "0";
  textarea.style.top = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, text.length);
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) {
    throw new Error("Copy command failed");
  }
}

function GroupCard({
  group,
  index,
  showExplanation,
}: {
  group: PuzzleGroup;
  index: number;
  showExplanation: boolean;
}) {
  return (
    <div className={`grid min-h-14 content-center gap-1 rounded-lg p-3 text-[#11151a] ${groupStyles[index]}`}>
      <b className="text-xs font-black uppercase tracking-[0.08em]">{group.name}</b>
      <span className="text-xs leading-snug opacity-85">{group.words.join(" · ")}</span>
      {showExplanation ? <p className="text-xs leading-snug opacity-85">{group.explanation}</p> : null}
    </div>
  );
}

export function DailyWordCategoriesGame() {
  const [selected, setSelected] = useState<string[]>([]);
  const [remainingWords, setRemainingWords] = useState<string[]>(puzzle.words);
  const [solvedGroupIndexes, setSolvedGroupIndexes] = useState<number[]>([]);
  const [mistakesRemaining, setMistakesRemaining] = useState(maxMistakes);
  const [guesses, setGuesses] = useState(0);
  const [statusText, setStatusText] = useState("Select four words.");
  const [toast, setToast] = useState("");

  const gameOver = mistakesRemaining === 0 || solvedGroupIndexes.length === puzzle.groups.length;
  const resultVisible = gameOver;
  const didWin = solvedGroupIndexes.length === puzzle.groups.length;

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
      new Date(`${puzzle.date}T00:00:00`),
    );
  }, []);

  function showToast(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(""), 1400);
  }

  function toggleWord(word: string) {
    if (gameOver) return;
    if (selected.includes(word)) {
      const next = selected.filter((item) => item !== word);
      setSelected(next);
      setStatusText(next.length === 4 ? "Ready to submit." : "Select four words.");
      return;
    }
    if (selected.length >= 4) {
      showToast("You can select only 4 words.");
      return;
    }
    const next = [...selected, word];
    setSelected(next);
    setStatusText(next.length === 4 ? "Ready to submit." : "Select four words.");
  }

  function submitSelection() {
    if (selected.length !== 4 || gameOver) return;

    const selectedKey = normalizeWords(selected);
    const groupIndex = puzzle.groups.findIndex((group, index) => {
      return !solvedGroupIndexes.includes(index) && normalizeWords(group.words) === selectedKey;
    });

    setGuesses((value) => value + 1);

    if (groupIndex >= 0) {
      const nextSolved = [...solvedGroupIndexes, groupIndex];
      setSolvedGroupIndexes(nextSolved);
      setRemainingWords((words) => words.filter((word) => !selected.includes(word)));
      setSelected([]);
      setStatusText(nextSolved.length === puzzle.groups.length ? "Complete." : "Correct. Keep going.");
      showToast("Correct group.");
      return;
    }

    const nextMistakes = mistakesRemaining - 1;
    setMistakesRemaining(nextMistakes);
    setSelected([]);
    setStatusText(nextMistakes === 0 ? "Game over. Review the answers." : "Not a group. Try another set.");
    showToast("Not a group.");
  }

  function shuffleRemainingWords() {
    if (gameOver) return;
    setRemainingWords((words) => shuffleWords(words));
  }

  async function shareResult() {
    const rows = puzzle.groups.map((_, index) => shareRows[index].repeat(4)).join("\n");
    const text = [
      `Daily Word Categories #${puzzle.puzzleId}`,
      didWin ? `Solved in ${guesses} ${guesses === 1 ? "guess" : "guesses"}` : `Finished with ${solvedGroupIndexes.length}/4 groups`,
      rows,
      window.location.href.split("#")[0],
    ].join("\n");

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        copyTextFallback(text);
      }
      showToast("Copied result.");
    } catch {
      try {
        copyTextFallback(text);
        showToast("Copied result.");
      } catch {
        showToast("Share text ready, but clipboard is unavailable.");
      }
    }
  }

  return (
    <section className="bg-[#0b0d10] text-[#f4efe6]">
      <div className="mx-auto w-full max-w-[520px] px-3 py-5 sm:max-w-[1040px] sm:px-6">
        <div className="mx-auto w-full sm:w-[430px]">
          <div className="grid min-h-12 grid-cols-[44px_1fr_44px] items-center gap-2 border-b border-white/15">
            <button
              className="grid size-10 place-items-center rounded-full text-lg text-[#f4efe6]"
              type="button"
              aria-label="Open menu"
            >
              &#9776;
            </button>
            <div className="grid gap-0.5 text-center">
              <strong className="font-serif text-[22px] leading-none">Daily Word Categories</strong>
              <span className="text-[11px] leading-tight text-[#9aa3ad]">
                {formattedDate} · Puzzle #{puzzle.puzzleId}
              </span>
            </div>
            <button
              className="grid size-10 place-items-center rounded-full text-lg text-[#f4efe6]"
              type="button"
              aria-label="Puzzle stats"
            >
              &#9679;
            </button>
          </div>

          <div className="grid gap-2 py-4">
            <h1 className="font-serif text-3xl leading-tight text-[#f4efe6]">English Word Sorting Puzzle</h1>
            <p className="text-sm leading-6 text-[#9aa3ad]">
              Sort 16 English words into 4 hidden vocabulary categories.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pb-3">
            <div className="grid min-h-14 content-center gap-0.5 rounded-lg border border-white/15 bg-white/[0.035] px-3 py-2">
              <b className="text-lg leading-none">{mistakesRemaining}</b>
              <span className="text-[11px] text-[#9aa3ad]">mistakes left</span>
            </div>
            <div className="grid min-h-14 content-center gap-0.5 rounded-lg border border-white/15 bg-white/[0.035] px-3 py-2">
              <b className="text-lg leading-none">{guesses}</b>
              <span className="text-[11px] text-[#9aa3ad]">guesses</span>
            </div>
            <div className="grid min-h-14 content-center gap-0.5 rounded-lg border border-white/15 bg-white/[0.035] px-3 py-2">
              <b className="text-lg leading-none">{selected.length}/4</b>
              <span className="text-[11px] text-[#9aa3ad]">selected</span>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-2" aria-label="Solved categories">
              {solvedGroupIndexes.map((groupIndex) => (
                <GroupCard
                  key={puzzle.groups[groupIndex].name}
                  group={puzzle.groups[groupIndex]}
                  index={groupIndex}
                  showExplanation={false}
                />
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2" aria-label="Word tiles">
              {remainingWords.map((word) => {
                const isSelected = selected.includes(word);
                return (
                  <button
                    key={word}
                    className={`grid aspect-[1/0.72] min-w-0 place-items-center rounded-lg border p-1 text-center text-[clamp(10px,3vw,13px)] font-black uppercase leading-none shadow-[inset_0_1px_rgba(255,255,255,0.05)] transition ${
                      isSelected
                        ? "border-white/85 bg-gradient-to-br from-[#f2eadf] to-[#b8cad8] text-[#11151a]"
                        : "border-white/15 bg-[#1c232c] text-[#f4efe6] hover:bg-[#242c36]"
                    }`}
                    type="button"
                    aria-pressed={isSelected}
                    disabled={gameOver}
                    onClick={() => toggleWord(word)}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            <div className="flex min-h-7 items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#9aa3ad]" aria-label="Mistakes remaining">
                <span>Mistakes</span>
                {Array.from({ length: maxMistakes }).map((_, index) => (
                  <span
                    key={index}
                    className={`size-2.5 rounded-full ${index >= mistakesRemaining ? "bg-[#e46e67] opacity-50" : "bg-[#f4efe6] opacity-85"}`}
                  />
                ))}
              </div>
              <span className="text-[11px] leading-tight text-[#9aa3ad]">{statusText}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                className="min-h-12 rounded-full border border-white/15 px-4 text-sm font-black text-[#f4efe6] disabled:cursor-not-allowed disabled:opacity-45"
                type="button"
                disabled={gameOver || remainingWords.length < 2}
                onClick={shuffleRemainingWords}
              >
                Shuffle
              </button>
              <button
                className="min-h-12 rounded-full border border-[#f4efe6] bg-[#f4efe6] px-4 text-sm font-black text-[#11151a] disabled:cursor-not-allowed disabled:opacity-45"
                type="button"
                disabled={selected.length !== 4 || gameOver}
                onClick={submitSelection}
              >
                Submit group
              </button>
            </div>

            {resultVisible ? (
              <section className="grid gap-3 rounded-lg border border-white/15 bg-white/[0.035] p-3" aria-label="Puzzle result">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <b className="text-sm">{didWin ? "Puzzle complete" : "Answers"}</b>
                    <div className="text-[11px] text-[#9aa3ad]">
                      {didWin ? `Solved in ${guesses} ${guesses === 1 ? "guess" : "guesses"}` : "No mistakes remaining"}
                    </div>
                  </div>
                  <button
                    className="min-h-11 rounded-full border border-white/15 px-4 text-sm font-black text-[#f4efe6]"
                    type="button"
                    onClick={shareResult}
                  >
                    Share
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1" aria-hidden="true">
                  {puzzle.groups.flatMap((_, groupIndex) =>
                    Array.from({ length: 4 }).map((__, cellIndex) => (
                      <span key={`${groupIndex}-${cellIndex}`} className={`size-6 rounded ${groupStyles[groupIndex]}`} />
                    )),
                  )}
                </div>
                <div className="grid gap-2">
                  {puzzle.groups.map((group, index) => (
                    <GroupCard key={group.name} group={group} index={index} showExplanation />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <div className="grid gap-3 py-5">
            <section className="grid gap-2 rounded-lg border border-white/15 bg-white/[0.035] p-4">
              <h2 className="text-base font-semibold text-[#f4efe6]">How to play</h2>
              <ol className="list-decimal space-y-1 pl-5 text-sm leading-6 text-[#9aa3ad]">
                <li>Select exactly 4 words that share a hidden connection.</li>
                <li>Submit your group. Correct groups lock in place with their category name.</li>
                <li>Keep solving until all 4 categories are complete, before your mistakes run out.</li>
              </ol>
            </section>
            <section className="grid gap-2 rounded-lg border border-white/15 bg-white/[0.035] p-4">
              <h2 className="text-base font-semibold text-[#f4efe6]">About</h2>
              <p className="text-sm leading-6 text-[#9aa3ad]">
                Daily Word Categories is an English vocabulary sorting game built for quick practice with word
                meanings, associations, and patterns.
              </p>
            </section>
            <section className="grid gap-2 rounded-lg border border-white/15 bg-white/[0.035] p-4">
              <h2 className="text-base font-semibold text-[#f4efe6]">FAQ</h2>
              <div className="grid gap-2 text-sm leading-6 text-[#9aa3ad]">
                <p>
                  <strong className="text-[#f4efe6]">Is this puzzle free?</strong> Yes. This MVP is a static browser game
                  with one built-in puzzle.
                </p>
                <p>
                  <strong className="text-[#f4efe6]">Do I need an account?</strong> No. There is no login, database write,
                  or user tracking in this version.
                </p>
                <p>
                  <strong className="text-[#f4efe6]">What counts as a correct answer?</strong> The 4 selected words must
                  exactly match one of the unsolved hidden categories.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div
        className={`fixed bottom-5 left-1/2 rounded-full border border-white/15 bg-[#11151a]/95 px-4 py-2 text-sm text-[#f4efe6] transition ${
          toast ? "translate-x-[-50%] translate-y-0 opacity-100" : "pointer-events-none translate-x-[-50%] translate-y-20 opacity-0"
        }`}
        role="status"
        aria-live="polite"
      >
        {toast}
      </div>
    </section>
  );
}
