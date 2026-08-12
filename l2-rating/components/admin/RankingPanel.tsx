"use client";

import Link from "next/link";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  HashIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type {
  ActionResult,
  RankingListItem,
  UnrankedPublishedServer,
} from "@/lib/admin/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type RankingPanelProps = {
  rankedServers: RankingListItem[];
  unrankedServers: UnrankedPublishedServer[];
  moveUpAction: (serverId: string) => Promise<ActionResult>;
  moveDownAction: (serverId: string) => Promise<ActionResult>;
  setPositionAction: (serverId: string, position: number) => Promise<ActionResult>;
  addToRankingAction: (serverId: string) => Promise<ActionResult>;
  removeFromRankingAction: (serverId: string) => Promise<ActionResult>;
};

export function RankingPanel({
  rankedServers,
  unrankedServers,
  moveUpAction,
  moveDownAction,
  setPositionAction,
  addToRankingAction,
  removeFromRankingAction,
}: RankingPanelProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function runAction(action: () => Promise<ActionResult>, successMessage: string) {
    startTransition(async () => {
      const result = await action();

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(successMessage);
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      {rankedServers.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
          No published servers in the ranking yet. Publish a server and add it
          below, or assign a position in the server editor.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Server</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankedServers.map((server, index) => (
                <TableRow key={server.id}>
                  <TableCell className="font-mono text-muted-foreground">
                    {server.regularPosition}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{server.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {server.slug}
                    </div>
                  </TableCell>
                  <TableCell>{server.serverTypeName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{server.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="outline"
                        size="icon-sm"
                        disabled={isPending || index === 0}
                        onClick={() =>
                          runAction(
                            () => moveUpAction(server.id),
                            "Moved up in ranking.",
                          )
                        }
                        aria-label="Move up"
                      >
                        <ArrowUpIcon />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        disabled={
                          isPending || index === rankedServers.length - 1
                        }
                        onClick={() =>
                          runAction(
                            () => moveDownAction(server.id),
                            "Moved down in ranking.",
                          )
                        }
                        aria-label="Move down"
                      >
                        <ArrowDownIcon />
                      </Button>
                      <SetPositionDialog
                        serverName={server.name}
                        serverId={server.id}
                        maxPosition={rankedServers.length}
                        currentPosition={server.regularPosition}
                        setPositionAction={setPositionAction}
                        disabled={isPending}
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={isPending}
                        onClick={() =>
                          runAction(
                            () => removeFromRankingAction(server.id),
                            "Removed from ranking.",
                          )
                        }
                        aria-label="Remove from ranking"
                      >
                        <XIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        render={
                          <Link href={`/admin/servers/${server.id}/edit`} />
                        }
                      >
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {unrankedServers.length > 0 ? (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-medium">Unranked published servers</h2>
            <p className="text-sm text-muted-foreground">
              These servers are published but have no regular position yet.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Server</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unrankedServers.map((server) => (
                  <TableRow key={server.id}>
                    <TableCell>
                      <div className="font-medium">{server.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {server.slug}
                      </div>
                    </TableCell>
                    <TableCell>{server.serverTypeName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{server.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          onClick={() =>
                            runAction(
                              () => addToRankingAction(server.id),
                              "Added to end of ranking.",
                            )
                          }
                        >
                          <PlusIcon />
                          Add to ranking
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          render={
                            <Link href={`/admin/servers/${server.id}/edit`} />
                          }
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SetPositionDialog({
  serverName,
  serverId,
  maxPosition,
  currentPosition,
  setPositionAction,
  disabled,
}: {
  serverName: string;
  serverId: string;
  maxPosition: number;
  currentPosition: number;
  setPositionAction: (serverId: string, position: number) => Promise<ActionResult>;
  disabled: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(String(currentPosition));
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const parsed = Number.parseInt(position, 10);
      const result = await setPositionAction(serverId, parsed);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success("Ranking position updated.");
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
          setPosition(String(currentPosition));
        }
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline" size="icon-sm" disabled={disabled} />
        }
        aria-label="Set position"
      >
        <HashIcon />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Set ranking position</DialogTitle>
            <DialogDescription>
              Move &quot;{serverName}&quot; to a specific position. Other servers
              shift automatically (1–{maxPosition}).
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor={`position-${serverId}`}>Position</Label>
            <Input
              id={`position-${serverId}`}
              type="number"
              min={1}
              max={maxPosition}
              required
              value={position}
              onChange={(event) => setPosition(event.target.value)}
              className="mt-2"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Apply"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
