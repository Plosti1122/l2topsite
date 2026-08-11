import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  deleteServerAction,
  updateServerAction,
} from "@/app/admin/servers/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ServerForm } from "@/components/admin/ServerForm";
import {
  getChronicleOptionsForServerForm,
  getServerTypeOptionsForServerForm,
} from "@/lib/admin/dictionaries/queries";
import { getServerForAdminEdit } from "@/lib/admin/servers/queries";

export const metadata: Metadata = {
  title: "Edit Server",
  robots: { index: false, follow: false },
};

export default async function EditServerPage({
  params,
}: PageProps<"/admin/servers/[id]/edit">) {
  const { id } = await params;
  const server = await getServerForAdminEdit(id);

  if (!server) {
    notFound();
  }

  const [serverTypes, chronicles] = await Promise.all([
    getServerTypeOptionsForServerForm(server.serverTypeId),
    getChronicleOptionsForServerForm(server.chronicleIds),
  ]);

  const saveServer = updateServerAction.bind(null, id);

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title={`Edit ${server.name}`}
        description="Update server details, rates, publication, and links."
      />

      <ServerForm
        initialValues={server}
        serverTypes={serverTypes}
        chronicles={chronicles}
        submitLabel="Save changes"
        action={saveServer}
        deleteAction={deleteServerAction}
      />
    </section>
  );
}
