import type { Metadata } from "next";
import { createChronicleAction } from "@/app/admin/dictionaries/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DictionaryForm } from "@/components/admin/DictionaryForm";

export const metadata: Metadata = {
  title: "New Chronicle",
  robots: { index: false, follow: false },
};

export default function NewChroniclePage() {
  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="New chronicle"
        description="Add a chronicle to the dictionary."
      />

      <DictionaryForm
        submitLabel="Create chronicle"
        action={createChronicleAction}
      />
    </section>
  );
}
