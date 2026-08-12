import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateAdPositionAction } from "@/app/admin/advertising/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdPositionForm } from "@/components/admin/AdPositionForm";
import { getAdPositionForEdit } from "@/lib/admin/advertising/queries";

export const metadata: Metadata = {
  title: "Edit Ad Position",
  robots: { index: false, follow: false },
};

export default async function EditAdPositionPage({
  params,
}: PageProps<"/admin/advertising/positions/[id]/edit">) {
  const { id } = await params;
  const position = await getAdPositionForEdit(id);

  if (!position) {
    notFound();
  }

  const savePosition = updateAdPositionAction.bind(null, id);

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title={`Edit ${position.name}`}
        description="Update ad position settings."
      />

      <AdPositionForm
        initialValues={position}
        submitLabel="Save changes"
        action={savePosition}
      />
    </section>
  );
}
