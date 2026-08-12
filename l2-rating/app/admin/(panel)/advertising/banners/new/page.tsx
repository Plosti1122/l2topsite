import type { Metadata } from "next";
import { createBannerAction } from "@/app/admin/advertising/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BannerForm } from "@/components/admin/BannerForm";
import { getActiveAdPositionOptions } from "@/lib/admin/advertising/queries";

export const metadata: Metadata = {
  title: "New Banner",
  robots: { index: false, follow: false },
};

export default async function NewBannerPage() {
  const positions = await getActiveAdPositionOptions();

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="New banner"
        description="Schedule a banner for an ad position."
      />

      <BannerForm
        positions={positions}
        submitLabel="Create banner"
        cancelHref="/admin/advertising"
        action={createBannerAction}
      />
    </section>
  );
}
