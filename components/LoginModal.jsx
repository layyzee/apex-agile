'use client';

import { useState } from 'react';

const AVATARS = {
  'Elena Rostova': 'https://lh3.googleusercontent.com/aida/ALJJyrDT0ygT73l1oUoLN-ldq4D7iK67gQRn2Jk7sBkqg00OyGKoqWQZmoRgvpSJ9yBujVKEsKamItF_rzwvRR9GvaIUS4xjNTiLupFexLBJ7GFYZdSJkyY5uCqQXPuCpnXXcN3cZl0SjBUXkf08AfWbQLcqKuuD5bWUTUaMgsKPLsXBFH58TvdsBeHggVY-ycBQeeRkHLak_R1Bx4dYrDhktkSi7Y1mbVHmwnKtJZuZJfFUTrMrLQNe',
  'Marcus Vance': 'https://lh3.googleusercontent.com/aida/ALJJyrDgKx4jLzMiXGShOOaAzLOjwe-zDqHHXWBB1EKN99ni4lK8OMMkRiG-_xTTRI7voe3_3HfhmuaPa5-6F_6xJ4jLmz7pBtBqo4WWmFsxDVbWJC_K4-hU1FtU8r_-lAvFTzWcpMVWSnbVsdLHaUUaLN35F1HkIRAKQNdISHkxepLOraNDp84np6OnjPQaRH6GBuDuhRAIfTTnSiJ6_WcsbFEJJAkaKaLCGpruOK8dxOBzLEGjhYYpXw',
  'Priya Nair': 'https://lh3.googleusercontent.com/aida/ALJJyrCklGpvdGYSopZxSSrRrPtkBdl957Q7Ogz3uX4fzie9G6mTQH6uP4Ci9ogj6r8yyxr5FSklMt7HTI9LHmOQx-1AJAW00HC-R94bmNKCEc1e-aUownDKA7Pw9u-0SzqwGKOMXci_2P53ra7QQllboBJxCniFDjxsHLcxZZzShy3IZKKuPnALJYUM8lxbC3lHfz-oLxtUKoE_SWLs1a7Uj3mETCnd6AwoJglU90DUhLV8p3Jl2FT6',
  'Kenji Sato': 'https://lh3.googleusercontent.com/aida/ALJJyrBLdMi5794naAeeCGG9DPABynyRt6Kim8iD-BJ15u6KvCSy_z-bZ0rWPW2JTpGksViGt4Yhc8-g9QJ2O4mGtC7-aSzx_oMVSgOebe-dPhF6N6c_UQfVmFAqtxO6uiBV29EU8xE7bMFUcK8xvF2msv3T8RMNnRxl_QVBhXA_LavlWbFf1jFPvTN4LuPBqMy4W0pO5UpgwlOHIyzGiTZTEFovVZW8yWTboQYzKXGMJ4Gt6YcDFOE',
};

export default function LoginModal({
  users = [],
  currentUser,
  onSelectUser,
  onClose,
}) {
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('elena.rostova@acme.dev');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [workspace, setWorkspace] = useState('platform-core.atlassian.net');

  const handleSubmit = (e) => {
    e.preventDefault();
    const matchedUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || users[0];
    if (matchedUser && onSelectUser) {
      onSelectUser(matchedUser);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 select-none">
      <div className="w-full max-w-md rounded-lg bg-light-surface-container-lowest border border-light-outline-variant shadow-xl p-gutter-xl flex flex-col gap-gutter-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-7 h-7 flex items-center justify-center text-light-on-surface-variant hover:text-light-on-surface"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Brand Mark */}
        <div className="flex items-center justify-center gap-gutter-sm">
          <div className="w-9 h-9 rounded-sm bg-light-primary-container flex items-center justify-center text-light-on-primary">
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              deployed_code
            </span>
          </div>
          <span className="font-headline text-headline-md text-light-on-surface tracking-tight font-bold">
            Atlassian Jira
          </span>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-gutter-xs p-1 rounded-sm bg-light-surface-container-low border border-light-outline-variant">
          <button
            type="button"
            onClick={() => setAuthMode('signin')}
            className={`py-1.5 rounded-sm font-label text-label-md transition-colors ${
              authMode === 'signin'
                ? 'bg-light-surface-container-lowest text-light-primary shadow-sm font-semibold'
                : 'text-light-on-surface-variant'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`py-1.5 rounded-sm font-label text-label-md transition-colors ${
              authMode === 'signup'
                ? 'bg-light-surface-container-lowest text-light-primary shadow-sm font-semibold'
                : 'text-light-on-surface-variant'
            }`}
          >
            Create account
          </button>
        </div>

        <header className="flex flex-col gap-gutter-xs text-center">
          <h1 className="font-headline text-headline-sm text-light-on-surface font-semibold">
            {authMode === 'signin' ? 'Log in to continue' : 'Create your workspace account'}
          </h1>
          <p className="font-body text-body-sm text-light-on-surface-variant">
            Access Platform Core and IT Service Desk workspaces
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-gutter-md">
          {authMode === 'signup' && (
            <>
              <div className="flex flex-col gap-gutter-xs">
                <label className="font-label text-label-md text-light-on-surface">Full name</label>
                <input
                  type="text"
                  placeholder="Elena Rostova"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-sm bg-light-surface-container-lowest border border-light-outline-variant font-body text-body-md text-light-on-surface px-3 py-1.5 focus:border-light-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-gutter-xs">
                <label className="font-label text-label-md text-light-on-surface">Site URL</label>
                <input
                  type="text"
                  placeholder="platform-core.atlassian.net"
                  value={workspace}
                  onChange={(e) => setWorkspace(e.target.value)}
                  className="rounded-sm bg-light-surface-container-lowest border border-light-outline-variant font-mono text-mono-md text-light-on-surface px-3 py-1.5 focus:border-light-primary focus:outline-none"
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-gutter-xs">
            <label className="font-label text-label-md text-light-on-surface">Work email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-sm bg-light-surface-container-lowest border border-light-outline-variant font-body text-body-md text-light-on-surface px-3 py-1.5 focus:border-light-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-gutter-xs">
            <div className="flex items-center justify-between">
              <label className="font-label text-label-md text-light-on-surface">Password</label>
              <a href="#" className="font-label text-label-sm text-light-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 rounded-sm bg-light-surface-container-lowest border border-light-outline-variant font-body text-body-md text-light-on-surface px-3 py-1.5 focus:border-light-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 text-light-on-surface-variant hover:text-light-on-surface flex items-center"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center py-2 rounded-sm bg-light-primary text-light-on-primary hover:bg-light-primary-container transition-colors font-label text-label-lg mt-gutter-xs cursor-pointer"
          >
            {authMode === 'signin' ? 'Sign in to Jira' : 'Continue'}
          </button>
        </form>

        <div className="flex items-center gap-gutter-md">
          <div className="flex-1 h-px bg-light-outline-variant" />
          <span className="font-label text-label-sm text-light-on-surface-variant uppercase">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-light-outline-variant" />
        </div>

        {/* SAML SSO Button */}
        <button
          onClick={handleSubmit}
          type="button"
          className="w-full py-2 px-gutter-md rounded-sm bg-light-surface-container-lowest border border-light-outline-variant hover:bg-light-surface-container-low flex items-center justify-center gap-gutter-sm font-label text-label-md text-light-on-surface transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-light-primary">passkey</span>
          <span>Continue with SAML SSO (Okta)</span>
        </button>

        {/* Quick Squad Persona Switcher */}
        <div className="pt-gutter-sm border-t border-light-outline-variant flex flex-col gap-2">
          <span className="text-xs font-semibold text-light-on-surface-variant uppercase">
            Quick persona switch (testing):
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {users.map((u) => {
              const avatar = AVATARS[u.name] || AVATARS['Elena Rostova'];
              const isSelected = currentUser?.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    if (onSelectUser) onSelectUser(u);
                    onClose();
                  }}
                  className={`flex items-center gap-2 p-1.5 rounded-sm border text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-status-progress-bg border-light-primary'
                      : 'border-light-outline-variant hover:bg-light-surface-container-low'
                  }`}
                >
                  <img src={avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
                  <span className="text-xs truncate text-light-on-surface">{u.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
