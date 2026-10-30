import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { desc } from "drizzle-orm";
import { SubscriptionsClient } from "@/components/SubscriptionsClient";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const allSubs = await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
  return <SubscriptionsClient initialSubscriptions={allSubs} />;
}
