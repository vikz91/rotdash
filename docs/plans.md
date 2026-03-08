# RotDash — Dashboard Polish & Insight System Plan

This document defines the **next iteration tasks** for RotDash after the current dashboard implementation.

The goal of this phase is **product polish and motivation signals**, not major UI restructuring.

Focus areas:

* momentum feedback
* shipping awareness
* rot awareness
* minor UX improvements
* insight messages

Cursor agents must **execute tasks sequentially**.

---

# Status Values

Each task must have a status.

```id="status_values"
TODO
IN_PROGRESS
DONE
SKIPPED
```

Agents must:

1. find the first TODO
2. implement it
3. update status to DONE

---

# Execution Rules for Cursor

When implementing tasks:

1. Follow `docs/architecture.md`
2. Follow `docs/features.md`
3. Modify only relevant components
4. Avoid changing layout structure
5. Use existing Tailwind + shadcn patterns
6. Do not introduce new libraries

---

# 1. Add Global Insight Banner

Status: DONE

## Purpose

Provide **global project insights** that are not tied to a single project.

Examples:

```id="insight_examples"
⚠ You haven't shipped anything in 38 days
🚀 Last project shipped 2 days ago
🔥 You're on a 4 day build streak
⚠ 58% of your projects are rotting
```

## Placement

show it in navbar beside activity graph

Example layout:

```id="insight_layout"
NAVBAR
-------------------------

⚠ You haven't shipped anything in 38 days

[ dashboard cards ]
```

## Styling

Use subtle visual emphasis.

Example Tailwind:

```id="insight_style"
text-sm
text-amber-400
flex items-center
gap-2
```

Optional background:

```id="insight_bg"
bg-amber-500/10
rounded-md
px-3 py-1
```

## Component

Create:

```id="component_insight"
components/dashboard/GlobalInsightBanner.tsx
```

---

# 2. Implement Build Streak Indicator

Status: DONE

## Purpose

Encourage consistent development activity.

## Location

Navbar status indicator.

Example:

```id="streak_navbar"
🔥 3d
```

Meaning:

```id="streak_meaning"
3 day build streak
```

## Tooltip

```id="streak_tooltip"
Build streak
Worked on a project 3 days in a row
```

Use shadcn tooltip.

## Calculation

Define activity as:

```id="activity_rule"
task completed
OR project updated
```

Simplest rule for MVP:

```id="streak_algo"
use task.completedOn dates
```

Algorithm:

1. start from today
2. count consecutive days with completed tasks
3. stop when day without activity is found

Example:

```
Mar 8 ✓
Mar 7 ✓
Mar 6 ✓
Mar 5 ✗
```

Result:

```
streak = 3
```

## Component

Modify:

```id="navbar_metrics"
NavbarMetrics.tsx
```

---

# 3. Add "Days Since Last Ship" Metric

Status: DONE

## Purpose

Encourage developers to ship more frequently.

## Definition of Ship

Ship event occurs when:

```id="ship_event"
project.status changes to "shipped"
```

Track:

```id="ship_field"
project.lastShippedAt
```

## Calculation

```
daysSinceLastShip = today - lastShippedAt
```

## Usage

Displayed inside **Global Insight Banner**.

Example messages:

```id="ship_messages"
⚠ You haven't shipped anything in 38 days
⏳ Last project shipped 12 days ago
🚀 Last project shipped 2 days ago
```

---

# 4. Add Decay Alert System

Status: DONE

## Purpose

Warn users when projects are approaching glacier state.

## Rule

If project inactivity is close to glacier threshold.

Example:

```id="glacier_rule"
glacier threshold = 60 days
alert when inactivity ≥ 50 days
```

## Example Message

```id="decay_alert_examples"
⚠ 3 projects will become glacier this week
⚠ Portfolio v3 will become glacier in 3 days
```

## Placement

Displayed inside **Global Insight Banner**.

Priority order:

1. decay alerts
2. no shipping warning
3. build streak message

## Component

Extend:

```id="decay_component"
GlobalInsightBanner.tsx
```

---

# 5. Improve Rot Index Visual Hierarchy

Status: DONE

## Problem

Rot index percentage is currently visually weak.

Example:

```
ROT INDEX
58%
```

## Solution

Increase emphasis.

Recommended hierarchy:

```id="rot_index_layout"
ROT INDEX
58%
of projects rotting
```

## Styling

```id="rot_index_style"
text-3xl
font-bold
```

Component:

```
MostRottingProjects.tsx
```

---

# 6. Improve Next Actions Card Hierarchy

Status: DONE

## Problem

Project name currently dominates the card.

Example:

```
Discord Bot Rewrite
Fix slash command handling
```

## Solution

Reverse emphasis.

Example:

```
Fix slash command handling
Discord Bot Rewrite
```

## Implementation

* task title larger
* project name smaller
* retain arrow navigation

Component:

```
NextActions.tsx
```

---

# 7. Add Rot Context to Next Actions

Status: DONE

## Purpose

Reinforce RotDash concept.

Example:

```
Choose design direction
Portfolio v3
120 days inactive
```

Add inactivity indicator below project name.

Component:

```
NextActions.tsx
```

---

# 8. Improve Revive Project Card

Status: DONE

## Problem

Revive card lacks urgency.

Current:

```
Portfolio v3
Last updated 120 days ago
```

## Solution

Add rot badge.

Example:

```
❄ GLACIER
120 days inactive
```

Component:

```
ReviveProjectCard.tsx
```

---

# 9. Strengthen Project Card Rot Signals

Status: DONE

## Goal

Improve scanability of project grid.

Changes:

* larger rot label
* add rot icon
* emphasize inactivity days

Example:

```
❄ GLACIER
120 days inactive
```

Component:

```
ProjectCard.tsx
```

---

# 10. Improve Project Card Hover Feedback

Status: DONE

## Goal

Improve card interaction clarity.

Add stronger hover effect.

Example Tailwind:

```id="hover_effect"
hover:shadow-xl
hover:border-slate-500
hover:scale-[1.01]
transition-all
```

Component:

```
ProjectCard.tsx
```

---

# 11. Improve Live Notes Visual Style

Status: DONE

## Problem

Notes currently feel like raw textarea.

## Solution

Make notes appear as quick capture items.

Example:

```
• remember to setup redis
• fix docker build
• try rust rewrite
```

Future enhancement:

```
Shift+Enter → new note
```

Component:

```
LiveNotesWidget.tsx
```

---

# 12. Improve Idea Inbox Visibility

Status: DONE

## Goal

Improve timestamp readability.

Example:

```
2 days ago
1 week ago
6 months ago
```

Increase contrast slightly.

Component:

```
IdeaInboxWidget.tsx
```

---

# 13. Final UX Review

Status: DONE

Verify the dashboard communicates:

```id="product_goals"
Which projects are rotting
What should be worked on next
Which project should be revived
Whether the developer is shipping regularly
How much project decay exists
```

Ensure:

* no redundant widgets
* clear hierarchy
* consistent spacing
* responsive behavior

---

# Final Success Criteria

The dashboard should clearly communicate:

```id="core_message"
Your side projects are rotting.
RotDash helps you revive them.
```

The user should immediately understand:

1. which projects are dying
2. what they should work on next
3. whether they are making progress
4. whether they are shipping regularly
