'use client';

import { useState } from 'react';
import { 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Play, 
  CheckCircle, 
  FolderKanban, 
  ShieldAlert, 
  Clock, 
  Sparkles,
  X
} from 'lucide-react';

const EPIC_DOTS = {
  purple: 'bg-purple-400',
  teal: 'bg-teal-400',
  amber: 'bg-amber-400',
  blue: 'bg-blue-400',
  rose: 'bg-rose-400',
  emerald: 'bg-emerald-400',
};

const FIBONACCI = [1, 2, 3, 5, 8, 13];

export default function BacklogView({
  sprints,
  issues,
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
  const [isEpicsPanelOpen, setIsEpicsPanelOpen] = useState(true);
  const [selectedEpicFilter, setSelectedEpicFilter] = useState(null);
  const [collapsedSprints, setCollapsedSprints] = useState({});

  // Modals
  const [isCreateSprintOpen, setIsCreateSprintOpen] = useState(false);
  const [newSprintName, setNewSprintName] = useState('');
  const [newSprintGoal, setNewSprintGoal] = useState('');
  const [newSprintDuration, setNewSprintDuration] = useState(2);

  const [startSprintModal, setStartSprintModal] = useState(null);
  const [completeSprintModal, setCompleteSprintModal] = useState(null);
  const [rolloverTarget, setRolloverTarget] = useState('next_sprint');

  const [isCreateEpicOpen, setIsCreateEpicOpen] = useState(false);
  const [epicName, setEpicName] = useState('');
  const [epicColor, setEpicColor] = useState('purple');
  const [epicSummary, setEpicSummary] = useState('');

  const toggleCollapse = (id) => {
    setCollapsedSprints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateSprintSubmit = async (e) => {
    e.preventDefault();
    await onCreateSprint({
      name: newSprintName,
      goal: newSprintGoal,
      duration_weeks: Number(newSprintDuration),
    });
    setNewSprintName('');
    setNewSprintGoal('');
    setIsCreateSprintOpen(false);
  };

  const handleCreateEpicSubmit = async (e) => {
    e.preventDefault();
    if (!epicName.trim()) return;
    await onCreateEpic({
      name: epicName.trim(),
      color: epicColor,
      summary: epicSummary.trim(),
    });
    setEpicName('');
    setEpicSummary('');
    setIsCreateEpicOpen(false);
  };

  const displayedIssues = selectedEpicFilter
    ? issues.filter((i) => i.epic_id === selectedEpicFilter)
    : issues;

  const sprintSections = [
    ...sprints.map((s) => ({
      id: s.id,
      name: s.name,
      goal: s.goal,
      status: s.status,
      start_date: s.start_date,
      end_date: s.end_date,
      stats: s.stats,
      issues: displayedIssues.filter((i) => i.sprint_id === s.id),
    })),
    {
      id: 'backlog',
      name: 'Product Backlog',
      goal: 'Unplanned stories, discovery pool & ideas',
      status: 'backlog',
      issues: displayedIssues.filter((i) => !i.sprint_id),
    },
  ];

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* 1. Left Epics Panel */}
      {isEpicsPanelOpen && (
        <aside className="w-64 border-r border-white/[0.08] bg-[#0c0c0e] flex flex-col shrink-0 select-none">
          <div className="p-3.5 border-b border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-3.5 h-3.5 text-purple-400" />
              <h3 className="font-semibold text-xs text-zinc-200 tracking-tight">Epics</h3>
            </div>
            <button
              onClick={() => setIsCreateEpicOpen(true)}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
              title="Create Epic"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <button
              onClick={() => setSelectedEpicFilter(null)}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                selectedEpicFilter === null
                  ? 'bg-zinc-800 text-white font-medium border border-white/[0.08]'
                  : 'text-zinc-400 hover:bg-zinc-900/60'
              }`}
            >
              <span>All Epics</span>
              <span className="text-[10px] font-mono text-zinc-500">{issues.length}</span>
            </button>

            {epics.map((epic) => {
              const isSelected = selectedEpicFilter === epic.id;
              const epicIssues = issues.filter((i) => i.epic_id === epic.id);
              const dotColor = EPIC_DOTS[epic.color] || 'bg-purple-400';
              const pct = epic.stats?.completion_percentage || 0;

              return (
                <div
                  key={epic.id}
                  onClick={() => setSelectedEpicFilter(isSelected ? null : epic.id)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-zinc-800/90 border-purple-500/80 ring-1 ring-purple-500/30'
                      : 'bg-zinc-900/40 border-white/[0.04] hover:border-white/10 hover:bg-zinc-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />
                      <span className="text-xs font-medium text-zinc-200 truncate">{epic.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 shrink-0">{pct}%</span>
                  </div>

                  {/* Progress Line */}
                  <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mt-1.5 mb-1">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>{epic.key}</span>
                    <span>{epicIssues.length} issues</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      )}

      {/* 2. Main Backlog Surface */}
      <div className="flex-1 flex flex-col overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-5">
        {/* Top Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEpicsPanelOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isEpicsPanelOpen
                  ? 'bg-zinc-800 text-white border-white/[0.08]'
                  : 'bg-zinc-900 text-zinc-400 border-white/[0.06] hover:text-zinc-200'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5 text-purple-400" />
              <span>{isEpicsPanelOpen ? 'Hide Epics' : `Epics (${epics.length})`}</span>
            </button>

            {selectedEpicFilter && (
              <span className="text-xs text-purple-300 bg-purple-950/40 px-2 py-1 rounded-md border border-purple-500/25 flex items-center gap-1.5">
                <span>{epics.find((e) => e.id === selectedEpicFilter)?.name}</span>
                <button onClick={() => setSelectedEpicFilter(null)} className="hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <button
            onClick={() => setIsCreateSprintOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all active:scale-[0.98] shadow-sm shadow-blue-600/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Sprint</span>
          </button>
        </div>

        {/* Sprint Containers */}
        {sprintSections.map((section) => {
          const isCollapsed = collapsedSprints[section.id];
          const totalPoints = section.issues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0);
          const isSprintActive = section.status === 'active';
          const isSprintFuture = section.status === 'future';

          return (
            <div
              key={section.id}
              className="rounded-xl border border-white/[0.07] bg-[#0e0e11] overflow-hidden"
            >
              {/* Header */}
              <div className="p-3.5 bg-zinc-950/60 border-b border-white/[0.04] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleCollapse(section.id)}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-xs text-zinc-200">{section.name}</h3>
                      {isSprintActive && (
                        <span className="text-[10px] font-medium px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      )}
                      {isSprintFuture && (
                        <span className="text-[10px] font-medium px-2 py-0.2 rounded-full bg-zinc-800 text-zinc-400 border border-white/[0.05]">
                          Draft
                        </span>
                      )}
                    </div>
                    {section.goal && (
                      <p className="text-[11px] text-zinc-500 mt-0.5">{section.goal}</p>
                    )}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-2 px-2 py-1 rounded bg-zinc-900 border border-white/[0.05] text-xs font-mono">
                    <span className="text-zinc-500">{section.issues.length} issues</span>
                    <span className="text-zinc-700">•</span>
                    <span className="text-zinc-300 font-medium">{totalPoints} pts</span>
                  </div>

                  {isSprintFuture && (
                    <button
                      onClick={() => setStartSprintModal(section)}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/25 text-xs font-medium transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Start Sprint</span>
                    </button>
                  )}

                  {isSprintActive && (
                    <button
                      onClick={() => setCompleteSprintModal(section)}
                      className="flex items-center gap-1 px-3 py-1 rounded-md bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/25 text-xs font-medium transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Complete Sprint</span>
                    </button>
                  )}

                  <button
                    onClick={() => onNewIssueWithSprint(section.id === 'backlog' ? null : section.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-white/[0.07] text-xs text-zinc-300 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Issues List */}
              {!isCollapsed && (
                <div className="divide-y divide-white/[0.04]">
                  {section.issues.length === 0 ? (
                    <div className="p-6 text-center text-xs text-zinc-600">
                      Container is empty
                    </div>
                  ) : (
                    section.issues.map((issue) => {
                      const dotColor = EPIC_DOTS[issue.epic_color] || 'bg-purple-400';

                      return (
                        <div
                          key={issue.id}
                          onClick={() => onSelectIssue(issue)}
                          className="group flex flex-wrap items-center justify-between p-3 hover:bg-zinc-900/50 cursor-pointer transition-colors gap-3"
                        >
                          {/* Left */}
                          <div className="flex items-center gap-2.5 flex-1 min-w-[320px]">
                            <span className="text-xs font-mono text-zinc-400 group-hover:text-blue-400 transition-colors">
                              {issue.key}
                            </span>

                            {issue.epic_name && (
                              <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-400 bg-zinc-900/60 px-1.5 py-0.5 rounded border border-white/[0.04]">
                                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                                <span className="truncate max-w-[120px]">{issue.epic_name}</span>
                              </span>
                            )}

                            <span className="text-xs font-medium text-zinc-200 group-hover:text-white transition-colors line-clamp-1">
                              {issue.title}
                            </span>

                            {issue.is_blocked === 1 && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1">
                                <ShieldAlert className="w-3 h-3" />
                                Blocked
                              </span>
                            )}
                          </div>

                          {/* Right: Points Selector & Move Dropdown */}
                          <div
                            className="flex items-center gap-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-0.5 bg-zinc-900 p-0.5 rounded border border-white/[0.04]">
                              {FIBONACCI.map((pt) => (
                                <button
                                  key={pt}
                                  onClick={() => onUpdateStoryPoints(issue.id, pt)}
                                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-colors ${
                                    issue.story_points === pt
                                      ? 'bg-blue-600 text-white font-medium'
                                      : 'text-zinc-500 hover:text-zinc-200'
                                  }`}
                                >
                                  {pt}
                                </button>
                              ))}
                            </div>

                            <select
                              value={issue.sprint_id || 'backlog'}
                              onChange={(e) => {
                                const val = e.target.value === 'backlog' ? null : e.target.value;
                                onUpdateSprintAssignment(issue.id, val);
                              }}
                              className="bg-zinc-900 border border-white/[0.07] text-zinc-300 text-xs rounded-md px-2 py-1 focus:outline-none focus:border-blue-500"
                            >
                              {sprints.map((s) => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                              ))}
                              <option value="backlog">Product Backlog</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Sprint Modal */}
      {isCreateSprintOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121215] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-150">
            <div className="p-4 border-b border-white/[0.06] bg-zinc-950 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Create Sprint</h3>
              <button onClick={() => setIsCreateSprintOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSprintSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Sprint Name *</label>
                <input
                  type="text"
                  required
                  value={newSprintName}
                  onChange={(e) => setNewSprintName(e.target.value)}
                  placeholder="e.g. Sprint 24.3"
                  className="w-full bg-zinc-900 border border-white/[0.08] rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Duration</label>
                <select
                  value={newSprintDuration}
                  onChange={(e) => setNewSprintDuration(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/[0.08] text-zinc-200 text-xs rounded-lg p-2 focus:outline-none focus:border-blue-500"
                >
                  <option value={1}>1 week</option>
                  <option value={2}>2 weeks (Standard)</option>
                  <option value={3}>3 weeks</option>
                  <option value={4}>4 weeks</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Sprint Goal</label>
                <textarea
                  rows={2}
                  value={newSprintGoal}
                  onChange={(e) => setNewSprintGoal(e.target.value)}
                  placeholder="What is the squad committing to deliver?"
                  className="w-full bg-zinc-900 border border-white/[0.08] rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.05]">
                <button
                  type="button"
                  onClick={() => setIsCreateSprintOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm"
                >
                  Create Sprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Start Sprint Modal */}
      {startSprintModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121215] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-150">
            <div className="p-4 border-b border-white/[0.06] bg-zinc-950 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Start {startSprintModal.name}</h3>
              <button onClick={() => setStartSprintModal(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 rounded-lg bg-blue-950/20 border border-blue-500/20 text-xs text-blue-200 space-y-1">
                <p className="font-semibold">Sprint Commitment Summary:</p>
                <p>• {startSprintModal.issues.length} stories planned</p>
                <p>• {startSprintModal.issues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0)} total story points</p>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Sprint Goal</label>
                <p className="text-xs text-zinc-400 italic bg-zinc-900 p-2 rounded border border-white/[0.05]">
                  {startSprintModal.goal || 'No sprint goal specified'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.05]">
                <button
                  type="button"
                  onClick={() => setStartSprintModal(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onStartSprint(startSprintModal.id);
                    setStartSprintModal(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm"
                >
                  Start Sprint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Complete Sprint Modal */}
      {completeSprintModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#121215] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-150">
            <div className="p-4 border-b border-white/[0.06] bg-zinc-950 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Complete {completeSprintModal.name}</h3>
              <button onClick={() => setCompleteSprintModal(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/25 text-xs">
                  <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-1">Completed</span>
                  <span className="text-base font-bold text-white">
                    {completeSprintModal.stats?.completed_points || 0} pts
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/25 text-xs">
                  <span className="text-[10px] uppercase font-mono text-amber-400 block mb-1">Incomplete</span>
                  <span className="text-base font-bold text-white">
                    {completeSprintModal.stats?.incomplete_points || 0} pts
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1.5">
                  Move Incomplete Issues To:
                </label>
                <select
                  value={rolloverTarget}
                  onChange={(e) => setRolloverTarget(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/[0.08] text-zinc-200 text-xs rounded-lg p-2 focus:outline-none focus:border-blue-500"
                >
                  {sprints.filter((s) => s.id !== completeSprintModal.id).map((s) => (
                    <option key={s.id} value={s.id}>Next Sprint ({s.name})</option>
                  ))}
                  <option value="backlog">Product Backlog Pool</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.05]">
                <button
                  type="button"
                  onClick={() => setCompleteSprintModal(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onCompleteSprint(completeSprintModal.id, rolloverTarget);
                    setCompleteSprintModal(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-sm"
                >
                  Confirm & Complete Sprint
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Epic Modal */}
      {isCreateEpicOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121215] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-150">
            <div className="p-4 border-b border-white/[0.06] bg-zinc-950 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Create Epic</h3>
              <button onClick={() => setIsCreateEpicOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEpicSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Epic Name *</label>
                <input
                  type="text"
                  required
                  value={epicName}
                  onChange={(e) => setEpicName(e.target.value)}
                  placeholder="e.g. Open Banking v3 Gateway"
                  className="w-full bg-zinc-900 border border-white/[0.08] rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Color Tag</label>
                <select
                  value={epicColor}
                  onChange={(e) => setEpicColor(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/[0.08] text-zinc-200 text-xs rounded-lg p-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="purple">🟣 Purple</option>
                  <option value="teal">🟢 Teal</option>
                  <option value="amber">🟠 Amber</option>
                  <option value="blue">🔵 Blue</option>
                  <option value="rose">🔴 Rose</option>
                  <option value="emerald">🟢 Emerald</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Epic Summary</label>
                <textarea
                  rows={2}
                  value={epicSummary}
                  onChange={(e) => setEpicSummary(e.target.value)}
                  placeholder="High-level goal..."
                  className="w-full bg-zinc-900 border border-white/[0.08] rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.05]">
                <button
                  type="button"
                  onClick={() => setIsCreateEpicOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs shadow-sm"
                >
                  Create Epic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
