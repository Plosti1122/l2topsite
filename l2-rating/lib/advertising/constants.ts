export const PUBLIC_AD_SLOT = {
  homepageTop: "homepage-top",
  homepageSidebar: "homepage-sidebar",
} as const;

export type PublicAdSlotSlug =
  (typeof PUBLIC_AD_SLOT)[keyof typeof PUBLIC_AD_SLOT];

export type PublicBanner = {
  imageUrl: string;
  targetUrl: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};
