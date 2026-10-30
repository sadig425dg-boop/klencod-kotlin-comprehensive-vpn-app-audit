import { db } from "@/db";
import { servers, connectionLogs } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { DashboardClient } from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch active server
  const activeServers = await db.select()
    .from(servers)
    .where(eq(servers.isActive, true))
    .limit(1);

  // Fetch all servers count
  const serverCount = await db.select({
    count: sql<number>`count(*)::int`,
  }).from(servers);

  // Fetch favorite servers
  const favoriteServers = await db.select()
    .from(servers)
    .where(eq(servers.isFavorite, true))
    .orderBy(servers.latency)
    .limit(5);

  // Fetch recent connection stats
  const stats = await db.select({
    totalUpload: sql<number>`coalesce(sum(${connectionLogs.uploadBytes}), 0)::bigint`,
    totalDownload: sql<number>`coalesce(sum(${connectionLogs.downloadBytes}), 0)::bigint`,
    totalDuration: sql<number>`coalesce(sum(${connectionLogs.duration}), 0)::int`,
    totalConnections: sql<number>`count(*)::int`,
  }).from(connectionLogs);

  // Recent logs
  const recentLogs = await db.select()
    .from(connectionLogs)
    .orderBy(desc(connectionLogs.connectedAt))
    .limit(3);

  return (
    <DashboardClient
      activeServer={activeServers[0] || null}
      serverCount={serverCount[0].count}
      favoriteServers={favoriteServers}
      stats={{
        totalUpload: Number(stats[0].totalUpload),
        totalDownload: Number(stats[0].totalDownload),
        totalDuration: stats[0].totalDuration,
        totalConnections: stats[0].totalConnections,
      }}
      recentLogs={recentLogs}
    />
  );
}
