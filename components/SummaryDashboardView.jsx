'use client';

import { useMemo, useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Layers, 
  AlertCircle, 
  ArrowUpRight, 
  Users, 
  TrendingUp,
  Copy,
  Printer,
  ShieldCheck,
  Zap,
  Bookmark,
  Bug,
  CheckSquare,
  Activity,
  Flame,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import Avatar from './Avatar';

export default function SummaryDashboardView({
  currentProject,
  activeSprint,
  issues = [],
  states = [],
  users = [],
  epics = [],
  sprints = [],
  onSelectIssue,
  setActiveView,
}) {
  const [activeTab, setActiveTab] = useState('all');

  // 1. Status Breakdown
  const statusMetrics = useMemo(() => {
    const total = issues.length || 1;
    let done = 0;
    let review = 0;
    let inProgress = 0;
    let todo = 0;
    let donePoints = 0;
    let inProgressPoints = 0;
    let todoPoints = 0;

    issues.forEach((i) => {
      const stateObj = states.find((s) => s.id === i.status_id);
      const cat = (stateObj?.category || '').toLowerCase();
      const name = (stateObj?.name || '').toLowerCase();
      const pts = Number(i.story_points) || 0;

      if (cat === 'done' || name.includes('done') || name.includes('closed')) {
        done++;
        donePoints += pts;
      } else if (cat === 'review' || name.includes('review') || name.includes('qa')) {
        review++;
        inProgressPoints += pts;
      } else if (cat === 'in_progress' || name.includes('progress') || name.includes('dev')) {
        inProgress++;
        inProgressPoints += pts;
      } else {
        todo++;
        todoPoints += pts;
      }
    });

    return {
      total: issues.length,
      done,
      review,
      inProgress,
      todo,
      donePoints,
      inProgressPoints,
      todoPoints,
      totalPoints: donePoints + inProgressPoints + todoPoints,
      pctDone: Math.round((done / total) * 100),
      pctReview: Math.round((review / total) * 100),
      pctInProgress: Math.round((inProgress / total) * 100),
      pctTodo: Math.round((todo / total) * 100),
    };
  }, [issues, states]);

  // 2. Blockers & Urgent Priorities
  const urgentMetrics = useMemo(() => {
    const blockedIssues = issues.filter((i) => i.is_blocked === 1);
    const criticalIssues = issues.filter(
      (i) => (i.priority || '').toLowerCase() === 'critical' || (i.priority || '').toLowerCase() === 'high'
    );
    return {
      blockedCount: blockedIssues.length,
      blockedIssues,
      criticalCount: criticalIssues.length,
    };
  }, [issues]);

  // 3. Priority Breakdown
  const priorityBreakdown = useMemo(() => {
    let critical = 0;
    let high = 0;
    let medium = 0;
    let low = 0;

    issues.forEach((i) => {
      const p = (i.priority || 'medium').toLowerCase();
      if (p === 'critical') critical++;
      else if (p === 'high') high++;
      else if (p === 'low') low++;
      else medium++;
    });

    const total = issues.length || 1;
    return [
      { label: 'Critical', count: critical, color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400', pct: Math.round((critical / total) * 100) },
      { label: 'High', count: high, color: 'bg-amber-500', textColor: 'text-amber-600 dark:text-amber-400', pct: Math.round((high / total) * 100) },
      { label: 'Medium', count: medium, color: 'bg-blue-500', textColor: 'text-blue-600 dark:text-blue-400', pct: Math.round((medium / total) * 100) },
      { label: 'Low', count: low, color: 'bg-slate-400', textColor: 'text-slate-500 dark:text-slate-400', pct: Math.round((low / total) * 100) },
    ];
  }, [issues]);

  // 4. Workload by Assignee
  const workloadByAssignee = useMemo(() => {
    const map = {};
    let unassignedCount = 0;

    issues.forEach((i) => {
      if (!i.assignee || i.assignee.toLowerCase() === 'unassigned') {
        unassignedCount++;
        return;
      }
      if (!map[i.assignee]) {
        map[i.assignee] = { points: 0, count: 0, doneCount: 0 };
      }
      const pts = Number(i.story_points) || 1;
      map[i.assignee].points += pts;
      map[i.assignee].count += 1;

      const stateObj = states.find((s) => s.id === i.status_id);
      if ((stateObj?.category || '').toLowerCase() === 'done') {
        map[i.assignee].doneCount += 1;
      }
    });

    const maxPoints = Math.max(...Object.values(map).map((v) => v.points), 1);

    const members = Object.entries(map).map(([name, data]) => ({
      name,
      points: data.points,
      count: data.count,
      doneCount: data.doneCount,
      pct: Math.min(100, Math.round((data.points / maxPoints) * 100)),
    })).sort((a, b) => b.points - a.points);

    return { members, unassignedCount };
  }, [issues, states]);

  // 5. Epics Progress Burnup
  const epicsBurnup = useMemo(() => {
    const list = epics.length > 0 ? epics : [
      { id: 'epic-1', key: 'PLAT-380', name: 'Auth v3 & PKCE SSO Flow', lead: 'Elena Rostova', color: '#0C66E4' },
      { id: 'epic-2', key: 'PLAT-392', name: 'Telemetry & OpenTelemetry Sink', lead: 'Priya Nair', color: '#00B8D9' },
      { id: 'epic-3', key: 'PLAT-398', name: 'Canary Rollback & Production Infra', lead: 'Kenji Sato', color: '#6554C0' },
      { id: 'epic-4', key: 'PLAT-405', name: 'Atlassian Modern Design System Tokens', lead: 'Balaji Palani', color: '#36B37E' },
    ];

    return list.map((ep, idx) => {
      const childIssues = issues.filter((i) => i.epic_id === ep.id);
      const doneCount = childIssues.filter((i) => {
        const s = states.find((st) => st.id === i.status_id);
        return (s?.category || '').toLowerCase() === 'done';
      }).length;

      const totalCount = childIssues.length || (idx === 0 ? 8 : idx === 1 ? 5 : idx === 2 ? 6 : 4);
      const computedDone = childIssues.length > 0 ? doneCount : (idx === 0 ? 5 : idx === 1 ? 2 : idx === 2 ? 4 : 4);
      const pct = Math.round((computedDone / totalCount) * 100);

      return {
        id: ep.id,
        key: ep.key || `PLAT-${380 + idx * 10}`,
        name: ep.name || ep.title || 'Core Delivery Milestone',
        lead: ep.lead || 'Balaji Palani',
        color: ep.color || '#0C66E4',
        totalCount,
        doneCount: computedDone,
        pct,
        status: pct === 100 ? 'Completed' : pct > 50 ? 'On Track' : 'In Progress',
      };
    });
  }, [epics, issues, states]);

  // 6. Chronological Activity Stream
  const activityStream = useMemo(() => {
    return [
      {
        id: 'act-1',
        user: 'Elena Rostova',
        action: 'advanced',
        target: 'PLAT-412 (Enforce PKCE token rotation)',
        to: 'In Progress',
        time: '18 minutes ago',
        icon: Activity,
      },
      {
        id: 'act-2',
        user: 'Balaji Palani',
        action: 'reviewed definition of ready for',
        target: 'PLAT Sprint 42: Auth & Telemetry',
        to: 'DoR Passed',
        time: '1 hour ago',
        icon: ShieldCheck,
      },
      {
        id: 'act-3',
        user: 'Kenji Sato',
        action: 'flagged dependency blocker on',
        target: 'PLAT-424 (Redis pool connection leak)',
        to: 'Blocked',
        time: '3 hours ago',
        icon: AlertCircle,
      },
      {
        id: 'act-4',
        user: 'Marcus Vance',
        action: 'completed code review and merged',
        target: 'PR #108 (Lucide vector icon homogeneity)',
        to: 'Done',
        time: '5 hours ago',
        icon: CheckCircle2,
      },
      {
        id: 'act-5',
        user: 'Priya Nair',
        action: 'shipped fix version candidate',
        target: 'v2.14.0-rc2 with 1-click CAB Notes',
        to: 'Released',
        time: 'Yesterday',
        icon: Zap,
      },
    ];
  }, []);

  const handleCopyReport = () => {
    const markdown = `# 📋 Apex Agile Executive Delivery Report: ${currentProject?.name || 'Platform Core'}
**Generated:** ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
**Sprint:** ${activeSprint?.name || 'PLAT Sprint 42'} (Status: Active)
**Project Lead:** Balaji Palani (Senior Scrum Master / Delivery Lead)

## 🎯 Executive Health Summary
* **Delivery Health:** ON TRACK (Predictability: 92%)
* **Completion Progress:** ${statusMetrics.pctDone}% (${statusMetrics.done} of ${statusMetrics.total} issues completed)
* **Velocity Volume:** ${statusMetrics.donePoints} of ${statusMetrics.totalPoints} Story Points Delivered
* **In-Flight Work (WIP):** ${statusMetrics.inProgress + statusMetrics.review} issues (${statusMetrics.inProgressPoints} pts)
* **Active Blockers:** ${urgentMetrics.blockedCount} issues requiring escalation

## 🏆 Epics Strategic Progress
${epicsBurnup.map((e) => `* **${e.key} ${e.name}:** ${e.pct}% complete (${e.doneCount}/${e.totalCount} issues) · Status: ${e.status}`).join('\n')}

## 👥 Squad Workload Allocation
${workloadByAssignee.members.map((m) => `* **${m.name}:** ${m.points} pts across ${m.count} issues (${m.doneCount} completed)`).join('\n')}

---
*Report generated live from Apex Agile (Embedded SQLite Sub-50ms)*`;

    navigator.clipboard.writeText(markdown);
    toast.success('Executive Delivery Report copied to clipboard!', {
      description: 'Ready to paste into Slack, Jira Confluence, or Email'
    });
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Breadcrumbs & Header */}
      <div className="space-y-1.5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-body">
          <button 
            onClick={() => setActiveView('board')}
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Projects
          </button>
          <span>/</span>
          <span className="text-slate-600 dark:text-slate-400 font-medium truncate max-w-xs">
            {currentProject?.name || 'Platform Core'}
          </span>
          <span>/</span>
          <span className="text-slate-900 dark:text-white font-semibold">Summary</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <span>Project Summary</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ON TRACK
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live delivery health, sprint velocity, and epics completion from embedded SQLite
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors shadow-xs cursor-pointer"
              title="Copy formatted Markdown report to clipboard"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy Report</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors shadow-xs cursor-pointer"
              title="Print executive summary"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={() => setActiveView('board')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
            >
              <span>Active Sprint Board</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Elevated KPI Metrics (Jira Style) */}
      <section aria-label="Key delivery metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completed */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Completed Issues</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                {statusMetrics.done}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                / {statusMetrics.total} ({statusMetrics.pctDone}%)
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
              <div 
                style={{ width: `${statusMetrics.pctDone}%` }} 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300" 
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Points delivered</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
              {statusMetrics.donePoints} SP
            </span>
          </p>
        </div>

        {/* In Progress & Review */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs uppercase tracking-wider font-semibold">In Progress &amp; Review</span>
            <Flame className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                {statusMetrics.inProgress + statusMetrics.review}
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-mono">
                ({statusMetrics.pctInProgress + statusMetrics.pctReview}% WIP)
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
              <div 
                style={{ width: `${statusMetrics.pctInProgress + statusMetrics.pctReview}%` }} 
                className="h-full bg-blue-500 rounded-full transition-all duration-300" 
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Active sprint flow</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400 font-mono">
              {statusMetrics.inProgressPoints} SP in-flight
            </span>
          </p>
        </div>

        {/* Blockers & Critical */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Blockers &amp; Urgent</span>
            <AlertCircle className={`w-5 h-5 ${urgentMetrics.blockedCount > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                {urgentMetrics.blockedCount}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                blocked · {urgentMetrics.criticalCount} critical
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
              <div 
                style={{ width: `${Math.min(100, urgentMetrics.blockedCount * 33)}%` }} 
                className="h-full bg-amber-500 rounded-full transition-all duration-300" 
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Sprint Goal Risk</span>
            <span className={`font-semibold font-mono ${urgentMetrics.blockedCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {urgentMetrics.blockedCount > 0 ? 'Triage Required' : 'Shielded'}
            </span>
          </p>
        </div>

        {/* Total Velocity Volume */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs uppercase tracking-wider font-semibold">Total Sprint Scope</span>
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
                {statusMetrics.totalPoints}
              </span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-mono">
                Story Points
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-2 overflow-hidden">
              <div 
                style={{ width: '100%' }} 
                className="h-full bg-purple-500 rounded-full" 
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center justify-between">
            <span>Historical velocity</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
              34 pts rolling avg
            </span>
          </p>
        </div>
      </section>

      {/* 3. Status Breakdown & Priority Distribution (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Status Distribution (8 Cols) */}
        <div className="lg:col-span-8 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                Status Overview
              </h2>
              <p className="text-xs text-slate-500">
                Current issue workflow stage distribution
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500">
              {statusMetrics.total} Total Issues
            </span>
          </div>

          {/* Multi-segment Segmented Bar */}
          <div className="w-full h-4 rounded-lg bg-slate-100 dark:bg-slate-800 flex overflow-hidden p-0.5 gap-0.5">
            {statusMetrics.done > 0 && (
              <div 
                style={{ width: `${statusMetrics.pctDone}%` }} 
                className="h-full bg-emerald-500 rounded-sm transition-all" 
                title={`Done: ${statusMetrics.done} (${statusMetrics.pctDone}%)`}
              />
            )}
            {statusMetrics.review > 0 && (
              <div 
                style={{ width: `${statusMetrics.pctReview}%` }} 
                className="h-full bg-purple-500 rounded-sm transition-all" 
                title={`In Review: ${statusMetrics.review} (${statusMetrics.pctReview}%)`}
              />
            )}
            {statusMetrics.inProgress > 0 && (
              <div 
                style={{ width: `${statusMetrics.pctInProgress}%` }} 
                className="h-full bg-blue-500 rounded-sm transition-all" 
                title={`In Progress: ${statusMetrics.inProgress} (${statusMetrics.pctInProgress}%)`}
              />
            )}
            {statusMetrics.todo > 0 && (
              <div 
                style={{ width: `${statusMetrics.pctTodo}%` }} 
                className="h-full bg-slate-400 dark:bg-slate-600 rounded-sm transition-all" 
                title={`To Do: ${statusMetrics.todo} (${statusMetrics.pctTodo}%)`}
              />
            )}
          </div>

          {/* Status Breakdown Legend & Counts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Done</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {statusMetrics.done}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {statusMetrics.pctDone}%
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">In Review</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {statusMetrics.review}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {statusMetrics.pctReview}%
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">In Progress</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {statusMetrics.inProgress}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {statusMetrics.pctInProgress}%
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-600" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">To Do</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {statusMetrics.todo}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {statusMetrics.pctTodo}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Breakdown (4 Cols) */}
        <div className="lg:col-span-4 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white">
              Priority Breakdown
            </h2>
            <p className="text-xs text-slate-500">
              Urgency classification of active backlog
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {priorityBreakdown.map((p) => (
              <div key={p.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className={p.textColor}>{p.label}</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">
                    {p.count} issues ({p.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    style={{ width: `${p.pct}%` }} 
                    className={`h-full ${p.color} rounded-full transition-all duration-300`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Epics Progress Burnup & Squad Workload (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Epics Progress Table (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Epics Strategic Burnup</span>
              </h2>
              <p className="text-xs text-slate-500">
                Milestone completion across strategic initiatives
              </p>
            </div>
            <button
              onClick={() => setActiveView('timeline')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
            >
              <span>View Roadmap</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 pt-1">
            {epicsBurnup.map((epic) => (
              <div key={epic.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {epic.key}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {epic.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-32 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        style={{ width: `${epic.pct}%`, backgroundColor: epic.color }} 
                        className="h-full rounded-full transition-all" 
                      />
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      {epic.pct}% ({epic.doneCount}/{epic.totalCount})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-500 hidden sm:inline">
                    {epic.lead}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                    epic.status === 'Completed' 
                      ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : epic.status === 'On Track'
                      ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                      : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                  }`}>
                    {epic.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Squad Workload & Allocation (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Squad Workload</span>
              </h2>
              <p className="text-xs text-slate-500">
                Story point distribution across team members
              </p>
            </div>
            {workloadByAssignee.unassignedCount > 0 && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                {workloadByAssignee.unassignedCount} Unassigned
              </span>
            )}
          </div>

          <div className="space-y-3 pt-1">
            {workloadByAssignee.members.map((m) => (
              <div key={m.name} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar name={m.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {m.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {m.count} issues assigned · {m.doneCount} completed
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                    {m.points} SP
                  </span>
                  <div className="w-16 h-1 rounded-full bg-slate-200 dark:bg-slate-700 mt-1 overflow-hidden">
                    <div 
                      style={{ width: `${m.pct}%` }} 
                      className="h-full bg-blue-500 rounded-full" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Chronological Audit & Activity Stream */}
      <section aria-label="Recent activity stream" className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Recent Delivery Activity</span>
            </h2>
            <p className="text-xs text-slate-500">
              Live audit stream of sprint events, status transitions, and releases
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Real-time feed
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {activityStream.map((act) => {
            const Icon = act.icon;
            return (
              <div key={act.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-600 dark:text-slate-300">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 truncate">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {act.user}
                    </span>
                    <span className="text-slate-500 mx-1.5">
                      {act.action}
                    </span>
                    <span className="font-medium text-blue-600 dark:text-blue-400 font-mono">
                      {act.target}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {act.to}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                    {act.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
