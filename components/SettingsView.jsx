'use client';

import { useState } from 'react';
import { Settings, Sliders, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export default function SettingsView({
  currentProject,
  states,
  onSaveProject,
}) {
  const [name, setName] = useState(currentProject?.name || '');
  const [methodology, setMethodology] = useState(currentProject?.methodology || 'scrum');
  const [desc, setDesc] = useState(currentProject?.description || '');
  const [lead, setLead] = useState(currentProject?.lead_name || '');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveProject({
      ...currentProject,
      name,
      methodology,
      description: desc,
      lead_name: lead,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-6">
      <div className="p-5 rounded-2xl bg-[#121215] border border-white/10 space-y-1">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-400" />
          <h2 className="text-base font-bold text-white tracking-tight">Project Settings & Configuration</h2>
        </div>
        <p className="text-xs text-zinc-400">
          Manage project metadata, switch Agile delivery methodologies, and fine-tune workflow limits.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Details */}
        <div className="p-5 rounded-xl bg-[#121215] border border-white/10 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">General Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">Project Key (Read-only)</label>
              <input
                type="text"
                disabled
                value={currentProject?.key || ''}
                className="w-full bg-zinc-950 border border-white/5 rounded-lg p-2 text-xs text-zinc-400 font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">Project Lead / Delivery Manager</label>
            <input
              type="text"
              value={lead}
              onChange={(e) => setLead(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 block mb-1">Description & Scope</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Methodology Switcher: Scrum vs Kanban */}
        <div className="p-5 rounded-xl bg-[#121215] border border-white/10 space-y-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Delivery Methodology</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Choose how your squad plans and tracks work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Scrum Option */}
            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                methodology === 'scrum'
                  ? 'bg-blue-950/20 border-blue-500/50 ring-1 ring-blue-500/30'
                  : 'bg-zinc-900/60 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs text-zinc-100">Scrum Methodology</span>
                <input
                  type="radio"
                  name="methodology"
                  value="scrum"
                  checked={methodology === 'scrum'}
                  onChange={() => setMethodology('scrum')}
                  className="accent-blue-600"
                />
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Time-boxed sprint iterations (1–4 weeks), committed velocity goals, hierarchical Backlog Grooming, and real-time Burndown charts.
              </p>
            </label>

            {/* Kanban Option */}
            <label
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                methodology === 'kanban'
                  ? 'bg-blue-950/20 border-blue-500/50 ring-1 ring-blue-500/30'
                  : 'bg-zinc-900/60 border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs text-zinc-100">Kanban Continuous Flow</span>
                <input
                  type="radio"
                  name="methodology"
                  value="kanban"
                  checked={methodology === 'kanban'}
                  onChange={() => setMethodology('kanban')}
                  className="accent-blue-600"
                />
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Continuous delivery stream without rigid sprint containers. Focuses on strict Work-In-Progress (WIP) limits and cycle time lead reduction.
              </p>
            </label>
          </div>
        </div>

        {/* Workflow State Columns & WIP Limits */}
        <div className="p-5 rounded-xl bg-[#121215] border border-white/10 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Active Workflow Columns & WIP Limits
          </h3>

          <div className="divide-y divide-white/5">
            {states.map((st) => (
              <div key={st.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-200">{st.name}</span>
                  <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-zinc-900">
                    Category: {st.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 font-mono">
                  <span>WIP Limit: {st.wip_limit > 0 ? `${st.wip_limit} cards` : 'Unlimited'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {savedNotice ? (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settings updated successfully!
            </span>
          ) : <span />}

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all active:scale-95 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
