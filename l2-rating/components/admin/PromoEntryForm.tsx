"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MAX_ACTIVE_PROMO_SLOTS } from "@/lib/admin/premium/constants";
import { formatPromoDateTime } from "@/lib/admin/premium/status";
import type { ActionResult, PromoEntryFormData, PromoServerOption } from "@/lib/admin/types";
import { DeleteConfirmButton } from "@/components/admin/DeleteConfirmButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PromoEntryFormProps = {
  productName: string;
  servers: PromoServerOption[];
  initialValues?: PromoEntryFormData;
  submitLabel: string;
  cancelHref: string;
  action: (formData: FormData) => Promise<ActionResult>;
  deleteAction?: (id: string) => Promise<ActionResult>;
};

export function PromoEntryForm({
  productName,
  servers,
  initialValues,
  submitLabel,
  cancelHref,
  action,
  deleteAction,
}: PromoEntryFormProps) {
  const defaultStart = initialValues
    ? formatPromoDateTime(new Date(initialValues.startAt))
    : formatPromoDateTime(new Date());
  const defaultEnd = initialValues
    ? formatPromoDateTime(new Date(initialValues.endAt))
    : formatPromoDateTime(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  const [serverId, setServerId] = useState(
    initialValues?.serverId ?? servers[0]?.id ?? "",
  );
  const [position, setPosition] = useState(
    String(initialValues?.position ?? 1),
  );
  const [startAt, setStartAt] = useState(defaultStart);
  const [endAt, setEndAt] = useState(defaultEnd);
  const [isActive, setIsActive] = useState(initialValues?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectClassName =
    "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("serverId", serverId);
    formData.set("position", position);
    formData.set("startAt", startAt);
    formData.set("endAt", endAt);
    if (isActive) {
      formData.set("isActive", "on");
    }

    startTransition(async () => {
      const result = await action(formData);

      if (!result.ok) {
        setError(result.message);
        toast.error(result.message);
      }
    });
  }

  if (servers.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-sm text-muted-foreground">
        Publish at least one server before creating a {productName.toLowerCase()}{" "}
        promotion.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="serverId">Server</Label>
        <select
          id="serverId"
          required
          className={selectClassName}
          value={serverId}
          onChange={(event) => setServerId(event.target.value)}
        >
          {servers.map((server) => (
            <option key={server.id} value={server.id}>
              {server.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Position (1–{MAX_ACTIVE_PROMO_SLOTS})</Label>
        <Input
          id="position"
          type="number"
          min={1}
          max={MAX_ACTIVE_PROMO_SLOTS}
          required
          value={position}
          onChange={(event) => setPosition(event.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startAt">Start</Label>
          <Input
            id="startAt"
            type="datetime-local"
            required
            value={startAt}
            onChange={(event) => setStartAt(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endAt">End</Label>
          <Input
            id="endAt"
            type="datetime-local"
            required
            value={endAt}
            onChange={(event) => setEndAt(event.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setIsActive(checked === true)}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
        <Button variant="outline" render={<Link href={cancelHref} />}>
          Cancel
        </Button>
        {deleteAction && initialValues ? (
          <DeleteConfirmButton
            label="Delete"
            title={`Delete ${productName.toLowerCase()}?`}
            description="This promotion entry will be permanently removed."
            itemId={initialValues.id}
            deleteAction={deleteAction}
            redirectTo="/admin/premium"
          />
        ) : null}
      </div>
    </form>
  );
}
