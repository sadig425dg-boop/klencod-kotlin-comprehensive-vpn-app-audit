"use client";

import { clsx } from "clsx";

interface ConnectionRingProps {
  status: "connected" | "disconnected" | "connecting";
  size?: number;
}

export function ConnectionRing({ status, size = 200 }: ConnectionRingProps) {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Outer glow */}
      {status === "connected" && (
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            width: size + 20,
            height: size + 20,
            background: "radial-gradient(circle, rgba(153,69,255,0.15) 0%, transparent 70%)",
          }}
        />
      )}

      {/* Background ring */}
      <svg className="absolute" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(30,30,46,0.8)"
          strokeWidth="6"
        />
      </svg>

      {/* Animated ring */}
      <svg
        className={clsx(
          "absolute transition-all duration-1000",
          status === "connecting" && "animate-spin-slow"
        )}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)" }}
      >
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff2d78" />
            <stop offset="50%" stopColor="#9945ff" />
            <stop offset="100%" stopColor="#ff2d78" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={
            status === "disconnected"
              ? circumference
              : status === "connecting"
              ? circumference * 0.5
              : circumference * 0.05
          }
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Inner circle */}
      <div
        className={clsx(
          "absolute rounded-full flex items-center justify-center transition-all duration-500",
          status === "connected" && "animate-ring-pulse"
        )}
        style={{
          width: size * 0.6,
          height: size * 0.6,
          background:
            status === "connected"
              ? "radial-gradient(circle, rgba(153,69,255,0.3) 0%, rgba(255,45,120,0.1) 100%)"
              : status === "connecting"
              ? "radial-gradient(circle, rgba(255,234,0,0.2) 0%, transparent 100%)"
              : "radial-gradient(circle, rgba(30,30,46,0.8) 0%, rgba(19,19,26,1) 100%)",
        }}
      >
        {/* Status icon */}
        <div className="text-center">
          {status === "connected" && (
            <div className="flex flex-col items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-neon-green animate-pulse" />
              <span className="text-xs text-neon-green font-medium">متصل</span>
            </div>
          )}
          {status === "disconnected" && (
            <div className="flex flex-col items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-text-muted" />
              <span className="text-xs text-text-muted font-medium">غير متصل</span>
            </div>
          )}
          {status === "connecting" && (
            <div className="flex flex-col items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-neon-yellow animate-pulse" />
              <span className="text-xs text-neon-yellow font-medium">جاري...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
