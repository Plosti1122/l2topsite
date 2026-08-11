import { cn } from "@/lib/utils";
import type { ServerStatus } from "@/generated/prisma/client";

const statusLabels = {
  ONLINE: "Online",
  UPCOMING: "Upcoming",
} as const;

type ServerStatusBadgeProps = {
  status: ServerStatus;
};

export function ServerStatusBadge({ status }: ServerStatusBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium",
        status === "ONLINE"
          ? "bg-emerald-500/15 text-emerald-300"
          : "bg-sky-500/15 text-sky-300",
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
