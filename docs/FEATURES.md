# RotDash — Features Specification

## 1. Goal

A single-user web app to track personal projects and detect when they become inactive or "rotting".
The system visualizes project activity through tasks, rot score, and activity status.

Primary goals:

* Track projects and their progress
* Detect inactivity using rot score
* Track task completion trends
* Quickly identify neglected projects

This is **v1** and intentionally minimal.

---

# 2. Tech Stack

Frontend + Backend:

* Next.js (App Router)
* TailwindCSS
* ShadCN UI
* Recharts (for activity graph)

Database:

* MongoDB

Infrastructure:

* Docker Compose (local MongoDB)
* Vercel deployment (Next.js serverless API)

Repository:

* Single repository

---

# 3. Core Entities

## 3.1 Project

```
Project {
  _id

  name
  description
  image

  githubUrl
  prodUrl
  analyticsUrl

  tags: string[]

  status
    idea
    mvp
    shipped

  activityStatus
    hot
    warm
    stale
    cold
    glacier

  healthStatus
    "+"
    "-"

  rotScore

  deletedStatus

  createdAt
  updatedAt
}
```

### Rot Score

```
rotScore = days_since_last_update
```

### Activity Status Mapping

```
0–2 days      → hot
3–7 days      → warm
8–21 days     → stale
22–60 days    → cold
>60 days      → glacier
```

---

## 3.2 Task

```
Task {
  _id

  projectId

  title
  description

  status
    todo
    in_progress
    blocked
    done
    cancelled

  dueDate
  completedOn

  blockedByTaskId

  deletedStatus

  createdAt
  updatedAt
}
```

### Task Creation Rules

When creating a task:

```
title required
status = todo
description optional
```

Description can be edited later.

---

# 4. API Endpoints

## Projects

```
GET    /api/projects
POST   /api/projects
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/recalculate
```

DELETE performs **soft delete**:

```
deletedStatus = true
```

---

## Tasks

```
GET    /api/projects/:id/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

All queries must filter:

```
deletedStatus = false
```

---

# 5. Query Parameters

List endpoints must support filtering and pagination.

Supported parameters:

```
?page
?limit
?status
?activityStatus
?tag
?search
```

Example:

```
/api/projects?page=1&limit=20&status=mvp
```

Search behavior:

```
search matches project name
tag matches project tags
```

---

# 6. Dashboard Page

The application contains **one main dashboard**.

---

## Section 1 — Summary + Activity Graph

Metrics displayed:

```
Total Projects
Hot Projects
Cold Projects
Glacier Projects
Total Tasks
Blocked Tasks
```

### Activity Graph

A single chart showing:

```
Tasks completed per day
Last 30 days
```

Source:

```
tasks.completedOn
```

Graph type:

```
Line chart
```

---

## Section 2 — Project Grid

Displays projects as cards.

```
20 projects per page
```

Sorted by:

```
rotScore DESC
```

Each card shows:

```
project image
project name
tags
status
activityStatus
rotScore
healthStatus
```

Clicking a card opens the **Project Modal**.

---

# 7. Project Modal

The modal displays details of a single project.

Sections:

## Project Info

```
name
description
tags
status
healthStatus
links
```

Inline editing allowed.

---

## Tasks Section

Table layout:

```
title
status
due date
actions
```

Actions:

```
add task
edit task
delete task
```

Description editable via pencil icon.

---

# 8. Filtering UI

Dashboard filtering options:

```
status dropdown
activity status dropdown
tag search
text search
```

Filtering is executed via **API queries**.

---

# 9. Pagination

Project grid pagination:

```
20 items per page
```

Query parameters:

```
page
limit
```

---

# 10. Image Handling

Projects store:

```
image URL
```

Image upload is **not supported in v1**.

---

# 11. Soft Delete

Projects and tasks are not physically deleted.

Deletion sets:

```
deletedStatus = true
```

All queries must filter:

```
deletedStatus = false
```

---

# 12. Database Indexes

## Projects

Indexes:

```
status
activityStatus
tags
deletedStatus
updatedAt
```

## Tasks

Indexes:

```
projectId
status
completedOn
deletedStatus
```

---

# 13. Rot Score Update

Rot score is recalculated when:

```
GET /api/projects
```

Optional manual trigger:

```
POST /api/projects/recalculate
```

---

# 14. Out of Scope (v1)

The following features are intentionally excluded:

```
authentication
multiple users
notifications
file uploads
comments
attachments
real-time updates
AI features
OAuth
email integrations
```

These will be considered in future versions.

---

# 15. Deployment

Local development:

```
Docker Compose → MongoDB
Next.js dev server
```

Production:

```
Vercel
MongoDB Atlas
```

---

# 16. Success Criteria for v1

The system is considered complete when:

```
Projects can be created and edited
Tasks can be added to projects
Dashboard shows rot score and activity status
Activity graph works
Filtering and pagination work
Soft deletes function correctly
```
