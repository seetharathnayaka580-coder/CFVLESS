import React from 'react';
import { Zap, KeyRound } from 'lucide-react';

export type ActiveTab = 'generator' | 'worker-script' | 'batch' | 'clean-ips' | 'deploy-guide' | 'validator';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onGenerateNewUuid: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onGenerateNewUuid
}) => {
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'generator', label: 'Node Generator' },
    { id: 'worker-script', label: 'Worker Script' },
    { id: 'batch', label: 'Batch Matrix' },
    { id: 'clean-ips', label: 'Clean IP Directory' },
    { id: 'deploy-guide', label: 'Deploy Guide' },
    { id: 'validator', label: 'URI Diagnostic' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
            <Zap className="w-4 h-4 text-orange-400" />
          </div>
          <button
            onClick={() => setActiveTab('generator')}
            className="text-left font-bold text-slate-100 text-base tracking-tight hover:text-orange-400 transition-colors"
          >
            Cloudflare VLESS Studio
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1 rounded-lg border border-slate-800/80">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-orange-400 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={onGenerateNewUuid}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap"
            title="Generate fresh UUID"
          >
            <KeyRound className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">New UUID</span>
          </button>

          <button
            onClick={() => setActiveTab('worker-script')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Get Worker Script</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-2 border-t border-slate-850 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-orange-600/20 text-orange-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
