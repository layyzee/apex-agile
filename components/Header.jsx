import { useState, useRef, useEffect } from 'react';
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
  LayoutDashboard,
  Check,
  ChevronDown,
  UserCheck,
  UserPlus,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import Avatar from './Avatar';
import ApexLogo from './ApexLogo';
import { toast } from 'sonner';

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
  users = [],
  onSelectUser,
  onOpenLogin,
  onToggleSidebar,
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwitchUser = (user) => {
    if (onSelectUser) {
      onSelectUser(user);
      toast.success(`Active profile switched to ${user.name}`, {
        description: `Role: ${user.role} · Capacity: ${user.capacity_points || 8} SP`
      });
    }
    setIsProfileOpen(false);
  };

  const navItems = [
    { id: 'summary', label: 'Your work' },
    { id: 'board', label: 'Projects' },
    { id: 'issues', label: 'Filters' },
    { id: 'timeline', label: 'Dashboards' },
    { id: 'team', label: 'Teams' },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 h-14 px-3 sm:px-5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 sm:gap-4 select-none">
        {/* Left Side: Brand Mark, Global Navigation on Desktop */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile menu toggle */}
          <button
            onClick={onToggleSidebar}
            type="button"
            aria-label="Open project navigation"
            className="lg:hidden inline-flex items-center justify-center w-8 h-8 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Mark */}
          <div 
            className="flex items-center gap-2 cursor-pointer shrink-0 group" 
            onClick={() => setActiveTab('board')}
          >
            <ApexLogo size={24} />
            {/* Desktop Brand text */}
            <span className="hidden sm:inline font-headline text-base font-bold text-slate-900 dark:text-white tracking-tight leading-none">
              Apex
            </span>
            {/* Mobile Sprint Context */}
            <div className="sm:hidden min-w-0">
              <p className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                PLAT Sprint 42
              </p>
            </div>
          </div>

          {/* Subtle vertical divider between Brand and Nav on desktop */}
          <div className="hidden md:block h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0" />

          {/* Global Navigation Links (Desktop) */}
          <nav aria-label="Global navigation" className="hidden lg:flex items-center gap-0.5 shrink-0">
            {navItems.map((item) => {
              const isActive = activeTab === item.id || (item.id === 'board' && activeTab === 'backlog');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
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

          {/* Primary Create Button (Placed right beside nav for natural Jira ergonomics) */}
          <button
            onClick={onNewIssue}
            type="button"
            className="inline-flex items-center justify-center px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 active:opacity-90 font-medium text-xs transition-colors cursor-pointer shadow-xs shrink-0"
          >
            Create
          </button>
        </div>

        {/* Right Side: Search, Standup, Theme Toggle, User Avatar */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Global Searchbar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onOpenCommandPalette && onOpenCommandPalette();
            }}
            role="search"
            className="hidden sm:flex relative items-center w-40 md:w-52 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-blue-500 transition-colors"
          >
            <button type="submit" aria-label="Submit search" className="pl-2 pr-1 text-slate-400 dark:text-slate-500 flex items-center">
              <Search className="w-3.5 h-3.5" />
            </button>
            <input
              type="search"
              aria-label="Search Apex Agile"
              placeholder="Search (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              onFocus={() => onOpenCommandPalette && onOpenCommandPalette()}
              className="w-full py-1 pr-2 bg-transparent border-0 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-0 outline-none"
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

          {/* User Avatar with Interactive Role Switcher Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              type="button"
              aria-label="Account menu"
              className="flex items-center gap-1.5 p-0.5 rounded-full hover:ring-2 hover:ring-blue-500 cursor-pointer shrink-0 transition-all"
            >
              <Avatar 
                name={currentUser?.name || 'Balaji Palani'} 
                src={currentUser?.photo} 
                size="sm" 
              />
              <span className="hidden xl:inline-block max-w-[110px] text-xs font-medium text-slate-700 dark:text-slate-300 truncate text-left">
                {currentUser?.name || 'Balaji Palani'}
              </span>
              <ChevronDown className="hidden sm:inline w-3 h-3 text-slate-400" />
            </button>

            {/* Profile Popover Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 flex flex-col gap-1 select-none">
                {/* Active Profile Info */}
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <Avatar name={currentUser?.name || 'Balaji Palani'} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentUser?.name || 'Balaji Palani'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {currentUser?.email || 'balajinia@gmail.com'}
                    </p>
                    <div className="mt-1">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        <ShieldCheck className="w-3 h-3" />
                        {currentUser?.role || 'Senior Scrum Master'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fast Role Switcher Section */}
                <div className="px-3 pt-2 pb-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                    Switch Squad Persona
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {users.map((u) => {
                      const isCurrent = currentUser?.id === u.id || (!currentUser && u.id === 'usr-balaji');
                      return (
                        <button
                          key={u.id}
                          onClick={() => handleSwitchUser(u)}
                          type="button"
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left text-xs transition-colors cursor-pointer ${
                            isCurrent 
                              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold' 
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Avatar name={u.name} size="xs" />
                            <div className="min-w-0">
                              <p className="truncate text-xs">{u.name}</p>
                              <p className="truncate text-[10px] text-slate-400 font-normal">{u.role}</p>
                            </div>
                          </div>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Account / Sign In / Sign Up CTA */}
                <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800 px-2 flex flex-col gap-0.5">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onOpenLogin();
                    }}
                    type="button"
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                    <span>Create Profile or Sign In</span>
                  </button>
                </div>
              </div>
            )}
          </div>
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
