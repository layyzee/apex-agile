'use client';

import { useState, useMemo } from 'react';
import { 
  Bookmark, 
  Bug, 
  CheckSquare, 
  Zap, 
  Search, 
  ArrowUpDown, 
  Filter, 
  Plus, 
  ExternalLink,
  ChevronRight,
  User,
  Clock,
  AlertTriangle
} from 'lucide-react';

export default function IssuesTriageView({
  currentProject,
  issues = [],
  states = [],
  epics = [],
  sprints = [],
  onSelectIssue,
  onUpdateIssueStatus,
  onNewIssue,
  setActiveView,
}) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'todo' | 'progress' | 'review' | 'done'
  const [sortField, setSortField] = useState('key'); // 'key' | 'title' | 'status' | 'points'
  const [sortDir, setSortDir] = useState('desc'); // 'asc' | 'desc'
  const [inspectorIssueId, setInspectorIssueId] = useState(issues[0]?.id || null);

  // Filter & Sort Issues
  const filteredIssues = useMemo(() => {
    return issues.filter((i) => {
      // 1. Text / Key / Assignee search
      if (query.trim()) {
        const q = query.toLowerCase();
        const matches =
          i.key.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          (i.assignee && i.assignee.toLowerCase().includes(q)) ||
          (i.description && i.description.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // 2. Status category filter
      if (statusFilter !== 'all') {
        const stateObj = states.find((s) => s.id === i.status_id);
        const cat = (stateObj?.category || '').toLowerCase();
        const name = (stateObj?.name || '').toLowerCase();

        if (statusFilter === 'todo' && cat !== 'todo' && !name.includes('to do') && !name.includes('backlog')) {
          return false;
        }
        if (statusFilter === 'progress' && cat !== 'in_progress' && !name.includes('progress') && !name.includes('dev')) {
          return false;
        }
        if (statusFilter === 'review' && cat !== 'review' && !name.includes('review') && !name.includes('qa')) {
          return false;
        }
        if (statusFilter === 'done' && cat !== 'done' && !name.includes('done') && !name.includes('closed')) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'points') {
        valA = Number(a.story_points) || 0;
        valB = Number(b.story_points) || 0;
      } else {
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [issues, query, statusFilter, sortField, sortDir, states]);

  // Active Inspector Issue
  const activeInspectorIssue = useMemo(() => {
    if (!inspectorIssueId) return filteredIssues[0] || issues[0] || null;
    return issues.find((i) => i.id === inspectorIssueId) || filteredIssues[0] || issues[0] || null;
  }, [inspectorIssueId, issues, filteredIssues]);

  const activeState = states.find((s) => s.id === activeInspectorIssue?.status_id);
  const activeEpic = epics.find((e) => e.id === activeInspectorIssue?.epic_id);
  const activeSprint = sprints.find((s) => s.id === activeInspectorIssue?.sprint_id);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const renderTypeIcon = (type) => {
    const t = (type || 'story').toLowerCase();
    if (t === 'bug') {
      return <Bug className="w-3.5 h-3.5 text-[#E34935]" title="Bug" />;
    }
    if (t === 'task') {
      return <CheckSquare className="w-3.5 h-3.5 text-[#1D7AFC]" title="Task" />;
    }
    if (t === 'epic') {
      return <Zap className="w-3.5 h-3.5 text-[#8270DB]" title="Epic" />;
    }
    return <Bookmark className="w-3.5 h-3.5 text-[#22A06B]" title="Story" />;
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
          <span className="text-[var(--text-main)] font-semibold">Issues</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
              Issues & Triage
            </h1>
            <p className="text-xs text-[var(--text-subtle)] mt-0.5">
              Dense table triage, multi-column search, and instantaneous ticket inspection
            </p>
          </div>

          <button
            onClick={onNewIssue}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#004FB6] hover:bg-[#0C66E4] text-white text-xs font-label font-medium transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Issue</span>
          </button>
        </div>
      </div>

      {/* 2. JQL Search & Quick Filters Bar */}
      <div className="p-3 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)]" />
            <input
              type="search"
              placeholder="Filter by key, summary, or assignee (e.g. PLAT-412)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded bg-[var(--bg-surface-low)] border border-[var(--border-subtle)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[#0C66E4]"
            />
          </div>
        </div>

        {/* Quick Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'progress', label: 'In Progress' },
            { id: 'review', label: 'In Review' },
            { id: 'todo', label: 'To Do' },
            { id: 'done', label: 'Done' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setStatusFilter(pill.id)}
              className={`px-3 py-1 rounded text-xs font-label transition-colors shrink-0 ${
                statusFilter === pill.id
                  ? 'bg-[var(--status-progress-bg)] text-[#0C66E4] font-semibold border border-[#0C66E4]/30'
                  : 'bg-[var(--bg-surface-low)] text-[var(--text-muted)] hover:text-[var(--text-main)] border border-[var(--border-subtle)]'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Split Layout: Dense Table + Right Inspector */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Issues Table (xl:col-span-8) */}
        <div className="xl:col-span-8 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface-low)] text-[var(--text-subtle)] font-label text-[11px] uppercase tracking-wider">
                <th className="px-3 py-2.5 w-10 text-center">Type</th>
                <th 
                  onClick={() => handleSort('key')}
                  className="px-3 py-2.5 cursor-pointer hover:text-[var(--text-main)] transition-colors w-24"
                >
                  <div className="flex items-center gap-1">
                    <span>Key</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('title')}
                  className="px-3 py-2.5 cursor-pointer hover:text-[var(--text-main)] transition-colors"
                >
                  <div className="flex items-center gap-1">
                    <span>Summary</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-3 py-2.5 w-28">Status</th>
                <th className="px-3 py-2.5 w-20">Priority</th>
                <th className="px-3 py-2.5 w-28">Assignee</th>
                <th 
                  onClick={() => handleSort('points')}
                  className="px-3 py-2.5 text-right cursor-pointer hover:text-[var(--text-main)] transition-colors w-14"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Pts</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-xs">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-[var(--text-subtle)]">
                    No matching issues found for "{query}".
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => {
                  const stateObj = states.find((s) => s.id === issue.status_id);
                  const isSelected = activeInspectorIssue?.id === issue.id;

                  return (
                    <tr
                      key={issue.id}
                      onClick={() => setInspectorIssueId(issue.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[var(--status-progress-bg)] text-[var(--text-main)] font-medium'
                          : 'hover:bg-[var(--bg-surface-low)] text-[var(--text-main)]'
                      }`}
                    >
                      <td className="px-3 py-2.5 text-center">
                        <div className="flex justify-center">{renderTypeIcon(issue.issue_type)}</div>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px] font-bold text-[var(--text-subtle)] whitespace-nowrap">
                        {issue.key}
                      </td>
                      <td className="px-3 py-2.5 max-w-xs truncate font-medium">
                        {issue.title}
                        {issue.is_blocked === 1 && (
                          <span className="ml-2 inline-flex items-center text-[10px] text-[#A54800] bg-[#A54800]/10 px-1.5 py-0.2 rounded font-mono">
                            Blocked
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-label font-medium bg-[var(--bg-surface-container)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                          {stateObj?.name || 'In Progress'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-[var(--text-subtle)] capitalize">
                        {issue.priority || 'Medium'}
                      </td>
                      <td className="px-3 py-2.5 truncate text-[var(--text-subtle)]">
                        {issue.assignee || 'Unassigned'}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono tabular-nums text-[var(--text-subtle)]">
                        {issue.story_points || '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Issue Inspector Pane (xl:col-span-4) */}
        {activeInspectorIssue && (
          <aside
            aria-label="Issue details inspector"
            className="xl:col-span-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] p-5 space-y-5 shadow-sm sticky top-20"
          >
            {/* Header: Key & Epic */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {renderTypeIcon(activeInspectorIssue.issue_type)}
                <span className="font-mono text-xs font-bold text-[var(--text-subtle)]">
                  {activeInspectorIssue.key}
                </span>
                {activeEpic && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-label bg-[#8270DB]/15 text-[#8270DB] font-medium border border-[#8270DB]/30 truncate max-w-[130px]">
                    {activeEpic.name || activeEpic.title || 'Epic'}
                  </span>
                )}
              </div>

              <button
                onClick={() => onSelectIssue && onSelectIssue(activeInspectorIssue)}
                className="text-xs text-[#0C66E4] hover:underline flex items-center gap-1 font-medium"
                title="Open full slide-over drawer"
              >
                <span>Full details</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            {/* Title */}
            <div>
              <h2 className="font-headline text-lg font-bold text-[var(--text-main)] leading-snug">
                {activeInspectorIssue.title}
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-[10px] font-label uppercase tracking-wider font-semibold text-[var(--text-subtle)]">
                Description
              </span>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed bg-[var(--bg-surface-low)] p-3 rounded border border-[var(--border-subtle)]">
                {activeInspectorIssue.description || 'No description provided for this work item.'}
              </p>
            </div>

            {/* Field Grid */}
            <div className="grid grid-cols-2 gap-3 p-3 rounded bg-[var(--bg-surface-low)] border border-[var(--border-subtle)] text-xs">
              <div>
                <span className="text-[10px] text-[var(--text-subtle)] uppercase block font-semibold">
                  Status
                </span>
                <span className="font-medium text-[var(--text-main)] mt-0.5 block">
                  {activeState?.name || 'In Progress'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[var(--text-subtle)] uppercase block font-semibold">
                  Story Points
                </span>
                <span className="font-mono font-bold text-[var(--text-main)] mt-0.5 block">
                  {activeInspectorIssue.story_points ? `${activeInspectorIssue.story_points} pts` : 'Unestimated'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[var(--text-subtle)] uppercase block font-semibold">
                  Assignee
                </span>
                <span className="font-medium text-[var(--text-main)] mt-0.5 block truncate">
                  {activeInspectorIssue.assignee || 'Unassigned'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[var(--text-subtle)] uppercase block font-semibold">
                  Iteration / Sprint
                </span>
                <span className="font-medium text-[var(--text-main)] mt-0.5 block truncate">
                  {activeSprint?.name || 'Backlog Pool'}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <span className="text-[10px] text-[var(--text-subtle)] font-mono">
                Sub-50ms local SQLite
              </span>
              <button
                onClick={() => onSelectIssue && onSelectIssue(activeInspectorIssue)}
                className="px-3 py-1.5 rounded bg-[var(--bg-surface-container)] hover:bg-[var(--bg-surface-high)] text-xs text-[var(--text-main)] font-medium border border-[var(--border-subtle)] transition-colors"
              >
                Edit in Drawer
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
