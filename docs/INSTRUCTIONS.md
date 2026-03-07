# Cursor Project Instructions — RotDash

These rules guide AI agents working on the RotDash codebase.

Follow them strictly.

---

# 1. Project Overview

RotDash is a **single-user project decay tracker**.

Purpose:

* track projects
* track tasks
* compute rot score
* visualize project activity

This is **v1 MVP** and must remain simple.

---

# 2. Tech Stack

Framework:

* Next.js (App Router)

UI:

* TailwindCSS
* ShadCN UI

Charts:

* Recharts

Database:

* MongoDB

Deployment:

* Vercel

---

# 3. Folder Structure

Use the following structure.

```
app/
  api/
  dashboard/
  project/

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

Rules:

* Database models go in `models/`
* DB connection goes in `lib/db`
* Business logic goes in `lib/services`

Never mix these responsibilities.

---

# 4. Database Rules

MongoDB is the only database.

Collections:

```
projects
tasks
```

Always include:

```
createdAt
updatedAt
deletedStatus
```

Soft deletes must be used.

Never permanently delete records.

---

# 5. Project Model Rules

Project contains:

```
name
description
image
githubUrl
prodUrl
analyticsUrl
tags
status
activityStatus
healthStatus
rotScore
```

Status options:

```
idea
mvp
shipped
```

Activity status:

```
hot
warm
stale
cold
glacier
```

---

# 6. Rot Score Logic

Rot score represents inactivity.

Formula:

```
rotScore = days_since_updatedAt
```

Activity mapping:

```
0–2 days   hot
3–7 days   warm
8–21 days  stale
22–60 days cold
>60 days   glacier
```

This logic must exist **only in backend services**.

Never compute this in frontend.

---

# 7. Task Model Rules

Tasks belong to projects.

Fields:

```
title
description
status
dueDate
completedOn
blockedByTaskId
```

Status options:

```
todo
in_progress
blocked
done
cancelled
```

---

# 8. API Design Rules

Use REST style.

Allowed methods:

```
GET
POST
PUT
DELETE
```

Do not use PATCH.

List endpoints must support:

```
pagination
status filtering
tag filtering
search
```

---

# 9. Soft Delete Rules

Deletion must set:

```
deletedStatus = true
```

Queries must always filter:

```
deletedStatus = false
```

Never return deleted records.

---

# 10. UI Rules

Dashboard contains two sections:

1. Summary + activity chart
2. Project grid

Project grid:

```
20 items per page
```

Clicking a project opens a **modal**.

No dedicated project page.

---

# 11. Feature Restrictions (Important)

Do not implement:

```
authentication
notifications
file uploads
comments
real-time features
AI features
multi-user support
```

These are out of scope for v1.

---

# 12. Coding Guidelines

Follow these rules:

* keep components small
* separate UI and data logic
* use async/await
* prefer server-side data fetching
* avoid unnecessary abstractions

---

# 13. Development Goal

This project must be **buildable in one night**.

Priorities:

```
simplicity
clarity
speed of development
```

Avoid adding complexity.
