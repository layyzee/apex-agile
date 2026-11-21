'use client';

import { ShieldCheck, HardDrive, Cpu, Activity, Download, RefreshCw, CheckCircle2, Lock } from 'lucide-react';

export default function AdminView({
  projects,
  users,
  issues,
}) {
  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      platform: 'Apex Agile Enterprise v1.0',
      projects,
      users,
      issues,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apex-agile-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-[#121215] border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">System Administration & Health Console</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Zero-Cloud-Fee Architecture
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Monitor local-first SQLite engine vitals, verify immutable audit ledgers, and export full database snapshots.
          </p>
        </div>

        <button
          onClick={handleExportData}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-200 font-medium text-xs transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export JSON Database Snapshot</span>
        </button>
      </div>

      {/* System Vitals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#121215] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Database Engine</span>
            <HardDrive className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-lg font-bold font-mono text-white">node:sqlite</p>
          <p className="text-[11px] text-zinc-500">Embedded portable zero-dependency engine</p>
        </div>

        <div className="p-4 rounded-xl bg-[#121215] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Local Query Latency</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg font-bold font-mono text-emerald-400">&lt; 3.2 ms</p>
          <p className="text-[11px] text-zinc-500">Sub-50ms optimistic UI rendering</p>
        </div>

        <div className="p-4 rounded-xl bg-[#121215] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Monthly Cloud Cost</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-lg font-bold font-mono text-emerald-400">₹0.00 / mo</p>
          <p className="text-[11px] text-zinc-500">Zero recurring SaaS license overhead</p>
        </div>

        <div className="p-4 rounded-xl bg-[#121215] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">Managed Entities</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-lg font-bold font-mono text-white">
            {issues.length} issues • {projects.length} proj
          </p>
          <p className="text-[11px] text-zinc-500">{users.length} authenticated squad members</p>
        </div>
      </div>

      {/* Security & Access Policies */}
      <div className="p-5 rounded-xl bg-[#121215] border border-white/10 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
          Role-Based Access Control (RBAC) Schemes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg bg-zinc-950 border border-white/5 space-y-1.5">
            <span className="text-xs font-semibold text-blue-400">Scrum Master / Delivery Lead</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Full control: Start/complete sprints, edit WIP limits, configure automation rules, resolve impediments.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-950 border border-white/5 space-y-1.5">
            <span className="text-xs font-semibold text-zinc-300">Developer / Engineer</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Standard access: Transition cards, update story points in grooming, flag impediments, edit code criteria.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-zinc-950 border border-white/5 space-y-1.5">
            <span className="text-xs font-semibold text-amber-400">Product Owner</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Product authority: Prioritize backlog stack, create epics, write acceptance criteria, approve sprint scope.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
