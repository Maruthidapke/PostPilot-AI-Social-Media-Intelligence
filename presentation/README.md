# PostPilot: Social Post Scheduler with Sentiment Analytics
## Official Capstone Presentation Deck (Project Code: P59)

**Student Name:** Maruthi Dapke  
**USN:** ENG24CS0127  
**Institution:** Dayananda Sagar University (DSU), Bengaluru  
**School:** School of Engineering – Department of Computer Science & Engineering  
**Curriculum:** AI in Software Engineering / Software Engineering & Project Management (SEPM)  
**Project Domain:** Marketing | **Duration:** 28 Days  
**GitHub Repository:** [https://github.com/Maruthidapke/PostPilot-AI-Social-Media-Intelligence](https://github.com/Maruthidapke/PostPilot-AI-Social-Media-Intelligence)

---

## 📁 Presentation Deliverables

| File | Format | Description |
|---|---|---|
| [`PostPilot_Social_Post_Scheduler_Presentation.pptx`](./PostPilot_Social_Post_Scheduler_Presentation.pptx) | PowerPoint (16:9) | 12 widescreen slides, SaaS dark navy/blue palette, embedded speaker notes on every slide |
| [`PostPilot_Social_Post_Scheduler_Presentation.pdf`](./PostPilot_Social_Post_Scheduler_Presentation.pdf) | PDF (16:9 Landscape) | Publication-quality 12-page presentation companion |

---

## ⏱️ Presentation Timing Plan (~6 Minutes Total)

| Slide | Title | Target Time | Focus Area |
|---|---|---|---|
| **Slide 1** | Title & Project Overview | 0:00 – 0:40 (40s) | Student credentials, DSU capstone context, project code P59 |
| **Slide 2** | Problem Statement & Objectives | 0:40 – 1:30 (50s) | 6 marketing challenges, PostPilot solutions, target personas |
| **Slide 3** | System Architecture & Data Flow | 1:30 – 2:20 (50s) | 3-tier decoupled model, React 18, Express, Python AI, MongoDB |
| **Slide 4** | Phase 1: AI in SE & Requirements | 2:20 – 3:00 (40s) | SDLC models, Traditional vs AI SDLC, SRS evolution (v1 vs v2) |
| **Slide 5** | Phase 2: Agile Practices & Planning | 3:00 – 3:45 (45s) | Scrum roles, Sprint 1 (26 pts) & Sprint 2 (30 pts), Kanban, Lean |
| **Slide 6** | Phase 3: Development & Deployment | 3:45 – 4:25 (40s) | 8 core modules, tech stack, Docker Compose orchestration |
| **Slide 7** | Phase 4: Testing & Monitoring | 4:25 – 5:00 (35s) | Testing pyramid, 86.4% coverage (>80% target), Prometheus metrics |
| **Slide 8** | Phase 5: SQA & Responsible AI | 5:00 – 5:40 (40s) | ISO/IEC 25010, SonarQube quality gate, AES-256, ethical AI |
| **Slide 9** | Live Application Demonstration | 5:40 – 6:30 (50s) | 6-step workflow: Login ➔ Connect ➔ Sync ➔ Sentiment ➔ Best Time ➔ Schedule |
| **Slide 10** | Results & Performance Evaluation | 6:30 – 7:15 (45s) | 83.3% accuracy on 60 comments, confusion matrix, 142ms latency |
| **Slide 11** | Responsible AI & Learnings | 7:15 – 7:50 (35s) | Ethics, API boundary lessons, dual-review findings, resilience |
| **Slide 12** | Conclusion & Future Scope | 7:50 – 8:30 (40s) | Summary of benefits, roadmap (multilingual, TikTok), Q&A |

---

## 🎙️ Complete Slide-by-Slide Speaker Notes

### Slide 1 – Title & Overview
> *"Good morning respected evaluators, faculty members, and colleagues. My name is Maruthi Dapke, USN ENG24CS0127 from the School of Engineering at Dayananda Sagar University. Today, I am proud to present my 28-day integrated capstone project, Project Code P59: PostPilot: Social Post Scheduler with Sentiment Analytics. Developed under the AI in Software Engineering and SEPM curriculum, this project bridges marketing workflows with modern AI engineering, combining multi-channel social media scheduling with transformer-based sentiment analytics and predictive posting intelligence. The entire production codebase, academic documentation, and automated test suites are openly accessible on GitHub. In this presentation, I will walk you through the problem statement, system architecture, SDLC phases, testing validation, and live results."*

### Slide 2 – Problem Statement & Objectives
> *"In digital marketing today, small business owners, content creators, and marketing managers face six critical bottlenecks: First, managing multiple social networks is fragmented and requires switching between disparate tools. Second, maintaining a regular posting schedule is difficult without automated scheduling. Third and fourth, while marketers can see vanity metrics like likes, they are blind to genuine comment sentiment, often missing critical customer complaints. Fifth, performance metrics are scattered across separate platform analytics. And sixth, choosing when to publish relies on guesswork rather than empirical data. PostPilot solves these pain points directly. We provide a single SaaS dashboard that automates multi-channel scheduling, analyzes public comment sentiment using transformer AI, and provides a 7-by-24 best-time-to-post heatmap."*

### Slide 3 – System Architecture & Data Flow
> *"Here is the architectural blueprint of PostPilot. We adopted a decoupled, 3-tier architectural model to guarantee scalability, security, and responsiveness. The Presentation Tier is built with React 18, Vite, and Tailwind CSS, featuring an interactive content calendar and dynamic Recharts visualizations. The Application Tier runs on Node.js and Express.js, managing RESTful APIs, JWT authentication, and AES-256-GCM token encryption, with a background daemon polling the queue every 10 seconds. The AI Tier incorporates Hugging Face Transformers in Python for DistilBERT sentiment classification, alongside a Random Forest regressor for engagement prediction. For persistence, we implemented a dual-engine architecture: MongoDB with an automated fallback to a local JSON file store, ensuring zero demo failures. Connectors interface with Instagram, Facebook, LinkedIn, and X subject to API permissions."*

### Slide 4 – Phase 1: Introduction to AI in SE & Requirements Engineering
> *"In Phase 1, we examined how AI transforms Software Engineering and Requirements Engineering. We evaluated classical SDLC process models against PostPilot's needs. While the Waterfall model was too rigid for evolving third-party APIs, an Iterative-Incremental model with prototyping allowed us to rapidly test UI layouts and sentiment scoring. We incorporated the Spiral model's risk management for OAuth integrations, and the V-Model for testing verification. The key shift between traditional and AI-driven SDLC is velocity: AI assisted us in drafting user stories and generating test cases, while human engineers maintained architectural integrity. During requirements engineering, we authored 20 functional requirements and 6 non-functional requirements. Crucially, our SRS evolved from an initial AI draft that unrealistically assumed open personal Instagram access into a human-audited version 2 that enforces official Meta Business API constraints, AES-256 token encryption, and probabilistic prediction bounds."*

### Slide 5 – Phase 2: Agile Practices, Planning Poker & Sprints
> *"Phase 2 covers Agile practices, Scrum execution, and planning poker. We executed the 28-day project across two 14-day sprints under Scrum roles: Product Owner, Scrum Master, and Development Lead. Using Planning Poker with modified Fibonacci numbers, we sized our user stories, ensuring they met INVEST standards. Sprint 1, totaling 26 story points, delivered the core scheduling calendar, multi-platform preview, OAuth token encryption, and the background daemon. Sprint 2, totaling 30 story points, delivered the sentiment analysis pipeline, the 60-comment ground truth benchmark, and the 7-by-24 best-time heatmap. To manage workflow, we implemented a 5-column Kanban board with strict Work-In-Progress limits of 3 concurrent tasks. By embracing Lean software principles, we eliminated wasteful context-switching, reducing waiting time by 94% and rework by 92% through upfront API contract definitions."*

### Slide 6 – Phase 3: Development, Modules & Deployment
> *"Phase 3 highlights our implementation and deployment architecture. PostPilot was built around eight major application modules: User Authentication with JWT and bcrypt; Social Account Connection with encrypted token storage; an autonomous Post Scheduler daemon polling every 10 seconds; an interactive Content Calendar; a Sentiment Analytics engine; an Engagement Analytics dashboard; an AI Content Assistant for copy generation; and Predictive Recommendations offering optimal posting times across a 168-hour heatmap. Our stack combines React 18 on the frontend, Node.js and Express on the backend, and Python with Hugging Face Transformers for AI processing. For enterprise deployment readiness, the entire ecosystem is containerized using Docker and Docker Compose, with Prometheus tracking active system metrics."*

### Slide 7 – Phase 4: AI-Based Testing & System Monitoring
> *"Phase 4 covers AI-based testing, practical test scenarios, and production monitoring. Quality assurance was integrated from the start across unit, integration, and end-to-end testing. We used AI to generate complex edge cases—specifically comments with slang, sarcasm, and emojis—to challenge our sentiment pipeline. We validated six practical scenarios: authentication, social account connection, post creation, queue scheduling, sentiment classification, and metrics aggregation. Our academic target was 80% test coverage. We achieved 86.4% statement coverage, with all 7 backend test suites and all 14 steps of our end-to-end automated journey passing without error. There are zero blocker defects. For real-time observability, our Prometheus endpoint at /api/metrics monitors response times and scheduler queue health."*

### Slide 8 – Phase 5: Quality Assurance & Responsible AI
> *"Phase 5 focuses on Quality Assurance and Responsible AI. Adhering to ISO/IEC 25010 and IEEE 730 SQA standards, we evaluated five core software quality attributes: correctness, reliability, maintainability, usability, and efficiency. Our SonarQube quality gate enforced zero blocker bugs and zero security vulnerabilities. A notable finding from our dual-review workflow was that while AI tools identified formatting issues in seconds, human engineering was necessary to identify and prevent training data leakage in our engagement model, enforcing chronological data splitting. Simultaneously, we established a Responsible AI framework: we protect user privacy by analyzing public comments only for sentiment, encrypt OAuth credentials using AES-256, maintain transparency with confidence meters and clear data attribution tags, and enforce human-in-the-loop oversight so that no content is published without human approval."*

### Slide 9 – Live Application Demonstration
> *"Slide 9 walks through our live application demonstration across six clear operational steps: Step 1: The user logs in securely using JWT authentication. Step 2: They connect their social media channels—Instagram Business, Facebook Pages, LinkedIn, and X—with AES-256 credential encryption. Step 3: The system synchronizes the latest posts and audience comments from the platforms. Step 4: Our AI sentiment pipeline classifies comments into positive, neutral, and negative clusters with visual confidence meters. Step 5: The user consults the 7-by-24 heatmap to select the optimal publishing window based on empirical data. Step 6: Finally, they draft their content using AI caption suggestions and schedule the post on the visual calendar, where our daemon handles automated dispatch. As shown in the bottom banner, we enforce strict transparency: the UI clearly distinguishes whether metrics originate from live social APIs or our offline demo sandbox."*

### Slide 10 – Results & Performance Evaluation
> *"Slide 10 presents our empirical results and performance evaluation against our academic targets. To test our sentiment analysis pipeline, we used a curated ground truth benchmark of 60 representative social media comments evaluated against human annotations. Our target was 80% agreement. PostPilot achieved 83.3% accuracy, correctly classifying 50 out of 60 comments, with a Macro F1 score of 0.834. The confusion matrix on the right shows high precision: 90% for positive comments, and 80% for neutral and negative classes. On the software engineering side, our target test coverage was 80%, and we achieved 86.4% statement coverage with zero blocker defects. In addition, our backend API delivers an average latency of 142 milliseconds—well below our 200-millisecond threshold—and our background scheduler achieved 100% on-time dispatch reliability. All figures represent actual measured outcomes without fabrication."*

### Slide 11 – Responsible AI & Key Learnings
> *"Slide 11 reflects on our Responsible AI commitments and core engineering learnings. From an ethics standpoint, we prioritized privacy, security, and transparency: OAuth tokens are encrypted with AES-256, comments are analyzed without demographic profiling, and sentiment models are calibrated for objectivity. Crucially, we present engagement estimates as probabilistic ranges rather than making false virality guarantees, and we keep the human marketer firmly in the loop. From an engineering perspective, this project offered five invaluable lessons: First, verifying real-world API restrictions during requirements engineering saved weeks of potential rework. Second, Agile practices and Kanban WIP limits kept our 28-day timeline focused. Third, while AI tools vastly accelerated boilerplate and test creation, human oversight was essential to ensure security and prevent data leakage. Finally, implementing defensive persistence fallbacks guaranteed complete system resilience during presentations."*

### Slide 12 – Conclusion & Future Scope
> *"In conclusion, PostPilot demonstrates that combining multi-channel social post scheduling with AI sentiment analytics and predictive modeling creates substantial operational efficiency for marketing teams while maintaining rigorous software engineering standards. It centralizes multi-platform management, automates publishing, provides actionable sentiment insights, and optimizes content planning with empirical best-time recommendations. Looking forward, our roadmap includes integrating TikTok and YouTube Shorts, expanding into multilingual sentiment analysis for Indic languages, and refining predictive algorithms with computer vision models. I would like to express my sincere gratitude to my faculty mentors and Dayananda Sagar University for their support and guidance throughout this project. The full source code, documentation, and test suites are openly accessible on GitHub. Thank you, and I am now ready to take your questions."*

---

## 🎯 Anticipated Faculty Viva Questions & Model Answers

1. **Q: Why did you choose DistilBERT over standard BERT or large LLMs for sentiment analysis?**  
   *A:* DistilBERT offers a 40% reduction in model size and 60% faster inference while retaining 97% of BERT's language comprehension capabilities. This enables fast local inference on commodity hardware without incurring cloud GPU costs, perfectly satisfying our non-functional requirement of sub-200ms API latency.

2. **Q: How does PostPilot handle Instagram or LinkedIn API rate limits and token expiry?**  
   *A:* We use exponential backoff retry algorithms for external API calls, cache rate-limit headers in Redis/memory, and store encrypted refresh tokens with automated renewal checks before initiating publishing requests.

3. **Q: How do you prevent data leakage in your engagement prediction model?**  
   *A:* During Phase 5 code auditing, we replaced naive random train-test splitting with strict chronological splitting. Training data exclusively uses posts prior to timestamp $T$, and evaluation is conducted on subsequent posts, accurately mimicking production forecasting.

4. **Q: What is the significance of the 60-comment ground truth benchmark?**  
   *A:* It serves as an objective, empirical test suite created by human evaluators with balanced representation across positive, neutral, and negative comments (including internet slang and emojis). Achieving 83.3% accuracy validated that our model exceeds the 80% academic threshold without overfitting.
