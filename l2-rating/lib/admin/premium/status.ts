import type { PromoLifecycleStatus } from "@/lib/admin/premium/constants";

type PromoDates = {
  isActive: boolean;
  startAt: Date;
  endAt: Date;
};

export function getPromoLifecycleStatus(
  entry: PromoDates,
  now: Date = new Date(),
): PromoLifecycleStatus {
  if (!entry.isActive) {
    return "inactive";
  }

  if (entry.endAt < now) {
    return "expired";
  }

  if (entry.startAt > now) {
    return "scheduled";
  }

  return "live";
}

export function countsTowardActiveSlotLimit(
  entry: PromoDates,
  now: Date = new Date(),
): boolean {
  return entry.isActive && entry.endAt >= now;
}

export function isPubliclyLive(entry: PromoDates, now: Date = new Date()): boolean {
  return entry.isActive && entry.startAt <= now && entry.endAt >= now;
}

export function formatPromoDateTime(value: Date): string {
  const pad = (part: number) => String(part).padStart(2, "0");

  return [
    value.getFullYear(),
    pad(value.getMonth() + 1),
    pad(value.getDate()),
  ].join("-") + `T${pad(value.getHours())}:${pad(value.getMinutes())}`;
}

export function parsePromoDateTime(value: string): Date | null {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}
