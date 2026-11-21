'use client';

import { useState } from 'react';
import { 
  Kanban, 
  ListTodo, 
  BarChart3, 
  Rocket, 
  Zap, 
  Users, 
  Settings, 
  ShieldCheck, 
  Plus, 
  ChevronDown, 
  PanelLeftClose, 
  PanelLeftOpen,
  LayoutDashboard,
  Calendar,
  Layers,
  SlidersHorizontal,
  FolderGit2
} from 'lucide-react';

export default function Sidebar({
  projects,
  currentProject,
  onSelectProject,
  onNewProject,
  activeView,
  setActiveView,
  currentUser,
  onOpenLogin,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  const planningNav = [
    {
      id: 'summary',
      label: 'Summary',
      icon: LayoutDashboard,
    },
    {
      id: 'timeline',
      label: 'Timeline',
      icon: Calendar,
    },
    {
      id: 'backlog',
      label: 'Backlog',
      icon: ListTodo,
      disabled: currentProject?.methodology === 'kanban',
      hint: currentProject?.methodology === 'kanban' ? 'Scrum only' : null,
    },
    {
      id: 'board',
      label: currentProject?.methodology === 'kanban' ? 'Kanban board' : 'Active sprints',
      icon: Kanban,
    },
    {
      id: 'issues',
      label: 'Issues',
      icon: Layers,
    },
  ];

  const devNav = [
    {
      id: 'releases',
      label: 'Releases & CAB',
      icon: Rocket,
    },
    {
      id: 'analytics',
      label: 'Reports & Velocity',
      icon: BarChart3,
    },
    {
      id: 'automation',
      label: 'Automation',
      icon: Zap,
      badge: '4',
    },
    {
      id: 'team',
      label: 'Squad & Capacity',
      icon: Users,
    },
  ];

  return (
    <aside
      className={`border-r border-[var(--border-subtle)] bg-[var(--bg-surface-low)] flex flex-col shrink-0 select-none transition-all duration-200 ease-out ${
        isCollapsed ? 'w-14' : 'w-60'
      }`}
    >
      {/* 1. Project Identity & Collapse Trigger */}
      <div className="p-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-md bg-[#8270DB]/15 text-[#8270DB] border border-[#8270DB]/30 flex items-center justify-center shrink-0 font-bold font-mono text-xs">
            {currentProject?.key?.slice(0, 4) || 'PLAT'}
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="font-headline font-bold text-xs tracking-tight text-[var(--text-main)] block truncate">
                {currentProject?.name || 'Platform Core'}
              </span>
              <span className="text-[10px] font-mono text-[var(--text-subtle)] block truncate">
                {currentProject?.methodology === 'kanban' ? 'Kanban project' : 'Software project'} · {currentProject?.key || 'PLAT'}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="p-1 rounded hover:bg-[var(--bg-surface-container)] text-[var(--text-subtle)] hover:text-[var(--text-main)] transition-colors shrink-0"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Project Switcher Dropdown (when expanded) */}
      {!isCollapsed && (
        <div className="p-2 border-b border-[var(--border-subtle)] relative">
          <button
            onClick={() => setIsProjectDropdownOpen((prev) => !prev)}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[var(--bg-surface-container)] border border-transparent hover:border-[var(--border-subtle)] text-left transition-colors"
          >
            <div className="truncate">
              <span className="font-label text-[11px] font-medium text-[var(--text-muted)] block truncate">
                Active Project
              </span>
              <span className="font-mono text-[10px] text-[var(--text-subtle)]">
                Switch or create...
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-subtle)] shrink-0 ml-1" />
          </button>

          {isProjectDropdownOpen && (
            <div className="absolute top-full left-2 right-2 mt-1 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-xl z-50 p-1 space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono uppercase text-[var(--text-subtle)] font-bold">
                Projects
              </div>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p);
                    setIsProjectDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                    currentProject?.id === p.id
                      ? 'bg-[var(--status-progress-bg)] text-[#0C66E4] font-medium'
                      : 'hover:bg-[var(--bg-surface-low)] text-[var(--text-main)]'
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  <span className="text-[10px] font-mono text-[var(--text-subtle)]">{p.key}</span>
                </button>
              ))}
              <div className="pt-1 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => {
                    onNewProject();
                    setIsProjectDropdownOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded text-xs text-[#0C66E4] hover:bg-[var(--status-progress-bg)] flex items-center gap-1.5 font-medium transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Project</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Navigation Sections */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* Planning Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-2.5 py-1 font-label text-[10px] text-[var(--text-subtle)] uppercase tracking-wider font-semibold">
              Planning
            </p>
          )}
          {planningNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-label transition-colors text-left ${
                  isActive
                    ? 'bg-[var(--status-progress-bg)] text-[#0C66E4] font-semibold'
                    : item.disabled
                    ? 'opacity-40 cursor-not-allowed text-[var(--text-subtle)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-container)] hover:text-[var(--text-main)]'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}
                {!isCollapsed && item.hint && (
                  <span className="text-[9px] font-mono text-[var(--text-subtle)] shrink-0">
                    {item.hint}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Development Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-2.5 py-1 font-label text-[10px] text-[var(--text-subtle)] uppercase tracking-wider font-semibold">
              Development
            </p>
          )}
          {devNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-label transition-colors text-left ${
                  isActive
                    ? 'bg-[var(--status-progress-bg)] text-[#0C66E4] font-semibold'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-container)] hover:text-[var(--text-main)]'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && (
                  <span className="truncate flex-1">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--bg-surface-container)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Bottom Settings & Role Persona */}
      <div className="p-2 border-t border-[var(--border-subtle)] space-y-1">
        <button
          onClick={() => setActiveView('settings')}
          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-label transition-colors text-left ${
            activeView === 'settings'
              ? 'bg-[var(--status-progress-bg)] text-[#0C66E4] font-semibold'
              : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-container)] hover:text-[var(--text-main)]'
          }`}
          title={isCollapsed ? 'Project settings' : undefined}
        >
          <SlidersHorizontal className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate">Project settings</span>}
        </button>

        <button
          onClick={() => setActiveView('admin')}
          className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs font-label transition-colors text-left ${
            activeView === 'admin'
              ? 'bg-[var(--status-progress-bg)] text-[#0C66E4] font-semibold'
              : 'text-[var(--text-muted)] hover:bg-[var(--bg-surface-container)] hover:text-[var(--text-main)]'
          }`}
          title={isCollapsed ? 'Admin Console' : undefined}
        >
          <ShieldCheck className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span className="truncate">Admin Console</span>}
        </button>
      </div>
    </aside>
  );
}
