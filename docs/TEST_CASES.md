# PostPilot AI: Software Test Cases & Selenium Specifications

**Project Code:** P59  
**Test Suite:** Manual, Unit, Integration, and Automated E2E Journey  
**Author:** Maruthi Dapke (ENG24CS0127)  

---

## 1. Manual & System Test Case Catalog

| Test ID | Module | Description | Steps | Expected Result | Status |
|---|---|---|---|---|---|
| TC-01 | Auth | User Registration | Submit name, email, password on `/api/auth/register` | 201 Created with JWT token and hashed password | Passed |
| TC-02 | Auth | Invalid Login Rejection | Submit wrong password on `/api/auth/login` | 401 Unauthorized with error message | Passed |
| TC-03 | Security | Token Encryption | Invoke `encryptToken()` with raw OAuth key | Yields `iv:authTag:ciphertext`; plain token not stored | Passed |
| TC-04 | Security | Token Decryption | Invoke `decryptToken()` with valid ciphertext | Yields exact original plaintext token | Passed |
| TC-05 | Connectors | Instagram Sandbox Auth | Connect Instagram account with simulated credentials | Creates Business Account record `@urbanblend_coffee` | Passed |
| TC-06 | Connectors | Facebook Page Discovery | Connect Facebook with simulated credentials | Discovers managed page `Urban Blend Roasters` | Passed |
| TC-07 | Scheduler | Post Scheduling Queue | Schedule post for 5 minutes in future | Post recorded with status `scheduled` | Passed |
| TC-08 | Scheduler | Autonomous Publishing | Scheduler tick when `scheduledAt <= now` | Transitions status to `published`, stamps date | Passed |
| TC-09 | Sentiment | Positive Text Inference | Analyze text: "Best coffee ever! Love it ❤️" | Predicted `positive`, confidence > 0.7 | Passed |
| TC-10 | Sentiment | Negative Complaint Inference | Analyze text: "Waited 35 mins, espresso burnt" | Predicted `negative`, theme: 'Customer Service' | Passed |
| TC-11 | Benchmark | 60-Comment Ground Truth | Run benchmark against 60 human labels | Agreement >= 80% (Achieved 83.3%) | Passed |
| TC-12 | Prediction | Engagement Range Forecast | Run RF regressor on draft post parameters | Yields lower bound, estimated, upper bound | Passed |
| TC-13 | Prediction | Low Data Defense Guard | Request forecast with < 3 historical posts | Returns `status: insufficient_data` | Passed |
| TC-14 | Best Time | 7x24 Heatmap Matrix | Calculate weekly hourly performance | Top 3 slots identified with scores and confidence | Passed |
| TC-15 | Assistant | Multi-Variant Caption | Prompt AI for cafe weekend launch | Returns 3 distinct styled caption variants | Passed |
| TC-16 | Data Guard | Metric Attribution Check | Query dashboard metrics | Labels Actual Platform, Calculated, or Demo | Passed |

---

## 2. Automated Selenium User Journey Architecture
Automated script: `backend/tests/e2e_journey.js`  
Executes 14 contiguous steps simulating the complete student evaluation demo flow:
1. User Registration & Database Initialization
2. Session Authentication & JWT verification
3. Instagram Business Account connection
4. Facebook Page connection
5. Ingesting historical post feeds
6. Retrieving media snapshots and metrics
7. Analyzing audience feedback comments
8. Running the 60-comment benchmark validation suite
9. Generating ML engagement forecast
10. Calculating 7x24 Best Time Heatmap
11. Creating scheduled post
12. Verifying autonomous background scheduler publishing
13. Exporting sentiment CSV report
14. Auditing SEPM Workspace and Syllabus Tracker
