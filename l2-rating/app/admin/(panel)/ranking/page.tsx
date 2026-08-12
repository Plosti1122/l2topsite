import type { Metadata } from "next";
import {
  addServerToRankingAction,
  moveRankingServerDownAction,
  moveRankingServerUpAction,
  removeServerFromRankingAction,
  setRankingServerPositionAction,
} from "@/app/admin/ranking/actions";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RankingPanel } from "@/components/admin/RankingPanel";
import {
  getRankingList,
  getUnrankedPublishedServers,
} from "@/lib/admin/ranking/queries";

export const metadata: Metadata = {
  title: "Ranking",
  robots: { index: false, follow: false },
};

export default async function AdminRankingPage() {
  const [rankedServers, unrankedServers] = await Promise.all([
    getRankingList(),
    getUnrankedPublishedServers(),
  ]);

  return (
    <section className="space-y-6">
      <AdminPageHeader
        title="Ranking"
        description="Manage regular ranking positions for published servers. Changes recalculate order automatically without duplicate positions (BR-10)."
      />

      <RankingPanel
        rankedServers={rankedServers}
        unrankedServers={unrankedServers}
        moveUpAction={moveRankingServerUpAction}
        moveDownAction={moveRankingServerDownAction}
        setPositionAction={setRankingServerPositionAction}
        addToRankingAction={addServerToRankingAction}
        removeFromRankingAction={removeServerFromRankingAction}
      />
    </section>
  );
}
