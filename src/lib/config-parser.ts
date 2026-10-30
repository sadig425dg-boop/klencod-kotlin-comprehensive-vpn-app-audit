// محلل إعدادات V2Ray/Xray
// يدعم: VLESS, VMess, Trojan, Shadowsocks

export interface ParsedServer {
  name: string;
  protocol: string;
  address: string;
  port: number;
  uuid: string;
  encryption: string;
  security: string;
  network: string;
  path: string;
  host: string;
  sni: string;
  fingerprint: string;
  flow: string;
  alpn: string;
  publicKey: string;
  shortId: string;
  serviceName: string;
  method: string;
  rawUri: string;
}

function decodeBase64(str: string): string {
  try {
    // Handle URL-safe base64
    const padded = str.replace(/-/g, "+").replace(/_/g, "/");
    const padding = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    return atob(padded + padding);
  } catch {
    return str;
  }
}

export function parseVlessUri(uri: string): ParsedServer | null {
  try {
    const url = new URL(uri);
    const params = url.searchParams;
    const name = decodeURIComponent(url.hash.slice(1)) || "VLESS Server";

    return {
      name,
      protocol: "vless",
      address: url.hostname,
      port: parseInt(url.port) || 443,
      uuid: url.username,
      encryption: params.get("encryption") || "none",
      security: params.get("security") || "none",
      network: params.get("type") || "tcp",
      path: params.get("path") || "",
      host: params.get("host") || "",
      sni: params.get("sni") || "",
      fingerprint: params.get("fp") || "",
      flow: params.get("flow") || "",
      alpn: params.get("alpn") || "",
      publicKey: params.get("pbk") || "",
      shortId: params.get("sid") || "",
      serviceName: params.get("serviceName") || "",
      method: "",
      rawUri: uri,
    };
  } catch {
    return null;
  }
}

export function parseVmessUri(uri: string): ParsedServer | null {
  try {
    const encoded = uri.replace("vmess://", "");
    const decoded = decodeBase64(encoded);
    const config = JSON.parse(decoded);

    return {
      name: config.ps || config.remarks || "VMess Server",
      protocol: "vmess",
      address: config.add || config.host || "",
      port: parseInt(config.port) || 443,
      uuid: config.id || "",
      encryption: config.scy || config.security || "auto",
      security: config.tls === "tls" ? "tls" : "none",
      network: config.net || "tcp",
      path: config.path || "",
      host: config.host || "",
      sni: config.sni || "",
      fingerprint: config.fp || "",
      flow: "",
      alpn: config.alpn || "",
      publicKey: "",
      shortId: "",
      serviceName: "",
      method: "",
      rawUri: uri,
    };
  } catch {
    return null;
  }
}

export function parseTrojanUri(uri: string): ParsedServer | null {
  try {
    const url = new URL(uri);
    const params = url.searchParams;
    const name = decodeURIComponent(url.hash.slice(1)) || "Trojan Server";

    return {
      name,
      protocol: "trojan",
      address: url.hostname,
      port: parseInt(url.port) || 443,
      uuid: url.username, // password for Trojan
      encryption: "",
      security: params.get("security") || "tls",
      network: params.get("type") || "tcp",
      path: params.get("path") || "",
      host: params.get("host") || "",
      sni: params.get("sni") || url.hostname,
      fingerprint: params.get("fp") || "",
      flow: params.get("flow") || "",
      alpn: params.get("alpn") || "",
      publicKey: params.get("pbk") || "",
      shortId: params.get("sid") || "",
      serviceName: params.get("serviceName") || "",
      method: "",
      rawUri: uri,
    };
  } catch {
    return null;
  }
}

export function parseShadowsocksUri(uri: string): ParsedServer | null {
  try {
    // Format: ss://base64(method:password)@host:port#name
    // or: ss://base64(method:password@host:port)#name
    const withoutScheme = uri.replace("ss://", "");
    const hashIndex = withoutScheme.lastIndexOf("#");
    const name = hashIndex >= 0
      ? decodeURIComponent(withoutScheme.slice(hashIndex + 1))
      : "SS Server";
    const mainPart = hashIndex >= 0 ? withoutScheme.slice(0, hashIndex) : withoutScheme;

    let method = "";
    let password = "";
    let address = "";
    let port = 0;

    const atIndex = mainPart.indexOf("@");
    if (atIndex >= 0) {
      // Format: base64(method:password)@host:port
      const userInfo = decodeBase64(mainPart.slice(0, atIndex));
      const colonIndex = userInfo.indexOf(":");
      method = userInfo.slice(0, colonIndex);
      password = userInfo.slice(colonIndex + 1);
      const hostPort = mainPart.slice(atIndex + 1);
      const lastColon = hostPort.lastIndexOf(":");
      address = hostPort.slice(0, lastColon);
      port = parseInt(hostPort.slice(lastColon + 1));
    } else {
      // Fully encoded
      const decoded = decodeBase64(mainPart);
      const colonIndex = decoded.indexOf(":");
      const atIdx = decoded.lastIndexOf("@");
      method = decoded.slice(0, colonIndex);
      password = decoded.slice(colonIndex + 1, atIdx);
      const hostPort = decoded.slice(atIdx + 1);
      const lastColon = hostPort.lastIndexOf(":");
      address = hostPort.slice(0, lastColon);
      port = parseInt(hostPort.slice(lastColon + 1));
    }

    return {
      name,
      protocol: "ss",
      address,
      port: port || 443,
      uuid: password,
      encryption: "",
      security: "none",
      network: "tcp",
      path: "",
      host: "",
      sni: "",
      fingerprint: "",
      flow: "",
      alpn: "",
      publicKey: "",
      shortId: "",
      serviceName: "",
      method,
      rawUri: uri,
    };
  } catch {
    return null;
  }
}

export function parseConfigUri(uri: string): ParsedServer | null {
  const trimmed = uri.trim();

  if (trimmed.startsWith("vless://")) {
    return parseVlessUri(trimmed);
  } else if (trimmed.startsWith("vmess://")) {
    return parseVmessUri(trimmed);
  } else if (trimmed.startsWith("trojan://")) {
    return parseTrojanUri(trimmed);
  } else if (trimmed.startsWith("ss://")) {
    return parseShadowsocksUri(trimmed);
  }

  return null;
}

export function parseMultipleConfigs(text: string): ParsedServer[] {
  const lines = text
    .split(/[\n\r]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const results: ParsedServer[] = [];

  for (const line of lines) {
    const parsed = parseConfigUri(line);
    if (parsed) {
      results.push(parsed);
    }
  }

  return results;
}

export function generateVlessUri(server: ParsedServer): string {
  const params = new URLSearchParams();
  if (server.encryption) params.set("encryption", server.encryption);
  if (server.security) params.set("security", server.security);
  if (server.network && server.network !== "tcp") params.set("type", server.network);
  if (server.path) params.set("path", server.path);
  if (server.host) params.set("host", server.host);
  if (server.sni) params.set("sni", server.sni);
  if (server.fingerprint) params.set("fp", server.fingerprint);
  if (server.flow) params.set("flow", server.flow);
  if (server.alpn) params.set("alpn", server.alpn);
  if (server.publicKey) params.set("pbk", server.publicKey);
  if (server.shortId) params.set("sid", server.shortId);
  if (server.serviceName) params.set("serviceName", server.serviceName);

  return `vless://${server.uuid}@${server.address}:${server.port}?${params.toString()}#${encodeURIComponent(server.name)}`;
}

export function generateXrayConfig(server: ParsedServer): object {
  const outbound: Record<string, unknown> = {
    protocol: server.protocol === "ss" ? "shadowsocks" : server.protocol,
    settings: {},
    streamSettings: {},
    tag: "proxy",
  };

  // Settings based on protocol
  if (server.protocol === "vless") {
    outbound.settings = {
      vnext: [{
        address: server.address,
        port: server.port,
        users: [{
          id: server.uuid,
          encryption: server.encryption || "none",
          flow: server.flow || "",
        }],
      }],
    };
  } else if (server.protocol === "vmess") {
    outbound.settings = {
      vnext: [{
        address: server.address,
        port: server.port,
        users: [{
          id: server.uuid,
          security: server.encryption || "auto",
          alterId: 0,
        }],
      }],
    };
  } else if (server.protocol === "trojan") {
    outbound.settings = {
      servers: [{
        address: server.address,
        port: server.port,
        password: server.uuid,
        flow: server.flow || "",
      }],
    };
  } else if (server.protocol === "ss") {
    outbound.settings = {
      servers: [{
        address: server.address,
        port: server.port,
        method: server.method || "aes-256-gcm",
        password: server.uuid,
      }],
    };
  }

  // Stream settings
  const streamSettings: Record<string, unknown> = {
    network: server.network || "tcp",
  };

  if (server.security === "tls") {
    streamSettings.security = "tls";
    streamSettings.tlsSettings = {
      serverName: server.sni || server.address,
      fingerprint: server.fingerprint || "chrome",
      alpn: server.alpn ? server.alpn.split(",") : ["h2", "http/1.1"],
    };
  } else if (server.security === "reality") {
    streamSettings.security = "reality";
    streamSettings.realitySettings = {
      serverName: server.sni || "",
      fingerprint: server.fingerprint || "chrome",
      publicKey: server.publicKey || "",
      shortId: server.shortId || "",
    };
  }

  if (server.network === "ws") {
    streamSettings.wsSettings = {
      path: server.path || "/",
      headers: server.host ? { Host: server.host } : {},
    };
  } else if (server.network === "grpc") {
    streamSettings.grpcSettings = {
      serviceName: server.serviceName || "",
      multiMode: false,
    };
  } else if (server.network === "h2") {
    streamSettings.httpSettings = {
      path: server.path || "/",
      host: server.host ? [server.host] : [],
    };
  }

  outbound.streamSettings = streamSettings;

  return {
    log: { loglevel: "warning" },
    inbounds: [{
      tag: "socks",
      port: 10808,
      listen: "127.0.0.1",
      protocol: "socks",
      settings: { auth: "noauth", udp: true },
    }, {
      tag: "http",
      port: 10809,
      listen: "127.0.0.1",
      protocol: "http",
      settings: {},
    }],
    outbounds: [
      outbound,
      { protocol: "freedom", tag: "direct" },
      { protocol: "blackhole", tag: "block" },
    ],
    routing: {
      domainStrategy: "IPIfNonMatch",
      rules: [
        { type: "field", outboundTag: "direct", ip: ["geoip:private"] },
      ],
    },
  };
}

export function getProtocolColor(protocol: string): string {
  switch (protocol.toLowerCase()) {
    case "vless": return "text-neon-purple";
    case "vmess": return "text-neon-cyan";
    case "trojan": return "text-neon-orange";
    case "ss": return "text-neon-green";
    default: return "text-text-secondary";
  }
}

export function getProtocolBgColor(protocol: string): string {
  switch (protocol.toLowerCase()) {
    case "vless": return "bg-neon-purple/20 text-neon-purple border-neon-purple/30";
    case "vmess": return "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30";
    case "trojan": return "bg-neon-orange/20 text-neon-orange border-neon-orange/30";
    case "ss": return "bg-neon-green/20 text-neon-green border-neon-green/30";
    default: return "bg-dark-border text-text-secondary border-dark-border";
  }
}
