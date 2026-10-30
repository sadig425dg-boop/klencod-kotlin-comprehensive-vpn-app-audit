"use client";

import {
  BarChart3,
  Server,
  Star,
  Zap,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
} from "lucide-react";
import { Card, StatCard } from "./Card";
import { formatBytes, formatDuration } from "@/lib/utils";
import { getProtocolBgColor } from "@/lib/config-parser";
import { clsx } from "clsx";

interface StatisticsClientProps {
  overview: {
    totalServers: number;
    favoriteServers: number;
    totalConnections: number;
    totalUpload: number;
    totalDownload: number;
    totalDuration: number;
  };
  protocolDistribution: Array<{ protocol: string; count: number }>;
  dailyData: Array<{
    id: number;
    date: string;
    totalUpload: number | null;
    totalDownload: number | null;
    totalDuration: number | null;
    connectionsCount: number | null;
  }>;
}

export function StatisticsClient({ overview, protocolDistribution, dailyData }: StatisticsClientProps) {
  const maxDailyDownload = Math.max(
    ...dailyData.map((d) => d.totalDownload || 0),
    1
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-neon-cyan" />
          الإحصائيات
        </h1>
        <p className="text-text-muted text-sm mt-1">نظرة عامة على استخدام VPN</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="السيرفرات"
          value={overview.totalServers}
          icon={<Server className="w-5 h-5" />}
          color="text-neon-purple"
        />
        <StatCard
          label="المفضلة"
          value={overview.favoriteServers}
          icon={<Star className="w-5 h-5" />}
          color="text-neon-yellow"
        />
        <StatCard
          label="الاتصالات"
          value={overview.totalConnections}
          icon={<Zap className="w-5 h-5" />}
          color="text-neon-pink"
        />
        <StatCard
          label="مدة الاتصال الكلية"
          value={overview.totalDuration > 0 ? formatDuration(overview.totalDuration) : "0"}
          icon={<Clock className="w-5 h-5" />}
          color="text-neon-orange"
        />
      </div>

      {/* Data Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <ArrowDownCircle className="w-8 h-8 text-neon-green" />
            <div>
              <p className="text-text-muted text-sm">إجمالي التنزيل</p>
              <p className="text-3xl font-bold text-neon-green mt-1">
                {formatBytes(overview.totalDownload)}
              </p>
            </div>
          </div>
          <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-neon-green to-neon-cyan rounded-full transition-all duration-1000"
              style={{
                width: overview.totalDownload > 0 ? "100%" : "0%",
              }}
            />
          </div>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <ArrowUpCircle className="w-8 h-8 text-neon-cyan" />
            <div>
              <p className="text-text-muted text-sm">إجمالي الرفع</p>
              <p className="text-3xl font-bold text-neon-cyan mt-1">
                {formatBytes(overview.totalUpload)}
              </p>
            </div>
          </div>
          <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-neon-cyan to-neon-purple rounded-full transition-all duration-1000"
              style={{
                width: overview.totalUpload > 0 ? "100%" : "0%",
              }}
            />
          </div>
        </Card>
      </div>

      {/* Protocol Distribution */}
      <Card>
        <h3 className="font-bold flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-neon-purple" />
          توزيع البروتوكولات
        </h3>
        {protocolDistribution.length > 0 ? (
          <div className="space-y-3">
            {protocolDistribution.map((item) => {
              const percentage = overview.totalServers > 0
                ? Math.round((item.count / overview.totalServers) * 100)
                : 0;

              return (
                <div key={item.protocol} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span
                        className={clsx(
                          "px-2 py-0.5 rounded text-xs font-bold border",
                          getProtocolBgColor(item.protocol)
                        )}
                      >
                        {item.protocol.toUpperCase()}
                      </span>
                      <span className="text-text-secondary">{item.count} سيرفر</span>
                    </div>
                    <span className="text-text-muted">{percentage}%</span>
                  </div>
                  <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        "h-full rounded-full transition-all duration-1000",
                        item.protocol === "vless" && "bg-neon-purple",
                        item.protocol === "vmess" && "bg-neon-cyan",
                        item.protocol === "trojan" && "bg-neon-orange",
                        item.protocol === "ss" && "bg-neon-green"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-text-muted text-center py-8">لا توجد بيانات</p>
        )}
      </Card>

      {/* Daily Chart */}
      <Card>
        <h3 className="font-bold flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-neon-green" />
          الاستخدام اليومي
        </h3>
        {dailyData.length > 0 ? (
          <div className="flex items-end gap-1 h-48">
            {dailyData.map((day) => {
              const height = maxDailyDownload > 0
                ? ((day.totalDownload || 0) / maxDailyDownload) * 100
                : 0;

              return (
                <div
                  key={day.id}
                  className="flex-1 flex flex-col items-center gap-1"
                  title={`${day.date}: ${formatBytes(day.totalDownload || 0)}`}
                >
                  <div
                    className="w-full bg-gradient-to-t from-neon-purple to-neon-pink rounded-t-md transition-all duration-500 min-h-[2px]"
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                  <span className="text-[8px] text-text-muted rotate-[-45deg] origin-center whitespace-nowrap">
                    {day.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-text-muted text-center py-12">
            لا توجد بيانات يومية بعد
          </p>
        )}
      </Card>
    </div>
  );
}
