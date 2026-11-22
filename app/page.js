'use client';

import { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import KanbanBoard from '@/components/KanbanBoard';
import BacklogView from '@/components/BacklogView';
import SummaryDashboardView from '@/components/SummaryDashboardView';
import TimelineView from '@/components/TimelineView';
import IssuesTriageView from '@/components/IssuesTriageView';
import AnalyticsView from '@/components/AnalyticsView';
import AutomationView from '@/components/AutomationView';
import TeamView from '@/components/TeamView';
import SettingsView from '@/components/SettingsView';
import AdminView from '@/components/AdminView';
import ReleasesView from '@/components/ReleasesView';
import CodeDeploymentsView from '@/components/CodeDeploymentsView';
import ProjectsDirectoryView from '@/components/ProjectsDirectoryView';
import ServiceDeskView from '@/components/ServiceDeskView';
import JqlBar from '@/components/JqlBar';
import StandupMode from '@/components/StandupMode';
import IssueDrawer from '@/components/IssueDrawer';
import NewIssueModal from '@/components/NewIssueModal';
import NewProjectModal from '@/components/NewProjectModal';
import LoginModal from '@/components/LoginModal';
import CommandPalette from '@/components/CommandPalette';

export default function ApexAgileApp() {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [issues, setIssues] = useState([]);
  const [states, setStates] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [epics, setEpics] = useState([]);
  const [components, setComponents] = useState([]);
  const [fixVersions, setFixVersions] = useState([]);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  // Sync theme with document.documentElement for Tailwind dark mode
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  // Active view: 'summary' | 'board' | 'timeline' | 'issues' | 'backlog' | 'releases' | 'analytics' | 'automation' | 'team' | 'settings' | 'admin'
  const [activeView, setActiveView] = useState('board');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [jqlQuery, setJqlQuery] = useState('');

  // Modals & Drawers
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isNewIssueOpen, setIsNewIssueOpen] = useState(false);
  const [newIssueSprintId, setNewIssueSprintId] = useState(null);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCmdKOpen, setIsCmdKOpen] = useState(false);
  const [isStandupOpen, setIsStandupOpen] = useState(false);

  // 1. Initial Load: Projects & Users
  useEffect(() => {
    const initApp = async () => {
      try {
        const [resProj, resUsers] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/team'),
        ]);
        const dataProj = await resProj.json();
        const dataUsers = await resUsers.json();

        if (dataProj.success && dataProj.projects?.length > 0) {
          setProjects(dataProj.projects);
          setCurrentProject(dataProj.projects[0]);
        }
        if (dataUsers.success && dataUsers.users?.length > 0) {
          setUsers(dataUsers.users);
          const balaji = dataUsers.users.find(u => u.name && u.name.includes('Balaji'));
          setCurrentUser(balaji || dataUsers.users[0]);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    };
    initApp();
  }, []);

  // 2. Load Project Data whenever currentProject changes
  const loadProjectData = useCallback(async (projId) => {
    if (!projId) return;
    setLoading(true);
    try {
      const [resIssues, resSprints, resEpics, resRules, resVersions] = await Promise.all([
        fetch(`/api/issues?project_id=${projId}`),
        fetch(`/api/sprints?project_id=${projId}`),
        fetch(`/api/epics?project_id=${projId}`),
        fetch(`/api/automation?project_id=${projId}`),
        fetch(`/api/fix-versions?project_id=${projId}`),
      ]);

      const dataIssues = await resIssues.json();
      const dataSprints = await resSprints.json();
      const dataEpics = await resEpics.json();
      const dataRules = await resRules.json();
      const dataVersions = await resVersions.json();

      if (dataIssues.success) {
        setIssues(dataIssues.issues || []);
        setStates(dataIssues.states || []);
        setComponents(dataIssues.components || []);
      }
      if (dataVersions.success) {
        setFixVersions(dataVersions.versions || []);
      } else if (dataIssues.success) {
        setFixVersions(dataIssues.fixVersions || []);
      }
      if (dataSprints.success) {
        setSprints(dataSprints.sprints || []);
      }
      if (dataEpics.success) {
        setEpics(dataEpics.epics || []);
      }
      if (dataRules.success) {
        setRules(dataRules.rules || []);
      }
    } catch (err) {
      console.error('Failed to load project data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentProject?.id) {
      loadProjectData(currentProject.id);
    }
  }, [currentProject?.id, loadProjectData]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdKOpen((prev) => !prev);
        return;
      }

      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if (e.key === 'c' && !isNewIssueOpen && !isCmdKOpen && !isNewProjectOpen && !isLoginOpen && !isStandupOpen) {
        e.preventDefault();
        setIsNewIssueOpen(true);
      }

      if (e.shiftKey && (e.key === 'S' || e.key === 's') && !isNewIssueOpen && !isCmdKOpen) {
        e.preventDefault();
        setIsStandupOpen((prev) => !prev);
      }

      if (e.key === 'Escape') {
        setSelectedIssue(null);
        setIsCmdKOpen(false);
        setIsNewIssueOpen(false);
        setIsLoginOpen(false);
        setIsNewProjectOpen(false);
        setIsStandupOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNewIssueOpen, isCmdKOpen, isNewProjectOpen, isLoginOpen]);

  // Sprint Lifecycle Handlers
  const handleCreateSprint = async (sprintData) => {
    try {
      const res = await fetch('/api/sprints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...sprintData, project_id: currentProject.id }),
      });
      const data = await res.json();
      if (data.success) {
        loadProjectData(currentProject.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartSprint = async (sprintId) => {
    try {
      const res = await fetch('/api/sprints', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sprint_id: sprintId, action: 'start' }),
      });
      const data = await res.json();
      if (data.success) {
        loadProjectData(currentProject.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteSprint = async (sprintId, rolloverDestination) => {
    try {
      const res = await fetch('/api/sprints', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sprint_id: sprintId,
          action: 'complete',
          rollover_destination: rolloverDestination,
        }),
      });
      const data = await res.json();
      if (data.success) {
        loadProjectData(currentProject.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Epic Creation Handler
  const handleCreateEpic = async (epicData) => {
    try {
      const res = await fetch('/api/epics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...epicData, project_id: currentProject.id }),
      });
      const data = await res.json();
      if (data.success && data.epic) {
        loadProjectData(currentProject.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Issue Handlers
  const handleUpdateIssueStatus = async (issueId, targetStatusId) => {
    const targetState = states.find((s) => s.id === targetStatusId);
    const issueObj = issues.find((i) => i.id === issueId);

    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, status_id: targetStatusId } : i))
    );
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue((prev) => ({ ...prev, status_id: targetStatusId }));
    }

    if (issueObj && targetState) {
      toast.success(`${issueObj.key} moved to ${targetState.name}`, {
        description: `Updated status for ${issueObj.title}`
      });
    }

    try {
      await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status_id: targetStatusId }),
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync status transition to database');
      loadProjectData(currentProject.id);
    }
  };

  const handleUpdateStoryPoints = async (issueId, points) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, story_points: points } : i))
    );
    try {
      await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story_points: points }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSprintAssignment = async (issueId, sprintId) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, sprint_id: sprintId } : i))
    );
    try {
      await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sprint_id: sprintId }),
      });
      loadProjectData(currentProject.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveIssue = async (updated) => {
    setIssues((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    try {
      await fetch(`/api/issues/${updated.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    setIssues((prev) => prev.filter((i) => i.id !== issueId));
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue(null);
    }
    try {
      await fetch(`/api/issues/${issueId}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateIssue = async (issueData) => {
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...issueData, project_id: currentProject.id }),
      });
      const data = await res.json();
      if (data.success && data.issue) {
        setIssues((prev) => [data.issue, ...prev]);
        setSelectedIssue(data.issue);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      const data = await res.json();
      if (data.success && data.project) {
        setProjects((prev) => [...prev, data.project]);
        setCurrentProject(data.project);
        setActiveView('board');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUsers((prev) => [...prev, data.user]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleRule = async (ruleId, isActive) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, is_active: isActive ? 1 : 0 } : r))
    );
    try {
      await fetch('/api/automation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ruleId, is_active: isActive }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRule = async (ruleData) => {
    try {
      const res = await fetch('/api/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleData),
      });
      const data = await res.json();
      if (data.success && data.rule) {
        setRules((prev) => [...prev, data.rule]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fix Versions & CAB Release Handlers
  const handleCreateVersion = async (versionData) => {
    try {
      const res = await fetch('/api/fix-versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(versionData),
      });
      const data = await res.json();
      if (data.success) {
        if (currentProject?.id) {
          loadProjectData(currentProject.id);
        }
      }
    } catch (err) {
      console.error('Failed to create version:', err);
    }
  };

  const handleReleaseVersion = async (versionId) => {
    try {
      const res = await fetch('/api/fix-versions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: versionId, status: 'released' }),
      });
      const data = await res.json();
      if (data.success) {
        if (currentProject?.id) {
          loadProjectData(currentProject.id);
        }
      }
    } catch (err) {
      console.error('Failed to release version:', err);
    }
  };

  const handleToggleBlocker = async (issueId, isBlocked, reason = '') => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId
          ? { ...i, is_blocked: isBlocked ? 1 : 0, blocked_reason: reason }
          : i
      )
    );
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue((prev) => ({
        ...prev,
        is_blocked: isBlocked ? 1 : 0,
        blocked_reason: reason,
      }));
    }
    try {
      await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_blocked: isBlocked ? 1 : 0, blocked_reason: reason }),
      });
    } catch (err) {
      console.error('Failed to toggle blocker:', err);
    }
  };

  // Helper: Evaluates structured JQL or text search across issues
  const evaluateJql = (issue, jql) => {
    if (!jql || !jql.trim()) return true;
    const clean = jql.trim();
    const clauses = clean.split(/\s+AND\s+/i);

    for (const rawClause of clauses) {
      const clause = rawClause.trim();
      if (!clause) continue;

      const match = clause.match(/^(\w+)\s*(>=|<=|!=|=|>|<|~)\s*['"]?([^'"]+)['"]?$/i);
      if (!match) {
        const q = clause.toLowerCase();
        const textMatch =
          (issue.title && issue.title.toLowerCase().includes(q)) ||
          (issue.key && issue.key.toLowerCase().includes(q)) ||
          (issue.assignee && issue.assignee.toLowerCase().includes(q));
        if (!textMatch) return false;
        continue;
      }

      const field = match[1].toLowerCase();
      const op = match[2];
      let val = match[3].trim().toLowerCase();

      let issueVal = null;
      if (field === 'type' || field === 'issuetype') {
        issueVal = (issue.issue_type || '').toLowerCase();
      } else if (field === 'priority') {
        issueVal = (issue.priority || '').toLowerCase();
      } else if (field === 'blocked') {
        issueVal = issue.is_blocked === 1 ? 'true' : 'false';
      } else if (field === 'points' || field === 'story_points') {
        issueVal = Number(issue.story_points) || 0;
        val = Number(val) || 0;
      } else if (field === 'ac' || field === 'acceptance_criteria') {
        const hasAc = issue.acceptance_criteria && issue.acceptance_criteria.trim().length > 0;
        issueVal = hasAc ? 'true' : 'false';
      } else if (field === 'status') {
        const stateObj = states.find((s) => s.id === issue.status_id);
        issueVal = (stateObj?.name || '').toLowerCase();
      } else if (field === 'assignee') {
        issueVal = (issue.assignee || '').toLowerCase();
      } else if (field === 'epic') {
        const epicObj = epics.find((e) => e.id === issue.epic_id);
        issueVal = (epicObj?.key || issue.epic_id || '').toLowerCase();
      } else if (field === 'version' || field === 'fixversion') {
        issueVal = (issue.fix_version || '').toLowerCase();
      } else {
        issueVal = (issue[field] || '').toString().toLowerCase();
      }

      if (typeof issueVal === 'number' && typeof val === 'number') {
        if (op === '=' && issueVal !== val) return false;
        if (op === '!=' && issueVal === val) return false;
        if (op === '>=' && issueVal < val) return false;
        if (op === '<=' && issueVal > val) return false;
        if (op === '>' && issueVal <= val) return false;
        if (op === '<' && issueVal >= val) return false;
      } else {
        const sIssueVal = String(issueVal).toLowerCase();
        const sVal = String(val).toLowerCase();
        if (op === '=' && sIssueVal !== sVal) return false;
        if (op === '!=' && sIssueVal === sVal) return false;
        if (op === '~' && !sIssueVal.includes(sVal)) return false;
      }
    }
    return true;
  };

  // Filtering
  const filteredIssues = issues.filter((i) => {
    if (jqlQuery && !evaluateJql(i, jqlQuery)) {
      return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        i.title.toLowerCase().includes(q) ||
        i.key.toLowerCase().includes(q) ||
        (i.assignee && i.assignee.toLowerCase().includes(q)) ||
        (i.labels && i.labels.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (activeFilter === 'my') {
      const myName = (currentUser?.name || 'balaji').toLowerCase();
      return (i.assignee || '').toLowerCase().includes(myName);
    }
    if (activeFilter === 'blocked') {
      return i.is_blocked === 1;
    }
    if (activeFilter === 'dor') {
      return !i.acceptance_criteria || i.acceptance_criteria.trim() === '';
    }

    return true;
  });

  const activeSprint = sprints.find((s) => s.status === 'active') || sprints[0];
  const activeSprintIssues = currentProject?.methodology === 'kanban'
    ? filteredIssues
    : filteredIssues.filter((i) => i.sprint_id === (activeSprint?.id || 'sprint-24-1'));

  const sprintStats = {
    total_points: activeSprintIssues.reduce((sum, i) => sum + (Number(i.story_points) || 0), 0),
    completed_points: activeSprintIssues
      .filter((i) => {
        const state = states.find((s) => s.id === i.status_id);
        return state?.category === 'done';
      })
      .reduce((sum, i) => sum + (Number(i.story_points) || 0), 0),
  };

  return (
    <div className={`flex h-screen bg-[var(--bg-canvas)] text-[var(--text-main)] overflow-hidden transition-colors duration-150 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* 1. Global Left Sidebar */}
      <Sidebar
        projects={projects}
        currentProject={currentProject}
        onSelectProject={(p) => {
          setCurrentProject(p);
          setActiveView('board');
        }}
        onNewProject={() => setIsNewProjectOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Toaster Notifications */}
        <Toaster position="top-right" richColors closeButton />

        {/* Persistent Header */}
        <Header
          activeTab={activeView}
          setActiveTab={setActiveView}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNewIssue={() => {
            setNewIssueSprintId(activeSprint?.id || null);
            setIsNewIssueOpen(true);
          }}
          onOpenCommandPalette={() => setIsCmdKOpen(true)}
          onOpenStandup={() => setIsStandupOpen(true)}
          activeSprint={activeSprint}
          sprintStats={sprintStats}
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
          currentUser={currentUser}
          users={users}
          onSelectUser={(u) => setCurrentUser(u)}
          onOpenLogin={() => setIsLoginOpen(true)}
          onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        {/* Real-time Interactive JQL Bar (Desktop only on Board and Backlog views) */}
        {(activeView === 'board' || activeView === 'backlog') && (
          <div className="hidden md:block">
            <JqlBar
              jqlQuery={jqlQuery}
              setJqlQuery={setJqlQuery}
              matchingCount={activeView === 'board' ? activeSprintIssues.length : filteredIssues.length}
              totalCount={activeView === 'board' ? issues.filter(i => currentProject?.methodology === 'kanban' || i.sprint_id === (activeSprint?.id || 'sprint-24-1')).length : issues.length}
            />
          </div>
        )}

        {/* View Router */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-3 text-zinc-400 font-mono text-xs">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading {currentProject?.name}...</span>
              </div>
            </div>
          ) : (
            <>
              {activeView === 'summary' && (
                <SummaryDashboardView
                  currentProject={currentProject}
                  activeSprint={activeSprint}
                  issues={issues}
                  states={states}
                  users={users}
                  epics={epics}
                  sprints={sprints}
                  onSelectIssue={(iss) => setSelectedIssue(iss)}
                  setActiveView={setActiveView}
                />
              )}

              {activeView === 'timeline' && (
                <TimelineView
                  currentProject={currentProject}
                  epics={epics}
                  issues={issues}
                  states={states}
                  users={users}
                  sprints={sprints}
                  onCreateEpic={handleCreateEpic}
                  onCreateIssue={handleCreateIssue}
                  onSelectIssue={(iss) => setSelectedIssue(iss)}
                  setActiveView={setActiveView}
                />
              )}

              {activeView === 'issues' && (
                <IssuesTriageView
                  currentProject={currentProject}
                  issues={filteredIssues}
                  states={states}
                  epics={epics}
                  sprints={sprints}
                  onSelectIssue={(iss) => setSelectedIssue(iss)}
                  onUpdateIssueStatus={handleUpdateIssueStatus}
                  onNewIssue={() => {
                    setNewIssueSprintId(activeSprint?.id || null);
                    setIsNewIssueOpen(true);
                  }}
                  setActiveView={setActiveView}
                />
              )}

              {activeView === 'board' && (
                <KanbanBoard
                  states={states}
                  issues={activeSprintIssues}
                  epics={epics}
                  activeSprint={activeSprint}
                  selectedIssueId={selectedIssue?.id}
                  onSelectIssue={(iss) => setSelectedIssue(iss)}
                  onUpdateIssueStatus={handleUpdateIssueStatus}
                  onCompleteSprint={() => setActiveView('backlog')}
                  onOpenStandup={() => setIsStandupOpen(true)}
                />
              )}

              {activeView === 'backlog' && (
                <BacklogView
                  sprints={sprints}
                  issues={filteredIssues}
                  epics={epics}
                  users={users}
                  currentUser={currentUser}
                  onSelectIssue={(iss) => setSelectedIssue(iss)}
                  onUpdateSprintAssignment={handleUpdateSprintAssignment}
                  onUpdateStoryPoints={handleUpdateStoryPoints}
                  onCreateIssue={handleCreateIssue}
                  onNewIssueWithSprint={(sId) => {
                    setNewIssueSprintId(sId);
                    setIsNewIssueOpen(true);
                  }}
                  onCreateSprint={handleCreateSprint}
                  onStartSprint={handleStartSprint}
                  onCompleteSprint={handleCompleteSprint}
                  onCreateEpic={handleCreateEpic}
                />
              )}

              {activeView === 'releases' && (
                <ReleasesView
                  versions={fixVersions}
                  currentProject={currentProject}
                  onCreateVersion={handleCreateVersion}
                  onReleaseVersion={handleReleaseVersion}
                />
              )}

              {activeView === 'code' && (
                <CodeDeploymentsView
                  currentProject={currentProject}
                  onSelectIssue={(iss) => {
                    const match = issues.find((i) => i.key === iss.key) || iss;
                    setSelectedIssue(match);
                  }}
                />
              )}

              {activeView === 'projects' && (
                <ProjectsDirectoryView
                  projects={projects}
                  currentProject={currentProject}
                  onSelectProject={(p) => {
                    setCurrentProject(p);
                    setActiveView('board');
                  }}
                  onNewProject={() => setIsNewProjectOpen(true)}
                  setActiveView={setActiveView}
                />
              )}

              {activeView === 'servicedesk' && (
                <ServiceDeskView
                  setActiveView={setActiveView}
                />
              )}

              {activeView === 'analytics' && (
                <AnalyticsView
                  activeSprint={activeSprint}
                  sprintStats={sprintStats}
                  issues={issues}
                  states={states}
                  sprints={sprints}
                  currentProject={currentProject}
                  setActiveView={setActiveView}
                />
              )}

              {activeView === 'automation' && (
                <AutomationView
                  rules={rules}
                  currentProject={currentProject}
                  onToggleRule={handleToggleRule}
                  onCreateRule={handleCreateRule}
                />
              )}

              {activeView === 'team' && (
                <TeamView
                  users={users}
                  onAddUser={handleAddUser}
                />
              )}

              {activeView === 'settings' && (
                <SettingsView
                  currentProject={currentProject}
                  states={states}
                  onSaveProject={(updated) => {
                    setCurrentProject(updated);
                    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
                  }}
                />
              )}

              {activeView === 'admin' && (
                <AdminView
                  projects={projects}
                  users={users}
                  issues={issues}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Slide-over Issue Drawer */}
      {selectedIssue && (
        <IssueDrawer
          issue={selectedIssue}
          states={states}
          sprints={sprints}
          epics={epics}
          allIssues={issues}
          components={components}
          fixVersions={fixVersions}
          onClose={() => setSelectedIssue(null)}
          onSaveIssue={handleSaveIssue}
          onDeleteIssue={handleDeleteIssue}
        />
      )}

      {/* New Issue Modal */}
      {isNewIssueOpen && (
        <NewIssueModal
          sprints={sprints}
          states={states}
          epics={epics}
          components={components}
          fixVersions={fixVersions}
          defaultSprintId={newIssueSprintId}
          onClose={() => setIsNewIssueOpen(false)}
          onCreate={handleCreateIssue}
        />
      )}

      {/* New Project Modal */}
      {isNewProjectOpen && (
        <NewProjectModal
          onClose={() => setIsNewProjectOpen(false)}
          onCreate={handleCreateProject}
        />
      )}

      {/* Login & Role Persona Modal */}
      {isLoginOpen && (
        <LoginModal
          users={users}
          currentUser={currentUser}
          onSelectUser={(u) => setCurrentUser(u)}
          onUserCreated={(newUser) => setUsers((prev) => [...prev, newUser])}
          onClose={() => setIsLoginOpen(false)}
        />
      )}

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={isCmdKOpen}
        onClose={() => setIsCmdKOpen(false)}
        issues={issues}
        onSelectIssue={(iss) => setSelectedIssue(iss)}
      />

      {/* Live Daily Standup Mode */}
      <StandupMode
        isOpen={isStandupOpen}
        onClose={() => setIsStandupOpen(false)}
        users={users}
        issues={activeSprintIssues}
        states={states}
        activeSprint={activeSprint}
        onUpdateIssueStatus={handleUpdateIssueStatus}
        onToggleBlocker={handleToggleBlocker}
      />
    </div>
  );
}
