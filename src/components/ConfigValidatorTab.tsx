import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  ArrowRight, 
  Search, 
  Code, 
  ShieldAlert, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { parseVlessUri } from '../utils/nodeGenerators';
import { isValidUuid } from '../utils/uuid';
import { VlessConfig } from '../types';
import { CLOUDFLARE_TLS_PORTS, CLOUDFLARE_HTTP_PORTS } from '../data/cleanIps';

interface ConfigValidatorTabProps {
  onLoadIntoGenerator: (config: VlessConfig) => void;
}

interface DiagnosticIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  field: string;
  suggestion?: string;
}

export const ConfigValidatorTab: React.FC<ConfigValidatorTabProps> = ({
  onLoadIntoGenerator
}) => {
  const [inputUri, setInputUri] = useState('');
  const [parsedData, setParsedData] = useState<Partial<VlessConfig> | null>(null);
  const [issues, setIssues] = useState<DiagnosticIssue[]>([]);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const analyzeUri = () => {
    if (!inputUri.trim()) {
      setParsedData(null);
      setIssues([]);
      setHasAnalyzed(false);
      return;
    }

    const res = parseVlessUri(inputUri.trim());
    if (res.error || !res.config) {
      setParsedData(null);
      setIssues([{ type: 'error', message: res.error || 'Failed to parse URI', field: 'URI Format' }]);
      setHasAnalyzed(true);
      return;
    }

    const cfg = res.config;
    setParsedData(cfg);

    const foundIssues: DiagnosticIssue[] = [];

    // 1. Check UUID
    if (!cfg.uuid || !isValidUuid(cfg.uuid)) {
      foundIssues.push({
        type: 'error',
        field: 'UUID',
        message: 'Invalid RFC4122 UUID structure.',
        suggestion: 'Ensure UUID follows standard 8-4-4-4-12 hex format.'
      });
    }

    // 2. Check Port & Security
    const isTls = cfg.security === 'tls';
    const port = cfg.port || 443;
    if (isTls && !CLOUDFLARE_TLS_PORTS.includes(port)) {
      foundIssues.push({
        type: 'warning',
        field: 'Port / TLS Mismatch',
        message: `Port ${port} is not in Cloudflare's standard TLS proxy list (${CLOUDFLARE_TLS_PORTS.join(', ')}).`,
        suggestion: 'Switch to port 443, 8443, or 2053 for TLS connections.'
      });
    }

    if (!isTls && !CLOUDFLARE_HTTP_PORTS.includes(port)) {
      foundIssues.push({
        type: 'warning',
        field: 'Port / HTTP Mismatch',
        message: `Port ${port} is not in Cloudflare's standard HTTP proxy list (${CLOUDFLARE_HTTP_PORTS.join(', ')}).`,
        suggestion: 'Switch to port 80 or 8080 for non-TLS HTTP connections.'
      });
    }

    // 3. Check SNI and Host
    if (isTls && !cfg.sni) {
      foundIssues.push({
        type: 'error',
        field: 'SNI (Server Name Indication)',
        message: 'SNI is empty on a TLS connection.',
        suggestion: 'Set SNI to match your Cloudflare Worker domain or custom domain.'
      });
    }

    if (!cfg.host) {
      foundIssues.push({
        type: 'warning',
        field: 'Host Header',
        message: 'Host header is missing.',
        suggestion: 'Set Host header to your Worker domain.'
      });
    }

    // 4. Check Path
    if (!cfg.path || !cfg.path.startsWith('/')) {
      foundIssues.push({
        type: 'info',
        field: 'WebSocket Path',
        message: 'Path should begin with a forward slash.',
        suggestion: 'Prefix with / (e.g. / or /?ed=2048).'
      });
    }

    setIssues(foundIssues);
    setHasAnalyzed(true);
  };

  const handleFixAndLoad = () => {
    if (!parsedData) return;

    const fixedConfig: VlessConfig = {
      id: `fixed-${Date.now()}`,
      uuid: parsedData.uuid && isValidUuid(parsedData.uuid) ? parsedData.uuid : 'd342d11e-d424-4583-b36e-524ab1f0afa4',
      workerDomain: parsedData.sni || parsedData.host || parsedData.workerDomain || 'vless.yourdomain.com',
      cleanIp: parsedData.cleanIp || '104.16.0.1',
      port: parsedData.port && CLOUDFLARE_TLS_PORTS.includes(parsedData.port) ? parsedData.port : 443,
      security: parsedData.security || 'tls',
      sni: parsedData.sni || parsedData.workerDomain || 'vless.yourdomain.com',
      host: parsedData.host || parsedData.workerDomain || 'vless.yourdomain.com',
      path: parsedData.path && parsedData.path.startsWith('/') ? parsedData.path : '/',
      earlyData: !!parsedData.earlyData,
      earlyDataLength: 2048,
      nodeName: parsedData.nodeName || '⚡ CF-Repaired-VLESS'
    };

    onLoadIntoGenerator(fixedConfig);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-orange-400 font-semibold text-sm">URI Diagnostics & Troubleshooter</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">Deep Packet Parameter Inspection</span>
          </div>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight">
            VLESS Configuration Validator & Repair Tool
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
            Paste an existing <span className="font-mono text-slate-300">vless://</span> link to diagnose connection failures, SNI mismatches, invalid ports, or percent-encoding corruptions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Input Area (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200">
                Paste VLESS URI Link
              </label>
              <button
                onClick={() => {
                  setInputUri('vless://d342d11e-d424-4583-b36e-524ab1f0afa4@104.16.0.1:443?encryption=none&security=tls&sni=my-worker.username.workers.dev&type=ws&host=my-worker.username.workers.dev&path=%2F#Sample-Node');
                }}
                className="text-[11px] text-orange-400 hover:text-orange-300"
              >
                Load Sample URI
              </button>
            </div>

            <textarea
              rows={5}
              value={inputUri}
              onChange={(e) => setInputUri(e.target.value)}
              placeholder="vless://UUID@CleanIP:Port?encryption=none&security=tls&sni=domain&type=ws&host=domain&path=%2F#NodeName"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-hidden focus:border-orange-500"
            />

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={analyzeUri}
                className="flex-1 py-2 px-4 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Diagnose Configuration</span>
              </button>

              <button
                onClick={() => {
                  setInputUri('');
                  setParsedData(null);
                  setIssues([]);
                  setHasAnalyzed(false);
                }}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                title="Reset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Troubleshooting Guide */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2">
            <div className="text-slate-300 font-medium flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              <span>Common VLESS Pitfalls</span>
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-[11px] text-slate-500">
              <li>Setting <span className="font-mono text-slate-300">security=tls</span> on port 80 or 8080 (Cloudflare only supports TLS on 443/8443/2053/etc.).</li>
              <li>Leaving <span className="font-mono text-slate-300">sni</span> empty when using a Clean IP (the CDN won't know which Worker to route to).</li>
              <li>Unencoded characters in WebSocket path (e.g. <span className="font-mono text-slate-300">%2F</span> vs <span className="font-mono text-slate-300">/</span>).</li>
            </ul>
          </div>
        </div>

        {/* Right Diagnostic Result Area (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-slate-100">Diagnostic Verdict</h2>
              {hasAnalyzed && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  issues.filter(i => i.type === 'error').length === 0
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  {issues.filter(i => i.type === 'error').length === 0 ? '✓ Ready to Connect' : '⚠ Issues Detected'}
                </span>
              )}
            </div>

            {!hasAnalyzed ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                Paste a VLESS link on the left and click "Diagnose Configuration" to inspect its parameters.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Issues List */}
                <div className="space-y-2">
                  {issues.length === 0 ? (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-lg flex items-center gap-2 text-xs text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>All parameters adhere to standard Cloudflare WebSocket + TLS specifications.</span>
                    </div>
                  ) : (
                    issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs space-y-1 ${
                          issue.type === 'error'
                            ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                            : issue.type === 'warning'
                            ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                            : 'bg-blue-950/30 border-blue-800/60 text-blue-200'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-semibold">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{issue.field}: {issue.message}</span>
                        </div>
                        {issue.suggestion && (
                          <div className="text-[11px] opacity-80 pl-5">
                            💡 Fix: {issue.suggestion}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Parsed Parameter Grid */}
                {parsedData && (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="text-xs font-semibold text-slate-300">Extracted Node Properties</div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Address (Clean IP)</span>
                        <span className="text-slate-200 truncate block">{parsedData.cleanIp || 'N/A'}</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Port & Security</span>
                        <span className="text-slate-200 truncate block">{parsedData.port} / {parsedData.security}</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">SNI Domain</span>
                        <span className="text-slate-200 truncate block">{parsedData.sni || 'None'}</span>
                      </div>
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">Host Header</span>
                        <span className="text-slate-200 truncate block">{parsedData.host || 'None'}</span>
                      </div>
                      <div className="col-span-2 bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">UUID</span>
                        <span className="text-slate-200 text-[11px] truncate block">{parsedData.uuid || 'Missing'}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleFixAndLoad}
                      className="w-full mt-3 py-2.5 px-4 bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Wrench className="w-3.5 h-3.5 text-orange-400" />
                      <span>Repair & Load into Generator Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
