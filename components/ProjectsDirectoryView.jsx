'use client';

import { useState } from 'react';
import Avatar from './Avatar';

const AVATARS = {
  elena: 'https://lh3.googleusercontent.com/aida/ALJJyrDT0ygT73l1oUoLN-ldq4D7iK67gQRn2Jk7sBkqg00OyGKoqWQZmoRgvpSJ9yBujVKEsKamItF_rzwvRR9GvaIUS4xjNTiLupFexLBJ7GFYZdSJkyY5uCqQXPuCpnXXcN3cZl0SjBUXkf08AfWbQLcqKuuD5bWUTUaMgsKPLsXBFH58TvdsBeHggVY-ycBQeeRkHLak_R1Bx4dYrDhktkSi7Y1mbVHmwnKtJZuZJfFUTrMrLQNe',
  marcus: 'https://lh3.googleusercontent.com/aida/ALJJyrDgKx4jLzMiXGShOOaAzLOjwe-zDqHHXWBB1EKN99ni4lK8OMMkRiG-_xTTRI7voe3_3HfhmuaPa5-6F_6xJ4jLmz7pBtBqo4WWmFsxDVbWJC_K4-hU1FtU8r_-lAvFTzWcpMVWSnbVsdLHaUUaLN35F1HkIRAKQNdISHkxepLOraNDp84np6OnjPQaRH6GBuDuhRAIfTTnSiJ6_WcsbFEJJAkaKaLCGpruOK8dxOBzLEGjhYYpXw',
  priya: 'https://lh3.googleusercontent.com/aida/ALJJyrCklGpvdGYSopZxSSrRrPtkBdl957Q7Ogz3uX4fzie9G6mTQH6uP4Ci9ogj6r8yyxr5FSklMt7HTI9LHmOQx-1AJAW00HC-R94bmNKCEc1e-aUownDKA7Pw9u-0SzqwGKOMXci_2P53ra7QQllboBJxCniFDjxsHLcxZZzShy3IZKKuPnALJYUM8lxbC3lHfz-oLxtUKoE_SWLs1a7Uj3mETCnd6AwoJglU90DUhLV8p3Jl2FT6',
  kenji: 'https://lh3.googleusercontent.com/aida/ALJJyrBLdMi5794naAeeCGG9DPABynyRt6Kim8iD-BJ15u6KvCSy_z-bZ0rWPW2JTpGksViGt4Yhc8-g9QJ2O4mGtC7-aSzx_oMVSgOebe-dPhF6N6c_UQfVmFAqtxO6uiBV29EU8xE7bMFUcK8xvF2msv3T8RMNnRxl_QVBhXA_LavlWbFf1jFPvTN4LuPBqMy4W0pO5UpgwlOHIyzGiTZTEFovVZW8yWTboQYzKXGMJ4Gt6YcDFOE',
};

const CANONICAL_PROJECTS = [
  {
    id: 1,
    name: 'Platform Core',
    key: 'PLAT',
    type: 'software',
    typeLabel: 'Team-managed software',
    icon: 'hub',
    iconColor: 'text-issue-epic',
    lead: 'Elena Rostova',
    leadAvatar: AVATARS.elena,
    openItems: 12,
  },
  {
    id: 2,
    name: 'IT Service Desk',
    key: 'ITSD',
    type: 'service',
    typeLabel: 'IT service management',
    icon: 'support_agent',
    iconColor: 'text-light-primary',
    lead: 'Kenji Sato',
    leadAvatar: AVATARS.kenji,
    openItems: 5,
  },
  {
    id: 3,
    name: 'Design System Ops',
    key: 'DSYS',
    type: 'software',
    typeLabel: 'Company-managed software',
    icon: 'palette',
    iconColor: 'text-status-done',
    lead: 'Marcus Vance',
    leadAvatar: AVATARS.marcus,
    openItems: 8,
  },
  {
    id: 4,
    name: 'Q4 Marketing Launch',
    key: 'MKTG',
    type: 'business',
    typeLabel: 'Cross-functional business',
    icon: 'campaign',
    iconColor: 'text-status-warning',
    lead: 'Priya Nair',
    leadAvatar: AVATARS.priya,
    openItems: 14,
  },
];

export default function ProjectsDirectoryView({
  projects = [],
  currentProject,
  onSelectProject,
  onNewProject,
  setActiveView,
}) {
  const [activeType, setActiveType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const displayList = CANONICAL_PROJECTS.map((cp) => {
    const match = projects.find((p) => p.key === cp.key);
    return match ? { ...cp, id: match.id, name: match.name, key: match.key } : cp;
  });

  const filtered = displayList.filter((p) => {
    const matchesType = activeType === 'all' || p.type === activeType;
    const matchesQuery =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lead.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  const handleProjectClick = (p) => {
    if (p.key === 'ITSD') {
      setActiveView && setActiveView('servicedesk');
    } else {
      const match = projects.find((proj) => proj.key === p.key);
      if (match && onSelectProject) {
        onSelectProject(match);
      }
      setActiveView && setActiveView('board');
    }
  };

  return (
    <div className="flex-1 min-w-0 p-gutter-xl flex flex-col gap-gutter-lg select-none">
      {/* Header and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-gutter-md">
        <div>
          <h1 className="font-headline text-headline-lg text-light-on-surface font-semibold tracking-tight">
            Projects
          </h1>
          <p className="font-body text-body-sm text-light-on-surface-variant">
            Explore and manage enterprise delivery and service projects
          </p>
        </div>
        <button
          onClick={onNewProject}
          type="button"
          className="inline-flex items-center justify-center px-gutter-md py-1.5 rounded-sm bg-light-primary text-light-on-primary hover:bg-light-primary-container font-label text-label-lg transition-colors cursor-pointer"
        >
          Create project
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="flex flex-wrap items-center justify-between gap-gutter-md">
        <div className="flex flex-wrap items-center gap-gutter-xs">
          <button
            type="button"
            onClick={() => setActiveType('all')}
            className={`px-gutter-md py-1 rounded-sm font-label text-label-md transition-colors ${
              activeType === 'all'
                ? 'bg-status-progress-bg text-light-primary font-semibold'
                : 'bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface-variant hover:bg-light-surface-container'
            }`}
          >
            All projects ({displayList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveType('software')}
            className={`px-gutter-md py-1 rounded-sm font-label text-label-md transition-colors ${
              activeType === 'software'
                ? 'bg-status-progress-bg text-light-primary font-semibold'
                : 'bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface-variant hover:bg-light-surface-container'
            }`}
          >
            Software
          </button>
          <button
            type="button"
            onClick={() => setActiveType('service')}
            className={`px-gutter-md py-1 rounded-sm font-label text-label-md transition-colors ${
              activeType === 'service'
                ? 'bg-status-progress-bg text-light-primary font-semibold'
                : 'bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface-variant hover:bg-light-surface-container'
            }`}
          >
            Service
          </button>
          <button
            type="button"
            onClick={() => setActiveType('business')}
            className={`px-gutter-md py-1 rounded-sm font-label text-label-md transition-colors ${
              activeType === 'business'
                ? 'bg-status-progress-bg text-light-primary font-semibold'
                : 'bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface-variant hover:bg-light-surface-container'
            }`}
          >
            Business
          </button>
        </div>

        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-2.5 top-2 text-[18px] text-light-on-surface-variant">
            search
          </span>
          <input
            type="search"
            placeholder="Search projects"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-sm bg-light-surface-container-low border border-light-outline-variant font-body text-body-sm text-light-on-surface focus:outline-none focus:border-light-primary"
          />
        </div>
      </div>

      {/* Projects Table */}
      <section aria-label="Projects directory" className="rounded bg-light-surface-container-lowest border border-light-outline-variant overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-light-outline-variant bg-light-surface-container-low">
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Name</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Key</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Type</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Lead</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold text-right">Open items</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-outline-variant">
            {filtered.map((p) => (
              <tr
                key={p.key}
                onClick={() => handleProjectClick(p)}
                className="hover:bg-light-surface-container-low/50 transition-colors cursor-pointer"
              >
                <td className="px-gutter-lg py-gutter-md">
                  <div className="flex items-center gap-gutter-sm font-title text-title-sm text-light-primary font-semibold hover:underline">
                    <span className={`material-symbols-outlined text-[18px] ${p.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {p.icon}
                    </span>
                    <span>{p.name}</span>
                  </div>
                </td>
                <td className="px-gutter-lg py-gutter-md font-mono text-mono-sm text-light-on-surface-variant">
                  {p.key}
                </td>
                <td className="px-gutter-lg py-gutter-md font-body text-body-sm text-light-on-surface-variant">
                  {p.typeLabel}
                </td>
                <td className="px-gutter-lg py-gutter-md">
                  <div className="flex items-center gap-2">
                    <Avatar name={p.lead} size="xs" />
                    <span className="font-body text-body-sm text-light-on-surface">{p.lead}</span>
                  </div>
                </td>
                <td className="px-gutter-lg py-gutter-md font-mono text-mono-sm text-light-on-surface-variant text-right tabular-nums">
                  {p.openItems}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
