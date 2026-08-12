"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", exact: true },
  { href: "/admin/servers", label: "Servers" },
  { href: "/admin/ranking", label: "Ranking" },
  { href: "/admin/premium", label: "Premium" },
  {
    href: "/admin/dictionaries/chronicles",
    label: "Chronicles",
  },
  {
    href: "/admin/dictionaries/server-types",
    label: "Server Types",
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {navItems.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm transition",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
