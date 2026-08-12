import { PublicationStatus } from "@/generated/prisma/client";
import type { ActionResult } from "@/lib/admin/types";
import { prisma } from "@/lib/prisma";

const rankedServerWhere = {
  publicationStatus: PublicationStatus.PUBLISHED,
  archivedAt: null,
  regularPosition: { not: null },
} as const;

export async function getPublishedRankedServerIds(): Promise<string[]> {
  const servers = await prisma.server.findMany({
    where: rankedServerWhere,
    orderBy: [{ regularPosition: "asc" }, { name: "asc" }],
    select: { id: true },
  });

  return servers.map((server) => server.id);
}

export async function applyRankingOrder(serverIds: string[]): Promise<void> {
  if (serverIds.length === 0) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.server.updateMany({
      where: {
        publicationStatus: PublicationStatus.HIDDEN,
        archivedAt: null,
        regularPosition: { not: null },
      },
      data: { regularPosition: null },
    });

    await tx.server.updateMany({
      where: { id: { in: serverIds } },
      data: { regularPosition: null },
    });

    for (let index = 0; index < serverIds.length; index += 1) {
      await tx.server.update({
        where: { id: serverIds[index] },
        data: { regularPosition: index + 1 },
      });
    }
  });
}

export async function moveServerInRanking(
  serverId: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  const ids = await getPublishedRankedServerIds();
  const currentIndex = ids.indexOf(serverId);

  if (currentIndex === -1) {
    return { ok: false, message: "Server is not in the published ranking." };
  }

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

  if (targetIndex < 0) {
    return { ok: false, message: "Already at the top of the ranking." };
  }

  if (targetIndex >= ids.length) {
    return { ok: false, message: "Already at the bottom of the ranking." };
  }

  const reordered = [...ids];
  [reordered[currentIndex], reordered[targetIndex]] = [
    reordered[targetIndex],
    reordered[currentIndex],
  ];

  await applyRankingOrder(reordered);
  return { ok: true };
}

export async function setServerRankingPosition(
  serverId: string,
  targetPosition: number,
): Promise<ActionResult> {
  const ids = await getPublishedRankedServerIds();
  const currentIndex = ids.indexOf(serverId);

  if (currentIndex === -1) {
    return { ok: false, message: "Server is not in the published ranking." };
  }

  if (
    !Number.isInteger(targetPosition) ||
    targetPosition < 1 ||
    targetPosition > ids.length
  ) {
    return {
      ok: false,
      message: `Position must be an integer between 1 and ${ids.length}.`,
    };
  }

  const reordered = [...ids];
  const [moved] = reordered.splice(currentIndex, 1);
  reordered.splice(targetPosition - 1, 0, moved);

  await applyRankingOrder(reordered);
  return { ok: true };
}

export async function addServerToRanking(serverId: string): Promise<ActionResult> {
  const server = await prisma.server.findFirst({
    where: {
      id: serverId,
      publicationStatus: PublicationStatus.PUBLISHED,
      archivedAt: null,
    },
    select: { id: true, regularPosition: true },
  });

  if (!server) {
    return { ok: false, message: "Published server not found." };
  }

  if (server.regularPosition != null) {
    return { ok: false, message: "Server is already in the ranking." };
  }

  const ids = await getPublishedRankedServerIds();
  ids.push(serverId);
  await applyRankingOrder(ids);
  return { ok: true };
}

export async function removeServerFromRanking(
  serverId: string,
): Promise<ActionResult> {
  const ids = await getPublishedRankedServerIds();
  const currentIndex = ids.indexOf(serverId);

  if (currentIndex === -1) {
    return { ok: false, message: "Server is not in the published ranking." };
  }

  const remaining = ids.filter((id) => id !== serverId);

  await prisma.server.update({
    where: { id: serverId },
    data: { regularPosition: null },
  });

  if (remaining.length > 0) {
    await applyRankingOrder(remaining);
  }

  return { ok: true };
}
