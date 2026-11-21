'use client';

import { useMemo } from 'react';
import { 
  CheckCircle2, 
  Edit3, 
  PlusCircle, 
  AlertCircle, 
  ArrowUpRight, 
  Users, 
  TrendingUp,
  Clock,
  Layers,
  Flame
} from 'lucide-react';

export default function SummaryDashboardView({
  currentProject,
  activeSprint,
  issues = [],
  states = [],
  users = [],
  onSelectIssue,
  setActiveView,
}) {
  // 1. Calculate Status Metrics
  const statusMetrics = useMemo(() => {
    const total = issues.length || 1;
    let done = 0;
    let review = 0;
    let inProgress = 0;
    let todo = 0;

    issues.forEach((i) => {
      const stateObj = states.find((s) => s.id === i.status_id);
      const cat = (stateObj?.category || '').toLowerCase();
      const name = (stateObj?.name || '').toLowerCase();

      if (cat === 'done' || name.includes('done') || name.includes('closed')) {
        done++;
      } else if (cat === 'review' || name.includes('review') || name.includes('qa') || name.includes('verify')) {
        review++;
      } else if (cat === 'in_progress' || name.includes('progress') || name.includes('dev')) {
        inProgress++;
      } else {
        todo++;
      }
    });

    return {
      total: issues.length,
      done,
      review,
      inProgress,
      todo,
      pctDone: Math.round((done / total) * 100),
      pctReview: Math.round((review / total) * 100),
      pctInProgress: Math.round((inProgress / total) * 100),
      pctTodo: Math.round((todo / total) * 100),
    };
  }, [issues, states]);

  // 2. Calculate KPI Cards data
  const kpiData = useMemo(() => {
    const totalPoints = issues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0);
    const blockedCount = issues.filter((i) => i.is_blocked === 1).length;
    const highPriorityCount = issues.filter(
      (i) => (i.priority || '').toLowerCase() === 'high' || (i.priority || '').toLowerCase() === 'critical'
    ).length;

    return {
      completedCount: statusMetrics.done,
      inFlightCount: statusMetrics.inProgress + statusMetrics.review,
      totalIssues: issues.length,
      blockedOrUrgent: blockedCount > 0 ? blockedCount : highPriorityCount,
      totalPoints,
    };
  }, [issues, statusMetrics]);

  // 3. Workload by Assignee
  const workloadByAssignee = useMemo(() => {
    const map = {};
    issues.forEach((i) => {
      const assignee = i.assignee || 'Unassigned';
      if (!map[assignee]) {
        map[assignee] = { points: 0, count: 0 };
      }
      map[assignee].points += Number(i.story_points) || 1;
      map[assignee].count += 1;
    });

    const maxPoints = Math.max(...Object.values(map).map((v) => v.points), 1);

    return Object.entries(map).map(([name, data]) => ({
      name,
      points: data.points,
      count: data.count,
      pct: Math.min(100, Math.round((data.points / maxPoints) * 100)),
    })).sort((a, b) => b.points - a.points);
  }, [issues]);

  // 4. Priority breakdown
  const priorityBreakdown = useMemo(() => {
    let high = 0;
    let medium = 0;
    let low = 0;

    issues.forEach((i) => {
      const p = (i.priority || 'medium').toLowerCase();
      if (p === 'critical' || p === 'high') high++;
      else if (p === 'medium') medium++;
      else low++;
    });

    const total = issues.length || 1;
    return {
      high,
      medium,
      low,
      pctHigh: Math.round((high / total) * 100),
      pctMedium: Math.round((medium / total) * 100),
      pctLow: Math.round((low / total) * 100),
    };
  }, [issues]);

  // 5. Recent Activity / In-flight issues
  const recentIssues = useMemo(() => {
    return [...issues].slice(0, 5);
  }, [issues]);

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
          <span className="text-[var(--text-main)] font-semibold">Summary</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
              Project summary
            </h1>
            <p className="text-xs text-[var(--text-subtle)] mt-0.5">
              Live operational health, throughput, and sprint status
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded bg-[var(--bg-surface-container)] text-[var(--text-muted)] font-mono text-xs border border-[var(--border-subtle)]">
              {activeSprint?.name || `${currentProject?.key || 'PLAT'} Sprint 42`} · Live SQLite
            </span>
            <button
              onClick={() => setActiveView('board')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#004FB6] hover:bg-[#0C66E4] text-white text-xs font-label font-medium transition-colors shadow-sm"
            >
              <span>View Active Board</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 Elevated KPI Cards */}
      <section aria-label="Key project metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completed */}
        <div className="p-4 sm:p-5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col justify-between transition-colors shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-subtle)]">
            <span className="font-label text-xs uppercase tracking-wider font-semibold">Completed</span>
            <CheckCircle2 className="w-5 h-5 text-[#1F845A]" />
          </div>
          <div className="my-2">
            <span className="font-headline text-3xl font-bold tabular-nums text-[var(--text-main)]">
              {kpiData.completedCount}
            </span>
            <span className="text-xs text-[var(--text-subtle)] ml-2 font-mono">
              ({statusMetrics.pctDone}%)
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-subtle)]">
            {kpiData.totalPoints} total sprint points tracked
          </p>
        </div>

        {/* Updated / In Flight */}
        <div className="p-4 sm:p-5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col justify-between transition-colors shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-subtle)]">
            <span className="font-label text-xs uppercase tracking-wider font-semibold">In Progress & Review</span>
            <Edit3 className="w-5 h-5 text-[#0C66E4]" />
          </div>
          <div className="my-2">
            <span className="font-headline text-3xl font-bold tabular-nums text-[var(--text-main)]">
              {kpiData.inFlightCount}
            </span>
            <span className="text-xs text-[var(--text-subtle)] ml-2 font-mono">
              in flight
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-subtle)]">
            Active execution in current iteration
          </p>
        </div>

        {/* Total Issues */}
        <div className="p-4 sm:p-5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col justify-between transition-colors shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-subtle)]">
            <span className="font-label text-xs uppercase tracking-wider font-semibold">Total Scope</span>
            <PlusCircle className="w-5 h-5 text-[#8270DB]" />
          </div>
          <div className="my-2">
            <span className="font-headline text-3xl font-bold tabular-nums text-[var(--text-main)]">
              {kpiData.totalIssues}
            </span>
            <span className="text-xs text-[var(--text-subtle)] ml-2 font-mono">
              tickets
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-subtle)]">
            Across active board & backlog pool
          </p>
        </div>

        {/* Blockers or Urgent */}
        <div className="p-4 sm:p-5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col justify-between transition-colors shadow-sm">
          <div className="flex items-center justify-between text-[var(--text-subtle)]">
            <span className="font-label text-xs uppercase tracking-wider font-semibold">Blockers / Urgent</span>
            <AlertCircle className="w-5 h-5 text-[#A54800]" />
          </div>
          <div className="my-2">
            <span className="font-headline text-3xl font-bold tabular-nums text-[var(--text-main)]">
              {kpiData.blockedOrUrgent}
            </span>
            <span className="text-xs text-[var(--text-subtle)] ml-2 font-mono">
              flagged
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-subtle)]">
            Requiring immediate triage or escalation
          </p>
        </div>
      </section>

      {/* 3. Middle Section: Status Overview & Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Status Distribution */}
        <div className="p-5 sm:p-6 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col justify-between space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-title text-base font-bold text-[var(--text-main)]">
                Status overview
              </h2>
              <p className="text-xs text-[var(--text-subtle)]">
                Distribution across {kpiData.totalIssues} issues
              </p>
            </div>
            <span className="font-mono text-xs text-[var(--text-subtle)]">
              {statusMetrics.pctDone}% done
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-[var(--bg-surface-container)]">
            <div 
              style={{ width: `${statusMetrics.pctDone}%` }} 
              className="bg-[#1F845A] transition-all duration-300" 
              title={`Done: ${statusMetrics.done} (${statusMetrics.pctDone}%)`}
            />
            <div 
              style={{ width: `${statusMetrics.pctReview}%` }} 
              className="bg-[#6E5DC6] transition-all duration-300" 
              title={`In Review: ${statusMetrics.review} (${statusMetrics.pctReview}%)`}
            />
            <div 
              style={{ width: `${statusMetrics.pctInProgress}%` }} 
              className="bg-[#0C66E4] transition-all duration-300" 
              title={`In Progress: ${statusMetrics.inProgress} (${statusMetrics.pctInProgress}%)`}
            />
            <div 
              style={{ width: `${statusMetrics.pctTodo}%` }} 
              className="bg-[var(--border-subtle)] transition-all duration-300" 
              title={`To Do: ${statusMetrics.todo} (${statusMetrics.pctTodo}%)`}
            />
          </div>

          {/* Status Pills Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-surface-low)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--border-strong)] shrink-0" />
                <span className="text-xs font-body text-[var(--text-main)] font-medium">To Do</span>
              </div>
              <span className="font-mono text-xs font-bold text-[var(--text-muted)]">{statusMetrics.todo}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-surface-low)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0C66E4] shrink-0" />
                <span className="text-xs font-body text-[var(--text-main)] font-medium">In Progress</span>
              </div>
              <span className="font-mono text-xs font-bold text-[var(--text-muted)]">{statusMetrics.inProgress}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-surface-low)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6E5DC6] shrink-0" />
                <span className="text-xs font-body text-[var(--text-main)] font-medium">In Review</span>
              </div>
              <span className="font-mono text-xs font-bold text-[var(--text-muted)]">{statusMetrics.review}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-surface-low)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1F845A] shrink-0" />
                <span className="text-xs font-body text-[var(--text-main)] font-medium">Done</span>
              </div>
              <span className="font-mono text-xs font-bold text-[var(--text-muted)]">{statusMetrics.done}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-5 sm:p-6 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <h2 className="font-title text-base font-bold text-[var(--text-main)]">
              Recent activity
            </h2>
            <p className="text-xs text-[var(--text-subtle)]">
              Latest issue updates across {currentProject?.name || 'Platform Core'}
            </p>
          </div>

          <div className="divide-y divide-[var(--border-subtle)] flex-1 overflow-y-auto">
            {recentIssues.map((issue) => {
              const stateObj = states.find((s) => s.id === issue.status_id);
              const initials = (issue.assignee || 'BP')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={issue.id}
                  onClick={() => onSelectIssue && onSelectIssue(issue)}
                  className="py-2.5 flex items-center justify-between gap-3 hover:bg-[var(--bg-surface-low)] px-2 rounded cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-[#0C66E4] text-white flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[var(--text-subtle)]">
                          {issue.key}
                        </span>
                        <span className="text-xs text-[var(--text-main)] truncate font-medium">
                          {issue.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--text-subtle)]">
                        Assigned to {issue.assignee || 'Unassigned'}
                      </span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-label font-medium bg-[var(--bg-surface-container)] text-[var(--text-muted)] shrink-0 border border-[var(--border-subtle)]">
                    {stateObj?.name || 'In Progress'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Bottom Section: Team Workload & Priority Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Team Workload */}
        <div className="p-5 sm:p-6 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
          <div>
            <h2 className="font-title text-base font-bold text-[var(--text-main)]">
              Team workload
            </h2>
            <p className="text-xs text-[var(--text-subtle)]">
              Assigned story points in active iteration
            </p>
          </div>

          <div className="space-y-3">
            {workloadByAssignee.slice(0, 4).map((member) => (
              <div key={member.name} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[var(--bg-surface-container)] border border-[var(--border-subtle)] text-[var(--text-main)] flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                  {member.name.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-body text-[var(--text-main)] w-28 shrink-0 truncate font-medium">
                  {member.name}
                </span>
                <div className="flex-1 h-2 rounded-full bg-[var(--bg-surface-container)] overflow-hidden">
                  <div
                    style={{ width: `${member.pct}%` }}
                    className="h-full bg-[#0C66E4] rounded-full transition-all duration-300"
                  />
                </div>
                <span className="font-mono text-xs text-[var(--text-subtle)] tabular-nums w-12 text-right">
                  {member.points} pts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="p-5 sm:p-6 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
          <div>
            <h2 className="font-title text-base font-bold text-[var(--text-main)]">
              Priority breakdown
            </h2>
            <p className="text-xs text-[var(--text-subtle)]">
              Open issues grouped by delivery urgency
            </p>
          </div>

          <div className="space-y-3">
            {/* High */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 w-24 shrink-0 text-xs text-[var(--text-main)] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#E34935]" />
                <span>High / Crit</span>
              </div>
              <div className="flex-1 h-2 rounded-full bg-[var(--bg-surface-container)] overflow-hidden">
                <div
                  style={{ width: `${priorityBreakdown.pctHigh}%` }}
                  className="h-full bg-[#E34935] rounded-full transition-all duration-300"
                />
              </div>
              <span className="font-mono text-xs text-[var(--text-subtle)] tabular-nums w-8 text-right">
                {priorityBreakdown.high}
              </span>
            </div>

            {/* Medium */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 w-24 shrink-0 text-xs text-[var(--text-main)] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#A54800]" />
                <span>Medium</span>
              </div>
              <div className="flex-1 h-2 rounded-full bg-[var(--bg-surface-container)] overflow-hidden">
                <div
                  style={{ width: `${priorityBreakdown.pctMedium}%` }}
                  className="h-full bg-[#A54800] rounded-full transition-all duration-300"
                />
              </div>
              <span className="font-mono text-xs text-[var(--text-subtle)] tabular-nums w-8 text-right">
                {priorityBreakdown.medium}
              </span>
            </div>

            {/* Low */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 w-24 shrink-0 text-xs text-[var(--text-main)] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#1F845A]" />
                <span>Low</span>
              </div>
              <div className="flex-1 h-2 rounded-full bg-[var(--bg-surface-container)] overflow-hidden">
                <div
                  style={{ width: `${priorityBreakdown.pctLow}%` }}
                  className="h-full bg-[#1F845A] rounded-full transition-all duration-300"
                />
              </div>
              <span className="font-mono text-xs text-[var(--text-subtle)] tabular-nums w-8 text-right">
                {priorityBreakdown.low}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
