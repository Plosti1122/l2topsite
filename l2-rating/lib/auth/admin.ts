import { redirect } from "next/navigation";
import type { User } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export type AuthenticatedAdmin = User;

export async function getAuthenticatedAdmin(): Promise<AuthenticatedAdmin | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const admin = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!admin || admin.isBlocked) {
    return null;
  }

  return admin;
}

export async function requireAuthenticatedAdmin(): Promise<AuthenticatedAdmin> {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return admin;
}

export async function verifyAdminAccess(): Promise<
  | { ok: true; admin: AuthenticatedAdmin }
  | { ok: false; message: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: false, message: "Authentication failed. Please try again." };
  }

  const admin = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!admin) {
    await supabase.auth.signOut();
    return {
      ok: false,
      message: "This account is not registered as an administrator.",
    };
  }

  if (admin.isBlocked) {
    await supabase.auth.signOut();
    return {
      ok: false,
      message: "This administrator account is blocked.",
    };
  }

  return { ok: true, admin };
}
