import { redirect } from "next/navigation";
import { getAuthenticatedAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminIndexPage() {
  const admin = await getAuthenticatedAdmin();
  redirect(admin ? "/admin/dashboard" : "/admin/login");
}
