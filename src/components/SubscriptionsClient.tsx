"use client";

import { useState } from "react";
import {
  Rss,
  Plus,
  Trash2,
  RefreshCw,
  Clock,
  Server,
  Loader2,
  X,
  Link2,
} from "lucide-react";
import { Card } from "./Card";
import { formatDate } from "@/lib/utils";
import { clsx } from "clsx";

interface Subscription {
  id: number;
  name: string;
  url: string;
  serversCount: number | null;
  autoUpdate: boolean | null;
  updateInterval: number | null;
  lastUpdatedAt: Date | null;
  createdAt: Date | null;
}

interface SubscriptionsClientProps {
  initialSubscriptions: Subscription[];
}

export function SubscriptionsClient({ initialSubscriptions }: SubscriptionsClientProps) {
  const [subs, setSubs] = useState(initialSubscriptions);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const addSubscription = async () => {
    if (!newName.trim() || !newUrl.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, url: newUrl }),
      });

      if (res.ok) {
        const sub = await res.json();
        setSubs((prev) => [sub, ...prev]);
        setNewName("");
        setNewUrl("");
        setShowAdd(false);
        setMessage("تم إضافة الاشتراك بنجاح");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {
      setMessage("فشل في إضافة الاشتراك");
    }

    setLoading(false);
  };

  const updateSubscription = async (id: number, url: string) => {
    setUpdatingId(id);

    try {
      const res = await fetch("/api/servers/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ configs: url, subscriptionId: id }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(`تم تحديث الاشتراك: ${data.imported} سيرفر جديد`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch {
      setMessage("فشل في تحديث الاشتراك");
    }

    setUpdatingId(null);
  };

  const deleteSubscription = async (id: number) => {
    try {
      await fetch(`/api/subscriptions?id=${id}`, { method: "DELETE" });
      setSubs((prev) => prev.filter((s) => s.id !== id));
      setMessage("تم حذف الاشتراك");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("فشل في حذف الاشتراك");
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Rss className="w-6 h-6 text-neon-orange" />
            الاشتراكات
          </h1>
          <p className="text-text-muted text-sm mt-1">إدارة اشتراكات V2Ray/Xray</p>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span className="text-sm text-neon-green animate-fade-in">{message}</span>
          )}
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-l from-neon-pink to-neon-purple text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            إضافة اشتراك
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <Card className="animate-slide-up space-y-4 neon-border">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">اشتراك جديد</h3>
            <button onClick={() => setShowAdd(false)} className="p-1 rounded-lg hover:bg-dark-bg">
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>
          <div>
            <label className="text-sm text-text-muted mb-1 block">اسم الاشتراك</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="مثال: اشتراك الخادم الرئيسي"
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-purple/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm text-text-muted mb-1 block">رابط الاشتراك</label>
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="https://example.com/subscription"
              className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-purple/50 transition-colors"
              dir="ltr"
            />
          </div>
          <button
            onClick={addSubscription}
            disabled={loading || !newName.trim() || !newUrl.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-l from-neon-pink to-neon-purple text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            إضافة
          </button>
        </Card>
      )}

      {/* Subscriptions List */}
      {subs.length > 0 ? (
        <div className="space-y-3">
          {subs.map((sub) => (
            <Card key={sub.id} className="animate-slide-up">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Rss className="w-4 h-4 text-neon-orange shrink-0" />
                    {sub.name}
                  </h3>
                  <p className="text-xs text-text-muted mt-1 truncate flex items-center gap-1" dir="ltr">
                    <Link2 className="w-3 h-3 shrink-0" />
                    {sub.url}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <Server className="w-3 h-3" />
                      {sub.serversCount || 0} سيرفر
                    </span>
                    {sub.lastUpdatedAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        آخر تحديث: {formatDate(sub.lastUpdatedAt)}
                      </span>
                    )}
                    {sub.autoUpdate && (
                      <span className="text-neon-green">تحديث تلقائي</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 mr-4">
                  <button
                    onClick={() => updateSubscription(sub.id, sub.url)}
                    disabled={updatingId === sub.id}
                    className="p-2 rounded-lg hover:bg-dark-bg transition-colors"
                    title="تحديث"
                  >
                    <RefreshCw
                      className={clsx(
                        "w-4 h-4 text-neon-cyan",
                        updatingId === sub.id && "animate-spin"
                      )}
                    />
                  </button>
                  <button
                    onClick={() => deleteSubscription(sub.id)}
                    className="p-2 rounded-lg hover:bg-dark-bg transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4 text-text-muted hover:text-neon-red" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <Rss className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <p className="text-text-muted text-lg">لا توجد اشتراكات</p>
          <p className="text-text-muted text-sm mt-2">أضف اشتراكاً لاستيراد السيرفرات تلقائياً</p>
        </Card>
      )}
    </div>
  );
}
