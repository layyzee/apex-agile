'use client';

import { useState } from 'react';
import Avatar from './Avatar';

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
  if (name.includes('auth')) return 'bg-status-review-bg text-status-review';
  if (name.includes('telemetry')) return 'bg-status-progress-bg text-status-progress';
  if (name.includes('infra')) return 'bg-light-error-container text-light-on-error-container';
  if (name.includes('design')) return 'bg-status-done-bg text-light-on-surface';
  return 'bg-light-surface-container text-light-on-surface-variant';
}

export default function BacklogView({
  sprints = [],
  issues = [],
  epics = [],
  onSelectIssue,
  onUpdateSprintAssignment,
  onUpdateStoryPoints,
  onNewIssueWithSprint,
  onCreateSprint,
  onStartSprint,
  onCompleteSprint,
  onCreateEpic,
}) {
  const [searchBacklog, setSearchBacklog] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [selectedEpicFilter, setSelectedEpicFilter] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({});
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);
  const [newSprintName, setNewSprintName] = useState('');
  const [newSprintGoal, setNewSprintGoal] = useState('');

  const toggleSection = (id) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateSprintSubmit = async (e) => {
    e.preventDefault();
    if (!newSprintName.trim()) return;
    await onCreateSprint({
      name: newSprintName.trim(),
      goal: newSprintGoal.trim(),
      duration_weeks: 2,
    });
    setNewSprintName('');
    setNewSprintGoal('');
    setIsCreateSprintOpen(false);
  };

  // Filter issues
  const filteredIssues = issues.filter((i) => {
    if (searchBacklog.trim()) {
      const q = searchBacklog.toLowerCase();
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
    if (selectedEpicFilter) {
      if (i.epic_id !== selectedEpicFilter) return false;
    }
    return true;
  });

  const activeSprint = sprints.find((s) => s.status === 'active') || sprints[0];
  const activeSprintIssues = filteredIssues.filter((i) => i.sprint_id === activeSprint?.id);
  const backlogPoolIssues = filteredIssues.filter((i) => i.sprint_id !== activeSprint?.id);

  return (
    <main className="flex-1 min-w-0 p-gutter-xl flex flex-col gap-gutter-lg overflow-y-auto">
      {/* 1. Breadcrumb & Header */}
      <div className="flex flex-col gap-gutter-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-gutter-xs font-body text-body-sm text-light-on-surface-variant">
          <span className="hover:text-light-on-surface cursor-pointer">Projects</span>
          <span aria-hidden="true">/</span>
          <span className="hover:text-light-on-surface cursor-pointer">Platform Core</span>
          <span aria-hidden="true">/</span>
          <span className="text-light-on-surface-variant font-medium">Backlog</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-gutter-md pt-1">
          <h1 className="font-headline text-headline-lg text-light-on-surface font-bold">
            Backlog
          </h1>

          <div className="flex items-center gap-gutter-sm">
            <button
              onClick={() => setIsCreateSprintOpen(true)}
              type="button"
              className="inline-flex items-center justify-center h-8 px-gutter-lg rounded-sm bg-light-surface-container text-light-on-surface border border-light-outline-variant hover:bg-light-surface-container-high transition-colors font-label text-label-lg cursor-pointer"
            >
              Create sprint
            </button>

            <button
              type="button"
              aria-label="Backlog settings"
              className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">more_horiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Create Sprint Modal */}
      {isCreateSprintOpen && (
        <form
          onSubmit={handleCreateSprintSubmit}
          className="p-gutter-md rounded bg-light-surface-container-lowest border border-light-outline-variant shadow-md flex flex-col gap-gutter-md animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-title text-title-md text-light-on-surface font-bold">
              Create New Sprint
            </h3>
            <button
              type="button"
              onClick={() => setIsCreateSprintOpen(false)}
              className="text-body-sm text-light-on-surface-variant hover:text-light-on-surface"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md">
            <input
              type="text"
              placeholder="Sprint Name (e.g. PLAT Sprint 43)"
              value={newSprintName}
              onChange={(e) => setNewSprintName(e.target.value)}
              className="px-gutter-md py-1.5 rounded-sm bg-light-surface-container-low border border-light-outline-variant text-body-sm text-light-on-surface outline-none"
              autoFocus
              required
            />
            <input
              type="text"
              placeholder="Sprint Goal (optional)"
              value={newSprintGoal}
              onChange={(e) => setNewSprintGoal(e.target.value)}
              className="px-gutter-md py-1.5 rounded-sm bg-light-surface-container-low border border-light-outline-variant text-body-sm text-light-on-surface outline-none"
            />
          </div>
          <div className="flex justify-end gap-gutter-sm">
            <button
              type="button"
              onClick={() => setIsCreateSprintOpen(false)}
              className="px-gutter-md py-1 rounded-sm text-label-md text-light-on-surface-variant hover:bg-light-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-gutter-lg py-1 rounded-sm bg-light-primary text-light-on-primary font-label text-label-md hover:bg-light-primary-container"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-gutter-md">
        <div className="flex flex-wrap items-center gap-gutter-md">
          {/* Search */}
          <div className="relative flex items-center w-56 rounded-sm bg-light-surface-container-lowest border border-light-outline-variant focus-within:border-light-primary">
            <div className="pl-gutter-sm pr-gutter-xs text-light-on-surface-variant flex items-center">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">search</span>
            </div>
            <input
              type="search"
              placeholder="Search backlog"
              value={searchBacklog}
              onChange={(e) => setSearchBacklog(e.target.value)}
              className="w-full py-1.5 pr-gutter-sm bg-transparent border-0 font-body text-body-sm text-light-on-surface placeholder:text-light-on-surface-variant outline-none"
            />
          </div>

          {/* Assignee Avatar Stack */}
          <div className="flex items-center -space-x-1.5" role="group" aria-label="Filter by assignee">
            {[
              { id: 'Elena', name: 'Elena Rostova' },
              { id: 'Marcus', name: 'Marcus Vance' },
              { id: 'Priya', name: 'Priya Nair' },
              { id: 'Kenji', name: 'Kenji Sato' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedAssignee(selectedAssignee === m.id ? null : m.id)}
                className={`rounded-full transition-transform hover:z-10 hover:scale-105 cursor-pointer ${
                  selectedAssignee === m.id ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
                title={`Filter by ${m.name}`}
              >
                <Avatar name={m.name} size="sm" />
              </button>
            ))}
          </div>

          {/* Epics Dropdown Filter */}
          <div className="flex items-center gap-gutter-xs">
            {epics.map((ep) => (
              <button
                key={ep.id}
                type="button"
                onClick={() => setSelectedEpicFilter(selectedEpicFilter === ep.id ? null : ep.id)}
                className={`px-gutter-md py-1 rounded-sm text-label-sm font-semibold uppercase transition-colors cursor-pointer ${
                  selectedEpicFilter === ep.id
                    ? 'bg-light-primary text-light-on-primary'
                    : 'bg-light-surface-container text-light-on-surface-variant hover:bg-light-surface-container-high'
                }`}
              >
                {ep.name || ep.title}
              </button>
            ))}
          </div>
        </div>

        <span className="font-body text-body-sm text-light-on-surface-variant tabular-nums">
          {filteredIssues.length} issues across active sprint & backlog
        </span>
      </div>

      {/* 3. PLAT Sprint 42 (Active Sprint Section) */}
      <section aria-label="PLAT Sprint 42" className="rounded bg-light-surface-container-low border border-light-outline-variant overflow-hidden">
        <header className="px-gutter-lg py-gutter-md flex flex-wrap items-center justify-between gap-gutter-md bg-light-surface-container-low">
          <div className="flex flex-wrap items-center gap-gutter-md">
            <button
              type="button"
              onClick={() => toggleSection('sprint-42')}
              className="flex items-center gap-gutter-xs text-light-on-surface cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                {collapsedSections['sprint-42'] ? 'chevron_right' : 'expand_more'}
              </span>
              <span className="font-title text-title-md">
                {activeSprint?.name || 'PLAT Sprint 42: Auth & Telemetry'}
              </span>
            </button>
            <span className="px-gutter-sm py-0.5 rounded-sm bg-status-progress-bg text-status-progress font-label text-label-sm uppercase font-semibold">
              Active
            </span>
            <span className="font-body text-body-sm text-light-on-surface-variant tabular-nums">
              Nov 12 – Nov 26 · {activeSprintIssues.length} issues ({activeSprintIssues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0)} pts)
            </span>
          </div>

          <div className="flex items-center gap-gutter-sm">
            <span className="px-gutter-sm py-0.5 rounded-full bg-light-surface-container-high text-light-on-surface-variant font-mono text-mono-sm tabular-nums">
              To Do {activeSprintIssues.filter((i) => (i.status_id || '').includes('todo')).length}
            </span>
            <span className="px-gutter-sm py-0.5 rounded-full bg-status-progress-bg text-status-progress font-mono text-mono-sm tabular-nums">
              In Progress {activeSprintIssues.filter((i) => (i.status_id || '').includes('progress') || (i.status_id || '').includes('review')).length}
            </span>
            <span className="px-gutter-sm py-0.5 rounded-full bg-status-done-bg text-light-on-surface font-mono text-mono-sm tabular-nums">
              Done {activeSprintIssues.filter((i) => (i.status_id || '').includes('done')).length}
            </span>
          </div>
        </header>

        {!collapsedSections['sprint-42'] && (
          <div className="sprint-rows divide-y divide-light-outline-variant bg-light-surface-container-lowest border-t border-light-outline-variant">
            {activeSprintIssues.map((issue) => {
              const epicName = issue.epic_name || (issue.epic_id ? issue.epic_id.replace('epic-', '').replace('plat-', '').toUpperCase() : 'AUTH V3');
              const epicBadge = getEpicBadgeStyle(epicName);
              const assigneePhoto = getAssigneePhoto(issue.assignee);
              const issueType = (issue.issue_type || 'story').toLowerCase();

              return (
                <div
                  key={issue.id}
                  onClick={() => onSelectIssue && onSelectIssue(issue)}
                  className="px-gutter-lg py-gutter-sm flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-sm sm:gap-gutter-md hover:bg-light-surface-container-low/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-gutter-md min-w-0 flex-1">
                    {issueType === 'task' ? (
                      <span className="material-symbols-outlined text-[16px] text-issue-task shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_box
                      </span>
                    ) : issueType === 'bug' ? (
                      <span className="material-symbols-outlined text-[16px] text-issue-bug shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                        bug_report
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[16px] text-issue-story shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                        bookmark
                      </span>
                    )}
                    <span className="font-mono text-mono-sm text-light-on-surface-variant tabular-nums shrink-0 font-medium">
                      {issue.key}
                    </span>
                    <span className="font-body text-body-md text-light-on-surface truncate font-medium">
                      {issue.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-gutter-md shrink-0">
                    <span className={`px-gutter-sm py-0.5 rounded-sm font-label text-label-sm uppercase font-semibold ${epicBadge}`}>
                      {epicName}
                    </span>
                    <span className="px-gutter-sm py-0.5 rounded-sm bg-status-progress-bg text-status-progress font-label text-label-sm uppercase font-semibold">
                      In Progress
                    </span>
                    <span className="font-mono text-mono-sm px-gutter-sm py-0.5 rounded-full bg-light-surface-container text-light-on-surface-variant tabular-nums font-semibold">
                      {issue.story_points || 0}
                    </span>
                    <Avatar name={issue.assignee || 'Elena Rostova'} size="xs" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Backlog Pool Section */}
      <section aria-label="Backlog Pool" className="rounded bg-light-surface-container-low border border-light-outline-variant overflow-hidden">
        <header className="px-gutter-lg py-gutter-md flex items-center justify-between bg-light-surface-container-low">
          <div className="flex items-center gap-gutter-md">
            <button
              type="button"
              onClick={() => toggleSection('backlog-pool')}
              className="flex items-center gap-gutter-xs text-light-on-surface cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                {collapsedSections['backlog-pool'] ? 'chevron_right' : 'expand_more'}
              </span>
              <span className="font-title text-title-md">Backlog Pool</span>
            </button>
            <span className="font-body text-body-sm text-light-on-surface-variant tabular-nums">
              {backlogPoolIssues.length} issues ({backlogPoolIssues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0)} pts)
            </span>
          </div>

          <button
            onClick={() => onNewIssueWithSprint && onNewIssueWithSprint(null)}
            type="button"
            className="inline-flex items-center gap-gutter-xs text-label-sm text-light-primary hover:underline font-semibold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Create issue</span>
          </button>
        </header>

        {!collapsedSections['backlog-pool'] && (
          <div className="divide-y divide-light-outline-variant bg-light-surface-container-lowest border-t border-light-outline-variant">
            {backlogPoolIssues.length === 0 ? (
              <div className="p-gutter-xl text-center text-body-sm text-light-on-surface-variant">
                Your backlog is empty. Drag issues here or click Create issue to plan upcoming work.
              </div>
            ) : (
              backlogPoolIssues.map((issue) => {
                const assigneePhoto = getAssigneePhoto(issue.assignee);
                const issueType = (issue.issue_type || 'story').toLowerCase();

                return (
                  <div
                    key={issue.id}
                    onClick={() => onSelectIssue && onSelectIssue(issue)}
                    className="px-gutter-lg py-gutter-sm flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-sm sm:gap-gutter-md hover:bg-light-surface-container-low/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-gutter-md min-w-0 flex-1">
                      {issueType === 'task' ? (
                        <span className="material-symbols-outlined text-[16px] text-issue-task shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_box
                        </span>
                      ) : issueType === 'bug' ? (
                        <span className="material-symbols-outlined text-[16px] text-issue-bug shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                          bug_report
                        </span>
                      ) : (
                        <span className="material-symbols-outlined text-[16px] text-issue-story shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                          bookmark
                        </span>
                      )}
                      <span className="font-mono text-mono-sm text-light-on-surface-variant tabular-nums shrink-0 font-medium">
                        {issue.key}
                      </span>
                      <span className="font-body text-body-md text-light-on-surface truncate font-medium">
                        {issue.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-gutter-md shrink-0">
                      <span className="font-mono text-mono-sm px-gutter-sm py-0.5 rounded-full bg-light-surface-container text-light-on-surface-variant tabular-nums font-semibold">
                        {issue.story_points || 0}
                      </span>
                      <Avatar name={issue.assignee || 'Elena Rostova'} size="xs" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </section>
    </main>
  );
}
