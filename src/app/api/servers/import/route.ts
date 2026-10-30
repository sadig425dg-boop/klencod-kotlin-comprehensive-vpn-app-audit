import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { servers } from "@/db/schema";
import { parseMultipleConfigs, parseConfigUri } from "@/lib/config-parser";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { configs, subscriptionId } = body;

    if (!configs || typeof configs !== "string") {
      return NextResponse.json(
        { error: "يرجى إدخال رابط أو نص الإعدادات" },
        { status: 400 }
      );
    }

    // Try to parse as subscription URL first
    let configText = configs;
    
    // Check if it's a single URL (subscription)
    if (configs.startsWith("http://") || configs.startsWith("https://")) {
      try {
        const response = await fetch(configs, {
          headers: { "User-Agent": "VPN-Manager/1.0" },
          signal: AbortSignal.timeout(10000),
        });
        
        if (response.ok) {
          const text = await response.text();
          // Try base64 decode
          try {
            const decoded = atob(text.trim());
            if (decoded.includes("://")) {
              configText = decoded;
            }
          } catch {
            configText = text;
          }
        }
      } catch {
        // Not a subscription URL, try as config URI
      }
    }

    const parsed = parseMultipleConfigs(configText);

    // If no multi-line configs found, try single URI
    if (parsed.length === 0) {
      const single = parseConfigUri(configs.trim());
      if (single) {
        parsed.push(single);
      }
    }

    if (parsed.length === 0) {
      return NextResponse.json(
        { error: "لم يتم العثور على إعدادات صالحة" },
        { status: 400 }
      );
    }

    const imported: typeof servers.$inferSelect[] = [];
    const duplicates: string[] = [];

    for (const config of parsed) {
      // Check for duplicates based on address + port + uuid
      const existing = await db.select().from(servers).where(
        and(
          eq(servers.address, config.address),
          eq(servers.port, config.port),
          eq(servers.uuid, config.uuid || "")
        )
      ).limit(1);

      if (existing.length > 0) {
        duplicates.push(config.name);
        continue;
      }

      const newServer = await db.insert(servers).values({
        name: config.name,
        protocol: config.protocol,
        address: config.address,
        port: config.port,
        uuid: config.uuid,
        encryption: config.encryption,
        security: config.security,
        network: config.network,
        path: config.path,
        host: config.host,
        sni: config.sni,
        fingerprint: config.fingerprint,
        flow: config.flow,
        alpn: config.alpn,
        publicKey: config.publicKey,
        shortId: config.shortId,
        serviceName: config.serviceName,
        method: config.method,
        rawUri: config.rawUri,
        subscriptionId: subscriptionId || null,
      }).returning();

      imported.push(newServer[0]);
    }

    return NextResponse.json({
      imported: imported.length,
      duplicates: duplicates.length,
      duplicateNames: duplicates,
      servers: imported,
    });
  } catch (error) {
    console.error("Error importing configs:", error);
    return NextResponse.json(
      { error: "فشل في استيراد الإعدادات" },
      { status: 500 }
    );
  }
}
