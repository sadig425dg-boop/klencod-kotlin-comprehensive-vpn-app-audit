import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { connectionLogs } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const logs = await db.select()
      .from(connectionLogs)
      .orderBy(desc(connectionLogs.connectedAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db.select({
      count: sql<number>`count(*)::int`,
    }).from(connectionLogs);

    return NextResponse.json({
      logs,
      total: countResult[0].count,
    });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json({ error: "فشل في جلب السجلات" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const log = await db.insert(connectionLogs).values({
      serverId: body.serverId,
      serverName: body.serverName,
      protocol: body.protocol,
      status: body.status || "connected",
      uploadBytes: body.uploadBytes || 0,
      downloadBytes: body.downloadBytes || 0,
      duration: body.duration || 0,
    }).returning();

    return NextResponse.json(log[0], { status: 201 });
  } catch (error) {
    console.error("Error creating log:", error);
    return NextResponse.json({ error: "فشل في إنشاء السجل" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await db.delete(connectionLogs);
    return NextResponse.json({ message: "تم مسح جميع السجلات" });
  } catch (error) {
    console.error("Error clearing logs:", error);
    return NextResponse.json({ error: "فشل في مسح السجلات" }, { status: 500 });
  }
}
