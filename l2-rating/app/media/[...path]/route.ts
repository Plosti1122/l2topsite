import { NextResponse } from "next/server";
import { MEDIA_BUCKET } from "@/lib/storage/constants";
import {
  LEGACY_PROMO_FOLDER,
  PROMO_FOLDER,
  normalizeMediaStoragePath,
} from "@/lib/storage/public-url";

function getSupabaseStorageBase(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  return `${url}/storage/v1/object/public/${MEDIA_BUCKET}`;
}

function buildStorageCandidates(path: string): string[] {
  const candidates = new Set<string>([path]);

  if (path.startsWith(`${PROMO_FOLDER}/`)) {
    candidates.add(path.replace(`${PROMO_FOLDER}/`, `${LEGACY_PROMO_FOLDER}/`));
  }

  if (path.startsWith(`${LEGACY_PROMO_FOLDER}/`)) {
    candidates.add(path.replace(`${LEGACY_PROMO_FOLDER}/`, `${PROMO_FOLDER}/`));
  }

  return [...candidates];
}

async function fetchStorageObject(path: string): Promise<Response | null> {
  const base = getSupabaseStorageBase();

  for (const candidate of buildStorageCandidates(path)) {
    const response = await fetch(`${base}/${candidate}`, {
      next: { revalidate: 86_400 },
    });

    if (response.ok) {
      return response;
    }
  }

  return null;
}

type MediaRouteProps = {
  params: Promise<{ path: string[] }>;
};

export async function GET(_request: Request, { params }: MediaRouteProps) {
  const { path } = await params;
  const storagePath = normalizeMediaStoragePath(path.join("/"));
  const storageResponse = await fetchStorageObject(storagePath);

  if (!storageResponse) {
    return new NextResponse("Not found", { status: 404 });
  }

  const contentType =
    storageResponse.headers.get("Content-Type") ?? "application/octet-stream";
  const body = await storageResponse.arrayBuffer();

  return new NextResponse(body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
