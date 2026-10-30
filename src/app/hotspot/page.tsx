"use client";

import { useState } from "react";
import {
  Wifi,
  WifiOff,
  Shield,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  Settings,
  Info,
  Zap,
} from "lucide-react";
import { Card, StatCard } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { clsx } from "clsx";

export default function HotspotPage() {
  const [hotspotEnabled, setHotspotEnabled] = useState(false);
  const [vpnRouting, setVpnRouting] = useState(true);
  const [shizukuStatus, setShizukuStatus] = useState<"connected" | "disconnected" | "not_installed">("disconnected");

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wifi className="w-6 h-6 text-neon-green" />
          مشاركة الشبكة (Hotspot)
        </h1>
        <p className="text-text-muted text-sm mt-1">
          مشاركة اتصال VPN مع الأجهزة الأخرى عبر نقطة الاتصال
        </p>
      </div>

      {/* Important Notice */}
      <Card className="border-neon-orange/30 bg-neon-orange/5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-neon-orange shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-neon-orange text-sm">ملاحظة مهمة</h3>
            <p className="text-text-secondary text-xs mt-1 leading-relaxed">
              هذه الميزة تتطلب بيئة Android حقيقية مع تثبيت تطبيق Shizuku وتفعيله.
              في بيئة الويب الحالية، يتم عرض واجهة الإدارة فقط كنموذج توضيحي.
              التشغيل الفعلي يتطلب تطبيق Android مع خدمة VPN وصلاحيات Shizuku.
            </p>
          </div>
        </div>
      </Card>

      {/* Shizuku Status */}
      <Card neon>
        <h3 className="font-bold flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-neon-purple" />
          حالة Shizuku
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dark-bg rounded-xl p-4">
            <p className="text-text-muted text-xs">حالة الخدمة</p>
            <div className="mt-2">
              <StatusBadge
                status={shizukuStatus === "connected" ? "connected" : "disconnected"}
                size="sm"
              />
            </div>
          </div>
          <div className="bg-dark-bg rounded-xl p-4">
            <p className="text-text-muted text-xs">الصلاحيات</p>
            <p className={clsx(
              "text-sm font-bold mt-1",
              shizukuStatus === "connected" ? "text-neon-green" : "text-text-muted"
            )}>
              {shizukuStatus === "connected" ? "متصل ومفعّل (UID 2000)" : "غير مفعّل"}
            </p>
          </div>
          <div className="bg-dark-bg rounded-xl p-4">
            <p className="text-text-muted text-xs">التوافق</p>
            <p className="text-sm font-bold mt-1 text-neon-yellow">
              يتطلب Android 11+
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => setShizukuStatus(shizukuStatus === "connected" ? "disconnected" : "connected")}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              shizukuStatus === "connected"
                ? "bg-neon-green/10 border border-neon-green/30 text-neon-green"
                : "bg-gradient-to-l from-neon-pink to-neon-purple text-white"
            )}
          >
            <Zap className="w-4 h-4" />
            {shizukuStatus === "connected" ? "متصل" : "فحص الاتصال"}
          </button>
        </div>
      </Card>

      {/* Hotspot Control */}
      <Card>
        <h3 className="font-bold flex items-center gap-2 mb-4">
          <Wifi className="w-5 h-5 text-neon-green" />
          التحكم بنقطة الاتصال
        </h3>

        <div className="space-y-4">
          {/* Main Toggle */}
          <div className="flex items-center justify-between bg-dark-bg rounded-xl p-4">
            <div className="flex items-center gap-3">
              {hotspotEnabled ? (
                <Wifi className="w-6 h-6 text-neon-green" />
              ) : (
                <WifiOff className="w-6 h-6 text-text-muted" />
              )}
              <div>
                <p className="font-bold text-sm">مشاركة نقطة الاتصال</p>
                <p className="text-xs text-text-muted">
                  {hotspotEnabled ? "نقطة الاتصال مفعّلة" : "نقطة الاتصال معطّلة"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setHotspotEnabled(!hotspotEnabled)}
              className={clsx(
                "relative w-14 h-7 rounded-full transition-all duration-300",
                hotspotEnabled ? "bg-neon-green" : "bg-dark-border"
              )}
            >
              <span
                className={clsx(
                  "absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all duration-300",
                  hotspotEnabled ? "left-0.5" : "left-7.5"
                )}
              />
            </button>
          </div>

          {/* VPN Routing Toggle */}
          <div className="flex items-center justify-between bg-dark-bg rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-neon-purple" />
              <div>
                <p className="font-bold text-sm">توجيه VPN</p>
                <p className="text-xs text-text-muted">
                  توجيه حركة الأجهزة المتصلة عبر VPN
                </p>
              </div>
            </div>
            <button
              onClick={() => setVpnRouting(!vpnRouting)}
              className={clsx(
                "relative w-14 h-7 rounded-full transition-all duration-300",
                vpnRouting ? "bg-neon-purple" : "bg-dark-border"
              )}
            >
              <span
                className={clsx(
                  "absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all duration-300",
                  vpnRouting ? "left-0.5" : "left-7.5"
                )}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Stats when hotspot is enabled */}
      {hotspotEnabled && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
          <StatCard
            label="الأجهزة المتصلة"
            value="0"
            icon={<Smartphone className="w-5 h-5" />}
            color="text-neon-cyan"
            subtitle="يتطلب بيئة Android"
          />
          <StatCard
            label="حالة التوجيه"
            value={vpnRouting ? "عبر VPN" : "مباشر"}
            icon={<Shield className="w-5 h-5" />}
            color={vpnRouting ? "text-neon-green" : "text-text-muted"}
          />
          <StatCard
            label="حالة TUN"
            value="غير متاح"
            icon={<Settings className="w-5 h-5" />}
            color="text-text-muted"
            subtitle="يتطلب بيئة Android"
          />
          <StatCard
            label="Datapath"
            value="غير متاح"
            icon={<Zap className="w-5 h-5" />}
            color="text-text-muted"
            subtitle="يتطلب بيئة Android"
          />
        </div>
      )}

      {/* Requirements Info */}
      <Card>
        <h3 className="font-bold flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-neon-cyan" />
          متطلبات تشغيل المشاركة
        </h3>
        <div className="space-y-3">
          {[
            { label: "تطبيق Shizuku مثبت ومفعّل", status: shizukuStatus === "connected" },
            { label: "خدمة VPN تعمل", status: false },
            { label: "سيرفر نشط ومتصل", status: false },
            { label: "صلاحيات Android مناسبة", status: false },
            { label: "Android 11 أو أحدث", status: true },
          ].map((req, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <CheckCircle2
                className={clsx(
                  "w-4 h-4 shrink-0",
                  req.status ? "text-neon-green" : "text-text-muted"
                )}
              />
              <span className={req.status ? "text-text-primary" : "text-text-muted"}>
                {req.label}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
