"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Server,
  Save,
  ArrowRight,
  Copy,
  FileJson,
  Shield,
} from "lucide-react";
import { Card } from "./Card";
import { getProtocolBgColor, generateXrayConfig } from "@/lib/config-parser";
import { clsx } from "clsx";

interface ServerData {
  id: number;
  name: string;
  protocol: string;
  address: string;
  port: number;
  uuid: string | null;
  encryption: string | null;
  security: string | null;
  network: string | null;
  path: string | null;
  host: string | null;
  sni: string | null;
  fingerprint: string | null;
  flow: string | null;
  alpn: string | null;
  publicKey: string | null;
  shortId: string | null;
  serviceName: string | null;
  method: string | null;
  rawUri: string | null;
  groupName: string | null;
  isFavorite: boolean | null;
}

interface ServerDetailClientProps {
  server: ServerData;
}

export function ServerDetailClient({ server }: ServerDetailClientProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: server.name,
    protocol: server.protocol,
    address: server.address,
    port: server.port,
    uuid: server.uuid || "",
    encryption: server.encryption || "none",
    security: server.security || "none",
    network: server.network || "tcp",
    path: server.path || "",
    host: server.host || "",
    sni: server.sni || "",
    fingerprint: server.fingerprint || "",
    flow: server.flow || "",
    alpn: server.alpn || "",
    publicKey: server.publicKey || "",
    shortId: server.shortId || "",
    serviceName: server.serviceName || "",
    method: server.method || "",
    groupName: server.groupName || "",
  });
  const [saving, setSaving] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/servers/${server.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rawUri: server.rawUri,
          isFavorite: server.isFavorite,
        }),
      });

      if (res.ok) {
        setMessage("تم الحفظ بنجاح");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("فشل في الحفظ");
      }
    } catch {
      setMessage("حدث خطأ");
    }
    setSaving(false);
  };

  const xrayConfig = generateXrayConfig({
    ...form,
    rawUri: server.rawUri || "",
  });

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(xrayConfig, null, 2));
    setMessage("تم نسخ إعدادات JSON");
    setTimeout(() => setMessage(""), 3000);
  };

  const updateField = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const inputClass =
    "w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-purple/50 transition-colors";
  const labelClass = "text-sm text-text-muted mb-1 block";

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/servers")}
            className="p-2 rounded-lg bg-dark-card border border-dark-border hover:bg-dark-card-hover transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Server className="w-6 h-6 text-neon-purple" />
              تعديل السيرفر
            </h1>
            <p className="text-text-muted text-sm mt-1">{server.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {message && (
            <span className="text-sm text-neon-green animate-fade-in">{message}</span>
          )}
          <button
            onClick={() => setShowJson(!showJson)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all",
              showJson
                ? "bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan"
                : "bg-dark-card border-dark-border text-text-muted hover:text-text-primary"
            )}
          >
            <FileJson className="w-4 h-4" />
            JSON
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-l from-neon-pink to-neon-purple text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-neon-pink/20 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>
      </div>

      {showJson ? (
        /* JSON View */
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <FileJson className="w-5 h-5 text-neon-cyan" />
              إعدادات Xray/V2Ray (JSON)
            </h3>
            <button
              onClick={copyJson}
              className="flex items-center gap-2 px-3 py-1.5 bg-dark-bg border border-dark-border rounded-lg text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              <Copy className="w-3 h-3" />
              نسخ
            </button>
          </div>
          <pre
            className="bg-dark-bg rounded-xl p-4 text-xs font-mono text-neon-green overflow-auto max-h-[500px] border border-dark-border"
            dir="ltr"
          >
            {JSON.stringify(xrayConfig, null, 2)}
          </pre>
        </Card>
      ) : (
        /* Edit Form */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card>
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-neon-purple" />
              المعلومات الأساسية
            </h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>اسم السيرفر</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>البروتوكول</label>
                <div className="flex gap-2">
                  {["vless", "vmess", "trojan", "ss"].map((p) => (
                    <button
                      key={p}
                      onClick={() => updateField("protocol", p)}
                      className={clsx(
                        "px-3 py-2 rounded-xl text-xs font-bold border transition-all",
                        form.protocol === p
                          ? getProtocolBgColor(p)
                          : "bg-dark-bg border-dark-border text-text-muted"
                      )}
                    >
                      {p.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className={labelClass}>العنوان</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className={inputClass}
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className={labelClass}>المنفذ</label>
                  <input
                    type="number"
                    value={form.port}
                    onChange={(e) => updateField("port", parseInt(e.target.value) || 0)}
                    className={inputClass}
                    dir="ltr"
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>
                  {form.protocol === "ss" ? "كلمة المرور" : form.protocol === "trojan" ? "كلمة المرور" : "UUID"}
                </label>
                <input
                  type="text"
                  value={form.uuid}
                  onChange={(e) => updateField("uuid", e.target.value)}
                  className={inputClass}
                  dir="ltr"
                />
              </div>
              <div>
                <label className={labelClass}>المجموعة</label>
                <input
                  type="text"
                  value={form.groupName}
                  onChange={(e) => updateField("groupName", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </Card>

          {/* Connection Settings */}
          <Card>
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Server className="w-5 h-5 text-neon-cyan" />
              إعدادات الاتصال
            </h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>نوع الشبكة</label>
                <select
                  value={form.network}
                  onChange={(e) => updateField("network", e.target.value)}
                  className={inputClass}
                >
                  <option value="tcp">TCP</option>
                  <option value="ws">WebSocket</option>
                  <option value="grpc">gRPC</option>
                  <option value="h2">HTTP/2</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>الحماية</label>
                <select
                  value={form.security}
                  onChange={(e) => updateField("security", e.target.value)}
                  className={inputClass}
                >
                  <option value="none">بدون</option>
                  <option value="tls">TLS</option>
                  <option value="reality">Reality</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>التشفير</label>
                <input
                  type="text"
                  value={form.encryption}
                  onChange={(e) => updateField("encryption", e.target.value)}
                  className={inputClass}
                  dir="ltr"
                />
              </div>

              {(form.network === "ws" || form.network === "h2") && (
                <div>
                  <label className={labelClass}>المسار (Path)</label>
                  <input
                    type="text"
                    value={form.path}
                    onChange={(e) => updateField("path", e.target.value)}
                    className={inputClass}
                    dir="ltr"
                  />
                </div>
              )}

              {form.network === "grpc" && (
                <div>
                  <label className={labelClass}>اسم الخدمة (Service Name)</label>
                  <input
                    type="text"
                    value={form.serviceName}
                    onChange={(e) => updateField("serviceName", e.target.value)}
                    className={inputClass}
                    dir="ltr"
                  />
                </div>
              )}

              <div>
                <label className={labelClass}>Host</label>
                <input
                  type="text"
                  value={form.host}
                  onChange={(e) => updateField("host", e.target.value)}
                  className={inputClass}
                  dir="ltr"
                />
              </div>
              <div>
                <label className={labelClass}>SNI</label>
                <input
                  type="text"
                  value={form.sni}
                  onChange={(e) => updateField("sni", e.target.value)}
                  className={inputClass}
                  dir="ltr"
                />
              </div>
              <div>
                <label className={labelClass}>Fingerprint</label>
                <input
                  type="text"
                  value={form.fingerprint}
                  onChange={(e) => updateField("fingerprint", e.target.value)}
                  className={inputClass}
                  dir="ltr"
                />
              </div>
              <div>
                <label className={labelClass}>Flow</label>
                <input
                  type="text"
                  value={form.flow}
                  onChange={(e) => updateField("flow", e.target.value)}
                  className={inputClass}
                  dir="ltr"
                />
              </div>
              <div>
                <label className={labelClass}>ALPN</label>
                <input
                  type="text"
                  value={form.alpn}
                  onChange={(e) => updateField("alpn", e.target.value)}
                  className={inputClass}
                  dir="ltr"
                />
              </div>

              {form.security === "reality" && (
                <>
                  <div>
                    <label className={labelClass}>Public Key</label>
                    <input
                      type="text"
                      value={form.publicKey}
                      onChange={(e) => updateField("publicKey", e.target.value)}
                      className={inputClass}
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Short ID</label>
                    <input
                      type="text"
                      value={form.shortId}
                      onChange={(e) => updateField("shortId", e.target.value)}
                      className={inputClass}
                      dir="ltr"
                    />
                  </div>
                </>
              )}

              {form.protocol === "ss" && (
                <div>
                  <label className={labelClass}>طريقة التشفير (Method)</label>
                  <select
                    value={form.method}
                    onChange={(e) => updateField("method", e.target.value)}
                    className={inputClass}
                  >
                    <option value="aes-256-gcm">AES-256-GCM</option>
                    <option value="aes-128-gcm">AES-128-GCM</option>
                    <option value="chacha20-poly1305">ChaCha20-Poly1305</option>
                    <option value="2022-blake3-aes-256-gcm">2022-Blake3-AES-256-GCM</option>
                    <option value="2022-blake3-chacha20-poly1305">2022-Blake3-ChaCha20-Poly1305</option>
                  </select>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
