"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parsePromoFormData } from "@/lib/admin/premium/queries";
import type { ActionResult } from "@/lib/admin/types";
import { requireAuthenticatedAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

function revalidatePremiumPaths() {
  revalidatePath("/admin/premium");
  revalidatePath("/");
}

export async function createPremiumBlockAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const parsed = await parsePromoFormData(formData, "premiumBlock");

  if ("error" in parsed) {
    return { ok: false, message: parsed.error };
  }

  await prisma.premiumBlock.create({ data: parsed.data });
  revalidatePremiumPaths();
  redirect("/admin/premium");
}

export async function updatePremiumBlockAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const existing = await prisma.premiumBlock.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return { ok: false, message: "Premium block entry not found." };
  }

  const parsed = await parsePromoFormData(formData, "premiumBlock", id);

  if ("error" in parsed) {
    return { ok: false, message: parsed.error };
  }

  await prisma.premiumBlock.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePremiumPaths();
  redirect("/admin/premium");
}

export async function deletePremiumBlockAction(id: string): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const existing = await prisma.premiumBlock.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return { ok: false, message: "Premium block entry not found." };
  }

  await prisma.premiumBlock.delete({ where: { id } });
  revalidatePremiumPaths();
  return { ok: true };
}

export async function createRankingPromotionAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const parsed = await parsePromoFormData(formData, "rankingPromotion");

  if ("error" in parsed) {
    return { ok: false, message: parsed.error };
  }

  await prisma.rankingPromotion.create({ data: parsed.data });
  revalidatePremiumPaths();
  redirect("/admin/premium");
}

export async function updateRankingPromotionAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const existing = await prisma.rankingPromotion.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return { ok: false, message: "Ranking promotion entry not found." };
  }

  const parsed = await parsePromoFormData(formData, "rankingPromotion", id);

  if ("error" in parsed) {
    return { ok: false, message: parsed.error };
  }

  await prisma.rankingPromotion.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePremiumPaths();
  redirect("/admin/premium");
}

export async function deleteRankingPromotionAction(
  id: string,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const existing = await prisma.rankingPromotion.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return { ok: false, message: "Ranking promotion entry not found." };
  }

  await prisma.rankingPromotion.delete({ where: { id } });
  revalidatePremiumPaths();
  return { ok: true };
}
