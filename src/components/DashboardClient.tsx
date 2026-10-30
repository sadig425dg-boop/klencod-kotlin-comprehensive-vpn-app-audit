"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Shield,
  Server,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  Zap,
  Star,
  Wifi,
  Activity,
  Globe,
} from "lucide-react";
import { Card, StatCard } from "./Card";
import { ConnectionRing } from "./ConnectionRing";
import { StatusBadge } from "./StatusBadge";
import { formatBytes, formatTimeDuration, getLatencyColor } from "@/lib/utils";
import { getProtocolBgColor } from "@/lib/config-parser";
import { clsx } from "clsx";

interface ServerData {
  id: number;
  name: string;
  protocol: string;
  address: string;
  port: number;
  latency: number | null;
  isActive: boolean | null;
  isFavorite: boolean | null;
  network: string | null;
  security: string | null;
}

interface LogData {
  id: number;
  serverName: string | null;
  protocol: string | null;
  status: string | null;
  connectedAt: Date | null;
  duration: number | null;
  uploadBytes: number | null;
  downloadBytes: number | null;
}

interface DashboardProps {
  activeServer: ServerData | null;
  serverCount: number;
  favoriteServers: ServerData[];
  stats: {
    totalUpload: number;
    totalDownload: number;
    totalDuration: number;
    totalConnections: number;
  };
  recentLogs: LogData[];
}

export function DashboardClient({
  activeServer,
  serverCount,
  favoriteServers,
  stats,
  recentLogs,
}: DashboardProps) {
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "connecting">(
    activeServer ? "connected" : "disconnected"
  );
  const [timer, setTimer] = useState(0);
  const [currentUpload, setCurrentUpload] = useState(0);
  const [currentDownload, setCurrentDownload] = useState(0);

  // Simulate timer when connected
  useEffect(() => {
    if (connectionStatus !== "connected") return;
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [connectionStatus]);

  const handleConnect = useCallback(async () => {
    if (connectionStatus === "connected") {
      // Disconnect
      if (activeServer) {
        await fetch(`/api/servers/${activeServer.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: false }),
        });

        // Log connection
        await fetch("/api/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            serverId: activeServer.id,
            serverName: activeServer.name,
            protocol: activeServer.protocol,
            status: "disconnected",
            duration: timer,
            uploadBytes: currentUpload,
            downloadBytes: currentDownload,
          }),
        });
      }
      setConnectionStatus("disconnected");
      setTimer(0);
      setCurrentUpload(0);
      setCurrentDownload(0);
    } else {
      // Connect
      if (!activeServer && favoriteServers.length === 0) {
        return;
      }

      setConnectionStatus("connecting");

      // Simulate connection delay
      setTimeout(async () => {
        const serverId = activeServer?.id || favoriteServers[0]?.id;
        if (serverId) {
          await fetch(`/api/servers/${serverId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: true }),
          });
        }
        setConnectionStatus("connected");
        setTimer(0);
      }, 2000);
    }
  }, [connectionStatus, activeServer, favoriteServers, timer, currentUpload, currentDownload]);

  // Simulate traffic when connected
  useEffect(() => {
    if (connectionStatus !== "connected") return;
    const interval = setInterval(() => {
      setCurrentUpload((prev) => prev + Math.floor(Math.random() * 5000));
      setCurrentDownload((prev) => prev + Math.floor(Math.random() * 15000));
    }, 1000);
    return () => clearInterval(interval);
  }, [connectionStatus]);

  const currentServer = activeServer || favoriteServers[0];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-text-muted text-sm mt-1">إدارة اتصالات VPN و V2Ray/Xray</p>
        </div>
        <StatusBadge status={connectionStatus} size="lg" />
      </div>

      {/* Connection Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connection Ring */}
        <Card className="lg:col-span-1 flex flex-col items-center justify-center py-8" neon={connectionStatus === "connected"}>
          <ConnectionRing status={connectionStatus} size={180} />

          {/* Timer */}
          {connectionStatus === "connected" && (
            <div className="mt-4 text-center">
              <p className="text-3xl font-mono font-bold text-text-primary">
                {formatTimeDuration(timer)}
              </p>
              <p className="text-text-muted text-sm mt-1">مدة الاتصال</p>
            </div>
          )}

          {/* Connect Button */}
          <button
            onClick={handleConnect}
            disabled={connectionStatus === "connecting" || (!currentServer && connectionStatus === "disconnected")}
            className={clsx(
              "mt-6 px-8 py-3 rounded-2xl font-bold text-base transition-all duration-300 w-48",
              connectionStatus === "connected"
                ? "bg-gradient-to-l from-neon-red to-neon-orange text-white hover:shadow-lg hover:shadow-neon-red/20"
                : connectionStatus === "connecting"
                ? "bg-dark-border text-neon-yellow cursor-wait"
                : "bg-gradient-to-l from-neon-pink to-neon-purple text-white hover:shadow-lg hover:shadow-neon-pink/30 disabled:opacity-50"
            )}
          >
            {connectionStatus === "connected"
              ? "إيقاف VPN"
              : connectionStatus === "connecting"
              ? "جاري الاتصال..."
              : "اتصال"}
          </button>

          {!currentServer && connectionStatus === "disconnected" && (
            <p className="text-neon-orange text-xs mt-2">يرجى إضافة سيرفر أولاً</p>
          )}
        </Card>

        {/* Server Info */}
        <Card className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Server className="w-5 h-5 text-neon-purple" />
            معلومات السيرفر
          </h3>

          {currentServer ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-dark-bg rounded-xl p-4">
                  <p className="text-text-muted text-xs">اسم السيرفر</p>
                  <p className="text-sm font-bold mt-1 truncate">{currentServer.name}</p>
                </div>
                <div className="bg-dark-bg rounded-xl p-4">
                  <p className="text-text-muted text-xs">البروتوكول</p>
                  <div className="mt-1">
                    <span className={clsx(
                      "px-2 py-0.5 rounded-md text-xs font-bold border",
                      getProtocolBgColor(currentServer.protocol)
                    )}>
                      {currentServer.protocol.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="bg-dark-bg rounded-xl p-4">
                  <p className="text-text-muted text-xs">العنوان</p>
                  <p className="text-sm font-mono mt-1 truncate" dir="ltr">{currentServer.address}:{currentServer.port}</p>
                </div>
                <div className="bg-dark-bg rounded-xl p-4">
                  <p className="text-text-muted text-xs">زمن الاستجابة</p>
                  <p className={clsx("text-sm font-bold mt-1", getLatencyColor(currentServer.latency))}>
                    {currentServer.latency ? `${currentServer.latency} ms` : "غير مختبر"}
                  </p>
                </div>
                <div className="bg-dark-bg rounded-xl p-4">
                  <p className="text-text-muted text-xs">الشبكة</p>
                  <p className="text-sm font-bold mt-1">{currentServer.network || "TCP"}</p>
                </div>
                <div className="bg-dark-bg rounded-xl p-4">
                  <p className="text-text-muted text-xs">الحماية</p>
                  <p className="text-sm font-bold mt-1">{currentServer.security || "بدون"}</p>
                </div>
              </div>

              {/* Live Traffic */}
              {connectionStatus === "connected" && (
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-gradient-to-l from-neon-green/5 to-transparent rounded-xl p-4 border border-neon-green/10">
                    <div className="flex items-center gap-2">
                      <ArrowDownCircle className="w-4 h-4 text-neon-green" />
                      <p className="text-text-muted text-xs">سرعة التنزيل</p>
                    </div>
                    <p className="text-lg font-bold text-neon-green mt-1">
                      {formatBytes(currentDownload)}/s
                    </p>
                  </div>
                  <div className="bg-gradient-to-l from-neon-cyan/5 to-transparent rounded-xl p-4 border border-neon-cyan/10">
                    <div className="flex items-center gap-2">
                      <ArrowUpCircle className="w-4 h-4 text-neon-cyan" />
                      <p className="text-text-muted text-xs">سرعة الرفع</p>
                    </div>
                    <p className="text-lg font-bold text-neon-cyan mt-1">
                      {formatBytes(currentUpload)}/s
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Globe className="w-16 h-16 text-text-muted mb-4" />
              <p className="text-text-muted">لا يوجد سيرفر نشط</p>
              <p className="text-text-muted text-sm mt-1">أضف سيرفراً من صفحة &quot;السيرفرات&quot; أو &quot;استيراد كونفج&quot;</p>
            </div>
          )}
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="السيرفرات"
          value={serverCount}
          icon={<Server className="w-5 h-5" />}
          color="text-neon-purple"
        />
        <StatCard
          label="إجمالي التنزيل"
          value={formatBytes(stats.totalDownload + currentDownload)}
          icon={<ArrowDownCircle className="w-5 h-5" />}
          color="text-neon-green"
        />
        <StatCard
          label="إجمالي الرفع"
          value={formatBytes(stats.totalUpload + currentUpload)}
          icon={<ArrowUpCircle className="w-5 h-5" />}
          color="text-neon-cyan"
        />
        <StatCard
          label="عدد الاتصالات"
          value={stats.totalConnections}
          icon={<Zap className="w-5 h-5" />}
          color="text-neon-pink"
        />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Favorite Servers */}
        <Card>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-neon-yellow" />
            السيرفرات المفضلة
          </h3>
          {favoriteServers.length > 0 ? (
            <div className="space-y-2">
              {favoriteServers.map((server) => (
                <div
                  key={server.id}
                  className="flex items-center justify-between bg-dark-bg rounded-xl p-3 hover:bg-dark-card-hover transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className={clsx(
                      "px-2 py-0.5 rounded text-xs font-bold border",
                      getProtocolBgColor(server.protocol)
                    )}>
                      {server.protocol.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium truncate max-w-48">{server.name}</span>
                  </div>
                  <span className={clsx("text-sm font-mono", getLatencyColor(server.latency))}>
                    {server.latency ? `${server.latency} ms` : "—"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="w-10 h-10 text-text-muted mx-auto mb-2" />
              <p className="text-text-muted text-sm">لا توجد سيرفرات مفضلة</p>
            </div>
          )}
        </Card>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-neon-pink" />
            النشاط الأخير
          </h3>
          {recentLogs.length > 0 ? (
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between bg-dark-bg rounded-xl p-3"
                >
                  <div className="flex items-center gap-3">
                    <Wifi className={clsx(
                      "w-4 h-4",
                      log.status === "connected" ? "text-neon-green" : "text-text-muted"
                    )} />
                    <div>
                      <p className="text-sm font-medium">{log.serverName || "غير معروف"}</p>
                      <p className="text-xs text-text-muted">
                        {log.protocol?.toUpperCase()} • {log.duration ? `${Math.floor(log.duration / 60)} دقيقة` : "—"}
                      </p>
                    </div>
                  </div>
                  <StatusBadge
                    status={log.status as "connected" | "disconnected" | "failed" || "disconnected"}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-10 h-10 text-text-muted mx-auto mb-2" />
              <p className="text-text-muted text-sm">لا يوجد نشاط حتى الآن</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
