import { formatRate } from "@/lib/utils";

type ServerRatesGridProps = {
  rateExp: number;
  rateSp: number;
  rateAdena: number;
  rateDrop: number;
  rateSpoil: number;
};

const rateFields = [
  { key: "rateExp", label: "EXP" },
  { key: "rateSp", label: "SP" },
  { key: "rateAdena", label: "Adena" },
  { key: "rateDrop", label: "Drop" },
  { key: "rateSpoil", label: "Spoil" },
] as const;

export function ServerRatesGrid({
  rateExp,
  rateSp,
  rateAdena,
  rateDrop,
  rateSpoil,
}: ServerRatesGridProps) {
  const values = { rateExp, rateSp, rateAdena, rateDrop, rateSpoil };

  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {rateFields.map((field) => (
        <div
          key={field.key}
          className="rounded-lg border border-zinc-800/80 bg-zinc-950/70 px-3 py-2"
        >
          <dt className="text-[11px] uppercase tracking-wide text-zinc-500">
            {field.label}
          </dt>
          <dd className="text-sm font-semibold text-amber-100">
            {formatRate(values[field.key])}
          </dd>
        </div>
      ))}
    </dl>
  );
}
