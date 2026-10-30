import { db } from "@/db";
import { servers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ServerDetailClient } from "@/components/ServerDetailClient";

export const dynamic = "force-dynamic";

export default async function ServerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const server = await db
    .select()
    .from(servers)
    .where(eq(servers.id, parseInt(id)))
    .limit(1);

  if (server.length === 0) {
    notFound();
  }

  return <ServerDetailClient server={server[0]} />;
}
