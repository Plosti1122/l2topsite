import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServerDetailView } from "@/components/public/ServerDetailView";
import { getPublishedServerBySlug } from "@/lib/servers/queries";

type ServerPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ServerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const server = await getPublishedServerBySlug(slug);

  if (!server) {
    return {
      title: "Server not found",
      robots: { index: false, follow: false },
    };
  }

  const title = server.seoTitle ?? server.name;
  const description =
    server.seoDescription ??
    server.shortDescription ??
    `${server.name} Lineage 2 server details, rates, and links.`;
  const ogImage = server.ogImageUrl ?? server.logoUrl ?? undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `/servers/${server.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/servers/${server.slug}`,
      ...(ogImage ? { images: [{ url: ogImage, alt: server.name }] } : {}),
    },
  };
}

export default async function ServerPage({ params }: ServerPageProps) {
  const { slug } = await params;
  const server = await getPublishedServerBySlug(slug);

  if (!server) {
    notFound();
  }

  return <ServerDetailView server={server} />;
}
