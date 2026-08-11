import type { Metadata } from "next";
import { deleteServerAction } from "@/app/admin/servers/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ServerTable } from "@/components/admin/ServerTable";
import { getServersForAdmin } from "@/lib/admin/servers/queries";

export const metadata: Metadata = {
  title: "Servers",
  robots: { index: false, follow: false },
};

export default async function AdminServersPage() {
  const servers = await getServersForAdmin();

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Servers"
        description="Manage server cards shown in the public ranking and detail pages."
        actionHref="/admin/servers/new"
        actionLabel="Add server"
      />

      <ServerTable servers={servers} deleteAction={deleteServerAction} />
    </section>
  );
}
