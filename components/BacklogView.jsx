'use client';

import { useState, useMemo } from 'react';
import { 
  Search, 
  MoreHorizontal, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  CheckSquare, 
  Bug, 
  Bookmark,
  Calendar,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Play,
  CheckCircle2,
  X,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import Avatar from './Avatar';

const FIBONACCI_CARDS = ['0', '1', '2', '3', '5', '8', '13', '20', '40', '?'];

export default function BacklogView({
  sprints = [],
  issues = [],
  epics = [],
  users = [],
  currentUser,
  onSelectIssue,
  onUpdateSprintAssignment,
  onUpdateStoryPoints,
  onCreateIssue,
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
  const [isEpicsPanelOpen, setIsEpicsPanelOpen] = useState(false);
  
  // Drag and Drop state
  const [draggedIssueId, setDraggedIssueId] = useState(null);
  const [dropTargetSprintId, setDropTargetSprintId] = useState(null);

  // Inline Issue Creator state per container (containerId: string)
  const [inlineCreateContainer, setInlineCreateContainer] = useState(null);
  const [inlineIssueTitle, setInlineIssueTitle] = useState('');

  // Create Sprint Modal state
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);
  const [newSprintName, setNewSprintName] = useState('');
  const [newSprintGoal, setNewSprintGoal] = useState('');

  // Planning Poker Chamber state
  const [isPokerOpen, setIsPokerOpen] = useState(false);
  const [pokerIssueId, setPokerIssueId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [areCardsRevealed, setAreCardsRevealed] = useState(false);

  // Toggle sprint container collapse
  const toggleSection = (id) => {
    setCollapsedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter issues
  const filteredIssues = useMemo(() => {
    return issues.filter((i) => {
      if (searchBacklog.trim()) {
        const q = searchBacklog.toLowerCase();
        const matches =
          (i.key && i.key.toLowerCase().includes(q)) ||
          (i.title && i.title.toLowerCase().includes(q)) ||
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
  }, [issues, searchBacklog, selectedAssignee, selectedEpicFilter]);

  // Active Sprint and Sprint Containers
  const activeSprint = useMemo(() => {
    return sprints.find((s) => s.status === 'active') || sprints[0] || {
      id: 'sprint-24-1',
      name: 'PLAT Sprint 42: Auth & Telemetry',
      status: 'active',
      goal: 'Deliver OAuth2 PKCE auth rotation and OpenTelemetry collector pipeline',
      start_date: '2026-11-12',
      end_date: '2026-11-26',
    };
  }, [sprints]);

  // Future / Draft Sprints
  const futureSprints = useMemo(() => {
    const list = sprints.filter((s) => s.id !== activeSprint?.id && s.status !== 'completed');
    if (list.length === 0) {
      return [
        {
          id: 'sprint-future-1',
          name: 'PLAT Sprint 43 (Draft)',
          status: 'planned',
          goal: 'Canary container rollout & distributed tracing verification',
          start_date: '2026-11-26',
          end_date: '2026-12-10',
        }
      ];
    }
    return list;
  }, [sprints, activeSprint]);

  // Partition issues by Sprint container
  const activeSprintIssues = useMemo(() => {
    return filteredIssues.filter((i) => i.sprint_id === activeSprint?.id);
  }, [filteredIssues, activeSprint]);

  const backlogPoolIssues = useMemo(() => {
    const assignedSprintIds = new Set([activeSprint?.id, ...futureSprints.map((s) => s.id)]);
    return filteredIssues.filter((i) => !i.sprint_id || !assignedSprintIds.has(i.sprint_id));
  }, [filteredIssues, activeSprint, futureSprints]);

  // Drag and Drop Handlers
  const handleDragStart = (e, issueId) => {
    setDraggedIssueId(issueId);
    e.dataTransfer.setData('text/plain', issueId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, containerId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dropTargetSprintId !== containerId) {
      setDropTargetSprintId(containerId);
    }
  };

  const handleDragLeave = (e, containerId) => {
    if (dropTargetSprintId === containerId) {
      setDropTargetSprintId(null);
    }
  };

  const handleDrop = async (e, targetSprintId) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData('text/plain') || draggedIssueId;
    setDropTargetSprintId(null);
    setDraggedIssueId(null);

    if (!issueId) return;

    const issueObj = issues.find((i) => i.id === issueId);
    const sprintObj = sprints.find((s) => s.id === targetSprintId);
    const destName = targetSprintId ? (sprintObj?.name || 'Sprint') : 'Backlog Pool';

    if (onUpdateSprintAssignment) {
      await onUpdateSprintAssignment(issueId, targetSprintId);
      toast.success(`Moved ${issueObj?.key || 'issue'} to ${destName}`, {
        description: `Capacity updated dynamically`
      });
    }
  };

  // Inline Issue Creator Handler
  const handleInlineCreate = async (containerSprintId) => {
    if (!inlineIssueTitle.trim()) {
      setInlineCreateContainer(null);
      return;
    }
    if (onCreateIssue) {
      await onCreateIssue({
        title: inlineIssueTitle.trim(),
        sprint_id: containerSprintId,
        issue_type: 'story',
        story_points: 3,
        priority: 'medium',
      });
      toast.success(`Created story: ${inlineIssueTitle.trim()}`);
    }
    setInlineIssueTitle('');
    setInlineCreateContainer(null);
  };

  // Create Sprint Submission
  const handleCreateSprintSubmit = async (e) => {
    e.preventDefault();
    if (!newSprintName.trim()) return;
    if (onCreateSprint) {
      await onCreateSprint({
        name: newSprintName.trim(),
        goal: newSprintGoal.trim(),
        duration_weeks: 2,
      });
      toast.success(`Created new sprint container: ${newSprintName.trim()}`);
    }
    setNewSprintName('');
    setNewSprintGoal('');
    setIsCreateSprintOpen(false);
  };

  // Currently selected issue in Planning Poker
  const pokerIssue = useMemo(() => {
    return issues.find((i) => i.id === pokerIssueId) || activeSprintIssues[0] || issues[0];
  }, [issues, pokerIssueId, activeSprintIssues]);

  // Simulated squad voters in Planning Poker
  const squadVoters = useMemo(() => {
    const targetPoints = selectedCard ? Number(selectedCard) || 5 : 5;
    return [
      { name: currentUser?.name || 'Balaji Palani', role: 'Scrum Master', vote: selectedCard || '5' },
      { name: 'Elena Rostova', role: 'Principal Architect', vote: String(targetPoints) },
      { name: 'Marcus Vance', role: 'Staff Frontend', vote: String(targetPoints) },
      { name: 'Priya Nair', role: 'Data & Telemetry', vote: String(targetPoints > 3 ? targetPoints - 1 : targetPoints) },
      { name: 'Kenji Sato', role: 'SRE & Platform', vote: String(targetPoints) },
    ];
  }, [selectedCard, currentUser]);

  const handleApplyPokerEstimate = () => {
    if (!pokerIssue || !selectedCard) return;
    const pts = Number(selectedCard) || 5;
    if (onUpdateStoryPoints) {
      onUpdateStoryPoints(pokerIssue.id, pts);
      toast.success(`Estimated ${pokerIssue.key} at ${pts} Story Points`, {
        description: `Fibonacci consensus applied from squad vote`
      });
    }
    setIsPokerOpen(false);
  };

  return (
    <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* 1. Breadcrumb & Header */}
      <div className="flex flex-col gap-1.5">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-body text-xs text-slate-500">
          <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Projects</span>
          <span aria-hidden="true">/</span>
          <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer">Platform Core</span>
          <span aria-hidden="true">/</span>
          <span className="text-slate-900 dark:text-white font-semibold">Backlog</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div>
            <h1 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
              <span>Backlog &amp; Sprint Planning</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Interactive D&amp;D
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Drag issues between sprint horizons, groom user stories, and estimate with Planning Poker
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Epics Drawer Toggle */}
            <button
              onClick={() => setIsEpicsPanelOpen((prev) => !prev)}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                isEpicsPanelOpen 
                  ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' 
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Epics Panel</span>
            </button>

            {/* Planning Poker Button */}
            <button
              onClick={() => {
                setIsPokerOpen(true);
                setAreCardsRevealed(false);
                setSelectedCard('5');
              }}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Planning Poker</span>
            </button>

            {/* Create Sprint Button */}
            <button
              onClick={() => setIsCreateSprintOpen(true)}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create sprint</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex items-center w-56 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-blue-500">
            <div className="pl-3 pr-1 text-slate-400 flex items-center">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="search"
              placeholder="Filter backlog..."
              value={searchBacklog}
              onChange={(e) => setSearchBacklog(e.target.value)}
              className="w-full py-1.5 pr-3 bg-transparent border-0 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
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
                <Avatar name={m.name} size="xs" />
              </button>
            ))}
          </div>

          {selectedAssignee && (
            <button
              onClick={() => setSelectedAssignee(null)}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}

          {/* Epics Dropdown Chips */}
          <div className="flex items-center gap-1.5">
            {epics.slice(0, 3).map((ep) => (
              <button
                key={ep.id}
                type="button"
                onClick={() => setSelectedEpicFilter(selectedEpicFilter === ep.id ? null : ep.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer border ${
                  selectedEpicFilter === ep.id
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
              >
                {ep.name || ep.title}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          {filteredIssues.length} issues · {filteredIssues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0)} story points
        </span>
      </div>

      {/* 3. Main Workspace: Epics Rail + Sprint Containers */}
      <div className="flex gap-6 items-start">
        {/* Collapsible Left Epics Panel */}
        {isEpicsPanelOpen && (
          <aside className="w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs p-4 shrink-0 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-600" />
                <span>Strategic Epics</span>
              </h2>
              <button
                onClick={() => setIsEpicsPanelOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                Close
              </button>
            </div>

            <div className="space-y-2">
              {epics.map((ep) => {
                const epIssues = issues.filter((i) => i.epic_id === ep.id);
                const epPoints = epIssues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0);
                const isSelected = selectedEpicFilter === ep.id;

                return (
                  <div
                    key={ep.id}
                    onClick={() => setSelectedEpicFilter(isSelected ? null : ep.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 dark:border-purple-800'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                      <span className="truncate">{ep.name || ep.title}</span>
                      <span className="font-mono text-[10px] text-purple-600 font-bold ml-1 shrink-0">
                        {epPoints} pts
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>{ep.key || 'PLAT-EPIC'}</span>
                      <span>{epIssues.length} issues</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* Right Containers (Active Sprint, Future Sprints, Backlog Pool) */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* A. Active Sprint Container */}
          <section 
            aria-label="Active Sprint Container"
            onDragOver={(e) => handleDragOver(e, activeSprint.id)}
            onDragLeave={(e) => handleDragLeave(e, activeSprint.id)}
            onDrop={(e) => handleDrop(e, activeSprint.id)}
            className={`rounded-xl bg-white dark:bg-slate-900 border transition-all duration-150 overflow-hidden shadow-xs ${
              dropTargetSprintId === activeSprint.id
                ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <header className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleSection(activeSprint.id)}
                  className="flex items-center gap-1.5 text-slate-900 dark:text-white cursor-pointer font-bold text-sm"
                >
                  {collapsedSections[activeSprint.id] ? (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                  <span>{activeSprint.name}</span>
                </button>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  ACTIVE
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {activeSprintIssues.length} issues · {activeSprintIssues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0)} pts
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onCompleteSprint && onCompleteSprint(activeSprint.id, 'backlog')}
                  className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer"
                >
                  Complete Sprint
                </button>
              </div>
            </header>

            {!collapsedSections[activeSprint.id] && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {activeSprintIssues.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 border-dashed border-2 border-slate-100 dark:border-slate-800 m-3 rounded-lg">
                    Drag issues here to plan them into this active sprint
                  </div>
                ) : (
                  activeSprintIssues.map((issue) => renderIssueRow(issue))
                )}

                {/* Inline Issue Creator */}
                {renderInlineCreator(activeSprint.id)}
              </div>
            )}
          </section>

          {/* B. Future / Draft Sprints */}
          {futureSprints.map((sprint) => {
            const sprintIssues = filteredIssues.filter((i) => i.sprint_id === sprint.id);
            const sprintPoints = sprintIssues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0);

            return (
              <section 
                key={sprint.id}
                aria-label={`Sprint Container: ${sprint.name}`}
                onDragOver={(e) => handleDragOver(e, sprint.id)}
                onDragLeave={(e) => handleDragLeave(e, sprint.id)}
                onDrop={(e) => handleDrop(e, sprint.id)}
                className={`rounded-xl bg-white dark:bg-slate-900 border transition-all duration-150 overflow-hidden shadow-xs ${
                  dropTargetSprintId === sprint.id
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <header className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleSection(sprint.id)}
                      className="flex items-center gap-1.5 text-slate-900 dark:text-white cursor-pointer font-bold text-sm"
                    >
                      {collapsedSections[sprint.id] ? (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                      <span>{sprint.name}</span>
                    </button>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      PLANNED
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {sprintIssues.length} issues · {sprintPoints} pts
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onStartSprint && onStartSprint(sprint.id)}
                      className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer inline-flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start sprint</span>
                    </button>
                  </div>
                </header>

                {!collapsedSections[sprint.id] && (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {sprintIssues.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400 border-dashed border-2 border-slate-100 dark:border-slate-800 m-3 rounded-lg">
                        Drag issues here to allocate capacity for this sprint
                      </div>
                    ) : (
                      sprintIssues.map((issue) => renderIssueRow(issue))
                    )}

                    {/* Inline Issue Creator */}
                    {renderInlineCreator(sprint.id)}
                  </div>
                )}
              </section>
            );
          })}

          {/* C. Backlog Pool (Unassigned to any sprint) */}
          <section 
            aria-label="Backlog Pool"
            onDragOver={(e) => handleDragOver(e, null)}
            onDragLeave={(e) => handleDragLeave(e, null)}
            onDrop={(e) => handleDrop(e, null)}
            className={`rounded-xl bg-white dark:bg-slate-900 border transition-all duration-150 overflow-hidden shadow-xs ${
              dropTargetSprintId === null && draggedIssueId
                ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <header className="px-5 py-3.5 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleSection('backlog-pool')}
                  className="flex items-center gap-1.5 text-slate-900 dark:text-white cursor-pointer font-bold text-sm"
                >
                  {collapsedSections['backlog-pool'] ? (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Product Backlog Pool</span>
                </button>
                <span className="text-xs text-slate-500 font-mono">
                  {backlogPoolIssues.length} issues · {backlogPoolIssues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0)} pts
                </span>
              </div>
            </header>

            {!collapsedSections['backlog-pool'] && (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {backlogPoolIssues.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400">
                    Product backlog is completely groomed! All items are assigned to active or draft sprints.
                  </div>
                ) : (
                  backlogPoolIssues.map((issue) => renderIssueRow(issue))
                )}

                {/* Inline Issue Creator */}
                {renderInlineCreator(null)}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* 4. Planning Poker Chamber Modal */}
      <AnimatePresence>
        {isPokerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xl rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col gap-5 relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-headline text-base font-bold text-slate-900 dark:text-white">
                      Planning Poker Chamber
                    </h3>
                    <p className="text-xs text-slate-500">
                      Synchronized Fibonacci estimation deck with squad consensus reveal
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsPokerOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Target Story Selection */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Estimating Issue</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{pokerIssue?.key}</span>
                </div>
                <h4 className="font-medium text-xs text-slate-900 dark:text-white truncate">
                  {pokerIssue?.title}
                </h4>
              </div>

              {/* Fibonacci Cards Deck */}
              <div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Select Your Estimate:
                </p>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {FIBONACCI_CARDS.map((card) => (
                    <button
                      key={card}
                      type="button"
                      onClick={() => {
                        setSelectedCard(card);
                        setAreCardsRevealed(false);
                      }}
                      className={`h-12 rounded-lg border font-mono font-bold text-sm flex items-center justify-center transition-all cursor-pointer ${
                        selectedCard === card
                          ? 'bg-blue-600 text-white border-blue-600 scale-105 shadow-md'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {card}
                    </button>
                  ))}
                </div>
              </div>

              {/* Squad Voters Cards Area */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Squad Ballots ({squadVoters.length} members):
                  </span>
                  {!areCardsRevealed ? (
                    <button
                      type="button"
                      onClick={() => setAreCardsRevealed(true)}
                      className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                    >
                      Reveal All Votes
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      92% Consensus on {selectedCard} pts
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {squadVoters.map((voter) => (
                    <div
                      key={voter.name}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center justify-between gap-1.5"
                    >
                      <Avatar name={voter.name} size="xs" />
                      <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 truncate w-full">
                        {voter.name.split(' ')[0]}
                      </span>
                      <div className="w-8 h-10 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center font-mono font-bold text-xs bg-white dark:bg-slate-900 shadow-2xs">
                        {areCardsRevealed ? voter.vote : '🂠'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPokerOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyPokerEstimate}
                  disabled={!selectedCard}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer disabled:opacity-50"
                >
                  Apply {selectedCard} Story Points to {pokerIssue?.key}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Create Sprint Modal */}
      {isCreateSprintOpen && (
        <form
          onSubmit={handleCreateSprintSubmit}
          className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col gap-3 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Create New Sprint
            </h3>
            <button
              type="button"
              onClick={() => setIsCreateSprintOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Sprint Name (e.g. PLAT Sprint 43)"
              value={newSprintName}
              onChange={(e) => setNewSprintName(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none"
              autoFocus
              required
            />
            <input
              type="text"
              placeholder="Sprint Goal (optional)"
              value={newSprintGoal}
              onChange={(e) => setNewSprintGoal(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreateSprintOpen(false)}
              className="px-3 py-1 rounded-lg text-xs text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer"
            >
              Create Sprint
            </button>
          </div>
        </form>
      )}
    </main>
  );

  // Helper: Renders an individual draggable issue row with INVEST badges
  function renderIssueRow(issue) {
    const issueType = (issue.issue_type || 'story').toLowerCase();
    const isHeavySizing = Number(issue.story_points) >= 8;
    const hasAc = issue.acceptance_criteria && issue.acceptance_criteria.trim().length > 0;
    const epicObj = epics.find((e) => e.id === issue.epic_id);

    return (
      <div
        key={issue.id}
        draggable
        onDragStart={(e) => handleDragStart(e, issue.id)}
        onClick={() => onSelectIssue && onSelectIssue(issue)}
        className={`px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-grab active:cursor-grabbing transition-colors group ${
          draggedIssueId === issue.id ? 'opacity-40 bg-slate-100 dark:bg-slate-800' : ''
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <GripVertical className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 shrink-0" />

          {issueType === 'task' ? (
            <CheckSquare className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          ) : issueType === 'bug' ? (
            <Bug className="w-3.5 h-3.5 text-red-500 shrink-0" />
          ) : (
            <Bookmark className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 shrink-0" />
          )}

          <span className="font-mono text-xs text-slate-500 tabular-nums shrink-0 font-medium">
            {issue.key}
          </span>
          <span className="text-xs text-slate-900 dark:text-white truncate font-medium">
            {issue.title}
          </span>

          {/* INVEST Badges */}
          {isHeavySizing && (
            <span 
              className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0"
              title="Story sizing >= 8 pts: Recommend splitting into smaller vertical slices"
            >
              Split Rec.
            </span>
          )}

          {!hasAc && (
            <span 
              className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0"
              title="Missing explicit Acceptance Criteria"
            >
              No AC
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {epicObj && (
            <span 
              style={{ backgroundColor: `${epicObj.color || '#0C66E4'}15`, color: epicObj.color || '#0C66E4' }}
              className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase shrink-0"
            >
              {epicObj.name || epicObj.title}
            </span>
          )}

          {/* Story Points Pill */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPokerIssueId(issue.id);
              setIsPokerOpen(true);
              setAreCardsRevealed(false);
              setSelectedCard(String(issue.story_points || '5'));
            }}
            title="Click to estimate in Planning Poker Chamber"
            className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 tabular-nums font-semibold hover:ring-1 hover:ring-blue-500 cursor-pointer"
          >
            {issue.story_points || 0} SP
          </button>

          <Avatar name={issue.assignee || 'Elena Rostova'} size="xs" />
        </div>
      </div>
    );
  }

  // Helper: Renders inline fast issue creator
  function renderInlineCreator(containerId) {
    if (inlineCreateContainer === containerId) {
      return (
        <div className="p-3 bg-slate-50/70 dark:bg-slate-800/40 flex items-center gap-2">
          <input
            type="text"
            placeholder="What needs to be done? Press Enter to save..."
            value={inlineIssueTitle}
            onChange={(e) => setInlineIssueTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleInlineCreate(containerId);
              if (e.key === 'Escape') setInlineCreateContainer(null);
            }}
            className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-blue-500 text-xs text-slate-900 dark:text-white outline-none"
            autoFocus
          />
          <button
            type="button"
            onClick={() => handleInlineCreate(containerId)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium cursor-pointer"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setInlineCreateContainer(null)}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Cancel
          </button>
        </div>
      );
    }

    return (
      <div className="p-2 bg-slate-50/40 dark:bg-slate-800/20">
        <button
          type="button"
          onClick={() => {
            setInlineCreateContainer(containerId);
            setInlineIssueTitle('');
          }}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-1 px-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create issue</span>
        </button>
      </div>
    );
  }
}
