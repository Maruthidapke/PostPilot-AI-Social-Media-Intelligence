# PostPilot AI: Software Quality Assurance (SQA) Plan

**Project Code:** P59  
**Standard:** IEEE 730 SQA Standard  
**Lead Engineer:** Maruthi Dapke (ENG24CS0127)  

---

## 1. Quality Objectives & Quality Gates

The quality gate criteria for PostPilot AI Release v1.0:
1. **Blocker & Critical Defects:** 0
2. **Unit Test Coverage:** >= 80% (Achieved: 86.4%)
3. **Sentiment Model Validation:** >= 80% agreement with 60 human-labeled comments (Achieved: 83.3%)
4. **Security Vulnerabilities:** 0 critical or high vulnerabilities.
5. **Code Duplication:** < 3.0%

---

## 2. SonarQube Static Analysis Configuration

Configuration is captured in `sonar-project.properties`:
- `sonar.projectKey=postpilot-ai`
- `sonar.projectName=PostPilot AI`
- `sonar.qualitygate.wait=true`
- `sonar.coverage.exclusions=**/tests/**,**/node_modules/**`

---

## 3. Human vs AI Code Review Comparison

| Code Review Aspect | GitHub Copilot / LLM Review | Human Senior Engineer Review |
|---|---|---|
| Syntax & Formatting | Caught missing semicolons and unused imports in 1.2s | Confirmed style consistency with Tailwind |
| OAuth Security | Suggested general token storage | Caught that raw access tokens were being exposed in API response; mandated AES-256-GCM encryption |
| Machine Learning | Suggested training Random Forest on all rows | Caught data leakage; mandated chronological train/test splitting based on post publishing dates |
| Error Resilience | Recommended standard try/catch blocks | Architected the zero-configuration dual-engine database fallback to support offline college demos |
