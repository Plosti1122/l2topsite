"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  isUniqueConstraintError,
  parseAdPositionFormData,
  parseBannerFormData,
} from "@/lib/admin/advertising/queries";
import type { ActionResult } from "@/lib/admin/types";
import { requireAuthenticatedAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

function revalidateAdvertisingPaths() {
  revalidatePath("/admin/advertising");
  revalidatePath("/");
}

export async function createAdPositionAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const parsed = parseAdPositionFormData(formData);

  if ("error" in parsed) {
    return { ok: false, message: parsed.error };
  }

  try {
    await prisma.adPosition.create({ data: parsed.data });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        message: "An ad position with this slug already exists.",
      };
    }

    throw error;
  }

  revalidateAdvertisingPaths();
  redirect("/admin/advertising");
}

export async function updateAdPositionAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const existing = await prisma.adPosition.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return { ok: false, message: "Ad position not found." };
  }

  const parsed = parseAdPositionFormData(formData);

  if ("error" in parsed) {
    return { ok: false, message: parsed.error };
  }

  try {
    await prisma.adPosition.update({
      where: { id },
      data: parsed.data,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        message: "An ad position with this slug already exists.",
      };
    }

    throw error;
  }

  revalidateAdvertisingPaths();
  redirect("/admin/advertising");
}

export async function deleteAdPositionAction(id: string): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const adPosition = await prisma.adPosition.findUnique({
    where: { id },
    include: { _count: { select: { banners: true } } },
  });

  if (!adPosition) {
    return { ok: false, message: "Ad position not found." };
  }

  if (adPosition._count.banners > 0) {
    return {
      ok: false,
      message: "Remove all banners from this position before deleting it.",
    };
  }

  await prisma.adPosition.delete({ where: { id } });
  revalidateAdvertisingPaths();
  return { ok: true };
}

export async function createBannerAction(formData: FormData): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const parsed = await parseBannerFormData(formData);

  if ("error" in parsed) {
    return { ok: false, message: parsed.error };
  }

  await prisma.banner.create({ data: parsed.data });
  revalidateAdvertisingPaths();
  redirect("/admin/advertising");
}

export async function updateBannerAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const existing = await prisma.banner.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return { ok: false, message: "Banner not found." };
  }

  const parsed = await parseBannerFormData(formData, id);

  if ("error" in parsed) {
    return { ok: false, message: parsed.error };
  }

  await prisma.banner.update({
    where: { id },
    data: parsed.data,
  });

  revalidateAdvertisingPaths();
  redirect("/admin/advertising");
}

export async function deleteBannerAction(id: string): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const existing = await prisma.banner.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    return { ok: false, message: "Banner not found." };
  }

  await prisma.banner.delete({ where: { id } });
  revalidateAdvertisingPaths();
  return { ok: true };
}
