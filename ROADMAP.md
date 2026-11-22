# ⚡ Apex Agile — Master Project Roadmap & Screen Checklist

**Product:** Apex Agile (Sub-50ms Local-First Jira Alternative & Scrum Master Delivery Platform)  
**Specification Source:** 17-Screen Atlassian Modern Stitch Replica (`stitch_modern_jira_clone_replica.zip`)  
**Design System:** Atlassian Modern Cobalt Blue (`#0C66E4`), Space Grotesk, Geist & Space Mono  
**Architecture:** 100% Zero-Cost Local-First (Next.js 16 + React 19 + Tailwind CSS + Native `node:sqlite`)  
**Live Production URL:** [https://apex-agile.vercel.app](https://apex-agile.vercel.app)  
**Local Development:** [http://localhost:3004](http://localhost:3004)  
**Last Updated:** November 22, 2026  

---

## 📊 High-Level Phase Overview

| Phase | Focus Area | Status | Screens Covered |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Design System, Core Shell & Mobile Parity** | 100% COMPLETE ✅ | Screen 01, 09, 10, 11, 14, 16 |
| **Phase 2** | **Core Scrum Engines & Delivery Telemetry** | 100% COMPLETE ✅ | Screen 01, 06, 08 |
| **Phase 3** | **Backlog, Epics, Timeline & Agile Estimation** | 100% COMPLETE ✅ | Screen 02, 03, 04, 05 |
| **Phase 4** | **Enterprise Service Desk, Automation & RBAC** | CURRENT FOCUS 🟡 | Screen 12, 13, 15, 17 |
| **Phase 5** | **Offline Packaging & Ecosystem Integration** | FUTURE ⚪ | Desktop App, P2P Sync |

---

## 🎨 17-Screen Stitch Parity Matrix

| Screen # | Stitch Screen Name | Implementation Component | Parity Status | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `active_sprint_board` | `components/KanbanBoard.jsx` | Complete ✅ | 4 Columns, HTML5 D&D, Swimlanes, JQL Bar, Quick Presets |
| **02** | `backlog_sprint_planning`| `components/BacklogView.jsx` | Complete ✅ | Sprint containers, D&D, Planning Poker chamber, INVEST auditor, inline creator |
| **03** | `project_timeline` | `components/TimelineView.jsx` | Complete ✅ | Weeks/Months/Quarters Gantt, full-height TODAY marker, child issue nesting, dependency notice |
| **04** | `summary_dashboard` | `components/SummaryDashboardView.jsx` | Complete ✅ | Project health beacon, 4 KPI cards, segmented status bar, epics burnup, squad capacity |
| **05** | `issues_triage` | `components/IssuesTriageView.jsx` | Complete ✅ | Data table, column sorting, batch selection, CSV export |
| **06** | `releases_versions` | `components/ReleasesView.jsx` | Complete ✅ | Fix Versions, CAB Release Notes generator in Markdown |
| **07** | `project_settings` | `components/SettingsView.jsx` | Built 🟡 | Project details, default assignees, workflow schemes |
| **08** | `reports_velocity` | `components/AnalyticsView.jsx` | Complete ✅ | Cumulative Flow (CFD) with scrubber, S38-S42 Velocity, Burndown |
| **09** | `mobile_sprint_board` | `components/KanbanBoard.jsx` (Mobile) | Complete ✅ | Single-column pill tabs, compact cards, zero clipping |
| **10** | `mobile_issue_detail` | `components/IssueDrawer.jsx` (Mobile) | Complete ✅ | Responsive slide-over drawer, status dropdown, subtasks |
| **11** | `active_sprint_board_dark`| `app/globals.css` + `Header.jsx` | Complete ✅ | `#11131B` Dark canvas, contrast-tested badges, theme toggle |
| **12** | `service_desk_queue_sla` | `components/ServiceDeskView.jsx` | Built ⚪ | Ticket queues, SLA breach counters, customer requests |
| **13** | `jira_automation_rules` | `components/AutomationView.jsx` | Built ⚪ | Trigger → Condition → Action rule engine, execution logs |
| **14** | `sign_in_sign_up` | `components/LoginModal.jsx` | Complete ✅ | Google / Atlassian SSO / Email sign-in with demo credentials |
| **15** | `admin_portal_rbac` | `components/AdminView.jsx` | Built ⚪ | Team seats, license allocation, RBAC permissions matrix |
| **16** | `projects_directory` | `components/ProjectsDirectoryView.jsx` | Complete ✅ | Multi-project cards, categories, star favorites, New Project |
| **17** | `code_deployments` | `components/CodeDeploymentsView.jsx` | Built ⚪ | Git branch links, commit SHA badges, environment rollback |

---

## ✅ Phase 1: Core Shell, Mobile Parity & Design System (COMPLETE)

*Goal: Establish sub-50ms local SQLite data layer and 1:1 Atlassian Modern design tokens across desktop and mobile.*

- [x] **1.1 Design System Tokens & Styling (`app/globals.css`)**
  - [x] Atlassian Cobalt Blue (`#0C66E4`), dark canvas (`#11131B`), and light surface container (`#FAF8FF`).
  - [x] Material Symbols Outlined font embedding via Google Fonts woff2.
  - [x] Typography tokens: Space Grotesk (display/headers), Geist (body/controls), Space Mono / Tabular numbers.
  - [x] Strict **Borders over Shadows** policy (`1px border-slate-200/80` or `1px border-white/10`).
- [x] **1.2 Global Shell & Navigation (`components/Header.jsx` & `components/Sidebar.jsx`)**
  - [x] Top navigation bar with proper token spacing (`Your work`, `Projects`, `Filters`, `Dashboards`, `Teams`).
  - [x] Collapsible sidebar (`w-60` expanded $\leftrightarrow$ `w-14` icon rail).
  - [x] Mobile bottom tab bar (`Board`, `Backlog`, `Issues`, `Summary`).
  - [x] Resilient initials Avatar component (`components/Avatar.jsx`) with dynamic color hashing.
- [x] **1.3 Zero-Cost Embedded SQLite Engine (`lib/db.js`)**
  - [x] Native Node.js `node:sqlite` with zero binary C++ dependencies.
  - [x] Tables for `projects`, `users`, `sprints`, `epics`, `issues`, `subtasks`, `fix_versions`, and `automation_rules`.
  - [x] Serverless `/tmp` database seeding for instantaneous Vercel deployments.

---

## ✅ Phase 2: Core Scrum Engines & Delivery Telemetry (COMPLETE)

*Goal: Build full active sprint lifecycle, daily standup mode, and executive velocity analytics.*

- [x] **2.1 Active Sprint Kanban Board (`components/KanbanBoard.jsx`)**
  - [x] 4 Columns (`TO DO`, `IN PROGRESS`, `IN REVIEW`, `DONE`) with real-time WIP capacity alerts.
  - [x] HTML5 drag-and-drop issue status transitions with optimistic UI updates.
  - [x] Client-side JQL Engine (`components/JqlBar.jsx`) with preset quick chips (`P1 Critical Bugs`, `Active Impediments`, `Heavy Sizing >= 8pts`, `Missing DoR / AC`).
  - [x] Board swimlanes (`Flat`, `By Epics`, `By Assignee`).
- [x] **2.2 Reports & Velocity Analytics (`components/AnalyticsView.jsx`)**
  - [x] **Interactive Cumulative Flow Diagram (CFD):** SVG stacked area chart with Day 1–10 interactive scrubber updating active WIP and completed counts.
  - [x] **Little's Law Telemetry:** Real-time lead time calculation ($\text{Lead Time} = \text{WIP} / \text{Throughput}$).
  - [x] **Sprint Velocity Chart:** S38–S42 committed vs. completed vs. in-flight points with rolling average benchmark.
  - [x] **Sprint 42 Burndown:** Ideal guideline trajectory vs. actual remaining points polyline.
  - [x] **Delivery Pipeline WIP Radar:** Capacity progress bars for To Do, In Progress (3/4 WIP), In Review (2/3 WIP), and Done.
  - [x] **1-Click Executive CTAs:** Copy Executive Delivery Memo to clipboard in Markdown, and `window.print()` view.
- [x] **2.3 Daily Standup Presentation Mode (`components/StandupMode.jsx`)**
  - [x] Full-screen Zen meeting layout with 60s per-speaker timer and Web Audio gentle chime.
  - [x] Squad walk roster with active impediment spotlight and Right-to-Left status advancement.
- [x] **2.4 Releases & CAB Hub (`components/ReleasesView.jsx`)**
  - [x] Fix Version release management (`v2.14.0-rc2`).
  - [x] 1-Click Change Advisory Board (CAB) Executive Release Notes generator in formatted Markdown.

---

## ✅ Phase 3: Backlog, Epics, Timeline & Agile Estimation (COMPLETE)

*Goal: Transform backlog grooming, timeline roadmapping, and sprint planning into an interactive, zero-friction experience.*

- [x] **3.1 Interactive Drag & Drop Sprint Backlog Organizer (`components/BacklogView.jsx`)**
  - [x] Drag-and-drop issues between Product Backlog pool and Sprint containers (`Active Sprint`, `Sprint 43 Draft`).
  - [x] Instant recalculation of sprint story point capacity meters as issues are moved.
  - [x] Inline issue creation directly inside any sprint container.
- [x] **3.2 Real-Time Planning Poker Chamber**
  - [x] Synchronized Fibonacci estimation deck (`0, 1, 2, 3, 5, 8, 13, 20, 40, ?`).
  - [x] Simultaneous card reveal animation with consensus meter and 1-click estimation apply.
- [x] **3.3 INVEST Requirement Quality Auditor**
  - [x] Real-time auditor checking user stories for Acceptance Criteria (`No AC`), and sizing bounds (`Split Rec.` on $\ge 8$ points).
- [x] **3.4 Collapsible Epics Panel & Burnup Meters**
  - [x] Slide-out left panel with Epic cards, color swatches, and completion progress bars.
  - [x] 1-click filter board or backlog by selected Epic.
- [x] **3.5 Jira Timeline Feature Parity (`components/TimelineView.jsx`)**
  - [x] Weeks, Months, and Quarters Gantt scale switchers.
  - [x] Full-height vertical TODAY indicator marker across all Gantt rows.
  - [x] Expandable Epic trees with nested child stories and inline "+ Create child issue" prompts.
- [x] **3.6 Jira Summary Dashboard Parity (`components/SummaryDashboardView.jsx`)**
  - [x] Project Health indicator badge ("ON TRACK") with pulsing beacon.
  - [x] 4 Elevated KPI cards (Completed, In Progress & Review WIP, Blockers & Urgent, Scope points).
  - [x] Multi-segment colored status distribution bar with detailed breakdown.
  - [x] Epics strategic burnup table and squad capacity breakdown.

---

## ⚪ Phase 4: Enterprise Service Desk, Automation & RBAC (PLANNED)

*Goal: Complete enterprise workflows for ITSM service desk, custom automation rules, and security controls.*

- [ ] **4.1 ITSM Service Desk Queues & SLA Breach Timers (`components/ServiceDeskView.jsx`)**
  - [ ] Live countdown timers for "Time to first response" and "Time to resolution".
  - [ ] Severity badges (`P1 Outage`, `P2 Major`, `P3 Minor`, `P4 Service Request`).
  - [ ] Auto-sorting queues prioritizing tickets closest to SLA breach.
- [ ] **4.2 Visual No-Code Automation Builder (`components/AutomationView.jsx`)**
  - [ ] Interactive node builder: `When: Issue Created` $\rightarrow$ `If: Priority = Critical` $\rightarrow$ `Then: Assign to On-Call & Set Flag`.
  - [ ] Rule execution history audit stream with success/failure badges.
- [ ] **4.3 CI/CD Commit & Branch Deep Linking (`components/CodeDeploymentsView.jsx`)**
  - [ ] Branch linking (`feature/PLAT-412-pkce-rotation`) with commit SHA pills and pull request review states.
  - [ ] Deployment environment markers (`Staging`, `Canary`, `Production`) with one-click rollback trigger.
- [ ] **4.4 Organization Admin & RBAC Matrix (`components/AdminView.jsx`)**
  - [ ] Role-based access control permission grid (`Administrator`, `Scrum Master`, `Developer`, `Stakeholder`).
  - [ ] Security audit log tracking project deletions, role changes, and sprint state overrides.

---

## ⚪ Phase 5: Offline Packaging & Ecosystem Integration (FUTURE)

*Goal: Make Apex Agile the ultimate personal/team delivery command center across devices.*

- [ ] **5.1 Standalone Desktop Application (macOS & Windows)**
  - [ ] Package into standalone `.dmg` and `.exe` via Pake/Electron with local SQLite auto-boot.
  - [ ] Global system tray icon with quick task creation hotkey (`Cmd+Shift+J`).
- [ ] **5.2 Bi-Directional Atlassian Jira Importer / Exporter**
  - [ ] Import standard Jira project export (JSON/CSV) to migrate existing enterprise backlogs in 5 seconds.
  - [ ] Export sprint audit summaries to Jira-compatible formats.
- [ ] **5.3 3D Portfolio Island Integration (`clash_portfolio_3d`)**
  - [ ] Interactive 3D Agile Command Workshop building on the Three.js village island.
