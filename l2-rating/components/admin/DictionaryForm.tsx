"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/admin/types";
import { slugify } from "@/lib/admin/slug";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DictionaryFormValues = {
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
};

type DictionaryFormProps = {
  initialValues?: DictionaryFormValues;
  submitLabel: string;
  action: (formData: FormData) => Promise<ActionResult>;
};

export function DictionaryForm({
  initialValues,
  submitLabel,
  action,
}: DictionaryFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
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
          name="name"
          required
          value={name}
          onChange={(event) => handleNameChange(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          name="slug"
          required
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sortOrder">Sort order</Label>
        <Input
          id="sortOrder"
          name="sortOrder"
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
