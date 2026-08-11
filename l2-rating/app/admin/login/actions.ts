"use server";

import { verifyAdminAccess } from "@/lib/auth/admin";

export async function verifyAdminAccessAction() {
  return verifyAdminAccess();
}
