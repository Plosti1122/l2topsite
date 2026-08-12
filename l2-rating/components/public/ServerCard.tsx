import Link from "next/link";
import { ServerRatesGrid } from "@/components/public/ServerRatesGrid";
import { ServerStatusBadge } from "@/components/public/ServerStatusBadge";
import { formatOpeningDate } from "@/lib/utils";
import type { PublicServerCard } from "@/lib/servers/types";

type ServerCardProps = {
  server: PublicServerCard;
};

export function ServerCard({ server }: ServerCardProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-5 shadow-lg shadow-black/20 transition ${
        server.isRankingPromotion
          ? "border-fuchsia-500/40 hover:border-fuchsia-400/60"
          : "border-amber-900/30 hover:border-amber-700/50"
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent ${
          server.isRankingPromotion
            ? "via-fuchsia-400/70"
            : "via-amber-500/60"
        }`}
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-amber-800/40 bg-zinc-950 text-lg font-bold text-amber-300">
            #{server.position}
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
            {server.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={server.logoUrl}
                alt={`${server.name} logo`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xl font-semibold text-amber-200/80">
                {server.name.slice(0, 1)}
              </span>
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold text-zinc-50">{server.name}</h2>
            {server.isRankingPromotion ? (
              <span className="rounded-full border border-fuchsia-500/40 bg-fuchsia-500/10 px-2.5 py-0.5 text-xs font-medium text-fuchsia-200">
                Promoted
              </span>
            ) : null}
            <ServerStatusBadge status={server.status} />
            <span className="rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-300">
              {server.serverType.name}
            </span>
          </div>

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

          {server.shortDescription ? (
            <p className="line-clamp-2 text-sm leading-6 text-zinc-400">
              {server.shortDescription}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400">
            <span>
              Opening:{" "}
              <span className="text-zinc-200">
                {formatOpeningDate(server.openingDate, server.isOpeningSoon)}
              </span>
            </span>
          </div>

          <ServerRatesGrid
            rateExp={server.rateExp}
            rateSp={server.rateSp}
            rateAdena={server.rateAdena}
            rateDrop={server.rateDrop}
            rateSpoil={server.rateSpoil}
          />
        </div>

        <div className="flex shrink-0 items-center lg:pt-1">
          <Link
            href={`/servers/${server.slug}`}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-amber-600/50 bg-amber-500/10 px-4 text-sm font-medium text-amber-100 transition hover:bg-amber-500/20"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
