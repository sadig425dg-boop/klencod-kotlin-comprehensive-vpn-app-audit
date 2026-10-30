import {
  Shield,
  GitBranch,
  Globe,
  Code2,
  Heart,
  CheckCircle2,
  Zap,
  Lock,
  Wifi,
  Server,
} from "lucide-react";
import { Card } from "@/components/Card";

export default function AboutPage() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center mx-auto mb-4 shadow-lg shadow-neon-purple/30">
          <Shield className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold gradient-text">VPN Manager</h1>
        <p className="text-text-muted text-sm mt-2">لوحة إدارة اتصالات V2Ray / Xray</p>
        <p className="text-text-muted text-xs mt-1">الإصدار 1.0.0</p>
      </div>

      {/* Features */}
      <Card>
        <h3 className="font-bold text-lg mb-4 text-center">الميزات الرئيسية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: <Server className="w-5 h-5 text-neon-purple" />,
              title: "إدارة السيرفرات",
              desc: "إضافة وتعديل وحذف سيرفرات V2Ray/Xray",
            },
            {
              icon: <Zap className="w-5 h-5 text-neon-pink" />,
              title: "استيراد ذكي",
              desc: "استيراد من روابط VLESS, VMess, Trojan, SS",
            },
            {
              icon: <Lock className="w-5 h-5 text-neon-green" />,
              title: "أمان متقدم",
              desc: "دعم TLS, Reality, WebSocket, gRPC",
            },
            {
              icon: <Wifi className="w-5 h-5 text-neon-cyan" />,
              title: "مشاركة الشبكة",
              desc: "مشاركة اتصال VPN عبر Hotspot",
            },
            {
              icon: <Globe className="w-5 h-5 text-neon-orange" />,
              title: "واجهة عربية",
              desc: "تصميم احترافي بالكامل باللغة العربية",
            },
            {
              icon: <Code2 className="w-5 h-5 text-neon-yellow" />,
              title: "تصدير JSON",
              desc: "تصدير إعدادات Xray بصيغة JSON",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-dark-bg rounded-xl p-4"
            >
              <div className="p-2 bg-dark-card rounded-lg shrink-0">{feature.icon}</div>
              <div>
                <h4 className="font-bold text-sm">{feature.title}</h4>
                <p className="text-xs text-text-muted mt-1">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Supported Protocols */}
      <Card>
        <h3 className="font-bold text-lg mb-4">البروتوكولات المدعومة</h3>
        <div className="space-y-3">
          {[
            { name: "VLESS", features: ["Reality", "TLS", "TCP", "WebSocket", "gRPC", "XTLS"] },
            { name: "VMess", features: ["TLS", "WebSocket", "TCP", "gRPC", "HTTP/2"] },
            { name: "Trojan", features: ["TLS", "Reality", "WebSocket", "gRPC"] },
            { name: "Shadowsocks", features: ["AES-256-GCM", "ChaCha20", "2022-Blake3"] },
          ].map((proto, i) => (
            <div key={i} className="bg-dark-bg rounded-xl p-4">
              <h4 className="font-bold text-sm mb-2">{proto.name}</h4>
              <div className="flex flex-wrap gap-1">
                {proto.features.map((f) => (
                  <span
                    key={f}
                    className="flex items-center gap-1 px-2 py-0.5 bg-dark-card border border-dark-border rounded text-xs text-text-secondary"
                  >
                    <CheckCircle2 className="w-3 h-3 text-neon-green" />
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Tech Stack */}
      <Card>
        <h3 className="font-bold text-lg mb-4">التقنيات المستخدمة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "Next.js 16",
            "React 19",
            "TypeScript",
            "Tailwind CSS 4",
            "PostgreSQL",
            "Drizzle ORM",
            "Lucide Icons",
            "خط Cairo",
          ].map((tech) => (
            <div
              key={tech}
              className="bg-dark-bg rounded-xl p-3 text-center text-sm text-text-secondary"
            >
              {tech}
            </div>
          ))}
        </div>
      </Card>

      {/* Links */}
      <Card>
        <div className="flex items-center justify-center gap-6 py-4">
          <a
            href="#"
            className="flex items-center gap-2 text-text-muted hover:text-neon-purple transition-colors"
          >
            <GitBranch className="w-5 h-5" />
            <span className="text-sm">GitHub</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-2 text-text-muted hover:text-neon-cyan transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm">الموقع</span>
          </a>
        </div>
      </Card>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-text-muted text-xs flex items-center justify-center gap-1">
          صُنع بـ <Heart className="w-3 h-3 text-neon-pink" /> للمجتمع العربي
        </p>
      </div>
    </div>
  );
}
