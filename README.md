# SAHAY-AI v2 — Psychosocial Vulnerability Layer

> **Real-time, explainable, consent-based psychosocial vulnerability assessment and live decision support for atrocity helplines (14566), portals, and counsellors.**

SAHAY-AI is a decision-support tool, not a diagnostic or autonomous decision-making system. Every recommendation it generates is reviewed, modified, or rejected by an authorized human before action is taken.

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [How the Scoring Works](#how-the-scoring-works)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Component Guide](#component-guide)
- [Consent, Privacy & RBAC](#consent-privacy--rbac)
- [Data & Mock Mode](#data--mock-mode)
- [Roadmap](#roadmap)
- [Design Principles](#design-principles)
- [Disclaimer](#disclaimer)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**SAHAY-AI v2** is a mission-critical clinical and decision-support web application built for the National Helpline Against Atrocities (**NHAA — 14566**) and its integrations with the Integrated Portal, chatbot, IVRS, mobile app, and **Tele-MANAS (14416)**.

It gives crisis responders, counsellors, and legal coordinators a single, explainable view of a victim's psychosocial state during first contact — so that trauma-informed triage, prioritization, and safety coordination happen in minutes, not days — while keeping consent, data minimization, and victim-rights protections built into every screen.

This repository is the **frontend prototype**: a React/TypeScript application that simulates the full SAHAY-AI workflow — live call assist, triage scoring, counsellor queueing, warm handoff, resource location, consent gateway, and RBAC — using mock data, so the interaction design and scoring logic can be reviewed, demoed, and iterated on before backend/ML integration.

---

## Problem Statement

Victims and complainants belonging to Scheduled Castes and Scheduled Tribes who approach 14566, the Integrated Portal, chatbot, IVRS, or mobile app often carry severe emotional distress from caste-based discrimination, violence, sexual assault, murder of family members, social boycott, displacement, threats, and prolonged legal proceedings.

At present there is **no standardized mechanism** to assess a victim's psychological condition and vulnerability at the moment of first contact. SAHAY-AI closes that gap by turning an unstructured conversation into a structured, explainable, human-reviewed vulnerability signal — without ever touching the victim's legal rights or case outcome.

---

## Key Features

### 🎧 Live Helpline Assist (14566)
- Real-time conversation transcription and acoustic risk-biomarker tracking (speech rate, pauses, pitch instability — simulated in this prototype).
- Floating **Quick-Call (14566)** button with native click-to-dial (`tel:14566`) and one-click number copy.
- Dynamic, trauma-informed conversational guidance prompts, grounding cues, and de-escalation scripts for the agent.
- Explainable vulnerability scoring via the **Stress Vulnerability Index (SVI)**, shown live with the evidence behind it — never a bare number.

### 📍 Resource Locator & Geo-Fenced Support
- District- and state-matched legal aid clinics (DLSA/SLSA) and 24×7 crisis NGOs.
- Geo-proximity filtering, instant contact details, emergency hotline badges, and one-click clipboard copying for agents to relay during a live call.

### 🩺 Trauma-Informed Triage & Counsellor Queue
- Prioritized triage based on multidimensional risk indicators: suicidal ideation, imminent physical danger, threat/intimidation, social isolation, and economic distress — not a single collapsed score.
- Queue sorted by risk category and SLA time remaining, so Critical cases never get buried under call volume.
- **Warm handoff protocol** with a pre-filled clinical handover summary, so a counsellor picking up a Critical case has full context in seconds, not minutes.

### 🔐 Consent & Privacy Architecture
- Explicit **Consent Gateway**: granular toggles for assistive analysis, data sharing with other agencies, and Tele-MANAS linkage, with anonymization options.
- **Role-Based Access Control (RBAC) simulation** for Counsellors, Legal Coordinators, and System Auditors — each role sees only what it needs.
- Complete, tamper-evident audit log of triage events, reviewer decisions, and access events, viewable in the Validation & Audit view.

### 📚 Micro-Screening & Case Detail
- Optional, gentle, skippable micro-screening items (adapted from validated instruments such as PHQ-2, GAD-2, PC-PTSD-5, and a C-SSRS-style safety check) to anchor the AI's text/acoustic signals to something clinically grounded.
- Full case detail view: SVI trend over time, sub-score breakdown, detected indicators with evidence, and the recommended support pathway.

### ℹ️ How It Works
- An in-app walkthrough explaining the SVI methodology, the override rules, and the human-in-the-loop review step — so agents and auditors are never facing an unexplained black box.

---

## How the Scoring Works

SAHAY-AI never reduces a victim to one opaque number. It computes **four sub-scores**, each on a 0–100 scale, each with its own supporting evidence:

| Sub-score | Captures |
|---|---|
| **ED — Emotional Distress** | Fear, anxiety, trauma symptoms, depression/hopelessness, dissociation cues |
| **SH — Self-Harm Risk** | Suicidal ideation, plan/means/intent cues, hopelessness |
| **TH — External Threat & Retaliation** | Threats from perpetrators, intimidation, stalking, pressure to withdraw the complaint, imminent danger |
| **SI — Isolation & Support Deficit** | Social boycott, denial of water/land/work, absence of family or community support |

These combine into the **Stress Vulnerability Index (SVI)**:

```
Weighted mean   W = 0.30·ED + 0.30·SH + 0.25·TH + 0.15·SI
Peak component  M = max(ED, SH, TH, SI)
SVI (base)        = round(0.5·W + 0.5·M)   # one severe dimension cannot be diluted
```

**Risk bands** (configurable, subject to clinical validation in production):

| SVI Range | Category | System Response |
|---|---|---|
| 0–25 | Low | Standard support resources |
| 26–50 | Moderate | Counselling/support referral |
| 51–75 | High | Priority human review |
| 76–100 | Critical | Immediate human assessment and escalation |

**Hard-override rules** sit on top of the formula and are deterministic, not model-driven — for example, an explicit statement of suicidal intent or an imminent-danger disclosure forces a **Critical** rating and a live handoff regardless of what the computed SVI says. This prevents a single severe signal from being averaged away.

> In this frontend prototype, scoring runs against mock/simulated inputs so the UI, workflow, and explainability surfaces can be evaluated independently of the ML/ASR backend described in the full solution document.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
| Icons | Lucide Icons |
| Animation | Motion (Framer Motion) |
| State & architecture | Modular functional components, custom hooks, reactive client state (no external state library) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ or v20+ (recommended)
- `npm`, `bun`, or `yarn`

### Installation

```bash
# Clone the repository
https://github.com/vap0611/shay.ai.git

# Navigate into the project directory
cd sahay-ai

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the Vite development server on port 3000
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Starts the Vite dev server with hot module reload on port 3000 |
| `npm run build` | Type-checks the project and builds a production bundle |
| `npm run preview` | Serves the production build locally for final review |

---

## Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # Core UI & feature components
│   │   ├── CaseDetailModal.tsx        # SVI trend, sub-scores, evidence, recommended pathway
│   │   ├── ConsentGateway.tsx         # Granular consent capture (analysis, sharing, Tele-MANAS)
│   │   ├── CounsellorQueue.tsx        # Risk-sorted case queue with SLA timers
│   │   ├── HowItWorksModal.tsx        # In-app SVI/override methodology walkthrough
│   │   ├── LiveHelplineAssist.tsx     # Live call triage, transcription, Quick-Call 14566
│   │   ├── MicroScreeningModal.tsx    # Optional validated-instrument-style screening items
│   │   ├── PrivacyRBACSim.tsx         # Role-based access simulation (Counsellor/Legal/Auditor)
│   │   ├── ResourceLocatorModal.tsx   # Geo-fenced legal aid & crisis NGO locator
│   │   ├── TopNavigation.tsx          # App shell navigation
│   │   ├── ValidationAuditView.tsx    # Audit log & validation metrics view
│   │   └── WarmHandoffModal.tsx       # Pre-filled clinical handover summary for handoff
│   ├── data/                # Mock cases, resources, and triage metrics
│   ├── types/                # TypeScript interfaces & domain types
│   ├── utils/                # Scoring algorithms & helper utilities
│   ├── App.tsx               # Root layout and tab router
│   ├── index.css             # Global Tailwind CSS imports
│   └── main.tsx              # Application entry point
├── index.html                # HTML shell & font definitions
├── metadata.json              # Application metadata & capabilities
├── package.json                # Project manifest & dependencies
├── tsconfig.json                # TypeScript configuration
└── vite.config.ts                # Vite build configuration
```

---

## Component Guide

| Component | Purpose |
|---|---|
| `LiveHelplineAssist.tsx` | The agent-facing live panel: transcription, rolling SVI, evidence, de-escalation prompts, Quick-Call 14566 button |
| `CounsellorQueue.tsx` | Risk-sorted queue of active cases with time-to-SLA-breach indicators |
| `CaseDetailModal.tsx` | Drill-down view of a single case: SVI history, four sub-scores, indicator evidence, suggested actions |
| `WarmHandoffModal.tsx` | Generates a pre-filled handover summary when a case is transferred to a counsellor or Tele-MANAS |
| `MicroScreeningModal.tsx` | Presents optional, skippable screening items used to anchor AI signals to validated instruments |
| `ResourceLocatorModal.tsx` | Finds and displays nearby DLSA/SLSA legal aid and crisis NGOs with contact details |
| `ConsentGateway.tsx` | Captures granular, revocable consent before any analysis begins |
| `PrivacyRBACSim.tsx` | Demonstrates tiered, role-based visibility of case data |
| `ValidationAuditView.tsx` | Shows the audit trail of triage decisions, overrides, and access events |
| `HowItWorksModal.tsx` | Explains the SVI methodology and override logic to end users |
| `TopNavigation.tsx` | Application shell and tab routing |

---

## Consent, Privacy & RBAC

- **Consent is explicit and granular.** A victim (or the agent on their behalf) separately consents to (1) assistive analysis and (2) sharing information with other agencies. Refusing either has no effect on standard service.
- **Consent is revocable at any time**, simulated via the Consent Gateway.
- **RBAC is tiered by need-to-know.** Counsellors see full case context; legal coordinators see only what's relevant to legal aid; auditors see logs, not narrative content. This mirrors the retaliation-aware access design in the full solution document, where sensitive narrative detail never reaches roles that don't need it.
- **SVI and psychosocial data are conceptually separated from the legal case file** — the score is designed to route support, never to influence FIR registration, relief eligibility, or legal priority.
- **Every triage event is logged** in the Validation & Audit view for later review and continuous-improvement analysis.

---

## Data & Mock Mode

This prototype ships with **mock data only** (see `src/data/`) — synthetic cases, synthetic resource listings, and simulated triage metrics. No real victim data, audio, or PII is collected, stored, or transmitted by this codebase. It is intended for **demonstration, UX review, and hackathon evaluation**, not for handling real helpline traffic.

Production deployment would require: real ASR/NLP backend integration, clinician-validated scoring thresholds, DPDP Act 2023–compliant data handling, government-hosted infrastructure, and a shadow-mode validation period — none of which are part of this frontend repository.

---

## Roadmap

- [ ] Backend integration: streaming ASR + NLP scoring service
- [ ] Real-time WebSocket connection for live transcription and rolling SVI
- [ ] Clinician-in-the-loop labeling workflow for model feedback
- [ ] Multilingual UI and screening items (Hindi, Gujarati, and additional Indian languages)
- [ ] Integration with 14566 agent desktop and the NHAA Integrated Portal
- [ ] Tele-MANAS (14416) live handoff API integration
- [ ] Accessibility audit (screen reader support, low-literacy voice-guided consent)

---

## Design Principles

1. **Human-in-the-loop, always.** Every recommendation can be accepted, modified, or rejected by an authorized person.
2. **No single opaque score.** Every SVI is shown with its four sub-scores and the evidence behind them.
3. **Fail toward attention.** Low confidence, missing data, or unsupported input routes a case *toward* human review, never away from it.
4. **Consent first.** Analysis never begins without explicit, granular, revocable consent.
5. **Legal rights are firewalled.** Nothing in this tool gates, delays, or influences a victim's legal case.

---

## Disclaimer

SAHAY-AI is a **decision-support prototype**, not a diagnostic tool and not a substitute for a qualified mental health professional, counsellor, or legal authority. This repository is a **hackathon/demo-stage frontend** built on mock data. It has not undergone clinical validation, security audit, or compliance review, and should not be connected to real victim data or deployed in a live helpline environment without that work being completed first.

---

## Contributing

1. Fork the repository and create a feature branch.
2. Keep components modular and typed — avoid `any` in TypeScript.
3. Follow the existing Tailwind utility-first styling conventions.
4. Open a pull request with a clear description of the change and, where relevant, screenshots or a short screen recording.

---

## License

This is not a complete project just a demostrating prototype 
