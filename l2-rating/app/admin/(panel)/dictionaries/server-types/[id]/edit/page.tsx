import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateServerTypeAction } from "@/app/admin/dictionaries/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DictionaryForm } from "@/components/admin/DictionaryForm";
import { getServerTypeForEdit } from "@/lib/admin/dictionaries/queries";

export const metadata: Metadata = {
  title: "Edit Server Type",
  robots: { index: false, follow: false },
};

export default async function EditServerTypePage({
  params,
}: PageProps<"/admin/dictionaries/server-types/[id]/edit">) {
  const { id } = await params;
  const serverType = await getServerTypeForEdit(id);

  if (!serverType) {
    notFound();
  }

  const saveServerType = updateServerTypeAction.bind(null, id);

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title={`Edit ${serverType.name}`}
        description="Update server type dictionary entry."
      />

      <DictionaryForm
        submitLabel="Save changes"
        action={saveServerType}
        initialValues={{
          name: serverType.name,
          slug: serverType.slug,
          sortOrder: serverType.sortOrder,
          isActive: serverType.isActive,
        }}
      />
    </section>
  );
}
