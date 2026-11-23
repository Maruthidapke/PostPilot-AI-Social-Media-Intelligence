# PostPilot AI: User Stories & Acceptance Criteria

**Project Code:** P59  
**Team Lead:** Maruthi Dapke (ENG24CS0127)  
**Total Sprints:** 2 Sprints (Sprint 1: Post Scheduling Calendar; Sprint 2: Comment Sentiment Analytics & Best-Time Suggestions)  
**Total User Stories:** 20 Stories (Invest Criteria Compliant)

---

## Sprint 1: Multi-Platform Post Scheduling & Calendar (Days 7–13)
*Committed: 26 Story Points | Completed: 26 Story Points (Velocity: 26 pts)*

- **US-01 (Points: 5): User Authentication & Role Guard**
  - *As a* social media manager, *I want to* securely register and log in with JWT, *so that* my scheduled posts and connected credentials remain isolated.
  - *Acceptance Criteria:* Passwords hashed using bcrypt; JWT expires after 7 days; unauthenticated requests return 401.

- **US-02 (Points: 5): Instagram Professional OAuth Flow**
  - *As a* creator, *I want to* connect my Instagram Business account via official Meta authorization, *so that* PostPilot can analyze permitted media.
  - *Acceptance Criteria:* Requests `instagram_basic,instagram_manage_insights,instagram_content_publish`; handles both live redirect and simulated developer sandbox mode.

- **US-03 (Points: 3): Facebook Page Connection**
  - *As a* marketing admin, *I want to* select from my managed Facebook Pages, *so that* public post feeds and comments can be analyzed.
  - *Acceptance Criteria:* Pulls managed accounts; stores encrypted access tokens.

- **US-04 (Points: 5): Post Composition & Multi-Platform Preview**
  - *As a* content creator, *I want to* preview how my post looks on Instagram, Facebook, LinkedIn, and Twitter, *so that* I can adjust caption formatting before publishing.
  - *Acceptance Criteria:* Real-time live card preview updates as user types; 280-char counter for Twitter.

- **US-05 (Points: 5): Autonomous Post Publishing Daemon**
  - *As a* business owner, *I want* my posts to publish automatically at the scheduled date and time, *so that* I don't have to manually dispatch them.
  - *Acceptance Criteria:* Background runner checks queue every 10 seconds; updates status from `scheduled` to `published`; logs execution timestamp.

- **US-06 (Points: 3): Interactive Publishing Calendar Grid**
  - *As a* campaign planner, *I want to* view scheduled and published posts on a monthly calendar, *so that* I can spot gaps in our publishing schedule.
  - *Acceptance Criteria:* Color-coded platform badges; clicking an event shows post details; clicking an empty date launches composer.

---

## Sprint 2: Sentiment Intelligence & Predictive Recommendations (Days 14–20)
*Committed: 30 Story Points | Completed: 30 Story Points (Velocity: 30 pts)*

- **US-07 (Points: 8): Pretrained Transformer Sentiment Analysis**
  - *As an* analyst, *I want to* analyze audience comments using a pretrained social media sentiment model, *so that* I can understand audience mood.
  - *Acceptance Criteria:* Classifies text into Positive, Neutral, Negative with confidence (0.0 to 1.0); extracts recurring complaint and praise themes.

- **US-08 (Points: 5): 60-Comment Ground Truth Benchmark Validation**
  - *As an* academic evaluator, *I want to* validate the sentiment model against 60 human-labeled comments, *so that* I can confirm >= 80% accuracy.
  - *Acceptance Criteria:* Runs 60 benchmark items; outputs 3x3 confusion matrix, precision, recall, macro F1, and verifies target agreement.

- **US-09 (Points: 8): Machine Learning Engagement Regressor**
  - *As a* marketer, *I want to* forecast expected likes and comments for planned drafts, *so that* I can optimize content formats before publishing.
  - *Acceptance Criteria:* Inputs platform, format, day, hour, caption length; outputs interaction range and viral tier; handles low data guard.

- **US-10 (Points: 5): 7x24 Best Time to Post Heatmap**
  - *As a* creator, *I want to* see a weekly hourly heatmap of historical audience activity, *so that* I can choose the top 3 publishing windows.
  - *Acceptance Criteria:* Renders 168 cells; calculates average interactions per slot; 1-click apply button pre-populates scheduler.

- **US-11 (Points: 4): Multi-Variant AI Content Writing Assistant**
  - *As a* copywriter, *I want to* generate 3 distinct caption variants and curated hashtags based on business tone, *so that* I overcome creative block.
  - *Acceptance Criteria:* Generates Storytelling, Punchy, and Promotional options; displays AI disclosure banner.

---

## Traceability Matrix (Requirements to Stories and Tests)

| Requirement | User Story | Unit & E2E Test | Status |
|---|---|---|---|
| FR-01 (Auth) | US-01 | `api.test.js` (Auth Suite) | Implemented & Verified |
| FR-02 (Instagram OAuth) | US-02 | `api.test.js` (IG Connector) | Implemented & Verified |
| FR-06 (Token Encryption) | US-01 | `api.test.js` (AES-256-GCM) | Implemented & Verified |
| FR-08 (Scheduler Daemon) | US-05 | `e2e_journey.js` (Step 11-12) | Implemented & Verified |
| FR-11 (Sentiment Analysis)| US-07 | `api.test.js` (Lexicon-Valence) | Implemented & Verified |
| FR-13 (Benchmark 60) | US-08 | `api.test.js` (60 Benchmark) | Implemented & Verified (83.3%) |
| FR-14 (ML Predictions) | US-09 | `api.test.js` (RF Regressor) | Implemented & Verified |
| FR-16 (Best Time 7x24) | US-10 | `api.test.js` (Best Time Grid) | Implemented & Verified |
