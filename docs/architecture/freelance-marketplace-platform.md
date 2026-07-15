# Freelance Marketplace Platform — Architecture & Planning Document

**Status:** Planning artifact (no code yet). This document is the design reference for evolving the existing **YAKKAY AI Line** codebase (`AIMarketPlace`, React 19 + Vite + TypeScript, frontend-only) toward a full-featured freelance marketplace in the spirit of Fiverr / Upwork / Freelancer / Contra / Toptal, without adopting any of their proprietary implementations.

**Scope decision (confirmed with stakeholder):** this extends the *current* codebase and its actual stack — it does **not** introduce Next.js, Python/FastAPI, or Kubernetes as a parallel project. Backend/infra recommendations below are the *target* design for when a real backend is funded; nothing in this document should be read as already running in production.

---

## 1. Executive Summary

The original request describes a platform on the scale of Fiverr or Upwork — public marketplace, buyer/freelancer/agency/enterprise portals, escrow payments, live video, AI proposal/resume/contract generation, a 250–350 table schema, microservices, Kubernetes, and mobile apps. That is a genuine multi-year, multi-team engineering program, not something producible as working, tested, production code in a single session. This document instead does what a Senior Enterprise Solution Architect actually delivers *first*, before any of that code gets written: a complete, decision-ready design — module map, data model, API contracts, security model, and a roadmap that starts from where this codebase already is today, not from zero.

Everything below is organized so a team can pick it up phase by phase and start implementing immediately, using the conventions this codebase already established over the course of building it (Redux Toolkit slices, the CRM module's Context + RBAC pattern, the CSS-custom-property theme system, the `AITool` / `VendorProfile` mock-data pattern).

---

## 2. Current State — What Already Exists

Honest inventory, so the roadmap in §12 builds on reality:

| Layer | What's actually there today |
|---|---|
| Stack | React 19, Vite, TypeScript, React Router v6, Redux Toolkit, Framer Motion, Recharts, Radix UI (dropdown/accordion), react-hook-form + zod (installed, lightly used), lucide-react, react-hot-toast |
| Layouts | `MarketplaceLayout` (public: `StickyHeader` + `Footer`, dark-navy chrome) and `AppLayout` (authenticated: `Sidebar` + `TopBar`) |
| Public pages | Home, Browse (AI-tool catalog + category directory + trending/recommended + **Vendor/Developer directory** + featured-integrations marquee), ToolDetail, **VendorDetail**, Catalog, Governance, Integrations, Documentation, Compare, Customers, Pricing, About, Contact, RequestDemo |
| Authenticated pages | Dashboard, Analytics, Favorites, Settings, AdminDashboard — behind a real `ProtectedRoute` (session + role gate) |
| Auth | `authSlice` — mock login/register/logout, `User.role: 'Admin'\|'Developer'\|'Analyst'`. **No real identity provider, no OAuth, no MFA, no KYC today.** |
| State | Four Redux slices: `authSlice`, `toolsSlice` (catalog + filters + favorites), `marketplaceSlice` (view mode, filter facets, pagination), `uiSlice` (sidebar/theme) |
| Data | Everything is static mock TypeScript (`src/data/mockData.ts`, `src/data/vendorProfiles.ts`) — **no database, no persistence beyond `localStorage`/session state** |
| A seed of "Explore Talent" | The Vendor/Developer directory on `/browse` and `/vendor/:id` detail pages — profile cards with role (Vendor/Developer), level/tier badges, skills, portfolio highlights, rating, response time; click-through detail page with related profiles |
| A seed of the Admin/CMS portal | The **CRM module** (`src/modules/crm/`) — its own Theme Context, mock-role RBAC (`RoleContext` + `CrmRoute` gate), dynamic per-page `PageConfigurationContext`, a `MenuContext`-driven Sidebar group, Products CRUD-over-mock-state, and a Dashboard with Recharts. This is the closest existing analogue to what an Admin Dashboard / CMS needs to become. |
| Design system | CSS custom properties in `index.css`, light/dark via `[data-theme]`, consistent radius/shadow/spacing tokens, already themed across header/footer/sidebar |
| Testing | **None configured.** Verification this whole project has relied on `tsc --noEmit` + `oxlint` + manual dev-server smoke checks — no unit/integration/E2E test runner is wired up yet |
| CI/CD, infra | **None.** No GitHub Actions, no Docker, no deployment pipeline exists in this repo today |
| Payments, messaging, video, file storage, search, AI backend | **None** — these require a real backend and are described here as target design only |

---

## 3. Product Vision (condensed from the request, organized by portal)

### 3.1 Public Site
Landing, About, Services, Categories, Explore Talent, Browse Projects, Pricing, Enterprise, AI Marketplace, Agencies, Learning Center, Blog, FAQ, Contact, Careers, Trust Center, Security Center.

### 3.2 Authentication
Email/password + social (Google, Microsoft, Apple, GitHub, LinkedIn), 2FA, email/phone verification, identity verification (KYC), face verification.

### 3.3 Buyer Dashboard
Dashboard, Projects, Posted Jobs, Saved Freelancers/Gigs, Messages, Notifications, Wallet, Orders, Contracts, Milestones, AI Assistant, Video Calls, Calendar, Team Members, Invoice Center, Reports, Activity Logs, Settings.

### 3.4 Freelancer Dashboard
Overview, Profile, Skills, Experience, Portfolio, Resume, Certificates, Gig Management, Proposal Management, Orders, Contracts, Earnings, Withdrawals, Analytics, Calendar, Reviews, AI Profile Optimizer, AI Proposal Generator, AI Portfolio Builder, Notifications, Availability.

### 3.5 Admin Dashboard
User Management, Freelancer/Buyer Approval, Agency Management, Disputes, Escrow, Payments, Wallet, Commission, Coupons, CMS (Blog/Categories/Skills), AI Moderation, Reports/Analytics, Fraud Detection, Audit Logs, Security Dashboard, API Monitoring, Email/SMS/Push templates, Feature Flags, Platform Settings.

### 3.6 Marketplace Types
Gig, Hourly, Fixed Price, Project, Contest, Consultation, Subscription, Managed Services, Enterprise Hiring.

### 3.7 Detail Pages
- **Gig Details:** hero banner, seller profile, ratings/reviews, packages, FAQ, portfolio, video, images, deliverables, revisions, timeline, add-ons, similar gigs, response time, languages, skills, certifications, recent orders.
- **Job Details:** budget, duration, skills, attachments, questions, milestones, client rating, previous projects, proposals, invite-freelancer.

### 3.8 Video, Documents, Reviews, Payments, AI — see §7–§10 for the target architecture of each.

---

## 4. Information Architecture (route map, following existing App.tsx conventions)

```
Public (MarketplaceLayout — no auth)
  /                          Home
  /explore-talent            NEW — talent directory (evolves current /browse vendor section)
  /browse-projects           NEW — open jobs/projects feed
  /gig/:id                   NEW — Gig Details page (packages, FAQ, reviews)
  /job/:id                   NEW — Job Details page (proposals, milestones)
  /vendor/:id                EXISTS — freelancer/agency public profile
  /agencies                  NEW
  /enterprise                NEW — enterprise hiring landing
  /ai-marketplace            EXISTS conceptually as /browse (AI tools catalog)
  /learning-center, /blog, /faq, /contact, /careers          NEW (CMS-driven)
  /trust-center, /security-center                            NEW
  /pricing, /about, /request-demo                             EXIST

Auth (no shell)
  /login, /register                                           EXIST — extend with OAuth buttons + 2FA step
  /verify-email, /verify-phone, /verify-identity               NEW

Buyer workspace (AppLayout + ProtectedRoute, role=Buyer)
  /buyer/dashboard, /buyer/projects, /buyer/orders,
  /buyer/contracts, /buyer/milestones, /buyer/wallet,
  /buyer/messages, /buyer/video-calls, /buyer/team,
  /buyer/invoices, /buyer/reports, /buyer/settings            NEW — mirrors CRM module's provider+route-guard pattern

Freelancer workspace (AppLayout + ProtectedRoute, role=Freelancer)
  /freelancer/dashboard, /freelancer/profile, /freelancer/gigs,
  /freelancer/proposals, /freelancer/orders, /freelancer/earnings,
  /freelancer/withdrawals, /freelancer/analytics, /freelancer/reviews  NEW

Agency / Enterprise portals                                    NEW — same shell, additional team/seat-management screens

Admin (AppLayout + ProtectedRoute requireRole=Admin)
  /admin/*                                                      EXISTS as AdminDashboard — extend into the CRM module's
                                                                 sub-route pattern (Users, Approvals, Disputes, Escrow,
                                                                 CMS, Fraud, Audit Logs, Feature Flags)
```

**Reuse, don't reinvent:** the CRM module already solved "how do we add a whole new role-gated sub-application with its own sidebar group, dynamic page config, and theme" — `CrmProviders` / `CrmRootLayout` / `CrmRoute` / `MenuContext` is the exact template for Buyer, Freelancer, Agency, and Enterprise portals. Each becomes its own `src/modules/<portal>/` tree with its own provider stack mounted the same way.

---

## 5. Domain Model (target schema — for the eventual backend)

Rather than enumerating a mechanical 250–350 tables (most of that count is join tables, audit-log shadows, and i18n/localization tables that multiply once you commit to a real ORM), here is the **canonical entity set organized by bounded context** — the set every one of those 250–350 tables ultimately derives from. This is what an ER diagram / SQLAlchemy or Prisma schema would be built from.

### 5.1 Identity & Access
`users`, `roles`, `permissions`, `role_permissions`, `user_roles`, `oauth_identities`, `sessions`, `mfa_devices`, `email_verifications`, `phone_verifications`, `kyc_submissions`, `kyc_documents`, `face_verification_results`

### 5.2 Talent & Buyer Profiles
`freelancer_profiles`, `agency_profiles`, `agency_members`, `buyer_profiles`, `enterprise_accounts`, `enterprise_seats`, `skills`, `freelancer_skills`, `certifications`, `freelancer_certifications`, `portfolio_items`, `experience_entries`, `education_entries`, `resumes`, `availability_calendars`

### 5.3 Catalog (Gigs)
`categories`, `subcategories`, `gigs`, `gig_packages` (Basic/Standard/Premium), `gig_package_features`, `gig_addons`, `gig_media` (images/video), `gig_faqs`, `gig_tags`

### 5.4 Job / Project Marketplace
`jobs`, `job_attachments`, `job_questions`, `job_question_answers`, `proposals`, `proposal_attachments`, `invitations`, `contests`, `contest_entries`, `consultations`

### 5.5 Transactions
`orders`, `contracts`, `milestones`, `milestone_deliverables`, `revisions`, `order_extensions`, `disputes`, `dispute_messages`, `dispute_evidence`

### 5.6 Payments & Wallet
`wallets`, `wallet_transactions`, `escrow_holds`, `payment_methods`, `payouts`, `withdrawals`, `invoices`, `invoice_line_items`, `coupons`, `coupon_redemptions`, `commissions`, `currency_rates`, `tax_records`

### 5.7 Communication
`conversations`, `messages`, `message_attachments`, `notifications`, `notification_preferences`, `video_sessions`, `video_recordings`, `webinars`, `email_templates`, `sms_templates`, `push_templates`

### 5.8 Content & Files
`files` (polymorphic: resume/contract/NDA/invoice/quote/tax-doc/certificate/deliverable/source-zip/CAD/design), `file_versions`, `documents_signed` (NDA/contract e-sign state), `blog_posts`, `blog_categories`, `faqs`, `cms_pages`

### 5.9 Reviews & Trust
`reviews` (buyer→freelancer, freelancer→buyer), `review_scores` (communication/quality/delivery/value — sub-scores per the spec), `review_flags` (AI spam detection outcome), `verified_purchase_flags`

### 5.10 AI / ML
`ai_job_matches`, `ai_generated_proposals`, `ai_generated_gigs`, `ai_resume_drafts`, `ai_portfolio_drafts`, `ai_contract_drafts`, `ai_pricing_suggestions`, `ai_moderation_flags`, `ai_fraud_scores`, `ai_translation_cache`, `ai_chat_sessions`

### 5.11 Platform Governance
`audit_logs`, `api_request_logs`, `feature_flags`, `feature_flag_assignments`, `admin_actions`, `security_incidents`, `rate_limit_events`

**Growth path to 250–350 tables:** each of the ~75 core entities above typically spawns 2–4 supporting tables at enterprise maturity (soft-delete/audit-shadow tables, i18n translation tables per localized entity, junction tables for many-to-many facets like `gig_skills`/`job_skills`, and per-locale/per-region variants). Design every core table with `created_at/updated_at/deleted_at`, `created_by`, and a `*_history` or `*_audit` shadow table from day one so that growth is additive, not a later migration scramble.

---

## 6. API Design (representative contracts)

### 6.1 REST — resource-oriented, versioned (`/api/v1/...`)
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/oauth/{provider}/callback
POST   /api/v1/auth/mfa/verify
GET    /api/v1/freelancers/{id}
PATCH  /api/v1/freelancers/{id}/profile
GET    /api/v1/gigs?category=&skills=&priceRange=&deliveryTime=&sort=
POST   /api/v1/gigs
GET    /api/v1/gigs/{id}
POST   /api/v1/jobs
GET    /api/v1/jobs/{id}/proposals
POST   /api/v1/jobs/{id}/proposals
POST   /api/v1/orders
POST   /api/v1/orders/{id}/milestones
POST   /api/v1/orders/{id}/milestones/{milestoneId}/release   (escrow release)
GET    /api/v1/wallet/me
POST   /api/v1/wallet/withdraw
POST   /api/v1/reviews
GET    /api/v1/search?q=&type=gig|job|freelancer
GET    /api/v1/recommendations/gigs
POST   /api/v1/ai/proposal-generator
POST   /api/v1/ai/gig-generator
GET    /api/v1/admin/disputes?status=open
```

### 6.2 GraphQL — for read-heavy, deeply-nested dashboard views (buyer/freelancer overview screens that need gigs+orders+reviews+wallet in one round trip)
```graphql
type Query {
  freelancerDashboard(id: ID!): FreelancerDashboard
  buyerDashboard(id: ID!): BuyerDashboard
  gig(id: ID!): Gig
  searchGigs(filter: GigFilter, page: PageInput): GigConnection
}

type FreelancerDashboard {
  profile: FreelancerProfile!
  activeOrders: [Order!]!
  earnings: EarningsSummary!
  recentReviews: [Review!]!
  aiSuggestions: [AISuggestion!]!
}
```
**Rule of thumb applied throughout:** REST for writes and simple resource CRUD (cacheable, easy to rate-limit per-endpoint); GraphQL for dashboard aggregation reads only — don't let the schema sprawl into a second way to do every mutation.

### 6.3 OpenAPI
Every REST service ships an `openapi.yaml` generated from the framework's schema layer (FastAPI's automatic OpenAPI, or NestJS's `@nestjs/swagger` if the team standardizes on TypeScript end-to-end — see §7.1 for the tradeoff). CI fails the build if the committed spec drifts from the live schema (`openapi-diff` in the pipeline).

---

## 7. Backend & Microservice Architecture (target — none of this exists yet)

### 7.1 Language/framework decision (open, needs a call before Phase 4)
| Option | Why it fits | Tradeoff |
|---|---|---|
| **FastAPI (Python)** — as originally specified | Best-in-class for the AI/ML-heavy services (§9) since the model tooling is Python-native; async, fast, auto-OpenAPI | Two languages across the stack (TS frontend, Python backend) — two toolchains, two dependency ecosystems |
| **NestJS (TypeScript)** | One language front-to-back; the existing team already owns TS conventions (this repo's strict `tsconfig`, ESLint via `oxlint`) | AI/ML services still likely shell out to Python workers either way, so you don't fully escape a second runtime |

**Recommendation:** NestJS for the core transactional services (users, gigs, jobs, orders, payments, messaging) to maximize team velocity and code-sharing (shared DTOs/types with the frontend), with a small number of **Python/FastAPI microservices specifically for the AI features in §9** (job matching, proposal generation, fraud scoring) that the Node services call over REST/gRPC. This gets the AI ecosystem benefit without paying the two-stack tax everywhere.

### 7.2 Service boundaries (domain-driven, not one-service-per-table)
```
identity-service        (auth, OAuth, MFA, KYC, sessions)
profile-service         (freelancer/buyer/agency profiles, skills, portfolio)
catalog-service         (gigs, categories, search indexing triggers)
job-service              (jobs, proposals, invitations, contests)
order-service            (orders, contracts, milestones, revisions, disputes)
payment-service          (wallet, escrow, payouts, invoices, coupons, commission) — PCI-scope isolated
messaging-service        (conversations, notifications, video-session orchestration)
review-service           (reviews, scoring, spam-flag consumption)
content-service           (file upload/versioning, CMS, blog)
search-service            (Elasticsearch indexing + query API, fed by domain events)
ai-gateway-service (Python)  (proposal/gig/resume/contract generation, matching, fraud scoring, moderation, translation)
notification-dispatch     (email/SMS/push template rendering + provider fan-out)
admin-service              (feature flags, audit log query, platform settings)
```
Services communicate via an **event bus** (domain events: `OrderCreated`, `MilestoneReleased`, `ReviewSubmitted`) for cross-service side effects (e.g., `order-service` emits `MilestoneReleased` → `payment-service` moves escrow → `notification-dispatch` emails both parties → `search-service` re-indexes the freelancer's completed-order count). Synchronous REST/gRPC only for request/response calls that need an immediate answer (e.g., checking wallet balance before allowing a withdrawal).

### 7.3 Data stores
- **PostgreSQL** — system of record for everything in §5 (one logical schema per service, physically separable later).
- **Redis** — session cache, rate-limit counters, hot-path read cache (gig listing pages), job queue backing store (BullMQ/Celery).
- **Elasticsearch** — gig/job/freelancer full-text + faceted search, and the source for the recommendation engine's candidate retrieval step.
- **S3-compatible object storage** — all file categories in §5.8 (resumes, contracts, deliverables, source ZIPs, CAD/design files), served through signed URLs, never proxied through the app servers.

---

## 8. Frontend Architecture (mapped onto this repo's existing conventions)

- **New portals as new `src/modules/<portal>/` trees**, each following the CRM module's shape: `dashboard/`, `<domain>/`, `settings/`, `components/`, plus its own Context providers mounted via a `<Portal>Providers` layout route (same pattern as `CrmProviders`/`CrmRootLayout`/`CrmRoute` in `src/routes/`).
- **Server state via RTK Query**, added as a new API slice per backend service once §7 exists (`freelancerApi`, `orderApi`, `walletApi`, …) — this replaces the current "everything is a plain Redux slice over static mock data" pattern for anything backed by a real API, while `uiSlice`-style local/client state stays plain Redux Toolkit.
- **Design system**: extend the existing CSS-custom-property theme (`index.css`) rather than introducing Tailwind — the whole app is already themed this way (light/dark via `[data-theme]`), and mixing utility-class and custom-property systems mid-project is a maintenance trap, not a productivity win.
- **Shared component library**: promote the already-proven patterns (the trend-card/vendor-card hover-lift + focus-visible convention, `Badge`, `GlassCard`, `StatusBadge`/`ThemePreview` from the CRM module) into a `src/components/ui/` catalog with Storybook once the component count crosses ~30.

---

## 9. AI Features — phased by what's actually feasible without a backend

| Feature | Phase 6 feasibility |
|---|---|
| AI Job Matching, Recommendation Score | **Partially buildable today, client-side** — the existing category-affinity "Recommended For You" logic in `Browse.tsx` is a real (if simple) content-based recommender; extend it with skill-overlap scoring before reaching for an ML model |
| AI Proposal/Gig/Resume/Portfolio/Contract Generator | Requires an LLM backend call (`ai-gateway-service`) — frontend ships the UI (prompt form → streaming result → edit → save) against a mocked response first, swapped for the real endpoint in Phase 6 |
| AI Interview Assistant, AI Voice Assistant | Requires real-time audio/video infra (§7 messaging-service + a speech-to-text provider) — Phase 6/7 |
| AI Skill Assessment, AI Code Review | Sandboxed code execution service — significant security surface (arbitrary code execution), scope for a dedicated security review before build |
| AI Pricing Suggestions | Statistical model over `orders`/`gigs` history — needs real transaction volume to be useful; stub with category-average pricing until then |
| AI Translation | Wrap a third-party translation API behind `ai-gateway-service`; cache in `ai_translation_cache` |
| AI Chatbot | Start as a scoped FAQ/support bot (retrieval over the CMS content in §5.8) before any open-ended assistant |
| AI Fraud Detection, AI Content/Spam Moderation | Rule-based heuristics first (velocity checks, duplicate-content detection), ML-scored (`ai_fraud_scores`) once there's enough labeled data from real disputes |

**Principle:** every "AI" checkbox in the original spec should ship as a real, scoped feature with a fallback (rule-based or manual review), not a placeholder that claims capability it doesn't have — this app's existing content strategy (e.g., the `Sample compliance data — for demo purposes` badge already shown in the Footer) is the right instinct to keep applying here.

---

## 10. Security Architecture (target)

- **AuthN:** OAuth2 (Google/Microsoft/Apple/GitHub/LinkedIn) via `identity-service`, JWT access tokens (short-lived) + rotating refresh tokens, MFA (TOTP + SMS backup).
- **AuthZ:** RBAC for coarse roles (Buyer/Freelancer/Agency/Admin — direct extension of this repo's existing `authSlice.user.role` and the CRM module's `RoleContext` permission-map pattern), ABAC for fine-grained resource ownership checks (e.g., "can edit this gig" = `gig.freelancerId === session.userId OR role === Admin`).
- **Transport/storage:** TLS 1.3 everywhere, AES-256 at rest for `files` and `kyc_documents`, secrets in a managed secrets manager (never in env files committed to the repo).
- **Perimeter:** API Gateway with rate limiting per API key/IP, WAF rules for OWASP Top 10 (SQLi, XSS, CSRF token on every state-changing form — `react-hook-form` + `zod` are already in the dependency tree and should be the standard for every new form, client-side validation as UX, server-side validation as the actual gate), CSP headers, DDoS protection at the CDN/edge layer.
- **Governance:** immutable `audit_logs` for every admin action and every payment state change, SIEM ingestion of `api_request_logs` + `security_incidents`, a documented incident-response runbook before go-live (the "Trust Center" / "Security Center" public pages in §3.1 should link to a real, current version of this).

---

## 11. DevOps, Testing & Quality (target — build order matters)

Do these **before** Phase 4 (payments), not after — retrofitting CI/testing onto a live payments system is how incidents happen:

1. **Testing pyramid**, introduced now regardless of backend timing:
   - Frontend: Vitest + React Testing Library for components/hooks/slices; Playwright for the critical E2E paths (browse → gig detail → checkout, login → dashboard) — this repo currently has *zero* automated tests, and every feature this session was verified by `tsc`/`oxlint`/manual dev-server checks, which does not scale past a handful of contributors.
   - Backend: pytest (FastAPI services) / Jest (NestJS services), contract tests against the committed OpenAPI spec, load testing (k6) on the payment and search paths specifically.
2. **CI/CD:** GitHub Actions — lint + typecheck + unit tests on every PR (this repo already has the lint/typecheck half of this via `oxlint`/`tsc`; add the test job when the test runner lands), build + push container images on merge to `main`, ArgoCD for GitOps deployment sync, Helm charts per service.
3. **Infra as Code:** Terraform for cloud resources (networking, managed Postgres/Redis/Elasticsearch, S3 buckets, IAM), one workspace per environment (dev/staging/prod).
4. **Observability:** OpenTelemetry instrumentation from day one of the backend (not bolted on later), Prometheus + Grafana for metrics/dashboards, Loki or the ELK stack for log aggregation, alerting on payment-service and identity-service error budgets specifically (these two failing silently is the worst-case incident).

---

## 12. Phased Roadmap (adapted to this codebase's actual starting point)

| Phase | Scope | Builds on |
|---|---|---|
| **Phase 0 (done)** | AI-tool catalog, category directory, trending/recommendations, Vendor/Developer directory + detail pages, CRM admin module w/ mock RBAC, theme system, mock auth | This session's work |
| **Phase 1** | Real identity service (OAuth + MFA + email/phone verification), replace `authSlice` mock auth with real tokens, KYC intake flow, Buyer/Freelancer/Agency profile completion wizards | Phase 0 auth + profile UI shells |
| **Phase 2** | Gig Marketplace: gig CRUD, packages/add-ons, Gig Details page, search + filters backed by Elasticsearch | Existing Browse/ToolDetail UI patterns generalize directly |
| **Phase 3** | Job Marketplace: job posting, proposals, invitations, Job Details page | Vendor directory's "profile ↔ listing" relationship generalizes |
| **Phase 4** | Escrow & Payments: wallet, milestones, Stripe/PayPal/Wise integration, invoicing, disputes | Requires Phase 0's CI/testing foundation in place first (§11) |
| **Phase 5** | Messaging & Video: real-time chat, notifications, video consultations | |
| **Phase 6** | AI Features, phased per §9 | |
| **Phase 7** | Mobile apps (React Native — reuse the design tokens and API contracts, not the web component tree) | |
| **Phase 8** | Agency & Enterprise portals, team seats, managed services | CRM module's RBAC pattern extends directly |
| **Phase 9** | Analytics & BI (data warehouse, exec dashboards) | Recharts patterns already proven in this repo (Analytics.tsx, CRM Dashboard) |
| **Phase 10** | Global scaling: multi-region, i18n, multi-currency, compliance (GDPR/SOC2) | |

---

## 13. Open Decisions Before Phase 1 Starts

1. **Backend language** — FastAPI vs. NestJS vs. hybrid (§7.1 recommendation given, needs sign-off).
2. **Payments provider priority** — Stripe first is the pragmatic default (best escrow/Connect support); PayPal/Wise as secondary rails; crypto explicitly optional/later.
3. **Hosting** — AWS/Azure/GCP all viable; pick one to start (multi-cloud from day one multiplies IaC cost for no near-term benefit) — recommend AWS given Stripe/S3-ecosystem maturity, revisit at Phase 10.
4. **Mobile strategy** — React Native (code/design-token reuse) vs. fully native — recommend React Native, revisit if platform-specific needs emerge (on-device AI, deep OS integration).
5. **Test runner adoption timing** — recommend landing Vitest + Playwright in Phase 0.5, before Phase 1 auth work begins, so every subsequent phase ships with test coverage from the start rather than retrofitting it.
