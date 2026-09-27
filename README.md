# SAHAY-AI v2 - Psychosocial Vulnerability Layer

> **Real-time, explainable, consent-based psychosocial vulnerability assessment & live decision support for atrocity helplines (14566), portals, and counsellors.**

---

## 🌟 Overview

**SAHAY-AI v2** is a mission-critical clinical and decision-support web application tailored for the National Helpline Against Atrocities (NHAA - 14566) and Tele-MANAS integrations. It empowers crisis responders, counsellors, and legal coordinators to conduct trauma-informed triage, assess psychosocial vulnerability, and coordinate immediate safety interventions while maintaining strict data sovereignty and consent protocols.

---

## 🚀 Key Features

- **Live Helpline Assist (14566)**:
  - Real-time conversation transcription & acoustic risk biomarker tracking.
  - Floating **Quick-Call (14566)** button with native click-to-dial (`tel:14566`) and 1-click helpline number copy.
  - Dynamic conversational guidance prompts, grounding cues, and de-escalation scripts.
  - Explainable vulnerability scoring (SVI - Severity Vulnerability Index).

- **Resource Locator & Geo-Fenced Support**:
  - District and state-matched legal aid clinics (DLSA/SLSA) and 24x7 crisis NGOs.
  - Geo-proximity filtering, instant contact details, emergency hotline badges, and 1-click clipboard copying.

- **Trauma-Informed Triage & Counsellor Queue**:
  - Prioritized triaging based on multidimensional risk indicators (suicidal ideation, physical danger, social isolation, economic distress).
  - Warm handoff protocols with pre-filled clinical handover summaries.

- **Consent & Privacy Architecture**:
  - Explicit consent gateway (Granular data sharing, Tele-MANAS linkage, anonymization).
  - Role-Based Access Control (RBAC) simulation for Counsellors, Legal Coordinators, and System Auditors.
  - Complete cryptographic audit log of triage events.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Lucide Icons, Motion (Framer Motion)
- **State & Architecture**: Modular functional components, custom hooks, reactive client state

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- `npm` or `bun` or `yarn`

### Installation

```bash
# Clone the repository
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git

# Navigate into project directory
cd sahay-ai

# Install dependencies
npm install
```

### Running Locally

```bash
# Start Vite development server on port 3000
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Type check and build bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # Core UI & feature components
│   │   ├── CaseDetailModal.tsx
│   │   ├── ConsentGateway.tsx
│   │   ├── CounsellorQueue.tsx
│   │   ├── HowItWorksModal.tsx
│   │   ├── LiveHelplineAssist.tsx   # Live call triage & Quick-Call 14566
│   │   ├── MicroScreeningModal.tsx
│   │   ├── PrivacyRBACSim.tsx
│   │   ├── ResourceLocatorModal.tsx # Geo-fenced legal aid & crisis NGOs
│   │   ├── TopNavigation.tsx
│   │   ├── ValidationAuditView.tsx
│   │   └── WarmHandoffModal.tsx
│   ├── data/               # Mock cases, resources, and triage metrics
│   ├── types/              # TypeScript interfaces & domain types
│   ├── utils/              # Scoring algorithms & helper utilities
│   ├── App.tsx             # Root layout and tab router
│   ├── index.css           # Global Tailwind CSS imports
│   └── main.tsx            # Application entrypoint
├── index.html              # HTML shell & font definitions
├── metadata.json           # Application metadata & capabilities
├── package.json            # Project manifest & dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

---

## 📄 License

This project is licensed under the MIT License.
