import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { servers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateXrayConfig } from "@/lib/config-parser";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const format = searchParams.get("format") || "uri"; // uri or json

    if (!id) {
      return NextResponse.json({ error: "معرف السيرفر مطلوب" }, { status: 400 });
    }

    const server = await db.select().from(servers).where(eq(servers.id, parseInt(id))).limit(1);

    if (server.length === 0) {
      return NextResponse.json({ error: "السيرفر غير موجود" }, { status: 404 });
    }

    const s = server[0];

    if (format === "json") {
      const config = generateXrayConfig({
        name: s.name,
        protocol: s.protocol,
        address: s.address,
        port: s.port,
        uuid: s.uuid || "",
        encryption: s.encryption || "none",
        security: s.security || "none",
        network: s.network || "tcp",
        path: s.path || "",
        host: s.host || "",
        sni: s.sni || "",
        fingerprint: s.fingerprint || "",
        flow: s.flow || "",
        alpn: s.alpn || "",
        publicKey: s.publicKey || "",
        shortId: s.shortId || "",
        serviceName: s.serviceName || "",
        method: s.method || "",
        rawUri: s.rawUri || "",
      });

      return NextResponse.json(config);
    }

    // Return raw URI
    return NextResponse.json({ uri: s.rawUri || "" });
  } catch (error) {
    console.error("Error exporting server:", error);
    return NextResponse.json({ error: "فشل في تصدير إعدادات السيرفر" }, { status: 500 });
  }
}
