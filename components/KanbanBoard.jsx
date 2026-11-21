'use client';

import { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  CheckSquare, 
  Bug, 
  Bookmark, 
  ChevronsUp, 
  Equal, 
  ChevronDown, 
  Clock, 
  MoreHorizontal 
} from 'lucide-react';
import Avatar from './Avatar';

function getEpicBadgeStyle(epicName = '') {
  const name = (epicName || '').toLowerCase();
  if (name.includes('auth')) {
    return 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
  }
  if (name.includes('telemetry')) {
    return 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
  }
  if (name.includes('infra')) {
    return 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
  }
  if (name.includes('design')) {
    return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  }
  return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
}

export default function KanbanBoard({
  states = [],
  issues = [],
  epics = [],
  activeSprint,
  selectedIssueId,
  onSelectIssue,
  onUpdateIssueStatus,
  onCompleteSprint,
  onOpenStandup,
}) {
  const [searchBoard, setSearchBoard] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [onlyMyIssues, setOnlyMyIssues] = useState(false);
  const [draggedIssueId, setDraggedIssueId] = useState(null);
  const [dragTargetColId, setDragTargetColId] = useState(null);
  const [mobileColId, setMobileColId] = useState(null);

  // Filter Issues
  const filteredIssues = useMemo(() => {
    return issues.filter((i) => {
      if (searchBoard.trim()) {
        const q = searchBoard.toLowerCase();
        const matches =
          i.key.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          (i.assignee && i.assignee.toLowerCase().includes(q));
        if (!matches) return false;
      }
      if (selectedAssignee) {
        if (!i.assignee || !i.assignee.toLowerCase().includes(selectedAssignee.toLowerCase())) {
          return false;
        }
      }
      if (onlyMyIssues) {
        if (!i.assignee || !i.assignee.toLowerCase().includes('elena')) {
          return false;
        }
      }
      return true;
    });
  }, [issues, searchBoard, selectedAssignee, onlyMyIssues]);

  const totalPoints = filteredIssues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0);

  // Group columns into standard 4 Atlassian columns: To Do, In Progress, In Review, Done
  const boardColumns = useMemo(() => {
    if (states.length >= 4) {
      return states.slice(0, 4);
    }
    return [
      { id: 'todo', name: 'TO DO' },
      { id: 'progress', name: 'IN PROGRESS' },
      { id: 'review', name: 'IN REVIEW' },
      { id: 'done', name: 'DONE' },
    ];
  }, [states]);

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

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setDragTargetColId(null);
    const issueId = e.dataTransfer.getData('text/plain') || draggedIssueId;
    if (issueId && colId && onUpdateIssueStatus) {
      onUpdateIssueStatus(issueId, colId);
    }
    setDraggedIssueId(null);
  };

  const getColIssues = (col) => {
    return filteredIssues.filter((i) => {
      if (i.status_id === col.id) return true;
      const stateObj = states.find((s) => s.id === i.status_id);
      const stateName = (stateObj?.name || '').toLowerCase();
      const colName = col.name.toLowerCase();

      if (colName.includes('to do') || col.id === 'todo') {
        return stateName.includes('to do') || stateName.includes('backlog') || stateObj?.category === 'todo';
      }
      if (colName.includes('in progress') || col.id === 'progress') {
        return stateName.includes('progress') || stateName.includes('dev');
      }
      if (colName.includes('review') || col.id === 'review') {
        return stateName.includes('review') || stateName.includes('qa');
      }
      if (colName.includes('done') || col.id === 'done') {
        return stateName.includes('done') || stateName.includes('closed') || stateObj?.category === 'done';
      }
      return false;
    });
  };

  const teamFilterMembers = [
    { id: 'Elena', name: 'Elena Rostova' },
    { id: 'Marcus', name: 'Marcus Vance' },
    { id: 'Priya', name: 'Priya Nair' },
    { id: 'Kenji', name: 'Kenji Sato' },
  ];

  return (
    <main className="flex-1 min-w-0 p-4 sm:p-6 pb-24 md:pb-6 flex flex-col gap-4 sm:gap-6 overflow-y-auto overflow-x-hidden">
      {/* 1. Breadcrumb & Sprint Header (Desktop only) */}
      <div className="hidden md:flex flex-col gap-1.5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">Projects</span>
          <span aria-hidden="true">/</span>
          <span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">Platform Core</span>
          <span aria-hidden="true">/</span>
          <span className="text-slate-800 dark:text-slate-200 font-medium">Active sprints</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-headline text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {activeSprint?.name || 'PLAT Sprint 42: Auth & Telemetry'}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>6 days remaining</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onCompleteSprint}
              type="button"
              className="inline-flex items-center justify-center h-8 px-4 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-semibold cursor-pointer shadow-xs"
            >
              Complete sprint
            </button>

            <button
              type="button"
              aria-label="Sprint options"
              className="inline-flex items-center justify-center w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Filter & Quick Actions Bar (Desktop only) */}
      <div className="hidden md:flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Board Search */}
          <div className="relative flex items-center w-56 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors">
            <div className="pl-2.5 pr-1.5 text-slate-400 flex items-center">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="search"
              aria-label="Search this board"
              placeholder="Search this board"
              value={searchBoard}
              onChange={(e) => setSearchBoard(e.target.value)}
              className="w-full py-1.5 pr-2.5 bg-transparent border-0 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 outline-none"
            />
          </div>

          {/* Assignee Avatar Filter Stack */}
          <div className="flex items-center -space-x-1.5" role="group" aria-label="Filter by assignee">
            {teamFilterMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => setSelectedAssignee(selectedAssignee === member.id ? null : member.id)}
                title={`Filter by ${member.name}`}
                className={`rounded-full transition-transform hover:z-10 hover:scale-105 cursor-pointer ${
                  selectedAssignee === member.id
                    ? 'ring-2 ring-blue-500 scale-105'
                    : ''
                }`}
              >
                <Avatar name={member.name} size="sm" />
              </button>
            ))}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setOnlyMyIssues((prev) => !prev)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                onlyMyIssues
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Only my issues
            </button>

            {(searchBoard || selectedAssignee || onlyMyIssues) && (
              <button
                type="button"
                onClick={() => {
                  setSearchBoard('');
                  setSelectedAssignee(null);
                  setOnlyMyIssues(false);
                }}
                className="px-3 py-1.5 rounded text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Sprint Summary Metrics */}
        <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
          <span>{filteredIssues.length} issues</span>
          <span>·</span>
          <span>{totalPoints} story points</span>
        </div>
      </div>

      {/* Mobile Column Switcher Tabs */}
      {(() => {
        const activeMobileColId = mobileColId || boardColumns[1]?.id || boardColumns[0]?.id;
        return (
          <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 select-none">
            {boardColumns.map((col) => {
              const count = getColIssues(col).length;
              const isActive = activeMobileColId === col.id;
              return (
                <button
                  key={col.id}
                  onClick={() => setMobileColId(col.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {col.name} ({count})
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* 3. 4-Column Kanban Board */}
      <section aria-label="Sprint Kanban Board" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {boardColumns.map((col) => {
          const colIssues = getColIssues(col);
          const activeMobileColId = mobileColId || boardColumns[1]?.id || boardColumns[0]?.id;
          const isSelectedMobile = activeMobileColId === col.id;
          const isTarget = dragTargetColId === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={() => handleDragLeave(col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-lg md:bg-slate-100/70 md:dark:bg-slate-800/40 p-0 md:p-3 flex-col gap-2.5 min-h-0 md:min-h-[460px] transition-colors ${
                isTarget ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' : ''
              } ${isSelectedMobile ? 'flex' : 'hidden md:flex'}`}
            >
              {/* Column Header (Desktop only) */}
              <header className="hidden md:flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    {col.name}
                  </h2>
                  <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {colIssues.length}
                  </span>
                </div>
                <button
                  type="button"
                  aria-label={`Add issue to ${col.name}`}
                  className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </header>

              {/* Cards Container */}
              <div className="flex flex-col gap-2.5 w-full">
                {colIssues.length === 0 ? (
                  <div className="h-28 border border-dashed border-slate-300 dark:border-slate-700 rounded flex items-center justify-center text-xs text-slate-400">
                    No issues
                  </div>
                ) : (
                  colIssues.map((issue) => {
                    const isSelected = selectedIssueId === issue.id;
                    const epicName = issue.epic_name || (issue.epic_id ? issue.epic_id.replace('epic-', '').toUpperCase() : 'AUTH V3');
                    const epicBadgeClass = getEpicBadgeStyle(epicName);
                    const issueType = (issue.issue_type || 'story').toLowerCase();
                    const priority = (issue.priority || 'medium').toLowerCase();

                    return (
                      <div
                        key={issue.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, issue.id)}
                        onClick={() => onSelectIssue && onSelectIssue(issue)}
                        className={`w-full p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xs transition-all cursor-pointer flex flex-col gap-2.5 shadow-2xs ${
                          isSelected ? 'ring-2 ring-blue-500 border-blue-500' : ''
                        }`}
                      >
                        {/* Epic Lozenge */}
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${epicBadgeClass}`}>
                            {epicName}
                          </span>
                        </div>

                        {/* Card Title */}
                        <h3 className="font-title text-sm text-slate-900 dark:text-white font-semibold leading-snug line-clamp-2">
                          {issue.title}
                        </h3>

                        {/* Card Footer: Type, Key, Priority, Points, Assignee */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
                          <div className="flex items-center gap-1.5">
                            {issueType === 'task' ? (
                              <CheckSquare className="w-4 h-4 text-blue-500 shrink-0" />
                            ) : issueType === 'bug' ? (
                              <Bug className="w-4 h-4 text-red-500 shrink-0" />
                            ) : (
                              <Bookmark className="w-4 h-4 text-emerald-500 shrink-0" />
                            )}
                            <span className="font-mono text-xs text-slate-500 font-medium">
                              {issue.key}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {priority === 'high' || priority === 'critical' ? (
                              <ChevronsUp className="w-4 h-4 text-red-500 shrink-0" title="High priority" />
                            ) : priority === 'low' || priority === 'lowest' ? (
                              <ChevronDown className="w-4 h-4 text-emerald-500 shrink-0" title="Low priority" />
                            ) : (
                              <Equal className="w-4 h-4 text-amber-500 shrink-0" title="Medium priority" />
                            )}

                            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                              {issue.story_points || 0}
                            </span>

                            <Avatar 
                              name={issue.assignee || 'Elena Rostova'} 
                              size="xs" 
                            />
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
      </section>
    </main>
  );
}
