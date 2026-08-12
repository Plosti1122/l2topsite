import Link from "next/link";
import type { PromoEntryListItem } from "@/lib/admin/types";
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

type PromoEntryTableProps = {
  title: string;
  description: string;
  entries: PromoEntryListItem[];
  addHref: string;
  editHref: (id: string) => string;
  deleteAction: (id: string) => Promise<{ ok: true } | { ok: false; message: string }>;
};

const statusVariant: Record<
  PromoEntryListItem["lifecycleStatus"],
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

export function PromoEntryTable({
  title,
  description,
  entries,
  addHref,
  editHref,
  deleteAction,
}: PromoEntryTableProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button render={<Link href={addHref} />}>Add promotion</Button>
      </div>

      {entries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No {title.toLowerCase()} entries yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pos</TableHead>
                <TableHead>Server</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-mono">{entry.position}</TableCell>
                  <TableCell>
                    <div className="font-medium">{entry.serverName}</div>
                    <div className="text-xs text-muted-foreground">
                      {entry.serverSlug}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div>{formatDateTime(entry.startAt)}</div>
                    <div>{formatDateTime(entry.endAt)}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[entry.lifecycleStatus]}>
                      {entry.lifecycleStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        render={<Link href={editHref(entry.id)} />}
                      >
                        Edit
                      </Button>
                      <DeleteConfirmButton
                        label="Delete"
                        title={`Delete ${title.toLowerCase()}?`}
                        description={`Remove promotion for "${entry.serverName}".`}
                        itemId={entry.id}
                        deleteAction={deleteAction}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}
