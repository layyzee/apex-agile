'use client';

import { useState } from 'react';

export default function SettingsView({
  currentProject,
  states = [],
  onSaveProject,
}) {
  const [projectName, setProjectName] = useState(currentProject?.name || 'Platform Core');
  const [projectKey, setProjectKey] = useState(currentProject?.key || 'PLAT');
  const [projectLead, setProjectLead] = useState(currentProject?.lead_name || 'Elena Rostova');
  const [defaultAssignee, setDefaultAssignee] = useState('Unassigned');

  // Workflow toggles
  const [autoTransitionPr, setAutoTransitionPr] = useState(true);
  const [requirePoints, setRequirePoints] = useState(true);
  const [slackDigest, setSlackDigest] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (onSaveProject) {
      onSaveProject({
        ...currentProject,
        name: projectName,
        key: projectKey,
        lead_name: projectLead,
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <main className="flex-1 min-w-0 p-gutter-xl flex flex-col gap-gutter-xl max-w-4xl overflow-y-auto">
      {/* 1. Breadcrumb & Header */}
      <div className="flex flex-col gap-gutter-xs">
        <nav aria-label="Breadcrumb" className="flex items-center gap-gutter-xs font-body text-body-sm text-light-on-surface-variant">
          <span className="hover:text-light-on-surface cursor-pointer">Projects</span>
          <span aria-hidden="true">/</span>
          <span className="hover:text-light-on-surface cursor-pointer">{projectName}</span>
          <span aria-hidden="true">/</span>
          <span className="text-light-on-surface-variant font-medium">Project settings</span>
        </nav>

        <h1 className="font-headline text-headline-lg text-light-on-surface font-bold pt-1">
          Project settings
        </h1>
      </div>

      {/* 2. Section 1: Project Details */}
      <section aria-label="Project details" className="rounded bg-light-surface-container-lowest border border-light-outline-variant p-gutter-xl flex flex-col gap-gutter-lg shadow-sm">
        <header>
          <h2 className="font-title text-title-lg text-light-on-surface font-bold">
            Project details
          </h2>
          <p className="font-body text-body-sm text-light-on-surface-variant">
            Core identity and lead ownership for {projectName}
          </p>
        </header>

        <form onSubmit={handleSave} className="flex flex-col gap-gutter-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-lg">
            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="proj-name" className="font-label text-label-md text-light-on-surface font-semibold">
                Project name
              </label>
              <input
                id="proj-name"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="rounded-sm bg-light-surface-container-lowest border border-light-outline-variant font-body text-body-md text-light-on-surface px-gutter-md py-1.5 focus:border-light-primary focus:ring-1 focus:ring-light-primary outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="proj-key" className="font-label text-label-md text-light-on-surface font-semibold">
                Project key
              </label>
              <input
                id="proj-key"
                type="text"
                value={projectKey}
                onChange={(e) => setProjectKey(e.target.value.toUpperCase())}
                className="rounded-sm bg-light-surface-container-low border border-light-outline-variant font-mono text-mono-md text-light-on-surface px-gutter-md py-1.5 uppercase outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="proj-lead" className="font-label text-label-md text-light-on-surface font-semibold">
                Project lead
              </label>
              <select
                id="proj-lead"
                value={projectLead}
                onChange={(e) => setProjectLead(e.target.value)}
                className="rounded-sm bg-light-surface-container-lowest border border-light-outline-variant font-body text-body-md text-light-on-surface px-gutter-md py-1.5 outline-none cursor-pointer"
              >
                <option value="Elena Rostova">Elena Rostova</option>
                <option value="Marcus Vance">Marcus Vance</option>
                <option value="Priya Nair">Priya Nair</option>
                <option value="Kenji Sato">Kenji Sato</option>
                <option value="Balaji Palani">Balaji Palani</option>
              </select>
            </div>

            <div className="flex flex-col gap-gutter-xs">
              <label htmlFor="proj-assignee" className="font-label text-label-md text-light-on-surface font-semibold">
                Default assignee
              </label>
              <select
                id="proj-assignee"
                value={defaultAssignee}
                onChange={(e) => setDefaultAssignee(e.target.value)}
                className="rounded-sm bg-light-surface-container-lowest border border-light-outline-variant font-body text-body-md text-light-on-surface px-gutter-md py-1.5 outline-none cursor-pointer"
              >
                <option value="Unassigned">Unassigned</option>
                <option value="Project lead">Project lead</option>
              </select>
            </div>
          </div>

          <footer className="flex items-center justify-between pt-gutter-sm border-t border-light-outline-variant">
            {savedSuccess ? (
              <span className="text-body-sm text-status-done font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Settings saved successfully</span>
              </span>
            ) : <span />}

            <button
              type="submit"
              className="inline-flex items-center justify-center px-gutter-lg py-1.5 rounded-sm bg-light-primary text-light-on-primary hover:bg-light-primary-container font-label text-label-lg transition-colors cursor-pointer"
            >
              Save details
            </button>
          </footer>
        </form>
      </section>

      {/* 3. Section 2: Workflow & Automation Gates */}
      <section aria-label="Workflow and automation" className="rounded bg-light-surface-container-lowest border border-light-outline-variant p-gutter-xl flex flex-col gap-gutter-lg shadow-sm">
        <header>
          <h2 className="font-title text-title-lg text-light-on-surface font-bold">
            Workflow &amp; automation
          </h2>
          <p className="font-body text-body-sm text-light-on-surface-variant">
            Configure sprint transitions, GitHub PR sync, and notification policies
          </p>
        </header>

        <div className="divide-y divide-light-outline-variant">
          <div className="py-gutter-md flex items-center justify-between gap-gutter-md">
            <div>
              <p className="font-title text-title-sm text-light-on-surface font-semibold">
                Auto-transition on PR merge
              </p>
              <p className="font-body text-body-sm text-light-on-surface-variant">
                Move linked issues from In Review to Done when main branch merges
              </p>
            </div>
            <input
              type="checkbox"
              checked={autoTransitionPr}
              onChange={(e) => setAutoTransitionPr(e.target.checked)}
              aria-label="Auto-transition on PR merge"
              className="w-5 h-5 rounded-sm text-light-primary border-light-outline-variant focus:ring-light-primary cursor-pointer"
            />
          </div>

          <div className="py-gutter-md flex items-center justify-between gap-gutter-md">
            <div>
              <p className="font-title text-title-sm text-light-on-surface font-semibold">
                Require story point estimates (Definition of Ready)
              </p>
              <p className="font-body text-body-sm text-light-on-surface-variant">
                Warn before starting a sprint when issues lack story point estimates
              </p>
            </div>
            <input
              type="checkbox"
              checked={requirePoints}
              onChange={(e) => setRequirePoints(e.target.checked)}
              aria-label="Require story point estimates"
              className="w-5 h-5 rounded-sm text-light-primary border-light-outline-variant focus:ring-light-primary cursor-pointer"
            />
          </div>

          <div className="py-gutter-md flex items-center justify-between gap-gutter-md">
            <div>
              <p className="font-title text-title-sm text-light-on-surface font-semibold">
                Slack sprint digest
              </p>
              <p className="font-body text-body-sm text-light-on-surface-variant">
                Post daily blocker summaries to #plat-eng-standup at 9:00 AM
              </p>
            </div>
            <input
              type="checkbox"
              checked={slackDigest}
              onChange={(e) => setSlackDigest(e.target.checked)}
              aria-label="Slack sprint digest"
              className="w-5 h-5 rounded-sm text-light-primary border-light-outline-variant focus:ring-light-primary cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* 4. Section 3: Danger Zone */}
      <section aria-label="Danger zone" className="rounded bg-light-error-container/30 border border-light-error/40 p-gutter-xl flex flex-wrap items-center justify-between gap-gutter-md shadow-xs">
        <div>
          <h2 className="font-title text-title-md text-light-on-error-container font-bold">
            Archive or delete project
          </h2>
          <p className="font-body text-body-sm text-light-on-surface-variant">
            Archiving preserves all issues and history in read-only mode.
          </p>
        </div>
        <button
          type="button"
          onClick={() => alert('Project archiving is restricted to organization administrators.')}
          className="px-gutter-lg py-gutter-sm rounded-sm bg-light-error text-light-on-primary hover:opacity-90 font-label text-label-lg transition-opacity cursor-pointer font-medium"
        >
          Archive project
        </button>
      </section>
    </main>
  );
}
