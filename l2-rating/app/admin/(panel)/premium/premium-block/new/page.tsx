import type { Metadata } from "next";
import { createPremiumBlockAction } from "@/app/admin/premium/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PromoEntryForm } from "@/components/admin/PromoEntryForm";
import { getPublishedServerOptionsForPromo } from "@/lib/admin/premium/queries";

export const metadata: Metadata = {
  title: "New Premium Block",
  robots: { index: false, follow: false },
};

export default async function NewPremiumBlockPage() {
  const servers = await getPublishedServerOptionsForPromo();

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="New Premium Block"
        description="Add a server to the homepage premium block."
      />

      <PromoEntryForm
        productName="Premium Block"
        servers={servers}
        submitLabel="Create premium block entry"
        cancelHref="/admin/premium"
        action={createPremiumBlockAction}
      />
    </section>
  );
}
