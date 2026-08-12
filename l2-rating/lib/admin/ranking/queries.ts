import { PublicationStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { RankingListItem, UnrankedPublishedServer } from "@/lib/admin/types";

export async function getRankingList(): Promise<RankingListItem[]> {
  const servers = await prisma.server.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      archivedAt: null,
      regularPosition: { not: null },
    },
    orderBy: [{ regularPosition: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      regularPosition: true,
      serverType: { select: { name: true } },
    },
  });

  return servers.map((server) => ({
    id: server.id,
    name: server.name,
    slug: server.slug,
    status: server.status,
    regularPosition: server.regularPosition ?? 0,
    serverTypeName: server.serverType.name,
  }));
}

export async function getUnrankedPublishedServers(): Promise<
  UnrankedPublishedServer[]
> {
  const servers = await prisma.server.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      archivedAt: null,
      regularPosition: null,
    },
    orderBy: [{ name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      serverType: { select: { name: true } },
    },
  });

  return servers.map((server) => ({
    id: server.id,
    name: server.name,
    slug: server.slug,
    status: server.status,
    serverTypeName: server.serverType.name,
  }));
}

export async function getPublishedRankedCount(): Promise<number> {
  return prisma.server.count({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      archivedAt: null,
      regularPosition: { not: null },
    },
  });
}
