import { absoluteUrl } from "@/lib/site-url";

const STORAGE_PUBLIC_PATH = /\/storage\/v1\/object\/public\/media\/(.+)$/;

/** Blocked by many ad blockers when present in image URLs. */
export const LEGACY_PROMO_FOLDER = "banners";
export const PROMO_FOLDER = "promo";

export function normalizeMediaStoragePath(path: string): string {
  return path.replace(
    new RegExp(`^${LEGACY_PROMO_FOLDER}/`),
    `${PROMO_FOLDER}/`,
  );
}

export function extractMediaStoragePath(url: string): string | null {
  const match = url.match(STORAGE_PUBLIC_PATH);
  return match?.[1] ?? null;
}

export function toMediaProxyPath(url: string): string | null {
  const path = extractMediaStoragePath(url);
  if (!path) {
    return null;
  }

  return `/media/${normalizeMediaStoragePath(path)}`;
}

/** Same-origin URL for public pages — avoids ad blockers on /banners/ paths. */
export function toMediaProxySrc(url: string): string {
  return toMediaProxyPath(url) ?? url;
}

export function toAbsoluteMediaProxyUrl(url: string): string {
  const proxyPath = toMediaProxyPath(url);
  return proxyPath ? absoluteUrl(proxyPath) : url;
}
