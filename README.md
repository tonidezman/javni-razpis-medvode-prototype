# Razpisi Medvode — interactive prototype

A quick, clickable web prototype based on **Opis zahteve naročnika.docx**. The interface is in Slovenian and uses realistic sample data for Občina Medvode.

> This is a throwaway front-end prototype. There is no backend or persistence, and integrations, signing, uploads, messages, and document downloads are simulated.

## Run

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

```bash
npm run build    # production build
npm run preview  # preview the production build
```

## What to explore

- Use the **Vlagatelj / Skrbnik / Komisija / Administrator** switch in the header to change roles. The selected role is also reflected in the `role` URL parameter.
- Switch between three dashboard structures with the floating bottom bar, arrow keys, or:
  - `?variant=A` — card-based overview
  - `?variant=B` — process-focused workflow
  - `?variant=C` — analytical overview

### Applicant

- Dashboard with deadlines, tasks, applications, messages, and funding.
- Public calls by content area, call conditions, and documentation.
- Archive of completed calls with search, filters, outcomes, and downloadable documentation.
- Four-step application: AJPES lookup, reuse of a previous application, program and finance data, attachments, review, simulated VSE signing, and ODOS receipt.
- Application details and supplementation upload.
- Payment requests with invoices and annual content/financial reports.
- Document archive, messages, support, FAQs, and training content.

### Skrbnik

- Call creation, publishing, and movement through all seven phases.
- Application register, formal-review checklist, supplementation requests, and audit trail.
- Criteria scoring with automatic totals and ranking.
- Points-to-funding allocation that respects program caps and displays the unallocated remainder.
- Invoice/request review, approvals, payment orders, and final reports.
- No system-administration tab.

### Komisija

- Role-specific dashboard with assigned programs, scoring progress, and commission tasks.
- Assigned application register without formal-review or supplementation permissions.
- Criteria scoring with automatic totals, rankings, and proposed funding allocation.
- Read-only application details and supporting documents.

### Administrator

- Full operational views available to Skrbnik, plus the **Administracija** tab.
- Users and roles, forms, document templates, code lists/content areas, and integrations (ODOS, AJPES, OKS SportSi360, eDavki).
- System-oriented dashboard metrics and administration shortcuts.

## Implementation

React + Vite, plain CSS, and Lucide icons. The blue visual theme uses the observed Občina Medvode palette (`#266AAB`, `#1797CB`, `#74C1E0`), documented in `DESIGN.md` and implemented in `src/theme-medvode.css`. All state is in memory and resets on reload. No production hardening, backend validation, authentication, or automated tests are included by design.
