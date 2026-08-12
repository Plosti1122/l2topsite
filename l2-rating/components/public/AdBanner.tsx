import type { PublicBanner } from "@/lib/advertising/constants";
import { toMediaProxySrc } from "@/lib/storage/public-url";

type AdBannerProps = {
  banner: PublicBanner | null;
  className?: string;
};

export function AdBanner({ banner, className }: AdBannerProps) {
  if (!banner) {
    return null;
  }

  return (
    <div className={className} data-ad-slot="banner">
      <a
        href={banner.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 transition hover:border-amber-700/40"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={toMediaProxySrc(banner.imageUrl)}
          alt={banner.altText ?? "Promo banner"}
          width={banner.width ?? undefined}
          height={banner.height ?? undefined}
          className="h-auto w-full object-cover"
        />
      </a>
    </div>
  );
}
