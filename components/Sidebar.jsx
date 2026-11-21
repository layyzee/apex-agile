'use client';

import {
  Boxes,
  LayoutDashboard,
  CalendarRange,
  ListTodo,
  Kanban,
  Layers,
  GitBranch,
  Rocket,
  TrendingUp,
  LifeBuoy,
  Folder,
  ShieldCheck,
  Settings,
  Plus,
  X,
  FolderGit2
} from 'lucide-react';

export default function Sidebar({
  projects = [],
  currentProject,
  onSelectProject,
  onNewProject,
  activeView,
  setActiveView,
  currentUser,
  onOpenLogin,
  isOpenMobile = false,
  onCloseMobile,
}) {
  const handleNavClick = (viewName) => {
    setActiveView(viewName);
    if (onCloseMobile) onCloseMobile();
  };

  const planningItems = [
    { id: 'summary', label: 'Summary', icon: LayoutDashboard },
    { id: 'timeline', label: 'Timeline', icon: CalendarRange },
    { id: 'backlog', label: 'Backlog', icon: ListTodo },
    { id: 'board', label: 'Active sprints', icon: Kanban },
    { id: 'issues', label: 'Issues', icon: Layers },
  ];

  const developmentItems = [
    { id: 'code', label: 'Code & deployments', icon: GitBranch },
    { id: 'releases', label: 'Releases', icon: Rocket },
    { id: 'analytics', label: 'Reports & Velocity', icon: TrendingUp },
  ];

  const enterpriseItems = [
    { id: 'servicedesk', label: 'IT Service Desk', icon: LifeBuoy },
    { id: 'projects_dir', label: 'Projects directory', icon: Folder },
    { id: 'admin', label: 'Admin & RBAC', icon: ShieldCheck },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      <div className="flex flex-col gap-6">
        {/* Project Identity */}
        <div className="flex items-center justify-between gap-3 px-2 py-1">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                {currentProject?.name || 'Platform Core'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {currentProject?.methodology === 'kanban' ? 'Kanban project' : 'Software project'} · {currentProject?.key || 'PLAT'}
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          {isOpenMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Planning Navigation */}
        <nav aria-label="Project planning" className="flex flex-col gap-1">
          <p className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Planning
          </p>
          {planningItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded text-sm transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Development Navigation */}
        <nav aria-label="Development workflows" className="flex flex-col gap-1">
          <p className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Development
          </p>
          {developmentItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded text-sm transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Enterprise / Service Management Navigation */}
        <nav aria-label="Enterprise management" className="flex flex-col gap-1">
          <p className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Enterprise
          </p>
          {enterpriseItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded text-sm transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Settings & Project Shortcut */}
      <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => handleNavClick('settings')}
          className={`w-full flex items-center gap-3 px-2.5 py-2 rounded text-sm transition-colors text-left cursor-pointer ${
            activeView === 'settings'
              ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 shrink-0" />
          <span className="truncate">Project settings</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Persistent) */}
      <aside aria-label="Sidebar navigation" className="hidden lg:flex w-64 h-full bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex-col select-none shrink-0 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Collapsible) */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer Pane */}
          <aside className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col z-10 shadow-2xl overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
