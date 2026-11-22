'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  X, 
  ChevronsUp, 
  GitMerge, 
  CheckSquare, 
  Square,
  Bookmark,
  Bug,
  CheckCircle2,
  Plus
} from 'lucide-react';
import Avatar from './Avatar';

const AVATARS = {
  elena: 'https://lh3.googleusercontent.com/aida/ALJJyrDT0ygT73l1oUoLN-ldq4D7iK67gQRn2Jk7sBkqg00OyGKoqWQZmoRgvpSJ9yBujVKEsKamItF_rzwvRR9GvaIUS4xjNTiLupFexLBJ7GFYZdSJkyY5uCqQXPuCpnXXcN3cZl0SjBUXkf08AfWbQLcqKuuD5bWUTUaMgsKPLsXBFH58TvdsBeHggVY-ycBQeeRkHLak_R1Bx4dYrDhktkSi7Y1mbVHmwnKtJZuZJfFUTrMrLQNe',
  marcus: 'https://lh3.googleusercontent.com/aida/ALJJyrDgKx4jLzMiXGShOOaAzLOjwe-zDqHHXWBB1EKN99ni4lK8OMMkRiG-_xTTRI7voe3_3HfhmuaPa5-6F_6xJ4jLmz7pBtBqo4WWmFsxDVbWJC_K4-hU1FtU8r_-lAvFTzWcpMVWSnbVsdLHaUUaLN35F1HkIRAKQNdISHkxepLOraNDp84np6OnjPQaRH6GBuDuhRAIfTTnSiJ6_WcsbFEJJAkaKaLCGpruOK8dxOBzLEGjhYYpXw',
  priya: 'https://lh3.googleusercontent.com/aida/ALJJyrCklGpvdGYSopZxSSrRrPtkBdl957Q7Ogz3uX4fzie9G6mTQH6uP4Ci9ogj6r8yyxr5FSklMt7HTI9LHmOQx-1AJAW00HC-R94bmNKCEc1e-aUownDKA7Pw9u-0SzqwGKOMXci_2P53ra7QQllboBJxCniFDjxsHLcxZZzShy3IZKKuPnALJYUM8lxbC3lHfz-oLxtUKoE_SWLs1a7Uj3mETCnd6AwoJglU90DUhLV8p3Jl2FT6',
  kenji: 'https://lh3.googleusercontent.com/aida/ALJJyrBLdMi5794naAeeCGG9DPABynyRt6Kim8iD-BJ15u6KvCSy_z-bZ0rWPW2JTpGksViGt4Yhc8-g9QJ2O4mGtC7-aSzx_oMVSgOebe-dPhF6N6c_UQfVmFAqtxO6uiBV29EU8xE7bMFUcK8xvF2msv3T8RMNnRxl_QVBhXA_LavlWbFf1jFPvTN4LuPBqMy4W0pO5UpgwlOHIyzGiTZTEFovVZW8yWTboQYzKXGMJ4Gt6YcDFOE',
};

function getAssigneeAvatar(name = '') {
  const n = (name || '').toLowerCase();
  if (n.includes('elena')) return AVATARS.elena;
  if (n.includes('marcus')) return AVATARS.marcus;
  if (n.includes('priya')) return AVATARS.priya;
  if (n.includes('kenji')) return AVATARS.kenji;
  return AVATARS.elena;
}

export default function IssueDrawer({
  issue,
  states = [],
  sprints = [],
  epics = [],
  allIssues = [],
  components = [],
  fixVersions = [],
  onClose,
  onSaveIssue,
  onDeleteIssue,
}) {
  const [formData, setFormData] = useState({ ...issue });
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Priya Nair',
      avatar: AVATARS.priya,
      time: '1h ago',
      text: 'Added audit event schema for token rotation failures so Datadog alerts fire within 30s.',
    },
  ]);
  const [commentInput, setCommentInput] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState('Saved');

  useEffect(() => {
    setFormData({ ...issue });
    fetchDetails(issue.id);
  }, [issue]);

  const fetchDetails = async (id) => {
    try {
      const res = await fetch(`/api/issues/${id}`);
      const data = await res.json();
      if (data.success && data.subtasks) {
        setSubtasks(data.subtasks);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFieldChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setSaveStatus('Saving...');
    if (onSaveIssue) {
      onSaveIssue(updated).then(() => {
        setSaveStatus('Saved');
      });
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: 'Elena Rostova',
        avatar: AVATARS.elena,
        time: 'Just now',
        text: commentInput.trim(),
      },
    ]);
    setCommentInput('');
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    try {
      const res = await fetch('/api/subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issue_id: formData.id,
          title: newSubtaskTitle.trim(),
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
      await fetch(`/api/subtasks/${subtaskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const completedSubtasks = subtasks.filter((s) => s.status === 'done').length;
  const subtasksPct = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  const currentStatusObj = states.find((s) => s.id === formData.status_id) || states[0];
  const assigneeAvatar = getAssigneeAvatar(formData.assignee);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 select-none">
      <div
        className="w-full sm:w-[580px] h-full bg-light-surface-container-lowest border-l border-light-outline-variant flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200"
      >
        {/* Drawer Header */}
        <header className="sticky top-0 z-10 h-14 px-gutter-md bg-light-surface-container-lowest border-b border-light-outline-variant flex items-center justify-between gap-gutter-sm">
          <div className="flex items-center gap-gutter-sm">
            <button
              onClick={onClose}
              aria-label="Back"
              className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-light-on-surface-variant hover:bg-light-surface-container transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div className="flex items-center gap-gutter-xs">
              <Bookmark className="w-4 h-4 text-emerald-600 fill-emerald-600" />
              <span className="font-mono text-mono-md text-light-on-surface-variant tabular-nums font-semibold">
                {formData.key}
              </span>
            </div>
            <span className="font-mono text-xs text-light-on-surface-variant">• {saveStatus}</span>
          </div>

          <div className="flex items-center gap-gutter-xs">
            <button
              onClick={() => onDeleteIssue && onDeleteIssue(formData.id)}
              aria-label="Delete issue"
              className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-light-on-surface-variant hover:bg-light-error-container hover:text-light-on-error-container transition-colors"
            >
              <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close"
              className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-light-on-surface-variant hover:bg-light-surface-container transition-colors"
            >
              <X className="w-5 h-5 text-slate-500 hover:text-slate-800" />
            </button>
          </div>
        </header>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-gutter-lg flex flex-col gap-gutter-xl">
          {/* Epic & Title & Status */}
          <section className="flex flex-col gap-gutter-md">
            <div className="flex items-center justify-between gap-gutter-sm">
              <span className="px-gutter-sm py-0.5 rounded-sm bg-status-review-bg text-status-review font-label text-label-sm uppercase font-semibold">
                {formData.epic_name || 'Auth v3'}
              </span>
              <span className="font-body text-body-sm text-light-on-surface-variant">
                Updated 18m ago
              </span>
            </div>

            <textarea
              rows={2}
              value={formData.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="font-headline text-headline-sm text-light-on-surface font-semibold bg-transparent border-0 focus:ring-0 p-0 resize-none outline-none"
            />

            <div className="flex items-center gap-gutter-md">
              <label className="font-label text-label-md text-light-on-surface-variant font-semibold">Status</label>
              <select
                value={formData.status_id}
                onChange={(e) => handleFieldChange('status_id', e.target.value)}
                className="rounded-sm bg-status-progress-bg text-light-primary border-0 font-label text-label-md py-1.5 pl-gutter-md pr-8 font-semibold focus:ring-2 focus:ring-light-primary cursor-pointer"
              >
                {states.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Description */}
          <section className="flex flex-col gap-gutter-xs">
            <h2 className="font-title text-title-sm text-light-on-surface font-semibold">Description</h2>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Add description..."
              className="w-full p-gutter-sm rounded-sm bg-light-surface-container-low border border-light-outline-variant font-body text-body-md text-light-on-surface focus:border-light-primary focus:outline-none resize-none"
            />
          </section>

          {/* Metadata Grid */}
          <section aria-label="Issue details" className="p-gutter-lg rounded bg-light-surface-container-lowest border border-light-outline-variant grid grid-cols-2 gap-gutter-lg">
            <div>
              <p className="font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Assignee</p>
              <div className="flex items-center gap-2 mt-1.5">
                <Avatar name={formData.assignee || 'Elena Rostova'} size="sm" />
                <span className="font-body text-body-sm text-light-on-surface font-medium">
                  {formData.assignee || 'Elena Rostova'}
                </span>
              </div>
            </div>

            <div>
              <p className="font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Priority</p>
              <div className="flex items-center gap-gutter-xs mt-1.5">
                <ChevronsUp className="w-4 h-4 text-red-500" />
                <span className="font-body text-body-sm text-light-on-surface font-medium capitalize">
                  {formData.priority || 'High'}
                </span>
              </div>
            </div>

            <div>
              <p className="font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Story points</p>
              <input
                type="number"
                min="0"
                max="21"
                value={formData.story_points || ''}
                onChange={(e) => handleFieldChange('story_points', Number(e.target.value))}
                className="font-mono text-mono-md text-light-on-surface mt-1.5 tabular-nums bg-transparent border-0 p-0 font-bold w-16 focus:ring-0 outline-none"
              />
            </div>

            <div>
              <p className="font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Sprint</p>
              <p className="font-body text-body-sm text-light-on-surface mt-1.5 font-medium">
                PLAT Sprint 42
              </p>
            </div>
          </section>

          {/* Development / Linked PR Section */}
          <section className="flex flex-col gap-gutter-sm">
            <h2 className="font-title text-title-sm text-light-on-surface font-semibold">Development</h2>
            <div className="p-gutter-md rounded bg-light-surface-container-lowest border border-light-outline-variant flex items-center justify-between gap-gutter-sm">
              <div className="flex items-center gap-gutter-sm min-w-0">
                <GitMerge className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-body text-body-sm text-light-on-surface truncate font-medium">
                  PR #1842 · feat/pkce-refresh-worker
                </span>
              </div>
              <span className="px-gutter-sm py-0.5 rounded-sm bg-status-done-bg text-light-on-surface font-label text-label-sm uppercase font-semibold shrink-0">
                Checks pass
              </span>
            </div>
          </section>

          {/* Subtasks Section */}
          <section className="flex flex-col gap-gutter-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-title text-title-sm text-light-on-surface font-semibold">
                Subtasks ({completedSubtasks}/{subtasks.length})
              </h2>
              {subtasks.length > 0 && (
                <span className="font-mono text-xs text-light-on-surface-variant">{subtasksPct}%</span>
              )}
            </div>

            {subtasks.length > 0 && (
              <div className="w-full h-1.5 bg-light-surface-container rounded-full overflow-hidden">
                <div style={{ width: `${subtasksPct}%` }} className="h-full bg-status-done transition-all" />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => handleToggleSubtask(st.id, st.status)}
                  className="flex items-center gap-2 p-2 rounded-sm bg-light-surface-container-low border border-light-outline-variant hover:bg-light-surface-container transition-colors cursor-pointer"
                >
                  {st.status === 'done' ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span className={`text-xs ${st.status === 'done' ? 'line-through text-light-on-surface-variant' : 'text-light-on-surface'}`}>
                    {st.title}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                placeholder="Add new subtask..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-sm bg-light-surface-container-low border border-light-outline-variant text-xs text-light-on-surface focus:outline-none focus:border-light-primary"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-sm bg-light-surface-container text-light-on-surface text-xs font-medium hover:bg-light-surface-container-high border border-light-outline-variant"
              >
                Add
              </button>
            </form>
          </section>

          {/* Activity & Comments */}
          <section className="flex flex-col gap-gutter-md">
            <h2 className="font-title text-title-sm text-light-on-surface font-semibold">Activity &amp; Comments</h2>
            <div className="flex flex-col gap-gutter-md">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-gutter-sm">
                  <Avatar name={c.author} size="sm" />
                  <div className="flex-1 p-gutter-md rounded bg-light-surface-container-lowest border border-light-outline-variant">
                    <div className="flex items-center justify-between gap-gutter-xs mb-1">
                      <span className="font-title text-title-sm text-light-on-surface font-semibold">
                        {c.author}
                      </span>
                      <span className="font-body text-body-sm text-light-on-surface-variant">
                        {c.time}
                      </span>
                    </div>
                    <p className="font-body text-body-sm text-light-on-surface-variant">
                      {c.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky Bottom Comment Composer */}
        <form
          onSubmit={handleAddComment}
          className="sticky bottom-0 z-10 p-gutter-md bg-light-surface-container-lowest border-t border-light-outline-variant flex items-center gap-gutter-sm"
        >
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="flex-1 rounded-sm bg-light-surface-container-low border border-light-outline-variant font-body text-body-sm text-light-on-surface placeholder:text-light-on-surface-variant py-2 px-gutter-md focus:border-light-primary focus:outline-none"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center px-gutter-md py-2 rounded-sm bg-light-primary text-light-on-primary hover:bg-light-primary-container font-label text-label-md transition-colors cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
