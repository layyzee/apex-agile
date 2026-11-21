'use client';

const AVATARS = {
  elena: 'https://lh3.googleusercontent.com/aida/ALJJyrDT0ygT73l1oUoLN-ldq4D7iK67gQRn2Jk7sBkqg00OyGKoqWQZmoRgvpSJ9yBujVKEsKamItF_rzwvRR9GvaIUS4xjNTiLupFexLBJ7GFYZdSJkyY5uCqQXPuCpnXXcN3cZl0SjBUXkf08AfWbQLcqKuuD5bWUTUaMgsKPLsXBFH58TvdsBeHggVY-ycBQeeRkHLak_R1Bx4dYrDhktkSi7Y1mbVHmwnKtJZuZJfFUTrMrLQNe',
  priya: 'https://lh3.googleusercontent.com/aida/ALJJyrCklGpvdGYSopZxSSrRrPtkBdl957Q7Ogz3uX4fzie9G6mTQH6uP4Ci9ogj6r8yyxr5FSklMt7HTI9LHmOQx-1AJAW00HC-R94bmNKCEc1e-aUownDKA7Pw9u-0SzqwGKOMXci_2P53ra7QQllboBJxCniFDjxsHLcxZZzShy3IZKKuPnALJYUM8lxbC3lHfz-oLxtUKoE_SWLs1a7Uj3mETCnd6AwoJglU90DUhLV8p3Jl2FT6',
  kenji: 'https://lh3.googleusercontent.com/aida/ALJJyrBLdMi5794naAeeCGG9DPABynyRt6Kim8iD-BJ15u6KvCSy_z-bZ0rWPW2JTpGksViGt4Yhc8-g9QJ2O4mGtC7-aSzx_oMVSgOebe-dPhF6N6c_UQfVmFAqtxO6uiBV29EU8xE7bMFUcK8xvF2msv3T8RMNnRxl_QVBhXA_LavlWbFf1jFPvTN4LuPBqMy4W0pO5UpgwlOHIyzGiTZTEFovVZW8yWTboQYzKXGMJ4Gt6YcDFOE',
};

const PULL_REQUESTS = [
  {
    id: 1842,
    branch: 'feat/pkce-refresh-worker',
    issueKey: 'PLAT-412',
    author: 'Elena',
    authorAvatar: AVATARS.elena,
    statusLabel: 'Checks pass',
    statusClass: 'bg-status-done-bg text-light-on-surface',
    updated: '18m ago',
  },
  {
    id: 1839,
    branch: 'fix/graphql-tenant-header',
    issueKey: 'PLAT-419',
    author: 'Priya',
    authorAvatar: AVATARS.priya,
    statusLabel: '2 pending',
    statusClass: 'bg-status-warning-bg text-light-on-surface',
    updated: '1h ago',
  },
  {
    id: 1834,
    branch: 'chore/canary-latency-guard',
    issueKey: 'PLAT-408',
    author: 'Kenji',
    authorAvatar: AVATARS.kenji,
    statusLabel: 'Checks pass',
    statusClass: 'bg-status-done-bg text-light-on-surface',
    updated: '2h ago',
  },
];

export default function CodeDeploymentsView({
  currentProject,
  onSelectIssue,
}) {
  return (
    <div className="flex-1 min-w-0 p-gutter-xl flex flex-col gap-gutter-xl select-none">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-gutter-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-gutter-xs font-body text-body-sm text-light-on-surface-variant">
          <span className="hover:text-light-on-surface cursor-pointer">Projects</span>
          <span aria-hidden="true">/</span>
          <span className="hover:text-light-on-surface cursor-pointer">{currentProject?.name || 'Platform Core'}</span>
          <span aria-hidden="true">/</span>
          <span className="text-light-on-surface font-medium">Code &amp; deployments</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-gutter-md">
          <h1 className="font-headline text-headline-lg text-light-on-surface font-semibold tracking-tight">
            Code &amp; deployments
          </h1>
          <span className="px-gutter-md py-1 rounded-sm bg-status-done-bg text-light-on-surface font-label text-label-md font-medium">
            GitHub App connected · 2 repos
          </span>
        </div>
      </div>

      {/* Deployment Environments Strip */}
      <section aria-label="Deployment environments" className="grid grid-cols-1 md:grid-cols-3 gap-gutter-lg">
        <article className="p-gutter-lg rounded bg-light-surface-container-lowest border border-light-outline-variant flex flex-col gap-gutter-xs">
          <div className="flex items-center justify-between">
            <span className="font-label text-label-md text-light-on-surface-variant uppercase font-semibold">Production</span>
            <span className="px-gutter-sm py-0.5 rounded-sm bg-status-done-bg text-light-on-surface font-label text-label-sm uppercase font-semibold">
              Healthy
            </span>
          </div>
          <p className="font-mono text-mono-md text-light-on-surface mt-1 font-medium">v2.13.4 · us-east-1</p>
          <p className="font-body text-body-sm text-light-on-surface-variant">Deployed Nov 11 by Kenji Sato</p>
        </article>

        <article className="p-gutter-lg rounded bg-light-surface-container-lowest border border-light-outline-variant flex flex-col gap-gutter-xs">
          <div className="flex items-center justify-between">
            <span className="font-label text-label-md text-light-on-surface-variant uppercase font-semibold">Staging</span>
            <span className="px-gutter-sm py-0.5 rounded-sm bg-status-progress-bg text-light-on-surface font-label text-label-sm uppercase font-semibold">
              Active
            </span>
          </div>
          <p className="font-mono text-mono-md text-light-on-surface mt-1 font-medium">v2.14.0-rc2 · staging</p>
          <p className="font-body text-body-sm text-light-on-surface-variant">Deployed 18m ago via main</p>
        </article>

        <article className="p-gutter-lg rounded bg-light-surface-container-lowest border border-light-outline-variant flex flex-col gap-gutter-xs">
          <div className="flex items-center justify-between">
            <span className="font-label text-label-md text-light-on-surface-variant uppercase font-semibold">Preview</span>
            <span className="px-gutter-sm py-0.5 rounded-sm bg-status-review-bg text-light-on-surface font-label text-label-sm uppercase font-semibold">
              3 PRs live
            </span>
          </div>
          <p className="font-mono text-mono-md text-light-on-surface mt-1 font-medium">Ephemeral environments</p>
          <p className="font-body text-body-sm text-light-on-surface-variant">Auto-teardown on PR merge</p>
        </article>
      </section>

      {/* Linked Pull Requests Table */}
      <section aria-label="Open pull requests" className="rounded bg-light-surface-container-lowest border border-light-outline-variant overflow-x-auto">
        <header className="px-gutter-lg py-gutter-md border-b border-light-outline-variant bg-light-surface-container-low flex items-center justify-between">
          <h2 className="font-title text-title-md text-light-on-surface font-semibold">
            Open pull requests (3)
          </h2>
          <span className="font-mono text-mono-sm text-light-on-surface-variant">
            layyzee/apex-agile
          </span>
        </header>
        <table className="w-full text-left border-collapse min-w-[680px]">
          <thead>
            <tr className="border-b border-light-outline-variant">
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">PR</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Linked issue</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Author</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">CI Checks</th>
              <th className="px-gutter-lg py-gutter-sm font-label text-label-sm text-light-on-surface-variant uppercase font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light-outline-variant">
            {PULL_REQUESTS.map((pr) => (
              <tr key={pr.id} className="hover:bg-light-surface-container-low/40 transition-colors">
                <td className="px-gutter-lg py-gutter-md font-body text-body-md text-light-on-surface">
                  <span className="font-mono text-mono-sm text-light-on-surface-variant mr-2">#{pr.id}</span>
                  {pr.branch}
                </td>
                <td className="px-gutter-lg py-gutter-md font-mono text-mono-sm text-light-primary font-medium">
                  <button
                    onClick={() => onSelectIssue && onSelectIssue({ key: pr.issueKey })}
                    className="hover:underline"
                  >
                    {pr.issueKey}
                  </button>
                </td>
                <td className="px-gutter-lg py-gutter-md">
                  <div className="flex items-center gap-gutter-xs">
                    <img
                      src={pr.authorAvatar}
                      alt={pr.author}
                      className="w-6 h-6 rounded-full object-cover border border-light-outline-variant"
                    />
                    <span className="font-body text-body-sm text-light-on-surface">{pr.author}</span>
                  </div>
                </td>
                <td className="px-gutter-lg py-gutter-md">
                  <span className={`px-gutter-sm py-0.5 rounded-sm font-label text-label-sm uppercase font-semibold ${pr.statusClass}`}>
                    {pr.statusLabel}
                  </span>
                </td>
                <td className="px-gutter-lg py-gutter-md font-body text-body-sm text-light-on-surface-variant">
                  {pr.updated}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
