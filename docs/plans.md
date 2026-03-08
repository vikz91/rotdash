# RotDash — Dashboard Improvement Plan (Execution Tracker)

This file is used to track the implementation progress of dashboard improvements.

Cursor agents should **work through tasks sequentially**.

Each task must be completed and verified before moving to the next.

Status values:

```
TODO
IN_PROGRESS
DONE
SKIPPED
```

---

# 0. Rules For Cursor Agents

When implementing tasks:

1. Follow architecture in `docs/architecture.md`
2. Follow product scope in `docs/features.md`
3. Only modify components related to the task
4. Avoid redesigning unrelated UI sections
5. Keep styling consistent with Tailwind + shadcn

Do not introduce new libraries.

---

# 1. Replace "Project Health" With Rot Index

Status: TODO

## Problem

The current **Project Health bar** is ambiguous and unclear.

Users cannot understand what the metric represents.

Current UI:

```
Project Health
██████░░░░
```

## Solution

Replace it with **Rot Index**.

Example:

```
ROT INDEX
62%
```

Meaning:

```
62% of projects are stale, cold, or glacier
```

## Implementation

Tasks:

* calculate percentage of projects where activityStatus ∈ {stale, cold, glacier}
* display percentage
* optionally display progress bar

Component:

```
MostRottingProjects.tsx
```

---

# 2. Improve Next Actions Card Hierarchy

Status: TODO

## Problem

The UI emphasizes project names instead of tasks.

Example:

```
Discord Bot Rewrite
→ Fix slash command handling
```

Users care about **the task**.

## Solution

Swap hierarchy:

```
Fix slash command handling
Discord Bot Rewrite
```

## Implementation

Changes:

* increase task font weight
* reduce project name prominence
* maintain arrow icon for navigation

Component:

```
NextActions.tsx
```

---

# 3. Replace Duplicate Third Card

Status: TODO

## Problem

Cards 2 and 3 both display **Next Actions**, creating redundancy.

## Solution

Replace the third card with:

```
Revive Project
```

Purpose:

Encourage users to resume work on dormant projects.

## Example UI

```
REVIVE A PROJECT

Pet Store
Last updated: 43 days ago

Next task:
Connect print provider

[ Revive Project ]
```

## Implementation

Logic:

* find project with highest rotScore that still has tasks
* display next task
* clicking button opens project modal

Component:

```
ReviveProjectCard.tsx
```

---

# 4. Increase Rot Visibility In Project Cards

Status: TODO

## Problem

Activity status is visually subtle.

Example:

```
glacier
```

This makes scanning difficult.

## Solution

Improve status visibility.

Example:

```
❄ GLACIER
130 days inactive
```

## Implementation

Changes:

* add icon
* increase font size
* increase contrast
* keep left border indicator

Component:

```
ProjectCard.tsx
```

---

# 5. Improve Rot Days Label

Status: TODO

## Problem

Current label:

```
~130d
```

This is unclear.

## Solution

Use descriptive text.

Example:

```
130 days inactive
```

Component:

```
ProjectCard.tsx
```

---

# 6. Add "No Tasks" Filter

Status: TODO

## Problem

Users cannot easily detect projects without tasks.

## Solution

Add filter:

```
No Tasks
```

## Implementation

Update filters section.

Possible filter values:

```
All
No Tasks
With Tasks
```

Component:

```
ProjectFilters.tsx
```

---

# 7. Add Live Notes Widget

Status: TODO

## Purpose

Allow developers to quickly capture thoughts.

## Example UI

```
LIVE NOTES

• remember to setup redis
• fix docker build
• try rust rewrite
```

## Implementation

Features:

* inline editing
* simple text entries
* persistent storage

Component:

```
LiveNotesWidget.tsx
```

Location:

Top section (4th widget).

---

# 8. Add Idea Inbox

Status: TODO

## Purpose

Capture ideas before they become new unfinished repositories.

## Example UI

```
IDEA INBOX

• AI CLI for devops
• macOS automation tool
• rust web framework

+ Capture Idea
```

## Implementation

Features:

* quick add button
* simple list
* editable entries

Component:

```
IdeaInboxWidget.tsx
```

Location:

Lower half of the fourth widget.

---

# 9. Split Fourth Widget

Status: TODO

## Current Plan

The fourth widget should be divided vertically.

Layout:

```
-----------------------
LIVE NOTES
-----------------------
IDEA INBOX
-----------------------
```

## Implementation

Create container component:

```
NotesAndIdeasPanel.tsx
```

Contains:

```
LiveNotesWidget
IdeaInboxWidget
```

---

# 10. Improve Card Hover Feedback

Status: TODO

## Goal

Make project cards easier to scan and interact with.

## Improvements

Hover effects:

```
border highlight
shadow elevation
subtle brightness
```

Example Tailwind:

```
hover:border-emerald-500/50
hover:shadow-lg
transition-all
```

Component:

```
ProjectCard.tsx
```

---

# 12. Final Top Section Layout

Status: TODO

Expected layout:

```
[ Most Rotting ]   [ Next Actions ]   [ Revive Project ]   [ Notes / Ideas ]
```

Ensure responsive behavior:

Desktop:

```
grid-cols-4
```

Tablet:

```
grid-cols-2
```

Mobile:

```
grid-cols-1
```

Component:

```
DashboardTopSection.tsx
```

---

# 13. Final UI Review

Status: TODO

Checklist:

* rot signals visible
* actions easy to identify
* no duplicate widgets
* filters working
* consistent spacing
* hover interactions smooth

---

# Completion Target

When all tasks are DONE:

The dashboard should clearly communicate:

```
1. which projects are rotting
2. what the developer should do next
3. which project deserves revival
4. where ideas and notes can be captured
```

This reinforces the RotDash core concept:

```
Your side projects are rotting.
RotDash helps you revive them.
```
