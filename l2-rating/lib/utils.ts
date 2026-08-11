import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRate(value: number): string {
  return `x${value.toLocaleString("en-US")}`;
}

export function formatOpeningDate(
  value: Date | null,
  isOpeningSoon: boolean,
): string {
  if (isOpeningSoon) {
    return "Opening soon";
  }

  if (!value) {
    return "TBA";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

export function parseOptionalInt(value: string | undefined): number | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed < 0) {
    return undefined;
  }

  return parsed;
}

export function parseOptionalDate(value: string | undefined): Date | undefined {
  if (!value?.trim()) {
    return undefined;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
}

export function normalizeStringArray(
  value: string | string[] | undefined,
): string[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}
