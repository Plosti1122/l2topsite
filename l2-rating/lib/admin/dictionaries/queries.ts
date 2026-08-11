import { prisma } from "@/lib/prisma";
import type { DictionaryOption, DictionaryRecord } from "@/lib/admin/types";

export async function getChroniclesForAdmin(): Promise<DictionaryRecord[]> {
  const rows = await prisma.chronicle.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: { servers: true },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
    serverCount: row._count.servers,
  }));
}

export async function getServerTypesForAdmin(): Promise<DictionaryRecord[]> {
  const rows = await prisma.serverType.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: { servers: true },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    isActive: row.isActive,
    sortOrder: row.sortOrder,
    serverCount: row._count.servers,
  }));
}

export async function getChronicleForEdit(id: string) {
  return prisma.chronicle.findUnique({ where: { id } });
}

export async function getServerTypeForEdit(id: string) {
  return prisma.serverType.findUnique({ where: { id } });
}

export async function getActiveChronicleOptions(): Promise<DictionaryOption[]> {
  return prisma.chronicle.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true },
  });
}

export async function getActiveServerTypeOptions(): Promise<DictionaryOption[]> {
  return prisma.serverType.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true },
  });
}

export async function getChronicleOptionsForServerForm(
  selectedIds: string[] = [],
): Promise<DictionaryOption[]> {
  const rows = await prisma.chronicle.findMany({
    where: {
      OR: [{ isActive: true }, { id: { in: selectedIds } }],
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true },
  });

  return rows;
}

export async function getServerTypeOptionsForServerForm(
  selectedId?: string,
): Promise<DictionaryOption[]> {
  const rows = await prisma.serverType.findMany({
    where: {
      OR: [
        { isActive: true },
        ...(selectedId ? [{ id: selectedId }] : []),
      ],
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, slug: true },
  });

  return rows;
}
