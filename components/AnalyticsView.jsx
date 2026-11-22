'use client';

import { useState, useMemo } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  Zap,
  BarChart3,
  Layers,
  ArrowUpRight,
  Printer,
  Copy,
  Check,
  Calendar,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function AnalyticsView({
  activeSprint,
  sprintStats,
  issues = [],
  states = [],
  sprints = [],
  currentProject,
  setActiveView,
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'cfd' | 'velocity' | 'burndown'
  const [selectedDay, setSelectedDay] = useState(6); // Scrubber day 1..10
  const [copiedMemo, setCopiedMemo] = useState(false);

  // Dynamic calculations from live issue set
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

  const inReviewPoints = useMemo(() => {
    return issues
      .filter((i) => {
        const stateObj = states.find((s) => s.id === i.status_id);
        const name = (stateObj?.name || '').toLowerCase();
        return name.includes('review') || name.includes('qa');
      })
      .reduce((sum, i) => sum + (Number(i.story_points) || 0), 0) || 8;
  }, [issues, states]);

  const inProgressPoints = useMemo(() => {
    return issues
      .filter((i) => {
        const stateObj = states.find((s) => s.id === i.status_id);
        const name = (stateObj?.name || '').toLowerCase();
        return name.includes('progress') || name.includes('dev');
      })
      .reduce((sum, i) => sum + (Number(i.story_points) || 0), 0) || 6;
  }, [issues, states]);

  const remainingPoints = totalPoints - completedPoints;

  // 10-Day CFD Progression Data (Day 1 through Day 10)
  // Each day sums to 10 tickets
  const cfdData = [
    { day: 1, label: 'Day 1 (Mon)', todo: 8, progress: 2, review: 0, done: 0, total: 10 },
    { day: 2, label: 'Day 2 (Tue)', todo: 6, progress: 3, review: 1, done: 0, total: 10 },
    { day: 3, label: 'Day 3 (Wed)', todo: 5, progress: 3, review: 1, done: 1, total: 10 },
    { day: 4, label: 'Day 4 (Thu)', todo: 4, progress: 3, review: 2, done: 1, total: 10 },
    { day: 5, label: 'Day 5 (Fri)', todo: 3, progress: 3, review: 2, done: 2, total: 10 },
    { day: 6, label: 'Day 6 (Today)', todo: 3, progress: 3, review: 2, done: 2, total: 10 },
    { day: 7, label: 'Day 7 (Tue)', todo: 2, progress: 3, review: 2, done: 3, total: 10 },
    { day: 8, label: 'Day 8 (Wed)', todo: 1, progress: 2, review: 2, done: 5, total: 10 },
    { day: 9, label: 'Day 9 (Thu)', todo: 0, progress: 2, review: 1, done: 7, total: 10 },
    { day: 10, label: 'Day 10 (Fri)', todo: 0, progress: 0, review: 1, done: 9, total: 10 },
  ];

  // Historical Sprint Velocity Comparison (S38 to S42)
  const velocityHistory = [
    { sprint: 'S38', committed: 32, completed: 30, sayDo: '93.8%', highlight: 'Auth v1 refactor' },
    { sprint: 'S39', committed: 36, completed: 34, sayDo: '94.4%', highlight: 'Zero spillover' },
    { sprint: 'S40', committed: 34, completed: 34, sayDo: '100%', highlight: '100% Say/Do ratio' },
    { sprint: 'S41', committed: 38, completed: 35, sayDo: '92.1%', highlight: 'Canary testing' },
    { sprint: 'S42', committed: 34, completed: 20, inFlight: 14, sayDo: 'In Flight', highlight: 'Active sprint (6d left)' },
  ];

  const currentCfdDay = cfdData.find((d) => d.day === selectedDay) || cfdData[5];

  const handleCopyMemo = () => {
    const memo = `# Executive Sprint Delivery Memo — ${activeSprint?.name || 'PLAT Sprint 42'}
**Project:** ${currentProject?.name || 'Platform Core'}
**Date:** November 22, 2026
**Scrum Master:** Balaji Palani (CSM®, SAFe® 6.0)

## 📊 Core Agile Delivery Metrics
* **Total Committed Scope:** ${totalPoints} Story Points (10 Tickets)
* **Completed to Date:** ${completedPoints} Story Points (${Math.round((completedPoints / totalPoints) * 100)}%)
* **In-Flight (Dev + Review):** ${inProgressPoints + inReviewPoints} Story Points
* **Rolling Velocity Average:** 32.4 SP / sprint (+20% sustained boost)
* **Say/Do Predictability Ratio:** 94.1%
* **Median Cycle Time:** 2.1 days (Commit to Done)
* **Active Impediments:** 0 (100% unblocked flow)

## 🌊 Cumulative Flow Stability (Little's Law)
* **Current WIP:** ${currentCfdDay.progress + currentCfdDay.review} tickets in flight (WIP limit: 7 max)
* **Bottleneck Status:** Healthy parallel band width across Dev and Review.
* **Canary Release:** Scheduled on Fix Version v2.14.0-rc2.
`;
    navigator.clipboard.writeText(memo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  return (
    <main className="flex-1 min-w-0 p-4 sm:p-6 pb-24 md:pb-6 flex flex-col gap-6 overflow-y-auto select-none">
      {/* 1. Breadcrumb & Executive Header */}
      <div className="flex flex-col gap-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">Projects</span>
          <span aria-hidden="true">/</span>
          <span className="hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">{currentProject?.name || 'Platform Core'}</span>
          <span aria-hidden="true">/</span>
          <span className="text-slate-800 dark:text-slate-200 font-medium">Reports &amp; Velocity</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-headline text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Reports &amp; Velocity Analytics
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>{activeSprint?.name || 'PLAT Sprint 42'} · Nov 15 – Nov 29</span>
            </span>
          </div>

          {/* Action CTAs: Print / PDF & Copy Memo */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMemo}
              type="button"
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-xs font-medium cursor-pointer shadow-2xs"
            >
              {copiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMemo ? 'Memo Copied!' : 'Copy Exec Memo'}</span>
            </button>

            <button
              onClick={() => window.print()}
              type="button"
              className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors text-xs font-semibold cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* View Mode Filter Tabs */}
        <div className="flex items-center gap-1 pt-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {[
            { id: 'all', label: 'All Telemetry' },
            { id: 'cfd', label: 'Cumulative Flow (CFD)' },
            { id: 'velocity', label: 'Sprint Velocity' },
            { id: 'burndown', label: 'Burndown' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Executive Agile KPI Cards */}
      <section aria-label="Key Agile Metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Rolling Velocity */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs uppercase font-semibold tracking-wider">Rolling Velocity</span>
            <div className="w-7 h-7 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-2xl font-bold text-slate-900 dark:text-white">32.4</span>
              <span className="text-xs text-slate-500 font-medium">SP / sprint</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              +20% velocity boost across 4 sprints via retro coaching.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +15.2% vs baseline
            </span>
            <span className="text-slate-400 tabular-nums font-medium">σ = ±2.1 SP</span>
          </div>
        </div>

        {/* KPI 2: Say / Do Delivery Ratio */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs uppercase font-semibold tracking-wider">Say / Do Predictability</span>
            <div className="w-7 h-7 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-2xl font-bold text-slate-900 dark:text-white">94.1%</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">High Reliability</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              32.2 average completed pts vs. 34.2 committed points.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-slate-400 font-medium">SAFe 6.0 Standard: &gt;85%</span>
            <span className="text-emerald-600 font-semibold">Top Decile</span>
          </div>
        </div>

        {/* KPI 3: Median Cycle Time */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs uppercase font-semibold tracking-wider">Median Cycle Time</span>
            <div className="w-7 h-7 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-2xl font-bold text-slate-900 dark:text-white">2.1</span>
              <span className="text-xs text-slate-500 font-medium">days / ticket</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Time elapsed from First Commit/In-Dev to Verified Done.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-purple-600 dark:text-purple-400 font-semibold">-0.8d faster flow</span>
            <span className="text-slate-400 tabular-nums font-medium">Lead: 4.2d</span>
          </div>
        </div>

        {/* KPI 4: Flow Efficiency */}
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs uppercase font-semibold tracking-wider">Flow Efficiency</span>
            <div className="w-7 h-7 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-2xl font-bold text-slate-900 dark:text-white">78.5%</span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Active Work</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Ratio of active coding vs. waiting in queues/review gates.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">WIP Capped: 7</span>
            <span className="text-slate-400 font-medium">0 Blockers</span>
          </div>
        </div>
      </section>

      {/* 3. Interactive Cumulative Flow Diagram (CFD) */}
      {(activeTab === 'all' || activeTab === 'cfd') && (
        <article className="p-5 sm:p-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col gap-5">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-title text-base font-bold text-slate-900 dark:text-white">
                  Cumulative Flow Diagram (CFD)
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                  Little&apos;s Law Flow
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Visualizes Work-In-Progress (WIP) band stability across 10 sprint days. Parallel bands indicate zero bottlenecks.
              </p>
            </div>

            {/* CFD Stage Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <span className="w-3 h-3 rounded-xs bg-emerald-500 inline-block" /> Done
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <span className="w-3 h-3 rounded-xs bg-purple-500 inline-block" /> In Review
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <span className="w-3 h-3 rounded-xs bg-blue-500 inline-block" /> In Progress
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <span className="w-3 h-3 rounded-xs bg-slate-300 dark:bg-slate-700 inline-block" /> To Do
              </span>
            </div>
          </header>

          {/* CFD Stacked Area Chart (SVG) */}
          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 700 240" className="w-full min-w-[580px] h-60" role="img" aria-label="Cumulative Flow Diagram">
              <defs>
                <linearGradient id="gradDone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="gradReview" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="gradProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id="gradTodo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#64748B" stopOpacity="0.25" />
                </linearGradient>
              </defs>

              {/* Horizontal gridlines */}
              <line x1="45" y1="20" x2="680" y2="20" stroke="#94A3B8" strokeOpacity="0.2" strokeDasharray="3 3" />
              <line x1="45" y1="65" x2="680" y2="65" stroke="#94A3B8" strokeOpacity="0.2" strokeDasharray="3 3" />
              <line x1="45" y1="110" x2="680" y2="110" stroke="#94A3B8" strokeOpacity="0.2" strokeDasharray="3 3" />
              <line x1="45" y1="155" x2="680" y2="155" stroke="#94A3B8" strokeOpacity="0.2" strokeDasharray="3 3" />
              <line x1="45" y1="200" x2="680" y2="200" stroke="#94A3B8" strokeOpacity="0.4" />

              {/* Y-Axis Labels */}
              <text x="15" y="24" fill="#94A3B8" fontSize="11" fontFamily="monospace">10</text>
              <text x="15" y="69" fill="#94A3B8" fontSize="11" fontFamily="monospace">8</text>
              <text x="15" y="114" fill="#94A3B8" fontSize="11" fontFamily="monospace">5</text>
              <text x="15" y="159" fill="#94A3B8" fontSize="11" fontFamily="monospace">3</text>
              <text x="22" y="204" fill="#94A3B8" fontSize="11" fontFamily="monospace">0</text>

              {/* 1. To Do Layer (Top) */}
              <polygon
                points="
                  50,20 120,20 190,20 260,20 330,20 400,20 470,20 540,20 610,20 680,20
                  680,38 610,74 540,110 470,146 400,164 330,164 260,182 190,182 120,200 50,200
                "
                fill="url(#gradTodo)"
              />

              {/* 2. In Progress Layer */}
              <polygon
                points="
                  50,200 120,146 190,128 260,128 330,110 400,110 470,92 540,74 610,38 680,20
                  680,38 610,74 540,110 470,146 400,164 330,164 260,182 190,182 120,200 50,200
                "
                fill="url(#gradProgress)"
              />

              {/* 3. In Review Layer */}
              <polygon
                points="
                  50,200 120,200 190,182 260,182 330,164 400,164 470,146 540,110 610,74 680,38
                  680,56 610,92 540,128 470,164 400,182 330,182 260,190 190,200 120,200 50,200
                "
                fill="url(#gradReview)"
              />

              {/* 4. Done Layer (Bottom) */}
              <polygon
                points="
                  50,200 120,200 190,182 260,182 330,164 400,164 470,146 540,110 610,74 680,38
                  680,200 50,200
                "
                fill="url(#gradDone)"
              />

              {/* Today Vertical Line Indicator (Day 6 = x: 400) */}
              <line x1="400" y1="15" x2="400" y2="205" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="400" cy="20" r="4" fill="#3B82F6" />
              <rect x="375" y="0" width="50" height="16" rx="4" fill="#3B82F6" />
              <text x="382" y="12" fill="#FFFFFF" fontSize="10" fontWeight="bold">Today</text>

              {/* X-Axis Labels */}
              {cfdData.map((d, idx) => {
                const x = 50 + idx * 70;
                const isSelected = selectedDay === d.day;
                return (
                  <g key={d.day} className="cursor-pointer" onClick={() => setSelectedDay(d.day)}>
                    <text
                      x={x}
                      y="222"
                      textAnchor="middle"
                      fill={isSelected ? '#3B82F6' : '#94A3B8'}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fontSize="11"
                    >
                      D{d.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive Day Scrubber & Flow Telemetry Strip */}
          <div className="p-4 rounded bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase text-slate-500">
                  Scrubber State:
                </span>
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {currentCfdDay.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Total WIP in flight: <strong className="text-blue-600 dark:text-blue-400 font-semibold">{currentCfdDay.progress + currentCfdDay.review} tickets</strong> · Completed: <strong className="text-emerald-600 font-semibold">{currentCfdDay.done} tickets</strong>
              </p>
            </div>

            {/* Stage Pill Counts on Selected Day */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                To Do: <strong className="tabular-nums">{currentCfdDay.todo}</strong>
              </span>
              <span className="px-2.5 py-1 rounded text-xs font-medium bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                In Progress: <strong className="tabular-nums">{currentCfdDay.progress}</strong>
              </span>
              <span className="px-2.5 py-1 rounded text-xs font-medium bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300">
                In Review: <strong className="tabular-nums">{currentCfdDay.review}</strong>
              </span>
              <span className="px-2.5 py-1 rounded text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                Done: <strong className="tabular-nums">{currentCfdDay.done}</strong>
              </span>
            </div>
          </div>
        </article>
      )}

      {/* 4. Sprint Velocity & Burndown Charts Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        {/* Sprint Velocity Chart */}
        {(activeTab === 'all' || activeTab === 'velocity') && (
          <article className="p-5 sm:p-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-5">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-title text-base font-bold text-slate-900 dark:text-white">
                  Sprint Velocity &amp; Predictability
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Committed vs. Completed points across past 5 sprints.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-xs bg-slate-300 dark:bg-slate-700 inline-block" /> Committed
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" /> Completed
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block" /> In Flight
                </span>
              </div>
            </header>

            {/* Velocity Bar Columns */}
            <div className="grid grid-cols-5 gap-3 items-end h-56 pt-6 border-b border-slate-200 dark:border-slate-800 px-2">
              {velocityHistory.map((s) => {
                const isCurrent = s.sprint === 'S42';
                const commitPct = (s.committed / 40) * 100;
                const completedPct = (s.completed / 40) * 100;
                const inFlightPct = isCurrent ? (s.inFlight / 40) * 100 : 0;

                return (
                  <div key={s.sprint} className="flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-24 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] p-2 rounded shadow-lg pointer-events-none z-20 whitespace-nowrap">
                      <p className="font-bold">{s.sprint}: {s.highlight}</p>
                      <p>Committed: {s.committed} SP</p>
                      <p>Completed: {s.completed} SP ({s.sayDo})</p>
                    </div>

                    <div className="flex items-end gap-1.5 h-44 w-full justify-center">
                      {/* Committed Bar */}
                      <div
                        style={{ height: `${commitPct}%` }}
                        className="w-4 rounded-t bg-slate-300 dark:bg-slate-700 transition-all group-hover:bg-slate-400"
                        title={`Committed: ${s.committed} SP`}
                      />

                      {/* Completed / In-Flight Bar */}
                      <div className="w-4 flex flex-col justify-end h-full">
                        {isCurrent && inFlightPct > 0 && (
                          <div
                            style={{ height: `${inFlightPct}%` }}
                            className="w-full rounded-t bg-blue-500"
                            title={`In-Flight: ${s.inFlight} SP`}
                          />
                        )}
                        <div
                          style={{ height: `${completedPct}%` }}
                          className={`w-full ${isCurrent ? 'rounded-b' : 'rounded-t'} bg-emerald-500 transition-all group-hover:bg-emerald-600`}
                          title={`Completed: ${s.completed} SP`}
                        />
                      </div>
                    </div>

                    <div className="text-center pb-1">
                      <span className={`font-mono text-xs ${isCurrent ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>
                        {s.sprint}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono">{s.completed}pt</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Velocity Health Insight Footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Rolling Sprint Average: <strong className="text-slate-900 dark:text-white font-semibold">32.4 SP</strong></span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">94.1% Say/Do Predictability</span>
            </div>
          </article>
        )}

        {/* Sprint Burndown Chart */}
        {(activeTab === 'all' || activeTab === 'burndown') && (
          <article className="p-5 sm:p-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between gap-5">
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-title text-base font-bold text-slate-900 dark:text-white">
                  Sprint 42 Burndown
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Remaining points ({remainingPoints} SP) vs. ideal guideline trajectory.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-medium">
                <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-3 h-0.5 bg-slate-400 inline-block" /> Ideal Guideline
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-3 h-0.5 bg-red-500 inline-block" /> Remaining
                </span>
              </div>
            </header>

            {/* Burndown Line Chart (SVG) */}
            <div className="w-full overflow-hidden">
              <svg viewBox="0 0 460 210" className="w-full h-52" role="img" aria-label="Burndown line chart">
                {/* Horizontal Gridlines */}
                <line x1="35" y1="20" x2="445" y2="20" stroke="#94A3B8" strokeOpacity="0.2" />
                <line x1="35" y1="65" x2="445" y2="65" stroke="#94A3B8" strokeOpacity="0.2" />
                <line x1="35" y1="110" x2="445" y2="110" stroke="#94A3B8" strokeOpacity="0.2" />
                <line x1="35" y1="155" x2="445" y2="155" stroke="#94A3B8" strokeOpacity="0.2" />
                <line x1="35" y1="190" x2="445" y2="190" stroke="#94A3B8" strokeOpacity="0.4" />

                {/* Y-Axis Labels */}
                <text x="10" y="24" fill="#94A3B8" fontSize="10" fontFamily="monospace">{totalPoints}</text>
                <text x="10" y="69" fill="#94A3B8" fontSize="10" fontFamily="monospace">25</text>
                <text x="10" y="114" fill="#94A3B8" fontSize="10" fontFamily="monospace">17</text>
                <text x="10" y="159" fill="#94A3B8" fontSize="10" fontFamily="monospace">8</text>
                <text x="15" y="194" fill="#94A3B8" fontSize="10" fontFamily="monospace">0</text>

                {/* Ideal Guideline Line (Dashed) */}
                <line x1="35" y1="20" x2="445" y2="190" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5 5" />

                {/* Actual Remaining Polyline */}
                <polyline
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="35,20 100,20 160,45 220,70 280,70 330,120"
                />

                {/* Today point node */}
                <circle cx="330" cy="120" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />

                {/* Projected completion trajectory */}
                <line x1="330" y1="120" x2="445" y2="190" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

                {/* X-Axis Day Labels */}
                <text x="35" y="205" fill="#94A3B8" fontSize="10">Nov 15</text>
                <text x="175" y="205" fill="#94A3B8" fontSize="10">Nov 20</text>
                <text x="315" y="205" fill="#3B82F6" fontSize="10" fontWeight="bold">Today</text>
                <text x="415" y="205" fill="#94A3B8" fontSize="10">Nov 29</text>
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Sprint Commitment: <strong className="text-slate-900 dark:text-white font-semibold">{totalPoints} pts</strong></span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{completedPoints} pts burnt down</span>
            </div>
          </article>
        )}
      </section>

      {/* 5. Flow Bottleneck Diagnostics & WIP Limits Radar */}
      <section className="p-5 sm:p-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-title text-base font-bold text-slate-900 dark:text-white">
            Delivery Pipeline &amp; WIP Limits Health
          </h2>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" /> All WIP Limits Compliant
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Column 1: TO DO */}
          <div className="p-3.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">TO DO</span>
              <span className="text-xs font-semibold tabular-nums px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                3 tickets
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Refined sprint backlog ready for developer pickup.
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-slate-500 h-full w-[30%]" />
            </div>
          </div>

          {/* Column 2: IN PROGRESS */}
          <div className="p-3.5 rounded bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">IN PROGRESS</span>
              <span className="text-xs font-semibold tabular-nums px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                3 / 4 WIP
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Active engineering. 75% WIP limit capacity.
            </p>
            <div className="w-full bg-blue-100 dark:bg-blue-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[75%]" />
            </div>
          </div>

          {/* Column 3: IN REVIEW */}
          <div className="p-3.5 rounded bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/60 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">IN REVIEW</span>
              <span className="text-xs font-semibold tabular-nums px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                2 / 3 WIP
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Peer code reviews &amp; automated canary validation.
            </p>
            <div className="w-full bg-purple-100 dark:bg-purple-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full w-[67%]" />
            </div>
          </div>

          {/* Column 4: DONE */}
          <div className="p-3.5 rounded bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">DONE</span>
              <span className="text-xs font-semibold tabular-nums px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                2 tickets (20 SP)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Verified in production. Zero defect escapes.
            </p>
            <div className="w-full bg-emerald-100 dark:bg-emerald-950 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[100%]" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
