import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Sliders, 
  HelpCircle, 
  Sparkles,
  Terminal,
  Shield,
  Layers
} from 'lucide-react';
import { WorkerScriptOptions } from '../types';
import { generateWorkerScript } from '../utils/workerScriptGenerator';
import { POPULAR_PROXY_IPS } from '../data/cleanIps';

interface WorkerScriptTabProps {
  currentUuid: string;
  workerDomain: string;
}

export const WorkerScriptTab: React.FC<WorkerScriptTabProps> = ({
  currentUuid,
  workerDomain
}) => {
  const [options, setOptions] = useState<WorkerScriptOptions>({
    uuid: currentUuid || 'd342d11e-d424-4583-b36e-524ab1f0afa4',
    proxyIp: '',
    fallbackSite: 'www.bing.com',
    enableSubEndpoint: true,
    enableDashboard: true,
    subTitle: 'Cloudflare-VLESS-Node'
  });

  const [copied, setCopied] = useState(false);
  const [deployMethod, setDeployMethod] = useState<'dashboard' | 'cli'>('dashboard');

  const generatedScript = generateWorkerScript(options);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedScript], { type: 'application/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '_worker.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-orange-400 font-semibold text-sm">ES Module Edge Worker</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">cloudflare:sockets TCP Tunneling</span>
            </div>
            <h1 className="text-lg font-bold text-slate-100 tracking-tight">
              Cloudflare Worker VLESS Backend Script
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              This JavaScript script runs entirely on Cloudflare's serverless edge without requiring any dedicated VPS. It listens for WebSocket upgrades, authenticates your client UUID, and pipes raw TCP stream requests using Cloudflare's high-speed Socket API.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download _worker.js</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Code' : 'Copy Script'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Customizer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-400" />
                <h2 className="text-sm font-semibold text-slate-100">Worker Configuration</h2>
              </div>
              <span className="text-xs text-slate-500">Auto-synced</span>
            </div>

            {/* 1. Auth UUID */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Authentication UUID
              </label>
              <input
                type="text"
                value={options.uuid}
                onChange={(e) => setOptions(prev => ({ ...prev, uuid: e.target.value.trim() }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-hidden focus:border-orange-500"
              />
              <p className="text-[11px] text-slate-500">
                Only client requests matching this UUID will be authenticated by the Worker.
              </p>
            </div>

            {/* 2. ProxyIP Setting */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  ProxyIP (Optional Edge Forwarder)
                </label>
                <span className="text-xs text-slate-500">Fix CF 1000/1008 errors</span>
              </div>
              <input
                type="text"
                value={options.proxyIp}
                onChange={(e) => setOptions(prev => ({ ...prev, proxyIp: e.target.value.trim() }))}
                placeholder="e.g. proxyip.aliyun.com or leave empty"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-hidden focus:border-orange-500"
              />
              <div className="pt-1">
                <div className="text-[11px] text-slate-400 mb-1">Recommended ProxyIPs:</div>
                <div className="flex flex-wrap gap-1">
                  {POPULAR_PROXY_IPS.slice(0, 4).map(ip => (
                    <button
                      key={ip}
                      onClick={() => setOptions(prev => ({ ...prev, proxyIp: prev.proxyIp === ip ? '' : ip }))}
                      className={`px-2 py-0.5 text-[11px] font-mono rounded border transition-colors ${
                        options.proxyIp === ip
                          ? 'bg-orange-500/20 border-orange-500/60 text-orange-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {ip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Camouflage Landing Website */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Camouflage Fallback Website
              </label>
              <input
                type="text"
                value={options.fallbackSite}
                onChange={(e) => setOptions(prev => ({ ...prev, fallbackSite: e.target.value.trim() }))}
                placeholder="e.g. www.bing.com or www.wikipedia.org"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-hidden focus:border-orange-500"
              />
              <p className="text-[11px] text-slate-500">
                Direct browser visits to your worker URL will display this harmless website.
              </p>
            </div>

            {/* 4. Feature Toggles */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <label className="text-xs font-medium text-slate-300 block">
                Integrated Edge Features
              </label>

              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                <div className="space-y-0.5">
                  <div className="text-xs font-medium text-slate-200">Built-in Subscription Server</div>
                  <div className="text-[11px] text-slate-500">Exposes <span className="font-mono text-slate-400">/sub</span> endpoint for auto-updating clients</div>
                </div>
                <input
                  type="checkbox"
                  checked={options.enableSubEndpoint}
                  onChange={(e) => setOptions(prev => ({ ...prev, enableSubEndpoint: e.target.checked }))}
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg">
                <div className="space-y-0.5">
                  <div className="text-xs font-medium text-slate-200">Camouflage Gateway UI</div>
                  <div className="text-[11px] text-slate-500">Renders a professional status page on HTTP GET</div>
                </div>
                <input
                  type="checkbox"
                  checked={options.enableDashboard}
                  onChange={(e) => setOptions(prev => ({ ...prev, enableDashboard: e.target.checked }))}
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Quick Deploy Cheatsheet */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-orange-400" />
                <span>Deployment Instructions</span>
              </h3>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setDeployMethod('dashboard')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    deployMethod === 'dashboard' ? 'bg-orange-500/20 text-orange-400 font-semibold' : 'text-slate-400'
                  }`}
                >
                  Web UI
                </button>
                <button
                  onClick={() => setDeployMethod('cli')}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    deployMethod === 'cli' ? 'bg-orange-500/20 text-orange-400 font-semibold' : 'text-slate-400'
                  }`}
                >
                  CLI
                </button>
              </div>
            </div>

            {deployMethod === 'dashboard' ? (
              <ol className="text-xs text-slate-400 space-y-1.5 list-decimal pl-4">
                <li>Log in to <span className="text-slate-200">dash.cloudflare.com</span>.</li>
                <li>Go to <strong className="text-slate-200">Workers & Pages</strong> → <strong className="text-slate-200">Create Worker</strong>.</li>
                <li>Click <strong className="text-slate-200">Deploy</strong>, then click <strong className="text-slate-200">Edit Code</strong>.</li>
                <li>Replace existing code with the generated script on the right.</li>
                <li>Click <strong className="text-orange-400">Save and Deploy</strong>.</li>
              </ol>
            ) : (
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
                <div># 1. Initialize Wrangler directory</div>
                <div className="text-orange-300">npx wrangler init vless-worker</div>
                <div># 2. Paste script into src/index.js</div>
                <div className="text-orange-300">npx wrangler deploy</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Code Viewer (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-mono font-medium text-slate-200">_worker.js (ES Module)</span>
              <span className="text-[11px] text-slate-500">· {generatedScript.split('\n').length} lines</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
            <div className="max-h-[620px] overflow-y-auto p-4 font-mono text-xs text-slate-300 leading-relaxed no-scrollbar selection:bg-orange-500/30 selection:text-orange-200">
              <pre className="whitespace-pre">
                {generatedScript}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
