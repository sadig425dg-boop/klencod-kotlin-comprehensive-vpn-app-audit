import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  bigint,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";

// جدول السيرفرات
export const servers = pgTable("servers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  protocol: varchar("protocol", { length: 20 }).notNull(), // vless, vmess, trojan, ss
  address: text("address").notNull(),
  port: integer("port").notNull(),
  uuid: text("uuid"), // UUID or password
  encryption: varchar("encryption", { length: 50 }).default("none"),
  security: varchar("security", { length: 20 }).default("none"), // tls, reality, none
  network: varchar("network", { length: 20 }).default("tcp"), // tcp, ws, grpc, h2
  path: text("path"),
  host: text("host"),
  sni: text("sni"),
  fingerprint: varchar("fingerprint", { length: 50 }),
  flow: varchar("flow", { length: 50 }),
  alpn: text("alpn"),
  publicKey: text("public_key"),
  shortId: text("short_id"),
  serviceName: text("service_name"), // for gRPC
  method: varchar("method", { length: 50 }), // for Shadowsocks
  rawUri: text("raw_uri"),
  groupName: text("group_name"),
  isFavorite: boolean("is_favorite").default(false),
  latency: integer("latency"), // ms, null = not tested
  isActive: boolean("is_active").default(false),
  subscriptionId: integer("subscription_id"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// جدول الاشتراكات
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  serversCount: integer("servers_count").default(0),
  autoUpdate: boolean("auto_update").default(true),
  updateInterval: integer("update_interval").default(60), // minutes
  lastUpdatedAt: timestamp("last_updated_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// سجلات الاتصال
export const connectionLogs = pgTable("connection_logs", {
  id: serial("id").primaryKey(),
  serverId: integer("server_id"),
  serverName: text("server_name"),
  protocol: varchar("protocol", { length: 20 }),
  connectedAt: timestamp("connected_at").defaultNow(),
  disconnectedAt: timestamp("disconnected_at"),
  duration: integer("duration"), // seconds
  uploadBytes: bigint("upload_bytes", { mode: "number" }).default(0),
  downloadBytes: bigint("download_bytes", { mode: "number" }).default(0),
  status: varchar("status", { length: 20 }).default("connected"), // connected, disconnected, failed
});

// الإعدادات
export const appSettings = pgTable("app_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// إحصائيات يومية
export const dailyStats = pgTable("daily_stats", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  totalUpload: bigint("total_upload", { mode: "number" }).default(0),
  totalDownload: bigint("total_download", { mode: "number" }).default(0),
  totalDuration: integer("total_duration").default(0), // seconds
  connectionsCount: integer("connections_count").default(0),
});
