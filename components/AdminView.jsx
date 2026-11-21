'use client';

import { useState } from 'react';

const AVATARS = {
  elena: 'https://lh3.googleusercontent.com/aida/ALJJyrDT0ygT73l1oUoLN-ldq4D7iK67gQRn2Jk7sBkqg00OyGKoqWQZmoRgvpSJ9yBujVKEsKamItF_rzwvRR9GvaIUS4xjNTiLupFexLBJ7GFYZdSJkyY5uCqQXPuCpnXXcN3cZl0SjBUXkf08AfWbQLcqKuuD5bWUTUaMgsKPLsXBFH58TvdsBeHggVY-ycBQeeRkHLak_R1Bx4dYrDhktkSi7Y1mbVHmwnKtJZuZJfFUTrMrLQNe',
  marcus: 'https://lh3.googleusercontent.com/aida/ALJJyrDgKx4jLzMiXGShOOaAzLOjwe-zDqHHXWBB1EKN99ni4lK8OMMkRiG-_xTTRI7voe3_3HfhmuaPa5-6F_6xJ4jLmz7pBtBqo4WWmFsxDVbWJC_K4-hU1FtU8r_-lAvFTzWcpMVWSnbVsdLHaUUaLN35F1HkIRAKQNdISHkxepLOraNDp84np6OnjPQaRH6GBuDuhRAIfTTnSiJ6_WcsbFEJJAkaKaLCGpruOK8dxOBzLEGjhYYpXw',
  priya: 'https://lh3.googleusercontent.com/aida/ALJJyrCklGpvdGYSopZxSSrRrPtkBdl957Q7Ogz3uX4fzie9G6mTQH6uP4Ci9ogj6r8yyxr5FSklMt7HTI9LHmOQx-1AJAW00HC-R94bmNKCEc1e-aUownDKA7Pw9u-0SzqwGKOMXci_2P53ra7QQllboBJxCniFDjxsHLcxZZzShy3IZKKuPnALJYUM8lxbC3lHfz-oLxtUKoE_SWLs1a7Uj3mETCnd6AwoJglU90DUhLV8p3Jl2FT6',
  kenji: 'https://lh3.googleusercontent.com/aida/ALJJyrBLdMi5794naAeeCGG9DPABynyRt6Kim8iD-BJ15u6KvCSy_z-bZ0rWPW2JTpGksViGt4Yhc8-g9QJ2O4mGtC7-aSzx_oMVSgOebe-dPhF6N6c_UQfVmFAqtxO6uiBV29EU8xE7bMFUcK8xvF2msv3T8RMNnRxl_QVBhXA_LavlWbFf1jFPvTN4LuPBqMy4W0pO5UpgwlOHIyzGiTZTEFovVZW8yWTboQYzKXGMJ4Gt6YcDFOE',
};

const DEFAULT_MEMBERS = [
  {
    id: 1,
    name: 'Elena Rostova',
    email: 'elena.rostova@acme.dev',
    avatar: AVATARS.elena,
    role: 'Org Admin',
    status: 'Active',
    lastActive: 'Online now',
  },
  {
    id: 2,
    name: 'Marcus Vance',
    email: 'marcus.vance@acme.dev',
    avatar: AVATARS.marcus,
    role: 'Project Admin',
    status: 'Active',
    lastActive: '12m ago',
  },
  {
    id: 3,
    name: 'Priya Nair',
    email: 'priya.nair@acme.dev',
    avatar: AVATARS.priya,
    role: 'Member',
    status: 'Active',
    lastActive: '1h ago',
  },
  {
    id: 4,
    name: 'Kenji Sato',
    email: 'kenji.sato@acme.dev',
    avatar: AVATARS.kenji,
    role: 'Project Admin',
    status: 'Active',
    lastActive: '2h ago',
  },
];

export default function AdminView({
  projects = [],
  users = [],
  issues = [],
}) {
  const [members, setMembers] = useState(DEFAULT_MEMBERS);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');

  const handleRoleChange = (id, newRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const namePart = inviteEmail.split('@')[0].replace('.', ' ');
    const capitalName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    setMembers((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: capitalName,
        email: inviteEmail.trim(),
        avatar: AVATARS.elena,
        role: inviteRole,
        status: 'Active',
        lastActive: 'Invited just now',
      },
    ]);
    setInviteEmail('');
    setIsInviteOpen(false);
  };

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
    <div className="flex-1 min-w-0 p-gutter-xl flex flex-col gap-gutter-xl select-none">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-gutter-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-gutter-xs font-body text-body-sm text-light-on-surface-variant">
          <span className="hover:text-light-on-surface cursor-pointer">Settings</span>
          <span aria-hidden="true">/</span>
          <span className="hover:text-light-on-surface cursor-pointer">Administration</span>
          <span aria-hidden="true">/</span>
          <span className="text-light-on-surface font-medium">Users &amp; access</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-gutter-md">
          <div>
            <h1 className="font-headline text-headline-lg text-light-on-surface font-semibold tracking-tight">
              Users &amp; role-based access
            </h1>
            <p className="font-body text-body-sm text-light-on-surface-variant">
              Manage organization roles, project permissions, and seat allocation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportData}
              type="button"
              className="inline-flex items-center gap-1.5 px-gutter-md py-1.5 rounded-sm bg-light-surface-container border border-light-outline-variant text-light-on-surface hover:bg-light-surface-container-high transition-colors font-label text-label-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export JSON Snapshot</span>
            </button>
            <button
              onClick={() => setIsInviteOpen(true)}
              type="button"
              className="inline-flex items-center justify-center px-gutter-md py-1.5 rounded-sm bg-light-primary text-light-on-primary hover:bg-light-primary-container transition-colors font-label text-label-lg cursor-pointer"
            >
              Invite member
            </button>
          </div>
        </div>
      </div>

      {/* Seat & Security KPI Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-gutter-lg">
        <div className="p-gutter-lg rounded bg-light-surface-container-lowest border border-light-outline-variant">
          <p className="font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Licensed seats</p>
          <p className="font-headline text-headline-md text-light-on-surface tabular-nums mt-1 font-bold">18 / 25</p>
          <p className="text-xs text-light-on-surface-variant mt-1">7 seats available</p>
        </div>
        <div className="p-gutter-lg rounded bg-light-surface-container-lowest border border-light-outline-variant">
          <p className="font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Org admins</p>
          <p className="font-headline text-headline-md text-light-on-surface tabular-nums mt-1 font-bold">2</p>
          <p className="text-xs text-light-on-surface-variant mt-1">Full privileged access</p>
        </div>
        <div className="p-gutter-lg rounded bg-light-surface-container-lowest border border-light-outline-variant">
          <p className="font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Authentication</p>
          <p className="font-headline text-headline-md text-light-on-surface mt-1 font-bold">Okta SAML 2.0</p>
          <p className="text-xs text-status-done font-medium mt-1">Enforced with PKCE</p>
        </div>
        <div className="p-gutter-lg rounded bg-light-surface-container-lowest border border-light-outline-variant">
          <p className="font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Database Latency</p>
          <p className="font-headline text-headline-md text-status-done tabular-nums mt-1 font-bold">&lt; 3.2 ms</p>
          <p className="text-xs text-light-on-surface-variant mt-1">Local-first ₹0 cost</p>
        </div>
      </section>

      {/* Members & Role Assignment Table */}
      <section aria-label="Organization members" className="rounded bg-light-surface-container-lowest border border-light-outline-variant overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[660px]">
          <thead>
            <tr className="border-b border-light-outline-variant bg-light-surface-container-low">
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Member</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Email</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Role</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Status</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Last active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-outline-variant">
            {members.map((m) => (
              <tr key={m.id} className="hover:bg-light-surface-container-low/40 transition-colors">
                <td className="px-gutter-lg py-gutter-md">
                  <div className="flex items-center gap-gutter-sm">
                    <img
                      src={m.avatar}
                      alt={m.name}
                      className="w-7 h-7 rounded-full object-cover border border-light-outline-variant"
                    />
                    <span className="font-title text-title-sm text-light-on-surface font-semibold">{m.name}</span>
                  </div>
                </td>
                <td className="px-gutter-lg py-gutter-md font-body text-body-sm text-light-on-surface-variant">
                  {m.email}
                </td>
                <td className="px-gutter-lg py-gutter-md">
                  <select
                    aria-label={`Role for ${m.name}`}
                    value={m.role}
                    onChange={(e) => handleRoleChange(m.id, e.target.value)}
                    className="rounded-sm bg-light-surface-container-low border border-light-outline-variant font-label text-label-md text-light-on-surface py-1 px-2 focus:outline-none focus:border-light-primary"
                  >
                    <option value="Org Admin">Org Admin</option>
                    <option value="Project Admin">Project Admin</option>
                    <option value="Member">Member</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </td>
                <td className="px-gutter-lg py-gutter-md">
                  <span className="px-gutter-sm py-0.5 rounded-sm bg-status-done-bg text-light-on-surface font-label text-label-sm uppercase font-semibold">
                    {m.status}
                  </span>
                </td>
                <td className="px-gutter-lg py-gutter-md font-body text-body-sm text-light-on-surface-variant">
                  {m.lastActive}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-light-surface-container-lowest border border-light-outline-variant shadow-xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-title-lg text-light-on-surface font-semibold">Invite squad member</h2>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-light-on-surface-variant hover:text-light-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <form onSubmit={handleInviteSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-light-on-surface-variant uppercase mb-1">Work email</label>
                <input
                  type="email"
                  required
                  placeholder="name@acme.dev"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-sm bg-light-surface-container-low border border-light-outline-variant text-sm text-light-on-surface focus:outline-none focus:border-light-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-light-on-surface-variant uppercase mb-1">Assign role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-sm bg-light-surface-container-low border border-light-outline-variant text-sm text-light-on-surface focus:outline-none focus:border-light-primary"
                >
                  <option value="Org Admin">Org Admin</option>
                  <option value="Project Admin">Project Admin</option>
                  <option value="Member">Member</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-3 py-1.5 rounded-sm text-sm text-light-on-surface-variant hover:bg-light-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-sm bg-light-primary text-white text-sm font-medium hover:bg-light-primary-container"
                >
                  Send invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
