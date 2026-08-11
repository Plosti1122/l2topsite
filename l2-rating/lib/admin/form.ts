import { slugify } from "@/lib/admin/slug";
import { parseOptionalInt } from "@/lib/utils";

export function parseRequiredString(formData: FormData, key: string): string | null {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim();
}

export function parseOptionalString(formData: FormData, key: string): string | null {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  return value.trim();
}

export function parseCheckbox(formData: FormData, key: string): boolean {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}

export function parseRequiredInt(formData: FormData, key: string): number | null {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

export function parseOptionalNullableInt(
  formData: FormData,
  key: string,
): number | null | undefined {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const parsed = parseOptionalInt(value);

  if (parsed === undefined) {
    return undefined;
  }

  return parsed;
}

export function parseStringArray(formData: FormData, key: string): string[] {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string" && value.length > 0);
}

export function resolveSlug(name: string, slugInput: string | null): string {
  const trimmedSlug = slugInput?.trim();

  if (trimmedSlug) {
    return slugify(trimmedSlug);
  }

  return slugify(name);
}

export type ParsedDictionaryInput = {
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

export function parseDictionaryFormData(
  formData: FormData,
): ParsedDictionaryInput | { error: string } {
  const name = parseRequiredString(formData, "name");

  if (!name) {
    return { error: "Name is required." };
  }

  const slugInput = parseOptionalString(formData, "slug");
  const slug = resolveSlug(name, slugInput);

  if (!slug) {
    return { error: "Slug is required." };
  }

  const sortOrder = parseRequiredInt(formData, "sortOrder") ?? 0;
  const isActive = parseCheckbox(formData, "isActive");

  return { name, slug, sortOrder, isActive };
}

export type ParsedServerLink = {
  label: string;
  url: string;
  sortOrder: number;
};

export function parseServerLinks(formData: FormData): ParsedServerLink[] {
  const labels = formData.getAll("linkLabel");
  const urls = formData.getAll("linkUrl");
  const count = Math.min(labels.length, urls.length);
  const links: ParsedServerLink[] = [];

  for (let index = 0; index < count; index += 1) {
    const label = labels[index];
    const url = urls[index];

    if (typeof label !== "string" || typeof url !== "string") {
      continue;
    }

    const trimmedLabel = label.trim();
    const trimmedUrl = url.trim();

    if (!trimmedLabel || !trimmedUrl) {
      continue;
    }

    links.push({
      label: trimmedLabel,
      url: trimmedUrl,
      sortOrder: index,
    });
  }

  return links;
}
