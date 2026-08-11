#!/usr/bin/env tsx
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { UserRole } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const roleArg = process.argv[4]?.toUpperCase();
  const role =
    roleArg === "ADMIN" || roleArg === "SUPER_ADMIN"
      ? roleArg
      : UserRole.SUPER_ADMIN;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!email || !password) {
    console.error(
      "Usage: npm run admin:create -- <email> <password> [ADMIN|SUPER_ADMIN]",
    );
    process.exit(1);
  }

  if (!supabaseUrl || !serviceRoleKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.",
    );
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: created, error: createError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role },
    });

  if (createError || !created.user) {
    console.error("Failed to create Supabase Auth user:", createError?.message);
    process.exit(1);
  }

  await prisma.user.upsert({
    where: { id: created.user.id },
    update: {
      email,
      role,
      isBlocked: false,
    },
    create: {
      id: created.user.id,
      email,
      role,
      isBlocked: false,
    },
  });

  console.log(`Admin ready: ${email} (${role})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
