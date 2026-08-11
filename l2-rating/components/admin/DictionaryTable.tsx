import Link from "next/link";
import type { DictionaryRecord } from "@/lib/admin/types";
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

type DictionaryTableProps = {
  records: DictionaryRecord[];
  editHref: (id: string) => string;
  deleteAction: (id: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  entityLabel: string;
};

export function DictionaryTable({
  records,
  editHref,
  deleteAction,
  entityLabel,
}: DictionaryTableProps) {
  if (records.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        No {entityLabel} entries yet.
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
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Servers</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell className="font-medium">{record.name}</TableCell>
              <TableCell>{record.slug}</TableCell>
              <TableCell>{record.sortOrder}</TableCell>
              <TableCell>
                <Badge variant={record.isActive ? "default" : "secondary"}>
                  {record.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>{record.serverCount}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={editHref(record.id)} />}
                  >
                    Edit
                  </Button>
                  <DeleteConfirmButton
                    label="Delete"
                    title={`Delete ${entityLabel}?`}
                    description={`This will permanently remove "${record.name}".`}
                    itemId={record.id}
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
