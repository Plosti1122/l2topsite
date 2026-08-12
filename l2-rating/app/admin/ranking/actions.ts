"use server";

import { revalidatePath } from "next/cache";
import {
  addServerToRanking,
  moveServerInRanking,
  removeServerFromRanking,
  setServerRankingPosition,
} from "@/lib/admin/ranking/reorder";
import type { ActionResult } from "@/lib/admin/types";
import { requireAuthenticatedAdmin } from "@/lib/auth/admin";

function revalidateRankingPaths() {
  revalidatePath("/admin/ranking");
  revalidatePath("/");
}

export async function moveRankingServerUpAction(
  serverId: string,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const result = await moveServerInRanking(serverId, "up");

  if (result.ok) {
    revalidateRankingPaths();
  }

  return result;
}

export async function moveRankingServerDownAction(
  serverId: string,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const result = await moveServerInRanking(serverId, "down");

  if (result.ok) {
    revalidateRankingPaths();
  }

  return result;
}

export async function setRankingServerPositionAction(
  serverId: string,
  position: number,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const result = await setServerRankingPosition(serverId, position);

  if (result.ok) {
    revalidateRankingPaths();
  }

  return result;
}

export async function addServerToRankingAction(
  serverId: string,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const result = await addServerToRanking(serverId);

  if (result.ok) {
    revalidateRankingPaths();
  }

  return result;
}

export async function removeServerFromRankingAction(
  serverId: string,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const result = await removeServerFromRanking(serverId);

  if (result.ok) {
    revalidateRankingPaths();
  }

  return result;
}
