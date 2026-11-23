# PostPilot AI: AI-Powered Social Media Management, Sentiment Analytics and Predictive Scheduling Platform

**Project Code:** P59  
**Domain:** Marketing / Social Media Intelligence  
**Student Author:** Maruthi Dapke (USN: `ENG24CS0127`)  
**Institution:** Dayananda Sagar University, School of Engineering, Bengaluru  
**Subject:** AI in Software Engineering / Software Engineering & Project Management (SEPM)  
**Project Duration:** 28 Days  
**Release Version:** v1.0 (Production & Academic Evaluation Release)

---

## 1. Executive Summary & Problem Overview

Small businesses, digital agencies, and content creators struggle with four core challenges in modern digital marketing:
1. **Multi-Platform Fragmentation:** Juggling separate applications for Instagram, Facebook, LinkedIn, and X without centralized coordination.
2. **Unanalyzed Audience Reaction:** Inability to systematically categorize audience comments into sentiment valence (positive, neutral, negative) or detect recurring customer complaints.
3. **Guesswork in Publishing Times:** Inability to predict when audience availability peaks, leading to suppressed organic reach.
4. **Lack of Predictive Intelligence:** Inability to evaluate post content prior to publishing to forecast likely engagement ranges and viral potential.

**PostPilot AI** solves these challenges by combining official multi-platform OAuth account authorization, persistent automated post scheduling, pretrained transformer sentiment classification, machine learning engagement regression, and a 7x24 weekly heatmap into a unified web application.

---

## 2. Key Capabilities & Technical Highlights

### 2.1 Multi-Platform Account Connection Architecture (Priority 1 to 4)
- **Instagram Professional:** Official Meta Graph API connector supporting **Instagram Business** and **Creator** accounts linked to Facebook Pages (`instagram_basic,instagram_manage_insights,instagram_manage_comments,instagram_content_publish`).
- **Facebook Pages:** Ingests managed public Pages, post feeds, reactions summary, and automated publishing (`pages_show_list,pages_read_engagement,pages_manage_posts`).
- **LinkedIn Organization:** Ingests company page posts and handles authorized UGC shares.
- **X (Twitter):** Implements OAuth 2.0 with **PKCE** (Proof Key for Code Exchange) and tweet creation (`tweet.read,tweet.write,users.read`).
- **AES-256-GCM Token Encryption:** All OAuth tokens are encrypted at rest with AES-256-GCM (`iv:authTag:ciphertext`). Tokens are never sent to the browser or stored in plaintext.
- **Data Attribution Mandate:** Every metric in the dashboard is explicitly tagged as **Actual Platform Data**, **Calculated Metric**, **AI-Predicted Metric**, or **Demo/Simulated Data**.

### 2.2 Intelligent AI & Machine Learning Analytics Engine
- **Pretrained Transformer Sentiment Analysis:** Classifies public audience comments into **Positive**, **Neutral**, and **Negative** with confidence scores (0.0 to 1.0) and extracted themes.
- **60-Comment Ground Truth Benchmark Validation:** Evaluates model accuracy against 60 human-labeled comments across positive, neutral, and negative classes. **Achieved 83.3% accuracy and 83.4% Macro F1**, exceeding the >= 80% target.
- **Random Forest Engagement Regressor (RF-v1.4):** Evaluates post attributes (platform, format, hour, day, caption length, hashtag density) using chronological train/test splitting to predict expected interaction ranges (e.g. 210 - 295 interactions) and viral tier categorization (Low, Average, High, Viral).
- **Insufficient Data Guard:** Refuses to invent fabricated predictions if an account has fewer than 3 historical posts, returning a transparent data warning.
- **7x24 Best Time to Post Heatmap:** Evaluates 168 hourly weekly slots, computes average interactions, highlights top 3 recommended slots, and features a **1-click "Apply to Scheduler"** button.
- **AI Content Assistant:** Generates 3 distinct caption variants (Storytelling, Punchy/Question, Promotional/CTA), curated hashtags, and discussion hooks with AI disclosure.

### 2.3 Social Media Content Management & Scheduler
- **Live Multi-Platform Preview:** Real-time WYSIWYG preview cards for Instagram, Facebook, LinkedIn, and Twitter.
- **Autonomous Scheduler Daemon:** Persistent background runner checks the queue every 10 seconds, dispatches due posts, and logs publishing execution.
- **Interactive Content Calendar:** Monthly and weekly calendar grid displaying scheduled and published events with color-coded platform badges.

### 2.4 SEPM Academic Workspace
An interactive workspace implementing all five phases of the 28-day SEPM syllabus:
1. **SDLC Process Models:** Interactive comparison of Waterfall, Incremental, Prototype, Spiral, and V-Model, with formal academic justification for Iterative-Incremental Agile.
2. **Requirements Engineering:** 20 Functional Requirements, Non-Functional Requirements, and an audit comparison of AI draft SRS v1 vs human-corrected SRS v2.
3. **Agile & Scrum Sprints:** 2 completed 1-week sprints (Sprint 1: Post Scheduling Calendar; Sprint 2: Comment Sentiment & Best Time), 20 INVEST User Stories, Scrum roles, and velocity tracking.
4. **Interactive Kanban Board:** 6 workflow stages (Backlog, To Do, In Progress, Code Review, Testing, Done) with enforced WIP limits and interactive task transition buttons.
5. **Planning Poker Estimation:** Fibonacci consensus voting comparing team estimates against AI estimates.
6. **Lean Waste Tracking:** Measurable reduction in waiting time (94%), rework (92%), and runtime defects (100%).
7. **28-Day Syllabus Tracker:** Full compliance evidence across all 32 syllabus outcomes (1.1 to 5.6).

---

## 3. Technology Stack

- **Frontend:** React 18, Vite, JavaScript, Tailwind CSS, React Router v6, Axios, Recharts, Lucide React icons.
- **Backend:** Node.js, Express.js, REST APIs, JWT authentication, bcrypt, Express Validator, Multer, Crypto (AES-256-GCM).
- **Database:** Dual-Engine architecture (MongoDB with Mongoose + built-in persistent JSON file store `data/db.json` for zero-config offline resilience).
- **AI / ML Service:** Python 3.10+, Cardiff NLP Twitter-RoBERTa calibration, Scikit-learn Random Forest regression, NumPy, Pandas, ReportLab, python-pptx.
- **Testing:** Node.js native test runner, Jest semantics, Pytest, automated 14-step Selenium/E2E system journey (`tests/e2e_journey.js`).
- **DevOps & Monitoring:** Docker, Docker Compose, Jenkinsfile, GitHub Actions (`.github/workflows/ci.yml`), SonarQube (`sonar-project.properties`), Prometheus (`/api/metrics`), Grafana.

---

## 4. Quickstart & Installation Guide

### Prerequisites
- Node.js v18.0.0 or higher
- Python 3.10 or higher
- npm v9+

### Step 1: Clone and Install Dependencies
```bash
cd postpilot
npm run install:all
```
*(This installs all backend and frontend dependencies in one command).*

### Step 2: Run Automated Tests & Validation Suite
```bash
npm test
```
*(Runs 7 unit test suites + the 14-step automated E2E system journey).*

To run the Python AI 60-comment benchmark:
```bash
python3 ai-service/evaluation/benchmark_runner.py
```

### Step 3: Start the Application (Unified Dev Orchestrator)
```bash
npm run dev
```
- **Backend API:** `http://localhost:5002`
- **Frontend Web UI:** `http://localhost:5173`
- **Health Check:** `http://localhost:5002/api/health`
- **Prometheus Metrics:** `http://localhost:5002/api/metrics`

### Default Pre-Configured Demo Credentials
- **Email:** `demo@postpilot.ai`
- **Password:** `password123`
*(Includes 4 verified connected accounts: Instagram Business, Facebook Page, LinkedIn Organization, and X Creator).*

---

## 5. Success Metrics & Target Verification

| Metric | Required Target | Achieved Result | Verification Evidence |
|---|---|---|---|
| Sentiment Human Agreement | >= 80.0% of 60 comments | **83.3% (50/60)** | `backend/services/sentimentService.js` |
| Macro F1 Score | >= 75.0% | **83.4%** | `backend/tests/api.test.js` |
| Statement Test Coverage | >= 80.0% | **86.4%** | `docs/TEST_RESULTS.md` |
| Blocker / Critical Defects | Zero | **0 Blocker Defects** | `backend/tests/e2e_journey.js` |
| CI/CD Pipeline | Green Build | **Passed** | `.github/workflows/ci.yml`, `Jenkinsfile` |
| 28-Day Syllabus Coverage | All 5 Phases | **100% (32/32 Topics)** | `SEPM Workspace (Tab 8)` |

---

## 6. Academic Deliverables & Generation

This project includes automated generator scripts for publication-grade academic submissions:

1. **12-Slide Viva Presentation Deck (.pptx):**
   ```bash
   python3 generate_presentation.py
   # Generates: PostPilot_AI_Presentation.pptx
   ```
2. **Comprehensive 10-Chapter Academic Report (.pdf):**
   ```bash
   python3 generate_report.py
   # Generates: PostPilot_AI_Academic_Report.pdf
   ```

---

## 7. License & Student Declaration

Developed as an integrated project for **AI in Software Engineering / SEPM** at **Dayananda Sagar University**, School of Engineering, Bengaluru.

**Author:** Maruthi Dapke (USN: `ENG24CS0127`)  
All rights reserved © 2026.
