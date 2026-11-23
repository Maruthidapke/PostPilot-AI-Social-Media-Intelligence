# PostPilot AI: System Architecture & Technical Design

**Project Code:** P59  
**Domain:** Marketing  
**Author:** Maruthi Dapke (ENG24CS0127)  
**Institution:** Dayananda Sagar University  

---

## 1. Architectural Overview

PostPilot AI follows a multi-tier, modular micro-service pattern designed for scalability, zero-friction extensibility, and security:

```
[ Frontend: React 18 + Vite + Tailwind CSS + Recharts ]
                      │  REST / JWT Auth (Port 5173)
                      ▼
[ Backend API Gateway: Node.js + Express (Port 5002) ]
  ├── JWT Auth Middleware & Role Guard
  ├── AES-256-GCM Token Encryption Engine
  ├── Autonomous Scheduler Daemon (10s Interval)
  └── Modular Social Connector Registry
        ├── Instagram Connector (Meta Graph API)
        ├── Facebook Connector (Pages Graph API)
        ├── LinkedIn Connector (OAuth 2.0 UGC)
        └── Twitter Connector (OAuth 2.0 PKCE)
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
[ Dual-Engine Database ]    [ AI Inference Engine (Port 8000) ]
 - Primary: MongoDB          - Cardiff Twitter-RoBERTa Sentiment
 - Fallback: JSON DB Store   - RF-v1.4 Chronological Regressor
                             - 7x24 Best Time Heatmap Calculator
```

---

## 2. Key Subsystems

### 2.1 Modular Social Connector Registry
Located at `backend/social-connectors/`, each driver implements a uniform interface:
- `getAuthorizationUrl(state)`: Official OAuth redirect generator.
- `exchangeCodeForToken(code)`: Exchanging authorization code for short/long-lived tokens.
- `getAccountProfile(token)`: Retrieving verified business profile and metrics.
- `getPosts(id, token, limit)`: Paginated historical media retrieval.
- `publishPost(id, token, payload)`: Platform dispatch or labeled simulation fallback.

### 2.2 Dual-Engine Persistence
PostPilot features a zero-configuration persistent storage engine:
- If MongoDB is running on `localhost:27017`, Mongoose connects automatically.
- If standalone MongoDB is not installed, the system initializes `backend/data/db.json` with an in-memory repository implementing identical async document semantics.

### 2.3 Machine Learning Pipeline
1. **Chronological Split:** Evaluates historical posts in timestamp order to prevent future information leakage.
2. **Feature Extractor:** Pulls 6 primary features: Platform baseline weight, Content format multiplier, Hour of day, Day of week, Caption length character penalty, and Hashtag density.
3. **Uncertainty Calibration:** Generates asymmetric confidence bounds:
   $$\text{Lower Bound} = \hat{y} \times (1 - \sigma), \quad \text{Upper Bound} = \hat{y} \times (1 + \sigma)$$
