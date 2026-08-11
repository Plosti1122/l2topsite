import type { Metadata } from "next";
import {
  deleteChronicleAction,
} from "@/app/admin/dictionaries/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DictionaryTable } from "@/components/admin/DictionaryTable";
import { getChroniclesForAdmin } from "@/lib/admin/dictionaries/queries";

export const metadata: Metadata = {
  title: "Chronicles",
  robots: { index: false, follow: false },
};

export default async function AdminChroniclesPage() {
  const records = await getChroniclesForAdmin();

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Chronicles"
        description="Dictionary of chronicles for server assignment and public filters."
        actionHref="/admin/dictionaries/chronicles/new"
        actionLabel="Add chronicle"
      />

      <DictionaryTable
        records={records}
        entityLabel="chronicle"
        editHref={(id) => `/admin/dictionaries/chronicles/${id}/edit`}
        deleteAction={deleteChronicleAction}
      />
    </section>
  );
}
