import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subscriptions, servers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json({ error: "فشل في جلب الاشتراكات" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.url) {
      return NextResponse.json(
        { error: "يرجى إدخال اسم ورابط الاشتراك" },
        { status: 400 }
      );
    }

    const newSub = await db.insert(subscriptions).values({
      name: body.name,
      url: body.url,
      autoUpdate: body.autoUpdate ?? true,
      updateInterval: body.updateInterval || 60,
    }).returning();

    return NextResponse.json(newSub[0], { status: 201 });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json({ error: "فشل في إضافة الاشتراك" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "معرف الاشتراك مطلوب" }, { status: 400 });
    }

    // Delete associated servers
    await db.delete(servers).where(eq(servers.subscriptionId, parseInt(id)));

    // Delete subscription
    await db.delete(subscriptions).where(eq(subscriptions.id, parseInt(id)));

    return NextResponse.json({ message: "تم حذف الاشتراك بنجاح" });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json({ error: "فشل في حذف الاشتراك" }, { status: 500 });
  }
}
