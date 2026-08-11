import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { requireAuthenticatedAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: LayoutProps<"/admin">) {
  const admin = await requireAuthenticatedAdmin();

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/80 bg-zinc-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-400/80">
              Admin Panel
            </p>
            <p className="text-sm text-zinc-400">{admin.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-zinc-700 px-2.5 py-0.5 text-xs text-zinc-300">
              {admin.role}
            </span>
            <Link
              href="/"
              className="text-sm text-zinc-400 transition hover:text-zinc-200"
            >
              Public site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
