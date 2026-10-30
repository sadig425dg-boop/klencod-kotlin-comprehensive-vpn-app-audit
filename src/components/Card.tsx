import { clsx } from "clsx";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  neon?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, neon, hover, onClick }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-2xl bg-dark-card border border-dark-border p-5 transition-all duration-200",
        neon && "neon-border",
        hover && "hover:bg-dark-card-hover hover:border-dark-border-light cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  subtitle?: string;
}

export function StatCard({ label, value, icon, color = "text-neon-purple", subtitle }: StatCardProps) {
  return (
    <Card className="animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-muted text-sm">{label}</p>
          <p className={clsx("text-2xl font-bold mt-1", color)}>{value}</p>
          {subtitle && <p className="text-text-muted text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={clsx("p-3 rounded-xl bg-dark-bg", color)}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
