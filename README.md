# Apex Agile — High-Performance Delivery Platform & Jira Evolution

> **Sub-50ms Local-First Jira Alternative** engineered for Senior Scrum Masters, Agile Delivery Leads, and engineering squads. Delivers 100% of Atlassian Jira Software's core hierarchy and backlog mechanics combined with a high-craft Linear/Apple aesthetic, embedded zero-cost SQLite storage, and sub-5ms local queries.

---

## 🏛️ Jira Core Architecture & Evolution

### 1. 3-Tier Issue Hierarchy
* **Tier 1: Epics (Strategic Containers)**
  * Dedicated keys (e.g. `BFSI-E1`), color themes (Purple, Teal, Amber, Blue, Rose), and summaries.
  * Real-time point burnup progress bars (`completed_points / total_points`).
* **Tier 2: Standard Issues (User Stories, Technical Tasks, Defect Bugs)**
  * Full metadata: Epic Link, Component, Fix Version/Release, Labels, Story Points, Original Estimate (h).
* **Tier 3: Sub-tasks (Execution Children)**
  * Owned by parent stories with independent statuses (`todo`, `in_progress`, `done`).
  * Live completion progress bars displayed directly on board and backlog cards (e.g., `2/3 subtasks • 67%`).

### 2. Backlog & Sprint Lifecycle Engine
* **Create Sprint Button:** Prominently located in the Backlog toolbar. Set Sprint Name, Goal, and Duration (`1 wk, 2 wks, 3 wks, 4 wks, custom`).
* **Start Sprint Modal:** Pre-sprint commitment review validating dates, issue count, and total story points.
* **Complete Sprint Ceremony & Rollover:**
  * Freezes completed points for historical velocity tracking.
  * **Interactive Incomplete Issue Rollover:** Incomplete issues can be routed directly to the **Next Sprint** or back to the **Product Backlog Pool** with an automated audit log entry.
* **Collapsible Epics Side Drawer:**
  * Toggleable left panel (`📁 Epics`) in the Backlog.
  * One-click filter: Click any Epic to filter the entire backlog to that Epic only.
  * Point burnup meter for every active Epic.

### 3. Releases & CAB Deployment Hub (Option 1)
* **Fix Version Milestones:** Group deliverables across multiple sprints into versioned releases (e.g., `Release 24.1.0`).
* **Automated Rollup & Progress Metrics:** Live completion meters (`% completed`, resolved vs open points, critical bug counts).
* **1-Click Executive CAB Release Notes Generator:** Generates enterprise-ready Markdown Change Advisory Board (CAB) packages containing:
  * Executive Release Summary
  * Feature Enhancements with Story Point and Ticket Key traceability
  * Defect Remediation with production status
  * Non-Functional / Infrastructure configurations
  * Automated Verification & Rollback Strategy (blue-green routing, canary windows, DBA rollback scripts, SLA error thresholds)
* **Formal Release Ceremony:** 1-click status transition from Unreleased to Released with deployment timestamping.

### 4. Interactive JQL Engine & Saved Filters (Option 2)
* **Real-time Query Parser:** Evaluates structured Jira Query Language syntax in < 1ms client-side:
  * `type = 'bug' AND priority = 'critical'`
  * `blocked = true`
  * `points >= 8`
  * `ac = false` (Missing Definition of Ready / Acceptance Criteria)
  * `status = 'Done'`, `assignee ~ 'sarah'`, `epic = 'BFSI-E1'`
* **Curated Preset Chips:** Quick-toggle one-click filters for P1 Bugs, Active Impediments, Heavy Sizing, and DoR compliance.
* **Instant Match Counter:** Live `X / Y matching` pill on both Sprint Board and Backlog views.

### 5. Live Daily Standup Mode (Scrum Master Walk-the-Board)
* **Dual Alignment Modes:**
  * **Squad Walk Mode:** Top interactive roster queue cycling through squad members (Balaji, Sarah, Alex, David, Priya, Rachel) with individual work spotlights.
  * **Right-to-Left Flow Mode:** Walks the delivery pipeline backward (`Done` $\rightarrow$ `QA` $\rightarrow$ `Code Review` $\rightarrow$ `In Progress` $\rightarrow$ `To Do`), enforcing the core Agile principle of finishing work before starting new tickets.
* **Smart Speaker HUD:**
  * Active speaker countdown timer (60s) with animated progress indicator.
  * Native Web Audio API zero-asset gentle chime synthesizer on timer completion.
  * Keyboard navigation: `Space` (Pause/Play), `N` / `→` (Next Speaker), `R` (Reset 60s), `Esc` (Exit).
* **In-Flight Card Actions:**
  * **1-Click State Advancement:** Directly advance tickets to the next workflow column during the call without leaving Zen mode.
  * **Active Impediment Spotlight:** Instant flagging and clearing of delivery blockers with reasons.

### 6. High-Craft Visual Design & Ergonomics
* **Bespoke Vector Identity (`ApexLogo`):** Precision geometric prism/delta SVG mark — eliminates generic emoji clutter.
* **Collapsible Sidebar:** Smooth animated transition between full navigation (`w-60`) and minimalist icon rail (`w-14`).
* **Restrained Palette & 1px Borders:** Dark zinc (`#09090b`) canvas, 1px subtle borders (`border-white/[0.07]`), Inter + JetBrains Mono typography, strictly capped at 3 font sizes.
* **Dependency Graph & Issue Linking:** Relational links (`blocks`, `is_blocked_by`, `relates_to`, `duplicates`) with visual badges.
* **Dynamic Swimlane Modes:** Group board by Flat, by Epics, or by Squad Assignee.

---

## 🚀 Running the App

```bash
cd /Users/layyzee/Downloads/Deepseek+REA/apex_agile
./start.sh
```

Live at **[http://localhost:3004](http://localhost:3004)**.
