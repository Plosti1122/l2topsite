import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div>
          <Link href="/" className="inline-flex flex-col">
            <span className="text-xs uppercase tracking-[0.24em] text-amber-400/80">
              Lineage 2
            </span>
            <span className="text-xl font-semibold text-zinc-50">
              Server Ranking
            </span>
          </Link>
        </div>

        <nav className="text-sm text-zinc-400">
          <span className="rounded-full border border-zinc-800 px-3 py-1">
            Public catalog
          </span>
        </nav>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-zinc-500 sm:px-6 lg:px-8">
        Admin-managed Lineage 2 server ranking platform.
      </div>
    </footer>
  );
}
