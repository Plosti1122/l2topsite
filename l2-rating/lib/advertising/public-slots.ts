import {
  PUBLIC_AD_SLOT,
  type PublicAdSlotSlug,
} from "@/lib/advertising/constants";

export const PUBLIC_AD_SLOT_DEFINITIONS = [
  {
    slug: PUBLIC_AD_SLOT.homepageTop,
    name: "Homepage top",
    location: "Above the main hero on /",
    width: 728,
    height: 90,
    sortOrder: 1,
  },
  {
    slug: PUBLIC_AD_SLOT.homepageSidebar,
    name: "Homepage sidebar",
    location: "Left column above filters on /",
    width: 300,
    height: 250,
    sortOrder: 2,
  },
] as const;

const PUBLIC_AD_SLOT_SLUGS = new Set<string>(
  Object.values(PUBLIC_AD_SLOT),
);

export function isPublicAdSlotSlug(slug: string): slug is PublicAdSlotSlug {
  return PUBLIC_AD_SLOT_SLUGS.has(slug);
}
