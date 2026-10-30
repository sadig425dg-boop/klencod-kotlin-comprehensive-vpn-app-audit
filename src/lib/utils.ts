export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} ثانية`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours} ساعة`);
  if (minutes > 0) parts.push(`${minutes} دقيقة`);
  if (secs > 0 && hours === 0) parts.push(`${secs} ثانية`);
  
  return parts.join(" و ");
}

export function formatTimeDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ar-SA", {
    month: "short",
    day: "numeric",
  });
}

export function getLatencyColor(latency: number | null): string {
  if (latency === null) return "text-text-muted";
  if (latency < 50) return "text-neon-green";
  if (latency < 100) return "text-neon-yellow";
  if (latency < 200) return "text-neon-orange";
  return "text-neon-red";
}

export function getLatencyLabel(latency: number | null): string {
  if (latency === null) return "غير مختبر";
  return `${latency} ms`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "connected": return "text-neon-green";
    case "connecting": return "text-neon-yellow";
    case "disconnected": return "text-text-muted";
    case "failed": return "text-neon-red";
    default: return "text-text-muted";
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "connected": return "متصل";
    case "connecting": return "جاري الاتصال";
    case "disconnected": return "غير متصل";
    case "failed": return "فشل الاتصال";
    default: return status;
  }
}
