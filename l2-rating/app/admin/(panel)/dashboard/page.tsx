import type { Metadata } from "next";
import { requireAuthenticatedAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const admin = await requireAuthenticatedAdmin();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-50">Dashboard</h1>
        <p className="mt-2 text-zinc-400">
          Welcome back, {admin.email}. Admin modules will be added in the next
          steps.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard title="Servers" description="CRUD coming in step 5" />
        <DashboardCard title="Ranking" description="Stage 2 module" />
        <DashboardCard title="Premium" description="Stage 2 module" />
      </div>
    </section>
  );
}

function DashboardCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5">
      <h2 className="text-lg font-medium text-zinc-100">{title}</h2>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
    </div>
  );
}
