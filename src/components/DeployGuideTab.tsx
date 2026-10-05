import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  HelpCircle, 
  AlertTriangle, 
  Smartphone, 
  Monitor, 
  Apple, 
  Layers,
  ChevronRight,
  Globe
} from 'lucide-react';

export const DeployGuideTab: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeClientTab, setActiveClientTab] = useState<'v2rayng' | 'v2rayn' | 'shadowrocket' | 'clash'>('v2rayng');

  const handleCopySnippet = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-orange-400 font-semibold text-sm">Step-by-Step Deployment Protocol</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">100% Free Serverless Edge Setup</span>
          </div>
          <h1 className="text-lg font-bold text-slate-100 tracking-tight">
            Deploying VLESS on Cloudflare Workers
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
            Follow this illustrated deployment blueprint to deploy your VLESS backend script to Cloudflare's serverless edge within 3 minutes.
          </p>
        </div>
      </div>

      {/* 4 Step Workflow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-xs font-bold text-orange-400">
                1
              </div>
              <h2 className="text-sm font-semibold text-slate-100">Create Free Cloudflare Worker</h2>
            </div>
            <a
              href="https://dash.cloudflare.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <span>dash.cloudflare.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <ol className="text-xs text-slate-400 space-y-2 list-decimal pl-4 leading-relaxed">
            <li>Log in or create an account at <strong className="text-slate-200">Cloudflare Dashboard</strong>.</li>
            <li>In the left sidebar, click <strong className="text-slate-200">Workers & Pages</strong>.</li>
            <li>Click the blue <strong className="text-slate-200">Create application</strong> button, then choose <strong className="text-slate-200">Create Worker</strong>.</li>
            <li>Name your worker (e.g. <span className="font-mono text-slate-300">vless-node</span>) and click <strong className="text-slate-200">Deploy</strong>.</li>
          </ol>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-xs font-bold text-orange-400">
              2
            </div>
            <h2 className="text-sm font-semibold text-slate-100">Paste Script & Save</h2>
          </div>

          <ol className="text-xs text-slate-400 space-y-2 list-decimal pl-4 leading-relaxed">
            <li>In your newly created Worker page, click <strong className="text-slate-200">Edit code</strong> (Quick Edit).</li>
            <li>Select all existing code in the editor and press delete.</li>
            <li>Go to the <strong className="text-orange-400">Worker Script</strong> tab here, copy the generated code, and paste it into Cloudflare editor.</li>
            <li>Click the blue <strong className="text-slate-200">Save and deploy</strong> button in the top right.</li>
          </ol>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-xs font-bold text-orange-400">
                3
              </div>
              <h2 className="text-sm font-semibold text-slate-100">Bind Custom Domain (Crucial)</h2>
            </div>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-medium">
              Recommended
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Many ISPs block the default <span className="font-mono text-slate-300">*.workers.dev</span> domain. Binding a free or custom domain avoids DNS poisoning:
          </p>

          <ol className="text-xs text-slate-400 space-y-1.5 list-decimal pl-4">
            <li>In your Worker settings, go to <strong className="text-slate-200">Settings → Domains & Routes</strong>.</li>
            <li>Click <strong className="text-slate-200">Add → Custom Domain</strong>.</li>
            <li>Enter your subdomain (e.g. <span className="font-mono text-slate-300">vless.yourdomain.com</span>). Cloudflare automatically issues SSL certificates.</li>
          </ol>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-xs font-bold text-orange-400">
              4
            </div>
            <h2 className="text-sm font-semibold text-slate-100">Import Node to Client App</h2>
          </div>

          <ol className="text-xs text-slate-400 space-y-2 list-decimal pl-4 leading-relaxed">
            <li>Generate your VLESS URI or Batch Subscription link from the Generator tabs.</li>
            <li>Open your client app (<strong className="text-slate-200">v2rayNG / v2rayN / Shadowrocket / Sing-box</strong>).</li>
            <li>Select <strong className="text-slate-200">Import from Clipboard</strong> or <strong className="text-slate-200">Scan QR Code</strong>.</li>
            <li>Run a ping test and toggle the connection on.</li>
          </ol>
        </div>
      </div>

      {/* Client-Specific Setup Guides */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-semibold text-slate-100">Client-Specific Import Guides</h2>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[
              { id: 'v2rayng', label: 'v2rayNG (Android)', icon: Smartphone },
              { id: 'v2rayn', label: 'v2rayN (Windows)', icon: Monitor },
              { id: 'shadowrocket', label: 'Shadowrocket (iOS)', icon: Apple },
              { id: 'clash', label: 'Clash / Mihomo', icon: Layers }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveClientTab(tab.id as any)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeClientTab === tab.id
                    ? 'bg-slate-800 text-orange-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {activeClientTab === 'v2rayng' && (
          <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
            <h3 className="text-slate-200 font-medium">v2rayNG for Android:</h3>
            <p>1. Copy the VLESS URI or click the QR Code button in this app.</p>
            <p>2. Open v2rayNG on your Android device and tap the <strong className="text-slate-200">+</strong> icon in the top right corner.</p>
            <p>3. Choose <strong className="text-slate-200">Import config from Clipboard</strong> (or <strong className="text-slate-200">Scan QR Code</strong>).</p>
            <p>4. Tap the three dots menu → <strong className="text-slate-200">Real delay all</strong> to verify edge response time, then tap the V icon at the bottom to connect.</p>
          </div>
        )}

        {activeClientTab === 'v2rayn' && (
          <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
            <h3 className="text-slate-200 font-medium">v2rayN for Windows:</h3>
            <p>1. Copy your VLESS link to the clipboard.</p>
            <p>2. In the v2rayN main window, press <strong className="text-slate-200 font-mono">Ctrl + V</strong> (or Servers → Import bulk URL from clipboard).</p>
            <p>3. Select the node and press <strong className="text-slate-200 font-mono">Ctrl + R</strong> to test real delay (TCP ping).</p>
            <p>4. Right-click the tray icon and ensure System Proxy is set to <strong className="text-slate-200">Set system proxy</strong> (Routing: Bypass LAN & Mainland).</p>
          </div>
        )}

        {activeClientTab === 'shadowrocket' && (
          <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
            <h3 className="text-slate-200 font-medium">Shadowrocket for iOS:</h3>
            <p>1. Copy the VLESS link or open the QR code modal in this app.</p>
            <p>2. Open Shadowrocket on iPhone/iPad. The app will automatically prompt <strong className="text-slate-200">"Add node from clipboard?"</strong></p>
            <p>3. Tap <strong className="text-slate-200">Add</strong> or use the camera icon in the top left to scan the QR code.</p>
            <p>4. Select the node and switch the top toggle to <strong className="text-slate-200">Connected</strong>.</p>
          </div>
        )}

        {activeClientTab === 'clash' && (
          <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
            <h3 className="text-slate-200 font-medium">Clash Meta / Mihomo:</h3>
            <p>1. Switch to the <strong className="text-slate-200">Clash Meta</strong> tab on the Node Generator or Batch Matrix view.</p>
            <p>2. Copy the generated YAML configuration or save it as <span className="font-mono text-slate-300">config.yaml</span>.</p>
            <p>3. Import the configuration into Clash Verge Rev, Mihomo Party, or Flclash.</p>
            <p>4. Enable TUN mode or System Proxy.</p>
          </div>
        )}
      </div>

      {/* Troubleshooting Common Errors */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
          <HelpCircle className="w-4 h-4 text-orange-400" />
          <span>Troubleshooting & FAQ</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Cloudflare Error 1000 / 1008 (DNS Prohibited)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>Cause:</strong> Cloudflare does not allow a Worker to proxy directly to other Cloudflare reverse proxy IPs without an intermediate ProxyIP.
              <br />
              <strong>Fix:</strong> In the Worker Script tab, set a ProxyIP (e.g. <span className="font-mono text-slate-300">proxyip.aliyun.com</span> or <span className="font-mono text-slate-300">cdn.anycast.eu.org</span>) and re-deploy.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SSL Handshake / EOF Error</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>Cause:</strong> The client TLS SNI does not match your Cloudflare Worker domain, or you selected an unencrypted port while having TLS enabled.
              <br />
              <strong>Fix:</strong> Verify that SNI in your client matches your Worker domain, and port is set to 443 or 8443.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Cannot connect with *.workers.dev domain</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>Cause:</strong> The <span className="font-mono text-slate-300">workers.dev</span> suffix is filtered by national firewalls or local ISPs.
              <br />
              <strong>Fix:</strong> Bind a custom domain (e.g. <span className="font-mono text-slate-300">vless.yourdomain.com</span>) in your Cloudflare Worker settings under Triggers / Custom Domains.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>High Latency or Packet Loss</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              <strong>Cause:</strong> The default DNS IP routed your traffic to a distant continent.
              <br />
              <strong>Fix:</strong> Use the <strong className="text-slate-200">Clean IP Directory</strong> tab to select an Anycast IP geographically close to you (e.g. Singapore / Hong Kong for Asia, Frankfurt for Europe).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
