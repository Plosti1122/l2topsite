import type { Metadata } from "next";
import Link from "next/link";
import {
  deleteAdPositionAction,
  deleteBannerAction,
} from "@/app/admin/advertising/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdPositionTable,
  BannerTable,
} from "@/components/admin/AdvertisingTables";
import { PUBLIC_AD_SLOT } from "@/lib/advertising/constants";
import {
  getAdPositionsForAdmin,
  getBannersForAdmin,
} from "@/lib/admin/advertising/queries";
import { ensureDefaultAdPositions } from "@/lib/advertising/setup";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Advertising",
  robots: { index: false, follow: false },
};

export default async function AdminAdvertisingPage() {
  await ensureDefaultAdPositions();

  const [positions, banners] = await Promise.all([
    getAdPositionsForAdmin(),
    getBannersForAdmin(),
  ]);

  return (
    <section className="space-y-10">
      <AdminPageHeader
        title="Advertising"
        description="Manage ad positions and banner schedules. One live banner per position at a time (BR-21); queued banners rotate automatically by schedule (BR-24)."
      />

      <div className="rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Public slot slugs</p>
        <p className="mt-1">
          Homepage top: <code>{PUBLIC_AD_SLOT.homepageTop}</code> · Sidebar:{" "}
          <code>{PUBLIC_AD_SLOT.homepageSidebar}</code>
        </p>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Ad positions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Define where banners can appear on the public site.
            </p>
          </div>
          <Button render={<Link href="/admin/advertising/positions/new" />}>
            Add position
          </Button>
        </div>

        <AdPositionTable
          positions={positions}
          deleteAction={deleteAdPositionAction}
        />
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Banners</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Schedule banner creatives with start/end dates (BR-22, BR-23).
            </p>
          </div>
          <Button render={<Link href="/admin/advertising/banners/new" />}>
            Add banner
          </Button>
        </div>

        <BannerTable banners={banners} deleteAction={deleteBannerAction} />
      </section>
    </section>
  );
}
