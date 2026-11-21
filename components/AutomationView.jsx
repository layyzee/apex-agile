'use client';

import { useState } from 'react';
import { 
  Zap, 
  Play, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sliders, 
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function AutomationView({
  rules,
  currentProject,
  onToggleRule,
  onCreateRule,
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [ruleDesc, setRuleDesc] = useState('');
  const [triggerEvent, setTriggerEvent] = useState('issue_blocked');
  const [conditionRule, setConditionRule] = useState('is_blocked == 1');
  const [actionRule, setActionRule] = useState('Alert Scrum Master Balaji Palani & Pin to Daily Standup Radar');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    await onCreateRule({
      project_id: currentProject.id,
      name: ruleName.trim(),
      description: ruleDesc.trim(),
      trigger_event: triggerEvent,
      condition_rule: conditionRule,
      action_rule: actionRule,
    });

    setRuleName('');
    setRuleDesc('');
    setIsCreateOpen(false);
  };

  const projectRules = rules.filter((r) => r.project_id === currentProject.id);

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-zinc-900 to-zinc-950 border border-blue-500/20">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Zap className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">Agile Workflow Automation Engine</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Jira Automation +
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Deterministic if-this-then-that triggers that eliminate Scrum ceremony overhead: auto-escalate delivery blockers, enforce Definition of Ready gates, and trigger INVEST story-splitting warnings.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Automation Rule</span>
        </button>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {projectRules.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-dashed border-white/10 bg-[#121215]">
            <Zap className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-zinc-300">No automation rules configured for this project</h4>
            <p className="text-xs text-zinc-500 mt-1">Create your first automated workflow trigger to eliminate manual tracking.</p>
          </div>
        ) : (
          projectRules.map((rule) => (
            <div
              key={rule.id}
              className={`p-4 rounded-xl border transition-all duration-150 ${
                rule.is_active
                  ? 'bg-[#121215] border-white/10 hover:border-white/20'
                  : 'bg-zinc-950/40 border-white/5 opacity-60'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${rule.is_active ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                  <h3 className="text-sm font-semibold text-zinc-100">{rule.name}</h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>{rule.execution_count} runs executed</span>
                  </span>

                  {/* Toggle Active Button */}
                  <button
                    onClick={() => onToggleRule(rule.id, !rule.is_active)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors border ${
                      rule.is_active
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-zinc-200'
                    }`}
                  >
                    <span>{rule.is_active ? 'Active' : 'Paused'}</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-400 mb-3">{rule.description}</p>

              {/* Visual Pipeline Block */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono bg-zinc-950/80 p-2.5 rounded-lg border border-white/5">
                <div className="flex items-center gap-1 text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  <span className="font-bold text-[10px] uppercase text-zinc-400">WHEN</span>
                  <span>{rule.trigger_event}</span>
                </div>

                <ArrowRight className="w-3 h-3 text-zinc-600" />

                <div className="flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  <span className="font-bold text-[10px] uppercase text-zinc-400">IF</span>
                  <span>{rule.condition_rule}</span>
                </div>

                <ArrowRight className="w-3 h-3 text-zinc-600" />

                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="font-bold text-[10px] uppercase text-zinc-400">THEN</span>
                  <span>{rule.action_rule}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Rule Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#121215] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-150">
            <div className="p-4 border-b border-white/10 bg-zinc-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Create Smart Automation Rule</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Rule Name *</label>
                <input
                  type="text"
                  required
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. Blocker Escalation or Subtask Auto-Close"
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Description</label>
                <input
                  type="text"
                  value={ruleDesc}
                  onChange={(e) => setRuleDesc(e.target.value)}
                  placeholder="e.g. When blocked, immediately message Scrum Master on Slack"
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-3 p-3.5 rounded-xl bg-zinc-950 border border-white/5">
                <div>
                  <label className="text-[11px] font-mono text-blue-400 uppercase tracking-wider block mb-1">
                    1. When (Trigger)
                  </label>
                  <select
                    value={triggerEvent}
                    onChange={(e) => setTriggerEvent(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-lg p-2 focus:outline-none focus:border-blue-500"
                  >
                    <option value="issue_blocked">Issue Flagged as Blocked</option>
                    <option value="status_changed">Status Changed</option>
                    <option value="issue_created">Issue Created</option>
                    <option value="sprint_started">Sprint Started</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
                    2. If (Condition)
                  </label>
                  <input
                    type="text"
                    value={conditionRule}
                    onChange={(e) => setConditionRule(e.target.value)}
                    placeholder="e.g. story_points > 8 or status == 'Done'"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                    3. Then (Action)
                  </label>
                  <input
                    type="text"
                    value={actionRule}
                    onChange={(e) => setActionRule(e.target.value)}
                    placeholder="e.g. Notify Scrum Master or Transition Parent to Done"
                    className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-sm"
                >
                  Save & Activate Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
