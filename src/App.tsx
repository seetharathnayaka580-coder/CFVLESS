/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { GeneratorTab } from './components/GeneratorTab';
import { WorkerScriptTab } from './components/WorkerScriptTab';
import { BatchGeneratorTab } from './components/BatchGeneratorTab';
import { CleanIpDirectoryTab } from './components/CleanIpDirectoryTab';
import { DeployGuideTab } from './components/DeployGuideTab';
import { ConfigValidatorTab } from './components/ConfigValidatorTab';
import { VlessConfig } from './types';
import { generateUuidV4 } from './utils/uuid';
import { POPULAR_CLEAN_IPS } from './data/cleanIps';
import { Zap, Shield, Globe2, Sparkles, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('generator');

  // Primary Single Node State
  const [config, setConfig] = useState<VlessConfig>({
    id: 'node-primary',
    uuid: generateUuidV4(),
    workerDomain: 'vless.my-fast-node.workers.dev',
    cleanIp: '104.16.0.1',
    port: 443,
    security: 'tls',
    sni: 'vless.my-fast-node.workers.dev',
    host: 'vless.my-fast-node.workers.dev',
    path: '/',
    earlyData: true,
    earlyDataLength: 2048,
    nodeName: '⚡ CF-VLESS-Global-443'
  });

  // Batch Multi-Node State initialized with curated regional presets
  const [batchNodes, setBatchNodes] = useState<VlessConfig[]>([
    {
      id: 'batch-init-1',
      uuid: config.uuid,
      workerDomain: 'vless.my-fast-node.workers.dev',
      cleanIp: '104.16.51.111',
      port: 443,
      security: 'tls',
      sni: 'vless.my-fast-node.workers.dev',
      host: 'vless.my-fast-node.workers.dev',
      path: '/?ed=2048',
      earlyData: true,
      earlyDataLength: 2048,
      nodeName: '⚡ CF-SG-Singapore-443'
    },
    {
      id: 'batch-init-2',
      uuid: config.uuid,
      workerDomain: 'vless.my-fast-node.workers.dev',
      cleanIp: '104.16.148.118',
      port: 443,
      security: 'tls',
      sni: 'vless.my-fast-node.workers.dev',
      host: 'vless.my-fast-node.workers.dev',
      path: '/',
      earlyData: false,
      earlyDataLength: 2048,
      nodeName: '⚡ CF-HK-HongKong-443'
    },
    {
      id: 'batch-init-3',
      uuid: config.uuid,
      workerDomain: 'vless.my-fast-node.workers.dev',
      cleanIp: '104.16.24.168',
      port: 8443,
      security: 'tls',
      sni: 'vless.my-fast-node.workers.dev',
      host: 'vless.my-fast-node.workers.dev',
      path: '/',
      earlyData: false,
      earlyDataLength: 2048,
      nodeName: '⚡ CF-JP-Tokyo-8443'
    },
    {
      id: 'batch-init-4',
      uuid: config.uuid,
      workerDomain: 'vless.my-fast-node.workers.dev',
      cleanIp: '104.16.120.127',
      port: 443,
      security: 'tls',
      sni: 'vless.my-fast-node.workers.dev',
      host: 'vless.my-fast-node.workers.dev',
      path: '/?ed=2048',
      earlyData: true,
      earlyDataLength: 2048,
      nodeName: '⚡ CF-DE-Frankfurt-443'
    }
  ]);

  const handleGenerateNewUuid = () => {
    const newUuid = generateUuidV4();
    setConfig(prev => ({ ...prev, uuid: newUuid }));
    setBatchNodes(prev => prev.map(n => ({ ...n, uuid: newUuid })));
  };

  const handleAddToBatch = (newNode: VlessConfig) => {
    const nodeCopy: VlessConfig = {
      ...newNode,
      id: `batch-${Date.now()}`
    };
    setBatchNodes(prev => [nodeCopy, ...prev]);
  };

  const handleApplyCleanIpFromDirectory = (ipOrDomain: string) => {
    setConfig(prev => ({
      ...prev,
      cleanIp: ipOrDomain,
      nodeName: `⚡ CF-${ipOrDomain.split('.')[0] || 'Node'}-${prev.security.toUpperCase()}-${prev.port}`
    }));
    setActiveTab('generator');
  };

  const handleLoadRepairedConfig = (repaired: VlessConfig) => {
    setConfig(repaired);
    setActiveTab('generator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-orange-500/30 selection:text-orange-200 font-sans">
      {/* 3-Zone Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGenerateNewUuid={handleGenerateNewUuid}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'generator' && (
          <GeneratorTab
            config={config}
            setConfig={setConfig}
            onAddToBatch={handleAddToBatch}
            onNavigateToWorkerScript={() => setActiveTab('worker-script')}
          />
        )}

        {activeTab === 'worker-script' && (
          <WorkerScriptTab
            currentUuid={config.uuid}
            workerDomain={config.workerDomain}
          />
        )}

        {activeTab === 'batch' && (
          <BatchGeneratorTab
            batchNodes={batchNodes}
            setBatchNodes={setBatchNodes}
            defaultUuid={config.uuid}
            defaultWorkerDomain={config.workerDomain}
          />
        )}

        {activeTab === 'clean-ips' && (
          <CleanIpDirectoryTab
            onApplyCleanIp={handleApplyCleanIpFromDirectory}
          />
        )}

        {activeTab === 'deploy-guide' && (
          <DeployGuideTab />
        )}

        {activeTab === 'validator' && (
          <ConfigValidatorTab
            onLoadIntoGenerator={handleLoadRepairedConfig}
          />
        )}
      </main>

      {/* Refined Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Cloudflare Worker VLESS Studio</span>
            <span>·</span>
            <span>Serverless Network Engineering</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setActiveTab('deploy-guide')}
              className="hover:text-slate-300 transition-colors"
            >
              Deployment Guide
            </button>
            <button
              onClick={() => setActiveTab('clean-ips')}
              className="hover:text-slate-300 transition-colors"
            >
              Clean IP Directory
            </button>
            <button
              onClick={() => setActiveTab('worker-script')}
              className="hover:text-slate-300 transition-colors"
            >
              _worker.js Script
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
