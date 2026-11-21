'use client';

import { useState } from 'react';
import { X, FolderPlus, Kanban, ListTodo } from 'lucide-react';

export default function NewProjectModal({
  onClose,
  onCreate,
}) {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [methodology, setMethodology] = useState('scrum');
  const [lead, setLead] = useState('Balaji Palani (Lead Scrum Master)');
  const [desc, setDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !key.trim()) return;

    setIsSubmitting(true);
    await onCreate({
      name: name.trim(),
      key: key.toUpperCase().trim(),
      methodology,
      lead_name: lead.trim(),
      description: desc.trim(),
    });
    setIsSubmitting(false);
    onClose();
  };

  const handleNameChange = (val) => {
    setName(val);
    if (!key || key.length <= 4) {
      // Auto-suggest 3-4 letter key
      const words = val.trim().split(/\s+/);
      const suggested = words.length > 1
        ? words.map((w) => w[0]).join('').substring(0, 4)
        : val.substring(0, 4);
      setKey(suggested.toUpperCase());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#121215] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-150">
        <div className="p-4 border-b border-white/10 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Set Up New Agile Project</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-medium text-zinc-300 block mb-1">Project Name *</label>
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Verizon 10-Team ART"
                className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">Key (Prefix) *</label>
              <input
                type="text"
                required
                maxLength={6}
                value={key}
                onChange={(e) => setKey(e.target.value.toUpperCase())}
                placeholder="e.g. VER"
                className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 font-mono focus:outline-none focus:border-blue-500 uppercase"
              />
            </div>
          </div>

          {/* Delivery Methodology */}
          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1.5">
              Choose Delivery Methodology
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  methodology === 'scrum'
                    ? 'bg-blue-950/20 border-blue-500/50 ring-1 ring-blue-500/30'
                    : 'bg-zinc-900 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-zinc-100">Scrum</span>
                  <input
                    type="radio"
                    name="modal_methodology"
                    value="scrum"
                    checked={methodology === 'scrum'}
                    onChange={() => setMethodology('scrum')}
                    className="accent-blue-600"
                  />
                </div>
                <p className="text-[10px] text-zinc-400">
                  Sprint cycles, velocity burndown, and Backlog Grooming.
                </p>
              </label>

              <label
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  methodology === 'kanban'
                    ? 'bg-blue-950/20 border-blue-500/50 ring-1 ring-blue-500/30'
                    : 'bg-zinc-900 border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-zinc-100">Kanban</span>
                  <input
                    type="radio"
                    name="modal_methodology"
                    value="kanban"
                    checked={methodology === 'kanban'}
                    onChange={() => setMethodology('kanban')}
                    className="accent-blue-600"
                  />
                </div>
                <p className="text-[10px] text-zinc-400">
                  Continuous workflow stream with strict WIP limits.
                </p>
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">Project Lead / Delivery Lead</label>
            <input
              type="text"
              value={lead}
              onChange={(e) => setLead(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">Project Scope & Goal</label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. Scaling digital transformation across 10 squads with automated CI/CD gates"
              className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !key.trim()}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs disabled:opacity-50 transition-all shadow-sm"
            >
              {isSubmitting ? 'Creating Project...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
