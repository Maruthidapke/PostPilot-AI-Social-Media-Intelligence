# PostPilot AI: AI Usage & Prompt Engineering Log

**Student:** Maruthi Dapke (ENG24CS0127)  
**Project:** PostPilot AI (P59)  

---

## Prompt Audit Record

### Prompt 1: Requirements Engineering & User Stories
- **AI Tool:** ChatGPT (GPT-4o)
- **Objective:** Draft initial user stories and acceptance criteria for social media scheduling and analytics.
- **AI Output:** Produced generic stories assuming direct access to personal Instagram accounts and unconstrained Twitter posting.
- **Human Modification:** Revised stories to reflect Meta Graph API Professional Account requirement (Instagram Business linked to Facebook Page) and enforced AES-256 token encryption.
- **Status:** Approved for SRS v2.0.

### Prompt 2: Machine Learning Engagement Regressor
- **AI Tool:** GitHub Copilot
- **Objective:** Synthesize feature extraction logic and chronological dataset splitting for engagement prediction.
- **AI Output:** Provided standard Random Forest regressor with K-fold cross-validation.
- **Human Modification:** Rejected K-fold CV due to temporal data leakage; implemented chronological train/test splitting based on post publishing dates to reflect real-world forecasting.
- **Status:** Integrated in `PredictionEngine`.

### Prompt 3: 60-Comment Ground Truth Benchmark
- **AI Tool:** ChatGPT (GPT-4o)
- **Objective:** Curate realistic marketing domain feedback comments for sentiment validation.
- **AI Output:** Generated 60 diverse comments across positive, neutral, and negative classes.
- **Human Modification:** Human independently verified and locked each sentiment label before running model inference. Prohibited altering ground truth labels during calibration.
- **Status:** Integrated in `services/sentimentService.js` (83.3% achieved).
