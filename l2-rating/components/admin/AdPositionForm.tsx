"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { ActionResult, AdPositionFormData } from "@/lib/admin/types";
import { slugify } from "@/lib/admin/slug";
import { PUBLIC_AD_SLOT_DEFINITIONS } from "@/lib/advertising/public-slots";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdPositionFormProps = {
  initialValues?: AdPositionFormData;
  submitLabel: string;
  action: (formData: FormData) => Promise<ActionResult>;
};

export function AdPositionForm({
  initialValues,
  submitLabel,
  action,
}: AdPositionFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [location, setLocation] = useState(initialValues?.location ?? "");
  const [width, setWidth] = useState(
    initialValues?.width != null ? String(initialValues.width) : "",
  );
  const [height, setHeight] = useState(
    initialValues?.height != null ? String(initialValues.height) : "",
  );
  const [sortOrder, setSortOrder] = useState(
    String(initialValues?.sortOrder ?? 0),
  );
  const [isActive, setIsActive] = useState(initialValues?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleNameChange(value: string) {
    setName(value);

    if (!initialValues && !slug.trim()) {
      setSlug(slugify(value));
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("location", location);
    formData.set("width", width);
    formData.set("height", height);
    formData.set("sortOrder", sortOrder);
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

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(event) => handleNameChange(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <p className="text-sm text-muted-foreground">
          Must match a public slot slug for the banner to appear on the site.
          Use{" "}
          {PUBLIC_AD_SLOT_DEFINITIONS.map((slot, index) => (
            <span key={slot.slug}>
              {index > 0 ? " or " : ""}
              <code>{slot.slug}</code>
            </span>
          ))}
          .
        </p>
        <div className="flex flex-wrap gap-2">
          {PUBLIC_AD_SLOT_DEFINITIONS.map((slot) => (
            <Button
              key={slot.slug}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setName(slot.name);
                setSlug(slot.slug);
                setLocation(slot.location);
                setWidth(String(slot.width));
                setHeight(String(slot.height));
                setSortOrder(String(slot.sortOrder));
              }}
            >
              Use {slot.slug}
            </Button>
          ))}
        </div>
        <Input
          id="slug"
          required
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location label</Label>
        <Input
          id="location"
          required
          placeholder="Homepage top"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="width">Width (px)</Label>
          <Input
            id="width"
            type="number"
            min={0}
            value={width}
            onChange={(event) => setWidth(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="height">Height (px)</Label>
          <Input
            id="height"
            type="number"
            min={0}
            value={height}
            onChange={(event) => setHeight(event.target.value)}
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Width and height control the rendered banner size on the public site.
        Leave empty to use the image natural size within the slot container.
      </p>

      <div className="space-y-2">
        <Label htmlFor="sortOrder">Sort order</Label>
        <Input
          id="sortOrder"
          type="number"
          min={0}
          required
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
        />
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

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
