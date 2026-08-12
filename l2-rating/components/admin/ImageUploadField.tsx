"use client";

import { ImageIcon, UploadIcon, XIcon } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { uploadMediaAction } from "@/app/admin/upload/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MediaFolder } from "@/lib/storage/constants";

type ImageUploadFieldProps = {
  id: string;
  label: string;
  description?: string;
  value: string;
  onChange: (url: string) => void;
  folder: MediaFolder;
  required?: boolean;
};

export function ImageUploadField({
  id,
  label,
  description,
  value,
  onChange,
  folder,
  required = false,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, startUploadTransition] = useTransition();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.set("folder", folder);
    formData.set("file", file);

    startUploadTransition(async () => {
      const result = await uploadMediaAction(formData);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      onChange(result.url);
      toast.success("Image uploaded.");
    });

    event.target.value = "";
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor={id}>
          {label}
          {required ? " *" : ""}
        </Label>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {value ? (
        <div className="flex items-start gap-4 rounded-xl border border-border bg-muted/20 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="h-20 w-20 rounded-lg border border-border object-cover"
          />
          <div className="min-w-0 flex-1 space-y-2">
            <p className="truncate text-sm text-muted-foreground">{value}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange("")}
            >
              <XIcon />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border px-4 py-6 text-center sm:flex-row sm:items-center sm:text-left">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted sm:mx-0">
            <ImageIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium">Upload to Supabase Storage</p>
            <p className="text-sm text-muted-foreground">
              JPEG, PNG, WebP, or GIF up to 5 MB.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            <UploadIcon />
            {isUploading ? "Uploading..." : "Choose file"}
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="space-y-2">
        <Label htmlFor={`${id}-url`}>Or paste image URL</Label>
        <Input
          id={`${id}-url`}
          type="url"
          placeholder="https://..."
          value={value}
          required={required}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}
