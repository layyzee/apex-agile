'use client';

import { useMemo } from 'react';

export default function AnalyticsView({
  activeSprint,
  sprintStats,
  issues = [],
  states = [],
  currentProject,
  setActiveView,
}) {
  // Calculate dynamic metrics
  const totalPoints = useMemo(() => {
    return issues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0) || 34;
  }, [issues]);

  const completedPoints = useMemo(() => {
    return issues
      .filter((i) => {
        const stateObj = states.find((s) => s.id === i.status_id);
        const name = (stateObj?.name || '').toLowerCase();
        return name.includes('done') || stateObj?.category === 'done';
      })
      .reduce((sum, i) => sum + (Number(i.story_points) || 0), 0) || 20;
  }, [issues, states]);

  const inProgressPoints = useMemo(() => {
    return issues
      .filter((i) => {
        const stateObj = states.find((s) => s.id === i.status_id);
        const name = (stateObj?.name || '').toLowerCase();
        return name.includes('progress') || name.includes('review');
      })
      .reduce((sum, i) => sum + (Number(i.story_points) || 0), 0) || 14;
  }, [issues, states]);

  const remainingPoints = totalPoints - completedPoints;

  return (
    <main className="flex-1 min-w-0 p-gutter-xl flex flex-col gap-gutter-xl overflow-y-auto">
      {/* 1. Breadcrumb & Header */}
      <div className="flex flex-col gap-gutter-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-gutter-xs font-body text-body-sm text-light-on-surface-variant">
          <span className="hover:text-light-on-surface cursor-pointer">Projects</span>
          <span aria-hidden="true">/</span>
          <span className="hover:text-light-on-surface cursor-pointer">{currentProject?.name || 'Platform Core'}</span>
          <span aria-hidden="true">/</span>
          <span className="text-light-on-surface-variant font-medium">Reports</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-gutter-md pt-1">
          <h1 className="font-headline text-headline-lg text-light-on-surface font-bold">
            Reports &amp; velocity
          </h1>
          <span className="px-gutter-md py-1 rounded-sm bg-light-surface-container text-light-on-surface-variant font-label text-label-md">
            {activeSprint?.name || 'PLAT Sprint 42'} · Nov 12 – Nov 26
          </span>
        </div>
      </div>

      {/* 2. Charts Grid: Burndown & Velocity */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-gutter-lg items-stretch">
        {/* Sprint Burndown Chart */}
        <article className="p-gutter-xl rounded bg-light-surface-container-lowest border border-light-outline-variant shadow-sm flex flex-col gap-gutter-lg">
          <header className="flex flex-wrap items-center justify-between gap-gutter-sm">
            <div>
              <h2 className="font-title text-title-lg text-light-on-surface font-bold">
                Sprint burndown
              </h2>
              <p className="font-body text-body-sm text-light-on-surface-variant">
                Remaining story points vs. ideal guideline
              </p>
            </div>
            <div className="flex items-center gap-gutter-md">
              <span className="inline-flex items-center gap-gutter-xs font-label text-label-sm text-light-on-surface-variant">
                <span className="w-3 h-0.5 bg-light-outline inline-block" /> Guideline
              </span>
              <span className="inline-flex items-center gap-gutter-xs font-label text-label-sm text-light-on-surface-variant">
                <span className="w-3 h-0.5 bg-issue-bug inline-block" /> Remaining
              </span>
            </div>
          </header>

          <div className="w-full overflow-hidden">
            <svg viewBox="0 0 480 220" className="w-full h-52" role="img" aria-label={`Sprint burndown line chart showing ${totalPoints} initial down to ${remainingPoints} remaining`}>
              {/* Horizontal Gridlines */}
              <line x1="40" y1="20" x2="460" y2="20" stroke="var(--border-subtle)" strokeWidth="1" />
              <line x1="40" y1="65" x2="460" y2="65" stroke="var(--border-subtle)" strokeWidth="1" />
              <line x1="40" y1="110" x2="460" y2="110" stroke="var(--border-subtle)" strokeWidth="1" />
              <line x1="40" y1="155" x2="460" y2="155" stroke="var(--border-subtle)" strokeWidth="1" />
              <line x1="40" y1="195" x2="460" y2="195" stroke="var(--border-strong)" strokeWidth="1" />

              {/* Y-Axis Labels */}
              <text x="10" y="24" fill="var(--text-muted)" fontSize="11" fontFamily="Space Mono, monospace">{totalPoints}</text>
              <text x="10" y="69" fill="var(--text-muted)" fontSize="11" fontFamily="Space Mono, monospace">25</text>
              <text x="10" y="114" fill="var(--text-muted)" fontSize="11" fontFamily="Space Mono, monospace">17</text>
              <text x="10" y="159" fill="var(--text-muted)" fontSize="11" fontFamily="Space Mono, monospace">8</text>
              <text x="16" y="199" fill="var(--text-muted)" fontSize="11" fontFamily="Space Mono, monospace">0</text>

              {/* Ideal Guideline */}
              <line x1="40" y1="20" x2="460" y2="195" stroke="var(--text-subtle)" strokeWidth="2" strokeDasharray="5 5" />

              {/* Actual Remaining Line */}
              <polyline fill="none" stroke="#E34935" strokeWidth="2.5" points="40,20 100,20 160,48 220,76 280,76 340,122" />
              <circle cx="340" cy="122" r="4" fill="#E34935" />

              {/* X-Axis Labels */}
              <text x="36" y="214" fill="var(--text-muted)" fontSize="11" fontFamily="Geist, sans-serif">Nov 12</text>
              <text x="180" y="214" fill="var(--text-muted)" fontSize="11" fontFamily="Geist, sans-serif">Nov 18</text>
              <text x="320" y="214" fill="#0C66E4" fontSize="11" fontFamily="Geist, sans-serif" fontWeight="bold">Today</text>
              <text x="424" y="214" fill="var(--text-muted)" fontSize="11" fontFamily="Geist, sans-serif">Nov 26</text>
            </svg>
          </div>
        </article>

        {/* Team Velocity Chart */}
        <article className="p-gutter-xl rounded bg-light-surface-container-lowest border border-light-outline-variant shadow-sm flex flex-col gap-gutter-lg">
          <header className="flex flex-wrap items-center justify-between gap-gutter-sm">
            <div>
              <h2 className="font-title text-title-lg text-light-on-surface font-bold">
                Velocity chart
              </h2>
              <p className="font-body text-body-sm text-light-on-surface-variant">
                Average 32 pts completed per sprint
              </p>
            </div>
            <div className="flex items-center gap-gutter-md">
              <span className="inline-flex items-center gap-gutter-xs font-label text-label-sm text-light-on-surface-variant">
                <span className="w-2.5 h-2.5 rounded-sm bg-light-outline-variant inline-block" /> Committed
              </span>
              <span className="inline-flex items-center gap-gutter-xs font-label text-label-sm text-light-on-surface-variant">
                <span className="w-2.5 h-2.5 rounded-sm bg-status-done inline-block" /> Completed
              </span>
            </div>
          </header>

          <div className="grid grid-cols-5 gap-gutter-md items-end h-52 pt-gutter-lg border-b border-light-outline-variant px-gutter-sm">
            {/* Sprint 38 */}
            <div className="flex flex-col items-center gap-gutter-xs h-full justify-end">
              <div className="flex items-end gap-1 h-40 w-full justify-center">
                <div className="w-4 h-[72%] rounded-t-sm bg-light-outline-variant" title="Committed: 32" />
                <div className="w-4 h-[68%] rounded-t-sm bg-status-done" title="Completed: 30" />
              </div>
              <span className="font-mono text-mono-sm text-light-on-surface-variant pb-gutter-xs">S38</span>
            </div>
            {/* Sprint 39 */}
            <div className="flex flex-col items-center gap-gutter-xs h-full justify-end">
              <div className="flex items-end gap-1 h-40 w-full justify-center">
                <div className="w-4 h-[80%] rounded-t-sm bg-light-outline-variant" title="Committed: 36" />
                <div className="w-4 h-[75%] rounded-t-sm bg-status-done" title="Completed: 34" />
              </div>
              <span className="font-mono text-mono-sm text-light-on-surface-variant pb-gutter-xs">S39</span>
            </div>
            {/* Sprint 40 */}
            <div className="flex flex-col items-center gap-gutter-xs h-full justify-end">
              <div className="flex items-end gap-1 h-40 w-full justify-center">
                <div className="w-4 h-[75%] rounded-t-sm bg-light-outline-variant" title="Committed: 34" />
                <div className="w-4 h-[75%] rounded-t-sm bg-status-done" title="Completed: 34" />
              </div>
              <span className="font-mono text-mono-sm text-light-on-surface-variant pb-gutter-xs">S40</span>
            </div>
            {/* Sprint 41 */}
            <div className="flex flex-col items-center gap-gutter-xs h-full justify-end">
              <div className="flex items-end gap-1 h-40 w-full justify-center">
                <div className="w-4 h-[85%] rounded-t-sm bg-light-outline-variant" title="Committed: 38" />
                <div className="w-4 h-[78%] rounded-t-sm bg-status-done" title="Completed: 35" />
              </div>
              <span className="font-mono text-mono-sm text-light-on-surface-variant pb-gutter-xs">S41</span>
            </div>
            {/* Sprint 42 */}
            <div className="flex flex-col items-center gap-gutter-xs h-full justify-end">
              <div className="flex items-end gap-1 h-40 w-full justify-center">
                <div className="w-4 h-[76%] rounded-t-sm bg-light-outline-variant" title="Committed: 34" />
                <div className="w-4 h-[45%] rounded-t-sm bg-status-progress" title="In progress: 20" />
              </div>
              <span className="font-mono text-mono-sm text-light-primary pb-gutter-xs font-bold">S42</span>
            </div>
          </div>
        </article>
      </section>

      {/* 3. Sprint Breakdown Summary */}
      <section className="rounded bg-light-surface-container-lowest border border-light-outline-variant p-gutter-xl flex flex-col gap-gutter-md shadow-sm">
        <h2 className="font-title text-title-lg text-light-on-surface font-bold">
          Sprint 42 delivery breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-md">
          <div className="p-gutter-md rounded-sm bg-light-surface-container-low border border-light-outline-variant">
            <p className="font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Committed</p>
            <p className="font-headline text-headline-md text-light-on-surface tabular-nums mt-1 font-bold">{totalPoints} pts</p>
          </div>
          <div className="p-gutter-md rounded-sm bg-light-surface-container-low border border-light-outline-variant">
            <p className="font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Completed</p>
            <p className="font-headline text-headline-md text-light-on-surface tabular-nums mt-1 font-bold">{completedPoints} pts</p>
          </div>
          <div className="p-gutter-md rounded-sm bg-light-surface-container-low border border-light-outline-variant">
            <p className="font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">In Progress &amp; Review</p>
            <p className="font-headline text-headline-md text-light-on-surface tabular-nums mt-1 font-bold">{inProgressPoints} pts</p>
          </div>
        </div>
      </section>
    </main>
  );
}
