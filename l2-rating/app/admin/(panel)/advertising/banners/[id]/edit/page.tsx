import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  deleteBannerAction,
  updateBannerAction,
} from "@/app/admin/advertising/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BannerForm } from "@/components/admin/BannerForm";
import {
  getAdPositionOptionsForBannerForm,
  getBannerForEdit,
} from "@/lib/admin/advertising/queries";

export const metadata: Metadata = {
  title: "Edit Banner",
  robots: { index: false, follow: false },
};

export default async function EditBannerPage({
  params,
}: PageProps<"/admin/advertising/banners/[id]/edit">) {
  const { id } = await params;
  const banner = await getBannerForEdit(id);

  if (!banner) {
    notFound();
  }

  const positions = await getAdPositionOptionsForBannerForm(banner.adPositionId);
  const saveBanner = updateBannerAction.bind(null, id);

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Edit banner"
        description="Update banner schedule and creative URLs."
      />

      <BannerForm
        positions={positions}
        initialValues={banner}
        submitLabel="Save changes"
        cancelHref="/admin/advertising"
        action={saveBanner}
        deleteAction={deleteBannerAction}
      />
    </section>
  );
}
