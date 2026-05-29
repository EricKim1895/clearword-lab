import type { ConfusingWordEntry } from "@/types/content";

export function ExampleList({ examples }: { examples: ConfusingWordEntry["examples"] }) {
  return (
    <div className="grid gap-3">
      {examples.map((example) => (
        <div key={`${example.word}-${example.sentence}`} className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">{example.word}</p>
          <p className="mt-2 text-slate-900">{example.sentence}</p>
          {example.note ? <p className="mt-2 text-sm text-slate-600">{example.note}</p> : null}
        </div>
      ))}
    </div>
  );
}
