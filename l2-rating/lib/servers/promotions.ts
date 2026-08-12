import { PublicationStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { PublicServerCard } from "@/lib/servers/types";

type PublicServerShape = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  shortDescription: string | null;
  regularPosition: number | null;
  status: PublicServerCard["status"];
  isOpeningSoon: boolean;
  openingDate: Date | null;
  rateExp: number;
  rateSp: number;
  rateAdena: number;
  rateDrop: number;
  rateSpoil: number;
  serverType: PublicServerCard["serverType"];
  chronicles: Array<{ chronicle: { name: string; slug: string } }>;
};

type MapServerOptions = {
  isRankingPromotion?: boolean;
};

export function mapPublicServerCard(
  server: PublicServerShape,
  position: number,
  options: MapServerOptions = {},
): PublicServerCard {
  return {
    id: server.id,
    slug: server.slug,
    name: server.name,
    logoUrl: server.logoUrl,
    shortDescription: server.shortDescription,
    position,
    status: server.status,
    isOpeningSoon: server.isOpeningSoon,
    openingDate: server.openingDate,
    rateExp: server.rateExp,
    rateSp: server.rateSp,
    rateAdena: server.rateAdena,
    rateDrop: server.rateDrop,
    rateSpoil: server.rateSpoil,
    serverType: server.serverType,
    chronicles: server.chronicles
      .map((entry) => entry.chronicle)
      .sort((a, b) => a.name.localeCompare(b.name)),
    isRankingPromotion: options.isRankingPromotion ?? false,
  };
}

export function mergeServersWithRankingPromotions(
  servers: PublicServerShape[],
  promotions: Array<{ serverId: string; position: number }>,
): PublicServerCard[] {
  if (promotions.length === 0) {
    return servers.map((server, index) =>
      mapPublicServerCard(server, server.regularPosition ?? index + 1),
    );
  }

  const promotedByPosition = new Map(
    promotions.map((promotion) => [promotion.position, promotion.serverId]),
  );
  const promotedIds = new Set(promotions.map((promotion) => promotion.serverId));
  const serverById = new Map(servers.map((server) => [server.id, server]));

  const regularServers = servers
    .filter((server) => !promotedIds.has(server.id))
    .sort((left, right) => {
      const leftPosition = left.regularPosition ?? Number.MAX_SAFE_INTEGER;
      const rightPosition = right.regularPosition ?? Number.MAX_SAFE_INTEGER;

      if (leftPosition !== rightPosition) {
        return leftPosition - rightPosition;
      }

      return left.name.localeCompare(right.name);
    });

  const result: PublicServerCard[] = [];
  let regularIndex = 0;
  const totalSlots = regularServers.length + promotions.length;

  for (let slot = 1; slot <= totalSlots; slot += 1) {
    const promotedServerId = promotedByPosition.get(slot);

    if (promotedServerId) {
      const server = serverById.get(promotedServerId);

      if (server) {
        result.push(
          mapPublicServerCard(server, slot, { isRankingPromotion: true }),
        );
      }

      continue;
    }

    if (regularIndex < regularServers.length) {
      const server = regularServers[regularIndex];
      regularIndex += 1;
      result.push(mapPublicServerCard(server, slot));
    }
  }

  return result;
}

export async function getLiveRankingPromotions(serverIds: string[]) {
  if (serverIds.length === 0) {
    return [];
  }

  const now = new Date();

  return prisma.rankingPromotion.findMany({
    where: {
      isActive: true,
      startAt: { lte: now },
      endAt: { gte: now },
      serverId: { in: serverIds },
    },
    select: {
      serverId: true,
      position: true,
    },
    orderBy: { position: "asc" },
  });
}

export async function getLivePremiumBlockServers(): Promise<PublicServerCard[]> {
  const now = new Date();

  const entries = await prisma.premiumBlock.findMany({
    where: {
      isActive: true,
      startAt: { lte: now },
      endAt: { gte: now },
      server: {
        publicationStatus: PublicationStatus.PUBLISHED,
        archivedAt: null,
      },
    },
    orderBy: { position: "asc" },
    include: {
      server: {
        include: {
          serverType: { select: { name: true, slug: true } },
          chronicles: {
            include: {
              chronicle: { select: { name: true, slug: true } },
            },
          },
        },
      },
    },
  });

  return entries.map((entry) =>
    mapPublicServerCard(entry.server, entry.position, {
      isRankingPromotion: false,
    }),
  );
}
