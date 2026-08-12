#!/usr/bin/env tsx
import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createServiceRoleClient } from "../lib/supabase/service-role";
import { MEDIA_BUCKET } from "../lib/storage/constants";

async function main() {
  const supabase = createServiceRoleClient();

  const { error: bucketError } = await supabase.storage.createBucket(MEDIA_BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  });

  if (bucketError && !bucketError.message.toLowerCase().includes("already exists")) {
    console.error("Failed to create storage bucket:", bucketError.message);
    process.exit(1);
  }

  const sqlPath = resolve(__dirname, "../supabase/storage-setup.sql");
  const sql = readFileSync(sqlPath, "utf8");

  console.log("Storage bucket ready:", MEDIA_BUCKET);
  console.log("");
  console.log("If bucket policies need updating, run this SQL in Supabase:");
  console.log(sql);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
