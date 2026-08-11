import Link from "next/link";
import type { AdminServerListItem } from "@/lib/admin/types";
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

type ServerTableProps = {
  servers: AdminServerListItem[];
  deleteAction: (id: string) => Promise<{ ok: true } | { ok: false; message: string }>;
};

export function ServerTable({ servers, deleteAction }: ServerTableProps) {
  if (servers.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
        No servers yet. Create the first one to populate the public catalog.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Chronicles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Publication</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servers.map((server) => (
            <TableRow key={server.id}>
              <TableCell>{server.regularPosition ?? "—"}</TableCell>
              <TableCell>
                <div className="font-medium">{server.name}</div>
                <div className="text-xs text-muted-foreground">{server.slug}</div>
              </TableCell>
              <TableCell>{server.serverTypeName}</TableCell>
              <TableCell>{server.chronicleNames.join(", ")}</TableCell>
              <TableCell>
                <Badge variant="outline">{server.status}</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    server.publicationStatus === "PUBLISHED"
                      ? "default"
                      : "secondary"
                  }
                >
                  {server.publicationStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href={`/admin/servers/${server.id}/edit`} />}
                  >
                    Edit
                  </Button>
                  <DeleteConfirmButton
                    label="Delete"
                    title="Delete server?"
                    description={`This will permanently remove "${server.name}".`}
                    itemId={server.id}
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
