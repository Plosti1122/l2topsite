import Link from "next/link";
import type { AdPositionListItem, BannerListItem } from "@/lib/admin/types";
import { isPublicAdSlotSlug } from "@/lib/advertising/public-slots";
import { DeleteConfirmButton } from "@/components/admin/DeleteConfirmButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AdPositionTableProps = {
  positions: AdPositionListItem[];
  deleteAction: (id: string) => Promise<{ ok: true } | { ok: false; message: string }>;
};

export function AdPositionTable({
  positions,
  deleteAction,
}: AdPositionTableProps) {
  if (positions.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        No ad positions yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Public slot</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Banners</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {positions.map((position) => (
            <TableRow key={position.id}>
              <TableCell className="font-medium">{position.name}</TableCell>
              <TableCell>{position.slug}</TableCell>
              <TableCell>
                {isPublicAdSlotSlug(position.slug) ? (
                  <Badge variant="default">Visible on /</Badge>
                ) : (
                  <Badge variant="destructive">Not on homepage</Badge>
                )}
              </TableCell>
              <TableCell>{position.location}</TableCell>
              <TableCell>
                {position.width && position.height
                  ? `${position.width}×${position.height}`
                  : "—"}
              </TableCell>
              <TableCell>
                <Badge variant={position.isActive ? "default" : "secondary"}>
                  {position.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{position.bannerCount}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <Link href={`/admin/advertising/positions/${position.id}/edit`} />
                    }
                  >
                    Edit
                  </Button>
                  <DeleteConfirmButton
                    label="Delete"
                    title="Delete ad position?"
                    description={`Remove position "${position.name}".`}
                    itemId={position.id}
                    deleteAction={deleteAction}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const statusVariant: Record<
  BannerListItem["lifecycleStatus"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  live: "default",
  scheduled: "outline",
  expired: "secondary",
  inactive: "secondary",
};

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

type BannerTableProps = {
  banners: BannerListItem[];
  deleteAction: (id: string) => Promise<{ ok: true } | { ok: false; message: string }>;
};

export function BannerTable({ banners, deleteAction }: BannerTableProps) {
  if (banners.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        No banners scheduled yet.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banners.map((banner) => (
            <TableRow key={banner.id}>
              <TableCell>
                <div className="font-medium">{banner.adPositionName}</div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{banner.adPositionSlug}</span>
                  {!isPublicAdSlotSlug(banner.adPositionSlug) ? (
                    <Badge variant="destructive">Hidden on homepage</Badge>
                  ) : null}
                </div>
              </TableCell>
              <TableCell className="max-w-[220px] truncate text-sm text-muted-foreground">
                {banner.imageUrl}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                <div>{formatDateTime(banner.startAt)}</div>
                <div>{formatDateTime(banner.endAt)}</div>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant[banner.lifecycleStatus]}>
                  {banner.lifecycleStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={
                      <Link href={`/admin/advertising/banners/${banner.id}/edit`} />
                    }
                  >
                    Edit
                  </Button>
                  <DeleteConfirmButton
                    label="Delete"
                    title="Delete banner?"
                    description="This banner schedule will be permanently removed."
                    itemId={banner.id}
                    deleteAction={deleteAction}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
