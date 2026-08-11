import type { Metadata } from "next";
import { RankingFiltersPanel } from "@/components/public/RankingFiltersPanel";
import { ServerRankingList } from "@/components/public/ServerRankingList";
import {
  hasActiveFilters,
  parseRankingFilters,
} from "@/lib/servers/filters";
import { getFilterOptions, getPublishedServers } from "@/lib/servers/queries";

export const metadata: Metadata = {
  title: "Lineage 2 Server Ranking",
  description:
    "Browse the admin-managed Lineage 2 server ranking with filters by chronicle, type, rates, opening date, and status.",
};

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const filters = parseRankingFilters(params);

  const [options, servers] = await Promise.all([
    getFilterOptions(),
    getPublishedServers(filters),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 overflow-hidden rounded-3xl border border-amber-900/30 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.16),transparent_40%),linear-gradient(180deg,rgba(24,24,27,0.95),rgba(9,9,11,1))] px-6 py-10 sm:px-8">
        <p className="text-sm uppercase tracking-[0.28em] text-amber-400/80">
          Public ranking
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
          Find your next Lineage 2 server
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
          Explore published servers sorted by admin-managed ranking. Filter by
          chronicles, server type, rates, opening date, and status.
        </p>
      </section>

      <div className="grid gap-8 xl:grid-cols-[360px_minmax(0,1fr)]">
        <RankingFiltersPanel filters={filters} options={options} />
        <ServerRankingList
          servers={servers}
          hasActiveFilters={hasActiveFilters(filters)}
        />
      </div>
    </div>
  );
}
