"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:mr-64 min-h-screen overflow-auto">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-dark-card/90 backdrop-blur-md border-b border-dark-border px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-dark-card-hover transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold gradient-text text-sm">VPN Manager</span>
          <div className="w-9" /> {/* Spacer */}
        </div>
        {children}
      </main>
    </div>
  );
}
