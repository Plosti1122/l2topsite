export type ActionResult =
  | { ok: true }
  | { ok: false; message: string };

export type DictionaryRecord = {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  serverCount: number;
};

export type ServerLinkInput = {
  label: string;
  url: string;
  sortOrder: number;
};

export type AdminServerListItem = {
  id: string;
  name: string;
  slug: string;
  status: "UPCOMING" | "ONLINE";
  publicationStatus: "PUBLISHED" | "HIDDEN";
  regularPosition: number | null;
  serverTypeName: string;
  chronicleNames: string[];
};

export type AdminServerFormData = {
  id: string;
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
  openingDate: string | null;
  isOpeningSoon: boolean;
  status: "UPCOMING" | "ONLINE";
  publicationStatus: "PUBLISHED" | "HIDDEN";
  regularPosition: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  serverTypeId: string;
  chronicleIds: string[];
  links: ServerLinkInput[];
};

export type DictionaryOption = {
  id: string;
  name: string;
  slug: string;
};

export type RankingListItem = {
  id: string;
  name: string;
  slug: string;
  status: "UPCOMING" | "ONLINE";
  regularPosition: number;
  serverTypeName: string;
};

export type UnrankedPublishedServer = {
  id: string;
  name: string;
  slug: string;
  status: "UPCOMING" | "ONLINE";
  serverTypeName: string;
};

export type PromoEntryListItem = {
  id: string;
  serverId: string;
  serverName: string;
  serverSlug: string;
  position: number;
  startAt: string;
  endAt: string;
  isActive: boolean;
  lifecycleStatus: "live" | "scheduled" | "expired" | "inactive";
  productLabel: "Premium Block" | "Ranking Promotion";
};

export type PromoEntryFormData = {
  id: string;
  serverId: string;
  position: number;
  startAt: string;
  endAt: string;
  isActive: boolean;
};

export type PromoServerOption = {
  id: string;
  name: string;
  slug: string;
};
