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
  PanelLeftOpen
} from 'lucide-react';
import ApexLogo from '@/components/ApexLogo';

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

  const navItems = [
    {
      id: 'board',
      label: currentProject?.methodology === 'kanban' ? 'Kanban Board' : 'Sprint Board',
      icon: Kanban,
    },
    {
      id: 'backlog',
      label: 'Backlog & Sizing',
      icon: ListTodo,
      disabled: currentProject?.methodology === 'kanban',
      hint: currentProject?.methodology === 'kanban' ? 'Scrum' : null,
    },
    {
      id: 'releases',
      label: 'Releases & CAB',
      icon: Rocket,
    },
    {
      id: 'analytics',
      label: 'Scrum Cockpit',
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
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
    {
      id: 'admin',
      label: 'Admin Console',
      icon: ShieldCheck,
    },
  ];

  return (
    <aside
      className={`border-r border-white/[0.06] bg-[#0c0c0e] flex flex-col shrink-0 select-none transition-all duration-200 ease-out ${
        isCollapsed ? 'w-14' : 'w-60'
      }`}
    >
      {/* Top Header: Brand Logo & Collapse Toggle */}
      <div className="p-3 border-b border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1 rounded-md bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <ApexLogo size={18} />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="font-semibold text-xs tracking-tight text-zinc-100 block">
                Apex Agile
              </span>
              <span className="text-[10px] font-mono text-zinc-500 block truncate">
                Enterprise v1.2
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors shrink-0"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Project Selector (Expanded only) */}
      {!isCollapsed && (
        <div className="p-2 border-b border-white/[0.04] relative">
          <button
            onClick={() => setIsProjectDropdownOpen((prev) => !prev)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-white/[0.06] text-left transition-colors"
          >
            <div className="truncate">
              <h4 className="font-medium text-xs text-zinc-200 truncate">
                {currentProject?.name || 'Project'}
              </h4>
              <span className="text-[10px] font-mono text-zinc-500 block truncate">
                {currentProject?.key} • {currentProject?.methodology}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0 ml-1" />
          </button>

          {isProjectDropdownOpen && (
            <div className="absolute top-14 left-2 right-2 z-50 bg-[#16161b] border border-white/[0.08] rounded-xl shadow-2xl p-1 space-y-0.5 animate-in fade-in duration-100">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Projects
              </div>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p);
                    setIsProjectDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    currentProject?.id === p.id
                      ? 'bg-blue-600/20 text-blue-300 font-medium'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  <span className="text-[10px] uppercase font-mono text-zinc-500 ml-1">
                    {p.key}
                  </span>
                </button>
              ))}

              <div className="pt-1 border-t border-white/[0.05]">
                <button
                  onClick={() => {
                    setIsProjectDropdownOpen(false);
                    onNewProject();
                  }}
                  className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-blue-400 hover:bg-blue-500/10 transition-colors font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Project</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          if (item.disabled) {
            return !isCollapsed ? (
              <div
                key={item.id}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-zinc-600 cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-zinc-700 shrink-0" />
                  <span>{item.label}</span>
                </div>
                <span className="text-[9px] font-mono px-1 rounded bg-zinc-900 text-zinc-600">
                  {item.hint}
                </span>
              </div>
            ) : null;
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-lg text-xs font-medium transition-colors ${
                isCollapsed
                  ? 'justify-center p-2.5'
                  : 'justify-between px-2.5 py-1.5'
              } ${
                isActive
                  ? 'bg-zinc-800/90 text-white border border-white/[0.08]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </div>
              {!isCollapsed && item.badge && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-white/[0.04]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile Card */}
      <div className="p-2 border-t border-white/[0.05] bg-zinc-950/30">
        <button
          onClick={onOpenLogin}
          className={`w-full flex items-center rounded-lg hover:bg-zinc-900 transition-colors text-left ${
            isCollapsed ? 'justify-center p-2' : 'justify-between p-1.5'
          }`}
          title="Switch User Persona"
        >
          <div className="flex items-center gap-2 truncate">
            <div className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-[10px] text-blue-300 shrink-0">
              {currentUser?.avatar_initials || 'BP'}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="font-medium text-xs text-zinc-200 truncate">
                  {currentUser?.name || 'Balaji Palani'}
                </div>
                <div className="text-[10px] text-zinc-500 truncate">
                  {currentUser?.role ? currentUser.role.split('/')[0] : 'Scrum Master'}
                </div>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <span className="text-[10px] font-mono text-zinc-500 px-1 py-0.5 rounded bg-zinc-900 border border-white/[0.04]">
              Switch
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
