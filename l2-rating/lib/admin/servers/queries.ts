import { prisma } from "@/lib/prisma";
import type { AdminServerFormData, AdminServerListItem } from "@/lib/admin/types";

export async function getServersForAdmin(): Promise<AdminServerListItem[]> {
  const servers = await prisma.server.findMany({
    where: { archivedAt: null },
    orderBy: [{ regularPosition: "asc" }, { name: "asc" }],
    include: {
      serverType: { select: { name: true } },
      chronicles: {
        include: {
          chronicle: { select: { name: true } },
        },
      },
    },
  });

  return servers.map((server) => ({
    id: server.id,
    name: server.name,
    slug: server.slug,
    status: server.status,
    publicationStatus: server.publicationStatus,
    regularPosition: server.regularPosition,
    serverTypeName: server.serverType.name,
    chronicleNames: server.chronicles
      .map((entry) => entry.chronicle.name)
      .sort((a, b) => a.localeCompare(b)),
  }));
}

export async function getServerForAdminEdit(
  id: string,
): Promise<AdminServerFormData | null> {
  const server = await prisma.server.findFirst({
    where: { id, archivedAt: null },
    include: {
      chronicles: { select: { chronicleId: true } },
      links: {
        orderBy: [{ sortOrder: "asc" }, { label: "asc" }],
        select: { label: true, url: true, sortOrder: true },
      },
    },
  });

  if (!server) {
    return null;
  }

  return {
    id: server.id,
    name: server.name,
    slug: server.slug,
    logoUrl: server.logoUrl,
    shortDescription: server.shortDescription,
    fullDescription: server.fullDescription,
    rateExp: server.rateExp,
    rateSp: server.rateSp,
    rateAdena: server.rateAdena,
    rateDrop: server.rateDrop,
    rateSpoil: server.rateSpoil,
    openingDate: server.openingDate
      ? server.openingDate.toISOString().slice(0, 10)
      : null,
    isOpeningSoon: server.isOpeningSoon,
    status: server.status,
    publicationStatus: server.publicationStatus,
    regularPosition: server.regularPosition,
    seoTitle: server.seoTitle,
    seoDescription: server.seoDescription,
    ogImageUrl: server.ogImageUrl,
    serverTypeId: server.serverTypeId,
    chronicleIds: server.chronicles.map((entry) => entry.chronicleId),
    links: server.links,
  };
}
