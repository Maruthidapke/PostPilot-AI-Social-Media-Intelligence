# PostPilot AI: REST API Documentation

**Base URL:** `http://localhost:5002/api`  
**Authentication:** Bearer JWT Token (`Authorization: Bearer <token>`)

---

## 1. Authentication Endpoints
- `POST /api/auth/register` - Create user account (name, email, password, role, timezone).
- `POST /api/auth/login` - Authenticate user and receive JWT.
- `GET /api/auth/me` - Retrieve authenticated user profile.

## 2. Social Accounts & Connectors
- `GET /api/social/providers` - Get list of supported platforms and permission requirements.
- `GET /api/social/accounts` - Retrieve user's connected social accounts.
- `POST /api/social/:provider/connect` - Connect account (OAuth redirect or sandbox dev connect).
- `POST /api/social/:provider/disconnect/:id` - Disconnect account and purge credentials.
- `POST /api/social/accounts/:id/sync` - Trigger account synchronization job.
- `POST /api/social/demo/load` - Populate comprehensive demo environment.
- `POST /api/social/demo/reset` - Reset demo environment to clean initial state.

## 3. Posts & Scheduling
- `GET /api/posts` - List posts with filters for `platform`, `status`, `search`.
- `POST /api/posts` - Create new draft, scheduled, or published post.
- `GET /api/posts/:id` - Get single post details and comments.
- `PUT /api/posts/:id` - Update post caption, media, or schedule.
- `DELETE /api/posts/:id` - Delete post.
- `GET /api/schedule` - Get scheduled and published calendar events.
- `POST /api/schedule` - Schedule post for specific datetime.
- `PUT /api/schedule/:id` - Reschedule post.
- `DELETE /api/schedule/:id` - Cancel schedule.

## 4. AI Sentiment Analytics
- `POST /api/sentiment/analyze` - Classify text sentiment with confidence scores.
- `GET /api/sentiment/history` - Retrieve analyzed comments log (supports CSV export format).
- `GET /api/sentiment/analytics` - Summary sentiment distribution, trends, and top themes.
- `GET /api/sentiment/benchmark` - Execute 60-comment benchmark validation suite.

## 5. Machine Learning Predictions
- `POST /api/predictions/generate` - Forecast expected interaction range and viral tier.
- `GET /api/predictions/best-time` - 7x24 weekly heatmap matrix and top 3 slots.
- `GET /api/predictions/patterns` - AI content intelligence patterns.

## 6. AI Content Assistant
- `POST /api/ai-assistant/generate-captions` - Generate 3 tailored caption variants, hashtags, and questions.

## 7. SEPM Workspace
- `GET /api/sepm/sdlc` - SDLC process models comparison and selected model rationale.
- `GET /api/sepm/requirements` - 20 functional requirements and SRS v1 vs v2 audit.
- `GET /api/sepm/tools` - AI tools evaluation scorecard (ChatGPT, Copilot, Tabnine).
- `GET /api/sepm/sprints` - Sprint 1 and Sprint 2 commitments and stories.
- `GET /api/sepm/kanban` - 6-column Kanban tasks with WIP limits.
- `PUT /api/sepm/kanban/:id` - Update task column status.
- `GET /api/sepm/planning-poker` - Fibonacci estimation session data.
- `GET /api/sepm/lean-waste` - Lean waste reduction metrics.
- `GET /api/sepm/syllabus` - 28-day handbook syllabus tracker (32 outcomes).

## 8. System & Monitoring
- `GET /api/health` - Comprehensive system diagnostic health check.
- `GET /api/metrics` - Prometheus metrics text endpoint.
