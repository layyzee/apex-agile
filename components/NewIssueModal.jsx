'use client';

import { useState } from 'react';
import { X, Sparkles, FolderKanban } from 'lucide-react';

export default function NewIssueModal({
  sprints,
  states,
  epics = [],
  components = [],
  fixVersions = [],
  defaultSprintId,
  onClose,
  onCreate,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
  const [issueType, setIssueType] = useState('story');
  const [epicId, setEpicId] = useState(epics[0]?.id || '');
  const [component, setComponent] = useState(components[0]?.name || '');
  const [fixVersion, setFixVersion] = useState(fixVersions[0]?.name || '');
  const [labels, setLabels] = useState('');
  const [priority, setPriority] = useState('medium');
  const [storyPoints, setStoryPoints] = useState(3);
  const [originalEstimate, setOriginalEstimate] = useState(8);
  const [assignee, setAssignee] = useState('Balaji Palani (Scrum Master / Delivery Lead)');
  const [sprintId, setSprintId] = useState(defaultSprintId || 'sprint-24-1');
  const [statusId, setStatusId] = useState('state-todo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    await onCreate({
      title: title.trim(),
      description: description.trim(),
      acceptance_criteria: acceptanceCriteria.trim(),
      issue_type: issueType,
      epic_id: epicId || null,
      component: component || null,
      fix_version: fixVersion || null,
      labels: labels.trim(),
      priority,
      story_points: Number(storyPoints),
      original_estimate_hours: Number(originalEstimate),
      assignee,
      sprint_id: sprintId === 'backlog' ? null : sprintId,
      status_id: statusId,
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#121215] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold">⚡</span>
            <h3 className="font-semibold text-sm text-zinc-100">Create Issue</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Issue Type & Epic Link Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-zinc-300 block mb-1">Issue Type</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-lg p-2 focus:outline-none focus:border-blue-500"
              >
                <option value="story">📘 User Story</option>
                <option value="task">⚡ Technical Task</option>
                <option value="bug">🔴 Defect / Bug</option>
                <option value="epic">🟣 Epic</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-300 block mb-1">Epic Link / Parent</label>
              <select
                value={epicId}
                onChange={(e) => setEpicId(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-lg p-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">No Epic</option>
                {epics.map((ep) => (
                  <option key={ep.id} value={ep.id}>{ep.key}: {ep.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">Title *</label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement OAuth 2.0 PKCE flow for Mobile Banking Client"
              className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Sprint, Priority, Points & Estimate */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Sprint Container</label>
              <select
                value={sprintId || 'backlog'}
                onChange={(e) => setSprintId(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-lg p-1.5 focus:outline-none focus:border-blue-500"
              >
                {sprints.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
                <option value="backlog">Product Backlog</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-lg p-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="critical">🔴 Critical</option>
                <option value="high">🟠 High</option>
                <option value="medium">🔵 Medium</option>
                <option value="low">⚪ Low</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Story Points</label>
              <select
                value={storyPoints}
                onChange={(e) => setStoryPoints(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-lg p-1.5 font-mono focus:outline-none focus:border-blue-500"
              >
                {[1, 2, 3, 5, 8, 13, 20].map((pt) => (
                  <option key={pt} value={pt}>{pt} pts</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Original Estimate (h)</label>
              <input
                type="number"
                min={0}
                value={originalEstimate}
                onChange={(e) => setOriginalEstimate(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg p-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Component, Fix Version & Labels */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Component</label>
              <select
                value={component}
                onChange={(e) => setComponent(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-lg p-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="">No Component</option>
                {components.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Fix Version</label>
              <select
                value={fixVersion}
                onChange={(e) => setFixVersion(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-lg p-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="">No Version</option>
                {fixVersions.map((v) => (
                  <option key={v.id} value={v.name}>{v.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Labels (tags)</label>
              <input
                type="text"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                placeholder="security, fca-audit"
                className="w-full bg-zinc-900 border border-white/10 rounded-lg p-1.5 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Assignee */}
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">Assignee</label>
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Acceptance Criteria */}
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">Acceptance Criteria (Gherkin DoR)</label>
            <textarea
              rows={3}
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              placeholder="Given [precondition] When [action] Then [result]..."
              className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="As a [role], I want [feature], so that [benefit]..."
              className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs disabled:opacity-50 transition-all shadow-sm"
            >
              {isSubmitting ? 'Creating...' : 'Create Issue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
