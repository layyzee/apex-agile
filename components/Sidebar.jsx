'use client';

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

  const sidebarContent = (
    <>
      {/* Project Identity */}
      <div className="flex items-center justify-between gap-gutter-md px-gutter-sm py-gutter-xs">
        <div className="flex items-center gap-gutter-md min-w-0">
          <div className="w-8 h-8 rounded-sm bg-issue-epic/15 text-issue-epic flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">
              hub
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-title text-title-md text-light-on-surface truncate font-semibold">
              {currentProject?.name || 'Platform Core'}
            </p>
            <p className="font-body text-body-sm text-light-on-surface-variant truncate">
              {currentProject?.methodology === 'kanban' ? 'Kanban project' : 'Software project'} · {currentProject?.key || 'PLAT'}
            </p>
          </div>
        </div>

        {/* Mobile close button */}
        {isOpenMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden w-7 h-7 flex items-center justify-center text-light-on-surface-variant hover:text-light-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Planning Navigation */}
      <nav aria-label="Project planning" className="flex flex-col gap-gutter-xs">
        <p className="px-gutter-sm py-gutter-xs font-label text-label-sm text-light-on-surface-variant uppercase tracking-wider font-semibold">
          Planning
        </p>

        <button
          onClick={() => handleNavClick('summary')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left cursor-pointer ${
            activeView === 'summary'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">dashboard</span>
          <span>Summary</span>
        </button>

        <button
          onClick={() => handleNavClick('timeline')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left cursor-pointer ${
            activeView === 'timeline'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">view_timeline</span>
          <span>Timeline</span>
        </button>

        <button
          onClick={() => handleNavClick('backlog')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left cursor-pointer ${
            activeView === 'backlog'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">format_list_bulleted</span>
          <span>Backlog</span>
        </button>

        <button
          onClick={() => handleNavClick('board')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left cursor-pointer ${
            activeView === 'board'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: activeView === 'board' ? "'FILL' 1" : undefined }} aria-hidden="true">
            view_kanban
          </span>
          <span>Active sprints</span>
        </button>

        <button
          onClick={() => handleNavClick('issues')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left cursor-pointer ${
            activeView === 'issues'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">layers</span>
          <span>Issues</span>
        </button>
      </nav>

      {/* Development Navigation */}
      <nav aria-label="Development" className="flex flex-col gap-gutter-xs">
        <p className="px-gutter-sm py-gutter-xs font-label text-label-sm text-light-on-surface-variant uppercase tracking-wider font-semibold">
          Development
        </p>

        <button
          onClick={() => handleNavClick('code')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left cursor-pointer ${
            activeView === 'code'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: activeView === 'code' ? "'FILL' 1" : undefined }} aria-hidden="true">
            code
          </span>
          <span>Code &amp; deployments</span>
        </button>

        <button
          onClick={() => handleNavClick('releases')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left cursor-pointer ${
            activeView === 'releases'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: activeView === 'releases' ? "'FILL' 1" : undefined }} aria-hidden="true">
            rocket_launch
          </span>
          <span>Releases</span>
        </button>

        <button
          onClick={() => handleNavClick('analytics')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left cursor-pointer ${
            activeView === 'analytics'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">monitoring</span>
          <span>Reports &amp; Velocity</span>
        </button>
      </nav>

      {/* Enterprise & Service Desk Navigation */}
      <nav aria-label="Enterprise" className="flex flex-col gap-gutter-xs">
        <p className="px-gutter-sm py-gutter-xs font-label text-label-sm text-light-on-surface-variant uppercase tracking-wider font-semibold">
          Enterprise
        </p>

        <button
          onClick={() => handleNavClick('servicedesk')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left cursor-pointer ${
            activeView === 'servicedesk'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">support_agent</span>
          <span>IT Service Desk</span>
        </button>

        <button
          onClick={() => handleNavClick('projects')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left cursor-pointer ${
            activeView === 'projects'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">folder_open</span>
          <span>Projects directory</span>
        </button>

        <button
          onClick={() => handleNavClick('admin')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left cursor-pointer ${
            activeView === 'admin'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">admin_panel_settings</span>
          <span>Admin &amp; RBAC</span>
        </button>
      </nav>

      {/* Project settings */}
      <div className="mt-auto pt-gutter-md border-t border-light-outline-variant">
        <button
          onClick={() => handleNavClick('settings')}
          className="w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface transition-colors text-left cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">tune</span>
          <span>Project settings</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        id="project-sidebar"
        className="hidden lg:flex flex-col w-60 shrink-0 min-h-screen bg-light-surface-container-low border-r border-light-outline-variant p-gutter-md gap-gutter-lg select-none"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/50 transition-opacity"
            aria-hidden="true"
          />
          <aside
            id="project-sidebar-mobile"
            className="relative w-72 max-w-[80vw] h-full bg-light-surface-container-low border-r border-light-outline-variant p-gutter-md flex flex-col gap-gutter-lg z-10 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-200"
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
