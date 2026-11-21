'use client';

import { useState, useMemo } from 'react';
import { 
  Zap, 
  Plus, 
  Calendar, 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  CheckCircle2, 
  Layers, 
  ArrowUpRight 
} from 'lucide-react';

export default function TimelineView({
  currentProject,
  epics = [],
  issues = [],
  states = [],
  onCreateEpic,
  onSelectIssue,
  setActiveView,
}) {
  const [timeScale, setTimeScale] = useState('months'); // 'weeks' | 'months' | 'quarters'
  const [expandedEpics, setExpandedEpics] = useState({});
  const [isNewEpicOpen, setIsNewEpicOpen] = useState(false);
  const [newEpicTitle, setNewEpicTitle] = useState('');
  const [newEpicSummary, setNewEpicSummary] = useState('');

  // Months labels for the 4-column timeline header
  const months = ['October', 'November', 'December', 'January'];

  // Calculate Epic Progress & Issue linkages
  const epicData = useMemo(() => {
    if (!epics || epics.length === 0) {
      // Provide fallback demo epics if database has no explicit epics yet
      return [
        {
          id: 'epic-demo-1',
          key: `${currentProject?.key || 'PLAT'}-380`,
          title: 'Auth v3 & PKCE SSO Flow',
          owner: 'Elena Rostova',
          status: 'In Progress',
          statusColor: '#0C66E4',
          progress: 65,
          startMonth: 0,
          spanMonths: 2,
          dateRange: 'Oct 4 – Nov 26',
        },
        {
          id: 'epic-demo-2',
          key: `${currentProject?.key || 'PLAT'}-392`,
          title: 'Telemetry & OpenTelemetry Sink',
          owner: 'Priya Nair',
          status: 'In Progress',
          statusColor: '#0C66E4',
          progress: 40,
          startMonth: 1,
          spanMonths: 2,
          dateRange: 'Nov 3 – Dec 18',
        },
        {
          id: 'epic-demo-3',
          key: `${currentProject?.key || 'PLAT'}-398`,
          title: 'Canary Rollback & Production Infra',
          owner: 'Kenji Sato',
          status: 'In Review',
          statusColor: '#6E5DC6',
          progress: 80,
          startMonth: 0,
          spanMonths: 3,
          dateRange: 'Oct 12 – Dec 8',
        },
        {
          id: 'epic-demo-4',
          key: `${currentProject?.key || 'PLAT'}-405`,
          title: 'Atlassian Modern Design System Tokens',
          owner: 'Balaji Palani',
          status: 'On Track',
          statusColor: '#1F845A',
          progress: 95,
          startMonth: 1,
          spanMonths: 3,
          dateRange: 'Nov 1 – Jan 15',
        },
      ];
    }

    return epics.map((epic, idx) => {
      const childIssues = issues.filter((i) => i.epic_id === epic.id);
      const doneIssues = childIssues.filter((i) => {
        const stateObj = states.find((s) => s.id === i.status_id);
        return (stateObj?.category || '').toLowerCase() === 'done';
      });
      const progress = childIssues.length > 0 
        ? Math.round((doneIssues.length / childIssues.length) * 100) 
        : (idx === 0 ? 70 : idx === 1 ? 45 : 85);

      const startMonth = idx % 2;
      const spanMonths = (idx % 3) + 2;

      return {
        id: epic.id,
        key: epic.key || `${currentProject?.key || 'PLAT'}-${epic.id.replace('epic-', '')}`,
        title: epic.name || epic.title || 'Enterprise Milestone',
        owner: epic.lead || 'Balaji Palani',
        status: progress >= 100 ? 'Done' : progress > 50 ? 'In Progress' : 'Planned',
        statusColor: progress >= 100 ? '#1F845A' : progress > 50 ? '#0C66E4' : '#8270DB',
        progress,
        startMonth,
        spanMonths: Math.min(4 - startMonth, spanMonths),
        dateRange: `Month ${startMonth + 1} – Month ${startMonth + spanMonths}`,
        childIssues,
      };
    });
  }, [epics, issues, states, currentProject]);

  const toggleEpic = (epicId) => {
    setExpandedEpics((prev) => ({ ...prev, [epicId]: !prev[epicId] }));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newEpicTitle.trim()) return;
    if (onCreateEpic) {
      onCreateEpic({
        name: newEpicTitle.trim(),
        summary: newEpicSummary.trim(),
        color: '#8270DB',
      });
    }
    setNewEpicTitle('');
    setNewEpicSummary('');
    setIsNewEpicOpen(false);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header & Breadcrumbs */}
      <div className="space-y-1.5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--text-subtle)] font-body">
          <button 
            onClick={() => setActiveView('board')}
            className="hover:text-[var(--text-main)] transition-colors"
          >
            Projects
          </button>
          <span>/</span>
          <span className="text-[var(--text-muted)] font-medium truncate max-w-xs">
            {currentProject?.name || 'Platform Core'}
          </span>
          <span>/</span>
          <span className="text-[var(--text-main)] font-semibold">Timeline</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
              Timeline & Roadmap
            </h1>
            <p className="text-xs text-[var(--text-subtle)] mt-0.5">
              Gantt scheduling of enterprise Epics, dependencies, and delivery horizons
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View scale selector */}
            <div className="inline-flex rounded bg-[var(--bg-surface-container)] p-0.5 border border-[var(--border-subtle)]">
              <button
                onClick={() => setTimeScale('weeks')}
                className={`px-3 py-1 rounded text-xs font-label transition-colors ${
                  timeScale === 'weeks'
                    ? 'bg-[var(--bg-card)] text-[#0C66E4] font-semibold shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Weeks
              </button>
              <button
                onClick={() => setTimeScale('months')}
                className={`px-3 py-1 rounded text-xs font-label transition-colors ${
                  timeScale === 'months'
                    ? 'bg-[var(--bg-card)] text-[#0C66E4] font-semibold shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Months
              </button>
              <button
                onClick={() => setTimeScale('quarters')}
                className={`px-3 py-1 rounded text-xs font-label transition-colors ${
                  timeScale === 'quarters'
                    ? 'bg-[var(--bg-card)] text-[#0C66E4] font-semibold shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                Quarters
              </button>
            </div>

            {/* New Epic Trigger */}
            <button
              onClick={() => setIsNewEpicOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#004FB6] hover:bg-[#0C66E4] text-white text-xs font-label font-medium transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Epic</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. New Epic Creation Form Modal / Card */}
      {isNewEpicOpen && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-md space-y-3 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-title text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#8270DB]" />
              <span>New Strategic Epic Container</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsNewEpicOpen(false)}
              className="text-xs text-[var(--text-subtle)] hover:text-[var(--text-main)]"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Epic Name (e.g., OAuth2 & PKCE Auth v3)"
              value={newEpicTitle}
              onChange={(e) => setNewEpicTitle(e.target.value)}
              className="px-3 py-1.5 rounded bg-[var(--bg-surface-low)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[#0C66E4]"
              autoFocus
              required
            />
            <input
              type="text"
              placeholder="Strategic Objective or Summary"
              value={newEpicSummary}
              onChange={(e) => setNewEpicSummary(e.target.value)}
              className="px-3 py-1.5 rounded bg-[var(--bg-surface-low)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[#0C66E4]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewEpicOpen(false)}
              className="px-3 py-1 rounded text-xs text-[var(--text-muted)] hover:bg-[var(--bg-surface-container)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-[#004FB6] hover:bg-[#0C66E4] text-white text-xs font-medium"
            >
              Save Epic
            </button>
          </div>
        </form>
      )}

      {/* 3. Gantt Roadmap Grid */}
      <section aria-label="Epic roadmap timeline" className="rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-low)]">
          <div className="lg:col-span-5 px-4 py-3 border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] flex items-center justify-between">
            <span className="font-label text-xs uppercase tracking-wider font-semibold text-[var(--text-subtle)]">
              Epics & Strategic Deliverables
            </span>
            <span className="font-mono text-xs text-[var(--text-subtle)]">
              {epicData.length} active
            </span>
          </div>

          <div className="lg:col-span-7 grid grid-cols-4 divide-x divide-[var(--border-subtle)] text-center text-xs font-label">
            {months.map((m, idx) => (
              <div
                key={m}
                className={`py-3 px-2 ${
                  idx === 1
                    ? 'text-[#0C66E4] bg-[var(--status-progress-bg)] font-semibold'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                <span>{m}</span>
                {idx === 1 && (
                  <span className="hidden sm:inline-block ml-1 text-[9px] font-mono px-1 py-0.2 rounded bg-[#0C66E4]/20">
                    Current
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Epic Rows */}
        <div className="divide-y divide-[var(--border-subtle)]">
          {epicData.map((epic) => {
            const isExpanded = !!expandedEpics[epic.id];
            const childIssues = epic.childIssues || [];

            return (
              <div key={epic.id} className="group">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-center hover:bg-[var(--bg-surface-low)]/50 transition-colors">
                  {/* Left Column: Epic Identity */}
                  <div className="lg:col-span-5 px-4 py-3.5 lg:border-r border-[var(--border-subtle)] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => toggleEpic(epic.id)}
                        className="p-0.5 rounded text-[var(--text-subtle)] hover:text-[var(--text-main)] shrink-0"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <div className="w-6 h-6 rounded bg-[#8270DB]/15 text-[#8270DB] flex items-center justify-center shrink-0">
                        <Zap className="w-3.5 h-3.5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[var(--text-subtle)]">
                            {epic.key}
                          </span>
                          <span className="text-xs font-title font-semibold text-[var(--text-main)] truncate">
                            {epic.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[var(--text-subtle)] mt-0.5">
                          <span>{epic.progress}% complete</span>
                          <span>·</span>
                          <span>Lead: {epic.owner}</span>
                        </div>
                      </div>
                    </div>

                    <span 
                      style={{ color: epic.statusColor }}
                      className="px-2 py-0.5 rounded text-[10px] font-label font-medium bg-[var(--bg-surface-container)] shrink-0 border border-[var(--border-subtle)]"
                    >
                      {epic.status}
                    </span>
                  </div>

                  {/* Right Column: Timeline Bar */}
                  <div className="lg:col-span-7 px-3 py-3 grid grid-cols-4 gap-0 items-center">
                    <div
                      style={{
                        gridColumnStart: epic.startMonth + 1,
                        gridColumnEnd: `span ${epic.spanMonths}`,
                      }}
                      className="h-8 rounded bg-[var(--status-progress-bg)] border border-[#0C66E4]/40 flex items-center justify-between px-3 relative shadow-xs overflow-hidden"
                    >
                      {/* Inner Progress fill */}
                      <div
                        style={{ width: `${epic.progress}%` }}
                        className="absolute inset-y-0 left-0 bg-[#0C66E4]/20 pointer-events-none"
                      />
                      <span className="font-label text-xs font-medium text-[#0C66E4] truncate relative z-10">
                        {epic.dateRange}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-[#0C66E4] relative z-10 tabular-nums">
                        {epic.progress}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Child Issues */}
                {isExpanded && childIssues.length > 0 && (
                  <div className="bg-[var(--bg-surface-low)]/40 divide-y divide-[var(--border-subtle)]/50 pl-10 pr-4 py-1">
                    {childIssues.map((child) => (
                      <div
                        key={child.id}
                        onClick={() => onSelectIssue && onSelectIssue(child)}
                        className="py-2 flex items-center justify-between text-xs hover:bg-[var(--bg-surface-container)] px-2 rounded cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono text-[11px] text-[var(--text-subtle)]">
                            {child.key}
                          </span>
                          <span className="text-[var(--text-main)] truncate font-medium">
                            {child.title}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-[var(--text-subtle)] shrink-0">
                          {child.story_points ? `${child.story_points} pts` : '-'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
