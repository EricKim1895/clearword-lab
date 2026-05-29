import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>ClearWord Lab helps ESL learners understand confusing English words.</p>
        <div className="flex gap-4">
          <Link className="hover:text-sky-800" href="/confusing-words">
            Confusing Words
          </Link>
          <Link className="hover:text-sky-800" href="/about">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
