'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  UserPlus, 
  LogIn, 
  ShieldCheck, 
  Mail, 
  User, 
  Sparkles, 
  Briefcase,
  Zap,
  ArrowRight
} from 'lucide-react';
import Avatar from './Avatar';
import ApexLogo from './ApexLogo';
import { toast } from 'sonner';

export default function LoginModal({
  users = [],
  currentUser,
  onSelectUser,
  onUserCreated,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState('personas'); // 'personas' | 'signup'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('Senior Scrum Master / Delivery Lead');
  const [capacity, setCapacity] = useState('10');
  const [submitting, setSubmitting] = useState(false);

  const roles = [
    { id: 'sm', title: 'Senior Scrum Master / Delivery Lead', badge: 'SAFe 6.0 / CSM', cap: 10 },
    { id: 'po', title: 'Product Owner / Principal Architect', badge: 'Scope & Epics', cap: 10 },
    { id: 'dev', title: 'Staff Frontend Engineer', badge: 'Feature Execution', cap: 8 },
    { id: 'qa', title: 'QA & Telemetry Specialist', badge: 'Canary & Testing', cap: 8 },
    { id: 'sre', title: 'SRE & Platform Architect', badge: 'Cloud & Pods', cap: 8 },
    { id: 'exec', title: 'Executive Stakeholder', badge: 'Read-only Telemetry', cap: 5 },
  ];

  const handleSelectPersona = (user) => {
    if (onSelectUser) {
      onSelectUser(user);
      toast.success(`Logged in as ${user.name}`, {
        description: `Role: ${user.role} · ${user.capacity_points || 8} SP Capacity`
      });
    }
    onClose();
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error('Please enter both name and email');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signup',
          name: fullName.trim(),
          email: email.trim(),
          role: selectedRole,
          capacity_points: Number(capacity) || 8,
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        toast.success(`Welcome to Apex Agile, ${data.user.name}!`, {
          description: `Registered as ${data.user.role}`
        });
        if (onUserCreated) {
          onUserCreated(data.user);
        }
        if (onSelectUser) {
          onSelectUser(data.user);
        }
        onClose();
      } else {
        toast.error(data.error || 'Failed to create user account');
      }
    } catch (err) {
      console.error('Sign up error:', err);
      toast.error('Error creating user profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="w-full max-w-lg rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col gap-5 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <ApexLogo size={32} />
          <div>
            <h2 className="font-headline text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Apex Agile
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Squad Identity
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Role-based delivery permissions, ceremony rights &amp; capacity modeling
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setActiveTab('personas')}
            className={`py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'personas'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Quick Persona Login</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('signup')}
            className={`py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'signup'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create New Profile</span>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'personas' ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-slate-500">
              Select any squad member below to test their view and permissions:
            </p>
            <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
              {users.map((u) => {
                const isSelected = currentUser?.id === u.id || (!currentUser && u.id === 'usr-balaji');
                return (
                  <button
                    key={u.id}
                    onClick={() => handleSelectPersona(u)}
                    type="button"
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={u.name} size="md" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {u.name}
                          </p>
                          {u.name.includes('Balaji') && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                              Active Lead
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {u.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] tabular-nums font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {u.capacity_points || 8} SP
                      </span>
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSignUp} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.morgan@company.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Squad Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => {
                    setSelectedRole(e.target.value);
                    const matched = roles.find(r => r.title === e.target.value);
                    if (matched) setCapacity(String(matched.cap));
                  }}
                  className="w-full px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.title}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Sprint Capacity (SP)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 tabular-nums"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:opacity-90 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {submitting ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create Profile &amp; Join Platform Core</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
