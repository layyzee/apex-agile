'use client';

import { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  CircleDot, 
  ShieldAlert, 
  ArrowUpRight,
  FolderKanban,
  Users,
  CheckCircle,
  MoreHorizontal
} from 'lucide-react';

const PRIORITY_ICONS = {
  critical: { label: 'Critical', color: 'text-rose-400' },
  high: { label: 'High', color: 'text-amber-400' },
  medium: { label: 'Med', color: 'text-blue-400' },
  low: { label: 'Low', color: 'text-zinc-500' },
  lowest: { label: 'Lowest', color: 'text-zinc-600' },
};

const TYPE_CONFIG = {
  story: { label: 'Story', icon: '📘' },
  task: { label: 'Task', icon: '⚡' },
  bug: { label: 'Bug', icon: '🔴' },
  epic: { label: 'Epic', icon: '🟣' },
};

const EPIC_DOTS = {
  purple: 'bg-purple-400 shadow-purple-500/50',
  teal: 'bg-teal-400 shadow-teal-500/50',
  amber: 'bg-amber-400 shadow-amber-500/50',
  blue: 'bg-blue-400 shadow-blue-500/50',
  rose: 'bg-rose-400 shadow-rose-500/50',
  emerald: 'bg-emerald-400 shadow-emerald-500/50',
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

  // Swimlane buckets
  const swimlanes = [];
  if (swimlaneMode === 'epics') {
    for (const ep of epics) {
      swimlanes.push({
        id: ep.id,
        title: ep.name,
        badge: ep.key,
        color: ep.color,
        issues: issues.filter((i) => i.epic_id === ep.id),
      });
    }
    const noEpic = issues.filter((i) => !i.epic_id);
    if (noEpic.length > 0) {
      swimlanes.push({
        id: 'no-epic',
        title: 'Other Issues',
        badge: 'General',
        color: 'zinc',
        issues: noEpic,
      });
    }
  } else if (swimlaneMode === 'assignees') {
    const assigneeMap = {};
    for (const iss of issues) {
      const a = iss.assignee || 'Unassigned';
      if (!assigneeMap[a]) assigneeMap[a] = [];
      assigneeMap[a].push(iss);
    }
    for (const [assignee, aIssues] of Object.entries(assigneeMap)) {
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
      issues: issues,
    });
  }

  return (
    <div className="flex-1 flex flex-col overflow-x-auto p-6 space-y-4">
      {/* Board Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        {/* Swimlane Selector */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-500 font-medium text-[11px] mr-1">Group by:</span>
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-white/[0.06]">
            <button
              onClick={() => setSwimlaneMode('none')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                swimlaneMode === 'none'
                  ? 'bg-zinc-800 text-white font-medium border border-white/[0.08]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Flat
            </button>
            <button
              onClick={() => setSwimlaneMode('epics')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                swimlaneMode === 'epics'
                  ? 'bg-zinc-800 text-purple-300 font-medium border border-white/[0.08]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FolderKanban className="w-3 h-3 text-purple-400" />
              <span>Epics</span>
            </button>
            <button
              onClick={() => setSwimlaneMode('assignees')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                swimlaneMode === 'assignees'
                  ? 'bg-zinc-800 text-blue-300 font-medium border border-white/[0.08]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Users className="w-3 h-3 text-blue-400" />
              <span>Assignees</span>
            </button>
          </div>
        </div>

        {/* Actions: Standup & Complete Sprint */}
        <div className="flex items-center gap-2">
          {onOpenStandup && (
            <button
              onClick={onOpenStandup}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/30 text-xs font-medium transition-colors active:scale-[0.98]"
              title="Launch Live Daily Standup (Shift+S)"
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Daily Standup</span>
            </button>
          )}

          {activeSprint && activeSprint.status === 'active' && (
            <button
              onClick={() => onCompleteSprint && onCompleteSprint(activeSprint.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors active:scale-[0.98]"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Complete Sprint</span>
            </button>
          )}
        </div>
      </div>

      {/* Swimlanes Canvas */}
      <div className="space-y-6 min-w-[1100px]">
        {swimlanes.map((lane) => (
          <div key={lane.id} className="space-y-2">
            {/* Swimlane Section Title */}
            {lane.title && (
              <div className="flex items-center gap-2 pt-2 pb-1 border-b border-white/[0.05]">
                <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                <span className="text-xs font-semibold text-zinc-200">{lane.title}</span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {lane.issues.length} {lane.issues.length === 1 ? 'story' : 'stories'}
                </span>
              </div>
            )}

            {/* Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-start">
              {states.map((col) => {
                const colIssues = lane.issues.filter((i) => i.status_id === col.id);
                const colPoints = colIssues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0);
                const isOverWip = col.wip_limit > 0 && colIssues.length > col.wip_limit;
                const isTarget = dragTargetColId === `${lane.id}-${col.id}`;

                return (
                  <div
                    key={col.id}
                    onDragOver={(e) => handleDragOver(e, `${lane.id}-${col.id}`)}
                    onDragLeave={() => handleDragLeave(`${lane.id}-${col.id}`)}
                    onDrop={(e) => handleDrop(e, col.id)}
                    className={`flex flex-col rounded-xl bg-[#0d0d10] border transition-all duration-150 min-h-[460px] ${
                      isTarget
                        ? 'border-blue-500/80 bg-blue-950/20 ring-1 ring-blue-500/30'
                        : 'border-white/[0.06]'
                    }`}
                  >
                    {/* Column Header */}
                    <div className="p-3 border-b border-white/[0.04] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-zinc-300">
                          {col.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-zinc-900 text-zinc-400 border border-white/[0.05]">
                          {colIssues.length}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                        <span>{colPoints} pts</span>
                        {col.wip_limit > 0 && (
                          <span className={`px-1 py-0.2 rounded border ${
                            isOverWip ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold' : 'bg-zinc-900 text-zinc-500 border-white/[0.05]'
                          }`}>
                            {colIssues.length}/{col.wip_limit}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Cards Column */}
                    <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                      {colIssues.length === 0 ? (
                        <div className="h-28 border border-dashed border-white/[0.04] rounded-lg flex items-center justify-center text-[11px] text-zinc-600">
                          No issues
                        </div>
                      ) : (
                        colIssues.map((issue) => {
                          const isSelected = selectedIssueId === issue.id;
                          const priority = PRIORITY_ICONS[issue.priority] || PRIORITY_ICONS.medium;
                          const type = TYPE_CONFIG[issue.issue_type] || TYPE_CONFIG.story;
                          const dotColor = EPIC_DOTS[issue.epic_color] || 'bg-purple-400';
                          const hasSubtasks = issue.subtask_total > 0;

                          return (
                            <div
                              key={issue.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, issue.id)}
                              onClick={() => onSelectIssue(issue)}
                              className={`group relative p-3 rounded-lg border cursor-pointer select-none transition-all duration-150 active:cursor-grabbing ${
                                isSelected
                                  ? 'bg-[#16161c] border-blue-500/80 ring-1 ring-blue-500/30'
                                  : issue.is_blocked
                                  ? 'bg-[#151214] border-rose-500/30 hover:border-rose-500/50'
                                  : 'bg-[#121215] border-white/[0.07] hover:border-white/20 hover:bg-[#151519]'
                              }`}
                            >
                              {/* Top Bar: Epic Dot & Key */}
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <div className="flex items-center gap-1.5 truncate">
                                  {issue.epic_name && (
                                    <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-400 truncate max-w-[140px]">
                                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
                                      <span className="truncate">{issue.epic_name}</span>
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-white/[0.06] text-zinc-300">
                                    {issue.story_points} pts
                                  </span>
                                  <span className={`text-[10px] font-medium ${priority.color}`}>
                                    {priority.label}
                                  </span>
                                </div>
                              </div>

                              {/* Title */}
                              <h4 className="text-xs font-medium text-zinc-100 line-clamp-2 leading-relaxed mb-2.5 text-left group-hover:text-white transition-colors">
                                {issue.title}
                              </h4>

                              {/* Blocker Callout if Flagged */}
                              {issue.is_blocked === 1 && (
                                <div className="mb-2 p-1.5 rounded bg-rose-950/30 border border-rose-500/30 flex items-start gap-1.5 text-[10px] text-rose-300">
                                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.2" />
                                  <span className="line-clamp-1">{issue.blocked_reason || 'Blocked'}</span>
                                </div>
                              )}

                              {/* Bottom Bar: Key, Subtasks, Assignee */}
                              <div className="flex items-center justify-between pt-1.5 border-t border-white/[0.04] text-[10px] text-zinc-500 font-mono">
                                <div className="flex items-center gap-2">
                                  <span className="text-zinc-400 group-hover:text-blue-400 transition-colors">
                                    {issue.key}
                                  </span>
                                  {hasSubtasks && (
                                    <span className="text-zinc-500">
                                      {issue.subtask_done}/{issue.subtask_total}
                                    </span>
                                  )}
                                </div>

                                <span className="truncate max-w-[110px] text-zinc-400 font-sans">
                                  {issue.assignee ? issue.assignee.split(' ')[0] : 'Unassigned'}
                                </span>
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
