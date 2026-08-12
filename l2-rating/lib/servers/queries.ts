import { Prisma, PublicationStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
  getLiveRankingPromotions,
  mapPublicServerCard,
  mergeServersWithRankingPromotions,
} from "@/lib/servers/promotions";
import type {
  FilterOptions,
  PublicServerCard,
  PublicServerDetail,
  RankingFilters,
  RateFilterKey,
} from "@/lib/servers/types";

const publicServerInclude = {
  serverType: {
    select: {
      name: true,
      slug: true,
    },
  },
  chronicles: {
    include: {
      chronicle: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  },
  links: {
    orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
    select: {
      label: true,
      url: true,
    },
  },
} satisfies Prisma.ServerInclude;

type PublicServerRecord = Prisma.ServerGetPayload<{
  include: typeof publicServerInclude;
}>;

function buildRateFilter(
  key: RateFilterKey,
  bounds: { min?: number; max?: number },
): Prisma.IntFilter | undefined {
  if (bounds.min === undefined && bounds.max === undefined) {
    return undefined;
  }

  return {
    ...(bounds.min !== undefined ? { gte: bounds.min } : {}),
    ...(bounds.max !== undefined ? { lte: bounds.max } : {}),
  };
}

function buildServerWhere(filters: RankingFilters): Prisma.ServerWhereInput {
  const where: Prisma.ServerWhereInput = {
    publicationStatus: PublicationStatus.PUBLISHED,
    archivedAt: null,
  };

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.type) {
    where.serverType = { slug: filters.type, isActive: true };
  }

  if (filters.chronicles.length > 0) {
    where.chronicles = {
      some: {
        chronicle: {
          slug: { in: filters.chronicles },
          isActive: true,
        },
      },
    };
  }

  if (filters.openingFrom || filters.openingTo) {
    where.openingDate = {
      ...(filters.openingFrom ? { gte: filters.openingFrom } : {}),
      ...(filters.openingTo ? { lte: filters.openingTo } : {}),
    };
  }

  for (const [key, bounds] of Object.entries(filters.rates) as Array<
    [RateFilterKey, { min?: number; max?: number }]
  >) {
    const rateFilter = buildRateFilter(key, bounds);

    if (rateFilter) {
      where[key] = rateFilter;
    }
  }

  return where;
}

function mapServerDetail(
  server: PublicServerRecord,
  index: number,
): PublicServerDetail {
  return {
    ...mapPublicServerCard(server, server.regularPosition ?? index + 1),
    fullDescription: server.fullDescription,
    seoTitle: server.seoTitle,
    seoDescription: server.seoDescription,
    ogImageUrl: server.ogImageUrl,
    links: server.links,
  };
}

export async function getPublishedServerBySlug(
  slug: string,
): Promise<PublicServerDetail | null> {
  const server = await prisma.server.findFirst({
    where: {
      slug,
      publicationStatus: PublicationStatus.PUBLISHED,
      archivedAt: null,
    },
    include: publicServerInclude,
  });

  if (!server) {
    return null;
  }

  return mapServerDetail(server, server.regularPosition ?? 0);
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const [chronicles, serverTypes] = await Promise.all([
    prisma.chronicle.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { slug: true, name: true },
    }),
    prisma.serverType.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { slug: true, name: true },
    }),
  ]);

  return { chronicles, serverTypes };
}

export async function getPublishedServerSitemapEntries(): Promise<
  Array<{ slug: string; updatedAt: Date }>
> {
  return prisma.server.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      archivedAt: null,
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: { slug: "asc" },
  });
}

export async function getPublishedServers(
  filters: RankingFilters,
): Promise<PublicServerCard[]> {
  const servers = await prisma.server.findMany({
    where: buildServerWhere(filters),
    include: publicServerInclude,
    orderBy: [{ regularPosition: "asc" }, { name: "asc" }],
  });

  const promotions = await getLiveRankingPromotions(servers.map((server) => server.id));

  return mergeServersWithRankingPromotions(servers, promotions);
}
