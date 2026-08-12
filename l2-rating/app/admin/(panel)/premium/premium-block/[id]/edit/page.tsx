import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  deletePremiumBlockAction,
  updatePremiumBlockAction,
} from "@/app/admin/premium/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PromoEntryForm } from "@/components/admin/PromoEntryForm";
import {
  getPremiumBlockForEdit,
  getPublishedServerOptionsForPromo,
} from "@/lib/admin/premium/queries";

export const metadata: Metadata = {
  title: "Edit Premium Block",
  robots: { index: false, follow: false },
};

export default async function EditPremiumBlockPage({
  params,
}: PageProps<"/admin/premium/premium-block/[id]/edit">) {
  const { id } = await params;

  const [entry, servers] = await Promise.all([
    getPremiumBlockForEdit(id),
    getPublishedServerOptionsForPromo(),
  ]);

  if (!entry) {
    notFound();
  }

  const saveEntry = updatePremiumBlockAction.bind(null, id);

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Edit Premium Block"
        description="Update premium block promotion settings."
      />

      <PromoEntryForm
        productName="Premium Block"
        servers={servers}
        initialValues={entry}
        submitLabel="Save changes"
        cancelHref="/admin/premium"
        action={saveEntry}
        deleteAction={deletePremiumBlockAction}
      />
    </section>
  );
}
