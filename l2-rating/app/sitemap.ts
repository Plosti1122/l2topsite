import type { MetadataRoute } from "next";
import { getPublishedServerSitemapEntries } from "@/lib/servers/queries";
import { absoluteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const servers = await getPublishedServerSitemapEntries();

  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "daily",
      priority: 1,
    },
    ...servers.map((server) => ({
      url: absoluteUrl(`/servers/${server.slug}`),
      lastModified: server.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
