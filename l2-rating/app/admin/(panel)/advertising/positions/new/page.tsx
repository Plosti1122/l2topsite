import type { Metadata } from "next";
import { createAdPositionAction } from "@/app/admin/advertising/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdPositionForm } from "@/components/admin/AdPositionForm";

export const metadata: Metadata = {
  title: "New Ad Position",
  robots: { index: false, follow: false },
};

export default function NewAdPositionPage() {
  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="New ad position"
        description="Create a placement slot for banner rotation."
      />

      <AdPositionForm
        submitLabel="Create position"
        action={createAdPositionAction}
      />
    </section>
  );
}
