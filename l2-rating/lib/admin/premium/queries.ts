import { PublicationStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { MAX_ACTIVE_PROMO_SLOTS } from "@/lib/admin/premium/constants";
import {
  countsTowardActiveSlotLimit,
  getPromoLifecycleStatus,
  parsePromoDateTime,
} from "@/lib/admin/premium/status";
import type { PromoEntryFormData, PromoEntryListItem } from "@/lib/admin/types";

type PromoModel = "premiumBlock" | "rankingPromotion";

const promoListInclude = {
  server: {
    select: {
      id: true,
      name: true,
      slug: true,
      publicationStatus: true,
    },
  },
} as const;

function mapPromoEntry(
  entry: {
    id: string;
    serverId: string;
    position: number;
    startAt: Date;
    endAt: Date;
    isActive: boolean;
    server: {
      id: string;
      name: string;
      slug: string;
      publicationStatus: PublicationStatus;
    };
  },
  productLabel: PromoEntryListItem["productLabel"],
): PromoEntryListItem {
  return {
    id: entry.id,
    serverId: entry.serverId,
    serverName: entry.server.name,
    serverSlug: entry.server.slug,
    position: entry.position,
    startAt: entry.startAt.toISOString(),
    endAt: entry.endAt.toISOString(),
    isActive: entry.isActive,
    lifecycleStatus: getPromoLifecycleStatus(entry),
    productLabel,
  };
}

export async function getPremiumBlocksForAdmin(): Promise<PromoEntryListItem[]> {
  const entries = await prisma.premiumBlock.findMany({
    orderBy: [{ position: "asc" }, { startAt: "desc" }],
    include: promoListInclude,
  });

  return entries.map((entry) => mapPromoEntry(entry, "Premium Block"));
}

export async function getRankingPromotionsForAdmin(): Promise<PromoEntryListItem[]> {
  const entries = await prisma.rankingPromotion.findMany({
    orderBy: [{ position: "asc" }, { startAt: "desc" }],
    include: promoListInclude,
  });

  return entries.map((entry) => mapPromoEntry(entry, "Ranking Promotion"));
}

export async function getPremiumBlockForEdit(
  id: string,
): Promise<PromoEntryFormData | null> {
  const entry = await prisma.premiumBlock.findUnique({
    where: { id },
    select: {
      id: true,
      serverId: true,
      position: true,
      startAt: true,
      endAt: true,
      isActive: true,
    },
  });

  if (!entry) {
    return null;
  }

  return {
    id: entry.id,
    serverId: entry.serverId,
    position: entry.position,
    startAt: entry.startAt.toISOString(),
    endAt: entry.endAt.toISOString(),
    isActive: entry.isActive,
  };
}

export async function getRankingPromotionForEdit(
  id: string,
): Promise<PromoEntryFormData | null> {
  const entry = await prisma.rankingPromotion.findUnique({
    where: { id },
    select: {
      id: true,
      serverId: true,
      position: true,
      startAt: true,
      endAt: true,
      isActive: true,
    },
  });

  if (!entry) {
    return null;
  }

  return {
    id: entry.id,
    serverId: entry.serverId,
    position: entry.position,
    startAt: entry.startAt.toISOString(),
    endAt: entry.endAt.toISOString(),
    isActive: entry.isActive,
  };
}

export async function getPublishedServerOptionsForPromo() {
  return prisma.server.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      archivedAt: null,
    },
    orderBy: [{ name: "asc" }],
    select: { id: true, name: true, slug: true },
  });
}

export async function countActivePromoSlots(
  model: PromoModel,
  excludeId?: string,
): Promise<number> {
  const now = new Date();

  const where = {
    isActive: true,
    endAt: { gte: now },
    ...(excludeId ? { NOT: { id: excludeId } } : {}),
  };

  if (model === "premiumBlock") {
    return prisma.premiumBlock.count({ where });
  }

  return prisma.rankingPromotion.count({ where });
}

export type ParsedPromoInput =
  | { error: string }
  | {
      data: {
        serverId: string;
        position: number;
        startAt: Date;
        endAt: Date;
        isActive: boolean;
      };
    };

export async function parsePromoFormData(
  formData: FormData,
  model: PromoModel,
  excludeId?: string,
): Promise<ParsedPromoInput> {
  const serverId = formData.get("serverId");

  if (typeof serverId !== "string" || !serverId.trim()) {
    return { error: "Server is required." };
  }

  const server = await prisma.server.findFirst({
    where: {
      id: serverId,
      publicationStatus: PublicationStatus.PUBLISHED,
      archivedAt: null,
    },
    select: { id: true },
  });

  if (!server) {
    return { error: "Selected server must be published and not archived." };
  }

  const positionRaw = formData.get("position");

  if (typeof positionRaw !== "string" || !positionRaw.trim()) {
    return { error: "Position is required." };
  }

  const position = Number.parseInt(positionRaw, 10);

  if (
    Number.isNaN(position) ||
    position < 1 ||
    position > MAX_ACTIVE_PROMO_SLOTS
  ) {
    return {
      error: `Position must be an integer between 1 and ${MAX_ACTIVE_PROMO_SLOTS}.`,
    };
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

  const candidate = { isActive, startAt, endAt };

  if (countsTowardActiveSlotLimit(candidate)) {
    const activeCount = await countActivePromoSlots(model, excludeId);

    if (activeCount >= MAX_ACTIVE_PROMO_SLOTS) {
      return {
        error: `Maximum ${MAX_ACTIVE_PROMO_SLOTS} active promotions allowed (including scheduled).`,
      };
    }

    const positionConflict =
      model === "premiumBlock"
        ? await prisma.premiumBlock.findFirst({
            where: {
              isActive: true,
              endAt: { gte: new Date() },
              position,
              ...(excludeId ? { NOT: { id: excludeId } } : {}),
            },
            select: { id: true },
          })
        : await prisma.rankingPromotion.findFirst({
            where: {
              isActive: true,
              endAt: { gte: new Date() },
              position,
              ...(excludeId ? { NOT: { id: excludeId } } : {}),
            },
            select: { id: true },
          });

    if (positionConflict) {
      return {
        error: `Position ${position} is already used by another active promotion.`,
      };
    }
  }

  return {
    data: {
      serverId,
      position,
      startAt,
      endAt,
      isActive,
    },
  };
}
