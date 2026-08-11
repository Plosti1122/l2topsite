import { ServerCard } from "@/components/public/ServerCard";
import type { PublicServerCard } from "@/lib/servers/types";

type ServerRankingListProps = {
  servers: PublicServerCard[];
  hasActiveFilters: boolean;
};

export function ServerRankingList({
  servers,
  hasActiveFilters,
}: ServerRankingListProps) {
  if (servers.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-zinc-100">
          No servers match your filters
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          {hasActiveFilters
            ? "Try changing or resetting the filters to see more results."
            : "Published servers will appear here once they are added in the admin panel."}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-50">Server ranking</h2>
          <p className="text-sm text-zinc-400">
            {servers.length} published server{servers.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {servers.map((server) => (
          <ServerCard key={server.id} server={server} />
        ))}
      </div>
    </section>
  );
}
