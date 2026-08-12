"use server";

import { requireAuthenticatedAdmin } from "@/lib/auth/admin";
import {
  MEDIA_FOLDERS,
  type MediaFolder,
} from "@/lib/storage/constants";
import { uploadMediaFile } from "@/lib/storage/upload";

export type UploadActionResult =
  | { ok: true; url: string }
  | { ok: false; message: string };

function parseMediaFolder(value: FormDataEntryValue | null): MediaFolder | null {
  if (typeof value !== "string") {
    return null;
  }

  return (Object.values(MEDIA_FOLDERS) as string[]).includes(value)
    ? (value as MediaFolder)
    : null;
}

export async function uploadMediaAction(
  formData: FormData,
): Promise<UploadActionResult> {
  await requireAuthenticatedAdmin();

  const folder = parseMediaFolder(formData.get("folder"));
  const file = formData.get("file");

  if (!folder) {
    return { ok: false, message: "Invalid upload folder." };
  }

  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Choose an image file to upload." };
  }

  const result = await uploadMediaFile(file, folder);

  if (!result.ok) {
    return result;
  }

  return { ok: true, url: result.url };
}
