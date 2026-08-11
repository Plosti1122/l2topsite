"use server";

import {
  Prisma,
  PublicationStatus,
  ServerStatus,
} from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  parseCheckbox,
  parseOptionalNullableInt,
  parseOptionalString,
  parseRequiredInt,
  parseRequiredString,
  parseServerLinks,
  parseStringArray,
  resolveSlug,
} from "@/lib/admin/form";
import type { ActionResult } from "@/lib/admin/types";
import { requireAuthenticatedAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";

function revalidateServerPaths() {
  revalidatePath("/admin/servers");
  revalidatePath("/");
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}

function parseServerStatus(value: string | null): ServerStatus | null {
  if (value === ServerStatus.UPCOMING || value === ServerStatus.ONLINE) {
    return value;
  }

  return null;
}

function parsePublicationStatus(
  value: string | null,
): PublicationStatus | null {
  if (
    value === PublicationStatus.PUBLISHED ||
    value === PublicationStatus.HIDDEN
  ) {
    return value;
  }

  return null;
}

async function assertUniqueRegularPosition(
  position: number | null,
  excludeId?: string,
): Promise<string | null> {
  if (position === null) {
    return null;
  }

  const existing = await prisma.server.findFirst({
    where: {
      regularPosition: position,
      publicationStatus: PublicationStatus.PUBLISHED,
      archivedAt: null,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
    select: { name: true },
  });

  if (existing) {
    return `Regular position ${position} is already used by "${existing.name}".`;
  }

  return null;
}

type ParsedServerInput =
  | {
      error: string;
    }
  | {
      data: {
        name: string;
        slug: string;
        logoUrl: string | null;
        shortDescription: string | null;
        fullDescription: string | null;
        rateExp: number;
        rateSp: number;
        rateAdena: number;
        rateDrop: number;
        rateSpoil: number;
        openingDate: Date | null;
        isOpeningSoon: boolean;
        status: ServerStatus;
        publicationStatus: PublicationStatus;
        regularPosition: number | null;
        seoTitle: string | null;
        seoDescription: string | null;
        ogImageUrl: string | null;
        serverTypeId: string;
        chronicleIds: string[];
        links: ReturnType<typeof parseServerLinks>;
      };
    };

async function parseServerFormData(
  formData: FormData,
  excludeId?: string,
): Promise<ParsedServerInput> {
  const name = parseRequiredString(formData, "name");

  if (!name) {
    return { error: "Name is required." };
  }

  const slug = resolveSlug(name, parseOptionalString(formData, "slug"));

  if (!slug) {
    return { error: "Slug is required." };
  }

  const serverTypeId = parseRequiredString(formData, "serverTypeId");

  if (!serverTypeId) {
    return { error: "Server type is required." };
  }

  const serverType = await prisma.serverType.findUnique({
    where: { id: serverTypeId },
    select: { id: true },
  });

  if (!serverType) {
    return { error: "Selected server type was not found." };
  }

  const chronicleIds = parseStringArray(formData, "chronicleIds");

  if (chronicleIds.length === 0) {
    return { error: "Select at least one chronicle." };
  }

  const chronicles = await prisma.chronicle.findMany({
    where: { id: { in: chronicleIds } },
    select: { id: true },
  });

  if (chronicles.length !== chronicleIds.length) {
    return { error: "One or more selected chronicles were not found." };
  }

  const rateExp = parseRequiredInt(formData, "rateExp");
  const rateSp = parseRequiredInt(formData, "rateSp");
  const rateAdena = parseRequiredInt(formData, "rateAdena");
  const rateDrop = parseRequiredInt(formData, "rateDrop");
  const rateSpoil = parseRequiredInt(formData, "rateSpoil");

  if (
    rateExp === null ||
    rateSp === null ||
    rateAdena === null ||
    rateDrop === null ||
    rateSpoil === null
  ) {
    return { error: "All rate fields are required and must be non-negative." };
  }

  const status = parseServerStatus(parseRequiredString(formData, "status"));

  if (!status) {
    return { error: "Server status is required." };
  }

  const publicationStatus = parsePublicationStatus(
    parseRequiredString(formData, "publicationStatus"),
  );

  if (!publicationStatus) {
    return { error: "Publication status is required." };
  }

  const regularPositionResult = parseOptionalNullableInt(
    formData,
    "regularPosition",
  );

  if (regularPositionResult === undefined) {
    return { error: "Regular position must be a non-negative number." };
  }

  const positionConflict = await assertUniqueRegularPosition(
    regularPositionResult,
    excludeId,
  );

  if (positionConflict) {
    return { error: positionConflict };
  }

  const openingDateRaw = parseOptionalString(formData, "openingDate");
  const openingDate = openingDateRaw ? new Date(openingDateRaw) : null;

  if (openingDateRaw && openingDate && Number.isNaN(openingDate.getTime())) {
    return { error: "Opening date is invalid." };
  }

  return {
    data: {
      name,
      slug,
      logoUrl: parseOptionalString(formData, "logoUrl"),
      shortDescription: parseOptionalString(formData, "shortDescription"),
      fullDescription: parseOptionalString(formData, "fullDescription"),
      rateExp,
      rateSp,
      rateAdena,
      rateDrop,
      rateSpoil,
      openingDate,
      isOpeningSoon: parseCheckbox(formData, "isOpeningSoon"),
      status,
      publicationStatus,
      regularPosition: regularPositionResult,
      seoTitle: parseOptionalString(formData, "seoTitle"),
      seoDescription: parseOptionalString(formData, "seoDescription"),
      ogImageUrl: parseOptionalString(formData, "ogImageUrl"),
      serverTypeId,
      chronicleIds,
      links: parseServerLinks(formData),
    },
  };
}

export async function createServerAction(formData: FormData): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const parsed = await parseServerFormData(formData);

  if ("error" in parsed) {
    return { ok: false, message: parsed.error };
  }

  const { data } = parsed;

  try {
    await prisma.server.create({
      data: {
        name: data.name,
        slug: data.slug,
        logoUrl: data.logoUrl,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        rateExp: data.rateExp,
        rateSp: data.rateSp,
        rateAdena: data.rateAdena,
        rateDrop: data.rateDrop,
        rateSpoil: data.rateSpoil,
        openingDate: data.openingDate,
        isOpeningSoon: data.isOpeningSoon,
        status: data.status,
        publicationStatus: data.publicationStatus,
        regularPosition: data.regularPosition,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        ogImageUrl: data.ogImageUrl,
        serverTypeId: data.serverTypeId,
        chronicles: {
          create: data.chronicleIds.map((chronicleId) => ({ chronicleId })),
        },
        links: {
          create: data.links,
        },
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, message: "A server with this slug already exists." };
    }

    throw error;
  }

  revalidateServerPaths();
  redirect("/admin/servers");
}

export async function updateServerAction(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const existing = await prisma.server.findFirst({
    where: { id, archivedAt: null },
    select: { id: true },
  });

  if (!existing) {
    return { ok: false, message: "Server not found." };
  }

  const parsed = await parseServerFormData(formData, id);

  if ("error" in parsed) {
    return { ok: false, message: parsed.error };
  }

  const { data } = parsed;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.serverChronicle.deleteMany({ where: { serverId: id } });
      await tx.serverLink.deleteMany({ where: { serverId: id } });

      await tx.server.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          logoUrl: data.logoUrl,
          shortDescription: data.shortDescription,
          fullDescription: data.fullDescription,
          rateExp: data.rateExp,
          rateSp: data.rateSp,
          rateAdena: data.rateAdena,
          rateDrop: data.rateDrop,
          rateSpoil: data.rateSpoil,
          openingDate: data.openingDate,
          isOpeningSoon: data.isOpeningSoon,
          status: data.status,
          publicationStatus: data.publicationStatus,
          regularPosition: data.regularPosition,
          seoTitle: data.seoTitle,
          seoDescription: data.seoDescription,
          ogImageUrl: data.ogImageUrl,
          serverTypeId: data.serverTypeId,
          chronicles: {
            create: data.chronicleIds.map((chronicleId) => ({ chronicleId })),
          },
          links: {
            create: data.links,
          },
        },
      });
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, message: "A server with this slug already exists." };
    }

    throw error;
  }

  revalidateServerPaths();
  revalidatePath(`/servers/${data.slug}`);
  redirect("/admin/servers");
}

export async function deleteServerAction(id: string): Promise<ActionResult> {
  await requireAuthenticatedAdmin();

  const server = await prisma.server.findFirst({
    where: { id, archivedAt: null },
    select: { id: true },
  });

  if (!server) {
    return { ok: false, message: "Server not found." };
  }

  await prisma.server.delete({ where: { id } });
  revalidateServerPaths();
  return { ok: true };
}
