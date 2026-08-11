"use server";

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseDictionaryFormData } from "@/lib/admin/form";
import type { ActionResult } from "@/lib/admin/types";
import { requireAuthenticatedAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

function revalidateDictionaryPaths() {
  revalidatePath("/admin/dictionaries/chronicles");
  revalidatePath("/admin/dictionaries/server-types");
  revalidatePath("/");
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}

export async function createChronicleAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const parsed = parseDictionaryFormData(formData);

  if ("error" in parsed) {
    return { ok: false, message: parsed.error };
  }

  try {
    await prisma.chronicle.create({ data: parsed });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, message: "A chronicle with this name or slug already exists." };
    }

    throw error;
  }

  revalidateDictionaryPaths();
  redirect("/admin/dictionaries/chronicles");
}

export async function updateChronicleAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const parsed = parseDictionaryFormData(formData);

  if ("error" in parsed) {
    return { ok: false, message: parsed.error };
  }

  try {
    await prisma.chronicle.update({
      where: { id },
      data: parsed,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, message: "A chronicle with this name or slug already exists." };
    }

    throw error;
  }

  revalidateDictionaryPaths();
  redirect("/admin/dictionaries/chronicles");
}

export async function deleteChronicleAction(id: string): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const chronicle = await prisma.chronicle.findUnique({
    where: { id },
    include: { _count: { select: { servers: true } } },
  });

  if (!chronicle) {
    return { ok: false, message: "Chronicle not found." };
  }

  if (chronicle._count.servers > 0) {
    return {
      ok: false,
      message: "Cannot delete a chronicle that is assigned to servers.",
    };
  }

  await prisma.chronicle.delete({ where: { id } });
  revalidateDictionaryPaths();
  return { ok: true };
}

export async function createServerTypeAction(
  formData: FormData,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const parsed = parseDictionaryFormData(formData);

  if ("error" in parsed) {
    return { ok: false, message: parsed.error };
  }

  try {
    await prisma.serverType.create({ data: parsed });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        message: "A server type with this name or slug already exists.",
      };
    }

    throw error;
  }

  revalidateDictionaryPaths();
  redirect("/admin/dictionaries/server-types");
}

export async function updateServerTypeAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const parsed = parseDictionaryFormData(formData);

  if ("error" in parsed) {
    return { ok: false, message: parsed.error };
  }

  try {
    await prisma.serverType.update({
      where: { id },
      data: parsed,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        ok: false,
        message: "A server type with this name or slug already exists.",
      };
    }

    throw error;
  }

  revalidateDictionaryPaths();
  redirect("/admin/dictionaries/server-types");
}

export async function deleteServerTypeAction(id: string): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const serverType = await prisma.serverType.findUnique({
    where: { id },
    include: { _count: { select: { servers: true } } },
  });

  if (!serverType) {
    return { ok: false, message: "Server type not found." };
  }

  if (serverType._count.servers > 0) {
    return {
      ok: false,
      message: "Cannot delete a server type that is assigned to servers.",
    };
  }

  await prisma.serverType.delete({ where: { id } });
  revalidateDictionaryPaths();
  return { ok: true };
}
