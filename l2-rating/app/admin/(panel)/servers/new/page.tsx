import type { Metadata } from "next";
import { createServerAction } from "@/app/admin/servers/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ServerForm } from "@/components/admin/ServerForm";
import {
  getActiveChronicleOptions,
  getActiveServerTypeOptions,
} from "@/lib/admin/dictionaries/queries";

export const metadata: Metadata = {
  title: "New Server",
  robots: { index: false, follow: false },
};

export default async function NewServerPage() {
  const [serverTypes, chronicles] = await Promise.all([
    getActiveServerTypeOptions(),
    getActiveChronicleOptions(),
  ]);

  if (serverTypes.length === 0) {
    return (
      <section className="space-y-6">
        <AdminPageHeader
          title="New server"
          description="Create at least one active server type before adding servers."
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="New server"
        description="Create a server entry for the public catalog."
      />

      <ServerForm
        serverTypes={serverTypes}
        chronicles={chronicles}
        submitLabel="Create server"
        action={createServerAction}
      />
    </section>
  );
}
