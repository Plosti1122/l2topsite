import type { Metadata } from "next";
import { createServerTypeAction } from "@/app/admin/dictionaries/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DictionaryForm } from "@/components/admin/DictionaryForm";

export const metadata: Metadata = {
  title: "New Server Type",
  robots: { index: false, follow: false },
};

export default function NewServerTypePage() {
  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="New server type"
        description="Add a server type to the dictionary."
      />

      <DictionaryForm
        submitLabel="Create server type"
        action={createServerTypeAction}
      />
    </section>
  );
}
