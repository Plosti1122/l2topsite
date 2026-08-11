import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAuthenticatedAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const admin = await getAuthenticatedAdmin();

  if (admin) {
    redirect("/admin/dashboard");
  }

  const params = await searchParams;
  const callbackError =
    params.error === "auth_callback_failed"
      ? "Authentication callback failed. Please sign in again."
      : null;

  return (
    <div className="flex min-h-full flex-col bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-400/80">
            Admin Panel
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-50">Sign in</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Email and password access for administrators only.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl shadow-black/20">
          <LoginForm callbackError={callbackError} />
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/" className="text-amber-300 transition hover:text-amber-200">
            ← Back to public site
          </Link>
        </p>
      </div>
    </div>
  );
}
