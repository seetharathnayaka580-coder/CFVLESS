import { VlessConfig } from '../types';

/**
 * Builds standard VLESS URI
 * Format: vless://UUID@CleanIP:Port?encryption=none&security=tls&sni=WorkerDomain&type=ws&host=WorkerDomain&path=%2F#NodeName
 */
export function generateVlessUri(config: VlessConfig): string {
  const uuid = config.uuid.trim();
  const address = config.cleanIp.trim() || config.workerDomain.trim();
  const port = config.port || 443;
  const security = config.security || 'tls';
  const sni = config.sni.trim() || config.workerDomain.trim();
  const host = config.host.trim() || config.workerDomain.trim();
  
  let path = config.path.trim() || '/';
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  if (config.earlyData && !path.includes('ed=')) {
    path += (path.includes('?') ? '&' : '?') + `ed=${config.earlyDataLength || 2048}`;
  }
  
  const encodedPath = encodeURIComponent(path);
  const remark = encodeURIComponent(config.nodeName.trim() || 'CF-VLESS-Worker');
  
  const params = new URLSearchParams();
  params.set('encryption', 'none');
  params.set('security', security);
  params.set('sni', sni);
  params.set('type', 'ws');
  params.set('host', host);
  params.set('path', path); // We'll reconstruct manual query string to preserve standard %2F encoding
  
  const queryString = `encryption=none&security=${security}&sni=${encodeURIComponent(sni)}&type=ws&host=${encodeURIComponent(host)}&path=${encodedPath}`;
  
  return `vless://${uuid}@${address}:${port}?${queryString}#${remark}`;
}

/**
 * Generates Clash Meta (Mihomo) Proxies Configuration YAML
 */
export function generateClashMetaYaml(configs: VlessConfig | VlessConfig[]): string {
  const list = Array.isArray(configs) ? configs : [configs];
  
  const proxiesYaml = list.map(c => {
    const address = c.cleanIp.trim() || c.workerDomain.trim();
    const port = c.port || 443;
    const tls = c.security === 'tls';
    const sni = c.sni.trim() || c.workerDomain.trim();
    const host = c.host.trim() || c.workerDomain.trim();
    let path = c.path.trim() || '/';
    if (!path.startsWith('/')) path = '/' + path;
    if (c.earlyData && !path.includes('ed=')) {
      path += (path.includes('?') ? '&' : '?') + `ed=${c.earlyDataLength || 2048}`;
    }

    return `  - name: "${c.nodeName.trim() || 'CF-VLESS-Worker'}"
    type: vless
    server: ${address}
    port: ${port}
    uuid: ${c.uuid.trim()}
    cipher: none
    udp: true
    tls: ${tls}
    client-fingerprint: chrome
    skip-cert-verify: false
    servername: ${sni}
    network: ws
    ws-opts:
      path: "${path}"
      headers:
        Host: ${host}
      max-early-data: ${c.earlyData ? c.earlyDataLength || 2048 : 0}
      early-data-header-name: Sec-WebSocket-Protocol`;
  }).join('\n');

  return `proxies:
${proxiesYaml}

proxy-groups:
  - name: "🚀 Cloudflare Auto"
    type: url-test
    url: http://www.gstatic.com/generate_204
    interval: 300
    tolerance: 50
    proxies:
${list.map(c => `      - "${c.nodeName.trim() || 'CF-VLESS-Worker'}"`).join('\n')}

  - name: "⚡ Cloudflare Select"
    type: select
    proxies:
      - "🚀 Cloudflare Auto"
${list.map(c => `      - "${c.nodeName.trim() || 'CF-VLESS-Worker'}"`).join('\n')}

rules:
  - GEOIP,LAN,DIRECT
  - GEOIP,CN,DIRECT
  - MATCH,⚡ Cloudflare Select
`;
}

/**
 * Generates Sing-box 1.8+ Outbound JSON
 */
export function generateSingboxJson(configs: VlessConfig | VlessConfig[]): string {
  const list = Array.isArray(configs) ? configs : [configs];

  const outbounds = list.map(c => {
    const address = c.cleanIp.trim() || c.workerDomain.trim();
    const port = c.port || 443;
    const tls = c.security === 'tls';
    const sni = c.sni.trim() || c.workerDomain.trim();
    const host = c.host.trim() || c.workerDomain.trim();
    let path = c.path.trim() || '/';
    if (!path.startsWith('/')) path = '/' + path;

    return {
      type: 'vless',
      tag: c.nodeName.trim() || 'CF-VLESS-Worker',
      server: address,
      server_port: port,
      uuid: c.uuid.trim(),
      flow: '',
      tls: {
        enabled: tls,
        server_name: sni,
        utls: {
          enabled: true,
          fingerprint: 'chrome'
        }
      },
      transport: {
        type: 'ws',
        path: path,
        headers: {
          Host: host
        },
        max_early_data: c.earlyData ? (c.earlyDataLength || 2048) : 0,
        early_data_header_name: 'Sec-WebSocket-Protocol'
      }
    };
  });

  const fullConfig = {
    log: {
      level: 'info',
      timestamp: true
    },
    outbounds: [
      ...outbounds,
      {
        type: 'direct',
        tag: 'direct'
      },
      {
        type: 'block',
        tag: 'block'
      },
      {
        type: 'dns',
        tag: 'dns-out'
      }
    ],
    route: {
      rules: [
        {
          protocol: 'dns',
          outbound: 'dns-out'
        },
        {
          clash_mode: 'Direct',
          outbound: 'direct'
        },
        {
          clash_mode: 'Global',
          outbound: outbounds[0]?.tag || 'CF-VLESS-Worker'
        }
      ],
      auto_detect_interface: true
    }
  };

  return JSON.stringify(fullConfig, null, 2);
}

/**
 * Generates Shadowrocket Compatible Format
 */
export function generateShadowrocket(config: VlessConfig): string {
  return generateVlessUri(config);
}

/**
 * Generates Quantumult X Server Line
 */
export function generateQuantumultX(config: VlessConfig): string {
  const address = config.cleanIp.trim() || config.workerDomain.trim();
  const port = config.port || 443;
  const tls = config.security === 'tls';
  const sni = config.sni.trim() || config.workerDomain.trim();
  const host = config.host.trim() || config.workerDomain.trim();
  let path = config.path.trim() || '/';
  if (!path.startsWith('/')) path = '/' + path;

  return `vless=${address}:${port}, method=none, password=${config.uuid.trim()}, obfs=websocket, obfs-host=${host}, obfs-uri=${path}, tls=${tls}, tls-verification=true, tls-host=${sni}, tag=${config.nodeName.trim() || 'CF-VLESS'}`;
}

/**
 * Generates v2rayN / V2rayNG Outbound JSON format
 */
export function generateV2raynJson(config: VlessConfig): string {
  const address = config.cleanIp.trim() || config.workerDomain.trim();
  const port = config.port || 443;
  const tls = config.security === 'tls';
  const sni = config.sni.trim() || config.workerDomain.trim();
  const host = config.host.trim() || config.workerDomain.trim();
  let path = config.path.trim() || '/';
  if (!path.startsWith('/')) path = '/' + path;

  const v2rayOutbound = {
    tag: 'proxy',
    protocol: 'vless',
    settings: {
      vnext: [
        {
          address: address,
          port: port,
          users: [
            {
              id: config.uuid.trim(),
              encryption: 'none',
              level: 0
            }
          ]
        }
      ]
    },
    streamSettings: {
      network: 'ws',
      security: tls ? 'tls' : 'none',
      tlsSettings: tls
        ? {
            serverName: sni,
            allowInsecure: false,
            fingerprint: 'chrome'
          }
        : undefined,
      wsSettings: {
        path: path,
        headers: {
          Host: host
        }
      }
    }
  };

  return JSON.stringify(v2rayOutbound, null, 2);
}

/**
 * Base64 encodes an array of VLESS links for raw subscription import
 */
export function generateBase64Subscription(configs: VlessConfig[]): string {
  const uris = configs.map(c => generateVlessUri(c)).join('\n');
  try {
    return btoa(unescape(encodeURIComponent(uris)));
  } catch {
    return btoa(uris);
  }
}

/**
 * Parses an incoming VLESS URI back to structured components and flags errors
 */
export function parseVlessUri(uri: string): { config?: Partial<VlessConfig>; error?: string } {
  try {
    const raw = uri.trim();
    if (!raw.startsWith('vless://')) {
      return { error: 'Invalid URI scheme. Must start with vless://' };
    }

    const hashParts = raw.slice(8).split('#');
    const nodeName = hashParts[1] ? decodeURIComponent(hashParts[1]) : 'Imported Node';
    const mainPart = hashParts[0];

    const [authAndHost, queryStr] = mainPart.split('?');
    if (!authAndHost) {
      return { error: 'Missing UUID and address specification' };
    }

    const [uuid, serverAndPort] = authAndHost.split('@');
    if (!uuid || !serverAndPort) {
      return { error: 'Malformed userinfo or server address in URI' };
    }

    let cleanIp = serverAndPort;
    let port = 443;
    if (serverAndPort.includes(':')) {
      const parts = serverAndPort.split(':');
      cleanIp = parts[0];
      port = parseInt(parts[1], 10) || 443;
    }

    const params = new URLSearchParams(queryStr || '');
    const security = (params.get('security') === 'tls' ? 'tls' : 'none') as 'tls' | 'none';
    const sni = params.get('sni') || '';
    const host = params.get('host') || '';
    const rawPath = params.get('path') || '/';
    const decodedPath = decodeURIComponent(rawPath);
    const earlyData = decodedPath.includes('ed=');

    return {
      config: {
        uuid,
        cleanIp,
        port,
        security,
        sni,
        host,
        path: decodedPath,
        earlyData,
        workerDomain: sni || host || cleanIp,
        nodeName
      }
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { error: `Failed to parse VLESS URI: ${message}` };
  }
}
