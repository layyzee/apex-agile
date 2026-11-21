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
}) {
  return (
    <aside
      id="project-sidebar"
      className="hidden lg:flex flex-col w-60 shrink-0 min-h-screen bg-light-surface-container-low border-r border-light-outline-variant p-gutter-md gap-gutter-lg select-none"
    >
      {/* Project Identity */}
      <div className="flex items-center gap-gutter-md px-gutter-sm py-gutter-xs">
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

      {/* Planning Navigation */}
      <nav aria-label="Project planning" className="flex flex-col gap-gutter-xs">
        <p className="px-gutter-sm py-gutter-xs font-label text-label-sm text-light-on-surface-variant uppercase tracking-wider font-semibold">
          Planning
        </p>

        <button
          onClick={() => setActiveView('summary')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left ${
            activeView === 'summary'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">dashboard</span>
          <span>Summary</span>
        </button>

        <button
          onClick={() => setActiveView('timeline')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left ${
            activeView === 'timeline'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">view_timeline</span>
          <span>Timeline</span>
        </button>

        <button
          onClick={() => setActiveView('backlog')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left ${
            activeView === 'backlog'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">format_list_bulleted</span>
          <span>Backlog</span>
        </button>

        <button
          onClick={() => setActiveView('board')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left ${
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
          onClick={() => setActiveView('issues')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left ${
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
          onClick={() => setActiveView('releases')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left ${
            activeView === 'releases'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">code</span>
          <span>Code</span>
        </button>

        <button
          onClick={() => setActiveView('releases')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left ${
            activeView === 'releases'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">rocket_launch</span>
          <span>Releases</span>
        </button>

        <button
          onClick={() => setActiveView('analytics')}
          className={`w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg transition-colors text-left ${
            activeView === 'analytics'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">monitoring</span>
          <span>Reports</span>
        </button>
      </nav>

      {/* Project settings */}
      <div className="mt-auto pt-gutter-md border-t border-light-outline-variant">
        <button
          onClick={() => setActiveView('settings')}
          className="w-full flex items-center gap-gutter-md px-gutter-sm py-gutter-sm rounded-sm font-label text-label-lg text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">tune</span>
          <span>Project settings</span>
        </button>
      </div>
    </aside>
  );
}
