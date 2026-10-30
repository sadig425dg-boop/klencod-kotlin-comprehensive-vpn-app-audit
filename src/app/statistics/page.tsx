import { db } from "@/db";
import { connectionLogs, servers, dailyStats } from "@/db/schema";
import { sql, eq, desc } from "drizzle-orm";
import { StatisticsClient } from "@/components/StatisticsClient";

export const dynamic = "force-dynamic";

export default async function StatisticsPage() {
  const totalStats = await db.select({
    totalConnections: sql<number>`count(*)::int`,
    totalUpload: sql<number>`coalesce(sum(${connectionLogs.uploadBytes}), 0)::bigint`,
    totalDownload: sql<number>`coalesce(sum(${connectionLogs.downloadBytes}), 0)::bigint`,
    totalDuration: sql<number>`coalesce(sum(${connectionLogs.duration}), 0)::int`,
  }).from(connectionLogs);

  const serverCount = await db.select({
    count: sql<number>`count(*)::int`,
  }).from(servers);

  const favCount = await db.select({
    count: sql<number>`count(*)::int`,
  }).from(servers).where(eq(servers.isFavorite, true));

  const protocolDist = await db.select({
    protocol: servers.protocol,
    count: sql<number>`count(*)::int`,
  }).from(servers).groupBy(servers.protocol);

  const daily = await db.select()
    .from(dailyStats)
    .orderBy(desc(dailyStats.date))
    .limit(30);

  return (
    <StatisticsClient
      overview={{
        totalServers: serverCount[0].count,
        favoriteServers: favCount[0].count,
        totalConnections: totalStats[0].totalConnections,
        totalUpload: Number(totalStats[0].totalUpload),
        totalDownload: Number(totalStats[0].totalDownload),
        totalDuration: totalStats[0].totalDuration,
      }}
      protocolDistribution={protocolDist}
      dailyData={daily.reverse()}
    />
  );
}
