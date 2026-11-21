'use client';

import { useState } from 'react';

const CANONICAL_RULES = [
  {
    id: 'rule-pr-merge',
    name: 'Auto-transition on PR merge',
    desc: 'When GitHub PR merges → move to Done & notify Slack',
    runs: '142 runs · Last run 2h ago',
    enabled: true,
    owner: 'Elena Rostova',
    scope: 'Platform Core (PLAT)',
    trigger: {
      type: 'When · Trigger',
      title: 'Pull request merged in GitHub',
      subtitle: 'Target branch matches main',
      icon: 'call_merge',
      iconBg: 'bg-status-progress-bg text-light-primary',
    },
    condition: {
      type: 'If · Condition',
      title: 'Issue status is In Review',
      subtitle: 'AND Project equals Platform Core (PLAT)',
      icon: 'filter_alt',
      iconBg: 'bg-status-warning-bg text-status-warning',
    },
    action1: {
      type: 'Then · Action',
      title: 'Transition issue to Done',
      subtitle: 'Set resolution to Fixed',
      icon: 'check_circle',
      iconBg: 'bg-status-done-bg text-status-done',
    },
    action2: {
      type: 'And · Action',
      title: 'Send Slack message to #plat-releases',
      subtitle: 'Include issue key, summary, and PR link',
      icon: 'forum',
      iconBg: 'bg-status-review-bg text-status-review',
    },
    audit: {
      status: 'Success',
      key: 'PLAT-401',
      action: 'Transitioned to Done & notified #plat-releases',
      time: '2 hours ago',
    },
  },
  {
    id: 'rule-sla-breach',
    name: 'Escalate SLA breach under 30m',
    desc: 'When SLA < 30m → page #oncall-sre & set High',
    runs: '19 runs · Last run 14m ago',
    enabled: true,
    owner: 'Kenji Sato',
    scope: 'Platform Core (PLAT)',
    trigger: {
      type: 'When · Trigger',
      title: 'SLA countdown reaches 30 minutes',
      subtitle: 'Response or Resolution SLA breached',
      icon: 'schedule',
      iconBg: 'bg-status-warning-bg text-status-warning',
    },
    condition: {
      type: 'If · Condition',
      title: 'Priority is High or Critical',
      subtitle: 'AND Issue is unresolved',
      icon: 'warning',
      iconBg: 'bg-light-error-container text-light-on-error-container',
    },
    action1: {
      type: 'Then · Action',
      title: 'Trigger PagerDuty incident',
      subtitle: 'Page on-call engineering escalation squad',
      icon: 'notifications_active',
      iconBg: 'bg-status-done-bg text-status-done',
    },
    action2: {
      type: 'And · Action',
      title: 'Post alert to #incident-command',
      subtitle: 'Attach issue link and real-time SLA countdown',
      icon: 'chat',
      iconBg: 'bg-status-progress-bg text-light-primary',
    },
    audit: {
      status: 'Success',
      key: 'PLAT-424',
      action: 'Escalated to PagerDuty and notified #incident-command',
      time: '14 minutes ago',
    },
  },
  {
    id: 'rule-design-system',
    name: 'Auto-assign Design System tasks',
    desc: 'When Epic = Design System → assign to Marcus Vance',
    runs: '38 runs · Last run 1d ago',
    enabled: true,
    owner: 'Marcus Vance',
    scope: 'Platform Core (PLAT)',
    trigger: {
      type: 'When · Trigger',
      title: 'Issue created or modified',
      subtitle: 'New issue added to Sprint backlog',
      icon: 'add_circle',
      iconBg: 'bg-status-progress-bg text-light-primary',
    },
    condition: {
      type: 'If · Condition',
      title: 'Epic equals Design System',
      subtitle: 'AND Assignee is empty',
      icon: 'filter_list',
      iconBg: 'bg-status-warning-bg text-status-warning',
    },
    action1: {
      type: 'Then · Action',
      title: 'Assign ticket to Marcus Vance',
      subtitle: 'Set assignee field to Marcus Vance',
      icon: 'person_add',
      iconBg: 'bg-status-done-bg text-status-done',
    },
    action2: {
      type: 'And · Action',
      title: 'Add label: design-system',
      subtitle: 'Tag issue for weekly design critique review',
      icon: 'label',
      iconBg: 'bg-status-review-bg text-status-review',
    },
    audit: {
      status: 'Success',
      key: 'PLAT-415',
      action: 'Assigned to Marcus Vance and added label design-system',
      time: '1 day ago',
    },
  },
  {
    id: 'rule-stale-backlog',
    name: 'Weekly stale backlog digest',
    desc: 'Every Monday 09:00 → list issues untouched > 30 days',
    runs: '12 runs · Paused',
    enabled: false,
    owner: 'Balaji Palani',
    scope: 'Platform Core (PLAT)',
    trigger: {
      type: 'When · Trigger',
      title: 'Scheduled recurring cron',
      subtitle: 'Every Monday at 09:00 AM IST',
      icon: 'calendar_month',
      iconBg: 'bg-light-surface-container text-light-on-surface-variant',
    },
    condition: {
      type: 'If · Condition',
      title: 'Updated date > 30 days ago',
      subtitle: 'AND Issue status equals To Do or Backlog',
      icon: 'hourglass_empty',
      iconBg: 'bg-status-warning-bg text-status-warning',
    },
    action1: {
      type: 'Then · Action',
      title: 'Compile Scrum Backlog digest',
      subtitle: 'Group stale items by component and age',
      icon: 'summarize',
      iconBg: 'bg-status-progress-bg text-light-primary',
    },
    action2: {
      type: 'And · Action',
      title: 'Send Slack report to #agile-squad',
      subtitle: 'Prompt Scrum Master for backlog grooming',
      icon: 'send',
      iconBg: 'bg-status-review-bg text-status-review',
    },
    audit: {
      status: 'Paused',
      key: 'PLAT-BACKLOG',
      action: 'Rule execution currently paused by Scrum Master',
      time: '3 days ago',
    },
  },
];

export default function AutomationView({
  rules = [],
  currentProject,
  onToggleRule,
  onCreateRule,
}) {
  const [ruleList, setRuleList] = useState(CANONICAL_RULES);
  const [selectedRuleId, setSelectedRuleId] = useState(CANONICAL_RULES[0].id);

  const activeRule = ruleList.find((r) => r.id === selectedRuleId) || ruleList[0];

  const toggleRuleState = (ruleId) => {
    setRuleList((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
    if (onToggleRule) {
      const target = ruleList.find((r) => r.id === ruleId);
      onToggleRule(ruleId, !target?.enabled);
    }
  };

  return (
    <main className="flex-1 min-w-0 p-gutter-xl flex flex-col gap-gutter-xl overflow-y-auto">
      {/* 1. Breadcrumb & Header */}
      <div className="flex flex-col gap-gutter-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-gutter-xs font-body text-body-sm text-light-on-surface-variant">
          <span className="hover:text-light-on-surface cursor-pointer">Projects</span>
          <span aria-hidden="true">/</span>
          <span className="hover:text-light-on-surface cursor-pointer">{currentProject?.name || 'Platform Core'}</span>
          <span aria-hidden="true">/</span>
          <span className="text-light-on-surface-variant font-medium">Automation</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-gutter-md pt-1">
          <h1 className="font-headline text-headline-lg text-light-on-surface font-bold">
            Jira Automation Rules
          </h1>

          <div className="flex items-center gap-gutter-sm">
            <button
              type="button"
              className="inline-flex items-center justify-center h-8 px-gutter-lg rounded-sm bg-light-primary text-light-on-primary font-label text-label-lg hover:bg-light-primary-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] mr-1" aria-hidden="true">add</span>
              <span>Create rule</span>
            </button>

            <button
              type="button"
              aria-label="Automation options"
              className="inline-flex items-center justify-center w-8 h-8 rounded-sm text-light-on-surface-variant hover:bg-light-surface-container hover:text-light-on-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">more_horiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Grid: Rules List + Visual When/If/Then Tree */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter-lg items-start">
        {/* Left: Rules List (xl:col-span-5) */}
        <section aria-label="Configured rules" className="xl:col-span-5 rounded bg-light-surface-container-lowest border border-light-outline-variant divide-y divide-light-outline-variant shadow-sm overflow-hidden">
          <header className="px-gutter-lg py-gutter-md bg-light-surface-container-low flex items-center justify-between">
            <span className="font-title text-title-sm text-light-on-surface font-bold">
              Project rules ({ruleList.length})
            </span>
            <span className="font-mono text-mono-sm text-light-on-surface-variant tabular-nums">
              {ruleList.filter((r) => r.enabled).length} enabled
            </span>
          </header>

          {ruleList.map((rule) => {
            const isSelected = activeRule.id === rule.id;

            return (
              <div
                key={rule.id}
                onClick={() => setSelectedRuleId(rule.id)}
                className={`p-gutter-lg cursor-pointer flex items-start justify-between gap-gutter-md transition-colors ${
                  isSelected
                    ? 'bg-status-progress-bg/40 border-l-4 border-l-light-primary'
                    : 'hover:bg-light-surface-container-low'
                }`}
              >
                <div className="flex flex-col gap-gutter-xs">
                  <div className="flex items-center gap-gutter-sm">
                    <span className="font-title text-title-sm text-light-on-surface font-semibold">
                      {rule.name}
                    </span>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRuleState(rule.id);
                      }}
                      className={`px-gutter-sm py-0.5 rounded-sm font-label text-label-sm uppercase font-semibold cursor-pointer ${
                        rule.enabled
                          ? 'bg-status-done-bg text-status-done'
                          : 'bg-light-surface-container text-light-on-surface-variant'
                      }`}
                    >
                      {rule.enabled ? 'Enabled' : 'Paused'}
                    </span>
                  </div>
                  <p className="font-body text-body-sm text-light-on-surface-variant">
                    {rule.desc}
                  </p>
                  <span className="font-mono text-mono-sm text-light-on-surface-variant tabular-nums">
                    {rule.runs}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Right: Visual When / If / Then Rule Flow (xl:col-span-7) */}
        <section aria-label="Rule builder" className="xl:col-span-7 rounded bg-light-surface-container-low border border-light-outline-variant p-gutter-xl flex flex-col gap-gutter-lg shadow-sm">
          <header className="flex flex-wrap items-center justify-between gap-gutter-md">
            <div>
              <h2 className="font-headline text-headline-sm text-light-on-surface font-bold">
                {activeRule.name}
              </h2>
              <p className="font-body text-body-sm text-light-on-surface-variant">
                Owner: {activeRule.owner} · Scope: {activeRule.scope}
              </p>
            </div>
            <span className={`px-gutter-md py-1 rounded-sm font-label text-label-md font-semibold ${
              activeRule.enabled ? 'bg-status-done-bg text-status-done' : 'bg-light-surface-container text-light-on-surface-variant'
            }`}>
              {activeRule.enabled ? 'Published & Active' : 'Paused'}
            </span>
          </header>

          {/* Flow Nodes */}
          <div className="flex flex-col items-center gap-gutter-sm">
            {/* WHEN Trigger */}
            <div className="w-full p-gutter-lg rounded bg-light-surface-container-lowest border border-light-outline-variant flex items-center gap-gutter-md shadow-xs">
              <div className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 ${activeRule.trigger.iconBg}`}>
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{activeRule.trigger.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-label text-label-sm text-light-primary uppercase tracking-wider font-semibold">
                  {activeRule.trigger.type}
                </span>
                <p className="font-title text-title-sm text-light-on-surface font-semibold">
                  {activeRule.trigger.title}
                </p>
                <p className="font-body text-body-sm text-light-on-surface-variant">
                  {activeRule.trigger.subtitle}
                </p>
              </div>
            </div>

            <span className="material-symbols-outlined text-[20px] text-light-on-surface-variant" aria-hidden="true">arrow_downward</span>

            {/* IF Condition */}
            <div className="w-full p-gutter-lg rounded bg-light-surface-container-lowest border border-light-outline-variant flex items-center gap-gutter-md shadow-xs">
              <div className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 ${activeRule.condition.iconBg}`}>
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{activeRule.condition.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-label text-label-sm text-status-warning uppercase tracking-wider font-semibold">
                  {activeRule.condition.type}
                </span>
                <p className="font-title text-title-sm text-light-on-surface font-semibold">
                  {activeRule.condition.title}
                </p>
                <p className="font-body text-body-sm text-light-on-surface-variant">
                  {activeRule.condition.subtitle}
                </p>
              </div>
            </div>

            <span className="material-symbols-outlined text-[20px] text-light-on-surface-variant" aria-hidden="true">arrow_downward</span>

            {/* THEN Action 1 */}
            <div className="w-full p-gutter-lg rounded bg-light-surface-container-lowest border border-light-outline-variant flex items-center gap-gutter-md shadow-xs">
              <div className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 ${activeRule.action1.iconBg}`}>
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{activeRule.action1.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-label text-label-sm text-status-done uppercase tracking-wider font-semibold">
                  {activeRule.action1.type}
                </span>
                <p className="font-title text-title-sm text-light-on-surface font-semibold">
                  {activeRule.action1.title}
                </p>
                <p className="font-body text-body-sm text-light-on-surface-variant">
                  {activeRule.action1.subtitle}
                </p>
              </div>
            </div>

            <span className="material-symbols-outlined text-[20px] text-light-on-surface-variant" aria-hidden="true">arrow_downward</span>

            {/* THEN Action 2 */}
            <div className="w-full p-gutter-lg rounded bg-light-surface-container-lowest border border-light-outline-variant flex items-center gap-gutter-md shadow-xs">
              <div className={`w-10 h-10 rounded-sm flex items-center justify-center shrink-0 ${activeRule.action2.iconBg}`}>
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">{activeRule.action2.icon}</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-label text-label-sm text-status-review uppercase tracking-wider font-semibold">
                  {activeRule.action2.type}
                </span>
                <p className="font-title text-title-sm text-light-on-surface font-semibold">
                  {activeRule.action2.title}
                </p>
                <p className="font-body text-body-sm text-light-on-surface-variant">
                  {activeRule.action2.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Audit Log */}
          <div className="pt-gutter-md border-t border-light-outline-variant flex flex-col gap-gutter-xs">
            <p className="font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">
              Recent audit log
            </p>
            <div className="p-gutter-md rounded-sm bg-light-surface-container-lowest border border-light-outline-variant flex flex-wrap items-center justify-between gap-gutter-sm">
              <div className="flex items-center gap-gutter-sm">
                <span className={`px-gutter-sm py-0.5 rounded-sm font-label text-label-sm uppercase font-semibold ${
                  activeRule.audit.status === 'Success' ? 'bg-status-done-bg text-status-done' : 'bg-light-surface-container text-light-on-surface-variant'
                }`}>
                  {activeRule.audit.status}
                </span>
                <span className="font-mono text-mono-sm text-light-on-surface font-bold">
                  {activeRule.audit.key}
                </span>
                <span className="font-body text-body-sm text-light-on-surface-variant">
                  {activeRule.audit.action}
                </span>
              </div>
              <span className="font-body text-body-sm text-light-on-surface-variant">
                {activeRule.audit.time}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
