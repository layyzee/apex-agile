'use client';

import { useState } from 'react';
import { X, Plus, Users, Check } from 'lucide-react';
import Avatar from './Avatar';

const AVATAR_MAP = {
  'Elena Rostova': 'https://lh3.googleusercontent.com/aida/ALJJyrDT0ygT73l1oUoLN-ldq4D7iK67gQRn2Jk7sBkqg00OyGKoqWQZmoRgvpSJ9yBujVKEsKamItF_rzwvRR9GvaIUS4xjNTiLupFexLBJ7GFYZdSJkyY5uCqQXPuCpnXXcN3cZl0SjBUXkf08AfWbQLcqKuuD5bWUTUaMgsKPLsXBFH58TvdsBeHggVY-ycBQeeRkHLak_R1Bx4dYrDhktkSi7Y1mbVHmwnKtJZuZJfFUTrMrLQNe',
  'Marcus Vance': 'https://lh3.googleusercontent.com/aida/ALJJyrDgKx4jLzMiXGShOOaAzLOjwe-zDqHHXWBB1EKN99ni4lK8OMMkRiG-_xTTRI7voe3_3HfhmuaPa5-6F_6xJ4jLmz7pBtBqo4WWmFsxDVbWJC_K4-hU1FtU8r_-lAvFTzWcpMVWSnbVsdLHaUUaLN35F1HkIRAKQNdISHkxepLOraNDp84np6OnjPQaRH6GBuDuhRAIfTTnSiJ6_WcsbFEJJAkaKaLCGpruOK8dxOBzLEGjhYYpXw',
  'Priya Nair': 'https://lh3.googleusercontent.com/aida/ALJJyrCklGpvdGYSopZxSSrRrPtkBdl957Q7Ogz3uX4fzie9G6mTQH6uP4Ci9ogj6r8yyxr5FSklMt7HTI9LHmOQx-1AJAW00HC-R94bmNKCEc1e-aUownDKA7Pw9u-0SzqwGKOMXci_2P53ra7QQllboBJxCniFDjxsHLcxZZzShy3IZKKuPnALJYUM8lxbC3lHfz-oLxtUKoE_SWLs1a7Uj3mETCnd6AwoJglU90DUhLV8p3Jl2FT6',
  'Kenji Sato': 'https://lh3.googleusercontent.com/aida/ALJJyrBLdMi5794naAeeCGG9DPABynyRt6Kim8iD-BJ15u6KvCSy_z-bZ0rWPW2JTpGksViGt4Yhc8-g9QJ2O4mGtC7-aSzx_oMVSgOebe-dPhF6N6c_UQfVmFAqtxO6uiBV29EU8xE7bMFUcK8xvF2msv3T8RMNnRxl_QVBhXA_LavlWbFf1jFPvTN4LuPBqMy4W0pO5UpgwlOHIyzGiTZTEFovVZW8yWTboQYzKXGMJ4Gt6YcDFOE',
};

export default function TeamView({
  users = [],
  onAddUser,
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Senior Software Engineer');
  const [capacity, setCapacity] = useState(8);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (onAddUser) {
      await onAddUser({
        name: name.trim(),
        email: email.trim(),
        role: role.trim(),
        capacity_points: Number(capacity),
      });
    }

    setName('');
    setEmail('');
    setIsAddOpen(false);
  };

  const totalCapacity = users.reduce((sum, u) => sum + (Number(u.capacity_points) || 0), 0);

  return (
    <div className="flex-1 min-w-0 p-gutter-xl flex flex-col gap-gutter-xl select-none">
      {/* Header & Capacity */}
      <div className="flex flex-wrap items-center justify-between gap-gutter-md">
        <div>
          <h1 className="font-headline text-headline-lg text-light-on-surface font-semibold tracking-tight">
            Squad Roster &amp; Capacity
          </h1>
          <p className="font-body text-body-sm text-light-on-surface-variant">
            Cross-functional team members, velocity capacity, and role assignments
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-sm bg-light-surface-container-low border border-light-outline-variant font-mono text-xs">
            <span className="text-light-on-surface-variant uppercase mr-2">Total Capacity:</span>
            <span className="font-bold text-light-primary tabular-nums">{totalCapacity} pts / sprint</span>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            type="button"
            className="inline-flex items-center justify-center px-gutter-md py-1.5 rounded-sm bg-light-primary text-light-on-primary hover:bg-light-primary-container font-label text-label-lg transition-colors cursor-pointer"
          >
            Add member
          </button>
        </div>
      </div>

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-lg">
        {users.map((u) => {
          const avatarUrl = AVATAR_MAP[u.name] || 'https://lh3.googleusercontent.com/aida/ALJJyrDT0ygT73l1oUoLN-ldq4D7iK67gQRn2Jk7sBkqg00OyGKoqWQZmoRgvpSJ9yBujVKEsKamItF_rzwvRR9GvaIUS4xjNTiLupFexLBJ7GFYZdSJkyY5uCqQXPuCpnXXcN3cZl0SjBUXkf08AfWbQLcqKuuD5bWUTUaMgsKPLsXBFH58TvdsBeHggVY-ycBQeeRkHLak_R1Bx4dYrDhktkSi7Y1mbVHmwnKtJZuZJfFUTrMrLQNe';
          return (
            <div
              key={u.id}
              className="p-gutter-lg rounded bg-light-surface-container-lowest border border-light-outline-variant flex flex-col gap-gutter-md"
            >
              <div className="flex items-center gap-3">
                <Avatar name={u.name} size="lg" />
                <div className="min-w-0">
                  <h3 className="font-title text-title-md text-light-on-surface font-semibold truncate">
                    {u.name}
                  </h3>
                  <p className="font-body text-body-sm text-light-on-surface-variant truncate">
                    {u.email}
                  </p>
                </div>
              </div>

              <div className="pt-gutter-sm border-t border-light-outline-variant flex items-center justify-between text-xs">
                <span className="font-label text-light-on-surface-variant">{u.role || 'Engineer'}</span>
                <span className="font-mono font-bold text-light-primary tabular-nums">
                  {u.capacity_points || 8} pts
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-light-surface-container-lowest border border-light-outline-variant shadow-xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline text-title-lg text-light-on-surface font-semibold">Add squad member</h2>
              <button
                onClick={() => setIsAddOpen(false)}
                className="w-7 h-7 flex items-center justify-center text-light-on-surface-variant hover:text-light-on-surface"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-light-on-surface-variant uppercase mb-1">Full name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-sm bg-light-surface-container-low border border-light-outline-variant text-sm text-light-on-surface focus:outline-none focus:border-light-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-light-on-surface-variant uppercase mb-1">Work email</label>
                <input
                  type="email"
                  required
                  placeholder="alex.chen@acme.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-sm bg-light-surface-container-low border border-light-outline-variant text-sm text-light-on-surface focus:outline-none focus:border-light-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-light-on-surface-variant uppercase mb-1">Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-sm bg-light-surface-container-low border border-light-outline-variant text-sm text-light-on-surface focus:outline-none focus:border-light-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-light-on-surface-variant uppercase mb-1">Capacity points</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-sm bg-light-surface-container-low border border-light-outline-variant text-sm text-light-on-surface focus:outline-none focus:border-light-primary"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 rounded-sm text-sm text-light-on-surface-variant hover:bg-light-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-sm bg-light-primary text-white text-sm font-medium hover:bg-light-primary-container"
                >
                  Add member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
