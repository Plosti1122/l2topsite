import Link from "next/link";
import { Button } from "@/components/ui/button";

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
};

export function AdminPageHeader({
  title,
  description,
  actionHref,
  actionLabel,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      {actionHref && actionLabel ? (
        <Button render={<Link href={actionHref} />}>{actionLabel}</Button>
      ) : null}
    </div>
  );
}
