import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { servers } from "@/db/schema";
import { eq, desc, asc, like, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const protocol = searchParams.get("protocol");
    const favorite = searchParams.get("favorite");
    const sortBy = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";

    let query = db.select().from(servers).$dynamic();

    if (search) {
      query = query.where(
        or(
          like(servers.name, `%${search}%`),
          like(servers.address, `%${search}%`),
          like(servers.groupName, `%${search}%`)
        )
      );
    }

    if (protocol) {
      query = query.where(eq(servers.protocol, protocol));
    }

    if (favorite === "true") {
      query = query.where(eq(servers.isFavorite, true));
    }

    if (sortBy === "name") {
      query = query.orderBy(order === "asc" ? asc(servers.name) : desc(servers.name));
    } else if (sortBy === "latency") {
      query = query.orderBy(order === "asc" ? asc(servers.latency) : desc(servers.latency));
    } else {
      query = query.orderBy(desc(servers.createdAt));
    }

    const result = await query;
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching servers:", error);
    return NextResponse.json({ error: "فشل في جلب السيرفرات" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newServer = await db.insert(servers).values({
      name: body.name,
      protocol: body.protocol,
      address: body.address,
      port: body.port,
      uuid: body.uuid || "",
      encryption: body.encryption || "none",
      security: body.security || "none",
      network: body.network || "tcp",
      path: body.path || "",
      host: body.host || "",
      sni: body.sni || "",
      fingerprint: body.fingerprint || "",
      flow: body.flow || "",
      alpn: body.alpn || "",
      publicKey: body.publicKey || "",
      shortId: body.shortId || "",
      serviceName: body.serviceName || "",
      method: body.method || "",
      rawUri: body.rawUri || "",
      groupName: body.groupName || "",
      isFavorite: body.isFavorite || false,
      subscriptionId: body.subscriptionId || null,
    }).returning();

    return NextResponse.json(newServer[0], { status: 201 });
  } catch (error) {
    console.error("Error creating server:", error);
    return NextResponse.json({ error: "فشل في إضافة السيرفر" }, { status: 500 });
  }
}
