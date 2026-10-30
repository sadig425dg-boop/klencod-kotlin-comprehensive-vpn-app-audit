"use client";

import { useState } from "react";
import {
  ScrollText,
  Trash2,
  Wifi,
  WifiOff,
  AlertCircle,
  Clock,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { Card } from "./Card";
import { StatusBadge } from "./StatusBadge";
import { formatBytes, formatDate, formatDuration } from "@/lib/utils";
import { getProtocolBgColor } from "@/lib/config-parser";
import { clsx } from "clsx";

interface LogEntry {
  id: number;
  serverId: number | null;
  serverName: string | null;
  protocol: string | null;
  connectedAt: Date | null;
  disconnectedAt: Date | null;
  duration: number | null;
  uploadBytes: number | null;
  downloadBytes: number | null;
  status: string | null;
}

interface LogsClientProps {
  initialLogs: LogEntry[];
  totalCount: number;
}

export function LogsClient({ initialLogs, totalCount }: LogsClientProps) {
  const [logs, setLogs] = useState(initialLogs);
  const [clearing, setClearing] = useState(false);

  const clearLogs = async () => {
    if (!confirm("هل أنت متأكد من مسح جميع السجلات؟")) return;
    setClearing(true);

    try {
      await fetch("/api/logs", { method: "DELETE" });
      setLogs([]);
    } catch {
      // Error handling
    }

    setClearing(false);
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case "connected":
        return <Wifi className="w-4 h-4 text-neon-green" />;
      case "disconnected":
        return <WifiOff className="w-4 h-4 text-text-muted" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-neon-red" />;
      default:
        return <Wifi className="w-4 h-4 text-text-muted" />;
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-neon-yellow" />
            سجل الاتصالات
          </h1>
          <p className="text-text-muted text-sm mt-1">
            {totalCount} سجل إجمالي
          </p>
        </div>
        {logs.length > 0 && (
          <button
            onClick={clearLogs}
            disabled={clearing}
            className="flex items-center gap-2 px-4 py-2 bg-neon-red/10 border border-neon-red/20 text-neon-red rounded-xl text-sm font-medium hover:bg-neon-red/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            مسح السجلات
          </button>
        )}
      </div>

      {/* Logs */}
      {logs.length > 0 ? (
        <div className="space-y-3">
          {logs.map((log) => (
            <Card key={log.id} className="animate-slide-up">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(log.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm">{log.serverName || "غير معروف"}</h3>
                      {log.protocol && (
                        <span
                          className={clsx(
                            "px-2 py-0.5 rounded text-xs font-bold border",
                            getProtocolBgColor(log.protocol)
                          )}
                        >
                          {log.protocol.toUpperCase()}
                        </span>
                      )}
                      <StatusBadge
                        status={(log.status as "connected" | "disconnected" | "failed") || "disconnected"}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                      {log.connectedAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(log.connectedAt)}
                        </span>
                      )}
                      {log.duration && log.duration > 0 && (
                        <span>{formatDuration(log.duration)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs shrink-0">
                  <div className="text-left">
                    <div className="flex items-center gap-1 text-neon-green">
                      <ArrowDownCircle className="w-3 h-3" />
                      {formatBytes(log.downloadBytes || 0)}
                    </div>
                    <div className="flex items-center gap-1 text-neon-cyan mt-1">
                      <ArrowUpCircle className="w-3 h-3" />
                      {formatBytes(log.uploadBytes || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <ScrollText className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <p className="text-text-muted text-lg">لا توجد سجلات</p>
          <p className="text-text-muted text-sm mt-2">ستظهر هنا سجلات الاتصال بعد استخدام VPN</p>
        </Card>
      )}
    </div>
  );
}
