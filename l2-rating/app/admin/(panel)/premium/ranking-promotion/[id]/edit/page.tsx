import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  deleteRankingPromotionAction,
  updateRankingPromotionAction,
} from "@/app/admin/premium/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PromoEntryForm } from "@/components/admin/PromoEntryForm";
import {
  getPublishedServerOptionsForPromo,
  getRankingPromotionForEdit,
} from "@/lib/admin/premium/queries";

export const metadata: Metadata = {
  title: "Edit Ranking Promotion",
  robots: { index: false, follow: false },
};

export default async function EditRankingPromotionPage({
  params,
}: PageProps<"/admin/premium/ranking-promotion/[id]/edit">) {
  const { id } = await params;

  const [entry, servers] = await Promise.all([
    getRankingPromotionForEdit(id),
    getPublishedServerOptionsForPromo(),
  ]);

  if (!entry) {
    notFound();
  }

  const saveEntry = updateRankingPromotionAction.bind(null, id);

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Edit Ranking Promotion"
        description="Update ranking promotion settings."
      />

      <PromoEntryForm
        productName="Ranking Promotion"
        servers={servers}
        initialValues={entry}
        submitLabel="Save changes"
        cancelHref="/admin/premium"
        action={saveEntry}
        deleteAction={deleteRankingPromotionAction}
      />
    </section>
  );
}
