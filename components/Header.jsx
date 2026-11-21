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
      <header className="sticky top-0 z-30 h-14 px-gutter-md sm:px-gutter-lg bg-light-surface-container-lowest border-b border-light-outline-variant flex items-center justify-between gap-gutter-sm sm:gap-gutter-lg select-none">
        {/* Left Side: Brand Mark, Sprint Title on Mobile, Global Navigation on Desktop */}
        <div className="flex items-center gap-gutter-sm sm:gap-gutter-lg min-w-0">
          {/* Mobile menu toggle */}
          <button
            onClick={onToggleSidebar}
            type="button"
            aria-label="Open project navigation"
            className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded-sm text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">menu</span>
          </button>

          {/* Brand Mark & Mobile Title */}
          <div className="flex items-center gap-gutter-xs sm:gap-gutter-sm cursor-pointer min-w-0" onClick={() => setActiveTab('board')}>
            <div className="w-7 h-7 rounded-sm bg-light-primary-container flex items-center justify-center text-light-on-primary shrink-0">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
                deployed_code
              </span>
            </div>
            {/* Desktop Brand text */}
            <span className="hidden sm:inline font-headline text-title-lg text-light-on-surface tracking-tight font-bold">
              Jira
            </span>
            {/* Mobile Sprint Context */}
            <div className="sm:hidden min-w-0">
              <p className="font-title text-title-sm text-light-on-surface truncate font-semibold">
                PLAT Sprint 42
              </p>
              <p className="font-body text-[11px] text-light-on-surface-variant truncate">
                6 days remaining
              </p>
            </div>
          </div>

          {/* Global Navigation Links from Stitch (Desktop) */}
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
        </div>

        {/* Right Side: Create CTA, Search, Standup, Theme Toggle, Settings & User Avatar */}
        <div className="flex items-center gap-gutter-xs sm:gap-gutter-md shrink-0">
          {/* Primary Create Button */}
          <button
            onClick={onNewIssue}
            type="button"
            className="inline-flex items-center justify-center px-gutter-sm sm:px-gutter-md py-1.5 rounded-sm bg-light-primary text-light-on-primary hover:bg-light-primary-container active:opacity-90 font-label text-label-md sm:text-label-lg transition-colors cursor-pointer shrink-0"
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

          {/* Live Standup Mode Launcher (Desktop only) */}
          {onOpenStandup && (
            <button
              onClick={onOpenStandup}
              type="button"
              aria-label="Daily Standup"
              title="Launch Daily Standup Ceremony"
              className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-sm text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">groups</span>
            </button>
          )}

          {/* Light / Dark Mode Toggle (Desktop only) */}
          <button
            onClick={onToggleTheme}
            type="button"
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
            className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-sm text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notifications Icon with Dot (Desktop only) */}
          <button
            type="button"
            aria-label="Notifications, unread activity"
            className="hidden sm:inline-flex relative items-center justify-center w-8 h-8 rounded-sm text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">notifications</span>
            <span className="absolute top-1.5 right-1.5 inline-block w-2 h-2 rounded-full bg-issue-bug ring-2 ring-light-surface-container-lowest" />
          </button>

          {/* Workspace Settings (Desktop only) */}
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
            className="w-8 h-8 rounded-full overflow-hidden border border-light-outline-variant hover:ring-2 hover:ring-light-primary cursor-pointer shrink-0"
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
      <nav aria-label="Mobile navigation" className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-14 bg-light-surface-container-lowest border-t border-light-outline-variant grid grid-cols-4 items-center select-none shadow-lg">
        <button
          onClick={() => setActiveTab('board')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 cursor-pointer ${
            activeTab === 'board' ? 'text-light-primary font-semibold' : 'text-light-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: activeTab === 'board' ? "'FILL' 1" : undefined }} aria-hidden="true">
            view_kanban
          </span>
          <span className="font-label text-[11px] leading-tight">Board</span>
        </button>

        <button
          onClick={() => setActiveTab('backlog')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 cursor-pointer ${
            activeTab === 'backlog' ? 'text-light-primary font-semibold' : 'text-light-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">format_list_bulleted</span>
          <span className="font-label text-[11px] leading-tight">Backlog</span>
        </button>

        <button
          onClick={() => setActiveTab('issues')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 cursor-pointer ${
            activeTab === 'issues' ? 'text-light-primary font-semibold' : 'text-light-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">layers</span>
          <span className="font-label text-[11px] leading-tight">Issues</span>
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 cursor-pointer ${
            activeTab === 'summary' ? 'text-light-primary font-semibold' : 'text-light-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">dashboard</span>
          <span className="font-label text-[11px] leading-tight">Summary</span>
        </button>
      </nav>
    </>
  );
}
