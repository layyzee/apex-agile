---
name: "Atlassian Modern"
description: "A crisp, high-density, light-first project management design system pairing Atlassian cobalt blue with Space Grotesk, Geist, and Space Mono."
---

## Overview

Atlassian Modern is a workspace-first design system built for cross-functional software engineering, product triage, IT service, and project delivery teams. It pairs the clarity and structural rigor of modern enterprise productivity tools with generous breathing room, crisp hairline dividers, and unmistakable status semantics. The interface feels fast, focused, and dependable—never decorative or noisy—so dense issue boards, backlogs, and sprint metadata remain effortless to scan.

## Colors

The palette anchors on Atlassian Cobalt (`#0C66E4` container / `#004FB6` interactive primary) against cool, paper-white surfaces (`#FAF8FF` canvas, `#FFFFFF` elevated cards, `#F2F3FE` subtle column wells). Status and issue-type accents sit at the top level so Work Item types (Story, Bug, Task, Epic) and workflow states (To Do, In Progress, Done) stay consistent across light and dark contexts.

- **Primary:** Cobalt blue for primary actions, active navigation states, focus rings, and interactive links.
- **Surfaces:** Layered neutral-cool grays distinguish the global shell, column tracks, and draggable issue cards without heavy drop shadows.
- **Workflow & Issue Semantics:** Dedicated status and issue-type tokens (`status-done`, `status-progress`, `status-review`, `issue-story`, `issue-bug`, `issue-task`, `issue-epic`) always pair with clear labels or icons—never color alone.

```yaml
colors:
  status-done: "#1F845A"
  status-done-bg: "#DCFFF1"
  status-progress: "#0C66E4"
  status-progress-bg: "#E9F2FF"
  status-review: "#6E5DC6"
  status-review-bg: "#F3F0FF"
  status-warning: "#A54800"
  status-warning-bg: "#FFF7D6"
  issue-story: "#22A06B"
  issue-bug: "#E34935"
  issue-task: "#1D7AFC"
  issue-epic: "#8270DB"
  light:
    primary: "#004FB6"
    on-primary: "#FFFFFF"
    primary-container: "#0C66E4"
    on-primary-container: "#ECEFFF"
    secondary: "#475D90"
    on-secondary: "#FFFFFF"
    secondary-container: "#ADC3FD"
    on-secondary-container: "#394F82"
    tertiary: "#953500"
    on-tertiary: "#FFFFFF"
    tertiary-container: "#BD4600"
    on-tertiary-container: "#FFECE5"
    error: "#BA1A1A"
    on-error: "#FFFFFF"
    error-container: "#FFDAD6"
    on-error-container: "#93000A"
    background: "#FAF8FF"
    on-background: "#191B23"
    surface: "#FAF8FF"
    surface-dim: "#D8D9E4"
    surface-bright: "#FAF8FF"
    surface-container-lowest: "#FFFFFF"
    surface-container-low: "#F2F3FE"
    surface-container: "#ECEDF8"
    surface-container-high: "#E7E7F2"
    surface-container-highest: "#E1E2ED"
    on-surface: "#191B23"
    surface-variant: "#DEE2F3"
    on-surface-variant: "#424654"
    outline: "#727786"
    outline-variant: "#C2C6D7"
    inverse-surface: "#2E3038"
    inverse-on-surface: "#EFF0FB"
    inverse-primary: "#B0C6FF"
    shadow: "#000000"
    scrim: "#000000"
  dark:
    primary: "#B0C6FF"
    on-primary: "#002D6E"
    primary-container: "#0C66E4"
    on-primary-container: "#ECEFFF"
    secondary: "#B0C6FF"
    on-secondary: "#162F5F"
    secondary-container: "#2F4577"
    on-secondary-container: "#9EB4ED"
    tertiary: "#FFB598"
    on-tertiary: "#591D00"
    tertiary-container: "#BD4600"
    on-tertiary-container: "#FFECE5"
    error: "#FFB4AB"
    on-error: "#690005"
    error-container: "#93000A"
    on-error-container: "#FFDAD6"
    background: "#11131B"
    on-background: "#E1E2ED"
    surface: "#11131B"
    surface-dim: "#11131B"
    surface-bright: "#363941"
    surface-container-lowest: "#0B0E15"
    surface-container-low: "#191B23"
    surface-container: "#1D1F27"
    surface-container-high: "#272A32"
    surface-container-highest: "#32353D"
    on-surface: "#E1E2ED"
    surface-variant: "#424654"
    on-surface-variant: "#C2C6D7"
    outline: "#8C90A0"
    outline-variant: "#424654"
    inverse-surface: "#E1E2ED"
    inverse-on-surface: "#2E3038"
    inverse-primary: "#0058CA"
    shadow: "#000000"
    scrim: "#000000"
```

## Typography

**Space Grotesk** gives page headers, board titles, and sprint metrics a crisp geometric authority. **Geist** handles all UI controls, card summaries, comments, and dense table cells with clean neo-grotesque legibility. **Space Mono** renders issue keys (`PLAT-412`), story point counters, and sprint IDs in tabular alignment.

```yaml
typography:
  display-lg:
    fontFamily: "Space Grotesk"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 44px
    letterSpacing: -0.5px
  display-lg-mobile:
    fontFamily: "Space Grotesk"
    fontSize: 28px
    fontWeight: 700
    lineHeight: 34px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: "Space Grotesk"
    fontSize: 28px
    fontWeight: 600
    lineHeight: 34px
    letterSpacing: -0.25px
  headline-md:
    fontFamily: "Space Grotesk"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 28px
    letterSpacing: -0.15px
  headline-sm:
    fontFamily: "Space Grotesk"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 24px
    letterSpacing: 0px
  title-lg:
    fontFamily: "Geist"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 22px
    letterSpacing: 0px
  title-md:
    fontFamily: "Geist"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: 0px
  title-sm:
    fontFamily: "Geist"
    fontSize: 13px
    fontWeight: 600
    lineHeight: 18px
    letterSpacing: 0px
  body-lg:
    fontFamily: "Geist"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 22px
    letterSpacing: 0px
  body-md:
    fontFamily: "Geist"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  body-sm:
    fontFamily: "Geist"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: 0px
  label-lg:
    fontFamily: "Geist"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px
    letterSpacing: 0px
  label-md:
    fontFamily: "Geist"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 16px
    letterSpacing: 0.2px
  label-sm:
    fontFamily: "Geist"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 14px
    letterSpacing: 0.3px
  mono-md:
    fontFamily: "Space Mono"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0px
  mono-sm:
    fontFamily: "Space Mono"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 14px
    letterSpacing: 0px
```

## Layout & Spacing

The desktop workspace uses a persistent 56px top global bar, a 240px collapsible left project sidebar, and a fluid main canvas that adapts cleanly down to tablet and mobile (`390px`) viewports by collapsing the sidebar into a drawer and stacking Kanban columns into horizontal scroll or single-column status tabs. Spacing follows a strict 4px/8px grid.

```yaml
spacing:
  gutter-xs: 4px
  gutter-sm: 8px
  gutter-md: 12px
  gutter-lg: 16px
  gutter-xl: 24px
  section: 32px
  page-margin: 24px
```

## Elevation & Depth

Hierarchy relies on tonal surface stepping and 1px hairline borders (`outline-variant`) rather than heavy drop shadows. Kanban column wells sit on `surface-container-low`, while interactive issue cards sit on `surface-container-lowest` with a crisp 1px border and subtle lift on hover. Floating drawers, popovers, and issue detail panels use `surface-container-lowest` with a soft, diffused shadow.

## Shapes

Corners are purposeful and restrained: compact 4px–6px radii for issue-type badges, lozenges, and buttons; 8px for issue cards and column tracks; 12px for modals and drawers; and full pills (`9999px`) for avatars and story-point counters.

```yaml
rounded:
  sm: 4px
  DEFAULT: 8px
  md: 10px
  lg: 12px
  xl: 16px
  full: 9999px
```

## Motion & Micro-interaction

Interactions feel immediate and tactile. Hover states, filter toggles, and card focus transitions resolve in 100ms. Side drawers and issue detail panels slide in smoothly over 220ms with an ease-out deceleration curve. Nothing loops or animates purely for decoration, and `prefers-reduced-motion` is respected.

```yaml
motion:
  state-change:
    duration: 100ms
    delay: 0ms
    timingFunction: ease-out
  surface-enter:
    duration: 220ms
    delay: 0ms
    timingFunction: cubic-bezier(0.2, 0, 0, 1)
  surface-exit:
    duration: 150ms
    delay: 0ms
    timingFunction: cubic-bezier(0.3, 0, 1, 1)
```

## Voice & Content Strategy

Copy is direct, action-oriented, and free of marketing fluff.

- **Tone:** Crisp, collaborative, and matter-of-fact.
- **Capitalisation:** Sentence case for headings, buttons, and navigation items; uppercase (`label-sm` tracking) only for Kanban column headers (`TO DO`, `IN PROGRESS`, `IN REVIEW`, `DONE`).
- **Terminology:** Consistently use *Issue*, *Sprint*, *Backlog*, *Epic*, and *Story points*.
- **Button Labels:** Specific verb phrases (`Create issue`, `Complete sprint`, `Add comment`), never generic `Submit` or `OK`.
- **Numbers & Dates:** Tabular numerals for story points, issue keys, and sprint countdowns (`6 days remaining`).

## Components

Component implementations live as individual HTML sticker sheet files in
`components/`. Each file contains the canonical, styled HTML components with
`<!-- COMPONENT: name -->` comment markers. Read each file before use.

- **Badge** → `@components/badge.html`: `badge-numeric`, `badge-dot`
- **Button** → `@components/button.html`: `button-primary`, `button-icon`, `button-with-icon`
- **Card** → `@components/card.html`: `card-elevated`, `card-action`, `card-interactive`, `card-interactive-2`
- **Searchbar** → `@components/searchbar.html`: `searchbar-standard`, `searchbar-with-suggestions`
- **Typography** → `@components/typography.html`: `typography-display`, `typography-body`, `typography-label`
