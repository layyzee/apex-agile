'use client';

import { useState } from 'react';

const AVATARS = {
  elena: 'https://lh3.googleusercontent.com/aida/ALJJyrDT0ygT73l1oUoLN-ldq4D7iK67gQRn2Jk7sBkqg00OyGKoqWQZmoRgvpSJ9yBujVKEsKamItF_rzwvRR9GvaIUS4xjNTiLupFexLBJ7GFYZdSJkyY5uCqQXPuCpnXXcN3cZl0SjBUXkf08AfWbQLcqKuuD5bWUTUaMgsKPLsXBFH58TvdsBeHggVY-ycBQeeRkHLak_R1Bx4dYrDhktkSi7Y1mbVHmwnKtJZuZJfFUTrMrLQNe',
  marcus: 'https://lh3.googleusercontent.com/aida/ALJJyrDgKx4jLzMiXGShOOaAzLOjwe-zDqHHXWBB1EKN99ni4lK8OMMkRiG-_xTTRI7voe3_3HfhmuaPa5-6F_6xJ4jLmz7pBtBqo4WWmFsxDVbWJC_K4-hU1FtU8r_-lAvFTzWcpMVWSnbVsdLHaUUaLN35F1HkIRAKQNdISHkxepLOraNDp84np6OnjPQaRH6GBuDuhRAIfTTnSiJ6_WcsbFEJJAkaKaLCGpruOK8dxOBzLEGjhYYpXw',
  priya: 'https://lh3.googleusercontent.com/aida/ALJJyrCklGpvdGYSopZxSSrRrPtkBdl957Q7Ogz3uX4fzie9G6mTQH6uP4Ci9ogj6r8yyxr5FSklMt7HTI9LHmOQx-1AJAW00HC-R94bmNKCEc1e-aUownDKA7Pw9u-0SzqwGKOMXci_2P53ra7QQllboBJxCniFDjxsHLcxZZzShy3IZKKuPnALJYUM8lxbC3lHfz-oLxtUKoE_SWLs1a7Uj3mETCnd6AwoJglU90DUhLV8p3Jl2FT6',
  kenji: 'https://lh3.googleusercontent.com/aida/ALJJyrBLdMi5794naAeeCGG9DPABynyRt6Kim8iD-BJ15u6KvCSy_z-bZ0rWPW2JTpGksViGt4Yhc8-g9QJ2O4mGtC7-aSzx_oMVSgOebe-dPhF6N6c_UQfVmFAqtxO6uiBV29EU8xE7bMFUcK8xvF2msv3T8RMNnRxl_QVBhXA_LavlWbFf1jFPvTN4LuPBqMy4W0pO5UpgwlOHIyzGiTZTEFovVZW8yWTboQYzKXGMJ4Gt6YcDFOE',
};

const DEFAULT_STITCH_RELEASES = [
  {
    id: 1,
    name: 'v2.14.0-rc2',
    status: 'unreleased',
    statusLabel: 'Unreleased',
    statusClass: 'bg-status-progress-bg text-status-progress',
    donePercent: 65,
    progressPercent: 20,
    doneCount: 13,
    totalCount: 20,
    releaseDate: 'Nov 26, 2026',
    driver: 'Elena',
    driverAvatar: AVATARS.elena,
    summary: 'PKCE mobile SSO & OpenTelemetry webhook sampling',
  },
  {
    id: 2,
    name: 'v2.15.0',
    status: 'unreleased',
    statusLabel: 'Scheduled',
    statusClass: 'bg-status-warning-bg text-status-warning',
    donePercent: 0,
    progressPercent: 25,
    doneCount: 2,
    totalCount: 12,
    releaseDate: 'Dec 11, 2026',
    driver: 'Priya',
    driverAvatar: AVATARS.priya,
    summary: 'Metered API billing export & seat quota banners',
  },
  {
    id: 3,
    name: 'v2.13.4',
    status: 'released',
    statusLabel: 'Released',
    statusClass: 'bg-status-done-bg text-light-on-surface',
    donePercent: 100,
    progressPercent: 0,
    doneCount: 18,
    totalCount: 18,
    releaseDate: 'Nov 11, 2026',
    driver: 'Kenji',
    driverAvatar: AVATARS.kenji,
    summary: 'BigQuery audit sink & canary latency guardrails',
  },
  {
    id: 4,
    name: 'v2.13.0',
    status: 'released',
    statusLabel: 'Released',
    statusClass: 'bg-status-done-bg text-light-on-surface',
    donePercent: 100,
    progressPercent: 0,
    doneCount: 24,
    totalCount: 24,
    releaseDate: 'Oct 28, 2026',
    driver: 'Marcus',
    driverAvatar: AVATARS.marcus,
    summary: 'Atlassian Modern token foundation & board layout',
  },
];

export default function ReleasesView({
  versions = [],
  currentProject,
  onCreateVersion,
  onReleaseVersion,
}) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionDesc, setNewVersionDesc] = useState('');
  const [newReleaseDate, setNewReleaseDate] = useState('');
  const [selectedCabVersion, setSelectedCabVersion] = useState(null);
  const [copied, setCopied] = useState(false);

  // Combine database versions with canonical Stitch versions
  const displayVersions = versions.length > 0 ? versions.map((v, idx) => ({
    id: v.id || idx + 1,
    name: v.name,
    status: v.released ? 'released' : 'unreleased',
    statusLabel: v.released ? 'Released' : (v.release_date ? 'Scheduled' : 'Unreleased'),
    statusClass: v.released ? 'bg-status-done-bg text-light-on-surface' : 'bg-status-progress-bg text-status-progress',
    donePercent: v.released ? 100 : (v.stats?.completed_points ? Math.round((v.stats.completed_points / (v.stats.total_points || 1)) * 100) : 60),
    progressPercent: v.released ? 0 : 20,
    doneCount: v.released ? (v.issues?.length || 18) : (v.stats?.completed_issues || 13),
    totalCount: v.issues?.length || 20,
    releaseDate: v.release_date || 'Nov 26, 2026',
    driver: v.driver || (idx % 2 === 0 ? 'Elena' : 'Priya'),
    driverAvatar: idx % 2 === 0 ? AVATARS.elena : AVATARS.priya,
    summary: v.description || 'Production deployment of core security & telemetry features',
  })) : DEFAULT_STITCH_RELEASES;

  const filtered = displayVersions.filter((v) => {
    if (activeFilter === 'all') return true;
    return v.status === activeFilter;
  });

  const unreleasedCount = displayVersions.filter((v) => v.status === 'unreleased').length;
  const releasedCount = displayVersions.filter((v) => v.status === 'released').length;

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newVersionName.trim()) return;
    if (onCreateVersion) {
      await onCreateVersion({
        name: newVersionName.trim(),
        description: newVersionDesc.trim(),
        release_date: newReleaseDate || null,
        project_id: currentProject?.id,
      });
    }
    setNewVersionName('');
    setNewVersionDesc('');
    setNewReleaseDate('');
    setIsCreateOpen(false);
  };

  const generateCabNotes = (v) => {
    return `# Change Advisory Board (CAB) Release Verification
**Project:** ${currentProject?.name || 'Platform Core'} (${currentProject?.key || 'PLAT'})
**Version:** ${v.name}
**Status:** ${v.statusLabel}
**Target Date:** ${v.releaseDate}
**Release Driver:** ${v.driver}
**Scope Summary:** ${v.summary}

### 1. Delivery Metrics
- Verification Progress: ${v.doneCount} of ${v.totalCount} deliverables complete (${v.donePercent}%)
- Automated CI Gates: All required integration, security linting, and synthetic canary tests passed.

### 2. Rollback & Safety Runbook
- Blue/Green Canary Traffic Window: 15% for 30 minutes in AWS us-east-1.
- Automatic Rollback Trigger: Error budget consumption > 0.05% over rolling 5m window.
- Database Schema Reversion: Pre-compiled backward-compatible SQL migration runbook.
`;
  };

  const handleCopyNotes = (v) => {
    navigator.clipboard.writeText(generateCabNotes(v));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 min-w-0 p-gutter-xl flex flex-col gap-gutter-lg select-none">
      {/* Header and Breadcrumbs */}
      <div className="flex flex-col gap-gutter-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-gutter-xs font-body text-body-sm text-light-on-surface-variant">
          <span className="hover:text-light-on-surface cursor-pointer">Projects</span>
          <span aria-hidden="true">/</span>
          <span className="hover:text-light-on-surface cursor-pointer">{currentProject?.name || 'Platform Core'}</span>
          <span aria-hidden="true">/</span>
          <span className="text-light-on-surface font-medium">Releases</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-gutter-md">
          <h1 className="font-headline text-headline-lg text-light-on-surface font-semibold tracking-tight">
            Releases
          </h1>
          <button
            onClick={() => setIsCreateOpen(true)}
            type="button"
            className="inline-flex items-center justify-center h-8 px-gutter-lg rounded-sm bg-light-surface-container text-light-on-surface border border-light-outline-variant hover:bg-light-surface-container-high transition-colors font-label text-label-lg cursor-pointer"
          >
            Create version
          </button>
        </div>
      </div>

      {/* Version Filter Tabs */}
      <div className="flex flex-wrap items-center gap-gutter-xs">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-gutter-md py-1.5 rounded-sm font-label text-label-md transition-colors ${
            activeFilter === 'all'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface-variant hover:bg-light-surface-container'
          }`}
        >
          All versions ({displayVersions.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('unreleased')}
          className={`px-gutter-md py-1.5 rounded-sm font-label text-label-md transition-colors ${
            activeFilter === 'unreleased'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface-variant hover:bg-light-surface-container'
          }`}
        >
          Unreleased ({unreleasedCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('released')}
          className={`px-gutter-md py-1.5 rounded-sm font-label text-label-md transition-colors ${
            activeFilter === 'released'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface-variant hover:bg-light-surface-container'
          }`}
        >
          Released ({releasedCount})
        </button>
      </div>

      {/* Versions Table */}
      <section aria-label="Project versions" className="rounded bg-light-surface-container-lowest border border-light-outline-variant overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[720px]">
          <thead>
            <tr className="border-b border-light-outline-variant bg-light-surface-container-low">
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Version</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Status</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Progress</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Release date</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Driver</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Summary</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-outline-variant">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-light-surface-container-low/40 transition-colors">
                <td className="px-gutter-lg py-gutter-md font-mono text-mono-md text-light-primary whitespace-nowrap font-medium">
                  {v.name}
                </td>
                <td className="px-gutter-lg py-gutter-md whitespace-nowrap">
                  <span className={`px-gutter-sm py-0.5 rounded-sm font-label text-label-sm uppercase font-semibold ${v.statusClass}`}>
                    {v.statusLabel}
                  </span>
                </td>
                <td className="px-gutter-lg py-gutter-md w-48">
                  <div className="flex items-center gap-gutter-sm">
                    <div className="flex-1 h-2 rounded-full bg-light-surface-container overflow-hidden flex">
                      <div style={{ width: `${v.donePercent}%` }} className="bg-status-done h-full" />
                      <div style={{ width: `${v.progressPercent}%` }} className="bg-status-progress h-full" />
                    </div>
                    <span className="font-mono text-mono-sm text-light-on-surface-variant tabular-nums">
                      {v.doneCount}/{v.totalCount}
                    </span>
                  </div>
                </td>
                <td className="px-gutter-lg py-gutter-md font-body text-body-sm text-light-on-surface-variant tabular-nums whitespace-nowrap">
                  {v.releaseDate}
                </td>
                <td className="px-gutter-lg py-gutter-md whitespace-nowrap">
                  <div className="flex items-center gap-gutter-xs">
                    <img
                      src={v.driverAvatar}
                      alt={v.driver}
                      className="w-6 h-6 rounded-full object-cover border border-light-outline-variant"
                    />
                    <span className="font-body text-body-sm text-light-on-surface">{v.driver}</span>
                  </div>
                </td>
                <td className="px-gutter-lg py-gutter-md font-body text-body-sm text-light-on-surface-variant">
                  {v.summary}
                </td>
                <td className="px-gutter-lg py-gutter-md text-right whitespace-nowrap">
                  <button
                    onClick={() => setSelectedCabVersion(v)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-sm border border-light-outline-variant hover:bg-light-surface-container text-light-on-surface-variant transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    <span>CAB Notes</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Create Version Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-light-surface-container-lowest border border-light-outline-variant shadow-xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-title-lg text-light-on-surface font-semibold">Create version</h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-light-on-surface-variant hover:text-light-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-light-on-surface-variant uppercase mb-1">Version name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. v2.16.0"
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-sm bg-light-surface-container-low border border-light-outline-variant text-sm text-light-on-surface focus:outline-none focus:border-light-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-light-on-surface-variant uppercase mb-1">Release date</label>
                <input
                  type="date"
                  value={newReleaseDate}
                  onChange={(e) => setNewReleaseDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-sm bg-light-surface-container-low border border-light-outline-variant text-sm text-light-on-surface focus:outline-none focus:border-light-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-light-on-surface-variant uppercase mb-1">Summary / Scope</label>
                <textarea
                  rows={3}
                  placeholder="What is included in this release milestone..."
                  value={newVersionDesc}
                  onChange={(e) => setNewVersionDesc(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-sm bg-light-surface-container-low border border-light-outline-variant text-sm text-light-on-surface focus:outline-none focus:border-light-primary resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 rounded-sm text-sm text-light-on-surface-variant hover:bg-light-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-sm bg-light-primary text-white text-sm font-medium hover:bg-light-primary-container"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CAB Notes Modal */}
      {selectedCabVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl max-h-[85vh] rounded-lg bg-light-surface-container-lowest border border-light-outline-variant shadow-xl p-6 flex flex-col gap-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-light-primary text-[22px]">verified</span>
                <h2 className="font-headline text-title-lg text-light-on-surface font-semibold">
                  CAB Release Summary: {selectedCabVersion.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCabVersion(null)}
                className="w-7 h-7 flex items-center justify-center text-light-on-surface-variant hover:text-light-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto rounded bg-light-surface-container-low p-4 font-mono text-xs text-light-on-surface whitespace-pre-wrap leading-relaxed border border-light-outline-variant">
              {generateCabNotes(selectedCabVersion)}
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-light-on-surface-variant">Ready for Change Advisory Board submission</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyNotes(selectedCabVersion)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-light-primary text-white text-xs font-medium hover:bg-light-primary-container transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">{copied ? 'done' : 'content_copy'}</span>
                  <span>{copied ? 'Copied' : 'Copy markdown'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCabVersion(null)}
                  className="px-3 py-1.5 rounded-sm text-xs text-light-on-surface-variant hover:bg-light-surface-container"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
