type CommonMistake = {
  wrong: string;
  correct: string;
  explanation: string;
};

export function CommonMistakes({
  mistakes,
}: {
  mistakes: CommonMistake[];
}) {
  return (
    <div className="grid gap-3">
      {mistakes.map((mistake) => (
        <div key={mistake.wrong} className="rounded-lg border border-rose-100 bg-white p-4">
          <p className="text-sm font-medium text-rose-700">Not natural: {mistake.wrong}</p>
          <p className="mt-2 text-sm font-medium text-teal-800">Better: {mistake.correct}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">{mistake.explanation}</p>
        </div>
      ))}
    </div>
  );
}
