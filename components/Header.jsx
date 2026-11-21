'use client';

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
  return (
    <>
      <header className="sticky top-0 z-30 h-14 px-gutter-lg bg-light-surface-container-lowest border-b border-light-outline-variant flex items-center justify-between gap-gutter-lg select-none">
        {/* Left Brand Mark, Global Navigation & Create CTA */}
        <div className="flex items-center gap-gutter-lg">
          {/* Mobile menu toggle */}
          <button
            onClick={onToggleSidebar}
            type="button"
            aria-label="Open project navigation"
            className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded-sm text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">menu</span>
          </button>

          {/* Brand Mark */}
          <div className="flex items-center gap-gutter-sm cursor-pointer" onClick={() => setActiveTab('board')}>
            <div className="w-7 h-7 rounded-sm bg-light-primary-container flex items-center justify-center text-light-on-primary">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
                deployed_code
              </span>
            </div>
            <span className="font-headline text-title-lg text-light-on-surface tracking-tight font-bold">
              Jira
            </span>
          </div>

          {/* Global Navigation Links from Stitch */}
          <nav aria-label="Global navigation" className="hidden md:flex items-center gap-gutter-xs">
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-gutter-md py-gutter-xs rounded-sm font-label text-label-lg transition-colors cursor-pointer ${
                activeTab === 'summary'
                  ? 'text-light-primary bg-status-progress-bg font-semibold'
                  : 'text-light-on-surface-variant hover:bg-light-surface-container-low hover:text-light-on-surface'
              }`}
            >
              Your work
            </button>

            <button
              onClick={() => setActiveTab('board')}
              className={`px-gutter-md py-gutter-xs rounded-sm font-label text-label-lg transition-colors cursor-pointer ${
                activeTab === 'board' || activeTab === 'backlog'
                  ? 'text-light-primary bg-status-progress-bg font-semibold'
                  : 'text-light-on-surface-variant hover:bg-light-surface-container-low hover:text-light-on-surface'
              }`}
            >
              Projects
            </button>

            <button
              onClick={() => setActiveTab('issues')}
              className={`px-gutter-md py-gutter-xs rounded-sm font-label text-label-lg transition-colors cursor-pointer ${
                activeTab === 'issues'
                  ? 'text-light-primary bg-status-progress-bg font-semibold'
                  : 'text-light-on-surface-variant hover:bg-light-surface-container-low hover:text-light-on-surface'
              }`}
            >
              Filters
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-gutter-md py-gutter-xs rounded-sm font-label text-label-lg transition-colors cursor-pointer ${
                activeTab === 'timeline'
                  ? 'text-light-primary bg-status-progress-bg font-semibold'
                  : 'text-light-on-surface-variant hover:bg-light-surface-container-low hover:text-light-on-surface'
              }`}
            >
              Dashboards
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`px-gutter-md py-gutter-xs rounded-sm font-label text-label-lg transition-colors cursor-pointer ${
                activeTab === 'team'
                  ? 'text-light-primary bg-status-progress-bg font-semibold'
                  : 'text-light-on-surface-variant hover:bg-light-surface-container-low hover:text-light-on-surface'
              }`}
            >
              Teams
            </button>
          </nav>

          {/* Primary Create Button */}
          <button
            onClick={onNewIssue}
            type="button"
            className="inline-flex items-center justify-center px-gutter-md py-1.5 rounded-sm bg-light-primary text-light-on-primary hover:bg-light-primary-container active:opacity-90 font-label text-label-lg transition-colors cursor-pointer"
          >
            Create
          </button>
        </div>

        {/* Right Global Search, Standup, Theme Toggle, Settings & User Avatar */}
        <div className="flex items-center gap-gutter-md">
          {/* Global Searchbar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onOpenCommandPalette && onOpenCommandPalette();
            }}
            role="search"
            className="hidden sm:flex relative items-center w-64 rounded-sm bg-light-surface-container-low border border-light-outline-variant focus-within:bg-light-surface-container-lowest focus-within:border-light-primary"
          >
            <button type="submit" aria-label="Submit search" className="pl-gutter-sm pr-gutter-xs text-light-on-surface-variant flex items-center">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">search</span>
            </button>
            <input
              type="search"
              aria-label="Search Jira"
              placeholder="Search issues, projects"
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              onFocus={() => onOpenCommandPalette && onOpenCommandPalette()}
              className="w-full py-1.5 pr-gutter-md bg-transparent border-0 font-body text-body-sm text-light-on-surface placeholder:text-light-on-surface-variant focus:ring-0 outline-none"
            />
          </form>

          {/* Live Standup Mode Launcher */}
          {onOpenStandup && (
            <button
              onClick={onOpenStandup}
              type="button"
              aria-label="Daily Standup"
              title="Launch Daily Standup Ceremony"
              className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">groups</span>
            </button>
          )}

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            type="button"
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
            className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notifications Icon with Dot */}
          <button
            type="button"
            aria-label="Notifications, unread activity"
            className="relative inline-flex items-center justify-center w-8 h-8 rounded-sm text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">notifications</span>
            <span className="absolute top-1.5 right-1.5 inline-block w-2 h-2 rounded-full bg-issue-bug ring-2 ring-light-surface-container-lowest" />
          </button>

          {/* Workspace Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            type="button"
            aria-label="Workspace settings"
            className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-sm text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">settings</span>
          </button>

          {/* User Avatar Photo */}
          <button
            onClick={onOpenLogin}
            type="button"
            aria-label="Account menu"
            className="w-8 h-8 rounded-full overflow-hidden border border-light-outline-variant hover:ring-2 hover:ring-light-primary cursor-pointer"
          >
            <img
              src="https://lh3.googleusercontent.com/aida/ALJJyrDT0ygT73l1oUoLN-ldq4D7iK67gQRn2Jk7sBkqg00OyGKoqWQZmoRgvpSJ9yBujVKEsKamItF_rzwvRR9GvaIUS4xjNTiLupFexLBJ7GFYZdSJkyY5uCqQXPuCpnXXcN3cZl0SjBUXkf08AfWbQLcqKuuD5bWUTUaMgsKPLsXBFH58TvdsBeHggVY-ycBQeeRkHLak_R1Bx4dYrDhktkSi7Y1mbVHmwnKtJZuZJfFUTrMrLQNe"
              alt="Elena Rostova"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </header>

      {/* Bottom Mobile Navigation Bar */}
      <nav aria-label="Mobile navigation" className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-16 bg-light-surface-container-lowest border-t border-light-outline-variant grid grid-cols-4 items-center select-none">
        <button
          onClick={() => setActiveTab('board')}
          className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'board' ? 'text-light-primary font-semibold' : 'text-light-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeTab === 'board' ? "'FILL' 1" : undefined }} aria-hidden="true">
            view_kanban
          </span>
          <span className="font-label text-label-sm">Board</span>
        </button>

        <button
          onClick={() => setActiveTab('backlog')}
          className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'backlog' ? 'text-light-primary font-semibold' : 'text-light-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">format_list_bulleted</span>
          <span className="font-label text-label-sm">Backlog</span>
        </button>

        <button
          onClick={() => setActiveTab('issues')}
          className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'issues' ? 'text-light-primary font-semibold' : 'text-light-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">layers</span>
          <span className="font-label text-label-sm">Issues</span>
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
            activeTab === 'summary' ? 'text-light-primary font-semibold' : 'text-light-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">dashboard</span>
          <span className="font-label text-label-sm">Summary</span>
        </button>
      </nav>
    </>
  );
}
