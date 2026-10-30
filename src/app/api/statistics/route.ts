import { NextResponse } from "next/server";
import { db } from "@/db";
import { connectionLogs, servers, dailyStats } from "@/db/schema";
import { sql, desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    // Total statistics
    const totalStats = await db.select({
      totalConnections: sql<number>`count(*)::int`,
      totalUpload: sql<number>`coalesce(sum(${connectionLogs.uploadBytes}), 0)::bigint`,
      totalDownload: sql<number>`coalesce(sum(${connectionLogs.downloadBytes}), 0)::bigint`,
      totalDuration: sql<number>`coalesce(sum(${connectionLogs.duration}), 0)::int`,
      avgLatency: sql<number>`coalesce(avg(${connectionLogs.duration}), 0)::int`,
    }).from(connectionLogs);

    // Server count
    const serverCount = await db.select({
      count: sql<number>`count(*)::int`,
    }).from(servers);

    // Favorite servers
    const favCount = await db.select({
      count: sql<number>`count(*)::int`,
    }).from(servers).where(eq(servers.isFavorite, true));

    // Protocol distribution
    const protocolDist = await db.select({
      protocol: servers.protocol,
      count: sql<number>`count(*)::int`,
    }).from(servers).groupBy(servers.protocol);

    // Recent daily stats
    const recent = await db.select()
      .from(dailyStats)
      .orderBy(desc(dailyStats.date))
      .limit(30);

    // Recent logs
    const recentLogs = await db.select()
      .from(connectionLogs)
      .orderBy(desc(connectionLogs.connectedAt))
      .limit(5);

    return NextResponse.json({
      overview: {
        totalServers: serverCount[0].count,
        favoriteServers: favCount[0].count,
        totalConnections: totalStats[0].totalConnections,
        totalUpload: Number(totalStats[0].totalUpload),
        totalDownload: Number(totalStats[0].totalDownload),
        totalDuration: totalStats[0].totalDuration,
      },
      protocolDistribution: protocolDist,
      dailyStats: recent.reverse(),
      recentLogs,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return NextResponse.json({ error: "فشل في جلب الإحصائيات" }, { status: 500 });
  }
}
