# LYNCH — AI Financial Intelligence

LYNCH is a demo-first financial intelligence workspace for exploring portfolio health, researching stocks, understanding market signals, and asking guided investment questions in a single interface. Built as a polished hackathon prototype in Next.js, it brings together a portfolio dashboard, stock research experience, AI-style chat, alerts, activity history, and deterministic investment research outputs powered by structured demo data.

<div align="center">
  <a href="https://lynch-rust.vercel.app/" target="_blank" rel="noreferrer">
    <img alt="LYNCH Live Demo" src="https://img.shields.io/badge/Live%20Demo-LYNCH-8b5cf6?style=for-the-badge&logo=vercel&logoColor=white" />
  </a>
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
</div>

## Live Demo

https://lynch-rust.vercel.app/

## Project Resources

Drive: https://drive.google.com/drive/folders/1t1ErWQjCWkvDmyt2Tbv2TBuobcLYjRA6?usp=drive_link

## What is LYNCH?

LYNCH is a research-driven financial workspace designed to help users interpret portfolio exposure, scan a curated stock universe, and explore investment themes in a structured way. It is built for fast financial analysis sessions where the user needs a clear overview of holdings, the risk posture of the portfolio, and high-priority research candidates without leaving a single app.

The product experience centers on a financial command center: a dashboard, a conversational co-pilot, stock deep-dives, portfolio insights, and monitoring surfaces for alerts and activity. The implementation is intentionally demo-oriented and uses a fixed research dataset rather than live brokerage or market APIs.

## Problem

Modern investing research is fragmented and noisy. Investors and analysts often have to jump across tabs and tools to answer basic questions like:

- What do I own?
- How concentrated is my portfolio?
- Which stocks deserve deeper research?
- What are the major risks or catalysts?
- Which ideas are worth investigating next?
- How do portfolio-level concerns connect to individual stock positions?

LYNCH addresses this by consolidating key financial research tasks into one workflow: portfolio review, stock analysis, idea generation, alerting, and conversational analysis. It is designed to reduce context switching and make the signal easier to see when working with demo investment data.

## Solution

LYNCH is a financial intelligence workspace that combines:

- portfolio analysis and allocation views
- stock research pages with structured fundamentals and valuation analysis
- conversational financial queries through a built-in chat experience
- dashboard-level monitoring of portfolio signals, risks, and insights
- alerts and activity tracking for research events
- deterministic investment idea generation based on predefined demo data and scoring rules

Importantly, this is a prototype experience for research and interface exploration. The app is not a brokerage platform, live trading system, or production financial advice engine.

## Key Features

### Dashboard

The dashboard is the main command center of LYNCH. It gives users an immediate overview of portfolio value, recent movement, risk posture, allocations, recent alerts, recent activity, and AI-generated investment insight blocks. It is implemented in `ui/dashboard/Dashboard.tsx` and uses demo portfolio and activity data from `ui/data/demo.ts` and the local alert/activity stores.

The dashboard is designed to surface the most relevant research context at a glance:

- total portfolio value
- daily performance
- portfolio risk classification
- current holdings summary
- recent alert activity
- recent system activity
- synthesis of notable risks and opportunity themes

### Overview

The overview experience in `app/overview/page.tsx` acts as the product introduction and onboarding surface. It explains the platform concept, presents the main capability themes, and directs users into the core LYNCH flows such as chat and portfolio exploration.

This page is meant to communicate the product's value proposition clearly: portfolio intelligence, investment research, monitoring, discovery, and AI-assisted interpretation in one workspace.

### AI Chat

The chat experience is implemented in `agent/Chat.tsx` and powered by `agent/ai.ts`. It provides conversational interaction with a deterministic financial co-pilot that interprets a user’s query by intent and returns structured results.

Supported flows in the implementation include:

- stock analysis queries such as TCS, Infosys, Reliance, and other demo universe names
- portfolio questions such as “show my portfolio” or “how risky is my portfolio”
- risk and alert explanations
- investment idea prompts like “give me some investment ideas”
- follow-up questions that re-use the previous turn’s context
- structured response cards for analysis and idea summaries

The chat is declarative rather than model-backed. It uses keyword-based intent matching and predefined response data in `agent/demo-responses.ts` instead of a live LLM API.

### Stock Research

The dedicated stock research workspace is implemented by `ui/stock/StockResearchView.tsx` and the underlying dataset in `agent/research-data.ts`.

It provides a dedicated stock-selection experience with:

- stock search and ticker/company lookup
- company overview and sector/industry context
- fundamentals (revenue growth, EPS growth, margins, ROE/ROCE, free cash flow)
- valuation summary (P/E, P/B, EV/EBITDA, assessment)
- signal and risk classification
- catalysts and risks
- bull and bear case summaries
- LYNCH research score and research priority
- portfolio impact analysis for the current demo portfolio
- actions like “Ask LYNCH”, “Compare Stock”, “View Portfolio Impact”, and “Create Alert”

This page is a structured research layer, not a live market terminal. Every output is grounded in the local demo universe and deterministic scoring logic.

### Portfolio Analyzer

The portfolio analysis experience is implemented in `app/portfolio/page.tsx` with supporting components under `app/portfolio/components/` and utilities in `app/portfolio/utils.ts`.

The analyzer includes:

- portfolio holdings and position summary
- portfolio value and return overview
- allocation breakdown by holding and sector-like grouping
- risk insight cards and concentration commentary
- performance visualization
- manual entry and demo connection flows

The “connect portfolio” flow is demo-oriented, as indicated by the `PortfolioConnector` UI and the fact that the app uses curated local data rather than live broker APIs. This is a prototype connectivity concept rather than a production trading integration.

### Alerts

The alerts system is implemented in `alerts/` and driven by `alerts/alert-data.ts` plus `alerts/AlertManager.tsx` and `alerts/AlertCard.tsx`.

Users can:

- create alerts
- enable or disable active alerts
- view alert status and metadata
- simulate activity and trigger events in the demo environment
- inspect alert-related activity through the same UI experience

The system stores data in `localStorage` on the client and is designed for prototype demonstration rather than a backend-managed event system.

### Activity

The activity feed is implemented in `alerts/ActivityFeed.tsx` and uses the same alert-data storage model. It surfaces events such as:

- risk scans
- portfolio events
- research actions
- generated insights
- alert-triggered events

This gives the user a running history of LYNCH-generated analysis and monitoring happenings in the same interactive workspace.

### Investment Ideas

LYNCH includes a structured investment idea workflow through the `investment_ideas` intent in `agent/ai.ts` and the idea block in `agent/demo-responses.ts`. The response shape includes a `LynchIdea` array, methodology metadata, priorities, and disclaimer text.

This is a deterministic, demo-based research workflow designed to mimic an equity idea-generation process using the app’s research dataset. It ranks ideas, explains the thesis, surfaces standout points, and flags risk factors. The repository’s comments explicitly reference a SkillPatch-style idea-generation workflow, but the actual executed logic in the app is local, predefined response logic; there is no live external LLM or remote SkillPatch runtime wired into the frontend.

### SkillPatch

The repository contains references to SkillPatch and a `.latentcode/skills` directory, but the actual codebase does not contain a fully operational runtime integration that calls a remote SkillPatch service. In this implementation, SkillPatch is represented as a methodology reference and naming convention in comments and response metadata rather than as a live agent orchestration layer.

The real role of SkillPatch in this project is conceptual and design-oriented:

- it names the idea-generation workflow used by the product
- it informs the structure of investment idea prompts and output blocks
- it provides a research taxonomy for screening, prioritization, and idea presentation

It is not acting as the LLM itself in this app. The actual generation logic here is a local demo engine driven by `agent/ai.ts`, `agent/demo-responses.ts`, and `agent/analysis-engine.ts`.

## System Architecture

The LYNCH app is a client-side financial intelligence workspace with a clear demo-data flow:

User
 ↓
LYNCH UI (Next.js + React)
 ↓
Intent / query handling (`agent/ai.ts`)
 ↓
Structured research data (`agent/research-data.ts`)
 ↓
Deterministic analysis engine (`agent/analysis-engine.ts`)
 ↓
Response composition (`agent/demo-responses.ts`)
 ↓
Research cards, portfolio summaries, alert/activity outputs
 ↓
User

The architecture is intentionally simple and local:

- `app/` handles the routing and page-level experiences
- `agent/` contains the chat logic, research responses, portfolio analysis logic, and deterministic data model
- `ui/` contains reusable dashboard, stock, navigation, and presentation components
- `alerts/` owns the alert and activity system plus persistence
- `app/portfolio/` contains the deeper portfolio analyzer UI and demo holdings model
- the design uses static local state and browser `localStorage` rather than a backend service

## Tech Stack

The project uses the following technologies in the current implementation:

- Next.js 16.3.3
- React 19.2.8
- TypeScript 5
- Tailwind CSS 4
- Lucide React for icons and interface elements
- Vercel for deployment hosting (the public demo is hosted there)
- Local TypeScript data models and deterministic scoring logic
- Browser-side `localStorage` persistence for demo alerts/activity

The project does not currently include a production backend, database, authentication layer, broker API integration, or live market data service.

## How LYNCH Works

1. The user enters the app and lands on the dashboard or overview experience.
2. The dashboard presents the portfolio snapshot and activity context.
3. The user can browse the portfolio analyzer to inspect holdings, allocation, and risk views.
4. The user can open the stock research workspace to compare or analyze securities in the demo universe.
5. The user can interact with the chat interface to ask questions about a stock, portfolio, alert, or investment opportunity.
6. The agent resolves the user’s intent using keyword matching and stored context.
7. The deterministic analysis engine uses the curated dataset and scoring logic to produce a structured response.
8. Detailed outputs appear as analysis cards, idea cards, risk observations, and research summaries.
9. Alerts and activity pages provide monitoring context for the user’s research flow.

## Research Engine

The core research engine is implemented in `agent/research-data.ts` and `agent/analysis-engine.ts`.

It provides:

- stock profile data including sector, valuation, quality, and financial fundamentals
- risk and signal classifications
- research score and priority labels
- catalyst and risk lists
- bull and bear case narratives
- stock-to-stock comparison logic
- portfolio impact calculations for holdings in the demo portfolio

The scoring model is deterministic and local. It uses rule-based comparisons, not market feeds or machine learning inference.

The project is explicit about the data source: this is a demo data model built for hackathon prototype exploration, not real-time financial information.

## Demo Data and Limitations

LYNCH is intentionally built as a prototype project and should be treated as a demo workspace.

The current implementation makes the following limitations clear:

- market data is static and fictional for prototype purposes
- portfolio connections are demo-oriented rather than real brokerage integrations
- analysis is based on curated local data, not a live market feed
- outputs are designed for research exploration, not execution or trading advice
- the app is not a brokerage system, order management system, or financial advisory platform
- the information in the app is not financial advice

This transparency is important to the product: LYNCH is a research and design system for structured thinking about investments, not a production-grade investment platform.

## User Journeys

### Stock Research

Dashboard
→ Select Stock
→ Stock Research Workspace
→ Fundamental Analysis
→ Valuation + Risk Review
→ Ask LYNCH / Compare / Create Alert

### Portfolio Analysis

Portfolio
→ Holdings and Allocation
→ Risk Insights
→ Performance Overview
→ Ask LYNCH About Portfolio Context

### Investment Research

Chat
→ “Give me some investment ideas”
→ Idea cards and ranked opportunities
→ Stock research page for deeper review
→ Portfolio impact and alert review

## UI / UX

The design language is a dark-mode financial intelligence workspace with a high-trust, data-first aesthetic. The app emphasizes:

- a disciplined dark financial interface
- consistent navigation across dashboard, overview, portfolio, stocks, alerts, and activity
- a collapsible sidebar and clean command-center layout
- structured cards for research, metrics, and analysis
- clear hierarchy between portfolio context, stock research, and risk signals
- responsive design suitable for a prototype research experience

The interface is designed to make financial analysis feel organized, understandable, and high-signal rather than noisy.

## Project Structure

```text
LYNCH/
├── .latentcode/
│   └── skills/
│       └── vs-equity-research-idea-generation/
├── agent/
│   ├── ai.ts
│   ├── analysis-engine.ts
│   ├── Chat.tsx
│   ├── demo-responses.ts
│   ├── events.ts
│   ├── research-data.ts
│   └── ...
├── alerts/
│   ├── ActivityCard.tsx
│   ├── ActivityDetails.tsx
│   ├── ActivityFeed.tsx
│   ├── AlertCard.tsx
│   ├── AlertManager.tsx
│   ├── CreateAlert.tsx
│   ├── DemoEventSimulator.tsx
│   ├── alert-data.ts
│   └── README.md
├── app/
│   ├── activity/
│   ├── alerts/
│   ├── chat/
│   ├── overview/
│   ├── portfolio/
│   ├── stock/
│   ├── stocks/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── ui/
│   ├── components/
│   ├── dashboard/
│   ├── data/
│   ├── navigation/
│   ├── stock/
│   └── ...
├── .gitignore
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
├── README.md
└── test-agent-evaluation.js
```

## Build in Public

This project was built in public as part of the LYNCH journey. The build updates and product narrative were shared publicly on X:

- Post 1: https://x.com/Neelashish_08/status/2094044919044468846?s=20
- Post 2: https://x.com/Neelashish_08/status/2093434538496327943?s=20

These posts document the product evolution, early design direction, and the iterative build process behind the LYNCH workspace.

## Summary

LYNCH is a research-focused financial intelligence prototype that brings together portfolio analysis, stock research, idea generation, risk monitoring, and conversational insights in one UI. It is intentionally built around a curated demo dataset and deterministic logic, making it a compelling hackathon-grade proof of concept for structured investment analysis rather than a live trading platform.

The project is best understood as a polished, demo-first financial workspace for exploring how modern investing research tools could be structured, communicated, and made actionable for users.
