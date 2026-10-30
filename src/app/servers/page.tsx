import { db } from "@/db";
import { servers } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ServersClient } from "@/components/ServersClient";

export const dynamic = "force-dynamic";

export default async function ServersPage() {
  const allServers = await db.select().from(servers).orderBy(desc(servers.createdAt));

  return <ServersClient initialServers={allServers} />;
}
