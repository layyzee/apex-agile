'use client';

import { useState, useMemo } from 'react';

// Canonical team avatar photo map from Stitch design
const AVATAR_PHOTOS = {
  elena: 'https://lh3.googleusercontent.com/aida/ALJJyrDT0ygT73l1oUoLN-ldq4D7iK67gQRn2Jk7sBkqg00OyGKoqWQZmoRgvpSJ9yBujVKEsKamItF_rzwvRR9GvaIUS4xjNTiLupFexLBJ7GFYZdSJkyY5uCqQXPuCpnXXcN3cZl0SjBUXkf08AfWbQLcqKuuD5bWUTUaMgsKPLsXBFH58TvdsBeHggVY-ycBQeeRkHLak_R1Bx4dYrDhktkSi7Y1mbVHmwnKtJZuZJfFUTrMrLQNe',
  marcus: 'https://lh3.googleusercontent.com/aida/ALJJyrDgKx4jLzMiXGShOOaAzLOjwe-zDqHHXWBB1EKN99ni4lK8OMMkRiG-_xTTRI7voe3_3HfhmuaPa5-6F_6xJ4jLmz7pBtBqo4WWmFsxDVbWJC_K4-hU1FtU8r_-lAvFTzWcpMVWSnbVsdLHaUUaLN35F1HkIRAKQNdISHkxepLOraNDp84np6OnjPQaRH6GBuDuhRAIfTTnSiJ6_WcsbFEJJAkaKaLCGpruOK8dxOBzLEGjhYYpXw',
  priya: 'https://lh3.googleusercontent.com/aida/ALJJyrCklGpvdGYSopZxSSrRrPtkBdl957Q7Ogz3uX4fzie9G6mTQH6uP4Ci9ogj6r8yyxr5FSklMt7HTI9LHmOQx-1AJAW00HC-R94bmNKCEc1e-aUownDKA7Pw9u-0SzqwGKOMXci_2P53ra7QQllboBJxCniFDjxsHLcxZZzShy3IZKKuPnALJYUM8lxbC3lHfz-oLxtUKoE_SWLs1a7Uj3mETCnd6AwoJglU90DUhLV8p3Jl2FT6',
  kenji: 'https://lh3.googleusercontent.com/aida/ALJJyrBLdMi5794naAeeCGG9DPABynyRt6Kim8iD-BJ15u6KvCSy_z-bZ0rWPW2JTpGksViGt4Yhc8-g9QJ2O4mGtC7-aSzx_oMVSgOebe-dPhF6N6c_UQfVmFAqtxO6uiBV29EU8xE7bMFUcK8xvF2msv3T8RMNnRxl_QVBhXA_LavlWbFf1jFPvTN4LuPBqMy4W0pO5UpgwlOHIyzGiTZTEFovVZW8yWTboQYzKXGMJ4Gt6YcDFOE',
};

function getAssigneePhoto(assignee = '') {
  const name = assignee.toLowerCase();
  if (name.includes('elena')) return AVATAR_PHOTOS.elena;
  if (name.includes('marcus')) return AVATAR_PHOTOS.marcus;
  if (name.includes('priya')) return AVATAR_PHOTOS.priya;
  if (name.includes('kenji')) return AVATAR_PHOTOS.kenji;
  return AVATAR_PHOTOS.elena;
}

function getEpicBadgeStyle(epicName = '') {
  const name = (epicName || '').toLowerCase();
  if (name.includes('auth')) {
    return 'bg-status-review-bg text-status-review';
  }
  if (name.includes('telemetry')) {
    return 'bg-status-progress-bg text-status-progress';
  }
  if (name.includes('infra')) {
    return 'bg-light-error-container text-light-on-error-container';
  }
  if (name.includes('design')) {
    return 'bg-status-done-bg text-light-on-surface';
  }
  return 'bg-light-surface-container text-light-on-surface-variant';
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

  return (
    <main className="flex-1 min-w-0 p-gutter-xl flex flex-col gap-gutter-lg overflow-y-auto">
      {/* 1. Breadcrumb & Sprint Header */}
      <div className="flex flex-col gap-gutter-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-gutter-xs font-body text-body-sm text-light-on-surface-variant">
          <span className="hover:text-light-on-surface cursor-pointer">Projects</span>
          <span aria-hidden="true">/</span>
          <span className="hover:text-light-on-surface cursor-pointer">Platform Core</span>
          <span aria-hidden="true">/</span>
          <span className="text-light-on-surface-variant font-medium">Active sprints</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-gutter-md pt-1">
          <div className="flex flex-wrap items-center gap-gutter-md">
            <h1 className="font-headline text-headline-lg text-light-on-surface text-balance font-bold">
              {activeSprint?.name || 'PLAT Sprint 42: Auth & Telemetry'}
            </h1>
            <span className="inline-flex items-center gap-gutter-xs px-gutter-sm py-1 rounded-sm bg-light-surface-container text-light-on-surface-variant tabular-nums">
              <span className="material-symbols-outlined text-[15px]" aria-hidden="true">schedule</span>
              <span className="font-label text-label-md">6 days remaining</span>
            </span>
          </div>

          <div className="flex items-center gap-gutter-sm">
            <button
              onClick={onCompleteSprint}
              type="button"
              className="inline-flex items-center justify-center h-8 px-gutter-lg rounded-sm bg-light-surface-container text-light-on-surface border border-light-outline-variant hover:bg-light-surface-container-high active:bg-light-surface-container-highest transition-colors font-label text-label-lg cursor-pointer"
            >
              Complete sprint
            </button>

            <button
              onClick={onOpenStandup}
              type="button"
              aria-label="Daily standup & options"
              title="Launch Live Daily Standup"
              className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">more_horiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Filter & Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-gutter-md">
        <div className="flex flex-wrap items-center gap-gutter-md">
          {/* Board Search */}
          <div className="relative flex items-center w-56 rounded-sm bg-light-surface-container-lowest border border-light-outline-variant focus-within:border-light-primary focus-within:ring-1 focus-within:ring-light-primary transition-colors">
            <div className="pl-gutter-sm pr-gutter-xs text-light-on-surface-variant flex items-center">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">search</span>
            </div>
            <input
              type="search"
              aria-label="Search this board"
              placeholder="Search this board"
              value={searchBoard}
              onChange={(e) => setSearchBoard(e.target.value)}
              className="w-full py-1.5 pr-gutter-sm bg-transparent border-0 font-body text-body-sm text-light-on-surface placeholder:text-light-on-surface-variant focus:ring-0 outline-none"
            />
          </div>

          {/* Assignee Avatar Filter Stack */}
          <div className="flex items-center -space-x-1.5" role="group" aria-label="Filter by assignee">
            {[
              { id: 'Elena', name: 'Elena Rostova', photo: AVATAR_PHOTOS.elena },
              { id: 'Marcus', name: 'Marcus Vance', photo: AVATAR_PHOTOS.marcus },
              { id: 'Priya', name: 'Priya Nair', photo: AVATAR_PHOTOS.priya },
              { id: 'Kenji', name: 'Kenji Sato', photo: AVATAR_PHOTOS.kenji },
            ].map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => setSelectedAssignee(selectedAssignee === member.id ? null : member.id)}
                title={`Filter by ${member.name}`}
                className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform hover:z-10 hover:scale-105 cursor-pointer ${
                  selectedAssignee === member.id
                    ? 'ring-2 ring-light-primary border-light-primary scale-105'
                    : 'border-light-surface'
                }`}
              >
                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Quick Filter Chips */}
          <div className="flex items-center gap-gutter-xs">
            <button
              type="button"
              onClick={() => setOnlyMyIssues((prev) => !prev)}
              className={`px-gutter-md py-1.5 rounded-sm transition-colors font-label text-label-md cursor-pointer ${
                onlyMyIssues
                  ? 'bg-status-progress-bg text-light-primary font-semibold'
                  : 'bg-transparent text-light-on-surface-variant hover:bg-light-surface-container-low hover:text-light-on-surface'
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
                className="px-gutter-md py-1.5 rounded-sm bg-transparent text-light-primary hover:bg-status-progress-bg transition-colors font-label text-label-md cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Sprint Progress Summary */}
        <div className="flex items-center gap-gutter-sm text-light-on-surface-variant">
          <span className="font-body text-body-sm tabular-nums">
            {filteredIssues.length} issues · {totalPoints} story points
          </span>
        </div>
      </div>

      {/* 3. 4-Column Kanban Board */}
      <section aria-label="Sprint Kanban Board" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter-lg items-start">
        {boardColumns.map((col) => {
          // Match issues based on col.id or state category
          const colIssues = filteredIssues.filter((i) => {
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

          const isTarget = dragTargetColId === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={() => handleDragLeave(col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded bg-light-surface-container-low p-gutter-md flex flex-col gap-gutter-md min-h-[440px] transition-colors ${
                isTarget ? 'ring-2 ring-light-primary bg-status-progress-bg' : ''
              }`}
            >
              {/* Column Header */}
              <header className="flex items-center justify-between px-gutter-xs">
                <div className="flex items-center gap-gutter-sm">
                  <h2 className="font-label text-label-md text-light-on-surface-variant uppercase tracking-wider font-bold">
                    {col.name.toUpperCase()}
                  </h2>
                  <span className="col-count inline-flex items-center justify-center px-gutter-sm py-0.5 rounded-full bg-light-surface-container-high text-light-on-surface-variant tabular-nums">
                    <span className="font-mono text-mono-sm font-semibold">{colIssues.length}</span>
                  </span>
                </div>
                <button
                  type="button"
                  aria-label={`Add issue to ${col.name}`}
                  className="quick-add-col w-6 h-6 rounded-sm text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">add</span>
                </button>
              </header>

              {/* Cards Container */}
              <div className="column-cards flex flex-col gap-gutter-sm">
                {colIssues.length === 0 ? (
                  <div className="h-28 border border-dashed border-light-outline-variant rounded-sm flex items-center justify-center text-body-sm text-light-on-surface-variant">
                    No issues
                  </div>
                ) : (
                  colIssues.map((issue) => {
                    const isSelected = selectedIssueId === issue.id;
                    const epicName = issue.epic_name || (issue.epic_id ? issue.epic_id.replace('epic-', '').toUpperCase() : 'Auth v3');
                    const epicBadgeClass = getEpicBadgeStyle(epicName);
                    const assigneePhoto = getAssigneePhoto(issue.assignee);
                    const issueType = (issue.issue_type || 'story').toLowerCase();
                    const priority = (issue.priority || 'medium').toLowerCase();

                    return (
                      <div
                        key={issue.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, issue.id)}
                        onClick={() => onSelectIssue && onSelectIssue(issue)}
                        className={`issue-card w-full p-gutter-md rounded bg-light-surface-container-lowest border border-light-outline-variant hover:border-light-primary hover:bg-light-surface-container-low/40 transition-colors cursor-pointer flex flex-col gap-gutter-sm shadow-xs ${
                          isSelected ? 'ring-2 ring-light-primary border-light-primary' : ''
                        }`}
                      >
                        {/* Epic Lozenge */}
                        <div className="flex items-center justify-between gap-gutter-xs">
                          <span className={`inline-flex items-center px-gutter-sm py-0.5 rounded-sm uppercase font-label text-label-sm font-semibold ${epicBadgeClass}`}>
                            {epicName}
                          </span>
                        </div>

                        {/* Card Title */}
                        <h3 className="issue-title font-title text-title-sm text-light-on-surface text-pretty font-semibold leading-snug">
                          {issue.title}
                        </h3>

                        {/* Card Footer: Type, Key, Priority, Points, Assignee Photo */}
                        <div className="flex items-center justify-between gap-gutter-sm pt-gutter-xs">
                          <div className="flex items-center gap-gutter-xs">
                            {issueType === 'task' ? (
                              <span className="material-symbols-outlined text-[16px] text-issue-task" style={{ fontVariationSettings: "'FILL' 1" }} aria-label="Task">
                                check_box
                              </span>
                            ) : issueType === 'bug' ? (
                              <span className="material-symbols-outlined text-[16px] text-issue-bug" style={{ fontVariationSettings: "'FILL' 1" }} aria-label="Bug">
                                bug_report
                              </span>
                            ) : (
                              <span className="material-symbols-outlined text-[16px] text-issue-story" style={{ fontVariationSettings: "'FILL' 1" }} aria-label="Story">
                                bookmark
                              </span>
                            )}
                            <span className="font-mono text-mono-sm text-light-on-surface-variant tabular-nums font-medium">
                              {issue.key}
                            </span>
                          </div>

                          <div className="flex items-center gap-gutter-sm">
                            {priority === 'high' || priority === 'critical' ? (
                              <span className="material-symbols-outlined text-[16px] text-issue-bug" title="High priority" aria-hidden="true">
                                keyboard_double_arrow_up
                              </span>
                            ) : priority === 'low' || priority === 'lowest' ? (
                              <span className="material-symbols-outlined text-[16px] text-status-done" title="Low priority" aria-hidden="true">
                                keyboard_arrow_down
                              </span>
                            ) : (
                              <span className="material-symbols-outlined text-[16px] text-status-warning" title="Medium priority" aria-hidden="true">
                                drag_handle
                              </span>
                            )}

                            <span className="font-mono text-mono-sm px-gutter-sm py-0.5 rounded-full bg-light-surface-container text-light-on-surface-variant tabular-nums font-semibold">
                              {issue.story_points || 0}
                            </span>

                            <img
                              src={assigneePhoto}
                              alt={issue.assignee || 'Assignee'}
                              className="w-6 h-6 rounded-full object-cover border border-light-outline-variant shrink-0"
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
