import "dotenv/config";
import {
  PublicationStatus,
  ServerStatus,
} from "../generated/prisma/client";
import { ensureDefaultAdPositions } from "@/lib/advertising/setup";
import { prisma } from "../lib/prisma";

async function main() {
  await ensureDefaultAdPositions();

  await prisma.serverChronicle.deleteMany();
  await prisma.serverLink.deleteMany();
  await prisma.rankingPromotion.deleteMany();
  await prisma.premiumBlock.deleteMany();
  await prisma.server.deleteMany();
  await prisma.chronicle.deleteMany();
  await prisma.serverType.deleteMany();

  const chronicles = await Promise.all([
    prisma.chronicle.create({
      data: { name: "Interlude", slug: "interlude", sortOrder: 1 },
    }),
    prisma.chronicle.create({
      data: { name: "High Five", slug: "high-five", sortOrder: 2 },
    }),
    prisma.chronicle.create({
      data: { name: "Essence", slug: "essence", sortOrder: 3 },
    }),
  ]);

  const [pvp, lowRate, midRate] = await Promise.all([
    prisma.serverType.create({
      data: { name: "PvP", slug: "pvp", sortOrder: 1 },
    }),
    prisma.serverType.create({
      data: { name: "Low Rate", slug: "low-rate", sortOrder: 2 },
    }),
    prisma.serverType.create({
      data: { name: "Mid Rate", slug: "mid-rate", sortOrder: 3 },
    }),
  ]);

  const servers = [
    {
      name: "L2 Legacy",
      slug: "l2-legacy",
      shortDescription: "Classic Interlude experience with stable economy.",
      fullDescription: `## About L2 Legacy

A long-running **Interlude** project focused on balanced progression and a stable adena economy.

### Features

- Buffer and support classes are welcome in every party
- Olympiad seasons every two weeks
- No pay-to-win shop

Visit our [Discord community](https://discord.com) for launch events and giveaways.`,
      seoTitle: "L2 Legacy — Interlude Low Rate Server",
      seoDescription:
        "Classic Interlude low rate server with stable economy, fair progression, and active community.",
      rateExp: 15,
      rateSp: 15,
      rateAdena: 10,
      rateDrop: 5,
      rateSpoil: 5,
      status: ServerStatus.ONLINE,
      regularPosition: 1,
      serverTypeId: lowRate.id,
      chronicleIds: [chronicles[0].id],
      openingDate: new Date("2026-01-15"),
      links: [
        { label: "Website", url: "https://example.com/l2-legacy", sortOrder: 0 },
        { label: "Discord", url: "https://discord.com", sortOrder: 1 },
        { label: "Telegram", url: "https://telegram.org", sortOrder: 2 },
      ],
    },
    {
      name: "Adrenaline PvP",
      slug: "adrenaline-pvp",
      shortDescription: "Fast-paced High Five PvP with daily sieges.",
      fullDescription: `## High Five PvP action

Daily sieges, fast gear progression, and large-scale clan fights.

- Castle sieges every weekend
- Custom PvP zones with ranking rewards
- Active GM team`,
      rateExp: 100,
      rateSp: 100,
      rateAdena: 50,
      rateDrop: 10,
      rateSpoil: 10,
      status: ServerStatus.ONLINE,
      regularPosition: 2,
      serverTypeId: pvp.id,
      chronicleIds: [chronicles[1].id],
      openingDate: new Date("2025-11-20"),
      links: [
        { label: "Website", url: "https://example.com/adrenaline", sortOrder: 0 },
        { label: "Discord", url: "https://discord.com", sortOrder: 1 },
      ],
    },
    {
      name: "Essence Rise",
      slug: "essence-rise",
      shortDescription: "Fresh Essence launch with balanced mid rates.",
      fullDescription: `## Upcoming Essence launch

Opening soon with a fresh economy and launch events for new players and clans.`,
      rateExp: 50,
      rateSp: 50,
      rateAdena: 25,
      rateDrop: 8,
      rateSpoil: 8,
      status: ServerStatus.UPCOMING,
      isOpeningSoon: true,
      regularPosition: 3,
      serverTypeId: midRate.id,
      chronicleIds: [chronicles[2].id],
      openingDate: new Date("2026-09-01"),
      links: [{ label: "Discord", url: "https://discord.com", sortOrder: 0 }],
    },
    {
      name: "Chronicle Mix",
      slug: "chronicle-mix",
      shortDescription: "Interlude and High Five content in one project.",
      fullDescription: `## Two chronicles in one world

Experience mixed content from **Interlude** and **High Five** in a single progression path.`,
      rateExp: 25,
      rateSp: 25,
      rateAdena: 15,
      rateDrop: 7,
      rateSpoil: 7,
      status: ServerStatus.ONLINE,
      regularPosition: 4,
      serverTypeId: midRate.id,
      chronicleIds: [chronicles[0].id, chronicles[1].id],
      openingDate: new Date("2026-03-10"),
      links: [
        { label: "Website", url: "https://example.com/chronicle-mix", sortOrder: 0 },
        { label: "YouTube", url: "https://youtube.com", sortOrder: 1 },
      ],
    },
  ] as const;

  for (const server of servers) {
    await prisma.server.create({
      data: {
        name: server.name,
        slug: server.slug,
        shortDescription: server.shortDescription,
        fullDescription: server.fullDescription,
        seoTitle: "seoTitle" in server ? server.seoTitle : undefined,
        seoDescription: "seoDescription" in server ? server.seoDescription : undefined,
        rateExp: server.rateExp,
        rateSp: server.rateSp,
        rateAdena: server.rateAdena,
        rateDrop: server.rateDrop,
        rateSpoil: server.rateSpoil,
        status: server.status,
        publicationStatus: PublicationStatus.PUBLISHED,
        regularPosition: server.regularPosition,
        isOpeningSoon: "isOpeningSoon" in server ? server.isOpeningSoon : false,
        openingDate: server.openingDate,
        serverTypeId: server.serverTypeId,
        chronicles: {
          create: server.chronicleIds.map((chronicleId) => ({ chronicleId })),
        },
        links: {
          create: server.links.map((link) => ({ ...link })),
        },
      },
    });
  }

  console.log(`Seeded ${chronicles.length} chronicles, 3 server types, ${servers.length} servers.`);
  console.log("Ensured default ad positions for homepage ad slots.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
