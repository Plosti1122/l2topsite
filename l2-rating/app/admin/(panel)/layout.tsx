import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/button";
import { requireAuthenticatedAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: LayoutProps<"/admin">) {
  const admin = await requireAuthenticatedAdmin();

  return (
    <div className="dark min-h-full bg-background text-foreground">
      <header className="border-b border-border bg-background/95">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Admin Panel
              </p>
              <p className="text-sm text-muted-foreground">{admin.email}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                {admin.role}
              </span>
              <Button variant="ghost" size="sm" render={<Link href="/" />}>
                Public site
              </Button>
              <form action={logoutAction}>
                <Button type="submit" variant="outline" size="sm">
                  Logout
                </Button>
              </form>
            </div>
          </div>

          <AdminNav />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
