import { db } from "@/db";
import { connectionLogs } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { LogsClient } from "@/components/LogsClient";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const logs = await db.select()
    .from(connectionLogs)
    .orderBy(desc(connectionLogs.connectedAt))
    .limit(50);

  const totalCount = await db.select({
    count: sql<number>`count(*)::int`,
  }).from(connectionLogs);

  return <LogsClient initialLogs={logs} totalCount={totalCount[0].count} />;
}
