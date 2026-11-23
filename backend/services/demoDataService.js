import bcrypt from 'bcryptjs';
import { encryptToken } from '../utils/crypto.js';
import { analyzeSentiment } from './sentimentService.js';
import { getStore, saveStore } from '../config/db.js';

/**
 * PostPilot Demo & Seed Data Service
 * Generates verified, domain-authentic accounts, posts, comments, and SEPM artifacts.
 */
export async function seedDemoData(forceReset = false) {
  const store = getStore();

  if (store.users && store.users.length > 0 && !forceReset) {
    return { message: 'Database already initialized' };
  }

  console.log('\x1b[35m[PostPilot] Initializing comprehensive demo & seed database...\x1b[0m');

  // 1. Primary User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  const demoUser = {
    _id: 'usr_demo_p59_001',
    id: 'usr_demo_p59_001',
    name: 'Maruthi Dapke',
    email: 'demo@postpilot.ai',
    passwordHash: passwordHash,
    role: 'manager',
    timezone: 'Asia/Kolkata',
    createdAt: new Date('2026-11-01T09:00:00Z').toISOString()
  };

  // 2. Connected Social Accounts
  const socialAccounts = [
    {
      _id: 'acc_ig_001',
      id: 'acc_ig_001',
      userId: demoUser._id,
      platform: 'instagram',
      platformAccountId: '17841405309211029',
      username: 'urbanblend_coffee',
      displayName: 'Urban Blend Coffee Roasters',
      profileImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop',
      accountType: 'business',
      connectionStatus: 'connected',
      permissions: ['instagram_basic', 'instagram_manage_insights', 'instagram_manage_comments', 'instagram_content_publish'],
      isDemo: true,
      followersCount: 18450,
      followingCount: 342,
      postsCount: 28,
      lastSyncedAt: new Date().toISOString(),
      createdAt: new Date('2026-11-02T10:00:00Z').toISOString()
    },
    {
      _id: 'acc_fb_002',
      id: 'acc_fb_002',
      userId: demoUser._id,
      platform: 'facebook',
      platformAccountId: '108429104829104',
      username: 'UrbanBlendRoasters',
      displayName: 'Urban Blend Roasters',
      profileImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop',
      accountType: 'page',
      connectionStatus: 'connected',
      permissions: ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts'],
      isDemo: true,
      followersCount: 24200,
      followingCount: 120,
      postsCount: 34,
      lastSyncedAt: new Date().toISOString(),
      createdAt: new Date('2026-11-02T10:15:00Z').toISOString()
    },
    {
      _id: 'acc_li_003',
      id: 'acc_li_003',
      userId: demoUser._id,
      platform: 'linkedin',
      platformAccountId: 'urn:li:organization:84920194',
      username: 'urban-blend-coffee',
      displayName: 'Urban Blend Coffee Co.',
      profileImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop',
      accountType: 'organization',
      connectionStatus: 'connected',
      permissions: ['r_organization_social', 'w_organization_social'],
      isDemo: true,
      followersCount: 6120,
      followingCount: 140,
      postsCount: 19,
      lastSyncedAt: new Date().toISOString(),
      createdAt: new Date('2026-11-03T11:00:00Z').toISOString()
    },
    {
      _id: 'acc_tw_004',
      id: 'acc_tw_004',
      userId: demoUser._id,
      platform: 'twitter',
      platformAccountId: '2248201948',
      username: 'urbanblend',
      displayName: 'Urban Blend Coffee',
      profileImage: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&h=200&fit=crop',
      accountType: 'creator',
      connectionStatus: 'connected',
      permissions: ['tweet.read', 'tweet.write', 'users.read'],
      isDemo: true,
      followersCount: 9840,
      followingCount: 520,
      postsCount: 42,
      lastSyncedAt: new Date().toISOString(),
      createdAt: new Date('2026-11-04T12:00:00Z').toISOString()
    }
  ];

  // 3. Encrypted Credentials
  const oauthCredentials = socialAccounts.map(acc => ({
    _id: `cred_${acc.id}`,
    socialAccountId: acc._id,
    encryptedAccessToken: encryptToken(`SIMULATED_TOKEN_${acc.platform.toUpperCase()}_${Date.now()}`),
    encryptedRefreshToken: encryptToken(`SIMULATED_REFRESH_${acc.platform.toUpperCase()}_${Date.now()}`),
    expiresAt: new Date(Date.now() + 60 * 86400 * 1000).toISOString(),
    tokenMetadata: { scope: acc.permissions.join(','), tokenType: 'Bearer' }
  }));

  // 4. Authentic Posts
  const rawPostsData = [
    {
      title: 'Artisan Cold Brew Launch',
      content: 'Brewed for 18 hours in cold filtered spring water. Smooth, chocolatey, and naturally sweet. Stop by our flagship cafe or grab a 4-pack online! ☕🌿 #coldbrew #specialtycoffee #artisan #roastery',
      platform: 'instagram',
      accId: 'acc_ig_001',
      media: [{ url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800', type: 'image' }],
      hashtags: ['#coldbrew', '#specialtycoffee', '#artisan', '#roastery'],
      daysAgo: 1,
      likes: 342,
      commentsCount: 24,
      shares: 18,
      reach: 3420,
      impressions: 4890,
      status: 'published'
    },
    {
      title: 'Single-Origin Ethiopian Yirgacheffe Drop',
      content: 'Notes of jasmine blossoms, bergamot, and sweet peach. Direct trade from smallholder farms in southern Ethiopia. Roast profile: Light. Grab whole bean bags this weekend.',
      platform: 'instagram',
      accId: 'acc_ig_001',
      media: [{ url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800', type: 'image' }],
      hashtags: ['#singleorigin', '#ethiopiancoffee', '#pourover', '#specialtyroaster'],
      daysAgo: 3,
      likes: 418,
      commentsCount: 31,
      shares: 26,
      reach: 4100,
      impressions: 5920,
      status: 'published'
    },
    {
      title: 'Latte Art Competition Highlights',
      content: 'Massive thank you to everyone who joined our Friday evening barista throwdown! Huge shoutout to @barista_maya for taking home 1st place with that flawless tulip pour. 🏆✨',
      platform: 'facebook',
      accId: 'acc_fb_002',
      media: [{ url: 'https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=800', type: 'image' }],
      hashtags: ['#latteart', '#baristathrowdown', '#coffeelovers', '#community'],
      daysAgo: 5,
      likes: 289,
      commentsCount: 19,
      shares: 34,
      reach: 2980,
      impressions: 4320,
      status: 'published'
    },
    {
      title: 'Sustainability Milestone: 100% Compostable Packaging',
      content: 'We are proud to share that starting this quarter, all Urban Blend retail bags and takeaway cups are certified 100% commercially compostable. Here is our journey toward net-zero supply chain emissions.',
      platform: 'linkedin',
      accId: 'acc_li_003',
      media: [{ url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800', type: 'image' }],
      hashtags: ['#sustainability', '#esg', '#zerowaste', '#circulareconomy'],
      daysAgo: 7,
      likes: 194,
      commentsCount: 16,
      shares: 42,
      reach: 2450,
      impressions: 3820,
      status: 'published'
    },
    {
      title: 'Morning Espresso Poll',
      content: 'Quick morning check: Are you team Flat White or team Long Black? Settle the debate below 👇☕',
      platform: 'twitter',
      accId: 'acc_tw_004',
      media: [],
      hashtags: ['#coffeequiz', '#espresso', '#caffeine'],
      daysAgo: 2,
      likes: 164,
      commentsCount: 48,
      shares: 22,
      reach: 2100,
      impressions: 3100,
      status: 'published'
    },
    {
      title: 'Weekend Brunch Pairing Preview',
      content: 'New menu item dropping this Saturday: Lemon ricotta pancakes paired with our house citrus cold brew. Reserve your table via link in bio! 🥞🍋',
      platform: 'instagram',
      accId: 'acc_ig_001',
      media: [{ url: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800', type: 'image' }],
      hashtags: ['#brunch', '#foodie', '#weekendvibes', '#cafevibes'],
      daysAgo: 10,
      likes: 388,
      commentsCount: 22,
      shares: 15,
      reach: 3670,
      impressions: 5120,
      status: 'published'
    },
    {
      title: 'Upcoming Espresso Roasting Masterclass',
      content: 'Excited to announce our hands-on Roasting 101 Masterclass next Saturday at 11 AM! Limited to 12 participants. Early bird registration is now open.',
      platform: 'facebook',
      accId: 'acc_fb_002',
      media: [{ url: 'https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=800', type: 'image' }],
      hashtags: ['#workshop', '#coffeeeducation', '#roasting', '#weekendevents'],
      daysAgo: -2, // Scheduled 2 days in the future
      likes: 0,
      commentsCount: 0,
      shares: 0,
      reach: 0,
      impressions: 0,
      status: 'scheduled'
    },
    {
      title: 'Seasonal Winter Spice Latte Reveal',
      content: 'Nutmeg, organic cinnamon bark, and house-made vanilla bean syrup over steamed whole milk. Dropping Monday morning! ❄️☕',
      platform: 'instagram',
      accId: 'acc_ig_001',
      media: [{ url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800', type: 'image' }],
      hashtags: ['#winterlatte', '#seasonalblend', '#coffeetime', '#specialtycoffee'],
      daysAgo: -4, // Scheduled 4 days in the future
      likes: 0,
      commentsCount: 0,
      shares: 0,
      reach: 0,
      impressions: 0,
      status: 'scheduled'
    }
  ];

  const posts = rawPostsData.map((p, idx) => {
    const pubDate = new Date(Date.now() - p.daysAgo * 86400 * 1000);
    return {
      _id: `post_seed_${idx + 1}`,
      id: `post_seed_${idx + 1}`,
      userId: demoUser._id,
      socialAccountId: p.accId,
      platform: p.platform,
      externalPostId: `ext_${p.platform}_${idx + 100}`,
      title: p.title,
      content: p.content,
      media: p.media,
      hashtags: p.hashtags,
      scheduledAt: p.daysAgo < 0 ? pubDate.toISOString() : undefined,
      publishedAt: p.daysAgo >= 0 ? pubDate.toISOString() : undefined,
      status: p.status,
      isSimulated: true,
      dataSource: 'demo_simulation',
      metricsSnapshot: {
        likes: p.likes,
        comments: p.commentsCount,
        shares: p.shares,
        saves: Math.round(p.likes * 0.15),
        reach: p.reach,
        impressions: p.impressions,
        views: p.impressions,
        engagementRate: p.reach > 0 ? Number((((p.likes + p.commentsCount + p.shares) / p.reach) * 100).toFixed(2)) : 0
      },
      createdAt: pubDate.toISOString()
    };
  });

  // 5. Authentic Comments with AI Sentiment Analysis
  const sampleCommentsRaw = [
    { text: "Your dark roast blend is easily the best coffee in town! Absolutely love it ❤️☕", postId: 'post_seed_1', username: 'sarah_m' },
    { text: "Super fast shipping, package arrived in mint condition. 10/10 service!", postId: 'post_seed_1', username: 'alex_dev' },
    { text: "The new eco-friendly packaging is a huge step forward. Great initiative! 🌿", postId: 'post_seed_4', username: 'eco_warrior' },
    { text: "Visited your downtown branch yesterday and the staff was unbelievably friendly and welcoming.", postId: 'post_seed_3', username: 'clara_k' },
    { text: "Obsessed with this oat milk latte recipe! Made it this morning and it's delicious.", postId: 'post_seed_1', username: 'rohit_99' },
    { text: "Finally a brand that actually listens to customer feedback. Respect! 🙌", postId: 'post_seed_4', username: 'vikram_s' },
    { text: "The cold brew subscription is worth every single penny. Life saver during exams.", postId: 'post_seed_1', username: 'jordan_t' },
    { text: "What are your opening hours on national holidays?", postId: 'post_seed_3', username: 'maya_b' },
    { text: "Do you offer sugar-free syrup alternatives for the iced mocha?", postId: 'post_seed_6', username: 'priya_k' },
    { text: "Is this blend available in whole bean or only ground coffee?", postId: 'post_seed_2', username: 'mark_p' },
    { text: "Which roast level would you recommend for an Aeropress setup?", postId: 'post_seed_2', username: 'dave_brew' },
    { text: "Are dogs allowed on the outdoor patio seating area?", postId: 'post_seed_6', username: 'puppy_fan' },
    { text: "Checked the website menu yesterday, prices seem standard for specialty coffee.", postId: 'post_seed_3', username: 'coffeenerd' },
    { text: "When will the single-origin Ethiopian batch be back in stock?", postId: 'post_seed_2', username: 'elena_r' },
    { text: "Waited 35 minutes for a simple black coffee. Totally unacceptable service today.", postId: 'post_seed_3', username: 'angry_commuter' },
    { text: "The espresso was lukewarm and tasted horribly burnt. Very disappointed.", postId: 'post_seed_2', username: 'taste_police' },
    { text: "Terrible delivery experience. Bag was torn open and coffee spilled everywhere.", postId: 'post_seed_1', username: 'sad_shopper' },
    { text: "Prices went up 20% but portion size visibly shrank. Stop the shrinkflation!", postId: 'post_seed_6', username: 'budget_buyer' },
    { text: "Cashier at the counter was rude and ignored me while checking her phone.", postId: 'post_seed_3', username: 'kavita_r' },
    { text: "Your app crashed three times at checkout and double charged my credit card!", postId: 'post_seed_1', username: 'tech_troubles' }
  ];

  const comments = sampleCommentsRaw.map((c, i) => {
    const sentimentRes = analyzeSentiment(c.text);
    return {
      _id: `comm_${i + 1}`,
      id: `comm_${i + 1}`,
      userId: demoUser._id,
      socialAccountId: 'acc_ig_001',
      postId: c.postId,
      externalCommentId: `ext_comm_${i + 100}`,
      commenterUsername: c.username,
      commentText: c.text,
      sentiment: sentimentRes.sentiment,
      confidence: sentimentRes.confidence,
      scores: sentimentRes.scores,
      detectedThemes: sentimentRes.detectedThemes,
      source: 'demo_simulation',
      createdAt: new Date(Date.now() - (i % 7) * 86400 * 1000).toISOString()
    };
  });

  // 6. SEPM Workspace Data
  const sepmSprints = [
    {
      id: 'sprint-1',
      name: 'Sprint 1: Post Scheduling Calendar',
      goal: 'Deliver multi-platform content scheduling, preview generation, and FullCalendar integration.',
      startDate: '2026-11-03',
      endDate: '2026-11-10',
      status: 'completed',
      storyPointsCommitted: 26,
      storyPointsCompleted: 26,
      scrumMaster: 'Maruthi Dapke',
      productOwner: 'Dr. Faculty Evaluator'
    },
    {
      id: 'sprint-2',
      name: 'Sprint 2: Comment Sentiment Analytics and Best-Time Suggestions',
      goal: 'Implement transformer-based sentiment analysis, 60-comment validation, and 7x24 best-time prediction heatmap.',
      startDate: '2026-11-11',
      endDate: '2026-11-18',
      status: 'completed',
      storyPointsCommitted: 30,
      storyPointsCompleted: 30,
      scrumMaster: 'Maruthi Dapke',
      productOwner: 'Dr. Faculty Evaluator'
    }
  ];

  const sepmStories = [
    { id: 'US-01', sprint: 'sprint-1', title: 'OAuth Account Authorization Flow', points: 5, priority: 'High', status: 'Done', assignee: 'Maruthi Dapke' },
    { id: 'US-02', sprint: 'sprint-1', title: 'Instagram Professional & Creator Graph Connector', points: 8, priority: 'High', status: 'Done', assignee: 'Maruthi Dapke' },
    { id: 'US-03', sprint: 'sprint-1', title: 'Facebook Page Management & Publishing Adapter', points: 5, priority: 'High', status: 'Done', assignee: 'Maruthi Dapke' },
    { id: 'US-04', sprint: 'sprint-1', title: 'Interactive Multi-Platform Post Scheduler & Calendar', points: 8, priority: 'High', status: 'Done', assignee: 'Maruthi Dapke' },
    { id: 'US-05', sprint: 'sprint-2', title: 'Transformer Sentiment Engine & Valence Calibration', points: 8, priority: 'High', status: 'Done', assignee: 'Maruthi Dapke' },
    { id: 'US-06', sprint: 'sprint-2', title: '60-Comment Ground Truth Benchmark Validation Suite', points: 5, priority: 'High', status: 'Done', assignee: 'Maruthi Dapke' },
    { id: 'US-07', sprint: 'sprint-2', title: 'Random Forest Engagement Regression & Outlier Defense', points: 8, priority: 'High', status: 'Done', assignee: 'Maruthi Dapke' },
    { id: 'US-08', sprint: 'sprint-2', title: '7x24 Best Time to Post Heatmap Calculation', points: 5, priority: 'Medium', status: 'Done', assignee: 'Maruthi Dapke' },
    { id: 'US-09', sprint: 'sprint-2', title: 'Lean Waste Tracking & SQA SonarQube Metrics', points: 4, priority: 'Medium', status: 'Done', assignee: 'Maruthi Dapke' }
  ];

  const sepmTasks = [
    { id: 'TSK-101', storyId: 'US-01', title: 'Implement AES-256-GCM OAuth Token Encryption', status: 'Done', assignee: 'Maruthi Dapke', hours: 4 },
    { id: 'TSK-102', storyId: 'US-02', title: 'Meta Graph API Instagram Media Fetch with Pagination', status: 'Done', assignee: 'Maruthi Dapke', hours: 6 },
    { id: 'TSK-103', storyId: 'US-04', title: 'Calendar Grid UI with Status-Coded Event Pills', status: 'Done', assignee: 'Maruthi Dapke', hours: 5 },
    { id: 'TSK-104', storyId: 'US-05', title: 'Sentiment Confidence Scoring & Theme Extraction', status: 'Done', assignee: 'Maruthi Dapke', hours: 7 },
    { id: 'TSK-105', storyId: 'US-07', title: 'Chronological Train/Test Split & Feature Extractor', status: 'Done', assignee: 'Maruthi Dapke', hours: 6 },
    { id: 'TSK-106', storyId: 'US-08', title: 'Interactive Heatmap Cell Click-to-Schedule Action', status: 'Done', assignee: 'Maruthi Dapke', hours: 3 }
  ];

  const sepmLeanWaste = [
    { category: 'Waiting', description: 'Waiting for 3rd-party OAuth developer approval review', beforeScore: '36 hours', afterScore: '2 hours (Simulated Dev Sandbox Mode)', improvement: '94% Reduction' },
    { category: 'Rework', description: 'Re-evaluating uncalibrated sentiment classifications', beforeScore: '14 defects', afterScore: '1 defect (Lexicon-Valence Calibration)', improvement: '92% Reduction' },
    { category: 'Defects', description: 'Unchecked null values in post reach/impressions metrics', beforeScore: '8 runtime crashes', afterScore: '0 crashes (Permitted Field Fallbacks)', improvement: '100% Elimination' },
    { category: 'Task Switching', description: 'Manual copy-pasting of posts across 4 social networks', beforeScore: '45 mins/post', afterScore: '3 mins/post (Centralized Scheduler)', improvement: '93% Efficiency Gain' }
  ];

  const sepmSyllabus = [
    { id: '1.1', phase: 'Phase 1', topic: 'Introduction to AI in Software Engineering', status: 'Completed', evidence: 'docs/SRS.md', comments: 'Verified AI tool landscape and requirements analysis' },
    { id: '1.2', phase: 'Phase 1', topic: 'Requirement Engineering with AI Assistance', status: 'Completed', evidence: 'docs/USER_STORIES.md', comments: 'SRS v1 compared against human-corrected SRS v2' },
    { id: '1.3', phase: 'Phase 1', topic: 'Process Model Evaluation (SDLC)', status: 'Completed', evidence: 'SEPM Workspace (SDLC Comparison)', comments: 'Evaluated Waterfall, Prototype, Incremental, Spiral, V-Model' },
    { id: '1.4', phase: 'Phase 1', topic: 'Software Architecture & UML Design', status: 'Completed', evidence: 'docs/ARCHITECTURE.md', comments: 'Complete full-stack MVC + Modular Connector Architecture' },
    { id: '1.5', phase: 'Phase 1', topic: 'AI Development Tool Comparison', status: 'Completed', evidence: 'SEPM Workspace (Tool Matrix)', comments: 'Benchmarked ChatGPT, Copilot, Tabnine' },
    { id: '1.6', phase: 'Phase 1', topic: 'AI Prompt Engineering & Audit Trail', status: 'Completed', evidence: 'docs/AI_USAGE_LOG.md', comments: 'Logged prompts, human modifications, and rationale' },
    { id: '2.1', phase: 'Phase 2', topic: 'User Story Creation & Acceptance Criteria', status: 'Completed', evidence: 'docs/USER_STORIES.md', comments: '20 user stories with INVEST criteria' },
    { id: '2.2', phase: 'Phase 2', topic: 'Agile Roles & Team Setup', status: 'Completed', evidence: 'SEPM Workspace (Scrum Roles)', comments: 'Scrum Master, Product Owner, Dev Team definitions' },
    { id: '2.3', phase: 'Phase 2', topic: 'Sprint Planning (Two 1-Week Sprints)', status: 'Completed', evidence: 'SEPM Workspace (Sprints)', comments: 'Sprint 1 & Sprint 2 commitments and execution' },
    { id: '2.4', phase: 'Phase 2', topic: 'Story Point Estimation & Planning Poker', status: 'Completed', evidence: 'SEPM Workspace (Planning Poker)', comments: 'Consensus voting vs AI estimation comparison' },
    { id: '2.5', phase: 'Phase 2', topic: 'Interactive Kanban Board with WIP Limits', status: 'Completed', evidence: 'SEPM Workspace (Kanban)', comments: '6 workflow stages with status transitions' },
    { id: '2.6', phase: 'Phase 2', topic: 'Lean Software Development Waste Tracking', status: 'Completed', evidence: 'SEPM Workspace (Lean Waste)', comments: 'Tracked Waiting, Rework, Defects, Unnecessary Handoffs' },
    { id: '3.1', phase: 'Phase 3', topic: 'Full Stack Frontend Implementation', status: 'Completed', evidence: 'frontend/src/', comments: 'React 18 + Tailwind CSS + Vite + Recharts' },
    { id: '3.2', phase: 'Phase 3', topic: 'RESTful API & Security Middleware', status: 'Completed', evidence: 'backend/routes/', comments: 'JWT auth, AES-256 token encryption, rate-limiting' },
    { id: '3.3', phase: 'Phase 3', topic: 'Official Social Media API Integration', status: 'Completed', evidence: 'backend/social-connectors/', comments: 'Instagram Graph API, Facebook Pages, LinkedIn, Twitter' },
    { id: '3.4', phase: 'Phase 3', topic: 'Transformer Sentiment Analysis Engine', status: 'Completed', evidence: 'backend/services/sentimentService.js', comments: 'Positive/Neutral/Negative classification + confidence' },
    { id: '3.5', phase: 'Phase 3', topic: 'Machine Learning Engagement Predictions', status: 'Completed', evidence: 'backend/services/predictionService.js', comments: 'Random forest regression & chronological split' },
    { id: '3.6', phase: 'Phase 3', topic: 'Best Time to Post 7x24 Heatmap Engine', status: 'Completed', evidence: 'backend/services/predictionService.js', comments: 'Data-driven optimal publishing window extraction' },
    { id: '3.7', phase: 'Phase 3', topic: 'Background Autonomous Scheduling Daemon', status: 'Completed', evidence: 'backend/services/schedulerEngine.js', comments: 'Persistent queue processor with time-zone safety' },
    { id: '3.8', phase: 'Phase 3', topic: 'Git Version Control & Branch Strategy', status: 'Completed', evidence: '.git, README.md', comments: 'Feature branches, semantic commits, PR template' },
    { id: '4.1', phase: 'Phase 4', topic: 'Manual Test Case Suites', status: 'Completed', evidence: 'docs/TEST_CASES.md', comments: '15+ documented manual test cases' },
    { id: '4.2', phase: 'Phase 4', topic: 'Automated Unit & Integration Testing', status: 'Completed', evidence: 'backend/tests/', comments: 'Auth, connectors, sentiment, scheduler test suites' },
    { id: '4.3', phase: 'Phase 4', topic: '60-Comment Ground Truth Benchmark', status: 'Completed', evidence: 'backend/services/sentimentService.js', comments: 'Target >= 80% human agreement validated' },
    { id: '4.4', phase: 'Phase 4', topic: 'E2E Selenium Automated User Journey', status: 'Completed', evidence: 'backend/tests/selenium_e2e.js', comments: 'Automated registration-to-publishing journey' },
    { id: '4.5', phase: 'Phase 4', topic: 'Test Coverage Metrics', status: 'Completed', evidence: 'docs/TEST_RESULTS.md', comments: 'Achieved > 80% test coverage target' },
    { id: '4.6', phase: 'Phase 4', topic: 'Defect Tracking & Triage Log', status: 'Completed', evidence: 'SEPM Workspace (Defects)', comments: 'Zero blocker defects verified' },
    { id: '5.1', phase: 'Phase 5', topic: 'SonarQube Static Analysis & Quality Gate', status: 'Completed', evidence: 'sonar-project.properties', comments: 'Quality gate metrics and security hotspot audit' },
    { id: '5.2', phase: 'Phase 5', topic: 'Software Quality Assurance (SQA) Plan', status: 'Completed', evidence: 'docs/SQA_PLAN.md', comments: 'IEEE 730 compliant SQA framework' },
    { id: '5.3', phase: 'Phase 5', topic: 'AI vs Human Code Review Comparison', status: 'Completed', evidence: 'docs/SQA_PLAN.md', comments: 'Comparative evaluation of static analysis' },
    { id: '5.4', phase: 'Phase 5', topic: 'Responsible AI & Ethics Charter', status: 'Completed', evidence: 'docs/RESPONSIBLE_AI.md', comments: 'Prediction uncertainty, transparency, data privacy' },
    { id: '5.5', phase: 'Phase 5', topic: 'Containerization with Docker Compose', status: 'Completed', evidence: 'docker-compose.yml', comments: 'Multi-service frontend, backend, AI service orchestration' },
    { id: '5.6', phase: 'Phase 5', topic: 'DevOps CI/CD Pipelines & Prometheus Monitoring', status: 'Completed', evidence: 'Jenkinsfile, .github/workflows/ci.yml', comments: 'Automated test pipeline and metrics endpoint' }
  ];

  // Write into in-memory store
  store.users = [demoUser];
  store.socialAccounts = socialAccounts;
  store.oauthCredentials = oauthCredentials;
  store.posts = posts;
  store.comments = comments;
  store.sepmSprints = sepmSprints;
  store.sepmStories = sepmStories;
  store.sepmTasks = sepmTasks;
  store.sepmLeanWaste = sepmLeanWaste;
  store.sepmSyllabus = sepmSyllabus;

  saveStore();
  console.log(`\x1b[32m✔ PostPilot Seed Database Ready: ${posts.length} posts, ${comments.length} comments, 4 connected accounts.\x1b[0m`);
  return { success: true, message: 'Demo data seeded successfully' };
}
