'use client';

import { useState } from 'react';
import { 
  CheckCircle2, 
  ShieldAlert, 
  FolderKanban,
  Users,
  CheckCircle,
  MoreHorizontal,
  Bookmark,
  Bug,
  CheckSquare,
  Zap,
  ChevronsUp,
  ChevronUp,
  Equal,
  ChevronDown,
  Clock,
  Search,
  Plus
} from 'lucide-react';

const ISSUE_TYPE_CONFIG = {
  story: { label: 'Story', icon: Bookmark, color: 'text-[#22A06B]' },
  task: { label: 'Task', icon: CheckSquare, color: 'text-[#1D7AFC]' },
  bug: { label: 'Bug', icon: Bug, color: 'text-[#E34935]' },
  epic: { label: 'Epic', icon: Zap, color: 'text-[#8270DB]' },
};

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', icon: ChevronsUp, color: 'text-[#E34935]' },
  high: { label: 'High', icon: ChevronUp, color: 'text-[#A54800]' },
  medium: { label: 'Medium', icon: Equal, color: 'text-[#0C66E4]' },
  low: { label: 'Low', icon: ChevronDown, color: 'text-[#727786]' },
  lowest: { label: 'Lowest', icon: ChevronDown, color: 'text-[#8C90A0]' },
};

export default function KanbanBoard({
  states,
  issues,
  epics = [],
  activeSprint,
  onSelectIssue,
  onUpdateIssueStatus,
  onCompleteSprint,
  onOpenStandup,
  selectedIssueId,
}) {
  const [draggedIssueId, setDraggedIssueId] = useState(null);
  const [dragTargetColId, setDragTargetColId] = useState(null);
  const [swimlaneMode, setSwimlaneMode] = useState('none'); // 'none' | 'epics' | 'assignees'
  const [selectedAssigneeFilter, setSelectedAssigneeFilter] = useState(null);

  const handleDragStart = (e, issueId) => {
    e.dataTransfer.setData('text/plain', issueId);
    setDraggedIssueId(issueId);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (dragTargetColId !== colId) {
      setDragTargetColId(colId);
    }
  };

  const handleDragLeave = (colId) => {
    if (dragTargetColId === colId) {
      setDragTargetColId(null);
    }
  };

  const handleDrop = (e, targetStatusId) => {
    e.preventDefault();
    setDragTargetColId(null);
    const issueId = e.dataTransfer.getData('text/plain') || draggedIssueId;
    if (issueId && targetStatusId) {
      onUpdateIssueStatus(issueId, targetStatusId);
    }
    setDraggedIssueId(null);
  };

  // Optional assignee filter
  const displayedIssues = selectedAssigneeFilter
    ? issues.filter((i) => (i.assignee || '').toLowerCase().includes(selectedAssigneeFilter.toLowerCase()))
    : issues;

  // Unique assignees for filter stack
  const uniqueAssignees = Array.from(
    new Set(issues.map((i) => i.assignee).filter(Boolean))
  );

  // Swimlanes
  const swimlanes = [];
  if (swimlaneMode === 'epics') {
    for (const ep of epics) {
      swimlanes.push({
        id: ep.id,
        title: ep.name,
        badge: ep.key,
        color: ep.color,
        issues: displayedIssues.filter((i) => i.epic_id === ep.id),
      });
    }
    const noEpic = displayedIssues.filter((i) => !i.epic_id);
    if (noEpic.length > 0) {
      swimlanes.push({
        id: 'no-epic',
        title: 'Issues without Epic',
        badge: 'General',
        color: 'zinc',
        issues: noEpic,
      });
    }
  } else if (swimlaneMode === 'assignees') {
    const map = {};
    for (const iss of displayedIssues) {
      const a = iss.assignee || 'Unassigned';
      if (!map[a]) map[a] = [];
      map[a].push(iss);
    }
    for (const [assignee, aIssues] of Object.entries(map)) {
      swimlanes.push({
        id: assignee,
        title: assignee,
        badge: 'Squad',
        color: 'blue',
        issues: aIssues,
      });
    }
  } else {
    swimlanes.push({
      id: 'all',
      title: null,
      issues: displayedIssues,
    });
  }

  const totalPoints = displayedIssues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0);

  return (
    <div className="flex-1 flex flex-col p-6 gap-5 overflow-x-auto min-w-0">
      {/* 1. Breadcrumbs & Sprint Header */}
      <div className="flex flex-col gap-1.5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-body text-[var(--text-subtle)]">
          <span>Projects</span>
          <span>/</span>
          <span>Platform Core</span>
          <span>/</span>
          <span className="text-[var(--text-muted)] font-medium">Active sprints</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-headline text-2xl font-bold tracking-tight text-[var(--text-main)]">
              {activeSprint?.name || 'Sprint 24.1 (Active)'}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--bg-surface-container)] text-[var(--text-muted)] text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-[#0C66E4]" />
              <span>6 days remaining</span>
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {onOpenStandup && (
              <button
                onClick={onOpenStandup}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded bg-[var(--status-progress-bg)] text-[#0C66E4] border border-[#0C66E4]/30 hover:bg-[#0C66E4] hover:text-white font-label font-medium text-xs transition-colors"
                title="Launch Daily Standup Mode (Shift+S)"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Daily Standup</span>
              </button>
            )}

            {activeSprint && activeSprint.status === 'active' && (
              <button
                onClick={() => onCompleteSprint && onCompleteSprint(activeSprint.id)}
                className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded bg-[var(--bg-surface-container)] text-[var(--text-main)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-high)] active:bg-[var(--bg-surface-container)] font-label font-medium text-xs transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5 text-[#1F845A]" />
                <span>Complete sprint</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Controls, Assignee Avatar Stack & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-1 border-b border-[var(--border-subtle)]">
        <div className="flex flex-wrap items-center gap-3">
          {/* Assignee Avatar Stack */}
          <div className="flex items-center -space-x-1.5" title="Filter by squad member">
            {uniqueAssignees.map((name) => {
              const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
              const isSelected = selectedAssigneeFilter === name;
              return (
                <button
                  key={name}
                  onClick={() => setSelectedAssigneeFilter(isSelected ? null : name)}
                  className={`w-7 h-7 rounded-full text-[10px] font-mono font-bold flex items-center justify-center border-2 border-[var(--bg-canvas)] transition-transform hover:z-10 hover:scale-110 ${
                    isSelected
                      ? 'bg-[#0C66E4] text-white ring-2 ring-[#0C66E4]'
                      : 'bg-[#8270DB] text-white'
                  }`}
                  title={`Filter by ${name}`}
                >
                  {initials}
                </button>
              );
            })}
          </div>

          {selectedAssigneeFilter && (
            <button
              onClick={() => setSelectedAssigneeFilter(null)}
              className="text-xs text-[#0C66E4] hover:underline font-label"
            >
              Clear filter ({selectedAssigneeFilter.split(' ')[0]})
            </button>
          )}

          {/* Swimlane Toggle */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-[var(--text-subtle)] text-[11px] mr-1">Group by:</span>
            <div className="flex items-center p-0.5 rounded bg-[var(--bg-surface-container)] border border-[var(--border-subtle)]">
              {['none', 'epics', 'assignees'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSwimlaneMode(mode)}
                  className={`px-2.5 py-1 rounded text-xs font-label capitalize transition-all ${
                    swimlaneMode === mode
                      ? 'bg-[var(--bg-card)] text-[var(--text-main)] font-semibold shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {mode === 'none' ? 'Flat' : mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sprint Summary Count */}
        <div className="flex items-center gap-2 text-xs font-body text-[var(--text-subtle)]">
          <span className="font-mono text-mono-sm tabular-nums">
            {displayedIssues.length} issues · {totalPoints} story points
          </span>
        </div>
      </div>

      {/* 3. Kanban Columns Canvas */}
      <div className="space-y-6 min-w-[960px]">
        {swimlanes.map((lane) => (
          <div key={lane.id} className="space-y-2">
            {/* Swimlane Title (if Epics or Assignees) */}
            {lane.title && (
              <div className="flex items-center gap-2 pt-2 pb-1 border-b border-[var(--border-subtle)]">
                <span className="w-2 h-2 rounded-full bg-[#8270DB] shrink-0" />
                <span className="font-headline font-semibold text-xs text-[var(--text-main)]">
                  {lane.title}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-subtle)]">
                  {lane.issues.length} {lane.issues.length === 1 ? 'ticket' : 'tickets'}
                </span>
              </div>
            )}

            {/* Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3.5 items-start">
              {states.map((col) => {
                const colIssues = lane.issues.filter((i) => i.status_id === col.id);
                const colPoints = colIssues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0);
                const isOverWip = col.wip_limit > 0 && colIssues.length > col.wip_limit;
                const isTarget = dragTargetColId === col.id;

                return (
                  <div
                    key={col.id}
                    onDragOver={(e) => handleDragOver(e, col.id)}
                    onDragLeave={() => handleDragLeave(col.id)}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className={`rounded-lg p-2.5 flex flex-col gap-2.5 min-h-[460px] transition-colors ${
                      isTarget
                        ? 'bg-[var(--status-progress-bg)] ring-2 ring-[#0C66E4]'
                        : 'bg-[var(--bg-surface-low)]'
                    }`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between px-1.5 py-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <h2 className="font-label text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider truncate">
                          {col.name}
                        </h2>
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--bg-surface-high)] text-[var(--text-muted)] tabular-nums font-bold">
                          {colIssues.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-subtle)]">
                        <span>{colPoints}p</span>
                        {col.wip_limit > 0 && (
                          <span className={`px-1 rounded ${
                            isOverWip ? 'bg-[#E34935]/20 text-[#E34935] font-bold' : ''
                          }`}>
                            /{col.wip_limit}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cards Container */}
                    <div className="flex flex-col gap-2 flex-1">
                      {colIssues.length === 0 ? (
                        <div className="h-28 border border-dashed border-[var(--border-subtle)] rounded-md flex items-center justify-center text-[11px] text-[var(--text-subtle)]">
                          No issues
                        </div>
                      ) : (
                        colIssues.map((issue) => {
                          const isSelected = selectedIssueId === issue.id;
                          const type = ISSUE_TYPE_CONFIG[issue.issue_type] || ISSUE_TYPE_CONFIG.story;
                          const priority = PRIORITY_CONFIG[issue.priority] || PRIORITY_CONFIG.medium;
                          const TypeIcon = type.icon;
                          const PriorityIcon = priority.icon;
                          const hasSubtasks = issue.subtask_total > 0;

                          return (
                            <div
                              key={issue.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, issue.id)}
                              onClick={() => onSelectIssue(issue)}
                              className={`issue-card group p-3 rounded-md bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[#0C66E4] hover:bg-[var(--bg-card-hover)] cursor-pointer select-none transition-all duration-100 flex flex-col gap-2 active:cursor-grabbing ${
                                isSelected
                                  ? 'ring-2 ring-[#0C66E4] border-[#0C66E4]'
                                  : issue.is_blocked === 1
                                  ? 'border-[#E34935]/60 bg-[#E34935]/5'
                                  : ''
                              }`}
                            >
                              {/* Epic Lozenge if attached */}
                              {issue.epic_name && (
                                <div className="flex items-center">
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-label font-semibold uppercase bg-[var(--status-review-bg)] text-[var(--status-review)] truncate max-w-[160px]">
                                    {issue.epic_name}
                                  </span>
                                </div>
                              )}

                              {/* Issue Title */}
                              <h3 className="font-title text-[13px] font-medium text-[var(--text-main)] leading-snug line-clamp-2 text-left">
                                {issue.title}
                              </h3>

                              {/* Active Blocker Banner */}
                              {issue.is_blocked === 1 && (
                                <div className="p-1.5 rounded bg-[#E34935]/15 border border-[#E34935]/30 text-[10px] text-[#E34935] flex items-center gap-1">
                                  <ShieldAlert className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{issue.blocked_reason || 'Blocked'}</span>
                                </div>
                              )}

                              {/* Card Footer: Type Icon, Key, Priority, Points, Assignee */}
                              <div className="flex items-center justify-between gap-1 pt-1 border-t border-[var(--border-subtle)]/50">
                                <div className="flex items-center gap-1.5">
                                  <TypeIcon className={`w-3.5 h-3.5 ${type.color} shrink-0`} />
                                  <span className="font-mono text-mono-sm text-[var(--text-subtle)] group-hover:text-[#0C66E4] transition-colors">
                                    {issue.key}
                                  </span>
                                  {hasSubtasks && (
                                    <span className="text-[10px] font-mono text-[var(--text-subtle)]">
                                      {issue.subtask_done}/{issue.subtask_total}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <PriorityIcon className={`w-3.5 h-3.5 ${priority.color}`} title={priority.label} />
                                  <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--bg-surface-container)] text-[var(--text-muted)] font-semibold tabular-nums">
                                    {issue.story_points || 0}
                                  </span>
                                  <div
                                    className="w-5 h-5 rounded-full bg-[#0C66E4] text-white font-mono font-bold text-[9px] flex items-center justify-center shrink-0"
                                    title={issue.assignee || 'Unassigned'}
                                  >
                                    {(issue.assignee || 'U').slice(0, 2).toUpperCase()}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
