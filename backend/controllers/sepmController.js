import { getCollection, saveStore, isMongo } from '../config/db.js';

export const getSDLCData = (req, res) => {
  res.json({
    success: true,
    selectedModel: 'Iterative-Incremental Agile with AI Rapid Prototyping',
    justification: 'PostPilot AI requires frequent validation of AI inference accuracy, continuous API adapter testing against evolving Meta/X API restrictions, and short two-week feedback loops from marketing stakeholders. A rigid Waterfall model would risk building on deprecated API schemas or uncalibrated sentiment thresholds.',
    modelsComparison: [
      {
        name: 'Waterfall',
        stages: 'Requirements -> System Design -> Implementation -> Verification -> Maintenance',
        advantages: 'Rigid structure, clear milestones, thorough upfront documentation.',
        disadvantages: 'Zero tolerance for late requirement shifts; high risk of building obsolete social connectors.',
        suitability: 'Low (Poor fit for dynamic social media platforms and iterative ML model tuning).'
      },
      {
        name: 'Incremental',
        stages: 'Requirements breakdown -> Staged builds -> Component deployment -> Integration',
        advantages: 'Early working software delivered; core features like post scheduling can ship before ML models.',
        disadvantages: 'Requires clean modular interfaces to prevent regression across connectors.',
        suitability: 'High (Core scheduling engine delivered in increment 1, AI intelligence in increment 2).'
      },
      {
        name: 'Prototype',
        stages: 'Quick design -> Prototype creation -> User feedback -> Refinement -> Final production',
        advantages: 'Validates UX flows (interactive heatmaps, calendar grid) with stakeholders before full backend integration.',
        disadvantages: 'Risk of stakeholder mistaking prototype for production-grade secure software.',
        suitability: 'High for UX and AI prompt tuning phases.'
      },
      {
        name: 'Spiral',
        stages: 'Determine objectives -> Risk analysis -> Engineering -> Plan next phase',
        advantages: 'Unmatched risk mitigation for 3rd-party API rate limits and token security.',
        disadvantages: 'Heavy process overhead for a 28-day sprint timeline.',
        suitability: 'Medium (Beneficial for OAuth credential security and platform rate-limit defenses).'
      },
      {
        name: 'V-Model',
        stages: 'Requirements <-> Acceptance Test, System Design <-> System Test, Architecture <-> Integration Test, Module <-> Unit Test',
        advantages: 'Disciplined early test planning; 80% coverage targets are embedded from day one.',
        disadvantages: 'Difficult to accommodate exploratory machine learning feature engineering.',
        suitability: 'High for QA and test case alignment.'
      }
    ],
    traditionalVsAI: {
      traditional: [
        'Manual specification of all deterministic rules and SQL mappings.',
        'Lengthy human boilerplate coding for boilerplate DTOs and API clients.',
        'Subjective manual code review with delayed feedback cycles.',
        'Deterministic test suite creation with manual edge-case enumeration.'
      ],
      aiDriven: [
        'AI-assisted drafting of user stories, acceptance criteria, and SRS templates.',
        'Accelerated synthesis of OAuth wrappers, regex validators, and mock adapters.',
        'Automated static analysis with SonarQube and LLM review catching vulnerabilities in seconds.',
        'Dynamic synthesis of realistic sentiment validation benchmarks and test cases.'
      ]
    }
  });
};

export const getRequirements = (req, res) => {
  res.json({
    success: true,
    functionalRequirements: [
      { id: 'FR-01', title: 'User Registration & Authentication', priority: 'High', status: 'Implemented', description: 'System shall allow users to register, log in with JWT, and hash passwords using bcrypt.' },
      { id: 'FR-02', title: 'Instagram Professional OAuth Authorization', priority: 'High', status: 'Implemented', description: 'System shall authenticate Instagram Business/Creator accounts via Meta Graph API.' },
      { id: 'FR-03', title: 'Facebook Page Management & Feed Ingestion', priority: 'High', status: 'Implemented', description: 'System shall retrieve managed Facebook Pages, page feeds, and engagement statistics.' },
      { id: 'FR-04', title: 'LinkedIn Organization Social Ingestion', priority: 'Medium', status: 'Implemented', description: 'System shall authorize and ingest LinkedIn company posts and public metrics.' },
      { id: 'FR-05', title: 'X (Twitter) v2 Tweet Ingestion & Posting', priority: 'Medium', status: 'Implemented', description: 'System shall support OAuth 2.0 PKCE authentication and dispatch tweets.' },
      { id: 'FR-06', title: 'Token Encryption & Secret Isolation', priority: 'Critical', status: 'Implemented', description: 'All access/refresh tokens must be encrypted with AES-256-GCM and never sent to the client.' },
      { id: 'FR-07', title: 'Multi-Platform Post Scheduling', priority: 'High', status: 'Implemented', description: 'Users shall compose posts with media, tags, and specify publishing datetime and timezone.' },
      { id: 'FR-08', title: 'Autonomous Publishing Daemon', priority: 'High', status: 'Implemented', description: 'Background scheduler shall check pending posts and dispatch to live API or labeled simulator.' },
      { id: 'FR-09', title: 'Interactive Content Calendar Grid', priority: 'High', status: 'Implemented', description: 'Calendar shall render monthly and weekly schedules with color-coded platform badges.' },
      { id: 'FR-10', title: 'Lexicon-Transformer Sentiment Classification', priority: 'High', status: 'Implemented', description: 'Comments shall be classified into positive, neutral, or negative with confidence scores.' },
      { id: 'FR-11', title: 'Audience Sentiment Over Time Analytics', priority: 'High', status: 'Implemented', description: 'System shall plot sentiment trends and platform distribution charts using Recharts.' },
      { id: 'FR-12', title: 'Audience Themes & Complaint Extraction', priority: 'Medium', status: 'Implemented', description: 'System shall cluster comments to identify common complaints, praises, and product queries.' },
      { id: 'FR-13', title: '60-Comment Ground Truth Benchmark Suite', priority: 'High', status: 'Implemented', description: 'System shall evaluate 60 human-labeled benchmark comments and verify >= 80% accuracy.' },
      { id: 'FR-14', title: 'Machine Learning Engagement Prediction', priority: 'High', status: 'Implemented', description: 'Predict expected engagement range, category (Low/Avg/High/Viral), and baseline outperformance.' },
      { id: 'FR-15', title: '7x24 Best Time to Post Heatmap', priority: 'High', status: 'Implemented', description: 'Calculate historical hourly performance matrix and recommend top 3 publishing windows.' },
      { id: 'FR-16', title: 'One-Click Recommended Time Application', priority: 'Medium', status: 'Implemented', description: 'Users can click any recommended time slot to immediately pre-fill the post scheduler.' },
      { id: 'FR-17', title: 'AI Content Assistant (Multi-Variant)', priority: 'Medium', status: 'Implemented', description: 'Generate tailored captions, hashtags, and discussion hooks based on business tone.' },
      { id: 'FR-18', title: 'Clear Data Attribution Tagging', priority: 'Critical', status: 'Implemented', description: 'System shall explicitly distinguish actual platform data, calculated, predicted, and demo metrics.' },
      { id: 'FR-19', title: 'Comprehensive Demo Sandbox Mode', priority: 'High', status: 'Implemented', description: 'Users can load/reset full demo data with 4 accounts, 8 posts, and 20 analyzed comments.' },
      { id: 'FR-20', title: 'SEPM Academic Workspace & Tracker', priority: 'High', status: 'Implemented', description: 'Interactive hub for SDLC, Sprints, Kanban, Planning Poker, Lean Waste, and Syllabus Tracker.' }
    ],
    nonFunctionalRequirements: [
      { id: 'NFR-01', category: 'Security', requirement: 'Passwords hashed with bcrypt (salt rounds >= 10); OAuth tokens encrypted with AES-256-GCM.' },
      { id: 'NFR-02', category: 'Performance', requirement: 'API response times for analytical dashboards shall stay under 300ms for cached data.' },
      { id: 'NFR-03', category: 'Reliability', requirement: 'Dual-engine persistence allows seamless zero-config fallback if local MongoDB server is absent.' },
      { id: 'NFR-04', category: 'Usability', requirement: 'Responsive UI supporting mobile, tablet, and desktop viewports with dark navy theme.' },
      { id: 'NFR-05', category: 'Accuracy', requirement: 'Sentiment model must achieve >= 80% agreement with 60 human-labeled ground truth comments.' },
      { id: 'NFR-06', category: 'Maintainability', requirement: 'Modular connector drivers for Instagram, Facebook, LinkedIn, Twitter for zero-friction extensibility.' }
    ],
    srsComparison: {
      v1_summary: 'Initial AI-generated draft produced generic social management requirements. Assumed full unrestricted API access to personal profiles and claimed AI could predict exact viral follower numbers.',
      v2_summary: 'Human-corrected draft strictly aligned with Meta Graph API professional account requirements, added token encryption isolation, replaced arbitrary viral guarantees with confidence intervals, and instituted mandatory Data Attribution rules.',
      corrections: [
        'Correction 1: Explicitly documented Instagram Business/Creator requirement linked to Facebook Pages (Meta API policy restriction).',
        'Correction 2: Replaced deterministic follower count predictions with ML regression confidence intervals (e.g. 210 - 295 interactions).',
        'Correction 3: Instituted AES-256-GCM encryption for OAuth tokens to prevent credential leaks in API responses.',
        'Correction 4: Added Data Accuracy Rule: All metrics must be tagged as Actual, Calculated, Predicted, or Demo.'
      ]
    }
  });
};

export const getAIToolsComparison = (req, res) => {
  res.json({
    success: true,
    tools: [
      {
        name: 'ChatGPT (GPT-4o)',
        correctness: 8.8,
        readability: 9.2,
        security: 8.4,
        maintainability: 8.9,
        speed: 8.5,
        strengths: 'Exceptional for synthesizing user stories, architecture trade-offs, and explaining complex ML equations.',
        weaknesses: 'Occasional hallucination of deprecated Meta Graph API parameters if prompt context is too brief.'
      },
      {
        name: 'GitHub Copilot',
        correctness: 8.9,
        readability: 9.0,
        security: 8.7,
        maintainability: 9.1,
        speed: 9.6,
        strengths: 'Blazing fast inline code completions directly in IDE; understands project file hierarchy and existing schemas.',
        weaknesses: 'Can perpetuate obsolete patterns if legacy code exists in nearby files.'
      },
      {
        name: 'Tabnine',
        correctness: 8.1,
        readability: 8.5,
        security: 9.2,
        maintainability: 8.4,
        speed: 9.3,
        strengths: 'Strong enterprise data privacy guarantees; isolated local execution option.',
        weaknesses: 'Less nuanced reasoning for full architectural designs and prompt engineering.'
      }
    ]
  });
};

export const getSprints = (req, res) => {
  const store = getCollection('sepmSprints');
  const stories = getCollection('sepmStories');
  res.json({ success: true, sprints: store, stories });
};

export const getKanbanTasks = (req, res) => {
  const tasks = getCollection('sepmTasks');
  res.json({
    success: true,
    columns: ['Backlog', 'To Do', 'In Progress', 'Code Review', 'Testing', 'Done'],
    wipLimits: { 'In Progress': 3, 'Code Review': 2, 'Testing': 3 },
    tasks
  });
};

export const updateKanbanTask = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const tasks = getCollection('sepmTasks');
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  task.status = status;
  saveStore();
  res.json({ success: true, task });
};

export const createKanbanTask = (req, res) => {
  const { title, storyId = 'US-01', status = 'To Do', assignee = 'Maruthi Dapke', hours = 4 } = req.body;
  if (!title) return res.status(400).json({ success: false, message: 'Task title is required' });
  const tasks = getCollection('sepmTasks');
  const newTask = {
    id: `TSK-${Date.now().toString().slice(-4)}`,
    storyId,
    title,
    status,
    assignee,
    hours: Number(hours) || 4
  };
  tasks.push(newTask);
  saveStore();
  res.status(201).json({ success: true, task: newTask });
};

export const getPlanningPoker = (req, res) => {
  res.json({
    success: true,
    activeStory: {
      id: 'US-07',
      title: 'Random Forest Engagement Regression & Outlier Defense',
      description: 'Implement ML feature regression predicting expected interaction ranges with chronological train/test split.'
    },
    fibonacciDeck: [1, 2, 3, 5, 8, 13, 21],
    votes: [
      { member: 'Maruthi Dapke (Dev Lead)', vote: 8, rationale: 'Requires feature engineering, baseline comparisons, and uncertainty bounds.' },
      { member: 'Peer Reviewer 1 (Data Analyst)', vote: 8, rationale: 'Matches difficulty of building non-leaking chronological evaluation.' },
      { member: 'AI Estimator (Copilot/GPT-4o)', vote: 5, rationale: 'Pretrained ML libraries expedite core mathematical routines.' },
      { member: 'Scrum Master Consensus', vote: 8, rationale: 'Agreed on 8 story points due to integration testing complexity.' }
    ]
  });
};

export const getLeanWaste = (req, res) => {
  const waste = getCollection('sepmLeanWaste');
  res.json({ success: true, waste });
};

export const getSyllabus = (req, res) => {
  const syllabus = getCollection('sepmSyllabus');
  res.json({ success: true, syllabus });
};

export const updateSyllabusItem = (req, res) => {
  const { id } = req.params;
  const { status, comments } = req.body;
  const syllabus = getCollection('sepmSyllabus');
  const item = syllabus.find(s => s.id === id);
  if (!item) return res.status(404).json({ success: false, message: 'Syllabus item not found' });
  if (status) item.status = status;
  if (comments) item.comments = comments;
  saveStore();
  res.json({ success: true, item });
};
