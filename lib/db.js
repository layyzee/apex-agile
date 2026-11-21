import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';

const isVercel = process.env.VERCEL === '1' || Boolean(process.env.VERCEL);
let dbPath = path.join(process.cwd(), 'apex_agile.db');

if (isVercel) {
  const tmpPath = path.join('/tmp', 'apex_agile.db');
  if (!fs.existsSync(tmpPath)) {
    if (fs.existsSync(dbPath)) {
      try {
        fs.copyFileSync(dbPath, tmpPath);
      } catch (e) {
        console.error('Failed to copy db to /tmp, will initialize fresh:', e);
      }
    }
  }
  dbPath = tmpPath;
}

let dbInstance = null;

export function getDb() {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(dbPath);
    initTables(dbInstance);
  }
  return dbInstance;
}

function initTables(db) {
  db.exec(`
    -- 1. Users & Team
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      avatar_initials TEXT NOT NULL,
      capacity_points INTEGER DEFAULT 8,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Projects & Methodologies
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      methodology TEXT CHECK(methodology IN ('scrum', 'kanban')) DEFAULT 'scrum',
      lead_id TEXT,
      lead_name TEXT NOT NULL,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 3. Epics (Tier 1 Strategic Container)
    CREATE TABLE IF NOT EXISTS epics (
      id TEXT PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      project_id TEXT NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT 'purple', -- 'purple', 'teal', 'amber', 'blue', 'rose', 'emerald'
      summary TEXT,
      status TEXT DEFAULT 'in_progress',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    -- 4. Components & Fix Versions
    CREATE TABLE IF NOT EXISTS components (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      name TEXT NOT NULL,
      lead_name TEXT,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS fix_versions (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      release_date TEXT,
      status TEXT CHECK(status IN ('unreleased', 'released', 'archived')) DEFAULT 'unreleased',
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    -- 5. Sprints (Full Lifecycle with Duration & History)
    CREATE TABLE IF NOT EXISTS sprints (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      name TEXT NOT NULL,
      goal TEXT,
      duration_weeks INTEGER DEFAULT 2,
      start_date TEXT,
      end_date TEXT,
      status TEXT CHECK(status IN ('future', 'active', 'closed')) DEFAULT 'future',
      completed_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    -- 6. Workflow States
    CREATE TABLE IF NOT EXISTS workflow_states (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT CHECK(category IN ('todo', 'in_progress', 'done')) NOT NULL,
      position INTEGER NOT NULL DEFAULT 0,
      wip_limit INTEGER DEFAULT 0
    );

    -- 7. Issues (Tier 2 Standard Issue: Story, Bug, Task)
    CREATE TABLE IF NOT EXISTS issues (
      id TEXT PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      project_id TEXT NOT NULL,
      epic_id TEXT,
      sprint_id TEXT,
      parent_id TEXT,
      issue_type TEXT CHECK(issue_type IN ('story', 'task', 'bug', 'epic')) DEFAULT 'story',
      title TEXT NOT NULL,
      description TEXT,
      acceptance_criteria TEXT,
      status_id TEXT NOT NULL,
      priority TEXT CHECK(priority IN ('lowest', 'low', 'medium', 'high', 'critical')) DEFAULT 'medium',
      story_points INTEGER DEFAULT 3,
      original_estimate_hours REAL DEFAULT 0,
      time_spent_hours REAL DEFAULT 0,
      component TEXT,
      fix_version TEXT,
      labels TEXT, -- Comma-separated tags
      assignee TEXT,
      reporter TEXT NOT NULL DEFAULT 'Balaji Palani',
      is_blocked BOOLEAN DEFAULT 0,
      blocked_reason TEXT,
      position REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (epic_id) REFERENCES epics(id) ON DELETE SET NULL,
      FOREIGN KEY (sprint_id) REFERENCES sprints(id) ON DELETE SET NULL,
      FOREIGN KEY (status_id) REFERENCES workflow_states(id)
    );

    -- 8. Subtasks (Tier 3 Child Issue)
    CREATE TABLE IF NOT EXISTS subtasks (
      id TEXT PRIMARY KEY,
      parent_issue_id TEXT NOT NULL,
      title TEXT NOT NULL,
      status TEXT CHECK(status IN ('todo', 'in_progress', 'done')) DEFAULT 'todo',
      assignee TEXT,
      story_points INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_issue_id) REFERENCES issues(id) ON DELETE CASCADE
    );

    -- 9. Issue Links (Dependency Graph)
    CREATE TABLE IF NOT EXISTS issue_links (
      id TEXT PRIMARY KEY,
      source_issue_id TEXT NOT NULL,
      target_issue_id TEXT NOT NULL,
      relationship_type TEXT CHECK(relationship_type IN ('blocks', 'is_blocked_by', 'relates_to', 'duplicates')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (source_issue_id) REFERENCES issues(id) ON DELETE CASCADE,
      FOREIGN KEY (target_issue_id) REFERENCES issues(id) ON DELETE CASCADE
    );

    -- 10. Issue Audit & History
    CREATE TABLE IF NOT EXISTS issue_history (
      id TEXT PRIMARY KEY,
      issue_id TEXT NOT NULL,
      actor TEXT NOT NULL,
      field_changed TEXT NOT NULL,
      old_value TEXT,
      new_value TEXT,
      changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
    );

    -- 11. Automation Rules Engine
    CREATE TABLE IF NOT EXISTS automation_rules (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      trigger_event TEXT NOT NULL,
      condition_rule TEXT NOT NULL,
      action_rule TEXT NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      execution_count INTEGER DEFAULT 0,
      last_run DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_issues_proj ON issues(project_id);
    CREATE INDEX IF NOT EXISTS idx_issues_sprint ON issues(sprint_id);
    CREATE INDEX IF NOT EXISTS idx_issues_epic ON issues(epic_id);
    CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status_id);
    CREATE INDEX IF NOT EXISTS idx_issues_key ON issues(key);
    CREATE INDEX IF NOT EXISTS idx_subtasks_parent ON subtasks(parent_issue_id);
  `);

  const checkPlat = db.prepare('SELECT id FROM projects WHERE id = ?').get('proj-plat');
  if (!checkPlat) {
    seedPlatformCore(db);
  }

  const checkProject = db.prepare('SELECT id FROM projects WHERE id = ?').get('proj-bfsi');
  if (!checkProject) {
    seedData(db);
  }
}

function seedPlatformCore(db) {
  // 1. Team Members from Stitch Design
  const platUsers = [
    { id: 'usr-elena', name: 'Elena Rostova', email: 'elena.rostova@atlassian.modern', role: 'Principal Architect & Lead', avatar: 'ER', cap: 10 },
    { id: 'usr-marcus', name: 'Marcus Vance', email: 'marcus.vance@atlassian.modern', role: 'Staff Frontend Engineer', avatar: 'MV', cap: 8 },
    { id: 'usr-priya-nair', name: 'Priya Nair', email: 'priya.nair@atlassian.modern', role: 'Data & Telemetry Engineer', avatar: 'PN', cap: 8 },
    { id: 'usr-kenji', name: 'Kenji Sato', email: 'kenji.sato@atlassian.modern', role: 'SRE & Platform Architect', avatar: 'KS', cap: 8 },
    { id: 'usr-balaji', name: 'Balaji Palani', email: 'balajinia@gmail.com', role: 'Senior Scrum Master / Delivery Lead', avatar: 'BP', cap: 10 },
  ];
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, name, email, role, avatar_initials, capacity_points)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const u of platUsers) insertUser.run(u.id, u.name, u.email, u.role, u.avatar, u.cap);

  // 2. Canonical Platform Core Project
  db.prepare(`
    INSERT OR IGNORE INTO projects (id, key, name, methodology, lead_id, lead_name, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'proj-plat',
    'PLAT',
    'Platform Core',
    'scrum',
    'usr-elena',
    'Elena Rostova',
    'Core architecture, identity services, telemetry pipelines, and infrastructure platform'
  );

  // 3. 4 Standard Atlassian Columns
  const platStates = [
    { id: 'state-plat-todo', proj: 'proj-plat', name: 'TO DO', category: 'todo', pos: 0, wip: 0 },
    { id: 'state-plat-progress', proj: 'proj-plat', name: 'IN PROGRESS', category: 'in_progress', pos: 1, wip: 4 },
    { id: 'state-plat-review', proj: 'proj-plat', name: 'IN REVIEW', category: 'in_progress', pos: 2, wip: 3 },
    { id: 'state-plat-done', proj: 'proj-plat', name: 'DONE', category: 'done', pos: 3, wip: 0 },
  ];
  const insertState = db.prepare(`
    INSERT OR IGNORE INTO workflow_states (id, project_id, name, category, position, wip_limit)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const s of platStates) insertState.run(s.id, s.proj, s.name, s.category, s.pos, s.wip);

  // 4. PLAT Sprint 42
  db.prepare(`
    INSERT OR IGNORE INTO sprints (id, project_id, name, goal, duration_weeks, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'sprint-plat-42',
    'proj-plat',
    'PLAT Sprint 42: Auth & Telemetry',
    'Auth v3 PKCE rotation, tail-based telemetry sampling, and canary automation',
    2,
    '2026-11-15',
    '2026-11-29',
    'active'
  );

  // 5. Epics from Stitch
  const platEpics = [
    { id: 'epic-plat-auth', key: 'PLAT-380', proj: 'proj-plat', name: 'Auth v3', color: 'purple', summary: 'OAuth2 PKCE token rotation and SAML validation' },
    { id: 'epic-plat-telemetry', key: 'PLAT-392', proj: 'proj-plat', name: 'Telemetry', color: 'blue', summary: 'OpenTelemetry distributed tracing sink and sampling' },
    { id: 'epic-plat-infra', key: 'PLAT-398', proj: 'proj-plat', name: 'Infra', color: 'rose', summary: 'Canary rollback automation and Redis cluster cache' },
    { id: 'epic-plat-design', key: 'PLAT-405', proj: 'proj-plat', name: 'Design System', color: 'emerald', summary: 'Atlassian Modern tokens and column wells' },
  ];
  const insertEpic = db.prepare(`
    INSERT OR IGNORE INTO epics (id, key, project_id, name, color, summary)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const ep of platEpics) insertEpic.run(ep.id, ep.key, ep.proj, ep.name, ep.color, ep.summary);

  // 6. The 10 Canonical Issues from Stitch active_sprint_board
  const platIssues = [
    {
      id: 'iss-plat-418',
      key: 'PLAT-418',
      proj: 'proj-plat',
      epic_id: 'epic-plat-auth',
      sprint_id: 'sprint-plat-42',
      type: 'task',
      title: 'Standardize SSO error states and recovery links',
      desc: 'Audit all OAuth2 callback error states and unify copy with the Atlassian Modern voice guidelines.',
      ac: 'Given an invalid OAuth2 callback\nWhen error state triggers\nThen display standard Atlassian recovery banner with helpdesk link',
      status: 'state-plat-todo',
      priority: 'medium',
      points: 3,
      assignee: 'Marcus Vance',
      pos: 1.0,
    },
    {
      id: 'iss-plat-421',
      key: 'PLAT-421',
      proj: 'proj-plat',
      epic_id: 'epic-plat-telemetry',
      sprint_id: 'sprint-plat-42',
      type: 'story',
      title: 'Add tail-based sampling for webhook worker spans',
      desc: 'Streamline OpenTelemetry trace sampling for high-volume webhook workers without dropping 5xx spans.',
      ac: 'Given incoming webhook volume > 2000 RPS\nWhen sampling decision executes\nThen retain 100% of 5xx errors and 5% of healthy traces',
      status: 'state-plat-todo',
      priority: 'high',
      points: 5,
      assignee: 'Priya Nair',
      pos: 2.0,
    },
    {
      id: 'iss-plat-424',
      key: 'PLAT-424',
      proj: 'proj-plat',
      epic_id: 'epic-plat-infra',
      sprint_id: 'sprint-plat-42',
      type: 'bug',
      title: 'Resolve Redis pool leak on graceful pod drain',
      desc: 'Fix intermittent Redis connection pool exhaustion during blue-green container rollouts.',
      ac: 'Given SIGTERM received on pod drain\nWhen connection pool drains\nThen close all idle TCP sockets within 5000ms',
      status: 'state-plat-todo',
      priority: 'high',
      points: 2,
      assignee: 'Kenji Sato',
      pos: 3.0,
    },
    {
      id: 'iss-plat-412',
      key: 'PLAT-412',
      proj: 'proj-plat',
      epic_id: 'epic-plat-auth',
      sprint_id: 'sprint-plat-42',
      type: 'story',
      title: 'Enforce PKCE token rotation on mobile SSO',
      desc: 'Implement OAuth2 PKCE token refresh worker with exponential backoff and structured audit logging for enterprise workspaces.',
      ac: 'Given valid user biometric authentication\nWhen token refresh initiates\nThen exchange PKCE refresh token with exponential backoff',
      status: 'state-plat-progress',
      priority: 'high',
      points: 5,
      assignee: 'Elena Rostova',
      pos: 4.0,
    },
    {
      id: 'iss-plat-415',
      key: 'PLAT-415',
      proj: 'proj-plat',
      epic_id: 'epic-plat-design',
      sprint_id: 'sprint-plat-42',
      type: 'task',
      title: 'Tokenize Kanban column wells and status lozenges',
      desc: 'Migrate project board filter bar and inline issue status lozenges to Atlassian Modern semantic color tokens.',
      ac: 'Given column container renders\nWhen theme switches\nThen apply #F2F3FE in light and #191B23 in dark mode',
      status: 'state-plat-progress',
      priority: 'medium',
      points: 3,
      assignee: 'Marcus Vance',
      pos: 5.0,
    },
    {
      id: 'iss-plat-419',
      key: 'PLAT-419',
      proj: 'proj-plat',
      epic_id: 'epic-plat-telemetry',
      sprint_id: 'sprint-plat-42',
      type: 'bug',
      title: 'Fix missing X-Tenant-ID on GraphQL batch queries',
      desc: 'Normalize tenant ID headers across GraphQL gateway and REST audit endpoints.',
      ac: 'Given batch query with 10 child operations\nWhen gateway forwards requests\nThen include verified X-Tenant-ID on every upstream sub-call',
      status: 'state-plat-progress',
      priority: 'high',
      points: 3,
      assignee: 'Priya Nair',
      pos: 6.0,
    },
    {
      id: 'iss-plat-408',
      key: 'PLAT-408',
      proj: 'proj-plat',
      epic_id: 'epic-plat-infra',
      sprint_id: 'sprint-plat-42',
      type: 'story',
      title: 'Automated canary rollback on p99 latency spike',
      desc: 'Automate Canary rollback triggers when p99 latency exceeds 450ms for 3 consecutive minutes.',
      ac: 'Given canary deployment active at 10% traffic\nWhen p99 latency > 450ms for 3 minutes\nThen instantly drain canary and revert DNS router',
      status: 'state-plat-review',
      priority: 'high',
      points: 5,
      assignee: 'Kenji Sato',
      pos: 7.0,
    },
    {
      id: 'iss-plat-410',
      key: 'PLAT-410',
      proj: 'proj-plat',
      epic_id: 'epic-plat-auth',
      sprint_id: 'sprint-plat-42',
      type: 'task',
      title: 'Validate SAML 2.0 XML signatures for Okta tenants',
      desc: 'Verify SAML 2.0 metadata XML signature validation against Okta and Azure AD test tenants.',
      ac: 'Given SAML response from Okta\nWhen XML signature is verified\nThen accept only SHA256 RSA signatures with valid x509 cert',
      status: 'state-plat-review',
      priority: 'medium',
      points: 3,
      assignee: 'Elena Rostova',
      pos: 8.0,
    },
    {
      id: 'iss-plat-401',
      key: 'PLAT-401',
      proj: 'proj-plat',
      epic_id: 'epic-plat-auth',
      sprint_id: 'sprint-plat-42',
      type: 'task',
      title: 'Deprecate legacy session cookies in auth gateway',
      desc: 'Remove fallback HMAC session cookie parsing in API gateway routing layer.',
      ac: 'Given legacy HMAC cookie\nWhen request hits gateway\nThen redirect to modern OAuth2 authorization server',
      status: 'state-plat-done',
      priority: 'low',
      points: 3,
      assignee: 'Priya Nair',
      pos: 9.0,
    },
    {
      id: 'iss-plat-404',
      key: 'PLAT-404',
      proj: 'proj-plat',
      epic_id: 'epic-plat-infra',
      sprint_id: 'sprint-plat-42',
      type: 'task',
      title: 'Provision regional Redis replicas in eu-west-1',
      desc: 'Configure multi-AZ automated failover and encryption-in-transit for session cache clusters.',
      ac: 'Given primary node outage\nWhen sentinel detects failure\nThen promote regional replica to master in < 3000ms',
      status: 'state-plat-done',
      priority: 'medium',
      points: 2,
      assignee: 'Kenji Sato',
      pos: 10.0,
    },
  ];

  const insertIssue = db.prepare(`
    INSERT OR IGNORE INTO issues (
      id, key, project_id, epic_id, sprint_id, issue_type, title, description,
      acceptance_criteria, status_id, priority, story_points, original_estimate_hours,
      time_spent_hours, component, fix_version, labels, assignee, is_blocked, blocked_reason, position
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  for (const i of platIssues) {
    insertIssue.run(
      i.id, i.key, i.proj, i.epic_id, i.sprint_id, i.type, i.title, i.desc,
      i.ac, i.status, i.priority, i.points, 16,
      8, 'Identity Core', 'Release 42.0', 'security,sprint42', i.assignee, 0, null, i.pos
    );
  }
}

function seedData(db) {
  // 1. Users
  const users = [
    { id: 'usr-balaji', name: 'Balaji Palani', email: 'balaji@apex.agile', role: 'Scrum Master / Delivery Lead', avatar: 'BP', cap: 10 },
    { id: 'usr-sarah', name: 'Sarah Chen', email: 'sarah.chen@apex.agile', role: 'Senior Backend Engineer', avatar: 'SC', cap: 8 },
    { id: 'usr-alex', name: 'Alex Morgan', email: 'alex.morgan@apex.agile', role: 'Staff Software Engineer', avatar: 'AM', cap: 8 },
    { id: 'usr-david', name: 'David R.', email: 'david.r@apex.agile', role: 'DevOps & Cloud Architect', avatar: 'DR', cap: 6 },
    { id: 'usr-priya', name: 'Priya Sharma', email: 'priya.s@apex.agile', role: 'Product Owner', avatar: 'PS', cap: 5 },
    { id: 'usr-rachel', name: 'Rachel Green', email: 'rachel.g@apex.agile', role: 'QA & Automation Lead', avatar: 'RG', cap: 8 },
  ];
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, role, avatar_initials, capacity_points)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const u of users) insertUser.run(u.id, u.name, u.email, u.role, u.avatar, u.cap);

  // 2. Projects
  const insertProject = db.prepare(`
    INSERT INTO projects (id, key, name, methodology, lead_id, lead_name, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertProject.run(
    'proj-bfsi',
    'BFSI',
    'UK BFSI Banking Programme',
    'scrum',
    'usr-balaji',
    'Balaji Palani (Lead Scrum Master)',
    'Enterprise Open Banking APIs, PSD2 Compliance & Instant Payments Gateway'
  );
  insertProject.run(
    'proj-cloud',
    'OPS',
    'Cloud Core Infrastructure',
    'kanban',
    'usr-david',
    'David R. (Cloud Architect)',
    'Continuous deployment flow, Terraform infrastructure as code & SRE reliability'
  );

  // 3. Epics (Tier 1 Hierarchy)
  const epics = [
    { id: 'epic-bfsi-01', key: 'BFSI-E1', proj: 'proj-bfsi', name: 'Open Banking v3 Gateway', color: 'purple', summary: 'CMA9 mandated PSD2 API gateway, mTLS certificates & OAuth 2.0 PKCE tokens' },
    { id: 'epic-bfsi-02', key: 'BFSI-E2', proj: 'proj-bfsi', name: 'Consumer Duty & Fraud Shield', color: 'teal', summary: 'UK FCA Consumer Duty compliance monitoring & Confirmation of Payee (CoP) verification' },
    { id: 'epic-bfsi-03', key: 'BFSI-E3', proj: 'proj-bfsi', name: 'High-Value Settlement Ledger', color: 'amber', summary: 'Sub-second multi-node transactional ledger for CHAPS and Faster Payments' },
    { id: 'epic-ops-01', key: 'OPS-E1', proj: 'proj-cloud', name: 'Kubernetes Platform Fleet', color: 'blue', summary: 'Multi-region EKS cluster lifecycle & automated node provisioning' },
  ];
  const insertEpic = db.prepare(`
    INSERT INTO epics (id, key, project_id, name, color, summary)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const ep of epics) insertEpic.run(ep.id, ep.key, ep.proj, ep.name, ep.color, ep.summary);

  // 4. Components & Fix Versions
  const components = [
    { id: 'comp-auth', proj: 'proj-bfsi', name: 'Authentication & mTLS' },
    { id: 'comp-ledger', proj: 'proj-bfsi', name: 'Transaction Ledger Core' },
    { id: 'comp-compliance', proj: 'proj-bfsi', name: 'FCA Compliance Engine' },
    { id: 'comp-mobile', proj: 'proj-bfsi', name: 'Mobile Banking SDK' },
    { id: 'comp-k8s', proj: 'proj-cloud', name: 'EKS Infrastructure' },
  ];
  const insertComp = db.prepare(`INSERT INTO components (id, project_id, name) VALUES (?, ?, ?)`);
  for (const c of components) insertComp.run(c.id, c.proj, c.name);

  const versions = [
    { id: 'ver-24-1', proj: 'proj-bfsi', name: 'Release 24.1.0', release_date: '2026-11-30', status: 'unreleased' },
    { id: 'ver-24-2', proj: 'proj-bfsi', name: 'Release 24.2.0', release_date: '2026-12-15', status: 'unreleased' },
    { id: 'ver-ops-131', proj: 'proj-cloud', name: 'K8s 1.31 Fleet', release_date: '2026-12-01', status: 'unreleased' },
  ];
  const insertVer = db.prepare(`INSERT INTO fix_versions (id, project_id, name, release_date, status) VALUES (?, ?, ?, ?, ?)`);
  for (const v of versions) insertVer.run(v.id, v.proj, v.name, v.release_date, v.status);

  // 5. Workflow States
  const states = [
    { id: 'state-todo', proj: 'proj-bfsi', name: 'To Do', category: 'todo', pos: 0, wip: 0 },
    { id: 'state-dev', proj: 'proj-bfsi', name: 'In Progress', category: 'in_progress', pos: 1, wip: 4 },
    { id: 'state-review', proj: 'proj-bfsi', name: 'Code Review', category: 'in_progress', pos: 2, wip: 3 },
    { id: 'state-qa', proj: 'proj-bfsi', name: 'QA & Testing', category: 'in_progress', pos: 3, wip: 3 },
    { id: 'state-done', proj: 'proj-bfsi', name: 'Done', category: 'done', pos: 4, wip: 0 },

    { id: 'state-ops-backlog', proj: 'proj-cloud', name: 'Intake Queue', category: 'todo', pos: 0, wip: 5 },
    { id: 'state-ops-deploying', proj: 'proj-cloud', name: 'Deploying', category: 'in_progress', pos: 1, wip: 2 },
    { id: 'state-ops-validating', proj: 'proj-cloud', name: 'Canary Validation', category: 'in_progress', pos: 2, wip: 2 },
    { id: 'state-ops-live', proj: 'proj-cloud', name: 'Live in Prod', category: 'done', pos: 3, wip: 0 },
  ];
  const insertState = db.prepare(`
    INSERT INTO workflow_states (id, project_id, name, category, position, wip_limit)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const s of states) insertState.run(s.id, s.proj, s.name, s.category, s.pos, s.wip);

  // 6. Sprints
  const insertSprint = db.prepare(`
    INSERT INTO sprints (id, project_id, name, goal, duration_weeks, start_date, end_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertSprint.run(
    'sprint-24-1',
    'proj-bfsi',
    'Sprint 24.1 (Active)',
    'Deliver Open Banking v3 APIs & Automated DoR validation',
    2,
    '2026-11-10',
    '2026-11-24',
    'active'
  );
  insertSprint.run(
    'sprint-24-2',
    'proj-bfsi',
    'Sprint 24.2 (Next)',
    'Consumer Duty Compliance & Real-Time Fraud Notification Engine',
    2,
    '2026-11-25',
    '2026-12-09',
    'future'
  );

  // 7. Issues (Tier 2) with Epic links, Components, Versions, and Labels
  const issues = [
    {
      id: 'iss-101',
      key: 'BFSI-101',
      proj: 'proj-bfsi',
      epic_id: 'epic-bfsi-01',
      sprint_id: 'sprint-24-1',
      type: 'story',
      title: 'Implement OAuth 2.0 PKCE flow for Mobile Banking Client',
      desc: 'As a mobile banking customer, I need a secure PKCE authorization flow so my biometric session tokens cannot be intercepted on public Wi-Fi networks.',
      ac: 'Given valid user biometric authentication\nWhen auth code exchange initiates\nThen verify code_verifier matches code_challenge\nAnd issue short-lived JWT (15 min expiry)',
      status: 'state-dev',
      priority: 'critical',
      points: 5,
      orig_hours: 16,
      spent_hours: 8,
      comp: 'Authentication & mTLS',
      ver: 'Release 24.1.0',
      labels: 'security,pkce,cma9',
      assignee: 'Sarah Chen (Senior Backend Engineer)',
      is_blocked: 0,
      blocked_reason: null,
      pos: 1.0,
    },
    {
      id: 'iss-102',
      key: 'BFSI-102',
      proj: 'proj-bfsi',
      epic_id: 'epic-bfsi-03',
      sprint_id: 'sprint-24-1',
      type: 'bug',
      title: 'Fix transaction ledger race condition under 500 RPS load',
      desc: 'Double-entry ledger balances intermittently drift by 1 pence during simulated multi-node concurrency stress tests in staging.',
      ac: 'Given 500 concurrent transfers per second\nWhen balance is debited\nThen database transaction isolation is SERIALIZABLE with zero drift',
      status: 'state-review',
      priority: 'high',
      points: 8,
      orig_hours: 24,
      spent_hours: 18,
      comp: 'Transaction Ledger Core',
      ver: 'Release 24.1.0',
      labels: 'concurrency,p1-bug,chaps',
      assignee: 'Alex Morgan (Staff Software Engineer)',
      is_blocked: 1,
      blocked_reason: 'Waiting for staging DB replica read-lock upgrade from DBA team.',
      pos: 2.0,
    },
    {
      id: 'iss-103',
      key: 'BFSI-103',
      proj: 'proj-bfsi',
      epic_id: 'epic-bfsi-01',
      sprint_id: 'sprint-24-1',
      type: 'story',
      title: 'Automated DoR / DoD gate enforcement before Sprint Planning',
      desc: 'Implement automated check to ensure stories in the Sprint Backlog contain complete INVEST criteria and verified acceptance tests.',
      ac: 'Given a story is dragged into an Active Sprint\nWhen Acceptance Criteria is empty or points are unset\nThen alert Scrum Master and reject drop until DoR passes',
      status: 'state-qa',
      priority: 'high',
      points: 3,
      orig_hours: 12,
      spent_hours: 10,
      comp: 'Authentication & mTLS',
      ver: 'Release 24.1.0',
      labels: 'dor,invest,scrum',
      assignee: 'Balaji Palani (Scrum Master / Delivery Lead)',
      is_blocked: 0,
      blocked_reason: null,
      pos: 3.0,
    },
    {
      id: 'iss-104',
      key: 'BFSI-104',
      proj: 'proj-bfsi',
      epic_id: 'epic-bfsi-01',
      sprint_id: 'sprint-24-1',
      type: 'task',
      title: 'Configure UK Open Banking Directory mTLS cert renewal cron',
      desc: 'Automate weekly mutual TLS cryptographic certificate health check and alerting via Slack / PagerDuty.',
      ac: 'Given cert expires in < 14 days\nWhen cron runs at 03:00 UTC\nThen trigger high-priority alert and auto-generate renewal CSR',
      status: 'state-done',
      priority: 'medium',
      points: 2,
      orig_hours: 8,
      spent_hours: 8,
      comp: 'Authentication & mTLS',
      ver: 'Release 24.1.0',
      labels: 'devops,mtls,cron',
      assignee: 'David R. (DevOps & Cloud Architect)',
      is_blocked: 0,
      blocked_reason: null,
      pos: 4.0,
    },
    {
      id: 'iss-105',
      key: 'BFSI-105',
      proj: 'proj-bfsi',
      epic_id: 'epic-bfsi-02',
      sprint_id: 'sprint-24-1',
      type: 'story',
      title: 'Audit logging for High Net Worth outbound wire transfers (>£50k)',
      desc: 'Regulatory mandate: All wire transfers exceeding £50,000 must emit immutable audit log to FCA compliance stream.',
      ac: 'Given transfer amount > £50,000\nWhen approved by secondary authorizer\nThen append cryptographic hash of transaction payload to compliance ledger',
      status: 'state-todo',
      priority: 'critical',
      points: 5,
      orig_hours: 16,
      spent_hours: 0,
      comp: 'FCA Compliance Engine',
      ver: 'Release 24.1.0',
      labels: 'fca,audit,compliance',
      assignee: 'Sarah Chen (Senior Backend Engineer)',
      is_blocked: 0,
      blocked_reason: null,
      pos: 5.0,
    },
    {
      id: 'iss-106',
      key: 'BFSI-106',
      proj: 'proj-bfsi',
      epic_id: 'epic-bfsi-02',
      sprint_id: 'sprint-24-2',
      type: 'story',
      title: 'Consumer Duty Vulnerable Customer real-time detection flag',
      desc: 'Identify sudden transaction spikes indicating financial distress or coercive control under UK FCA Consumer Duty guidelines.',
      ac: 'Given suspicious repetitive micro-withdrawals\nWhen risk model score > 82\nThen raise soft verification prompt in mobile app',
      status: 'state-todo',
      priority: 'high',
      points: 8,
      orig_hours: 24,
      spent_hours: 0,
      comp: 'FCA Compliance Engine',
      ver: 'Release 24.2.0',
      labels: 'consumer-duty,fraud,ai-model',
      assignee: 'Rachel Green (QA & Automation Lead)',
      is_blocked: 0,
      blocked_reason: null,
      pos: 1.0,
    },
    {
      id: 'iss-107',
      key: 'BFSI-107',
      proj: 'proj-bfsi',
      epic_id: 'epic-bfsi-02',
      sprint_id: null,
      type: 'story',
      title: 'Integrate Confirmation of Payee (CoP) API v2',
      desc: 'Prevent authorized push payment (APP) bank transfer fraud by verifying payee name against recipient bank records.',
      ac: 'Given user enters sort code and account number\nWhen CoP API is called\nThen return Match, Close Match, or No Match modal before fund release',
      status: 'state-todo',
      priority: 'medium',
      points: 5,
      orig_hours: 16,
      spent_hours: 0,
      comp: 'FCA Compliance Engine',
      ver: 'Release 24.2.0',
      labels: 'cop,fraud-prevention',
      assignee: 'Unassigned',
      is_blocked: 0,
      blocked_reason: null,
      pos: 2.0,
    },
    {
      id: 'iss-201',
      key: 'OPS-101',
      proj: 'proj-cloud',
      epic_id: 'epic-ops-01',
      sprint_id: null,
      type: 'task',
      title: 'Upgrade EKS Kubernetes Cluster to v1.31 in Ireland Region',
      desc: 'Roll out automated blue-green node pool update across AWS eu-west-1.',
      ac: 'Given worker nodes running v1.30\nWhen upgrade pipeline triggers\nThen drain nodes sequentially with zero ingress downtime',
      status: 'state-ops-deploying',
      priority: 'critical',
      points: 5,
      orig_hours: 12,
      spent_hours: 6,
      comp: 'EKS Infrastructure',
      ver: 'K8s 1.31 Fleet',
      labels: 'eks,aws,k8s-upgrade',
      assignee: 'David R. (DevOps & Cloud Architect)',
      is_blocked: 0,
      blocked_reason: null,
      pos: 1.0,
    }
  ];

  const insertIssue = db.prepare(`
    INSERT INTO issues (
      id, key, project_id, epic_id, sprint_id, issue_type, title, description,
      acceptance_criteria, status_id, priority, story_points, original_estimate_hours,
      time_spent_hours, component, fix_version, labels, assignee,
      reporter, is_blocked, blocked_reason, position
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      'Balaji Palani', ?, ?, ?
    )
  `);

  for (const it of issues) {
    insertIssue.run(
      it.id,
      it.key,
      it.proj,
      it.epic_id,
      it.sprint_id,
      it.type,
      it.title,
      it.desc,
      it.ac,
      it.status,
      it.priority,
      it.points,
      it.orig_hours,
      it.spent_hours,
      it.comp,
      it.ver,
      it.labels,
      it.assignee,
      it.is_blocked,
      it.blocked_reason,
      it.pos
    );
  }

  // 8. Subtasks (Tier 3 Children)
  const subtasks = [
    { id: 'sub-101-1', parent: 'iss-101', title: 'Write RFC 7636 PKCE crypto verification helper in Go/Node', status: 'done', assignee: 'Sarah Chen', points: 2 },
    { id: 'sub-101-2', parent: 'iss-101', title: 'Implement Secure Enclave Keychain token storage for iOS', status: 'in_progress', assignee: 'Sarah Chen', points: 2 },
    { id: 'sub-101-3', parent: 'iss-101', title: 'Unit test 15-minute token expiry & silent refresh handling', status: 'todo', assignee: 'Rachel Green', points: 1 },

    { id: 'sub-102-1', parent: 'iss-102', title: 'Reproduce concurrency race with 500 virtual users in k6 script', status: 'done', assignee: 'Alex Morgan', points: 3 },
    { id: 'sub-102-2', parent: 'iss-102', title: 'Rewrite debit transaction isolation to Postgres SERIALIZABLE', status: 'in_progress', assignee: 'Alex Morgan', points: 3 },
    { id: 'sub-102-3', parent: 'iss-102', title: 'Run database load soak test with zero pence drift', status: 'todo', assignee: 'Alex Morgan', points: 2 },

    { id: 'sub-103-1', parent: 'iss-103', title: 'Build regex parser for Given/When/Then acceptance syntax', status: 'done', assignee: 'Balaji Palani', points: 1 },
    { id: 'sub-103-2', parent: 'iss-103', title: 'Add interactive warning toast on active sprint drop', status: 'done', assignee: 'Balaji Palani', points: 2 },
  ];
  const insertSub = db.prepare(`
    INSERT INTO subtasks (id, parent_issue_id, title, status, assignee, story_points)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const st of subtasks) insertSub.run(st.id, st.parent, st.title, st.status, st.assignee, st.points);

  // 9. Issue Links (Dependency relationships)
  const links = [
    { id: 'lnk-01', src: 'iss-102', tgt: 'iss-101', type: 'blocks' }, // BFSI-102 blocks BFSI-101
    { id: 'lnk-02', src: 'iss-103', tgt: 'iss-101', type: 'relates_to' },
  ];
  const insertLink = db.prepare(`
    INSERT INTO issue_links (id, source_issue_id, target_issue_id, relationship_type)
    VALUES (?, ?, ?, ?)
  `);
  for (const l of links) insertLink.run(l.id, l.src, l.tgt, l.type);

  // 10. Automation Rules
  const rules = [
    {
      id: 'rule-01',
      proj: 'proj-bfsi',
      name: 'Escalate Delivery Blockers to Scrum Master',
      desc: 'When an issue is marked as Blocked, immediately alert Scrum Master Balaji Palani and pin to the Impediments Radar.',
      trigger: 'issue_blocked',
      cond: 'is_blocked == 1',
      action: 'Notify Balaji Palani via Slack & Add to Standup Impediment Digest',
      active: 1,
      runs: 14,
    },
    {
      id: 'rule-02',
      proj: 'proj-bfsi',
      name: 'Enforce Definition of Ready (DoR) Gate',
      desc: 'When an issue is dragged into an Active Sprint, verify Acceptance Criteria and Points exist. If missing, flag as DoR Non-Compliant.',
      trigger: 'status_changed',
      cond: 'sprint_id != null AND (acceptance_criteria == null OR story_points == null)',
      action: 'Flag story as Missing AC & Log Warning in Sprint Health Cockpit',
      active: 1,
      runs: 28,
    },
  ];
  const insertRule = db.prepare(`
    INSERT INTO automation_rules (
      id, project_id, name, description, trigger_event, condition_rule, action_rule, is_active, execution_count, last_run
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);
  for (const r of rules) insertRule.run(r.id, r.proj, r.name, r.desc, r.trigger, r.cond, r.action, r.active, r.runs);
}
