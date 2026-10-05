import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  QrCode, 
  RotateCw, 
  Globe, 
  ShieldCheck, 
  Sliders, 
  Sparkles, 
  Send,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { VlessConfig, ClientFormat } from '../types';
import { 
  generateVlessUri, 
  generateClashMetaYaml, 
  generateSingboxJson, 
  generateQuantumultX, 
  generateV2raynJson, 
  generateBase64Subscription 
} from '../utils/nodeGenerators';
import { isValidUuid, generateUuidV4 } from '../utils/uuid';
import { POPULAR_CLEAN_IPS, CLOUDFLARE_TLS_PORTS, CLOUDFLARE_HTTP_PORTS } from '../data/cleanIps';
import { QrCodeModal } from './QrCodeModal';

interface GeneratorTabProps {
  config: VlessConfig;
  setConfig: React.Dispatch<React.SetStateAction<VlessConfig>>;
  onAddToBatch: (cfg: VlessConfig) => void;
  onNavigateToWorkerScript: () => void;
}

export const GeneratorTab: React.FC<GeneratorTabProps> = ({
  config,
  setConfig,
  onAddToBatch,
  onNavigateToWorkerScript
}) => {
  const [activeFormat, setActiveFormat] = useState<ClientFormat>('vless-uri');
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [batchAddedNotice, setBatchAddedNotice] = useState(false);

  const isUuidValid = isValidUuid(config.uuid);
  const currentUri = generateVlessUri(config);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleGenerateUuid = () => {
    setConfig(prev => ({ ...prev, uuid: generateUuidV4() }));
  };

  const handleSelectCleanIp = (ipOrDomain: string, suggestedTls: boolean = true) => {
    setConfig(prev => ({
      ...prev,
      cleanIp: ipOrDomain,
      nodeName: `CF-${ipOrDomain.split('.')[0] || 'Node'}-${prev.security.toUpperCase()}-${prev.port}`
    }));
  };

  const handleAddToBatch = () => {
    onAddToBatch(config);
    setBatchAddedNotice(true);
    setTimeout(() => setBatchAddedNotice(false), 2500);
  };

  const getExportContent = (): string => {
    switch (activeFormat) {
      case 'vless-uri':
      case 'shadowrocket':
        return currentUri;
      case 'clash-meta':
        return generateClashMetaYaml(config);
      case 'sing-box':
        return generateSingboxJson(config);
      case 'quantumult-x':
        return generateQuantumultX(config);
      case 'v2rayn-json':
        return generateV2raynJson(config);
      case 'raw-base64':
        return generateBase64Subscription([config]);
      default:
        return currentUri;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Explanation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-orange-400 font-semibold text-sm">Serverless VLESS Architecture</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">Zero Server Cost · Cloudflare Global Edge</span>
            </div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight">
              Cloudflare Worker VLESS Node Generator
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              Construct high-performance VLESS over WebSocket configurations routed through Cloudflare's serverless Anycast network. Combine clean IP endpoints with your Worker domain to optimize latency and bypass ISP censorship.
            </p>
          </div>
          <button
            onClick={onNavigateToWorkerScript}
            className="self-start md:self-center px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Generate Worker Code</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-orange-400" />
                <h2 className="text-sm font-semibold text-slate-100">Primary Node Parameters</h2>
              </div>
              <span className="text-xs text-slate-500">WebSocket + TLS / HTTP</span>
            </div>

            {/* 1. Worker Domain / Host */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Cloudflare Worker / Custom Domain
                </label>
                <span className="text-xs text-slate-500">SNI & Host Header target</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={config.workerDomain}
                  onChange={(e) => {
                    const val = e.target.value.trim();
                    setConfig(prev => ({
                      ...prev,
                      workerDomain: val,
                      sni: prev.sni === prev.workerDomain || !prev.sni ? val : prev.sni,
                      host: prev.host === prev.workerDomain || !prev.host ? val : prev.host
                    }));
                  }}
                  placeholder="e.g. my-vless-worker.username.workers.dev or vless.yourdomain.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-orange-500 transition-colors"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                The deployed Cloudflare Worker address or bound custom domain (e.g. <span className="font-mono text-slate-400">vless.yourdomain.com</span>).
              </p>
            </div>

            {/* 2. User UUID */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  User ID (UUID v4)
                </label>
                <span className={`text-[11px] ${isUuidValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUuidValid ? '✓ Valid RFC4122 UUID' : '⚠ Invalid UUID format'}
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={config.uuid}
                  onChange={(e) => setConfig(prev => ({ ...prev, uuid: e.target.value.trim() }))}
                  placeholder="00000000-0000-0000-0000-000000000000"
                  className={`flex-1 bg-slate-950 border rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-hidden transition-colors ${
                    isUuidValid ? 'border-slate-800 focus:border-orange-500' : 'border-rose-600/60 focus:border-rose-500'
                  }`}
                />
                <button
                  onClick={handleGenerateUuid}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                  title="Generate Random UUID"
                >
                  <RotateCw className="w-3.5 h-3.5 text-orange-400" />
                  <span>Random</span>
                </button>
              </div>
            </div>

            {/* 3. Clean IP / Clean Domain */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Clean IP / Clean Domain (Connection Address)
                </label>
                <span className="text-xs text-slate-500">Fast CDN edge gateway</span>
              </div>
              <input
                type="text"
                value={config.cleanIp}
                onChange={(e) => setConfig(prev => ({ ...prev, cleanIp: e.target.value.trim() }))}
                placeholder="e.g. 104.16.0.1 or dash.cloudflare.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-orange-500 transition-colors"
              />

              {/* Quick Pick Clean IPs */}
              <div className="pt-1.5">
                <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>Quick Presets (Click to apply):</span>
                  <span className="text-slate-500">Curated low-latency Anycast IPs</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_CLEAN_IPS.slice(0, 6).map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectCleanIp(item.ipOrDomain)}
                      className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors ${
                        config.cleanIp === item.ipOrDomain
                          ? 'bg-orange-500/20 border-orange-500/50 text-orange-300 font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {item.ipOrDomain} {item.city ? `(${item.countryCode})` : ''}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Port & Security Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Security Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, security: 'tls', port: 443 }))}
                    className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-colors ${
                      config.security === 'tls'
                        ? 'bg-orange-500/15 border-orange-500/50 text-orange-400 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>TLS (Encrypted)</span>
                  </button>
                  <button
                    onClick={() => setConfig(prev => ({ ...prev, security: 'none', port: 80 }))}
                    className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 border transition-colors ${
                      config.security === 'none'
                        ? 'bg-orange-500/15 border-orange-500/50 text-orange-400 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>None (HTTP / 80)</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Cloudflare Supported Port
                </label>
                <select
                  value={config.port}
                  onChange={(e) => setConfig(prev => ({ ...prev, port: parseInt(e.target.value, 10) }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-hidden focus:border-orange-500 transition-colors"
                >
                  <optgroup label="TLS Standard Ports (Recommended)">
                    {CLOUDFLARE_TLS_PORTS.map(p => (
                      <option key={p} value={p}>{p} {p === 443 ? '(Default HTTPS)' : ''}</option>
                    ))}
                  </optgroup>
                  <optgroup label="HTTP Ports (Security None)">
                    {CLOUDFLARE_HTTP_PORTS.map(p => (
                      <option key={p} value={p}>{p} {p === 80 ? '(Default HTTP)' : ''}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* 5. Node Name */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-medium text-slate-300">
                Node Alias / Remark Name
              </label>
              <input
                type="text"
                value={config.nodeName}
                onChange={(e) => setConfig(prev => ({ ...prev, nodeName: e.target.value }))}
                placeholder="e.g. ⚡ CF-VLESS-TLS-SG-443"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Advanced Settings Accordion */}
            <div className="pt-2 border-t border-slate-800/80">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 py-1 transition-colors"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <Sliders className="w-3.5 h-3.5 text-orange-400" />
                  Advanced Routing (SNI, Host, WebSocket Path, 0-RTT Early Data)
                </span>
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvanced && (
                <div className="mt-3 space-y-3 pt-3 border-t border-slate-800/40">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Custom SNI (TLS ServerName)</label>
                      <input
                        type="text"
                        value={config.sni}
                        onChange={(e) => setConfig(prev => ({ ...prev, sni: e.target.value.trim() }))}
                        placeholder="Leave blank to use Worker Domain"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-hidden focus:border-orange-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Custom Host Header</label>
                      <input
                        type="text"
                        value={config.host}
                        onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value.trim() }))}
                        placeholder="Leave blank to use Worker Domain"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-hidden focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">WebSocket Path</label>
                      <input
                        type="text"
                        value={config.path}
                        onChange={(e) => setConfig(prev => ({ ...prev, path: e.target.value.trim() }))}
                        placeholder="/"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-hidden focus:border-orange-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2 bg-slate-950/60 border border-slate-800 rounded-lg mt-4 sm:mt-0">
                      <div>
                        <div className="text-xs text-slate-300 font-medium">0-RTT Early Data</div>
                        <div className="text-[10px] text-slate-500">Adds ?ed=2048 to path</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.earlyData}
                        onChange={(e) => setConfig(prev => ({ ...prev, earlyData: e.target.checked }))}
                        className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Output & Export (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-slate-100">Export & Import Ready</h2>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowQrModal(true)}
                  className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 text-xs"
                  title="Show QR Code for mobile scanning"
                >
                  <QrCode className="w-3.5 h-3.5 text-orange-400" />
                  <span className="hidden sm:inline">QR Code</span>
                </button>
              </div>
            </div>

            {/* Format Selector Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800/80 overflow-x-auto no-scrollbar">
              {[
                { id: 'vless-uri', label: 'VLESS URI' },
                { id: 'clash-meta', label: 'Clash Meta' },
                { id: 'sing-box', label: 'Sing-box' },
                { id: 'v2rayn-json', label: 'v2rayN JSON' },
                { id: 'quantumult-x', label: 'Quantumult X' },
                { id: 'raw-base64', label: 'Base64' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFormat(tab.id as ClientFormat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    activeFormat === tab.id
                      ? 'bg-slate-800 text-orange-400 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Live Code Area */}
            <div className="relative">
              <textarea
                readOnly
                rows={10}
                value={getExportContent()}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-200 leading-relaxed resize-none focus:outline-hidden selection:bg-orange-500/30 selection:text-orange-200"
              />
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                onClick={() => handleCopy(getExportContent())}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold bg-orange-600 hover:bg-orange-500 text-white transition-colors shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Config'}</span>
              </button>

              <button
                onClick={handleAddToBatch}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title="Add this node to Batch Matrix"
              >
                <Send className="w-3.5 h-3.5 text-orange-400" />
                <span>{batchAddedNotice ? '✓ Saved to Batch' : 'Add to Batch'}</span>
              </button>
            </div>

            {/* Node Summary Stats */}
            <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div className="bg-slate-950/40 p-2 rounded border border-slate-800/60">
                <span className="text-slate-500 block">Connection IP:</span>
                <span className="font-mono text-slate-200 truncate block">{config.cleanIp || config.workerDomain || 'Not set'}</span>
              </div>
              <div className="bg-slate-950/40 p-2 rounded border border-slate-800/60">
                <span className="text-slate-500 block">Port & Security:</span>
                <span className="font-mono text-slate-200 truncate block">{config.port} / {config.security.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Quick Client Compatibility Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Info className="w-4 h-4 text-orange-400" />
              <span>Supported Client Applications</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Paste the VLESS URI link directly or scan QR code on:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono">
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">v2rayNG (Android)</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">v2rayN (Windows)</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">Shadowrocket (iOS)</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">Sing-box (Cross-platform)</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">Mihomo / Clash Meta</span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">NekoBox / FoXray</span>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        title={config.nodeName || 'VLESS Node'}
        qrValue={currentUri}
      />
    </div>
  );
};
