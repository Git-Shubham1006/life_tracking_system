# Project State: Life Tracking System Dashboard

## Goal
A personal dashboard website to monitor my life with 4 main sections on the homepage: **Business, Subjects, Tech, and Hobby**.

## Tech Stack
- Framework: Next.js (App Router)
- Language: TypeScript
- Database ORM: Prisma
- Database: PostgreSQL
- Authentication: Clerk (based on schema field `clerkId`)
- UI Library: Tailwind CSS + shadcn/ui

## Database Schema Highlights
- **User**: Maps `clerkId`, `email`, `name`.
- **Business**: Tracks different businesses with a `Status` (NOT_STARTED, IN_PROGRESS, COMPLETED, etc.). Has a relationship to `Node`.
- **Subject**: Tracks different subjects with a `Status`. Has relationships to `Node` and `ClassLog`.
- **Node**: A self-referencing model (parent/children) used to create dynamic flowcharts, priority trees, and chapter trees for both Businesses and Subjects. Uses `NodeType` (BRANCH, PRIORITY_ITEM, CHAPTER, REVISION_POINT, GENERAL).
- **ClassLog**: Tracks daily attendance (PRESENT/ABSENT) for subjects.

## Current Progress
- Next.js project is fully initialized.
- Prisma schema is written with `User`, `Business`, `Subject`, `Node`, and `ClassLog` models.
- shadcn/ui components (badges, buttons, cards, dialogs, inputs, tables, tabs, etc.) have been installed.
- Git repository is initialized and pushed to GitHub (`main` branch).

## Immediate Next Task
Design and build the main Home Page layout, which will display navigation/cards for the 4 primary sections: Business, Subjects, Tech, and Hobby.

---

### AI Handoff Prompt
*If you need to switch to a new Claude account, copy the text below and paste it into the new chat to instantly sync the AI's memory:*

**Act as a senior web developer. We are building a life-tracking dashboard. I am moving our conversation from a previous AI session. Here is the current state of the project:**

**[Copy everything from the "Goal" section down to "Immediate Next Task" above and paste it here]**

**We are ready to begin the immediate next task. Please provide the code for it.**
