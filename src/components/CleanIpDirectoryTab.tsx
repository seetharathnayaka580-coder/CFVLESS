import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Server,
  Zap
} from 'lucide-react';
import { POPULAR_CLEAN_IPS } from '../data/cleanIps';
import { CleanIpEntry } from '../types';

interface CleanIpDirectoryTabProps {
  onApplyCleanIp: (ipOrDomain: string) => void;
}

export const CleanIpDirectoryTab: React.FC<CleanIpDirectoryTabProps> = ({
  onApplyCleanIp
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [appliedIp, setAppliedIp] = useState<string | null>(null);

  const filteredIps = POPULAR_CLEAN_IPS.filter(item => {
    const matchesSearch = 
      item.ipOrDomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.city && item.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.countryCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion = 
      selectedRegion === 'all' || 
      (selectedRegion === 'asia' && item.region === 'Asia Pacific') ||
      (selectedRegion === 'europe' && item.region === 'Europe') ||
      (selectedRegion === 'anycast' && item.region === 'Global Anycast') ||
      (selectedRegion === 'domain' && item.type === 'domain');

    return matchesSearch && matchesRegion;
  });

  const handleApply = (ip: string) => {
    onApplyCleanIp(ip);
    setAppliedIp(ip);
    setTimeout(() => setAppliedIp(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-orange-400 font-semibold text-sm">CDN Edge Optimization</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">AS13335 Clean BGP Routes</span>
          </div>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight">
            Cloudflare Clean IP & Domain Directory
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
            When connecting to your Cloudflare Worker VLESS node, setting a "Clean IP" as your client connection server bypasses ISP routing throttles and packet loss. Cloudflare's Anycast network routes the connection to your Worker via the nearest fiber gateway.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by IP, City, Country or Domain..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-hidden focus:border-orange-500"
          />
        </div>

        {/* Region Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Regions' },
            { id: 'anycast', label: 'Global Anycast' },
            { id: 'asia', label: 'Asia Pacific' },
            { id: 'europe', label: 'Europe' },
            { id: 'domain', label: 'Clean CDN Domains' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRegion(r.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedRegion === r.id
                  ? 'bg-slate-800 text-orange-400 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Grid View */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-semibold text-slate-400">
                <th className="py-3 px-4">Clean IP / Domain</th>
                <th className="py-3 px-4">Location / Network</th>
                <th className="py-3 px-4">Estimated Latency</th>
                <th className="py-3 px-4">ISP Suitability</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredIps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No Clean IPs matched your query.
                  </td>
                </tr>
              ) : (
                filteredIps.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-medium text-slate-100 flex items-center gap-1.5">
                        <span>{item.ipOrDomain}</span>
                        {item.type === 'domain' && (
                          <span className="text-[10px] text-orange-400 font-sans bg-orange-500/10 px-1.5 py-0.2 rounded border border-orange-500/20">
                            Domain
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{item.description}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-300 font-medium">{item.city || item.region}</div>
                      <div className="text-[11px] text-slate-500">{item.asn || 'Cloudflare Anycast'}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-emerald-400 font-semibold tabular-nums">
                        <Activity className="w-3.5 h-3.5" />
                        <span>~{item.avgLatencyMs || 35} ms</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Avg BGP Edge</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {item.ispSuitability.map((isp, i) => (
                          <span
                            key={i}
                            className="bg-slate-950 px-2 py-0.5 rounded text-[10px] text-slate-300 border border-slate-800"
                          >
                            {isp}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleApply(item.ipOrDomain)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          appliedIp === item.ipOrDomain
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white border border-slate-700'
                        }`}
                      >
                        {appliedIp === item.ipOrDomain ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Applied</span>
                          </>
                        ) : (
                          <>
                            <span>Use IP</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clean IP Explanatory Bento Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <Zap className="w-4 h-4 text-orange-400" />
            <span>Why use Clean IPs?</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Local ISPs frequently throttle or drop packets to generic Cloudflare IP ranges. Clean IPs are verified Anycast addresses that maintain 0% packet loss and low jitter.
          </p>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <Server className="w-4 h-4 text-orange-400" />
            <span>Clean IP vs Worker Domain</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Your client physically connects to the <strong className="text-slate-200">Clean IP</strong> on port 443, while sending your <strong className="text-slate-200">Worker Domain</strong> inside the TLS SNI and HTTP Host header.
          </p>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span>Port Compatibility</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Cloudflare supports TLS over ports 443, 8443, 2053, 2083, 2087, 2096. If port 443 is blocked on your mobile ISP, try switching to 8443 or 2053.
          </p>
        </div>
      </div>
    </div>
  );
};
