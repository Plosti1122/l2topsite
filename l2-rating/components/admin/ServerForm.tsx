"use client";

import Link from "next/link";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import type {
  ActionResult,
  AdminServerFormData,
  DictionaryOption,
  ServerLinkInput,
} from "@/lib/admin/types";
import { slugify } from "@/lib/admin/slug";
import { MEDIA_FOLDERS } from "@/lib/storage/constants";
import { DeleteConfirmButton } from "@/components/admin/DeleteConfirmButton";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ServerFormProps = {
  initialValues?: AdminServerFormData;
  serverTypes: DictionaryOption[];
  chronicles: DictionaryOption[];
  submitLabel: string;
  action: (formData: FormData) => Promise<ActionResult>;
  deleteAction?: (id: string) => Promise<ActionResult>;
};

const emptyLink = (): ServerLinkInput => ({
  label: "",
  url: "",
  sortOrder: 0,
});

export function ServerForm({
  initialValues,
  serverTypes,
  chronicles,
  submitLabel,
  action,
  deleteAction,
}: ServerFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [slug, setSlug] = useState(initialValues?.slug ?? "");
  const [logoUrl, setLogoUrl] = useState(initialValues?.logoUrl ?? "");
  const [shortDescription, setShortDescription] = useState(
    initialValues?.shortDescription ?? "",
  );
  const [fullDescription, setFullDescription] = useState(
    initialValues?.fullDescription ?? "",
  );
  const [rateExp, setRateExp] = useState(String(initialValues?.rateExp ?? 1));
  const [rateSp, setRateSp] = useState(String(initialValues?.rateSp ?? 1));
  const [rateAdena, setRateAdena] = useState(
    String(initialValues?.rateAdena ?? 1),
  );
  const [rateDrop, setRateDrop] = useState(String(initialValues?.rateDrop ?? 1));
  const [rateSpoil, setRateSpoil] = useState(
    String(initialValues?.rateSpoil ?? 1),
  );
  const [openingDate, setOpeningDate] = useState(
    initialValues?.openingDate ?? "",
  );
  const [isOpeningSoon, setIsOpeningSoon] = useState(
    initialValues?.isOpeningSoon ?? false,
  );
  const [status, setStatus] = useState<"UPCOMING" | "ONLINE">(
    initialValues?.status ?? "UPCOMING",
  );
  const [publicationStatus, setPublicationStatus] = useState<
    "PUBLISHED" | "HIDDEN"
  >(initialValues?.publicationStatus ?? "HIDDEN");
  const [regularPosition, setRegularPosition] = useState(
    initialValues?.regularPosition != null
      ? String(initialValues.regularPosition)
      : "",
  );
  const [seoTitle, setSeoTitle] = useState(initialValues?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    initialValues?.seoDescription ?? "",
  );
  const [ogImageUrl, setOgImageUrl] = useState(initialValues?.ogImageUrl ?? "");
  const [serverTypeId, setServerTypeId] = useState(
    initialValues?.serverTypeId ?? serverTypes[0]?.id ?? "",
  );
  const [selectedChronicleIds, setSelectedChronicleIds] = useState<string[]>(
    initialValues?.chronicleIds ?? [],
  );
  const [links, setLinks] = useState<ServerLinkInput[]>(
    initialValues?.links.length ? initialValues.links : [emptyLink()],
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleNameChange(value: string) {
    setName(value);

    if (!initialValues && !slug.trim()) {
      setSlug(slugify(value));
    }
  }

  function toggleChronicle(chronicleId: string, checked: boolean) {
    setSelectedChronicleIds((current) => {
      if (checked) {
        return current.includes(chronicleId)
          ? current
          : [...current, chronicleId];
      }

      return current.filter((id) => id !== chronicleId);
    });
  }

  function updateLink(
    index: number,
    field: keyof ServerLinkInput,
    value: string,
  ) {
    setLinks((current) =>
      current.map((link, linkIndex) =>
        linkIndex === index ? { ...link, [field]: value } : link,
      ),
    );
  }

  function addLink() {
    setLinks((current) => [...current, emptyLink()]);
  }

  function removeLink(index: number) {
    setLinks((current) =>
      current.length === 1 ? [emptyLink()] : current.filter((_, i) => i !== index),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("logoUrl", logoUrl);
    formData.set("shortDescription", shortDescription);
    formData.set("fullDescription", fullDescription);
    formData.set("rateExp", rateExp);
    formData.set("rateSp", rateSp);
    formData.set("rateAdena", rateAdena);
    formData.set("rateDrop", rateDrop);
    formData.set("rateSpoil", rateSpoil);
    formData.set("openingDate", openingDate);
    if (isOpeningSoon) {
      formData.set("isOpeningSoon", "on");
    }
    formData.set("status", status);
    formData.set("publicationStatus", publicationStatus);
    formData.set("regularPosition", regularPosition);
    formData.set("seoTitle", seoTitle);
    formData.set("seoDescription", seoDescription);
    formData.set("ogImageUrl", ogImageUrl);
    formData.set("serverTypeId", serverTypeId);

    for (const chronicleId of selectedChronicleIds) {
      formData.append("chronicleIds", chronicleId);
    }

    for (const link of links) {
      formData.append("linkLabel", link.label);
      formData.append("linkUrl", link.url);
    }

    startTransition(async () => {
      const result = await action(formData);

      if (!result.ok) {
        setError(result.message);
        toast.error(result.message);
      }
    });
  }

  const selectClassName =
    "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic information</CardTitle>
          <CardDescription>Name, slug, type, and chronicles.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
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
            <Input
              id="slug"
              required
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serverTypeId">Server type</Label>
            <select
              id="serverTypeId"
              required
              className={selectClassName}
              value={serverTypeId}
              onChange={(event) => setServerTypeId(event.target.value)}
            >
              {serverTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3 md:col-span-2">
            <Label>Chronicles</Label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {chronicles.map((chronicle) => {
                const checked = selectedChronicleIds.includes(chronicle.id);

                return (
                  <label
                    key={chronicle.id}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(value) =>
                        toggleChronicle(chronicle.id, value === true)
                      }
                    />
                    <span className="text-sm">{chronicle.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-2">
            <ImageUploadField
              id="logoUrl"
              label="Logo"
              description="Shown on server cards and detail pages."
              value={logoUrl}
              onChange={setLogoUrl}
              folder={MEDIA_FOLDERS.logos}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="shortDescription">Short description</Label>
            <Textarea
              id="shortDescription"
              rows={2}
              value={shortDescription}
              onChange={(event) => setShortDescription(event.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="fullDescription">Full description (Markdown)</Label>
            <Textarea
              id="fullDescription"
              rows={8}
              value={fullDescription}
              onChange={(event) => setFullDescription(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rates</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {(
            [
              ["rateExp", "EXP", rateExp, setRateExp],
              ["rateSp", "SP", rateSp, setRateSp],
              ["rateAdena", "Adena", rateAdena, setRateAdena],
              ["rateDrop", "Drop", rateDrop, setRateDrop],
              ["rateSpoil", "Spoil", rateSpoil, setRateSpoil],
            ] as const
          ).map(([id, label, value, setter]) => (
            <div key={id} className="space-y-2">
              <Label htmlFor={id}>{label}</Label>
              <Input
                id={id}
                type="number"
                min={0}
                required
                value={value}
                onChange={(event) => setter(event.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status & publication</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">Server status</Label>
            <select
              id="status"
              className={selectClassName}
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as "UPCOMING" | "ONLINE")
              }
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="ONLINE">Online</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publicationStatus">Publication</Label>
            <select
              id="publicationStatus"
              className={selectClassName}
              value={publicationStatus}
              onChange={(event) =>
                setPublicationStatus(
                  event.target.value as "PUBLISHED" | "HIDDEN",
                )
              }
            >
              <option value="HIDDEN">Hidden</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="regularPosition">Regular position</Label>
            <Input
              id="regularPosition"
              type="number"
              min={1}
              placeholder="Optional"
              value={regularPosition}
              onChange={(event) => setRegularPosition(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="openingDate">Opening date</Label>
            <Input
              id="openingDate"
              type="date"
              value={openingDate}
              onChange={(event) => setOpeningDate(event.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 md:col-span-2">
            <Checkbox
              id="isOpeningSoon"
              checked={isOpeningSoon}
              onCheckedChange={(checked) => setIsOpeningSoon(checked === true)}
            />
            <Label htmlFor="isOpeningSoon">Opening soon</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO title</Label>
            <Input
              id="seoTitle"
              value={seoTitle}
              onChange={(event) => setSeoTitle(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoDescription">SEO description</Label>
            <Textarea
              id="seoDescription"
              rows={3}
              value={seoDescription}
              onChange={(event) => setSeoDescription(event.target.value)}
            />
          </div>

          <ImageUploadField
            id="ogImageUrl"
            label="Open Graph image"
            description="Used for social previews. Falls back to the logo when empty."
            value={ogImageUrl}
            onChange={setOgImageUrl}
            folder={MEDIA_FOLDERS.ogImages}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Links</CardTitle>
            <CardDescription>Website, Discord, Telegram, etc.</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={addLink}>
            <PlusIcon />
            Add link
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {links.map((link, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <Input
                placeholder="Label"
                value={link.label}
                onChange={(event) =>
                  updateLink(index, "label", event.target.value)
                }
              />
              <Input
                placeholder="https://..."
                type="url"
                value={link.url}
                onChange={(event) => updateLink(index, "url", event.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLink(index)}
              >
                <Trash2Icon />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : submitLabel}
        </Button>
        <Button variant="outline" render={<Link href="/admin/servers" />}>
          Cancel
        </Button>
        {deleteAction && initialValues ? (
          <DeleteConfirmButton
            label="Delete server"
            title="Delete server?"
            description="This action permanently removes the server and its links."
            itemId={initialValues.id}
            deleteAction={deleteAction}
            redirectTo="/admin/servers"
          />
        ) : null}
      </div>
    </form>
  );
}
