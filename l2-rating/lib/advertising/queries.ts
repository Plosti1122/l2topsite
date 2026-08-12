import { prisma } from "@/lib/prisma";
import type { PublicBanner } from "@/lib/advertising/constants";

export async function getLiveBannersBySlugs(
  slugs: string[],
): Promise<Record<string, PublicBanner | null>> {
  const result = Object.fromEntries(slugs.map((slug) => [slug, null])) as Record<
    string,
    PublicBanner | null
  >;

  if (slugs.length === 0) {
    return result;
  }

  const now = new Date();

  const banners = await prisma.banner.findMany({
    where: {
      isActive: true,
      startAt: { lte: now },
      endAt: { gte: now },
      adPosition: {
        slug: { in: slugs },
        isActive: true,
      },
    },
    orderBy: [{ startAt: "asc" }, { createdAt: "asc" }],
    select: {
      imageUrl: true,
      targetUrl: true,
      altText: true,
      adPosition: {
        select: {
          slug: true,
          width: true,
          height: true,
        },
      },
    },
  });

  for (const banner of banners) {
    const slug = banner.adPosition.slug;

    if (result[slug]) {
      continue;
    }

    result[slug] = {
      imageUrl: banner.imageUrl,
      targetUrl: banner.targetUrl,
      altText: banner.altText,
      width: banner.adPosition.width,
      height: banner.adPosition.height,
    };
  }

  return result;
}
