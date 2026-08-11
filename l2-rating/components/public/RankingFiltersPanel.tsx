import type { RankingFilters } from "@/lib/servers/types";
import type { FilterOptions } from "@/lib/servers/types";

type RankingFiltersProps = {
  filters: RankingFilters;
  options: FilterOptions;
};

const rateFields = [
  { key: "rateExp", label: "EXP" },
  { key: "rateSp", label: "SP" },
  { key: "rateAdena", label: "Adena" },
  { key: "rateDrop", label: "Drop" },
  { key: "rateSpoil", label: "Spoil" },
] as const;

export function RankingFiltersPanel({ filters, options }: RankingFiltersProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl shadow-black/20">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-50">Filters</h2>
          <p className="text-sm text-zinc-400">
            Chronicle, type, rates, opening date, status
          </p>
        </div>
        <a
          href="/"
          className="text-sm text-amber-300 transition hover:text-amber-200"
        >
          Reset
        </a>
      </div>

      <form method="get" className="space-y-6">
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-zinc-200">Chronicles</legend>
          <div className="flex flex-wrap gap-2">
            {options.chronicles.map((chronicle) => (
              <label
                key={chronicle.slug}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-300 transition has-checked:border-amber-600/60 has-checked:bg-amber-500/10 has-checked:text-amber-100"
              >
                <input
                  type="checkbox"
                  name="chronicle"
                  value={chronicle.slug}
                  defaultChecked={filters.chronicles.includes(chronicle.slug)}
                  className="accent-amber-500"
                />
                {chronicle.name}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm">
            <span className="font-medium text-zinc-200">Server type</span>
            <select
              name="type"
              defaultValue={filters.type ?? ""}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-amber-600/60"
            >
              <option value="">All types</option>
              {options.serverTypes.map((type) => (
                <option key={type.slug} value={type.slug}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium text-zinc-200">Status</span>
            <select
              name="status"
              defaultValue={filters.status ?? ""}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-amber-600/60"
            >
              <option value="">All statuses</option>
              <option value="ONLINE">Online</option>
              <option value="UPCOMING">Upcoming</option>
            </select>
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium text-zinc-200">Opening from</span>
            <input
              type="date"
              name="openingFrom"
              defaultValue={filters.openingFrom?.toISOString().slice(0, 10) ?? ""}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-amber-600/60"
            />
          </label>

          <label className="space-y-2 text-sm">
            <span className="font-medium text-zinc-200">Opening to</span>
            <input
              type="date"
              name="openingTo"
              defaultValue={filters.openingTo?.toISOString().slice(0, 10) ?? ""}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 outline-none focus:border-amber-600/60"
            />
          </label>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-zinc-200">Rates</legend>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {rateFields.map((field) => {
              const bounds = filters.rates[field.key];

              return (
                <div
                  key={field.key}
                  className="rounded-xl border border-zinc-800 p-3"
                >
                  <p className="mb-2 text-sm font-medium text-zinc-200">
                    {field.label}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min={0}
                      name={`${field.key}Min`}
                      defaultValue={bounds.min ?? ""}
                      placeholder="Min"
                      className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-600/60"
                    />
                    <input
                      type="number"
                      min={0}
                      name={`${field.key}Max`}
                      defaultValue={bounds.max ?? ""}
                      placeholder="Max"
                      className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-600/60"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </fieldset>

        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-amber-500 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400"
        >
          Apply filters
        </button>
      </form>
    </section>
  );
}
