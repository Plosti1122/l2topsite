import type { Metadata } from "next";
import {
  deletePremiumBlockAction,
  deleteRankingPromotionAction,
} from "@/app/admin/premium/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PromoEntryTable } from "@/components/admin/PromoEntryTable";
import { MAX_ACTIVE_PROMO_SLOTS } from "@/lib/admin/premium/constants";
import {
  countActivePromoSlots,
  getPremiumBlocksForAdmin,
  getRankingPromotionsForAdmin,
} from "@/lib/admin/premium/queries";

export const metadata: Metadata = {
  title: "Premium",
  robots: { index: false, follow: false },
};

export default async function AdminPremiumPage() {
  const [premiumBlocks, rankingPromotions, activePremiumCount, activePromoCount] =
    await Promise.all([
      getPremiumBlocksForAdmin(),
      getRankingPromotionsForAdmin(),
      countActivePromoSlots("premiumBlock"),
      countActivePromoSlots("rankingPromotion"),
    ]);

  return (
    <section className="space-y-10">
      <AdminPageHeader
        title="Premium"
        description={`Manage Premium Block and Ranking Promotion products independently (BR-12). Up to ${MAX_ACTIVE_PROMO_SLOTS} active slots per product.`}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border px-4 py-3 text-sm">
          <p className="text-muted-foreground">Premium Block slots in use</p>
          <p className="mt-1 text-2xl font-semibold">
            {activePremiumCount}/{MAX_ACTIVE_PROMO_SLOTS}
          </p>
        </div>
        <div className="rounded-xl border border-border px-4 py-3 text-sm">
          <p className="text-muted-foreground">Ranking Promotion slots in use</p>
          <p className="mt-1 text-2xl font-semibold">
            {activePromoCount}/{MAX_ACTIVE_PROMO_SLOTS}
          </p>
        </div>
      </div>

      <PromoEntryTable
        title="Premium Block"
        description="Featured servers shown in the dedicated premium block on the homepage (BR-14, BR-16, BR-18)."
        entries={premiumBlocks}
        addHref="/admin/premium/premium-block/new"
        editHref={(id) => `/admin/premium/premium-block/${id}/edit`}
        deleteAction={deletePremiumBlockAction}
      />

      <PromoEntryTable
        title="Ranking Promotion"
        description="Temporary boosted positions inside the public ranking list (BR-15, BR-17, BR-19)."
        entries={rankingPromotions}
        addHref="/admin/premium/ranking-promotion/new"
        editHref={(id) => `/admin/premium/ranking-promotion/${id}/edit`}
        deleteAction={deleteRankingPromotionAction}
      />
    </section>
  );
}
