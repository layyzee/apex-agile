'use client';

import { useState } from 'react';
import { 
  Rocket, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  FileText, 
  Copy, 
  Check, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  Clock,
  X
} from 'lucide-react';

export default function ReleasesView({
  versions = [],
  currentProject,
  onCreateVersion,
  onReleaseVersion,
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionDesc, setNewVersionDesc] = useState('');
  const [newReleaseDate, setNewReleaseDate] = useState('');

  // CAB Release Notes Modal
  const [cabModalVersion, setCabModalVersion] = useState(null);
  const [copied, setCopied] = useState(false);

  // Release Ceremony Modal
  const [confirmReleaseVersion, setConfirmReleaseVersion] = useState(null);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newVersionName.trim()) return;

    await onCreateVersion({
      name: newVersionName.trim(),
      description: newVersionDesc.trim(),
      release_date: newReleaseDate || null,
      project_id: currentProject.id,
    });

    setNewVersionName('');
    setNewVersionDesc('');
    setNewReleaseDate('');
    setIsCreateOpen(false);
  };

  const generateCabMarkdown = (ver) => {
    const stories = ver.issues?.filter((i) => i.issue_type === 'story') || [];
    const bugs = ver.issues?.filter((i) => i.issue_type === 'bug') || [];
    const tasks = ver.issues?.filter((i) => i.issue_type === 'task') || [];
    const totalPoints = ver.stats?.completed_points || 0;

    return `# Change Advisory Board (CAB) Release Request
**Programme:** ${currentProject?.name} (${currentProject?.key})  
**Release Tag:** ${ver.name}  
**Scheduled Deployment:** ${ver.release_date || 'Immediate'}  
**Release Lead:** ${currentProject?.lead_name}  
**Velocity Delivered:** ${totalPoints} story points across ${ver.issues?.length || 0} tickets  

---

### 1. Executive Release Summary
${ver.description || 'Production deployment of Open Banking v3 APIs, PKCE authentication, and compliance ledger verification.'}

---

### 2. Feature Enhancements (${stories.length})
${stories.map((s) => `* **[${s.key}]** ${s.title} (${s.story_points || 0} pts) — *Assignee: ${s.assignee}*`).join('\n') || '* No direct customer-facing features in this build.'}

---

### 3. Critical Defect Remediation (${bugs.length})
${bugs.map((b) => `* **[${b.key}]** ${b.title} — *Status: ${b.status_name}*`).join('\n') || '* Zero critical defects in this version.'}

---

### 4. Non-Functional & Infrastructure Tasks (${tasks.length})
${tasks.map((t) => `* **[${t.key}]** ${t.title}`).join('\n') || '* Standard deployment configurations.'}

---

### 5. Verification & Rollback Strategy
* **Automated Smoke Tests:** All CI/CD pipelines verified with zero regressions.
* **Database Rollback Script:** Verified in Staging under 120s execution window.
* **Traffic Cutover:** Blue-Green canary routing with 5-minute health probe window.
* **Canary Window:** 15% traffic routing for 30 minutes in AWS eu-west-1.
* **Rollback Trigger:** Automatic rollback if 5xx error rate exceeds 0.05% over a 5-minute rolling window.
* **Sign-off:** Lead Delivery Architect & Enterprise CAB Reviewer.
`;
  };

  const handleCopyCab = (ver) => {
    const text = generateCabMarkdown(ver);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#101014] border border-white/[0.07]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Rocket className="w-4 h-4" />
            </span>
            <h2 className="text-base font-semibold text-zinc-100 tracking-tight">
              Releases & CAB Deployment Hub
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">
              Fix Versions
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-2xl">
            Track release progress across sprints, execute formal deployment ceremonies, and auto-generate executive Change Advisory Board (CAB) release notes.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all active:scale-[0.98] shadow-sm shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Release Version</span>
        </button>
      </div>

      {/* Versions List */}
      <div className="space-y-4">
        {versions.length === 0 ? (
          <div className="p-12 text-center rounded-xl border border-dashed border-white/[0.06] bg-[#0c0c0e]">
            <Rocket className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <h4 className="text-xs font-semibold text-zinc-300">No release versions configured</h4>
            <p className="text-[11px] text-zinc-500 mt-1">Create your first Fix Version milestone (e.g. Release 24.1.0) to group deliverables.</p>
          </div>
        ) : (
          versions.map((ver) => {
            const isReleased = ver.status === 'released';
            const pct = ver.stats?.completion_percentage || 0;
            const completedCount = ver.stats?.completed_issues_count || 0;
            const totalCount = ver.stats?.total_issues || 0;

            return (
              <div
                key={ver.id}
                className="p-5 rounded-xl bg-[#111114] border border-white/[0.07] hover:border-white/[0.14] transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <Rocket className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-zinc-100">{ver.name}</h3>
                        {isReleased ? (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Released
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">
                            Unreleased
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        <span>Target: {ver.release_date || 'TBD'}</span>
                        {ver.description && (
                          <>
                            <span className="text-zinc-600">•</span>
                            <span className="truncate max-w-md">{ver.description}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCabModalVersion(ver)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/[0.07] text-xs text-zinc-300 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      <span>CAB Release Notes</span>
                    </button>

                    {!isReleased && (
                      <button
                        onClick={() => setConfirmReleaseVersion(ver)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors"
                      >
                        <Rocket className="w-3.5 h-3.5" />
                        <span>Release Version</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar & Roll-up */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-400">
                      {completedCount} of {totalCount} issues resolved ({ver.stats?.completed_points || 0}/{ver.stats?.total_points || 0} pts)
                    </span>
                    <span className="text-zinc-200 font-semibold">{pct}%</span>
                  </div>

                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Issue List Preview */}
                {ver.issues && ver.issues.length > 0 && (
                  <div className="pt-2 border-t border-white/[0.04] grid grid-cols-1 md:grid-cols-2 gap-2">
                    {ver.issues.map((iss) => (
                      <div
                        key={iss.id}
                        className="flex items-center justify-between p-2 rounded bg-zinc-900/60 border border-white/[0.03] text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono text-[11px] text-blue-400 shrink-0">{iss.key}</span>
                          <span className="text-zinc-200 truncate">{iss.title}</span>
                        </div>
                        <span className={`text-[10px] font-mono shrink-0 px-1.5 py-0.2 rounded border ${
                          iss.status_category === 'done'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-zinc-800 text-zinc-400 border-white/[0.04]'
                        }`}>
                          {iss.status_name}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Version Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121215] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-150">
            <div className="p-4 border-b border-white/[0.06] bg-zinc-950 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Create Release Version</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Version Name *</label>
                <input
                  type="text"
                  required
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  placeholder="e.g. Release 24.3.0 or Hotfix 24.1.2"
                  className="w-full bg-zinc-900 border border-white/[0.08] rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Target Release Date</label>
                <input
                  type="date"
                  value={newReleaseDate}
                  onChange={(e) => setNewReleaseDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/[0.08] rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Release Scope & Description</label>
                <textarea
                  rows={2}
                  value={newVersionDesc}
                  onChange={(e) => setNewVersionDesc(e.target.value)}
                  placeholder="Summary of deliverables, CAB change tickets, and dependencies..."
                  className="w-full bg-zinc-900 border border-white/[0.08] rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.05]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm"
                >
                  Create Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CAB Release Notes Modal */}
      {cabModalVersion && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#121215] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-150 flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-white/[0.06] bg-zinc-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-zinc-100">
                  CAB Release Notes — {cabModalVersion.name}
                </h3>
              </div>
              <button onClick={() => setCabModalVersion(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div className="p-3 rounded-lg bg-zinc-900/80 border border-white/[0.05] flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  Formatted for stakeholder emails, Change Advisory Board (CAB) reviews, and audit logs.
                </span>
                <button
                  onClick={() => handleCopyCab(cabModalVersion)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Markdown!' : 'Copy Markdown'}</span>
                </button>
              </div>

              {/* Rendered Preview */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-white/[0.06] font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap select-all">
                {generateCabMarkdown(cabModalVersion)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Release Ceremony Confirmation Modal */}
      {confirmReleaseVersion && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121215] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-150">
            <div className="p-4 border-b border-white/[0.06] bg-zinc-950 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">
                Execute Release Ceremony
              </h3>
              <button onClick={() => setConfirmReleaseVersion(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-zinc-300 leading-relaxed">
                Are you ready to mark <span className="font-mono font-bold text-blue-400">{confirmReleaseVersion.name}</span> as formally released? This will record the deployment completion in the immutable compliance audit ledger.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.05]">
                <button
                  type="button"
                  onClick={() => setConfirmReleaseVersion(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onReleaseVersion(confirmReleaseVersion.id);
                    setConfirmReleaseVersion(null);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-sm"
                >
                  Confirm Deployment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
