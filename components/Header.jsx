'use client';

import { 
  Search, 
  Plus, 
  Bell, 
  Settings, 
  Sun, 
  Moon, 
  Users, 
  Command, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
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
  theme = 'light',
  onToggleTheme,
  currentUser,
  onOpenLogin,
}) {
  return (
    <header className="sticky top-0 z-30 h-14 px-4 sm:px-6 bg-[var(--bg-card)] border-b border-[var(--border-subtle)] flex items-center justify-between gap-4 select-none transition-colors duration-150">
      {/* Left: Brand Mark, Global Nav & Create CTA */}
      <div className="flex items-center gap-4 lg:gap-6 min-w-0">
        {/* Brand Mark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-md bg-[#0C66E4] flex items-center justify-center text-white shadow-sm shadow-[#0C66E4]/20">
            <ApexLogo size={16} />
          </div>
          <span className="font-headline text-[17px] font-bold tracking-tight text-[var(--text-main)]">
            Jira
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-surface-container)] text-[var(--text-subtle)] border border-[var(--border-subtle)]">
            Apex v2
          </span>
        </div>

        {/* Global Nav Links */}
        <nav aria-label="Global navigation" className="hidden md:flex items-center gap-1 text-xs">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-3 py-1.5 rounded font-label transition-colors ${
              activeTab === 'summary'
                ? 'text-[#0C66E4] bg-[var(--status-progress-bg)] font-semibold'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-low)] hover:text-[var(--text-main)]'
            }`}
          >
            Summary
          </button>

          <button
            onClick={() => setActiveTab('board')}
            className={`px-3 py-1.5 rounded font-label transition-colors ${
              activeTab === 'board' || activeTab === 'backlog'
                ? 'text-[#0C66E4] bg-[var(--status-progress-bg)] font-semibold'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-low)] hover:text-[var(--text-main)]'
            }`}
          >
            Projects
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded font-label transition-colors ${
              activeTab === 'timeline'
                ? 'text-[#0C66E4] bg-[var(--status-progress-bg)] font-semibold'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-low)] hover:text-[var(--text-main)]'
            }`}
          >
            Timeline
          </button>

          <button
            onClick={() => setActiveTab('issues')}
            className={`px-3 py-1.5 rounded font-label transition-colors ${
              activeTab === 'issues'
                ? 'text-[#0C66E4] bg-[var(--status-progress-bg)] font-semibold'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-low)] hover:text-[var(--text-main)]'
            }`}
          >
            Filters
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`px-3 py-1.5 rounded font-label transition-colors ${
              activeTab === 'team'
                ? 'text-[#0C66E4] bg-[var(--status-progress-bg)] font-semibold'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-low)] hover:text-[var(--text-main)]'
            }`}
          >
            Teams
          </button>
        </nav>

        {/* Primary Atlassian Cobalt Create CTA */}
        <button
          onClick={onNewIssue}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-[#004FB6] hover:bg-[#0C66E4] active:bg-[#003882] text-white font-label font-medium text-xs shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create</span>
        </button>
      </div>

      {/* Right: Search, Standup Mode, Theme Toggle, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Bar (with ⌘K trigger) */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-[var(--bg-surface-low)] hover:bg-[var(--bg-surface-container)] border border-[var(--border-subtle)] text-[var(--text-subtle)] hover:text-[var(--text-main)] text-xs transition-colors w-40 sm:w-56 justify-between"
          title="Search issues, projects (⌘K)"
        >
          <div className="flex items-center gap-1.5 truncate">
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate text-[11px]">Search Jira</span>
          </div>
          <kbd className="hidden sm:inline-flex text-[10px] font-mono px-1 py-0.5 rounded bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-subtle)]">
            ⌘K
          </kbd>
        </button>

        {/* Live Daily Standup Button */}
        {onOpenStandup && (
          <button
            onClick={onOpenStandup}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[var(--status-progress-bg)] text-[#0C66E4] hover:bg-[#0C66E4] hover:text-white border border-[#0C66E4]/30 text-xs font-label font-medium transition-all group"
            title="Launch Live Daily Standup (Shift+S)"
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden lg:inline">Standup</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        )}

        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded hover:bg-[var(--bg-surface-low)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          title={theme === 'dark' ? 'Switch to Atlassian Light' : 'Switch to Atlassian Dark'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Settings Action */}
        <button
          onClick={() => setActiveTab('settings')}
          className="p-1.5 rounded hover:bg-[var(--bg-surface-low)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors hidden sm:block"
          title="Project settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* User Avatar with Persona Trigger */}
        <button
          onClick={onOpenLogin}
          className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-[#0C66E4] transition-all"
          title="Switch persona or account"
        >
          <div className="w-7 h-7 rounded-full bg-[#0C66E4] text-white flex items-center justify-center font-mono font-bold text-[11px] ring-1 ring-[var(--border-subtle)]">
            {currentUser?.avatar_initials || (currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'BP')}
          </div>
        </button>
      </div>
    </header>
  );
}
