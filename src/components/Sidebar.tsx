"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Server,
  FileDown,
  Rss,
  BarChart3,
  ScrollText,
  Settings,
  Info,
  Wifi,
  Activity,
} from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { href: "/", label: "الرئيسية", icon: Shield },
  { href: "/servers", label: "السيرفرات", icon: Server },
  { href: "/import", label: "استيراد كونفج", icon: FileDown },
  { href: "/subscriptions", label: "الاشتراكات", icon: Rss },
  { href: "/hotspot", label: "مشاركة الشبكة", icon: Wifi },
  { href: "/statistics", label: "الإحصائيات", icon: BarChart3 },
  { href: "/logs", label: "سجل الاتصالات", icon: ScrollText },
  { href: "/settings", label: "الإعدادات", icon: Settings },
  { href: "/about", label: "حول التطبيق", icon: Info },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-dark-card border-l border-dark-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">VPN Manager</h1>
            <p className="text-xs text-text-muted">V2Ray / Xray</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-auto">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-l from-neon-pink/20 to-neon-purple/20 text-neon-pink border border-neon-pink/20"
                      : "text-text-secondary hover:text-text-primary hover:bg-dark-card-hover"
                  )}
                >
                  <Icon className={clsx("w-5 h-5", isActive && "text-neon-pink")} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="mr-auto w-2 h-2 rounded-full bg-neon-pink animate-pulse" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Status bar */}
      <div className="p-4 border-t border-dark-border">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Activity className="w-3 h-3 text-neon-green" />
          <span>الإصدار 1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
