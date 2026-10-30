"use client";

import { useState, useMemo } from "react";
import {
  Server,
  Search,
  Star,
  StarOff,
  Trash2,
  Copy,
  ExternalLink,
  Filter,
  Plus,
  Globe,
  Zap,
} from "lucide-react";
import { Card } from "./Card";
import { clsx } from "clsx";
import { getProtocolBgColor } from "@/lib/config-parser";
import { getLatencyColor } from "@/lib/utils";
import Link from "next/link";

interface ServerData {
  id: number;
  name: string;
  protocol: string;
  address: string;
  port: number;
  uuid: string | null;
  latency: number | null;
  isActive: boolean | null;
  isFavorite: boolean | null;
  network: string | null;
  security: string | null;
  groupName: string | null;
  rawUri: string | null;
  createdAt: Date | null;
}

interface ServersClientProps {
  initialServers: ServerData[];
}

export function ServersClient({ initialServers }: ServersClientProps) {
  const [serversList, setServersList] = useState(initialServers);
  const [searchQuery, setSearchQuery] = useState("");
  const [protocolFilter, setProtocolFilter] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filteredServers = useMemo(() => {
    return serversList.filter((server) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !server.name.toLowerCase().includes(q) &&
          !server.address.toLowerCase().includes(q) &&
          !(server.groupName || "").toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      if (protocolFilter !== "all" && server.protocol !== protocolFilter) {
        return false;
      }

      if (showFavoritesOnly && !server.isFavorite) {
        return false;
      }

      return true;
    });
  }, [serversList, searchQuery, protocolFilter, showFavoritesOnly]);

  const toggleFavorite = async (id: number) => {
    const server = serversList.find((s) => s.id === id);
    if (!server) return;

    const newFav = !server.isFavorite;

    setServersList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isFavorite: newFav } : s))
    );

    await fetch(`/api/servers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isFavorite: newFav }),
    });
  };

  const deleteServer = async (id: number) => {
    await fetch(`/api/servers/${id}`, { method: "DELETE" });
    setServersList((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  };

  const copyUri = async (server: ServerData) => {
    if (server.rawUri) {
      await navigator.clipboard.writeText(server.rawUri);
    }
  };

  const testLatency = async (id: number) => {
    // Simulate latency test
    const latency = Math.floor(Math.random() * 200) + 20;
    
    setServersList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, latency } : s))
    );

    await fetch(`/api/servers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ latency }),
    });
  };

  const protocols = ["all", "vless", "vmess", "trojan", "ss"];
  const protocolLabels: Record<string, string> = {
    all: "الكل",
    vless: "VLESS",
    vmess: "VMess",
    trojan: "Trojan",
    ss: "SS",
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Server className="w-6 h-6 text-neon-purple" />
            السيرفرات
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {serversList.length} سيرفر • {filteredServers.length} ظاهر
          </p>
        </div>
        <Link
          href="/import"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-l from-neon-pink to-neon-purple text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-neon-pink/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          إضافة سيرفر
        </Link>
      </div>

      {/* Search & Filters */}
      <Card className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="البحث عن سيرفر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-xl pr-10 pl-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-purple/50 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={clsx(
              "px-4 py-2 rounded-xl border text-sm font-medium transition-all",
              showFavoritesOnly
                ? "bg-neon-yellow/10 border-neon-yellow/30 text-neon-yellow"
                : "bg-dark-bg border-dark-border text-text-muted hover:text-text-primary"
            )}
          >
            <Star className="w-4 h-4" />
          </button>
        </div>

        {/* Protocol Filter */}
        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-text-muted" />
          {protocols.map((p) => (
            <button
              key={p}
              onClick={() => setProtocolFilter(p)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                protocolFilter === p
                  ? p === "all"
                    ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/30"
                    : clsx("border", getProtocolBgColor(p))
                  : "bg-dark-bg text-text-muted hover:text-text-primary border border-transparent"
              )}
            >
              {protocolLabels[p]}
            </button>
          ))}
        </div>
      </Card>

      {/* Servers List */}
      {filteredServers.length > 0 ? (
        <div className="space-y-3">
          {filteredServers.map((server) => (
            <Card key={server.id} hover className="animate-slide-up">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <span
                      className={clsx(
                        "px-2 py-0.5 rounded text-xs font-bold border shrink-0",
                        getProtocolBgColor(server.protocol)
                      )}
                    >
                      {server.protocol.toUpperCase()}
                    </span>
                    <h3 className="font-bold text-sm truncate">{server.name}</h3>
                    {server.isActive && (
                      <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse shrink-0" />
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1" dir="ltr">
                      <Globe className="w-3 h-3" />
                      {server.address}:{server.port}
                    </span>
                    <span>{server.network?.toUpperCase() || "TCP"}</span>
                    <span>{server.security || "—"}</span>
                    {server.groupName && (
                      <span className="text-neon-purple">{server.groupName}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 mr-4">
                  {/* Latency */}
                  <button
                    onClick={() => testLatency(server.id)}
                    className={clsx(
                      "text-xs font-mono px-2 py-1 rounded-lg border border-dark-border hover:border-neon-purple/30 transition-colors",
                      getLatencyColor(server.latency)
                    )}
                    title="اختبار زمن الاستجابة"
                  >
                    <Zap className="w-3 h-3 inline ml-1" />
                    {server.latency ? `${server.latency}ms` : "فحص"}
                  </button>

                  {/* Favorite */}
                  <button
                    onClick={() => toggleFavorite(server.id)}
                    className="p-2 rounded-lg hover:bg-dark-bg transition-colors"
                    title={server.isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                  >
                    {server.isFavorite ? (
                      <Star className="w-4 h-4 text-neon-yellow fill-neon-yellow" />
                    ) : (
                      <StarOff className="w-4 h-4 text-text-muted" />
                    )}
                  </button>

                  {/* Copy */}
                  <button
                    onClick={() => copyUri(server)}
                    className="p-2 rounded-lg hover:bg-dark-bg transition-colors"
                    title="نسخ الرابط"
                  >
                    <Copy className="w-4 h-4 text-text-muted hover:text-neon-cyan" />
                  </button>

                  {/* Export */}
                  <Link
                    href={`/servers/${server.id}`}
                    className="p-2 rounded-lg hover:bg-dark-bg transition-colors"
                    title="تعديل"
                  >
                    <ExternalLink className="w-4 h-4 text-text-muted hover:text-neon-purple" />
                  </Link>

                  {/* Delete */}
                  {deleteConfirm === server.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => deleteServer(server.id)}
                        className="px-2 py-1 bg-neon-red/20 text-neon-red rounded text-xs font-medium"
                      >
                        تأكيد
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-2 py-1 bg-dark-bg text-text-muted rounded text-xs"
                      >
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(server.id)}
                      className="p-2 rounded-lg hover:bg-dark-bg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4 text-text-muted hover:text-neon-red" />
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <Server className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <p className="text-text-muted text-lg">لا توجد سيرفرات</p>
          <p className="text-text-muted text-sm mt-2">
            {searchQuery || protocolFilter !== "all"
              ? "لم يتم العثور على نتائج مطابقة"
              : "استورد ملف كونفج أو أضف سيرفراً يدوياً"}
          </p>
          <Link
            href="/import"
            className="inline-flex items-center gap-2 mt-4 px-6 py-2 bg-gradient-to-l from-neon-pink to-neon-purple text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            استيراد كونفج
          </Link>
        </Card>
      )}
    </div>
  );
}
