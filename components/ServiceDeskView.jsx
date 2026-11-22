'use client';

import { useState } from 'react';
import { Inbox, AlertTriangle, Flame, UserX, CheckCircle2, Clock } from 'lucide-react';

const INITIAL_REQUESTS = [
  {
    key: 'ITSD-904',
    title: 'VPN certificate expired for EU remote engineers',
    reporter: 'Marcus Vance',
    reporterEmail: 'marcus.vance@acme.dev',
    sla: '14m left',
    slaUrgent: true,
    status: 'Investigating',
    statusClass: 'bg-status-progress-bg text-light-on-surface',
    category: 'incidents',
    description: 'Multiple engineers in Berlin and Amsterdam cannot authenticate to the WireGuard VPN gateway after the 08:00 UTC cert rotation.',
  },
  {
    key: 'ITSD-907',
    title: 'Request production read-only BigQuery access',
    reporter: 'Priya Nair',
    reporterEmail: 'priya.nair@acme.dev',
    sla: '42m left',
    slaUrgent: true,
    status: 'Pending approval',
    statusClass: 'bg-status-warning-bg text-light-on-surface',
    category: 'sla-risk',
    description: 'Need read-only access to prod_telemetry dataset to verify webhook span sampling ratios.',
  },
  {
    key: 'ITSD-899',
    title: 'Provision Datadog read-only seats for new QA cohort',
    reporter: 'Kenji Sato',
    reporterEmail: 'kenji.sato@acme.dev',
    sla: '3h left',
    slaUrgent: false,
    status: 'Waiting on customer',
    statusClass: 'bg-light-surface-container text-light-on-surface-variant',
    category: 'unassigned',
    description: 'Onboarding 3 contract SDETs requiring view permissions on APM service maps.',
  },
  {
    key: 'ITSD-892',
    title: 'MacBook Pro M3 battery replacement logistics',
    reporter: 'Elena Rostova',
    reporterEmail: 'elena.rostova@acme.dev',
    sla: '5h left',
    slaUrgent: false,
    status: 'In progress',
    statusClass: 'bg-status-progress-bg text-light-on-surface',
    category: 'all',
    description: 'Battery health degraded below 75% on developer unit. Need courier return box.',
  },
  {
    key: 'ITSD-888',
    title: 'Reset Multi-Factor TOTP for staging jumpbox',
    reporter: 'Marcus Vance',
    reporterEmail: 'marcus.vance@acme.dev',
    sla: '1d left',
    slaUrgent: false,
    status: 'Resolved',
    statusClass: 'bg-status-done-bg text-light-on-surface',
    category: 'all',
    description: 'Replaced authenticator device. Ready for one-time verification challenge.',
  },
];

export default function ServiceDeskView({
  setActiveView,
}) {
  const [activeQueue, setActiveQueue] = useState('all');
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [selectedKey, setSelectedKey] = useState('ITSD-904');
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);

  const selectedRequest = requests.find((r) => r.key === selectedKey) || requests[0];

  const filteredRequests = requests.filter((r) => {
    if (activeQueue === 'all') return true;
    if (activeQueue === 'unassigned') return r.category === 'unassigned';
    if (activeQueue === 'sla-risk') return r.slaUrgent;
    if (activeQueue === 'incidents') return r.category === 'incidents';
    return true;
  });

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplySent(true);
    setReplyText('');
    setTimeout(() => setReplySent(false), 2500);
  };

  return (
    <div className="flex-1 min-w-0 p-gutter-xl flex flex-col gap-gutter-lg select-none">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-gutter-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-gutter-xs font-body text-body-sm text-light-on-surface-variant">
          <span onClick={() => setActiveView && setActiveView('projects')} className="hover:text-light-on-surface cursor-pointer">
            Projects
          </span>
          <span aria-hidden="true">/</span>
          <span className="hover:text-light-on-surface cursor-pointer">IT Service Desk</span>
          <span aria-hidden="true">/</span>
          <span className="text-light-on-surface font-medium">All open queue</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-gutter-md">
          <h1 className="font-headline text-headline-lg text-light-on-surface font-semibold tracking-tight">
            All open requests
          </h1>
          <span className="px-gutter-md py-1 rounded-sm bg-light-error-container text-light-on-error-container font-label text-label-md font-medium tabular-nums">
            2 SLAs breaching within 1h
          </span>
        </div>
      </div>

      {/* Queue Filter Bar */}
      <div className="flex flex-wrap items-center gap-gutter-xs">
        <button
          type="button"
          onClick={() => setActiveQueue('all')}
          className={`flex items-center gap-2 px-gutter-md py-1.5 rounded-sm font-label text-label-md transition-colors ${
            activeQueue === 'all'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface-variant hover:bg-light-surface-container'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>All open ({requests.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveQueue('sla-risk')}
          className={`flex items-center gap-2 px-gutter-md py-1.5 rounded-sm font-label text-label-md transition-colors ${
            activeQueue === 'sla-risk'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface-variant hover:bg-light-surface-container'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>SLA at risk (2)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveQueue('incidents')}
          className={`flex items-center gap-2 px-gutter-md py-1.5 rounded-sm font-label text-label-md transition-colors ${
            activeQueue === 'incidents'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface-variant hover:bg-light-surface-container'
          }`}
        >
          <Flame className="w-4 h-4 text-red-500" />
          <span>Incidents (1)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveQueue('unassigned')}
          className={`flex items-center gap-2 px-gutter-md py-1.5 rounded-sm font-label text-label-md transition-colors ${
            activeQueue === 'unassigned'
              ? 'bg-status-progress-bg text-light-primary font-semibold'
              : 'bg-light-surface-container-lowest border border-light-outline-variant text-light-on-surface-variant hover:bg-light-surface-container'
          }`}
        >
          <UserX className="w-4 h-4" />
          <span>Unassigned (1)</span>
        </button>
      </div>

      {/* Split View: Queue Table + Triage & Reply Pane */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter-lg items-start">
        {/* Queue Table */}
        <div className="xl:col-span-7 rounded bg-light-surface-container-lowest border border-light-outline-variant overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-light-outline-variant bg-light-surface-container-low">
                <th className="px-gutter-md py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Key</th>
                <th className="px-gutter-md py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Request</th>
                <th className="px-gutter-md py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Reporter</th>
                <th className="px-gutter-md py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">SLA</th>
                <th className="px-gutter-md py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-outline-variant">
              {filteredRequests.map((r) => {
                const isSelected = r.key === selectedKey;
                return (
                  <tr
                    key={r.key}
                    onClick={() => setSelectedKey(r.key)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-status-progress-bg/40'
                        : 'hover:bg-light-surface-container-low'
                    }`}
                  >
                    <td className="px-gutter-md py-gutter-sm font-mono text-mono-sm text-light-primary whitespace-nowrap tabular-nums font-medium">
                      {r.key}
                    </td>
                    <td className="px-gutter-md py-gutter-sm font-body text-body-md text-light-on-surface">
                      {r.title}
                    </td>
                    <td className="px-gutter-md py-gutter-sm font-body text-body-sm text-light-on-surface-variant whitespace-nowrap">
                      {r.reporter}
                    </td>
                    <td className="px-gutter-md py-gutter-sm whitespace-nowrap">
                      <span
                        className={`px-gutter-sm py-0.5 rounded-sm font-mono text-mono-sm tabular-nums font-semibold ${
                          r.slaUrgent
                            ? 'bg-light-error-container text-light-on-error-container'
                            : 'bg-light-surface-container text-light-on-surface-variant'
                        }`}
                      >
                        {r.sla}
                      </span>
                    </td>
                    <td className="px-gutter-md py-gutter-sm whitespace-nowrap">
                      <span className={`px-gutter-sm py-0.5 rounded-sm font-label text-label-sm uppercase font-semibold ${r.statusClass}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Triage & Reply Inspector */}
        {selectedRequest && (
          <div className="xl:col-span-5 rounded bg-light-surface-container-lowest border border-light-outline-variant p-gutter-lg flex flex-col gap-gutter-md">
            <div className="flex items-center justify-between">
              <span className="font-mono text-mono-sm text-light-primary font-bold">
                {selectedRequest.key}
              </span>
              <span
                className={`px-gutter-sm py-0.5 rounded-sm font-mono text-mono-sm font-semibold ${
                  selectedRequest.slaUrgent
                    ? 'bg-light-error-container text-light-on-error-container'
                    : 'bg-light-surface-container text-light-on-surface-variant'
                }`}
              >
                SLA: {selectedRequest.sla}
              </span>
            </div>

            <h2 className="font-headline text-title-lg text-light-on-surface font-semibold">
              {selectedRequest.title}
            </h2>

            <div className="p-gutter-sm rounded bg-light-surface-container-low text-xs text-light-on-surface-variant flex items-center justify-between">
              <span>Reporter: <strong className="text-light-on-surface">{selectedRequest.reporter}</strong></span>
              <span>{selectedRequest.reporterEmail}</span>
            </div>

            <div className="text-sm text-light-on-surface-variant leading-relaxed">
              {selectedRequest.description}
            </div>

            {/* Quick Agent Reply */}
            <form onSubmit={handleSendReply} className="flex flex-col gap-2 pt-2 border-t border-light-outline-variant">
              <label className="text-xs font-medium text-light-on-surface-variant uppercase">
                Customer Reply &amp; Internal Note
              </label>
              <textarea
                rows={3}
                placeholder="Type response to reporter..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full px-3 py-2 rounded-sm bg-light-surface-container-low border border-light-outline-variant text-sm text-light-on-surface focus:outline-none focus:border-light-primary resize-none"
              />
              <div className="flex items-center justify-between">
                {replySent ? (
                  <span className="text-xs text-status-done font-medium flex items-center gap-1.5 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    Reply dispatched to reporter
                  </span>
                ) : <span />}
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-sm bg-light-primary text-white text-xs font-medium hover:bg-light-primary-container transition-colors"
                >
                  Send response
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
