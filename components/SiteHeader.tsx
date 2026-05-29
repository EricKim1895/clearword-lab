import Link from "next/link";

const navItems = [
  { href: "/confusing-words", label: "Confusing Words" },
  { href: "/quiz", label: "Practice" },
  { href: "/review", label: "Review" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-950">
          <span className="flex size-9 items-center justify-center rounded-lg bg-teal-600 text-sm font-bold text-white">
            CW
          </span>
          <span>ClearWord Lab</span>
        </Link>
        <nav className="flex flex-wrap gap-2 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 transition hover:bg-sky-50 hover:text-sky-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
