'use client';

import { useState } from 'react';
import { Users, Plus, Shield, Award, Mail, Calendar, CheckCircle2, UserCheck } from 'lucide-react';

export default function TeamView({
  users,
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

    await onAddUser({
      name: name.trim(),
      email: email.trim(),
      role: role.trim(),
      capacity_points: Number(capacity),
    });

    setName('');
    setEmail('');
    setIsAddOpen(false);
  };

  const totalSquadCapacity = users.reduce((sum, u) => sum + (Number(u.capacity_points) || 0), 0);

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-6xl mx-auto w-full space-y-6">
      {/* Top Banner & Capacity Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#121215] border border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Users className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">Squad Roster & Capacity Planning</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {users.length} Active Members
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Define squad roles, assignees, and sprint point capacity benchmarks based on available focus hours.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-right font-mono">
            <span className="text-[10px] text-zinc-400 block uppercase">Total Squad Velocity Capacity</span>
            <span className="text-base font-bold text-blue-400">{totalSquadCapacity} pts / sprint</span>
          </div>

          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((member) => (
          <div
            key={member.id}
            className="p-4 rounded-xl bg-[#121215] border border-white/10 hover:border-white/20 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-sm text-blue-300">
                  {member.avatar_initials}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-zinc-100">{member.name}</h4>
                  <p className="text-[11px] text-zinc-400">{member.role}</p>
                </div>
              </div>

              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-zinc-300">
                {member.capacity_points} pts
              </span>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-zinc-400" />
                <span className="font-mono text-[10px] text-zinc-400 truncate max-w-[170px]">
                  {member.email}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121215] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-150">
            <div className="p-4 border-b border-white/10 bg-zinc-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-zinc-100">Add Squad Member</h3>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-xs text-zinc-400 hover:text-zinc-200"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Malhotra"
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. vikram.m@apex.agile"
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Agile Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 text-zinc-200 text-xs rounded-lg p-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="Senior Software Engineer">Senior Software Engineer</option>
                  <option value="Staff Software Engineer">Staff Software Engineer</option>
                  <option value="Scrum Master">Scrum Master</option>
                  <option value="Product Owner">Product Owner</option>
                  <option value="QA & Test Automation Lead">QA & Test Automation Lead</option>
                  <option value="DevOps & Cloud Architect">DevOps & Cloud Architect</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">
                  Sprint Capacity (Points / 10-day sprint)
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-sm"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
