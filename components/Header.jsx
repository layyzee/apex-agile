'use client';

import { 
  Menu, 
  Search, 
  Users, 
  Sun, 
  Moon, 
  Bell, 
  Settings, 
  Boxes,
  Kanban,
  ListTodo,
  Layers,
  LayoutDashboard
} from 'lucide-react';
import Avatar from './Avatar';

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
  theme = 'light',
  onToggleTheme,
  currentUser,
  onOpenLogin,
  onToggleSidebar,
}) {
  const navItems = [
    { id: 'summary', label: 'Your work' },
    { id: 'board', label: 'Projects' },
    { id: 'issues', label: 'Filters' },
    { id: 'timeline', label: 'Dashboards' },
    { id: 'team', label: 'Teams' },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 h-14 px-3 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 sm:gap-6 select-none">
        {/* Left Side: Brand Mark, Sprint Context on Mobile, Global Navigation on Desktop */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Mobile menu toggle */}
          <button
            onClick={onToggleSidebar}
            type="button"
            aria-label="Open project navigation"
            className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Mark & Mobile Title */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer min-w-0 shrink-0" 
            onClick={() => setActiveTab('board')}
          >
            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Boxes className="w-4 h-4" />
            </div>
            {/* Desktop Brand text */}
            <span className="hidden sm:inline font-headline text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Jira
            </span>
            {/* Mobile Sprint Context */}
            <div className="sm:hidden min-w-0">
              <p className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                PLAT Sprint 42
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                6 days remaining
              </p>
            </div>
          </div>

          {/* Subtle vertical divider between Brand and Nav on desktop */}
          <div className="hidden md:block h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 shrink-0" />

          {/* Global Navigation Links (Desktop) */}
          <nav aria-label="Global navigation" className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === 'board' && activeTab === 'backlog');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Create CTA, Search, Standup, Theme Toggle, User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Primary Create Button */}
          <button
            onClick={onNewIssue}
            type="button"
            className="inline-flex items-center justify-center px-3.5 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 active:opacity-90 font-medium text-sm transition-colors cursor-pointer shadow-xs shrink-0"
          >
            Create
          </button>

          {/* Global Searchbar (Desktop only) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onOpenCommandPalette && onOpenCommandPalette();
            }}
            role="search"
            className="hidden sm:flex relative items-center w-56 md:w-64 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-blue-500 transition-colors"
          >
            <button type="submit" aria-label="Submit search" className="pl-2.5 pr-1.5 text-slate-400 dark:text-slate-500 flex items-center">
              <Search className="w-4 h-4" />
            </button>
            <input
              type="search"
              aria-label="Search Jira"
              placeholder="Search issues, projects"
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              onFocus={() => onOpenCommandPalette && onOpenCommandPalette()}
              className="w-full py-1.5 pr-3 bg-transparent border-0 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 outline-none"
            />
          </form>

          {/* Live Standup Mode Launcher (Desktop only) */}
          {onOpenStandup && (
            <button
              onClick={onOpenStandup}
              type="button"
              title="Launch Live Standup Meeting mode"
              className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <Users className="w-4 h-4" />
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            type="button"
            aria-label="Toggle dark mode"
            className="inline-flex items-center justify-center w-8 h-8 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Notifications / Alerts (Desktop only) */}
          <button
            type="button"
            aria-label="Notifications"
            className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Settings Shortcut (Desktop only) */}
          <button
            onClick={() => setActiveTab('settings')}
            type="button"
            aria-label="Settings"
            className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Avatar */}
          <button
            onClick={onOpenLogin}
            type="button"
            aria-label="Account menu"
            className="rounded-full hover:ring-2 hover:ring-blue-500 cursor-pointer shrink-0 transition-all"
          >
            <Avatar 
              name={currentUser?.name || 'Elena Rostova'} 
              src={currentUser?.photo} 
              size="sm" 
            />
          </button>
        </div>
      </header>

      {/* Bottom Mobile Navigation Bar */}
      <nav aria-label="Mobile navigation" className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-14 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 items-center select-none shadow-lg">
        <button
          onClick={() => setActiveTab('board')}
          className={`flex flex-col items-center justify-center gap-1 py-1 cursor-pointer ${
            activeTab === 'board' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Kanban className="w-5 h-5" />
          <span className="text-[11px] leading-tight">Board</span>
        </button>

        <button
          onClick={() => setActiveTab('backlog')}
          className={`flex flex-col items-center justify-center gap-1 py-1 cursor-pointer ${
            activeTab === 'backlog' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <ListTodo className="w-5 h-5" />
          <span className="text-[11px] leading-tight">Backlog</span>
        </button>

        <button
          onClick={() => setActiveTab('issues')}
          className={`flex flex-col items-center justify-center gap-1 py-1 cursor-pointer ${
            activeTab === 'issues' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[11px] leading-tight">Issues</span>
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`flex flex-col items-center justify-center gap-1 py-1 cursor-pointer ${
            activeTab === 'summary' ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[11px] leading-tight">Summary</span>
        </button>
      </nav>
    </>
  );
}
