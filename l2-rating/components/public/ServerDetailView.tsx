import Link from "next/link";
import { MarkdownContent } from "@/components/public/MarkdownContent";
import { ServerRatesGrid } from "@/components/public/ServerRatesGrid";
import { ServerStatusBadge } from "@/components/public/ServerStatusBadge";
import type { PublicServerDetail } from "@/lib/servers/types";
import { formatOpeningDate } from "@/lib/utils";

type ServerDetailViewProps = {
  server: PublicServerDetail;
};

export function ServerDetailView({ server }: ServerDetailViewProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-amber-300 transition hover:text-amber-200"
      >
        ← Back to ranking
      </Link>

      <section className="mt-6 overflow-hidden rounded-3xl border border-amber-900/30 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-8">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            {server.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={server.logoUrl}
                alt={`${server.name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl font-semibold text-amber-200/80">
                {server.name.slice(0, 1)}
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg border border-amber-800/40 bg-zinc-950 px-3 py-1 text-sm font-semibold text-amber-300">
                #{server.position}
              </span>
              <ServerStatusBadge status={server.status} />
              <span className="rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-300">
                {server.serverType.name}
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
              {server.name}
            </h1>

            {server.shortDescription ? (
              <p className="max-w-3xl text-base leading-7 text-zinc-400">
                {server.shortDescription}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-2">
              {server.chronicles.map((chronicle) => (
                <span
                  key={chronicle.slug}
                  className="rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-200"
                >
                  {chronicle.name}
                </span>
              ))}
            </div>

            <p className="text-sm text-zinc-400">
              Opening:{" "}
              <span className="text-zinc-200">
                {formatOpeningDate(server.openingDate, server.isOpeningSoon)}
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-zinc-50">Rates</h2>
        <ServerRatesGrid
          rateExp={server.rateExp}
          rateSp={server.rateSp}
          rateAdena={server.rateAdena}
          rateDrop={server.rateDrop}
          rateSpoil={server.rateSpoil}
        />
      </section>

      {server.fullDescription ? (
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-zinc-50">Description</h2>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6">
            <MarkdownContent content={server.fullDescription} />
          </div>
        </section>
      ) : null}

      {server.links.length > 0 ? (
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-zinc-50">Links</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {server.links.map((link) => (
              <li key={`${link.label}-${link.url}`}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/60 px-4 py-3 text-sm transition hover:border-amber-700/50 hover:bg-zinc-900"
                >
                  <span className="font-medium text-zinc-100">{link.label}</span>
                  <span className="text-amber-300">Open →</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
