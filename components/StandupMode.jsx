'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Users, 
  ArrowRight, 
  ShieldAlert, 
  ArrowLeft,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  Flame
} from 'lucide-react';
import ApexLogo from '@/components/ApexLogo';

export default function StandupMode({
  isOpen,
  onClose,
  users = [],
  issues = [],
  states = [],
  activeSprint,
  onUpdateIssueStatus,
  onToggleBlocker,
}) {
  if (!isOpen) return null;

  // View Mode: 'squad' (by person) | 'rtl' (Right-to-Left by column)
  const [standupMode, setStandupMode] = useState('squad');

  // Speaker Timer state (default 60 seconds per person)
  const DEFAULT_SECONDS = 60;
  const [activeUserIndex, setActiveUserIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedUsers, setCompletedUsers] = useState(new Set());

  // RTL Column Index: starts at Done (last column) and moves left to In Progress
  const [rtlColumnIndex, setRtlColumnIndex] = useState(0);

  // Quick Blocker Modal State
  const [blockerModalIssue, setBlockerModalIssue] = useState(null);
  const [blockerReasonInput, setBlockerReasonInput] = useState('');

  // Audio Chime synthesizer using native Web Audio API (Zero external assets, zero cost)
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Audio context blocked by browser gesture policy
    }
  };

  // Timer Tick
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      playChime();
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, soundEnabled]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (blockerModalIssue) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsTimerRunning((prev) => !prev);
      } else if (e.key === 'ArrowRight' || e.key === 'n') {
        e.preventDefault();
        handleNextSpeaker();
      } else if (e.key === 'ArrowLeft' || e.key === 'p') {
        e.preventDefault();
        handlePrevSpeaker();
      } else if (e.key === 'r') {
        e.preventDefault();
        handleResetTimer();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeUserIndex, standupMode, rtlColumnIndex, blockerModalIssue, users]);

  const activeUser = users[activeUserIndex] || users[0];

  // Advance Speaker
  const handleNextSpeaker = () => {
    if (standupMode === 'squad') {
      setCompletedUsers((prev) => new Set(prev).add(activeUser?.id));
      if (activeUserIndex < users.length - 1) {
        setActiveUserIndex((prev) => prev + 1);
        setTimeLeft(DEFAULT_SECONDS);
        setIsTimerRunning(true);
      }
    } else {
      if (rtlColumnIndex < sortedStatesRTL.length - 1) {
        setRtlColumnIndex((prev) => prev + 1);
      }
    }
  };

  const handlePrevSpeaker = () => {
    if (standupMode === 'squad') {
      if (activeUserIndex > 0) {
        setActiveUserIndex((prev) => prev - 1);
        setTimeLeft(DEFAULT_SECONDS);
        setIsTimerRunning(true);
      }
    } else {
      if (rtlColumnIndex > 0) {
        setRtlColumnIndex((prev) => prev - 1);
      }
    }
  };

  const handleResetTimer = () => {
    setTimeLeft(DEFAULT_SECONDS);
    setIsTimerRunning(true);
  };

  // Find next status to advance ticket
  const getNextState = (currentStatusId) => {
    const currentIndex = states.findIndex((s) => s.id === currentStatusId);
    if (currentIndex >= 0 && currentIndex < states.length - 1) {
      return states[currentIndex + 1];
    }
    return null;
  };

  // Right to left sorted states: Done -> QA -> Review -> In Progress -> To Do
  const sortedStatesRTL = [...states].sort((a, b) => b.position - a.position);
  const currentRtlState = sortedStatesRTL[rtlColumnIndex];

  // Active tickets for the active speaker
  const speakerIssues = issues.filter((i) => {
    const assigneeMatch = (i.assignee || '').toLowerCase().includes((activeUser?.name || '').toLowerCase());
    return assigneeMatch;
  });

  // All active blockers in sprint
  const blockedIssues = issues.filter((i) => i.is_blocked === 1);

  // Timer format (mm:ss)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const timerPct = Math.round(((DEFAULT_SECONDS - timeLeft) / DEFAULT_SECONDS) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-[#09090b]/98 backdrop-blur-2xl flex flex-col text-zinc-100 select-none animate-in fade-in duration-200">
      {/* 1. Top Scrum Master HUD Header */}
      <header className="px-6 py-3 border-b border-white/[0.08] bg-[#0c0c0e] flex items-center justify-between gap-4">
        {/* Brand & Sprint Status */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600/15 border border-blue-500/25 flex items-center justify-center shrink-0">
            <ApexLogo size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-xs tracking-tight text-zinc-100">
                Daily Standup Mode
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Walk-the-Board
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 block font-mono">
              {activeSprint?.name || 'Sprint 24.1'} • 15-Minute Delivery Alignment
            </span>
          </div>
        </div>

        {/* Center: Walk-the-Board Mode Toggle */}
        <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-white/[0.07] text-xs">
          <button
            onClick={() => setStandupMode('squad')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              standupMode === 'squad'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/[0.08]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Squad Walk</span>
          </button>
          <button
            onClick={() => setStandupMode('rtl')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              standupMode === 'rtl'
                ? 'bg-zinc-800 text-white shadow-sm border border-white/[0.08]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
            <span>Right-to-Left Flow</span>
          </button>
        </div>

        {/* Right: Speaker Timer & Controls */}
        <div className="flex items-center gap-3">
          {/* Active 60s Timer Pill */}
          <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition-all ${
            timeLeft <= 10 
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-300 animate-pulse' 
              : 'bg-zinc-900 border-white/[0.08] text-zinc-200'
          }`}>
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-mono text-xs font-bold tracking-wider">
              {formatTime(timeLeft)}
            </span>
            <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  timeLeft <= 10 ? 'bg-rose-500' : 'bg-blue-500'
                }`}
                style={{ width: `${timerPct}%` }}
              />
            </div>
          </div>

          {/* Timer Play/Pause/Reset */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsTimerRunning((prev) => !prev)}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/[0.06] text-zinc-300 hover:text-white transition-colors"
              title="Pause/Play Timer (Space)"
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
            <button
              onClick={handleResetTimer}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/[0.06] text-zinc-300 hover:text-white transition-colors"
              title="Reset Timer (R)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/[0.06] text-zinc-400 hover:text-zinc-200 transition-colors"
              title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Close Zen Mode */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/[0.08] text-zinc-400 hover:text-zinc-200 transition-colors ml-2"
            title="Exit Standup Mode (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Top Squad Speaker Queue (in Squad Walk mode) */}
      {standupMode === 'squad' && (
        <div className="px-6 py-2.5 bg-[#0c0c0e] border-b border-white/[0.05] flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] uppercase font-mono font-bold text-zinc-500 tracking-wider shrink-0">
              Roster:
            </span>
            <div className="flex items-center gap-1.5">
              {users.map((u, idx) => {
                const isActive = idx === activeUserIndex;
                const isDone = completedUsers.has(u.id);
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      setActiveUserIndex(idx);
                      setTimeLeft(DEFAULT_SECONDS);
                      setIsTimerRunning(true);
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-medium shadow-sm shadow-blue-600/30 ring-1 ring-blue-400/50'
                        : isDone
                        ? 'bg-zinc-900/60 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-white/[0.04]'
                    }`}
                  >
                    <span className="font-mono text-[10px] w-4 h-4 rounded-full bg-black/20 flex items-center justify-center font-bold">
                      {u.avatar_initials || u.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span className="truncate max-w-[100px]">{u.name.split(' ')[0]}</span>
                    {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrevSpeaker}
              disabled={activeUserIndex === 0}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/[0.06] text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Prev</span>
            </button>
            <button
              onClick={handleNextSpeaker}
              disabled={activeUserIndex === users.length - 1}
              className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-xs text-white font-medium shadow-sm transition-all"
            >
              <span>Next Speaker</span>
              <SkipForward className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Standup Stage */}
      <div className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Speaker Work or RTL Column Focus */}
        <div className="lg:col-span-2 space-y-4">
          {standupMode === 'squad' ? (
            /* Squad Speaker Focus Card */
            <div className="space-y-4">
              {/* Speaker Profile Hero */}
              <div className="p-4 rounded-xl bg-[#111114] border border-white/[0.08] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-sm text-blue-300 shrink-0">
                    {activeUser?.avatar_initials || 'DEV'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-zinc-100">{activeUser?.name}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/[0.05]">
                        {activeUser?.role}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400">
                      Speaking Now • {speakerIssues.length} assigned tickets in {activeSprint?.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div className="px-2.5 py-1 rounded bg-zinc-900 border border-white/[0.06] text-zinc-400 font-mono text-[11px]">
                    {speakerIssues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0)} story pts
                  </div>
                </div>
              </div>

              {/* Speaker's Active Sprint Issues */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                    Current Work Focus:
                  </span>
                  <span>{speakerIssues.length} issues</span>
                </div>

                {speakerIssues.length === 0 ? (
                  <div className="p-8 text-center rounded-xl border border-dashed border-white/[0.06] bg-[#0d0d10]">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                    <h4 className="text-xs font-medium text-zinc-300">No active tickets assigned</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Ready to pull work from backlog or pair with teammates.</p>
                  </div>
                ) : (
                  speakerIssues.map((iss) => {
                    const stateObj = states.find((s) => s.id === iss.status_id);
                    const nextState = getNextState(iss.status_id);

                    return (
                      <div
                        key={iss.id}
                        className={`p-4 rounded-xl border transition-all ${
                          iss.is_blocked === 1
                            ? 'bg-rose-950/20 border-rose-500/40 shadow-sm shadow-rose-950/20'
                            : stateObj?.category === 'done'
                            ? 'bg-[#101014]/60 border-emerald-500/20 opacity-80'
                            : 'bg-[#111114] border-white/[0.07] hover:border-white/[0.14]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-[11px] font-bold text-blue-400">
                                {iss.key}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-white/[0.05]">
                                {stateObj?.name || 'In Progress'}
                              </span>
                              <span className="font-mono text-[10px] text-zinc-500">
                                {iss.story_points || 0} pts
                              </span>
                              {iss.is_blocked === 1 && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 font-semibold">
                                  <ShieldAlert className="w-3 h-3" />
                                  BLOCKED
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-medium text-zinc-200 leading-snug">
                              {iss.title}
                            </h4>
                          </div>

                          {/* Action Buttons for Standup */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Blocker Toggle */}
                            <button
                              onClick={() => {
                                if (iss.is_blocked === 1) {
                                  onToggleBlocker(iss.id, false, '');
                                } else {
                                  setBlockerModalIssue(iss);
                                  setBlockerReasonInput('');
                                }
                              }}
                              className={`px-2 py-1 rounded text-[11px] font-mono transition-colors flex items-center gap-1 ${
                                iss.is_blocked === 1
                                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                                  : 'bg-zinc-800 hover:bg-rose-950/50 text-zinc-400 hover:text-rose-300 border border-white/[0.05]'
                              }`}
                              title={iss.is_blocked === 1 ? 'Clear Blocker' : 'Flag Blocker'}
                            >
                              <ShieldAlert className="w-3 h-3" />
                              <span>{iss.is_blocked === 1 ? 'Resolve' : 'Flag'}</span>
                            </button>

                            {/* Advance Status Button */}
                            {nextState && (
                              <button
                                onClick={() => onUpdateIssueStatus(iss.id, nextState.id)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 hover:border-blue-500 text-blue-300 hover:text-white text-[11px] font-medium transition-all"
                                title={`Advance ticket to ${nextState.name}`}
                              >
                                <span>Advance to {nextState.name}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Blocker Callout if active */}
                        {iss.is_blocked === 1 && iss.blocked_reason && (
                          <div className="mt-2.5 p-2 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs font-mono">
                            <span className="font-bold">🚨 Blocker:</span> {iss.blocked_reason}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            /* RTL Walk-the-Board Focus Mode */
            <div className="space-y-4">
              {/* RTL Progress Stepper Header */}
              <div className="p-4 rounded-xl bg-[#111114] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">
                      Right-to-Left Walk:
                    </span>
                    <h3 className="font-semibold text-sm text-zinc-100">
                      Step {rtlColumnIndex + 1} of {sortedStatesRTL.length}: Focus on "{currentRtlState?.name}"
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      onClick={handlePrevSpeaker}
                      disabled={rtlColumnIndex === 0}
                      className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/[0.06] text-zinc-400 hover:text-zinc-200 disabled:opacity-40"
                    >
                      Prev Stage
                    </button>
                    <button
                      onClick={handleNextSpeaker}
                      disabled={rtlColumnIndex === sortedStatesRTL.length - 1}
                      className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium"
                    >
                      Next Stage
                    </button>
                  </div>
                </div>

                {/* Visual Pipeline Bar */}
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-mono">
                  {sortedStatesRTL.map((st, i) => {
                    const isCurrent = i === rtlColumnIndex;
                    const isPassed = i < rtlColumnIndex;
                    return (
                      <div
                        key={st.id}
                        className={`p-1.5 rounded transition-all truncate ${
                          isCurrent
                            ? 'bg-blue-600 text-white font-bold ring-1 ring-blue-400'
                            : isPassed
                            ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/20'
                            : 'bg-zinc-900 text-zinc-500 border border-white/[0.04]'
                        }`}
                      >
                        {st.name}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Issues in Current RTL Column */}
              <div className="space-y-2.5">
                {issues.filter((i) => i.status_id === currentRtlState?.id).length === 0 ? (
                  <div className="p-8 text-center rounded-xl border border-dashed border-white/[0.06] bg-[#0d0d10]">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                    <h4 className="text-xs font-medium text-zinc-300">No tickets in {currentRtlState?.name}</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Pipeline is clear. Advance to unblock prior columns.</p>
                  </div>
                ) : (
                  issues
                    .filter((i) => i.status_id === currentRtlState?.id)
                    .map((iss) => {
                      const nextState = getNextState(iss.status_id);
                      return (
                        <div
                          key={iss.id}
                          className="p-4 rounded-xl bg-[#111114] border border-white/[0.07] hover:border-white/[0.14] space-y-2"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-bold text-blue-400">{iss.key}</span>
                                <span className="font-mono text-[10px] text-zinc-400">{iss.assignee}</span>
                                <span className="font-mono text-[10px] text-zinc-500">• {iss.story_points || 0} pts</span>
                              </div>
                              <h4 className="text-xs font-medium text-zinc-200 mt-1">{iss.title}</h4>
                            </div>

                            {nextState && (
                              <button
                                onClick={() => onUpdateIssueStatus(iss.id, nextState.id)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-[11px] font-medium border border-blue-500/30 transition-all shrink-0"
                              >
                                <span>Advance to {nextState.name}</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Active Delivery Impediments & Agile Rules */}
        <div className="space-y-4">
          {/* Active Blocker Radar */}
          <div className="p-4 rounded-xl bg-[#121114] border border-rose-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <h3 className="font-semibold text-xs text-rose-300 uppercase tracking-wider font-mono">
                  Active Impediments ({blockedIssues.length})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                P0 Scrum Focus
              </span>
            </div>

            {blockedIssues.length === 0 ? (
              <div className="p-5 text-center rounded-lg bg-zinc-900/60 border border-white/[0.04]">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <span className="text-xs text-zinc-300 block font-medium">Zero Delivery Impediments</span>
                <span className="text-[11px] text-zinc-500 block">Sprint 24.1 flow is unhindered.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {blockedIssues.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/40 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="font-bold text-rose-300">{b.key}</span>
                      <span className="text-zinc-400">{b.assignee}</span>
                    </div>
                    <p className="text-[11px] text-zinc-200 line-clamp-2">{b.title}</p>
                    <div className="p-2 rounded bg-black/40 text-rose-300 text-[10px] font-mono">
                      <span className="font-bold">Cause:</span> {b.blocked_reason || 'Awaiting external dependency.'}
                    </div>
                    <button
                      onClick={() => onToggleBlocker(b.id, false, '')}
                      className="w-full mt-1 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-mono text-[10px] font-bold transition-colors"
                    >
                      Mark Impediment Cleared
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Scrum Master Quick Rules & Keyboard Reference */}
          <div className="p-4 rounded-xl bg-[#101014] border border-white/[0.06] space-y-3 text-xs">
            <h4 className="font-semibold text-xs text-zinc-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Scrum Master Standup Rules
            </h4>
            <ul className="space-y-1.5 text-[11px] text-zinc-400 list-disc list-inside">
              <li>Walk right-to-left: finish work before starting new.</li>
              <li>Keep individual updates under 60 seconds.</li>
              <li>Take detailed architecture debates offline to 16th minute.</li>
              <li>Flag external blockers immediately for delivery escalation.</li>
            </ul>

            <div className="pt-2 border-t border-white/[0.05] grid grid-cols-2 gap-1.5 text-[10px] font-mono text-zinc-500">
              <div><kbd className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">Space</kbd> Pause Timer</div>
              <div><kbd className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">N / →</kbd> Next Speaker</div>
              <div><kbd className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">R</kbd> Reset 60s</div>
              <div><kbd className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">Esc</kbd> Exit Standup</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Flag Blocker Modal */}
      {blockerModalIssue && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#121114] border border-rose-500/30 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="font-semibold text-xs text-zinc-100">
                  Flag Delivery Impediment: {blockerModalIssue.key}
                </h3>
              </div>
              <button
                onClick={() => setBlockerModalIssue(null)}
                className="text-zinc-500 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-zinc-400 block font-medium">
                Describe the blocking impediment:
              </label>
              <textarea
                value={blockerReasonInput}
                onChange={(e) => setBlockerReasonInput(e.target.value)}
                placeholder="e.g. Waiting on AWS IAM policy approval from SecOps team..."
                className="w-full h-24 p-2.5 rounded-lg bg-zinc-900 border border-white/[0.08] text-xs text-zinc-200 focus:outline-none focus:border-rose-500/50 resize-none font-sans"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => setBlockerModalIssue(null)}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 text-zinc-300 hover:bg-zinc-850"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onToggleBlocker(
                    blockerModalIssue.id,
                    true,
                    blockerReasonInput.trim() || 'Active delivery blocker flagged during Standup.'
                  );
                  setBlockerModalIssue(null);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium"
              >
                Confirm Blocker
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
