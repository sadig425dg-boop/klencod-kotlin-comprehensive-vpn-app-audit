import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { servers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const server = await db.select().from(servers).where(eq(servers.id, parseInt(id))).limit(1);
    if (server.length === 0) {
      return NextResponse.json({ error: "السيرفر غير موجود" }, { status: 404 });
    }
    return NextResponse.json(server[0]);
  } catch (error) {
    console.error("Error fetching server:", error);
    return NextResponse.json({ error: "فشل في جلب بيانات السيرفر" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await db.update(servers)
      .set({
        name: body.name,
        protocol: body.protocol,
        address: body.address,
        port: body.port,
        uuid: body.uuid,
        encryption: body.encryption,
        security: body.security,
        network: body.network,
        path: body.path,
        host: body.host,
        sni: body.sni,
        fingerprint: body.fingerprint,
        flow: body.flow,
        alpn: body.alpn,
        publicKey: body.publicKey,
        shortId: body.shortId,
        serviceName: body.serviceName,
        method: body.method,
        rawUri: body.rawUri,
        groupName: body.groupName,
        isFavorite: body.isFavorite,
        updatedAt: new Date(),
      })
      .where(eq(servers.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "السيرفر غير موجود" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error updating server:", error);
    return NextResponse.json({ error: "فشل في تحديث السيرفر" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await db.delete(servers)
      .where(eq(servers.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: "السيرفر غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ message: "تم حذف السيرفر بنجاح" });
  } catch (error) {
    console.error("Error deleting server:", error);
    return NextResponse.json({ error: "فشل في حذف السيرفر" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    
    if (body.isFavorite !== undefined) updateData.isFavorite = body.isFavorite;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.latency !== undefined) updateData.latency = body.latency;

    const updated = await db.update(servers)
      .set(updateData)
      .where(eq(servers.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: "السيرفر غير موجود" }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("Error patching server:", error);
    return NextResponse.json({ error: "فشل في تحديث السيرفر" }, { status: 500 });
  }
}
