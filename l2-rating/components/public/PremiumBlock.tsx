import Link from "next/link";
import { ServerRatesGrid } from "@/components/public/ServerRatesGrid";
import { ServerStatusBadge } from "@/components/public/ServerStatusBadge";
import { formatOpeningDate } from "@/lib/utils";
import type { PublicServerCard } from "@/lib/servers/types";

type PremiumBlockProps = {
  servers: PublicServerCard[];
};

export function PremiumBlock({ servers }: PremiumBlockProps) {
  if (servers.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-amber-500/40 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.18),transparent_55%),linear-gradient(180deg,rgba(39,39,42,0.95),rgba(9,9,11,1))] px-6 py-8 sm:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-amber-300/90">
            Premium servers
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-50">
            Featured Lineage 2 projects
          </h2>
        </div>
        <p className="text-sm text-amber-100/70">
          {servers.length} promoted server{servers.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {servers.map((server) => (
          <article
            key={server.id}
            className="rounded-2xl border border-amber-500/30 bg-zinc-950/70 p-5"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/10 text-sm font-bold text-amber-200">
                #{server.position}
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-zinc-50">
                    {server.name}
                  </h3>
                  <ServerStatusBadge status={server.status} />
                </div>

                {server.shortDescription ? (
                  <p className="line-clamp-2 text-sm text-zinc-400">
                    {server.shortDescription}
                  </p>
                ) : null}

                <div className="text-sm text-zinc-400">
                  Opening:{" "}
                  <span className="text-zinc-200">
                    {formatOpeningDate(server.openingDate, server.isOpeningSoon)}
                  </span>
                </div>

                <ServerRatesGrid
                  rateExp={server.rateExp}
                  rateSp={server.rateSp}
                  rateAdena={server.rateAdena}
                  rateDrop={server.rateDrop}
                  rateSpoil={server.rateSpoil}
                />

                <Link
                  href={`/servers/${server.slug}`}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 text-sm font-medium text-amber-100 transition hover:bg-amber-500/20"
                >
                  View server
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
