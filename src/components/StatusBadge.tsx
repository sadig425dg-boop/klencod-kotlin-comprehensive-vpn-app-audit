import { clsx } from "clsx";

interface StatusBadgeProps {
  status: "connected" | "disconnected" | "connecting" | "failed";
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  connected: {
    label: "متصل",
    dotColor: "bg-neon-green",
    bgColor: "bg-neon-green/10 border-neon-green/30",
    textColor: "text-neon-green",
  },
  disconnected: {
    label: "غير متصل",
    dotColor: "bg-text-muted",
    bgColor: "bg-dark-border border-dark-border-light",
    textColor: "text-text-muted",
  },
  connecting: {
    label: "جاري الاتصال",
    dotColor: "bg-neon-yellow",
    bgColor: "bg-neon-yellow/10 border-neon-yellow/30",
    textColor: "text-neon-yellow",
  },
  failed: {
    label: "فشل",
    dotColor: "bg-neon-red",
    bgColor: "bg-neon-red/10 border-neon-red/30",
    textColor: "text-neon-red",
  },
};

const sizeConfig = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border font-medium",
        config.bgColor,
        config.textColor,
        sizeConfig[size]
      )}
    >
      <span
        className={clsx(
          "w-2 h-2 rounded-full",
          config.dotColor,
          status === "connecting" && "animate-pulse",
          status === "connected" && "animate-pulse"
        )}
      />
      {config.label}
    </span>
  );
}
