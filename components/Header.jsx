'use client';

import { Search, Plus, ShieldAlert, AlertCircle, ChevronDown, Sparkles, Users } from 'lucide-react';
import ApexLogo from '@/components/ApexLogo';

export default function Header({
  activeTab,
  setActiveTab,
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  onNewIssue,
  onOpenCommandPalette,
  onOpenStandup,
  activeSprint,
  sprintStats,
}) {
  const completedPct = sprintStats?.total_points > 0
    ? Math.round((sprintStats.completed_points / sprintStats.total_points) * 100)
    : 0;

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#09090b]/95 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-2.5 gap-4">
        {/* Left: Brand Breadcrumb & Sprint Indicator */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600/15 border border-blue-500/25 flex items-center justify-center shrink-0">
              <ApexLogo size={14} />
            </div>
            <span className="font-semibold text-xs tracking-tight text-zinc-100 hidden sm:inline">
              Apex
            </span>
          </div>

          <span className="text-zinc-600 text-xs">/</span>

          {/* Active Sprint Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900/80 border border-white/[0.07] text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-zinc-200 truncate max-w-[140px]">
              {activeSprint?.name || 'Sprint 24.1'}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="font-mono text-[11px] text-zinc-400">
              {sprintStats?.completed_points || 0}/{sprintStats?.total_points || 0} pts
            </span>
          </div>
        </div>

        {/* Center: Linear-style Segmented View Switcher */}
        <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-white/[0.06]">
          {[
            { id: 'board', label: 'Board' },
            { id: 'backlog', label: 'Backlog' },
            { id: 'releases', label: 'Releases' },
            { id: 'analytics', label: 'Cockpit' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-zinc-800 text-white shadow-sm border border-white/[0.08]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right: Search, Filter, New Issue */}
        <div className="flex items-center gap-2">
          {/* Quick Filters Pill Group */}
          <div className="hidden lg:flex items-center p-0.5 rounded-lg bg-zinc-900/60 border border-white/[0.05] text-xs">
            {[
              { id: 'all', label: 'All' },
              { id: 'my', label: 'Mine' },
              { id: 'blocked', label: 'Blocked', icon: ShieldAlert },
            ].map((f) => {
              const Icon = f.icon;
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors ${
                    isActive
                      ? 'bg-zinc-800 text-white font-medium border border-white/[0.08]'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {Icon && <Icon className="w-3 h-3 text-rose-400" />}
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>

          {/* Daily Standup Mode Button */}
          <button
            onClick={onOpenStandup}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.08] hover:border-blue-500/30 text-zinc-300 hover:text-white text-xs font-medium transition-all group shadow-sm"
            title="Launch Daily Standup Mode (Shift+S)"
          >
            <Users className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Daily Standup</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Quick Search */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-zinc-900/70 hover:bg-zinc-900 border border-white/[0.07] text-zinc-400 hover:text-zinc-200 text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <kbd className="hidden md:inline text-[10px] font-mono bg-zinc-800/80 text-zinc-400 px-1 py-0.5 rounded border border-white/[0.05]">
              ⌘K
            </kbd>
          </button>

          {/* New Issue Button */}
          <button
            onClick={onNewIssue}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all active:scale-[0.98] shadow-sm shadow-blue-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Issue</span>
          </button>
        </div>
      </div>
    </header>
  );
}
