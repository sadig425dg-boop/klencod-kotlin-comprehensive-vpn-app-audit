"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileDown,
  Link2,
  ClipboardPaste,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Server,
} from "lucide-react";
import { Card } from "@/components/Card";
import { getProtocolBgColor } from "@/lib/config-parser";
import { clsx } from "clsx";

interface ImportResult {
  imported: number;
  duplicates: number;
  duplicateNames: string[];
  servers: Array<{
    id: number;
    name: string;
    protocol: string;
    address: string;
    port: number;
  }>;
}

export default function ImportPage() {
  const router = useRouter();
  const [configText, setConfigText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState("");

  const handleImport = async () => {
    if (!configText.trim()) {
      setError("يرجى إدخال رابط أو نص الإعدادات");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/servers/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ configs: configText }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "حدث خطأ أثناء الاستيراد");
      } else {
        setResult(data);
        if (data.imported > 0) {
          setConfigText("");
        }
      }
    } catch {
      setError("فشل في الاتصال بالخادم");
    }

    setLoading(false);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setConfigText(text);
    } catch {
      setError("لم يتم السماح بقراءة الحافظة");
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileDown className="w-6 h-6 text-neon-pink" />
          استيراد كونفج
        </h1>
        <p className="text-text-muted text-sm mt-1">
          استيراد إعدادات V2Ray/Xray من روابط أو نصوص
        </p>
      </div>

      {/* Supported Formats */}
      <Card>
        <h3 className="font-bold mb-3">الصيغ المدعومة</h3>
        <div className="flex flex-wrap gap-2">
          {["vless://", "vmess://", "trojan://", "ss://", "رابط اشتراك", "JSON"].map((format) => (
            <span
              key={format}
              className="px-3 py-1 bg-dark-bg border border-dark-border rounded-lg text-xs text-text-secondary"
            >
              {format}
            </span>
          ))}
        </div>
      </Card>

      {/* Import Form */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <Link2 className="w-5 h-5 text-neon-purple" />
            إدراج الإعدادات
          </h3>
          <button
            onClick={handlePaste}
            className="flex items-center gap-2 px-3 py-1.5 bg-dark-bg border border-dark-border rounded-lg text-xs text-text-muted hover:text-text-primary transition-colors"
          >
            <ClipboardPaste className="w-3 h-3" />
            لصق من الحافظة
          </button>
        </div>

        <textarea
          value={configText}
          onChange={(e) => {
            setConfigText(e.target.value);
            setError("");
          }}
          placeholder={`الصق هنا رابط أو روابط الإعدادات...\n\nأمثلة:\nvless://uuid@server:port?params#name\nvmess://base64encoded\ntrojan://password@server:port#name\nss://base64@server:port#name\n\nأو رابط اشتراك:\nhttps://example.com/subscription`}
          className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-purple/50 transition-colors min-h-[200px] font-mono resize-y"
          dir="ltr"
        />

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 bg-neon-red/10 border border-neon-red/20 rounded-xl p-3 text-neon-red text-sm animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Import Button */}
        <button
          onClick={handleImport}
          disabled={loading || !configText.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-l from-neon-pink to-neon-purple text-white rounded-xl font-bold text-base hover:shadow-lg hover:shadow-neon-pink/20 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              جاري الاستيراد...
            </>
          ) : (
            <>
              <FileDown className="w-5 h-5" />
              استيراد
            </>
          )}
        </button>
      </Card>

      {/* Results */}
      {result && (
        <Card className="animate-slide-up">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-neon-green" />
            <h3 className="font-bold">نتائج الاستيراد</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-neon-green/10 border border-neon-green/20 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-neon-green">{result.imported}</p>
              <p className="text-sm text-text-muted mt-1">تم استيرادها</p>
            </div>
            <div className="bg-neon-yellow/10 border border-neon-yellow/20 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-neon-yellow">{result.duplicates}</p>
              <p className="text-sm text-text-muted mt-1">مكررة (تم تجاهلها)</p>
            </div>
          </div>

          {result.servers.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-text-muted">السيرفرات المستوردة:</p>
              {result.servers.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 bg-dark-bg rounded-xl p-3"
                >
                  <span
                    className={clsx(
                      "px-2 py-0.5 rounded text-xs font-bold border",
                      getProtocolBgColor(s.protocol)
                    )}
                  >
                    {s.protocol.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium flex-1 truncate">{s.name}</span>
                  <span className="text-xs text-text-muted" dir="ltr">
                    {s.address}:{s.port}
                  </span>
                </div>
              ))}
            </div>
          )}

          {result.duplicateNames.length > 0 && (
            <div className="mt-4 space-y-1">
              <p className="text-sm text-text-muted">السيرفرات المكررة:</p>
              {result.duplicateNames.map((name, i) => (
                <p key={i} className="text-xs text-neon-yellow pr-4">• {name}</p>
              ))}
            </div>
          )}

          <button
            onClick={() => router.push("/servers")}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-dark-bg border border-dark-border rounded-xl text-sm text-text-muted hover:text-text-primary transition-colors"
          >
            <Server className="w-4 h-4" />
            عرض السيرفرات
          </button>
        </Card>
      )}
    </div>
  );
}
