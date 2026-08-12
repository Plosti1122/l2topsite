"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  formatPromoDateTime,
} from "@/lib/admin/premium/status";
import type {
  ActionResult,
  AdPositionOption,
  BannerFormData,
} from "@/lib/admin/types";
import { MEDIA_FOLDERS } from "@/lib/storage/constants";
import { DeleteConfirmButton } from "@/components/admin/DeleteConfirmButton";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type BannerFormProps = {
  positions: AdPositionOption[];
  initialValues?: BannerFormData;
  submitLabel: string;
  cancelHref: string;
  action: (formData: FormData) => Promise<ActionResult>;
  deleteAction?: (id: string) => Promise<ActionResult>;
};

export function BannerForm({
  positions,
  initialValues,
  submitLabel,
  cancelHref,
  action,
  deleteAction,
}: BannerFormProps) {
  const defaultStart = initialValues
    ? formatPromoDateTime(new Date(initialValues.startAt))
    : formatPromoDateTime(new Date());
  const defaultEnd = initialValues
    ? formatPromoDateTime(new Date(initialValues.endAt))
    : formatPromoDateTime(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000));

  const [adPositionId, setAdPositionId] = useState(
    initialValues?.adPositionId ?? positions[0]?.id ?? "",
  );
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? "");
  const [targetUrl, setTargetUrl] = useState(initialValues?.targetUrl ?? "");
  const [altText, setAltText] = useState(initialValues?.altText ?? "");
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
    formData.set("adPositionId", adPositionId);
    formData.set("imageUrl", imageUrl);
    formData.set("targetUrl", targetUrl);
    formData.set("altText", altText);
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

  if (positions.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-4 py-8 text-sm text-muted-foreground">
        Create at least one active ad position before adding banners.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="adPositionId">Ad position</Label>
        <select
          id="adPositionId"
          required
          className={selectClassName}
          value={adPositionId}
          onChange={(event) => setAdPositionId(event.target.value)}
        >
          {positions.map((position) => (
            <option key={position.id} value={position.id}>
              {position.name} ({position.slug})
            </option>
          ))}
        </select>
      </div>

      <ImageUploadField
        id="imageUrl"
        label="Banner image"
        description="Displayed on the public homepage ad slot."
        value={imageUrl}
        onChange={setImageUrl}
        folder={MEDIA_FOLDERS.promo}
        required
      />

      <div className="space-y-2">
        <Label htmlFor="targetUrl">Target URL</Label>
        <Input
          id="targetUrl"
          type="url"
          required
          value={targetUrl}
          onChange={(event) => setTargetUrl(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="altText">Alt text</Label>
        <Input
          id="altText"
          value={altText}
          onChange={(event) => setAltText(event.target.value)}
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
            title="Delete banner?"
            description="This banner schedule will be permanently removed."
            itemId={initialValues.id}
            deleteAction={deleteAction}
            redirectTo="/admin/advertising"
          />
        ) : null}
      </div>
    </form>
  );
}
