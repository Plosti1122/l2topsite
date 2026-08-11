import { PublicFooter, PublicHeader } from "@/components/public/PublicShell";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-col bg-zinc-950 text-zinc-100">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
