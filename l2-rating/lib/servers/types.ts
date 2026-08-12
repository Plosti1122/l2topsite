import type { ServerStatus } from "@/generated/prisma/client";

export type RateFilterKey =
  | "rateExp"
  | "rateSp"
  | "rateAdena"
  | "rateDrop"
  | "rateSpoil";

export type RankingFilters = {
  chronicles: string[];
  type: string | null;
  status: ServerStatus | null;
  openingFrom: Date | null;
  openingTo: Date | null;
  rates: Record<RateFilterKey, { min?: number; max?: number }>;
};

export type PublicServerCard = {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  shortDescription: string | null;
  position: number;
  status: ServerStatus;
  isOpeningSoon: boolean;
  openingDate: Date | null;
  rateExp: number;
  rateSp: number;
  rateAdena: number;
  rateDrop: number;
  rateSpoil: number;
  serverType: {
    name: string;
    slug: string;
  };
  chronicles: Array<{
    name: string;
    slug: string;
  }>;
  isRankingPromotion?: boolean;
};

export type FilterOptions = {
  chronicles: Array<{ slug: string; name: string }>;
  serverTypes: Array<{ slug: string; name: string }>;
};

export type PublicServerLink = {
  label: string;
  url: string;
};

export type PublicServerDetail = PublicServerCard & {
  fullDescription: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  links: PublicServerLink[];
};
