'use client';

import { 
  TrendingDown, 
  Gauge, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  Activity,
  Layers
} from 'lucide-react';

export default function AnalyticsView({
  activeSprint,
  sprintStats,
  issues,
  states,
}) {
  const sprintIssues = issues.filter((i) => i.sprint_id === (activeSprint?.id || 'sprint-24-1'));
  const totalPoints = sprintStats?.total_points || 23;
  const completedPoints = sprintStats?.completed_points || 2;
  const remainingPoints = Math.max(0, totalPoints - completedPoints);

  // Burndown simulation: 10-day sprint
  const sprintDays = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7', 'Day 8', 'Day 9', 'Day 10'];
  const idealBurn = sprintDays.map((_, idx) => Math.round(totalPoints - (idx * (totalPoints / 9))));
  const actualBurn = [totalPoints, totalPoints, totalPoints - 2, totalPoints - 2, totalPoints - 2]; // Current day 5

  const blockedIssues = sprintIssues.filter((i) => i.is_blocked === 1);

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Sprint Completion */}
        <div className="p-4 rounded-xl bg-[#121215] border border-white/10">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Sprint Completion</span>
            <TrendingDown className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {Math.round((completedPoints / (totalPoints || 1)) * 100)}%
            </span>
            <span className="text-xs font-mono text-zinc-400">
              {completedPoints} / {totalPoints} pts
            </span>
          </div>
          <div className="mt-3 w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${Math.round((completedPoints / (totalPoints || 1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Committed Velocity */}
        <div className="p-4 rounded-xl bg-[#121215] border border-white/10">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Committed Velocity</span>
            <Gauge className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-white">
              {totalPoints} pts
            </span>
            <span className="text-xs text-emerald-400 font-medium">95% Predictability</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">UK BFSI squad 3-sprint rolling avg: 22 pts</p>
        </div>

        {/* Metric 3: Active Blockers */}
        <div className="p-4 rounded-xl bg-[#121215] border border-white/10">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Active Blockers</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-400">
              {blockedIssues.length}
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              ({blockedIssues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0)} pts stuck)
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">
            {blockedIssues.length > 0 ? 'Requires immediate Scrum Master intervention' : 'Zero impediments'}
          </p>
        </div>

        {/* Metric 4: WIP Limit Health */}
        <div className="p-4 rounded-xl bg-[#121215] border border-white/10">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">WIP Compliance</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">100%</span>
            <span className="text-xs text-zinc-400 font-mono">0 bottlenecks</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-2">Dev (1/4), Review (1/3), QA (1/3)</p>
        </div>
      </div>

      {/* Real-time Sprint Burndown Chart */}
      <div className="p-5 rounded-xl bg-[#121215] border border-white/10">
        <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
          <div>
            <h3 className="font-semibold text-sm text-zinc-200">Sprint 24.1 Burndown Trajectory</h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Ideal linear guideline vs. actual story point burn rate across 10 working days
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-zinc-600 block"></span>
              <span className="text-zinc-400">Ideal Guideline</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-500 block"></span>
              <span className="text-blue-400 font-semibold">Actual Burn</span>
            </div>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-64 flex items-end justify-between gap-2 pt-6 px-2 border-b border-l border-white/10 relative">
          {/* Y-axis guideline levels */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-dashed border-white w-full" />
            <div className="border-b border-dashed border-white w-full" />
            <div className="border-b border-dashed border-white w-full" />
            <div className="border-b border-dashed border-white w-full" />
          </div>

          {sprintDays.map((day, idx) => {
            const ideal = idealBurn[idx];
            const actual = actualBurn[idx];
            const idealHeight = Math.max(4, Math.round((ideal / totalPoints) * 100));
            const actualHeight = actual !== undefined ? Math.max(4, Math.round((actual / totalPoints) * 100)) : 0;

            return (
              <div key={day} className="flex-1 flex flex-col items-center h-full justify-end z-10 group">
                <div className="w-full flex items-end justify-center gap-1 h-full pb-2">
                  {/* Ideal Guideline Column */}
                  <div
                    title={`Ideal: ${ideal} pts`}
                    style={{ height: `${idealHeight}%` }}
                    className="w-1.5 bg-zinc-700/60 rounded-t"
                  />
                  {/* Actual Column */}
                  {actual !== undefined && (
                    <div
                      title={`Actual Remaining: ${actual} pts`}
                      style={{ height: `${actualHeight}%` }}
                      className="w-3 bg-blue-500 rounded-t shadow-sm shadow-blue-500/20"
                    />
                  )}
                </div>
                <span className="text-[10px] font-mono text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Blocker Intervention List */}
      {blockedIssues.length > 0 && (
        <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h4 className="font-semibold text-xs text-rose-200">Active Delivery Impediments (Action Required)</h4>
          </div>
          <div className="divide-y divide-rose-500/10">
            {blockedIssues.map((iss) => (
              <div key={iss.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-400">{iss.key}</span>
                    <span className="text-zinc-200 font-medium">{iss.title}</span>
                  </div>
                  <p className="text-rose-300/80 text-[11px] mt-1 italic">
                    Reason: {iss.blocked_reason}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    {iss.story_points} pts
                  </span>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{iss.assignee}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
