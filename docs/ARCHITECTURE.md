# RotDash — Architecture (v1)

This document defines the **technical architecture and development conventions** for RotDash.

The goal is to keep the system:

* simple
* predictable
* easy for AI agents and developers to extend

RotDash v1 is intentionally minimal and optimized for **fast development and clarity**.

---

# 1. System Overview

RotDash is a **single-user web application** that tracks project activity and detects when projects become inactive ("rot").

Core capabilities:

* manage projects
* manage tasks
* compute rot score
* visualize activity trends

Architecture style:

```id="3y4rj8"
Monolithic Next.js application
```

Backend and frontend are contained in the same codebase.

---

# 2. Technology Stack

Framework:

* Next.js (App Router)

UI:

* TailwindCSS
* ShadCN UI

Charts:

* Recharts

Database:

* MongoDB

Runtime:

* Node.js

Deployment:

* Vercel

Local development:

* Docker Compose for MongoDB

---

# 3. High-Level Architecture

```id="8thxru"
Browser
   |
   v
Next.js UI
   |
   v
Next.js API Routes
   |
   v
Service Layer
   |
   v
MongoDB
```

Responsibilities:

UI Layer
Responsible for rendering pages and components.

API Layer
Handles HTTP requests and validation.

Service Layer
Contains business logic.

Database Layer
Handles persistence.

---

# 4. Folder Structure

Recommended project structure:

```id="5dzy7o"
app/
  dashboard/
  api/

components/
  dashboard/
  project/
  tasks/

lib/
  db/
  services/
  utils/

models/
  Project.ts
  Task.ts
```

Explanation:

`app/`
Next.js routes and pages.

`components/`
Reusable UI components.

`lib/db/`
MongoDB connection logic.

`lib/services/`
Business logic.

`lib/utils/`
Shared utility functions.

`models/`
Database models and schemas.

---

# 5. Data Model Architecture

The system contains two main entities:

```id="un1f2e"
Project
Task
```

Relationships:

```id="s3j6w1"
Project 1 → N Tasks
```

Tasks must always belong to a project.

---

# 6. Project Model Responsibilities

Projects represent side projects being tracked.

Key responsibilities:

* store project metadata
* store links to external resources
* compute rot score
* track activity status

Rot score calculation:

```id="mhycaj"
rotScore = days_since(updatedAt)
```

Activity status mapping:

```id="ow7s7u"
0–2 days      hot
3–7 days      warm
8–21 days     stale
22–60 days    cold
>60 days      glacier
```

This logic lives in the **service layer**.

---

# 7. Task Model Responsibilities

Tasks represent work items for projects.

Responsibilities:

* track work progress
* record completion
* contribute to activity analytics

Key behavior:

When a task is marked `done`:

```id="suh1y5"
completedOn = current_date
```

Task completion data feeds the **dashboard activity graph**.

---

# 8. Service Layer

Business logic must live in:

```id="81fxab"
lib/services/
```

Example services:

```id="hsyjuq"
projectService.ts
taskService.ts
rotService.ts
```

Responsibilities:

ProjectService

* create project
* update project
* compute rotScore
* compute activityStatus

TaskService

* create task
* update task
* mark task completed

RotService

* calculate rotScore
* map activity status

API routes must **call services**, not embed business logic.

---

# 9. API Architecture

API routes live in:

```id="rxyy3m"
app/api/
```

Endpoints follow REST conventions.

Projects:

```id="q9y1sm"
GET /api/projects
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id
```

Tasks:

```id="qtkjov"
GET /api/projects/:id/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

Rules:

* No PATCH requests
* Always return JSON
* Soft delete only

---

# 10. Query and Filtering Strategy

List endpoints must support:

```id="qg8ix1"
pagination
status filtering
activity filtering
tag filtering
search
```

Example query:

```id="4yyvfd"
/api/projects?page=1&limit=20&status=mvp
```

Filtering should be implemented **server-side**.

---

# 11. Soft Delete Strategy

Records must never be permanently deleted.

Deletion sets:

```id="x9vhl6"
deletedStatus = true
```

All queries must include:

```id="y0y6xj"
deletedStatus = false
```

This rule applies to:

* projects
* tasks

---

# 12. Dashboard Data Flow

Dashboard contains two main sections.

Section 1:

Summary metrics + activity graph.

Metrics include:

```id="9o21z6"
total projects
hot projects
cold projects
glacier projects
total tasks
blocked tasks
```

Graph:

```id="l1ijg3"
tasks completed per day
last 30 days
```

Section 2:

Project grid.

```id="hmw0lt"
20 projects per page
sorted by rotScore descending
```

---

# 13. Modal-Based Project View

Projects are not opened on a dedicated page.

Clicking a project opens a **modal**.

The modal includes:

Project Info

```id="o7qff9"
name
description
tags
status
healthStatus
links
```

Tasks table

```id="q7btyr"
title
status
due date
actions
```

Editing happens **inline**.

---

# 14. MongoDB Strategy

Two collections:

```id="7svtkw"
projects
tasks
```

Indexes:

Projects:

```id="my1x4q"
status
activityStatus
tags
deletedStatus
updatedAt
```

Tasks:

```id="1uc3tg"
projectId
status
completedOn
deletedStatus
```

Indexes must be created during initialization.

---

# 15. Rot Score Update Strategy

RotScore and activity status must be updated when projects are fetched.

Workflow:

```id="r0j0yw"
GET /api/projects
   |
   calculate rotScore
   |
   update activityStatus
   |
   return updated data
```

Optional manual trigger:

```id="81gjm0"
POST /api/projects/recalculate
```

---

# 16. Performance Considerations

To keep the system responsive:

* limit project queries with pagination
* avoid loading all tasks when unnecessary
* index commonly filtered fields

Expected scale for v1:

```id="mt8vhh"
< 500 projects
< 10,000 tasks
```

MongoDB easily handles this.

---

# 17. Deployment Architecture

Production environment:

```id="gq39h8"
Vercel
   |
Next.js serverless functions
   |
MongoDB Atlas
```

Local development:

```id="t4zjpr"
Next.js dev server
Docker MongoDB
```

Environment variables:

```id="63kvk6"
MONGODB_URI
NEXT_PUBLIC_APP_NAME
```

---

# 18. Non-Goals (v1)

The following are intentionally excluded:

```id="a2cc3n"
authentication
multi-user support
notifications
file uploads
comments
attachments
AI features
realtime updates
```

These may be considered in future versions.

---

# 19. Design Philosophy

RotDash prioritizes:

```id="fck9hm"
clarity
speed
simplicity
developer friendliness
```

The system should remain small and understandable.

Avoid premature abstraction.
