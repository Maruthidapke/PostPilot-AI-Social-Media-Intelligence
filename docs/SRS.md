# PostPilot AI: Software Requirements Specification (SRS v2.0)

**Project Code:** P59  
**Domain:** Marketing / Social Media  
**Student Author:** Maruthi Dapke (USN: ENG24CS0127)  
**Institution:** Dayananda Sagar University, School of Engineering, Bengaluru  
**Subject:** AI in Software Engineering / Software Engineering and Project Management (SEPM)  
**Status:** Human-Audited & Approved (Version 2.0)

---

## 1. Introduction

### 1.1 Purpose
PostPilot AI is an enterprise-grade social media management, audience sentiment analytics, and predictive scheduling platform. It centralizes account connections across Instagram, Facebook, LinkedIn, and X (Twitter), synchronizes permitted account feeds, performs transformer-calibrated sentiment classification on audience feedback, forecasts post engagement using machine learning regression, recommends optimal publishing windows via a 7x24 heatmap, and automates content publishing.

### 1.2 Problem Statement
Small business owners, digital marketers, and content creators struggle with:
1. Fragmented multi-platform management across separate social media applications.
2. Inability to gauge audience sentiment and recurring customer complaints in comments.
3. Guesswork in choosing effective publishing times and predicting future post reach.
4. Managing scheduled posts reliably across timezones without duplicate publishing risks.

### 1.3 Scope of the Software
- **Supported Social Connectors:**
  - **Priority 1: Instagram Professional Accounts** (Business and Creator accounts connected to Facebook Pages via Meta Graph API).
  - **Priority 2: Facebook Pages** (Pages managed with Admin/Editor roles).
  - **Priority 3: LinkedIn Organization Pages** (Company and Showcase pages).
  - **Priority 4: X (Twitter)** (OAuth 2.0 with PKCE).
- **Core AI Modules:**
  - Lexicon-Valence Transformer Sentiment Analysis (Positive, Neutral, Negative with confidence).
  - 60-Comment Ground-Truth Benchmark Validation Suite (Target >= 80% accuracy).
  - Machine Learning Engagement Regressor (RF-v1.4 Chronological Split).
  - 7x24 Weekly Best Time to Post Heatmap.
  - Multi-Variant AI Content Writing Assistant.
- **Autonomous Publishing Engine:**
  - Persistent queue daemon processing scheduled posts with timezone safety.

---

## 2. Overall Description

### 2.1 User Characteristics & Personas
- **Marketing Managers:** Requires cross-platform comparison, reach trends, and audience mood tracking.
- **Content Creators:** Requires post scheduling calendar, multi-platform preview, and AI caption variants.
- **Small Business Owners:** Requires automated best-time recommendations and complaint detection.
- **Academic Evaluators:** Requires SEPM compliance evidence, test coverage, and reproducible demo mode.

### 2.2 Operating Environment
- Client: Modern web browsers (Chrome, Firefox, Safari, Edge).
- Server: Node.js 18+ (Express), Python 3.10+ (FastAPI / Inference Service).
- Persistence: Dual-Engine architecture supporting MongoDB 6.0+ via Mongoose and persistent JSON file fallback (`data/db.json`).

---

## 3. Specific Requirements

### 3.1 Functional Requirements (FR-01 to FR-20)
- **FR-01 (Authentication):** Users shall register, log in with JWT authentication, and passwords shall be hashed using bcrypt (salt rounds >= 10).
- **FR-02 (Instagram OAuth Connector):** System shall authenticate Instagram Business/Creator accounts via Meta Graph API OAuth 2.0 flow.
- **FR-03 (Facebook Page Ingestion):** System shall retrieve managed Facebook Pages, page feeds, and engagement statistics.
- **FR-04 (LinkedIn Connector):** System shall support LinkedIn Organization OAuth 2.0 and UGC post sharing.
- **FR-05 (Twitter PKCE Connector):** System shall support Twitter OAuth 2.0 PKCE and automated tweet publishing.
- **FR-06 (Credential Isolation):** All OAuth access and refresh tokens shall be encrypted using AES-256-GCM and never exposed to the frontend.
- **FR-07 (Post Composition):** System shall allow users to compose multi-platform posts with title, caption, hashtags, media URL, and scheduled datetime.
- **FR-08 (Live Preview):** System shall render real-time WYSIWYG previews for Instagram, Facebook, LinkedIn, and Twitter.
- **FR-09 (Autonomous Scheduler):** Persistent background runner shall check due posts every 10 seconds and dispatch to live API or labeled simulator.
- **FR-10 (Content Calendar):** System shall provide interactive monthly and weekly calendar views color-coded by platform.
- **FR-11 (Sentiment Analysis):** System shall classify audience comments into positive, neutral, or negative categories with confidence scores.
- **FR-12 (Audience Themes):** System shall extract common customer complaints, questions, and feature praise from comment text.
- **FR-13 (Benchmark Validation):** System shall validate model accuracy against a 60-comment human ground truth benchmark, meeting the >= 80% agreement target.
- **FR-14 (Engagement Forecasting):** Machine learning engine shall predict expected interaction ranges, viral tiers, and baseline outperformance.
- **FR-15 (Insufficient Data Defense):** System shall display a clear low-data warning if an account has fewer than 3 historical posts.
- **FR-16 (Best Time Heatmap):** System shall calculate a 7x24 weekly matrix and recommend the top 3 publishing windows.
- **FR-17 (One-Click Scheduling):** Clicking any recommended time slot shall pre-populate the post scheduler.
- **FR-18 (AI Writing Assistant):** System shall generate 3 distinct caption variants (Storytelling, Punchy, CTA) and hashtags.
- **FR-19 (Data Attribution Tagging):** Every metric shall explicitly distinguish Actual Platform, Calculated, AI Predicted, or Demo data.
- **FR-20 (SEPM Workspace):** Interactive academic hub for SDLC models, requirements traceability, Sprints, Kanban, Planning Poker, and Syllabus tracker.

### 3.2 Non-Functional Requirements (NFR-01 to NFR-06)
- **NFR-01 (Security):** Tokens encrypted with AES-256-GCM; JWT expiration set to 7 days; CORS strictly configured.
- **NFR-02 (Performance):** Dashboard API endpoints shall respond in under 300ms for cached data.
- **NFR-03 (Reliability):** Zero-config dual-engine persistence ensures uninterrupted operation during demos.
- **NFR-04 (Accuracy):** Sentiment agreement with human annotations shall be at least 80.0%.
- **NFR-05 (Usability):** Responsive SaaS design using Tailwind CSS with mobile, tablet, and desktop support.
- **NFR-06 (Maintainability):** Modular connector architecture allowing new social providers to be added without modifying core controllers.

---

## 4. SRS Evolution (v1 AI Draft vs v2 Human-Audited)

| Section | Initial AI Draft (v1.0) | Human-Audited & Corrected (v2.0) |
|---|---|---|
| Account Scope | Claimed full access to personal Instagram accounts | Restricted strictly to Instagram Business/Creator accounts linked to Facebook Pages (Meta API Compliance) |
| Predictions | Promised exact deterministic viral follower counts | Replaced with probabilistic confidence intervals (e.g. 210 - 295 interactions) and uncertainty bounds |
| Token Security | Stored plain bearer tokens in database collection | Enforced AES-256-GCM encryption with separate IV and Auth Tag |
| Data Integrity | Allowed fabricated numbers to fill empty charts | Mandatory Data Attribution rules: Show "Not available through connected permissions" |
