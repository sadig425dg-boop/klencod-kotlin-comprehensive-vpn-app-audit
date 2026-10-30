"use client";

import { useState } from "react";
import {
  Settings,
  Globe,
  Shield,
  Palette,
  Bell,
  Database,
  Info,
  Save,
  RotateCcw,
} from "lucide-react";
import { Card } from "@/components/Card";
import { clsx } from "clsx";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    autoConnect: false,
    killSwitch: true,
    splitTunneling: false,
    ipv6: true,
    dns: "1.1.1.1",
    mtu: 1500,
    logLevel: "warning",
    autoUpdateSubs: true,
    updateInterval: 60,
    notifications: true,
    theme: "dark",
  });
  const [saved, setSaved] = useState(false);

  const updateSetting = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleClass = (enabled: boolean) =>
    clsx(
      "relative w-14 h-7 rounded-full transition-all duration-300 shrink-0",
      enabled ? "bg-neon-purple" : "bg-dark-border"
    );

  const toggleDotClass = (enabled: boolean) =>
    clsx(
      "absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all duration-300",
      enabled ? "left-0.5" : "left-7.5"
    );

  const inputClass =
    "w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-neon-purple/50 transition-colors";

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6 text-text-secondary" />
            الإعدادات
          </h1>
          <p className="text-text-muted text-sm mt-1">إعدادات التطبيق والاتصال</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-neon-green animate-fade-in">تم الحفظ ✓</span>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-l from-neon-pink to-neon-purple text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            حفظ الإعدادات
          </button>
        </div>
      </div>

      {/* VPN Settings */}
      <Card>
        <h3 className="font-bold flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-neon-purple" />
          إعدادات VPN
        </h3>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">الاتصال التلقائي</p>
              <p className="text-xs text-text-muted mt-0.5">الاتصال تلقائياً عند فتح التطبيق</p>
            </div>
            <button
              className={toggleClass(settings.autoConnect)}
              onClick={() => updateSetting("autoConnect", !settings.autoConnect)}
            >
              <span className={toggleDotClass(settings.autoConnect)} />
            </button>
          </div>

          <div className="border-t border-dark-border" />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Kill Switch</p>
              <p className="text-xs text-text-muted mt-0.5">قطع الإنترنت عند انقطاع VPN</p>
            </div>
            <button
              className={toggleClass(settings.killSwitch)}
              onClick={() => updateSetting("killSwitch", !settings.killSwitch)}
            >
              <span className={toggleDotClass(settings.killSwitch)} />
            </button>
          </div>

          <div className="border-t border-dark-border" />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">تقسيم النفق (Split Tunneling)</p>
              <p className="text-xs text-text-muted mt-0.5">استثناء تطبيقات معينة من VPN</p>
            </div>
            <button
              className={toggleClass(settings.splitTunneling)}
              onClick={() => updateSetting("splitTunneling", !settings.splitTunneling)}
            >
              <span className={toggleDotClass(settings.splitTunneling)} />
            </button>
          </div>

          <div className="border-t border-dark-border" />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">دعم IPv6</p>
              <p className="text-xs text-text-muted mt-0.5">تفعيل توجيه IPv6 عبر VPN</p>
            </div>
            <button
              className={toggleClass(settings.ipv6)}
              onClick={() => updateSetting("ipv6", !settings.ipv6)}
            >
              <span className={toggleDotClass(settings.ipv6)} />
            </button>
          </div>
        </div>
      </Card>

      {/* Network Settings */}
      <Card>
        <h3 className="font-bold flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-neon-cyan" />
          إعدادات الشبكة
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-muted mb-1 block">خادم DNS</label>
            <input
              type="text"
              value={settings.dns}
              onChange={(e) => updateSetting("dns", e.target.value)}
              className={inputClass}
              dir="ltr"
            />
          </div>
          <div>
            <label className="text-sm text-text-muted mb-1 block">MTU</label>
            <input
              type="number"
              value={settings.mtu}
              onChange={(e) => updateSetting("mtu", parseInt(e.target.value) || 1500)}
              className={inputClass}
              dir="ltr"
            />
          </div>
          <div>
            <label className="text-sm text-text-muted mb-1 block">مستوى السجلات</label>
            <select
              value={settings.logLevel}
              onChange={(e) => updateSetting("logLevel", e.target.value)}
              className={inputClass}
            >
              <option value="none">بدون سجلات</option>
              <option value="error">أخطاء فقط</option>
              <option value="warning">تحذيرات</option>
              <option value="info">معلومات</option>
              <option value="debug">تصحيح</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Subscription Settings */}
      <Card>
        <h3 className="font-bold flex items-center gap-2 mb-6">
          <Database className="w-5 h-5 text-neon-orange" />
          إعدادات الاشتراكات
        </h3>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">التحديث التلقائي</p>
              <p className="text-xs text-text-muted mt-0.5">تحديث الاشتراكات تلقائياً</p>
            </div>
            <button
              className={toggleClass(settings.autoUpdateSubs)}
              onClick={() => updateSetting("autoUpdateSubs", !settings.autoUpdateSubs)}
            >
              <span className={toggleDotClass(settings.autoUpdateSubs)} />
            </button>
          </div>

          {settings.autoUpdateSubs && (
            <div>
              <label className="text-sm text-text-muted mb-1 block">فترة التحديث (بالدقائق)</label>
              <input
                type="number"
                value={settings.updateInterval}
                onChange={(e) => updateSetting("updateInterval", parseInt(e.target.value) || 60)}
                className={inputClass}
                dir="ltr"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Appearance */}
      <Card>
        <h3 className="font-bold flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-neon-pink" />
          المظهر
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-text-muted mb-2 block">السمة</label>
            <div className="flex gap-3">
              {[
                { value: "dark", label: "داكن", color: "bg-dark-bg" },
                { value: "dark-pink", label: "داكن وردي", color: "bg-neon-pink" },
                { value: "dark-purple", label: "داكن بنفسجي", color: "bg-neon-purple" },
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => updateSetting("theme", theme.value)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all",
                    settings.theme === theme.value
                      ? "border-neon-purple/50 bg-neon-purple/10 text-text-primary"
                      : "border-dark-border bg-dark-bg text-text-muted hover:text-text-primary"
                  )}
                >
                  <span className={clsx("w-3 h-3 rounded-full", theme.color)} />
                  {theme.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <h3 className="font-bold flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-neon-yellow" />
          الإشعارات
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">إشعارات الاتصال</p>
            <p className="text-xs text-text-muted mt-0.5">إظهار إشعار عند الاتصال والانقطاع</p>
          </div>
          <button
            className={toggleClass(settings.notifications)}
            onClick={() => updateSetting("notifications", !settings.notifications)}
          >
            <span className={toggleDotClass(settings.notifications)} />
          </button>
        </div>
      </Card>

      {/* Reset */}
      <Card>
        <h3 className="font-bold flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-neon-red" />
          إعادة ضبط
        </h3>
        <button
          onClick={() => {
            if (confirm("هل أنت متأكد من إعادة ضبط جميع الإعدادات؟")) {
              setSettings({
                autoConnect: false,
                killSwitch: true,
                splitTunneling: false,
                ipv6: true,
                dns: "1.1.1.1",
                mtu: 1500,
                logLevel: "warning",
                autoUpdateSubs: true,
                updateInterval: 60,
                notifications: true,
                theme: "dark",
              });
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-neon-red/10 border border-neon-red/20 text-neon-red rounded-xl text-sm font-medium hover:bg-neon-red/20 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          إعادة ضبط الإعدادات
        </button>
      </Card>
    </div>
  );
}
