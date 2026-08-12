import { Prisma } from "@/generated/prisma/client";
import { slugify } from "@/lib/admin/slug";
import {
  parseOptionalString,
  parseRequiredInt,
  parseRequiredString,
} from "@/lib/admin/form";
import {
  getPromoLifecycleStatus,
  parsePromoDateTime,
} from "@/lib/admin/premium/status";
import type {
  AdPositionFormData,
  AdPositionListItem,
  AdPositionOption,
  BannerFormData,
  BannerListItem,
} from "@/lib/admin/types";
import { prisma } from "@/lib/prisma";
import { parseOptionalInt } from "@/lib/utils";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}

export { isUniqueConstraintError };

export async function getAdPositionsForAdmin(): Promise<AdPositionListItem[]> {
  const rows = await prisma.adPosition.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { banners: true } },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    location: row.location,
    width: row.width,
    height: row.height,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
    bannerCount: row._count.banners,
  }));
}

export async function getAdPositionForEdit(
  id: string,
): Promise<AdPositionFormData | null> {
  const row = await prisma.adPosition.findUnique({ where: { id } });

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    location: row.location,
    width: row.width,
    height: row.height,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
  };
}

export async function getActiveAdPositionOptions(): Promise<AdPositionOption[]> {
  return prisma.adPosition.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      location: true,
    },
  });
}

export async function getAdPositionOptionsForBannerForm(
  selectedId?: string,
): Promise<AdPositionOption[]> {
  return prisma.adPosition.findMany({
    where: {
      OR: [{ isActive: true }, ...(selectedId ? [{ id: selectedId }] : [])],
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      location: true,
    },
  });
}

export async function getBannersForAdmin(): Promise<BannerListItem[]> {
  const rows = await prisma.banner.findMany({
    orderBy: [{ startAt: "desc" }],
    include: {
      adPosition: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    adPositionId: row.adPositionId,
    adPositionName: row.adPosition.name,
    adPositionSlug: row.adPosition.slug,
    imageUrl: row.imageUrl,
    targetUrl: row.targetUrl,
    altText: row.altText,
    startAt: row.startAt.toISOString(),
    endAt: row.endAt.toISOString(),
    isActive: row.isActive,
    lifecycleStatus: getPromoLifecycleStatus(row),
  }));
}

export async function getBannerForEdit(id: string): Promise<BannerFormData | null> {
  const row = await prisma.banner.findUnique({
    where: { id },
    select: {
      id: true,
      adPositionId: true,
      imageUrl: true,
      targetUrl: true,
      altText: true,
      startAt: true,
      endAt: true,
      isActive: true,
    },
  });

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    adPositionId: row.adPositionId,
    imageUrl: row.imageUrl,
    targetUrl: row.targetUrl,
    altText: row.altText,
    startAt: row.startAt.toISOString(),
    endAt: row.endAt.toISOString(),
    isActive: row.isActive,
  };
}

export type ParsedAdPositionInput =
  | { error: string }
  | {
      data: {
        name: string;
        slug: string;
        location: string;
        width: number | null;
        height: number | null;
        isActive: boolean;
        sortOrder: number;
      };
    };

export function parseAdPositionFormData(
  formData: FormData,
): ParsedAdPositionInput {
  const name = parseRequiredString(formData, "name");

  if (!name) {
    return { error: "Name is required." };
  }

  const slugInput = parseOptionalString(formData, "slug");
  const slug = slugInput?.trim() ? slugify(slugInput) : slugify(name);

  if (!slug) {
    return { error: "Slug is required." };
  }

  const location = parseRequiredString(formData, "location");

  if (!location) {
    return { error: "Location is required." };
  }

  const widthRaw = parseOptionalString(formData, "width");
  const heightRaw = parseOptionalString(formData, "height");
  const width = widthRaw ? parseOptionalInt(widthRaw) : null;
  const height = heightRaw ? parseOptionalInt(heightRaw) : null;

  if (widthRaw && width === undefined) {
    return { error: "Width must be a non-negative number." };
  }

  if (heightRaw && height === undefined) {
    return { error: "Height must be a non-negative number." };
  }

  const sortOrder = parseRequiredInt(formData, "sortOrder") ?? 0;
  const isActive =
    formData.get("isActive") === "on" ||
    formData.get("isActive") === "true" ||
    formData.get("isActive") === "1";

  return {
    data: {
      name,
      slug,
      location,
      width: width ?? null,
      height: height ?? null,
      isActive,
      sortOrder,
    },
  };
}

export type ParsedBannerInput =
  | { error: string }
  | {
      data: {
        adPositionId: string;
        imageUrl: string;
        targetUrl: string;
        altText: string | null;
        startAt: Date;
        endAt: Date;
        isActive: boolean;
      };
    };

export async function assertNoOverlappingBanners(
  adPositionId: string,
  startAt: Date,
  endAt: Date,
  isActive: boolean,
  excludeId?: string,
): Promise<string | null> {
  if (!isActive) {
    return null;
  }

  const overlap = await prisma.banner.findFirst({
    where: {
      adPositionId,
      isActive: true,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
      startAt: { lt: endAt },
      endAt: { gt: startAt },
    },
    select: { id: true },
  });

  if (overlap) {
    return "Another active banner on this position overlaps the selected schedule (BR-21).";
  }

  return null;
}

export async function parseBannerFormData(
  formData: FormData,
  excludeId?: string,
): Promise<ParsedBannerInput> {
  const adPositionId = parseRequiredString(formData, "adPositionId");

  if (!adPositionId) {
    return { error: "Ad position is required." };
  }

  const adPosition = await prisma.adPosition.findUnique({
    where: { id: adPositionId },
    select: { id: true },
  });

  if (!adPosition) {
    return { error: "Selected ad position was not found." };
  }

  const imageUrl = parseRequiredString(formData, "imageUrl");

  if (!imageUrl) {
    return { error: "Image URL is required." };
  }

  const targetUrl = parseRequiredString(formData, "targetUrl");

  if (!targetUrl) {
    return { error: "Target URL is required." };
  }

  const startAtRaw = formData.get("startAt");
  const endAtRaw = formData.get("endAt");

  if (typeof startAtRaw !== "string" || typeof endAtRaw !== "string") {
    return { error: "Start and end dates are required." };
  }

  const startAt = parsePromoDateTime(startAtRaw);
  const endAt = parsePromoDateTime(endAtRaw);

  if (!startAt || !endAt) {
    return { error: "Start or end date is invalid." };
  }

  if (startAt >= endAt) {
    return { error: "End date must be after start date." };
  }

  const isActive =
    formData.get("isActive") === "on" ||
    formData.get("isActive") === "true" ||
    formData.get("isActive") === "1";

  const overlapError = await assertNoOverlappingBanners(
    adPositionId,
    startAt,
    endAt,
    isActive,
    excludeId,
  );

  if (overlapError) {
    return { error: overlapError };
  }

  return {
    data: {
      adPositionId,
      imageUrl,
      targetUrl,
      altText: parseOptionalString(formData, "altText"),
      startAt,
      endAt,
      isActive,
    },
  };
}
