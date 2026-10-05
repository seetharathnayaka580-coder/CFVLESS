import { CleanIpEntry } from '../types';

export const POPULAR_CLEAN_IPS: CleanIpEntry[] = [
  // Global & Anycast IPv4
  {
    id: 'cf-anycast-1',
    ipOrDomain: '104.16.0.1',
    type: 'ipv4',
    region: 'Global Anycast',
    countryCode: 'US',
    city: 'Anycast',
    asn: 'AS13335 (Cloudflare)',
    avgLatencyMs: 45,
    ispSuitability: ['Global', 'General Fast Route'],
    description: 'Cloudflare primary edge VIP gateway',
    portsSupported: [443, 80, 8443, 2053, 2083, 2087, 2096, 8080, 8880]
  },
  {
    id: 'cf-anycast-2',
    ipOrDomain: '104.17.0.1',
    type: 'ipv4',
    region: 'Global Anycast',
    countryCode: 'US',
    city: 'Anycast',
    asn: 'AS13335 (Cloudflare)',
    avgLatencyMs: 48,
    ispSuitability: ['Global', 'High Throughput'],
    description: 'Cloudflare Edge CDN Node B',
    portsSupported: [443, 80, 8443, 2053, 2083, 2087, 2096]
  },
  {
    id: 'cf-anycast-3',
    ipOrDomain: '104.18.0.1',
    type: 'ipv4',
    region: 'Global Anycast',
    countryCode: 'US',
    city: 'Anycast',
    asn: 'AS13335 (Cloudflare)',
    avgLatencyMs: 42,
    ispSuitability: ['Global', 'Low Packet Loss'],
    description: 'Cloudflare Edge VIP Range 18',
    portsSupported: [443, 80, 8443, 2053, 2083, 2087, 2096]
  },
  {
    id: 'cf-anycast-4',
    ipOrDomain: '104.19.0.1',
    type: 'ipv4',
    region: 'Global Anycast',
    countryCode: 'US',
    city: 'Anycast',
    asn: 'AS13335 (Cloudflare)',
    avgLatencyMs: 50,
    ispSuitability: ['Global', 'Multi-Hop Routing'],
    description: 'Cloudflare Edge VIP Range 19',
    portsSupported: [443, 80, 8443, 2053, 2083, 2087, 2096]
  },
  {
    id: 'cf-anycast-5',
    ipOrDomain: '172.67.0.1',
    type: 'ipv4',
    region: 'Global Anycast',
    countryCode: 'US',
    city: 'Anycast',
    asn: 'AS13335 (Cloudflare)',
    avgLatencyMs: 55,
    ispSuitability: ['Global', 'DDoS Resilient'],
    description: 'Cloudflare Secondary Anycast Subnet',
    portsSupported: [443, 80, 8443, 2053, 2083, 2087, 2096]
  },
  {
    id: 'cf-anycast-6',
    ipOrDomain: '162.159.0.1',
    type: 'ipv4',
    region: 'Global Anycast',
    countryCode: 'US',
    city: 'Anycast',
    asn: 'AS13335 (Cloudflare)',
    avgLatencyMs: 40,
    ispSuitability: ['Global', 'Zero Packet Drop'],
    description: 'Cloudflare Direct Interconnect Pool',
    portsSupported: [443, 80, 8443, 2053, 2083, 2087, 2096]
  },
  // Singapore & Asia Pacific
  {
    id: 'cf-sg-1',
    ipOrDomain: '104.16.51.111',
    type: 'ipv4',
    region: 'Asia Pacific',
    countryCode: 'SG',
    city: 'Singapore (SIN)',
    asn: 'AS13335 (Cloudflare)',
    avgLatencyMs: 28,
    ispSuitability: ['Southeast Asia', 'Indonesia', 'Malaysia', 'Vietnam'],
    description: 'Equinix SG1 / Singtel IX direct peering',
    portsSupported: [443, 8443, 2053, 2083, 2087, 2096]
  },
  {
    id: 'cf-hk-1',
    ipOrDomain: '104.16.148.118',
    type: 'ipv4',
    region: 'Asia Pacific',
    countryCode: 'HK',
    city: 'Hong Kong (HKG)',
    asn: 'AS13335 (Cloudflare)',
    avgLatencyMs: 32,
    ispSuitability: ['East Asia', 'HKIX Peering', 'Taiwan', 'Philippines'],
    description: 'MEGA-i Mega Campus Hong Kong edge node',
    portsSupported: [443, 8443, 2053, 2083, 2087, 2096]
  },
  {
    id: 'cf-jp-1',
    ipOrDomain: '104.16.24.168',
    type: 'ipv4',
    region: 'Asia Pacific',
    countryCode: 'JP',
    city: 'Tokyo (NRT)',
    asn: 'AS13335 (Cloudflare)',
    avgLatencyMs: 38,
    ispSuitability: ['Japan', 'Korea', 'BBIX Peering'],
    description: 'Tokyo JPNAP / BBIX direct exchange',
    portsSupported: [443, 8443, 2053, 2083, 2087, 2096]
  },
  // Europe & Middle East
  {
    id: 'cf-de-1',
    ipOrDomain: '104.16.120.127',
    type: 'ipv4',
    region: 'Europe',
    countryCode: 'DE',
    city: 'Frankfurt (FRA)',
    asn: 'AS13335 (Cloudflare)',
    avgLatencyMs: 35,
    ispSuitability: ['Europe', 'DE-CIX', 'Germany', 'Poland'],
    description: 'Frankfurt DE-CIX hub node',
    portsSupported: [443, 8443, 2053, 2083, 2087, 2096]
  },
  {
    id: 'cf-uk-1',
    ipOrDomain: '104.16.155.155',
    type: 'ipv4',
    region: 'Europe',
    countryCode: 'GB',
    city: 'London (LHR)',
    asn: 'AS13335 (Cloudflare)',
    avgLatencyMs: 34,
    ispSuitability: ['UK & Western Europe', 'LINX Exchange'],
    description: 'London LINX & Telehouse North node',
    portsSupported: [443, 8443, 2053, 2083, 2087, 2096]
  },
  {
    id: 'cf-nl-1',
    ipOrDomain: '104.16.180.180',
    type: 'ipv4',
    region: 'Europe',
    countryCode: 'NL',
    city: 'Amsterdam (AMS)',
    asn: 'AS13335 (Cloudflare)',
    avgLatencyMs: 30,
    ispSuitability: ['AMS-IX', 'Nordics', 'Benelux'],
    description: 'Amsterdam AMS-IX core router IP',
    portsSupported: [443, 8443, 2053, 2083, 2087, 2096]
  },
  // Clean CDN Domains (Domain Fronting / SNI Bypass)
  {
    id: 'domain-cf-dash',
    ipOrDomain: 'dash.cloudflare.com',
    type: 'domain',
    region: 'Global CDN Domain',
    countryCode: 'US',
    asn: 'Cloudflare Portal VIP',
    avgLatencyMs: 40,
    ispSuitability: ['Global Domain Clean Route', 'SNI Friendly'],
    description: 'Cloudflare official management portal hostname',
    portsSupported: [443, 80, 8443]
  },
  {
    id: 'domain-cdnjs',
    ipOrDomain: 'cdnjs.cloudflare.com',
    type: 'domain',
    region: 'Global CDN Domain',
    countryCode: 'US',
    asn: 'Cloudflare CDN Static Asset',
    avgLatencyMs: 38,
    ispSuitability: ['Fast CDN Asset Caching', 'Universal Whitelist'],
    description: 'Public Web CDN hostname widely whitelisted by ISPs',
    portsSupported: [443, 80, 8443]
  },
  {
    id: 'domain-speedtest',
    ipOrDomain: 'www.speedtest.net',
    type: 'domain',
    region: 'Global CDN Domain',
    countryCode: 'US',
    asn: 'Ookla Speedtest Cloudflare CDN',
    avgLatencyMs: 35,
    ispSuitability: ['Speedtest Whitelist', 'Zero QoS Throttling'],
    description: 'Ookla speedtest Cloudflare edge front',
    portsSupported: [443, 80]
  },
  {
    id: 'domain-zoom',
    ipOrDomain: 'zoom.us',
    type: 'domain',
    region: 'Global CDN Domain',
    countryCode: 'US',
    asn: 'Cloudflare Zoom Enterprise Edge',
    avgLatencyMs: 42,
    ispSuitability: ['Conferencing Priority QoS', 'High MTU'],
    description: 'Zoom enterprise video gateway domain',
    portsSupported: [443, 8443]
  }
];

export const POPULAR_PROXY_IPS: string[] = [
  'proxyip.aliyun.com',
  'cdn.anycast.eu.org',
  'workers.cloudflare.cyou',
  'cf.090227.xyz',
  'proxyip.fxxk.dedyn.io',
  'ip.skk.moe'
];

export const CLOUDFLARE_TLS_PORTS = [443, 8443, 2053, 2083, 2087, 2096];
export const CLOUDFLARE_HTTP_PORTS = [80, 8080, 8880, 2052, 2082, 2086, 2095];
