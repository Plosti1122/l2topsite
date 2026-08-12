import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuthenticatedAdmin } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

const modules = [
  {
    title: "Servers",
    description: "Create and edit server cards, rates, SEO, and links.",
    href: "/admin/servers",
  },
  {
    title: "Chronicles",
    description: "Manage chronicle dictionary used in filters and server cards.",
    href: "/admin/dictionaries/chronicles",
  },
  {
    title: "Server Types",
    description: "Manage server type dictionary (PvP, Low Rate, etc.).",
    href: "/admin/dictionaries/server-types",
  },
  {
    title: "Ranking",
    description: "Move servers up/down and set positions with auto-recalculation.",
    href: "/admin/ranking",
  },
  {
    title: "Premium",
    description: "Premium Block and Ranking Promotion slots (max 10 each).",
    href: "/admin/premium",
  },
  {
    title: "Advertising",
    description: "Ad positions, banner schedules, and homepage slots.",
    href: "/admin/advertising",
  },
];

export default async function AdminDashboardPage() {
  const admin = await requireAuthenticatedAdmin();

  return (
    <section className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description={`Welcome back, ${admin.email}.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) =>
          module.href ? (
            <Link key={module.title} href={module.href}>
              <Card className="h-full transition hover:border-primary/40">
                <CardHeader>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ) : (
            <Card key={module.title} className="h-full opacity-70">
              <CardHeader>
                <CardTitle>{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
            </Card>
          ),
        )}
      </div>
    </section>
  );
}
