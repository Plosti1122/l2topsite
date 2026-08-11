import type { ServerStatus } from "@/generated/prisma/client";
import {
  normalizeStringArray,
  parseOptionalDate,
  parseOptionalInt,
} from "@/lib/utils";
import type { RankingFilters, RateFilterKey } from "@/lib/servers/types";

const RATE_KEYS: RateFilterKey[] = [
  "rateExp",
  "rateSp",
  "rateAdena",
  "rateDrop",
  "rateSpoil",
];

function parseStatus(value: string | undefined): ServerStatus | null {
  if (value === "UPCOMING" || value === "ONLINE") {
    return value;
  }

  return null;
}

function parseRateBounds(
  params: Record<string, string | string[] | undefined>,
  key: RateFilterKey,
): { min?: number; max?: number } {
  const minParam = params[`${key}Min`];
  const maxParam = params[`${key}Max`];
  const min = parseOptionalInt(typeof minParam === "string" ? minParam : undefined);
  const max = parseOptionalInt(typeof maxParam === "string" ? maxParam : undefined);

  if (min === undefined && max === undefined) {
    return {};
  }

  return { min, max };
}

export function parseRankingFilters(
  params: Record<string, string | string[] | undefined>,
): RankingFilters {
  const rates = RATE_KEYS.reduce<RankingFilters["rates"]>((acc, key) => {
    acc[key] = parseRateBounds(params, key);
    return acc;
  }, {} as RankingFilters["rates"]);

  return {
    chronicles: normalizeStringArray(params.chronicle).filter(Boolean),
    type: typeof params.type === "string" && params.type ? params.type : null,
    status: parseStatus(
      typeof params.status === "string" ? params.status : undefined,
    ),
    openingFrom: parseOptionalDate(
      typeof params.openingFrom === "string" ? params.openingFrom : undefined,
    ) ?? null,
    openingTo: parseOptionalDate(
      typeof params.openingTo === "string" ? params.openingTo : undefined,
    ) ?? null,
    rates,
  };
}

export function hasActiveFilters(filters: RankingFilters): boolean {
  if (
    filters.chronicles.length > 0 ||
    filters.type ||
    filters.status ||
    filters.openingFrom ||
    filters.openingTo
  ) {
    return true;
  }

  return RATE_KEYS.some((key) => {
    const bounds = filters.rates[key];
    return bounds.min !== undefined || bounds.max !== undefined;
  });
}

export function buildFilterSearchParams(filters: RankingFilters): URLSearchParams {
  const params = new URLSearchParams();

  for (const slug of filters.chronicles) {
    params.append("chronicle", slug);
  }

  if (filters.type) {
    params.set("type", filters.type);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.openingFrom) {
    params.set("openingFrom", filters.openingFrom.toISOString().slice(0, 10));
  }

  if (filters.openingTo) {
    params.set("openingTo", filters.openingTo.toISOString().slice(0, 10));
  }

  for (const key of RATE_KEYS) {
    const bounds = filters.rates[key];

    if (bounds.min !== undefined) {
      params.set(`${key}Min`, String(bounds.min));
    }

    if (bounds.max !== undefined) {
      params.set(`${key}Max`, String(bounds.max));
    }
  }

  return params;
}
