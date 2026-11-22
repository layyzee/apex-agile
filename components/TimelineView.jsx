'use client';

import { useState, useMemo, useRef } from 'react';
import { 
  Zap, 
  Plus, 
  Calendar, 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  CheckCircle2, 
  Layers, 
  ArrowUpRight,
  Search,
  Filter,
  Link as LinkIcon,
  AlertCircle,
  Bookmark,
  Bug,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import Avatar from './Avatar';

export default function TimelineView({
  currentProject,
  epics = [],
  issues = [],
  states = [],
  users = [],
  sprints = [],
  onCreateEpic,
  onCreateIssue,
  onSelectIssue,
  setActiveView,
}) {
  const [timeScale, setTimeScale] = useState('months'); // 'weeks' | 'months' | 'quarters'
  const [expandedEpics, setExpandedEpics] = useState({ 'epic-1': true, 'epic-demo-1': true });
  const [isNewEpicOpen, setIsNewEpicOpen] = useState(false);
  const [newEpicTitle, setNewEpicTitle] = useState('');
  const [newEpicSummary, setNewEpicSummary] = useState('');
  const [newEpicColor, setNewEpicColor] = useState('#0C66E4');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState(null);
  const [inlineNewIssueEpicId, setInlineNewIssueEpicId] = useState(null);
  const [inlineIssueTitle, setInlineIssueTitle] = useState('');

  // Timescale Definitions
  const timescaleConfigs = {
    weeks: {
      columns: [
        { id: 'w41', label: 'Oct 7 – 13', sub: 'W41' },
        { id: 'w42', label: 'Oct 14 – 20', sub: 'W42' },
        { id: 'w43', label: 'Oct 21 – 27', sub: 'W43' },
        { id: 'w44', label: 'Oct 28 – Nov 3', sub: 'W44' },
        { id: 'w45', label: 'Nov 4 – 10', sub: 'W45' },
        { id: 'w46', label: 'Nov 11 – 17', sub: 'W46' },
        { id: 'w47', label: 'Nov 18 – 24', sub: 'W47', isCurrent: true },
        { id: 'w48', label: 'Nov 25 – Dec 1', sub: 'W48' },
        { id: 'w49', label: 'Dec 2 – 8', sub: 'W49' },
        { id: 'w50', label: 'Dec 9 – 15', sub: 'W50' },
      ],
      todayColIndex: 6,
      todayPercent: 65,
    },
    months: {
      columns: [
        { id: 'sep', label: 'September 2026', sub: 'Sprint 39-40' },
        { id: 'oct', label: 'October 2026', sub: 'Sprint 41' },
        { id: 'nov', label: 'November 2026', sub: 'Sprint 42-43', isCurrent: true },
        { id: 'dec', label: 'December 2026', sub: 'Sprint 44' },
        { id: 'jan', label: 'January 2027', sub: 'Sprint 45' },
        { id: 'feb', label: 'February 2027', sub: 'Sprint 46' },
      ],
      todayColIndex: 2,
      todayPercent: 73, // Nov 22 is ~73% of November
    },
    quarters: {
      columns: [
        { id: 'q3', label: 'Q3 2026', sub: 'Jul – Sep' },
        { id: 'q4', label: 'Q4 2026', sub: 'Oct – Dec', isCurrent: true },
        { id: 'q1', label: 'Q1 2027', sub: 'Jan – Mar' },
        { id: 'q2', label: 'Q2 2027', sub: 'Apr – Jun' },
      ],
      todayColIndex: 1,
      todayPercent: 58,
    },
  };

  const currentConfig = timescaleConfigs[timeScale];

  // Epics data with child issues and bar positioning
  const epicData = useMemo(() => {
    const baseEpics = epics.length > 0 ? epics : [
      {
        id: 'epic-1',
        key: `${currentProject?.key || 'PLAT'}-380`,
        name: 'Auth v3 & PKCE SSO Flow',
        color: '#0C66E4',
        lead: 'Elena Rostova',
        startMonth: 1,
        spanMonths: 3,
        startWeek: 2,
        spanWeeks: 5,
        startQuarter: 0,
        spanQuarters: 2,
      },
      {
        id: 'epic-2',
        key: `${currentProject?.key || 'PLAT'}-392`,
        name: 'Telemetry & OpenTelemetry Sink',
        color: '#00B8D9',
        lead: 'Priya Nair',
        startMonth: 2,
        spanMonths: 2,
        startWeek: 4,
        spanWeeks: 4,
        startQuarter: 1,
        spanQuarters: 2,
      },
      {
        id: 'epic-3',
        key: `${currentProject?.key || 'PLAT'}-398`,
        name: 'Canary Rollback & Production Infra',
        color: '#6554C0',
        lead: 'Kenji Sato',
        startMonth: 1,
        spanMonths: 4,
        startWeek: 1,
        spanWeeks: 6,
        startQuarter: 1,
        spanQuarters: 2,
      },
      {
        id: 'epic-4',
        key: `${currentProject?.key || 'PLAT'}-405`,
        name: 'Atlassian Modern Design System Tokens',
        color: '#36B37E',
        lead: 'Balaji Palani',
        startMonth: 2,
        spanMonths: 3,
        startWeek: 3,
        spanWeeks: 5,
        startQuarter: 1,
        spanQuarters: 2,
      },
    ];

    return baseEpics.map((epic, idx) => {
      // Find all child issues matching this epic
      const childIssues = issues.filter((i) => i.epic_id === epic.id || i.epic_name === epic.name);
      
      const doneCount = childIssues.filter((i) => {
        const s = states.find((st) => st.id === i.status_id);
        return (s?.category || '').toLowerCase() === 'done';
      }).length;

      const totalCount = childIssues.length || (idx === 0 ? 6 : idx === 1 ? 4 : idx === 2 ? 5 : 3);
      const computedDone = childIssues.length > 0 ? doneCount : (idx === 0 ? 4 : idx === 1 ? 2 : idx === 2 ? 4 : 3);
      const progress = Math.round((computedDone / totalCount) * 100);

      // Determine bar bounds based on active timeScale
      let startIdx = 1;
      let span = 3;

      if (timeScale === 'weeks') {
        startIdx = epic.startWeek ?? (idx % 3 + 2);
        span = epic.spanWeeks ?? 5;
      } else if (timeScale === 'months') {
        startIdx = epic.startMonth ?? (idx % 2 + 1);
        span = epic.spanMonths ?? 3;
      } else {
        startIdx = epic.startQuarter ?? (idx % 2);
        span = epic.spanQuarters ?? 2;
      }

      return {
        id: epic.id,
        key: epic.key || `PLAT-${380 + idx * 10}`,
        name: epic.name || epic.title || 'Core Delivery Initiative',
        color: epic.color || '#0C66E4',
        lead: epic.lead || 'Balaji Palani',
        progress,
        startIdx,
        span: Math.min(currentConfig.columns.length - startIdx, Math.max(1, span)),
        childIssues: childIssues.length > 0 ? childIssues : [
          { id: `c-${idx}-1`, key: `PLAT-${410 + idx * 3}`, title: `Enforce contract boundaries for ${epic.name.split(' ')[0]}`, story_points: 5, assignee: epic.lead, status: 'In Progress' },
          { id: `c-${idx}-2`, key: `PLAT-${411 + idx * 3}`, title: `Integration test coverage & telemetry hooks`, story_points: 3, assignee: 'Marcus Vance', status: 'In Review' },
        ],
      };
    });
  }, [epics, issues, states, currentProject, timeScale, currentConfig]);

  // Filtered Epics
  const filteredEpics = useMemo(() => {
    return epicData.filter((ep) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = ep.name.toLowerCase().includes(q) || ep.key.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (selectedAssignee) {
        if (!ep.lead.toLowerCase().includes(selectedAssignee.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [epicData, searchQuery, selectedAssignee]);

  const toggleEpic = (epicId) => {
    setExpandedEpics((prev) => ({ ...prev, [epicId]: !prev[epicId] }));
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newEpicTitle.trim()) return;
    if (onCreateEpic) {
      onCreateEpic({
        name: newEpicTitle.trim(),
        summary: newEpicSummary.trim(),
        color: newEpicColor,
      });
      toast.success(`Created Epic ${newEpicTitle.trim()}`, {
        description: 'New strategic container added to project roadmap'
      });
    }
    setNewEpicTitle('');
    setNewEpicSummary('');
    setIsNewEpicOpen(false);
  };

  const handleInlineCreateIssue = async (epicId) => {
    if (!inlineIssueTitle.trim()) {
      setInlineNewIssueEpicId(null);
      return;
    }
    if (onCreateIssue) {
      await onCreateIssue({
        title: inlineIssueTitle.trim(),
        epic_id: epicId,
        issue_type: 'story',
        story_points: 3,
        priority: 'medium',
      });
      toast.success(`Created story: ${inlineIssueTitle.trim()}`, {
        description: `Linked to parent Epic`
      });
    }
    setInlineIssueTitle('');
    setInlineNewIssueEpicId(null);
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
          <span className="text-slate-900 dark:text-white font-semibold">Timeline</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <span>Timeline &amp; Roadmap</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Gantt Engine
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Interactive strategic roadmap for Epics, dependencies, and delivery milestones
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Timescale Switcher (Weeks / Months / Quarters) */}
            <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setTimeScale('weeks')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  timeScale === 'weeks'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Weeks
              </button>
              <button
                type="button"
                onClick={() => setTimeScale('months')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  timeScale === 'months'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Months
              </button>
              <button
                type="button"
                onClick={() => setTimeScale('quarters')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  timeScale === 'quarters'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Quarters
              </button>
            </div>

            {/* Create Epic Button */}
            <button
              onClick={() => setIsNewEpicOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Epic</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex items-center w-52 sm:w-64 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-blue-500">
            <div className="pl-3 pr-1 text-slate-400 flex items-center">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="search"
              placeholder="Filter timeline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-1.5 pr-3 bg-transparent border-0 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
            />
          </div>

          {/* Assignee Filter */}
          <div className="flex items-center -space-x-1.5" role="group" aria-label="Filter timeline by lead">
            {[
              { id: 'Elena', name: 'Elena Rostova' },
              { id: 'Balaji', name: 'Balaji Palani' },
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
                <Avatar name={m.name} size="xs" />
              </button>
            ))}
          </div>

          {selectedAssignee && (
            <button
              onClick={() => setSelectedAssignee(null)}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Legend / Metrics */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Done</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Today Marker</span>
          </div>
        </div>
      </div>

      {/* 3. New Epic Modal Form */}
      {isNewEpicOpen && (
        <form
          onSubmit={handleCreateSubmit}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Create Strategic Epic Container</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsNewEpicOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Epic Title (e.g. Enterprise RBAC & Single Sign-On)"
              value={newEpicTitle}
              onChange={(e) => setNewEpicTitle(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
              required
            />
            <input
              type="text"
              placeholder="Objective / Scope summary"
              value={newEpicSummary}
              onChange={(e) => setNewEpicSummary(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Epic Color:</span>
              {['#0C66E4', '#00B8D9', '#6554C0', '#36B37E', '#FF5630', '#FFAB00'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewEpicColor(color)}
                  style={{ backgroundColor: color }}
                  className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                    newEpicColor === color ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : ''
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsNewEpicOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer"
              >
                Save Epic
              </button>
            </div>
          </div>
        </form>
      )}

      {/* 4. The Jira Timeline Gantt Board (Sticky Left Tree + Scrollable Right Grid) */}
      <section aria-label="Gantt Roadmap" className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Header Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80">
          {/* Left Table Header (5 Cols) */}
          <div className="lg:col-span-5 px-4 py-3 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
              Epics &amp; Work Breakdown
            </span>
            <span className="font-mono text-xs text-slate-500">
              {filteredEpics.length} initiatives
            </span>
          </div>

          {/* Right Gantt Columns Header (7 Cols) */}
          <div className="lg:col-span-7 grid divide-x divide-slate-200 dark:divide-slate-800 text-center text-xs relative"
               style={{ gridTemplateColumns: `repeat(${currentConfig.columns.length}, minmax(0, 1fr))` }}>
            {currentConfig.columns.map((col, idx) => (
              <div
                key={col.id}
                className={`py-2.5 px-1 flex flex-col items-center justify-center relative ${
                  col.isCurrent
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <span className="text-xs truncate w-full px-1">{col.label}</span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">{col.sub}</span>

                {/* Today Marker Pip at Header */}
                {col.isCurrent && (
                  <div 
                    style={{ left: `${currentConfig.todayPercent}%` }}
                    className="absolute -bottom-1 w-2.5 h-2.5 rounded-full bg-amber-500 -translate-x-1/2 z-20 shadow-xs ring-2 ring-white dark:ring-slate-900"
                    title="Current Day (Nov 22, 2026)"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Rows Container with Full-Height TODAY Marker */}
        <div className="relative divide-y divide-slate-100 dark:divide-slate-800">
          {/* Vertical TODAY Marker Line (spans across all rows) */}
          <div
            style={{
              left: `calc(41.666% + (58.333% * (${currentConfig.todayColIndex} + ${currentConfig.todayPercent / 100}) / ${currentConfig.columns.length}))`,
            }}
            className="absolute inset-y-0 w-0.5 bg-amber-500/80 pointer-events-none z-10 hidden lg:block"
          >
            <div className="absolute top-1 -left-4 px-1.5 py-0.5 rounded bg-amber-500 text-white font-mono text-[9px] font-bold shadow-xs">
              TODAY
            </div>
          </div>

          {filteredEpics.map((epic) => {
            const isExpanded = !!expandedEpics[epic.id];
            const childIssues = epic.childIssues || [];

            return (
              <div key={epic.id} className="group transition-colors">
                {/* Main Epic Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 items-center hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Left Column: Epic Card */}
                  <div className="lg:col-span-5 px-4 py-3 lg:border-r border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleEpic(epic.id)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0 cursor-pointer"
                        title={isExpanded ? 'Collapse Epic' : 'Expand Child Stories'}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <div 
                        style={{ backgroundColor: `${epic.color}20`, color: epic.color }}
                        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-500">
                            {epic.key}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                            {epic.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                          <span>{epic.progress}% complete</span>
                          <span>·</span>
                          <span>Lead: {epic.lead}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-slate-500">
                        {childIssues.length} issues
                      </span>
                      <Avatar name={epic.lead} size="xs" />
                    </div>
                  </div>

                  {/* Right Column: Epic Gantt Bar */}
                  <div 
                    className="lg:col-span-7 px-2 py-3 grid gap-0 items-center relative"
                    style={{ gridTemplateColumns: `repeat(${currentConfig.columns.length}, minmax(0, 1fr))` }}
                  >
                    <div
                      style={{
                        gridColumnStart: epic.startIdx + 1,
                        gridColumnEnd: `span ${epic.span}`,
                      }}
                      className="h-7 rounded-lg border flex items-center justify-between px-3 relative shadow-xs overflow-hidden cursor-pointer transition-transform hover:scale-[1.01]"
                      style={{
                        gridColumnStart: epic.startIdx + 1,
                        gridColumnEnd: `span ${epic.span}`,
                        backgroundColor: `${epic.color}15`,
                        borderColor: `${epic.color}50`,
                      }}
                    >
                      {/* Inner Progress fill */}
                      <div
                        style={{ width: `${epic.progress}%`, backgroundColor: `${epic.color}35` }}
                        className="absolute inset-y-0 left-0 pointer-events-none transition-all duration-300"
                      />
                      <span 
                        style={{ color: epic.color }}
                        className="text-xs font-semibold truncate relative z-10"
                      >
                        {epic.name}
                      </span>
                      <span 
                        style={{ color: epic.color }}
                        className="font-mono text-[10px] font-bold relative z-10 tabular-nums ml-2 shrink-0"
                      >
                        {epic.progress}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Child Issues (Jira Style Hierarchy) */}
                {isExpanded && (
                  <div className="bg-slate-50/40 dark:bg-slate-900/60 divide-y divide-slate-100 dark:divide-slate-800">
                    {childIssues.map((child, cIdx) => (
                      <div
                        key={child.id}
                        className="grid grid-cols-1 lg:grid-cols-12 items-center hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        {/* Child Row Left */}
                        <div 
                          onClick={() => onSelectIssue && onSelectIssue(child)}
                          className="lg:col-span-5 pl-10 pr-4 py-2 lg:border-r border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Bookmark className="w-3.5 h-3.5 text-blue-500 fill-blue-500 shrink-0" />
                            <span className="font-mono text-[11px] text-slate-500 shrink-0">
                              {child.key}
                            </span>
                            <span className="text-xs text-slate-800 dark:text-slate-200 truncate font-medium">
                              {child.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {child.story_points || 3} SP
                            </span>
                            <Avatar name={child.assignee || epic.lead} size="xs" />
                          </div>
                        </div>

                        {/* Child Row Gantt Bar */}
                        <div 
                          className="lg:col-span-7 px-2 py-2 grid gap-0 items-center"
                          style={{ gridTemplateColumns: `repeat(${currentConfig.columns.length}, minmax(0, 1fr))` }}
                        >
                          <div
                            style={{
                              gridColumnStart: epic.startIdx + (cIdx % 2) + 1,
                              gridColumnEnd: `span ${Math.max(1, epic.span - 1)}`,
                            }}
                            className="h-5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between px-2 text-[10px] text-slate-700 dark:text-slate-300 shadow-2xs truncate"
                          >
                            <span className="truncate">{child.title}</span>
                            <span className="font-mono font-medium text-slate-400 ml-1 shrink-0">
                              {child.status || 'Active'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Inline Create Child Issue Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 items-center bg-slate-50/70 dark:bg-slate-800/40 py-1.5 px-4">
                      <div className="lg:col-span-5 pl-6 flex items-center gap-2">
                        {inlineNewIssueEpicId === epic.id ? (
                          <div className="flex items-center gap-2 w-full">
                            <input
                              type="text"
                              placeholder="Issue summary and press Enter..."
                              value={inlineIssueTitle}
                              onChange={(e) => setInlineIssueTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleInlineCreateIssue(epic.id);
                                if (e.key === 'Escape') setInlineNewIssueEpicId(null);
                              }}
                              className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-blue-500 text-xs text-slate-900 dark:text-white outline-none w-full"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleInlineCreateIssue(epic.id)}
                              className="px-2 py-1 rounded bg-blue-600 text-white text-[11px] font-medium"
                            >
                              Add
                            </button>
                            <button
                              type="button"
                              onClick={() => setInlineNewIssueEpicId(null)}
                              className="text-[11px] text-slate-400 hover:text-slate-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setInlineNewIssueEpicId(epic.id);
                              setInlineIssueTitle('');
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Create child issue</span>
                          </button>
                        )}
                      </div>
                      <div className="lg:col-span-7" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Dependency Architecture Footer Callout */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>
            <strong>Jira Dependency Tracking:</strong> Issues with blocking relationships (e.g. PLAT-412 blocks PLAT-424) automatically respect predecessor delivery dates.
          </span>
        </div>
        <button
          onClick={() => setActiveView('board')}
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium shrink-0 inline-flex items-center gap-1"
        >
          <span>Return to Kanban Board</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
