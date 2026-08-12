import type { Metadata } from "next";
import { createRankingPromotionAction } from "@/app/admin/premium/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PromoEntryForm } from "@/components/admin/PromoEntryForm";
import { getPublishedServerOptionsForPromo } from "@/lib/admin/premium/queries";

export const metadata: Metadata = {
  title: "New Ranking Promotion",
  robots: { index: false, follow: false },
};

export default async function NewRankingPromotionPage() {
  const servers = await getPublishedServerOptionsForPromo();

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="New Ranking Promotion"
        description="Boost a server to a temporary position in the public ranking."
      />

      <PromoEntryForm
        productName="Ranking Promotion"
        servers={servers}
        submitLabel="Create ranking promotion"
        cancelHref="/admin/premium"
        action={createRankingPromotionAction}
      />
    </section>
  );
}
