# PostPilot AI: Responsible AI & Ethics Charter

**Project Code:** P59  
**Domain:** Marketing  
**Author:** Maruthi Dapke (ENG24CS0127)  

---

## 1. Ethical AI Principles in Social Media Management

### 1.1 Non-Deterministic Prediction Transparency
- PostPilot explicitly informs users that machine learning forecasts represent **probabilistic estimates**, not guaranteed virality.
- Expected interaction ranges are displayed with lower and upper confidence bounds rather than single rigid numbers.
- When an account has fewer than 3 posts, the system refuses to produce arbitrary estimates, rendering: `"Insufficient historical data to generate a reliable prediction."`

### 1.2 Boundary of Sentiment Inference
- Sentiment analysis strictly evaluates the linguistic text valence of public audience comments.
- The model does **NOT** infer the personal identity, demographics, or private attributes of commenters.
- Confidence scores are exposed alongside predictions (e.g. `Confidence: 88.3%`).

### 1.3 Data Minimization & Privacy
- Only public page feeds and authorized professional insights are retrieved.
- Sensitive OAuth credentials are encrypted with AES-256-GCM.
- When a user disconnects an account, stored tokens and local data snapshots are purged.

### 1.4 Human-in-the-Loop Content Supervision
- The AI Content Assistant provides multi-variant copy suggestions, but mandates human approval before scheduling or publishing.
- Clear AI disclosure badges (`AI-Assisted Generation`) are displayed in the UI.

### 1.5 Distinguishing Data Authenticity
PostPilot strictly tags every analytical metric with its origin:
1. `Actual Platform Data` (retrieved through official APIs)
2. `Calculated Metric` (e.g., Engagement Rate = Interactions / Reach)
3. `AI Predicted Metric` (e.g., Random Forest forecast)
4. `Demo / Simulated Data` (local offline college sandbox data)
