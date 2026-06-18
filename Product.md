# Product Requirements Document (PRD): FlowSync

## 1. Product Overview
**FlowSync** is a Progressive Web Application (PWA) designed to help individuals and families track their monthly income and expenses. The application provides a seamless, app-like experience across desktop and mobile devices. A core feature of FlowSync is its "Family Setting," allowing multiple users to collaboratively manage and view shared financial records.

## 2. Tech Stack & Infrastructure
* **Framework:** Next.js (App Router for optimal server-side rendering and API management).
* **PWA Integration:** `next-pwa` (to enable offline capabilities, service workers, and installability).
* **Styling:** Tailwind CSS.
* **UI Components:** Custom UI via **shadcn/ui** (Highly recommended over Chakra UI to natively leverage Tailwind CSS without conflicting styling engines).
* **Database:** PostgreSQL (Hosted via Supabase Free Tier or Neon) integrated with Prisma ORM. 
* **Authentication:** NextAuth.js or Supabase Auth.
* **Deployment & Hosting:** **Vercel (Hobby Plan)** for seamless Next.js and PWA hosting.

---

## 3. Core Modules

### 3.1. Authentication (Login/Register)
* Secure user registration and login system using Supabase Auth or NextAuth.
* Support for email/password authentication.
* Optional: OAuth integration (Google login) for faster onboarding.
* Password recovery and account management.

### 3.2. Dashboard
* High-level overview of the current month's financial status.
* Visual summaries (charts/graphs) showing total income, total expenses, and net balance.
* Recent transaction history widget.
* Quick-action buttons to add new income or expense records.

### 3.3. Income and Expense Tracking
* Interface to log financial transactions.
* **Data Fields:** * Type (Income / Expense)
    * Amount
    * Category (e.g., Groceries, Salary, Utilities, Entertainment)
    * Date
    * Notes/Description
* Ability to edit or delete previous records.
* Filter and sort functionality (by date, category, or type).

### 3.4. Monthly Reports & Export
* Detailed breakdown of financial activity on a month-to-month basis.
* Comparison features (e.g., comparing current month spending against previous months).
* **PDF Export:** A feature to generate and download a clean, formatted PDF report of the selected month's ledger for external record-keeping.

### 3.5. Installments Tracking
* Track long-term payments (e.g., loans, electronics) over a scheduled period.
* Automatically generate a monthly payment schedule based on the total amount and duration.
* Track payment progress by marking off individual months as paid.
* Personal tracking not shared across family ledgers.

### 3.6. Family Settings (Shared Ledgers)
* Role-based access control (RBAC) allowing the primary account holder to invite other users via email.
* **Permissions:** Ability to grant "View Only" or "View & Edit" rights to connected family members.
* Real-time or near-real-time synchronization so all linked accounts see updated balances and logged transactions instantly.
* Activity attribution (identifying which family member added a specific transaction).

---

## 4. Deployment Pipeline
* **Hosting Platform:** Vercel.
* **CI/CD:** Automated deployment triggered via GitHub repository pushes (main branch).
* **Environment Variables:** Managed securely through Vercel Dashboard (Database URLs, Auth Secrets).

---

## 5. Future Considerations (V2)
* **Budgeting:** Set monthly limits for specific categories and receive alerts when approaching the limit.
* **Multi-Currency Support:** For families managing finances across different countries.
* **Receipt Scanning:** OCR integration to automatically read and input data from uploaded receipt images.