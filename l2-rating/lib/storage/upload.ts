import { randomUUID } from "node:crypto";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  IMAGE_MIME_TO_EXTENSION,
  MAX_IMAGE_SIZE_BYTES,
  MEDIA_BUCKET,
  type AllowedImageMimeType,
  type MediaFolder,
} from "@/lib/storage/constants";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export type UploadMediaResult =
  | { ok: true; url: string; path: string }
  | { ok: false; message: string };

function isAllowedImageMimeType(type: string): type is AllowedImageMimeType {
  return (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(type);
}

export async function uploadMediaFile(
  file: File,
  folder: MediaFolder,
): Promise<UploadMediaResult> {
  if (!isAllowedImageMimeType(file.type)) {
    return {
      ok: false,
      message: "Only JPEG, PNG, WebP, and GIF images are allowed.",
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      ok: false,
      message: "Image must be 5 MB or smaller.",
    };
  }

  const extension = IMAGE_MIME_TO_EXTENSION[file.type];
  const path = `${folder}/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = createServiceRoleClient();

  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return {
      ok: false,
      message: error.message || "Failed to upload image to storage.",
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);

  return { ok: true, url: publicUrl, path };
}
