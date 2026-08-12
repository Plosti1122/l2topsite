import type { CSSProperties } from "react";
import type { PublicBanner } from "@/lib/advertising/constants";
import { toMediaProxySrc } from "@/lib/storage/public-url";
import { cn } from "@/lib/utils";

type AdBannerProps = {
  banner: PublicBanner | null;
  className?: string;
};

function getBannerSizeStyle(banner: PublicBanner): CSSProperties | undefined {
  if (banner.width == null && banner.height == null) {
    return undefined;
  }

  return {
    ...(banner.width != null
      ? { width: banner.width, maxWidth: "100%" }
      : {}),
    ...(banner.height != null
      ? { height: banner.height, maxHeight: banner.height }
      : {}),
  };
}

export function AdBanner({ banner, className }: AdBannerProps) {
  if (!banner) {
    return null;
  }

  const sizeStyle = getBannerSizeStyle(banner);
  const hasFixedSize = sizeStyle != null;

  return (
    <div className={className} data-ad-slot="banner">
      <a
        href={banner.targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 transition hover:border-amber-700/40",
          hasFixedSize && "mx-auto w-fit max-w-full",
        )}
        style={sizeStyle}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={toMediaProxySrc(banner.imageUrl)}
          alt={banner.altText ?? "Promo banner"}
          width={banner.width ?? undefined}
          height={banner.height ?? undefined}
          className={cn(
            hasFixedSize
              ? "block max-h-full max-w-full object-contain"
              : "h-auto w-full object-cover",
          )}
          style={sizeStyle}
        />
      </a>
    </div>
  );
}
