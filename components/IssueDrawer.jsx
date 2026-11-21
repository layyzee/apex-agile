'use client';

import { useState, useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Trash2,
  Plus,
  Link2,
  ListTodo,
  FolderKanban,
  CheckSquare,
  Square
} from 'lucide-react';

const EPIC_COLORS = {
  purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  teal: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  blue: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
};

export default function IssueDrawer({
  issue,
  states,
  sprints,
  epics = [],
  allIssues = [],
  components = [],
  fixVersions = [],
  onClose,
  onSaveIssue,
  onDeleteIssue,
}) {
  const [formData, setFormData] = useState({ ...issue });
  const [history, setHistory] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [links, setLinks] = useState([]);
  const [isLinkOpen, setIsLinkOpen] = useState(false);
  const [linkRelation, setLinkRelation] = useState('blocks');
  const [linkTargetId, setLinkTargetId] = useState('');
  const [saveStatus, setSaveStatus] = useState('Saved');

  useEffect(() => {
    setFormData({ ...issue });
    fetchDetails(issue.id);
  }, [issue]);

  const fetchDetails = async (id) => {
    try {
      const [resIssue, resLinks] = await Promise.all([
        fetch(`/api/issues/${id}`),
        fetch(`/api/issue-links?issue_id=${id}`),
      ]);
      const dataIssue = await resIssue.json();
      const dataLinks = await resLinks.json();

      if (dataIssue.success) {
        if (dataIssue.history) setHistory(dataIssue.history);
        if (dataIssue.subtasks) setSubtasks(dataIssue.subtasks);
      }
      if (dataLinks.success) {
        setLinks(dataLinks.links || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFieldChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setSaveStatus('Saving...');
    onSaveIssue(updated).then(() => {
      setSaveStatus('Saved');
    });
  };

  // Subtask Handlers
  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    try {
      const res = await fetch('/api/subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent_issue_id: formData.id,
          title: newSubtaskTitle.trim(),
          story_points: 1,
        }),
      });
      const data = await res.json();
      if (data.success && data.subtask) {
        setSubtasks((prev) => [...prev, data.subtask]);
        setNewSubtaskTitle('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSubtask = async (subtaskId, currentStatus) => {
    const nextStatus = currentStatus === 'done' ? 'todo' : 'done';
    setSubtasks((prev) =>
      prev.map((s) => (s.id === subtaskId ? { ...s, status: nextStatus } : s))
    );

    try {
      await fetch('/api/subtasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: subtaskId, status: nextStatus }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Link Handlers
  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!linkTargetId) return;

    try {
      const res = await fetch('/api/issue-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_issue_id: formData.id,
          target_issue_id: linkTargetId,
          relationship_type: linkRelation,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchDetails(formData.id);
        setIsLinkOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const completedSubtasksCount = subtasks.filter((s) => s.status === 'done').length;
  const subtasksPct = subtasks.length > 0
    ? Math.round((completedSubtasksCount / subtasks.length) * 100)
    : 0;

  // INVEST Quality Scorecard Calculation
  const hasValue = (formData.description || '').toLowerCase().includes('so that') || (formData.description || '').length > 30;
  const hasAC = (formData.acceptance_criteria || '').trim().length > 10;
  const isEstimated = formData.story_points && Number(formData.story_points) > 0;
  const isSmall = Number(formData.story_points) <= 8;
  const hasAssignee = formData.assignee && formData.assignee !== 'Unassigned';

  const investChecks = [
    { label: 'Testable Acceptance Criteria (Given/When/Then)', pass: hasAC },
    { label: 'Clear User Value Statement ("So that...")', pass: hasValue },
    { label: 'Sized Appropriately (<= 8 story points)', pass: isSmall },
    { label: 'Estimable Points Assigned', pass: isEstimated },
    { label: 'Team Ownership & Assignee Set', pass: hasAssignee },
  ];
  const passedCount = investChecks.filter((c) => c.pass).length;
  const dorScore = Math.round((passedCount / investChecks.length) * 100);

  const selectedEpic = epics.find((e) => e.id === formData.epic_id);
  const epicColor = EPIC_COLORS[selectedEpic?.color] || EPIC_COLORS.purple;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[580px] bg-[#121215] border-l border-white/10 z-50 flex flex-col shadow-2xl transition-all">
      {/* Drawer Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-950/70">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            {formData.key}
          </span>
          {selectedEpic && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${epicColor}`}>
              {selectedEpic.key}: {selectedEpic.name}
            </span>
          )}
          <span className="text-[11px] text-zinc-500 font-mono">• {saveStatus}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDeleteIssue(formData.id)}
            className="p-1.5 rounded hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 transition-colors"
            title="Delete Issue"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
            title="Close Drawer (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Title */}
        <div>
          <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
            Summary / Title
          </label>
          <textarea
            rows={2}
            value={formData.title || ''}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-sm text-zinc-100 font-medium focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        {/* Quick Attribute Grid */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-zinc-950/60 border border-white/5">
          {/* Status */}
          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Workflow Status</label>
            <select
              value={formData.status_id}
              onChange={(e) => handleFieldChange('status_id', e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-md p-1.5 focus:outline-none focus:border-blue-500"
            >
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Epic Link */}
          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Epic Link / Parent</label>
            <select
              value={formData.epic_id || ''}
              onChange={(e) => handleFieldChange('epic_id', e.target.value || null)}
              className="w-full bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-md p-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="">No Epic</option>
              {epics.map((ep) => (
                <option key={ep.id} value={ep.id}>{ep.key}: {ep.name}</option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => handleFieldChange('priority', e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-md p-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="critical">🔴 Critical</option>
              <option value="high">🟠 High</option>
              <option value="medium">🔵 Medium</option>
              <option value="low">⚪ Low</option>
            </select>
          </div>

          {/* Story Points */}
          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Story Points (Fibonacci)</label>
            <select
              value={formData.story_points}
              onChange={(e) => handleFieldChange('story_points', Number(e.target.value))}
              className="w-full bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-md p-1.5 focus:outline-none focus:border-blue-500 font-mono"
            >
              {[1, 2, 3, 5, 8, 13, 20].map((pt) => (
                <option key={pt} value={pt}>{pt} points</option>
              ))}
            </select>
          </div>

          {/* Component */}
          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Component</label>
            <select
              value={formData.component || ''}
              onChange={(e) => handleFieldChange('component', e.target.value || null)}
              className="w-full bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-md p-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="">None</option>
              {components.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Fix Version */}
          <div>
            <label className="text-[10px] text-zinc-400 block mb-1">Fix Version / Release</label>
            <select
              value={formData.fix_version || ''}
              onChange={(e) => handleFieldChange('fix_version', e.target.value || null)}
              className="w-full bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-md p-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="">None</option>
              {fixVersions.map((v) => (
                <option key={v.id} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>

          {/* Assignee */}
          <div className="col-span-2">
            <label className="text-[10px] text-zinc-400 block mb-1">Assignee</label>
            <input
              type="text"
              value={formData.assignee || ''}
              onChange={(e) => handleFieldChange('assignee', e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-md p-1.5 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Sub-tasks Section (Jira Core Requirement) */}
        <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-blue-400" />
              <h4 className="text-xs font-semibold text-zinc-200">
                Sub-tasks ({completedSubtasksCount}/{subtasks.length})
              </h4>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">{subtasksPct}% done</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${subtasksPct}%` }}
            />
          </div>

          {/* Subtasks List */}
          <div className="space-y-1.5">
            {subtasks.map((st) => (
              <div
                key={st.id}
                onClick={() => handleToggleSubtask(st.id, st.status)}
                className="flex items-center justify-between p-2 rounded bg-zinc-900/80 hover:bg-zinc-900 cursor-pointer border border-white/5 text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  {st.status === 'done' ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-500 shrink-0" />
                  )}
                  <span className={`line-clamp-1 ${st.status === 'done' ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                    {st.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500 shrink-0">{st.assignee}</span>
              </div>
            ))}
          </div>

          {/* Add Subtask Form */}
          <form onSubmit={handleAddSubtask} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="+ Add a subtask (press Enter)..."
              className="flex-1 bg-zinc-900 border border-white/10 rounded-md p-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
            />
          </form>
        </div>

        {/* Issue Linking & Dependencies (blocks, is blocked by, relates to) */}
        <div className="p-4 rounded-xl bg-zinc-950/60 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-semibold text-zinc-200">Linked Issues & Dependencies</h4>
            </div>
            <button
              onClick={() => setIsLinkOpen((prev) => !prev)}
              className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
            >
              {isLinkOpen ? 'Cancel' : '+ Link Issue'}
            </button>
          </div>

          {/* Create Link Drawer */}
          {isLinkOpen && (
            <form onSubmit={handleAddLink} className="p-2.5 rounded bg-zinc-900 border border-white/10 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={linkRelation}
                  onChange={(e) => setLinkRelation(e.target.value)}
                  className="bg-zinc-950 border border-white/10 text-xs text-zinc-300 rounded p-1.5"
                >
                  <option value="blocks">blocks</option>
                  <option value="is_blocked_by">is blocked by</option>
                  <option value="relates_to">relates to</option>
                  <option value="duplicates">duplicates</option>
                </select>

                <select
                  value={linkTargetId}
                  onChange={(e) => setLinkTargetId(e.target.value)}
                  className="bg-zinc-950 border border-white/10 text-xs text-zinc-300 rounded p-1.5"
                >
                  <option value="">Select target ticket...</option>
                  {allIssues.filter((i) => i.id !== formData.id).map((i) => (
                    <option key={i.id} value={i.id}>{i.key}: {i.title.substring(0, 30)}</option>
                  ))}
                </select>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={!linkTargetId}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-medium disabled:opacity-50"
                >
                  Confirm Link
                </button>
              </div>
            </form>
          )}

          {/* Links List */}
          <div className="space-y-1.5">
            {links.length === 0 ? (
              <p className="text-xs text-zinc-500">No linked dependencies.</p>
            ) : (
              links.map((lnk) => (
                <div key={lnk.link_id} className="p-2 rounded bg-zinc-900/80 border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-950 text-purple-300 border border-purple-500/20">
                      {lnk.relationship_type}
                    </span>
                    <span className="font-mono text-blue-400">{lnk.target_key}</span>
                    <span className="text-zinc-300 line-clamp-1">{lnk.target_title}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">{lnk.target_status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Blocker Flag */}
        <div className={`p-3.5 rounded-xl border transition-colors ${
          formData.is_blocked ? 'bg-rose-950/20 border-rose-500/40' : 'bg-zinc-950/40 border-white/5'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldAlert className={`w-4 h-4 ${formData.is_blocked ? 'text-rose-400' : 'text-zinc-500'}`} />
              <span className="text-xs font-medium text-zinc-200">Delivery Blocker Flag</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(formData.is_blocked)}
                onChange={(e) => handleFieldChange('is_blocked', e.target.checked ? 1 : 0)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>

          {Boolean(formData.is_blocked) && (
            <textarea
              rows={2}
              value={formData.blocked_reason || ''}
              onChange={(e) => handleFieldChange('blocked_reason', e.target.value)}
              placeholder="Reason for impediment..."
              className="w-full bg-zinc-900 border border-rose-500/30 rounded-lg p-2 text-xs text-rose-200 focus:outline-none focus:border-rose-400 mt-2"
            />
          )}
        </div>

        {/* INVEST Quality Scorecard */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-blue-950/20 to-zinc-950 border border-blue-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h4 className="text-xs font-semibold text-zinc-200">Definition of Ready (DoR) Quality Score</h4>
            </div>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
              dorScore === 100 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {dorScore}% Ready
            </span>
          </div>

          <div className="space-y-1 pt-1">
            {investChecks.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                {item.pass ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
                <span className={item.pass ? 'text-zinc-300' : 'text-zinc-500'}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Acceptance Criteria */}
        <div>
          <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
            Acceptance Criteria (Gherkin DoR)
          </label>
          <textarea
            rows={4}
            value={formData.acceptance_criteria || ''}
            onChange={(e) => handleFieldChange('acceptance_criteria', e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-blue-500 leading-relaxed"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
            Description
          </label>
          <textarea
            rows={4}
            value={formData.description || ''}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500 leading-relaxed"
          />
        </div>

        {/* Activity & Audit Trail */}
        <div className="pt-2 border-t border-white/5">
          <h4 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Activity & Audit Trail</span>
          </h4>
          <div className="space-y-1.5">
            {history.map((h) => (
              <div key={h.id} className="text-[11px] text-zinc-400 p-2 rounded bg-zinc-950/60 border border-white/5">
                <span className="font-medium text-zinc-300">{h.actor}</span> changed{' '}
                <span className="font-mono text-blue-400">{h.field_changed}</span>
                {h.old_value && <span className="text-zinc-500"> from &quot;{h.old_value}&quot;</span>}
                {h.new_value && <span className="text-zinc-300"> to &quot;{h.new_value}&quot;</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
