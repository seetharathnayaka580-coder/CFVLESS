export type ProtocolSecurity = 'tls' | 'none';

export interface VlessConfig {
  id: string;
  uuid: string;
  workerDomain: string;
  cleanIp: string;
  port: number;
  security: ProtocolSecurity;
  sni: string;
  host: string;
  path: string;
  earlyData: boolean;
  earlyDataLength: number;
  nodeName: string;
  proxyIp?: string;
}

export interface CleanIpEntry {
  id: string;
  ipOrDomain: string;
  type: 'ipv4' | 'ipv6' | 'domain';
  region: string;
  countryCode: string;
  city?: string;
  asn?: string;
  avgLatencyMs?: number;
  ispSuitability: string[];
  description: string;
  portsSupported: number[];
}

export interface WorkerScriptOptions {
  uuid: string;
  proxyIp: string;
  fallbackSite: string;
  enableSubEndpoint: boolean;
  enableDashboard: boolean;
  subTitle: string;
}

export type ClientFormat = 
  | 'vless-uri'
  | 'clash-meta'
  | 'sing-box'
  | 'shadowrocket'
  | 'quantumult-x'
  | 'v2rayn-json'
  | 'raw-base64';
