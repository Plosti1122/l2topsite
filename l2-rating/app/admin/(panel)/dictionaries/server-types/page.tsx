import type { Metadata } from "next";
import { deleteServerTypeAction } from "@/app/admin/dictionaries/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DictionaryTable } from "@/components/admin/DictionaryTable";
import { getServerTypesForAdmin } from "@/lib/admin/dictionaries/queries";

export const metadata: Metadata = {
  title: "Server Types",
  robots: { index: false, follow: false },
};

export default async function AdminServerTypesPage() {
  const records = await getServerTypesForAdmin();

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Server Types"
        description="Dictionary of server types for assignment and public filters."
        actionHref="/admin/dictionaries/server-types/new"
        actionLabel="Add server type"
      />

      <DictionaryTable
        records={records}
        entityLabel="server type"
        editHref={(id) => `/admin/dictionaries/server-types/${id}/edit`}
        deleteAction={deleteServerTypeAction}
      />
    </section>
  );
}
