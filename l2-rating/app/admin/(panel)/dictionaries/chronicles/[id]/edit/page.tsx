import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateChronicleAction } from "@/app/admin/dictionaries/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DictionaryForm } from "@/components/admin/DictionaryForm";
import { getChronicleForEdit } from "@/lib/admin/dictionaries/queries";

export const metadata: Metadata = {
  title: "Edit Chronicle",
  robots: { index: false, follow: false },
};

export default async function EditChroniclePage({
  params,
}: PageProps<"/admin/dictionaries/chronicles/[id]/edit">) {
  const { id } = await params;
  const chronicle = await getChronicleForEdit(id);

  if (!chronicle) {
    notFound();
  }

  const saveChronicle = updateChronicleAction.bind(null, id);

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title={`Edit ${chronicle.name}`}
        description="Update chronicle dictionary entry."
      />

      <DictionaryForm
        submitLabel="Save changes"
        action={saveChronicle}
        initialValues={{
          name: chronicle.name,
          slug: chronicle.slug,
          sortOrder: chronicle.sortOrder,
          isActive: chronicle.isActive,
        }}
      />
    </section>
  );
}
