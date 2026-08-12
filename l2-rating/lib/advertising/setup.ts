import { prisma } from "@/lib/prisma";
import { PUBLIC_AD_SLOT_DEFINITIONS } from "@/lib/advertising/public-slots";

export async function ensureDefaultAdPositions(): Promise<void> {
  for (const slot of PUBLIC_AD_SLOT_DEFINITIONS) {
    await prisma.adPosition.upsert({
      where: { slug: slot.slug },
      create: {
        name: slot.name,
        slug: slot.slug,
        location: slot.location,
        width: slot.width,
        height: slot.height,
        sortOrder: slot.sortOrder,
        isActive: true,
      },
      update: {},
    });
  }
}
