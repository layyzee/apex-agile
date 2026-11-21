'use client';

import { X, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';

export default function LoginModal({
  users,
  currentUser,
  onSelectUser,
  onClose,
}) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#121215] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-150">
        <div className="p-4 border-b border-white/10 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-zinc-100">Switch User Persona / Login</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2">
          <p className="text-xs text-zinc-400 mb-3">
            Select an authenticated team persona to test role-specific workflows:
          </p>

          <div className="space-y-1.5 max-h-80 overflow-y-auto">
            {users.map((u) => {
              const isSelected = currentUser?.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => {
                    onSelectUser(u);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500/50 ring-1 ring-blue-500/30'
                      : 'bg-zinc-900/60 border-white/5 hover:border-white/20 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-xs text-blue-300">
                      {u.avatar_initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-zinc-100">{u.name}</h4>
                      <p className="text-[11px] text-zinc-400">{u.role}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
