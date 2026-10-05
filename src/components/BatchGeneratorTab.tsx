import React, { useState } from 'react';
import { 
  Layers, 
  Copy, 
  Check, 
  QrCode, 
  Trash2, 
  Plus, 
  Download, 
  Sparkles,
  Sliders,
  Globe
} from 'lucide-react';
import { VlessConfig, ClientFormat } from '../types';
import { 
  generateVlessUri, 
  generateClashMetaYaml, 
  generateSingboxJson, 
  generateBase64Subscription 
} from '../utils/nodeGenerators';
import { POPULAR_CLEAN_IPS, CLOUDFLARE_TLS_PORTS } from '../data/cleanIps';
import { QrCodeModal } from './QrCodeModal';

interface BatchGeneratorTabProps {
  batchNodes: VlessConfig[];
  setBatchNodes: React.Dispatch<React.SetStateAction<VlessConfig[]>>;
  defaultUuid: string;
  defaultWorkerDomain: string;
}

export const BatchGeneratorTab: React.FC<BatchGeneratorTabProps> = ({
  batchNodes,
  setBatchNodes,
  defaultUuid,
  defaultWorkerDomain
}) => {
  const [activeExportFormat, setActiveExportFormat] = useState<ClientFormat>('vless-uri');
  const [copied, setCopied] = useState(false);
  const [selectedQrNode, setSelectedQrNode] = useState<{ name: string; uri: string } | null>(null);

  // Quick Preset: Generate 5 Regional Clean IP Nodes
  const handleGenerateRegionalMatrix = () => {
    const selectedIps = POPULAR_CLEAN_IPS.slice(0, 8);
    const newNodes: VlessConfig[] = selectedIps.map((item, idx) => {
      const isDomain = item.type === 'domain';
      const port = isDomain ? 443 : (idx % 2 === 0 ? 443 : 8443);
      return {
        id: `batch-${Date.now()}-${idx}`,
        uuid: defaultUuid,
        workerDomain: defaultWorkerDomain || 'my-worker.username.workers.dev',
        cleanIp: item.ipOrDomain,
        port: port,
        security: 'tls',
        sni: defaultWorkerDomain || 'my-worker.username.workers.dev',
        host: defaultWorkerDomain || 'my-worker.username.workers.dev',
        path: idx % 3 === 0 ? '/?ed=2048' : '/',
        earlyData: idx % 3 === 0,
        earlyDataLength: 2048,
        nodeName: `⚡ CF-${item.countryCode || 'Global'}-${item.city?.split(' ')[0] || 'Node'}-${port}`
      };
    });

    setBatchNodes(newNodes);
  };

  const handleClearAll = () => {
    setBatchNodes([]);
  };

  const handleRemoveNode = (id: string) => {
    setBatchNodes(prev => prev.filter(n => n.id !== id));
  };

  const handleCopyExport = async () => {
    try {
      await navigator.clipboard.writeText(getBatchExportString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const getBatchExportString = (): string => {
    if (batchNodes.length === 0) return 'No nodes in batch matrix.';
    
    switch (activeExportFormat) {
      case 'vless-uri':
        return batchNodes.map(n => generateVlessUri(n)).join('\n');
      case 'raw-base64':
        return generateBase64Subscription(batchNodes);
      case 'clash-meta':
        return generateClashMetaYaml(batchNodes);
      case 'sing-box':
        return generateSingboxJson(batchNodes);
      default:
        return batchNodes.map(n => generateVlessUri(n)).join('\n');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-orange-400 font-semibold text-sm">Multi-Node Subscription Matrix</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">{batchNodes.length} Active Nodes</span>
            </div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight">
              Batch VLESS Nodes & Subscription Builder
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              Combine multiple low-latency Clean IPs across Singapore, Hong Kong, Tokyo, Frankfurt, and North America into a single multi-proxy configuration with automatic failover groups.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleGenerateRegionalMatrix}
              className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate 8x Regional Matrix</span>
            </button>
            {batchNodes.length > 0 && (
              <button
                onClick={handleClearAll}
                className="p-2 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 rounded-lg border border-slate-700 transition-colors"
                title="Clear all batch nodes"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Node List Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-400" />
                <h2 className="text-sm font-semibold text-slate-100">Configured Node Entries</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Total: {batchNodes.length}</span>
            </div>

            {batchNodes.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Globe className="w-10 h-10 text-slate-600 mx-auto" />
                <div className="text-slate-300 font-medium text-sm">No batch nodes created yet</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click "Generate 8x Regional Matrix" or add nodes from the Single Generator tab to populate your subscription bundle.
                </p>
                <button
                  onClick={handleGenerateRegionalMatrix}
                  className="px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 text-xs font-medium rounded-lg border border-orange-500/40 transition-colors inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Build Regional Matrix</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                {batchNodes.map((node, index) => {
                  const uri = generateVlessUri(node);
                  return (
                    <div
                      key={node.id}
                      className="p-3 bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 rounded-lg flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-200 truncate">
                            {node.nodeName}
                          </span>
                          <span className="text-[10px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                            {node.port}
                          </span>
                          <span className="text-[10px] text-orange-400 font-mono uppercase">
                            {node.security}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 truncate">
                          <span>IP: {node.cleanIp}</span>
                          <span>·</span>
                          <span className="truncate">SNI: {node.sni || node.workerDomain}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setSelectedQrNode({ name: node.nodeName, uri })}
                          className="p-1.5 text-slate-400 hover:text-orange-400 hover:bg-slate-800 rounded transition-colors"
                          title="Show QR Code"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={async () => {
                            await navigator.clipboard.writeText(uri);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
                          title="Copy single URI"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveNode(node.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                          title="Remove node"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Combined Export (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-semibold text-slate-100">Batch Subscription Bundle</h2>
              <span className="text-xs text-slate-500">Multi-Client Export</span>
            </div>

            {/* Export Format Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {[
                { id: 'vless-uri', label: 'VLESS URI List' },
                { id: 'raw-base64', label: 'Base64 Sub' },
                { id: 'clash-meta', label: 'Clash Meta' },
                { id: 'sing-box', label: 'Sing-box' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveExportFormat(tab.id as ClientFormat)}
                  className={`flex-1 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    activeExportFormat === tab.id
                      ? 'bg-slate-800 text-orange-400 font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Textarea Code Preview */}
            <textarea
              readOnly
              rows={12}
              value={getBatchExportString()}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 leading-relaxed resize-none focus:outline-hidden selection:bg-orange-500/30 selection:text-orange-200"
            />

            {/* Action Buttons */}
            <button
              disabled={batchNodes.length === 0}
              onClick={handleCopyExport}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-colors shadow-sm ${
                batchNodes.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-orange-600 hover:bg-orange-500 text-white'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Batch Config' : `Copy All (${batchNodes.length} Nodes)`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal for Single Node in Batch */}
      {selectedQrNode && (
        <QrCodeModal
          isOpen={!!selectedQrNode}
          onClose={() => setSelectedQrNode(null)}
          title={selectedQrNode.name}
          qrValue={selectedQrNode.uri}
        />
      )}
    </div>
  );
};
