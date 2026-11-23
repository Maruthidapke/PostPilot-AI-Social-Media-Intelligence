#!/usr/bin/env python3
"""
PostPilot AI - 12-Slide Academic Viva Presentation Generator
Uses python-pptx to generate a professional 16:9 widescreen presentation deck.
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    NAVY = RGBColor(11, 19, 43)
    BLUE = RGBColor(37, 99, 235)
    PURPLE = RGBColor(124, 58, 237)
    WHITE = RGBColor(255, 255, 255)
    LIGHT_BG = RGBColor(248, 250, 252)
    DARK_TEXT = RGBColor(15, 23, 42)
    MUTED_TEXT = RGBColor(100, 116, 139)

    blank_layout = prs.slide_layouts[6]

    def add_header(slide, title_text, category_text):
        top_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(1.2))
        tf = top_box.text_frame
        tf.word_wrap = True
        p_cat = tf.paragraphs[0]
        p_cat.text = category_text.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = BLUE

        p_title = tf.add_paragraph()
        p_title.text = title_text
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = NAVY

    # SLIDE 1: Title
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(1, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = NAVY
    bg1.line.color.rgb = NAVY

    tb1 = s1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(4.5))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "POSTPILOT AI (PROJECT P59)"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = RGBColor(147, 197, 253)

    p2 = tf1.add_paragraph()
    p2.text = "Social Media Management with Sentiment Analytics and Predictive Intelligence"
    p2.font.size = Pt(32)
    p2.font.bold = True
    p2.font.color.rgb = WHITE

    p3 = tf1.add_paragraph()
    p3.text = "\nAcademic Viva Voce Presentation • Software Engineering & Project Management (SEPM)\nStudent Author: Maruthi Dapke (USN: ENG24CS0127) | School of Engineering\nDayananda Sagar University, Bengaluru • November 2026"
    p3.font.size = Pt(15)
    p3.font.color.rgb = RGBColor(203, 213, 225)

    # Slides 2-12
    slides_data = [
        ("Problem Statement & Target Audience", "Phase 1: Project Domain & Objectives", [
            ("The Challenge", "Small businesses and marketing teams struggle to maintain cross-platform social activity, quantify audience sentiment in comments, and determine optimal publishing times without costly manual guesswork."),
            ("The PostPilot Solution", "A unified AI platform connecting official Instagram Business, Facebook Pages, LinkedIn, and X accounts with transformer sentiment analysis, ML engagement forecasting, and automated publishing."),
            ("Target Personas", "Digital marketers, small business owners, social media managers, and student academic evaluators.")
        ]),
        ("System Architecture & Modular Connectors", "Architectural Design", [
            ("Presentation Layer", "React 18 + Vite + Tailwind CSS + Recharts + Interactive Publishing Calendar Grid."),
            ("Backend Application Server", "Node.js (Express), JWT auth, AES-256-GCM token encryption, persistent scheduler daemon."),
            ("Modular Social Drivers", "Meta Graph API (Instagram Business & Facebook Pages), LinkedIn v2 UGC, Twitter API v2 (PKCE)."),
            ("Dual-Engine Persistence", "MongoDB Mongoose with built-in zero-config JSON store fallback (data/db.json) for 100% demo resilience.")
        ]),
        ("Phase 1: SDLC Process Models & SRS Evolution", "SEPM Curriculum Phase 1", [
            ("Selected Lifecycle Model", "Iterative-Incremental Agile with AI Prototyping: validated against Waterfall, Spiral, and V-Model."),
            ("SRS Evolution (v1 vs v2)", "AI draft v1 assumed unrestricted personal Instagram access; human-corrected v2 strictly enforces Meta Professional API requirements, AES-256 encryption, and probabilistic prediction bounds."),
            ("AI Tool Evaluation Scorecard", "Benchmarked ChatGPT (8.8/10), GitHub Copilot (8.9/10), and Tabnine (8.1/10) across Correctness, Readability, Security, Maintainability, and Speed.")
        ]),
        ("Phase 2: Agile Practices, Planning Poker & Sprints", "SEPM Curriculum Phase 2", [
            ("Sprint 1 (Velocity: 26 pts)", "Post Scheduling Calendar, Multi-Platform Preview, and AES-256 OAuth Token Encryption."),
            ("Sprint 2 (Velocity: 30 pts)", "Comment Sentiment Analytics, 60-Comment Ground Truth Benchmark, and 7x24 Best Time Heatmap."),
            ("Scrum Roles & Artifacts", "Product Owner, Scrum Master, 20 INVEST User Stories, Sprint Backlog, and Definition of Done."),
            ("Interactive Kanban & Poker", "6-stage Kanban board with WIP limits; Fibonacci consensus voting comparing team vs AI estimates.")
        ]),
        ("Phase 3: Development, Security & Infrastructure", "SEPM Curriculum Phase 3", [
            ("OAuth 2.0 Security", "Tokens encrypted with AES-256-GCM; sensitive credentials isolated from frontend responses."),
            ("Data Accuracy Mandate", "Explicit attribution tags for Actual Platform, Calculated, AI-Predicted, and Demo data."),
            ("Autonomous Scheduler Daemon", "Persistent background runner checks queue every 10 seconds with timezone safety and duplicate prevention."),
            ("Containerization", "Full Docker Compose orchestration for frontend, backend, AI service, MongoDB, and Prometheus.")
        ]),
        ("Phase 4: AI Testing, Benchmark & E2E Automation", "SEPM Curriculum Phase 4", [
            ("60-Comment Ground Truth Benchmark", "Achieved 83.3% accuracy and 83.4% Macro F1 against human labels (Target >= 80% met)."),
            ("Unit & Integration Tests", "7 automated test suites testing encryption, connectors, sentiment, ML bounds, and low-data defense."),
            ("Automated E2E Journey", "14-step contiguous system journey script executing registration-to-publishing with 100% success."),
            ("Test Coverage", "Achieved 86.4% statement coverage with zero blocker defects.")
        ]),
        ("Phase 5: SQA, SonarQube & Human-in-the-Loop", "SEPM Curriculum Phase 5", [
            ("Quality Gate Criteria", "0 blocker bugs, 0 security vulnerabilities, >= 80% test coverage enforced via sonar-project.properties."),
            ("Human vs AI Code Review", "AI caught syntax errors in 1.2s; human engineer caught data leakage in ML training and enforced chronological splitting."),
            ("Lean Waste Reduction", "Achieved 94% reduction in waiting time, 92% reduction in rework, and 100% elimination of null-metric crashes.")
        ]),
        ("Live Application Demonstration Flow", "Product Capabilities", [
            ("1. Connect Accounts", "Interactive dashboard with Instagram Business, Facebook, LinkedIn, X cards, and Sync actions."),
            ("2. AI Intelligence Center", "Unified sentiment trends, customer complaints clustering, and content intelligence patterns."),
            ("3. Compose & Live Preview", "Multi-platform mockup cards with real-time ML engagement prediction as user types."),
            ("4. Calendar & Best Time", "7x24 weekly heatmap with 1-click slot scheduling and autonomous background publishing.")
        ]),
        ("Predictive Intelligence & Best Time Heatmap", "AI & ML Evaluation", [
            ("Random Forest Regressor (RF-v1.4)", "Predicts expected interaction ranges (e.g. 210 - 295) and viral tier (Low, Average, High, Viral)."),
            ("Baseline Outperformance Probability", "Calculates likelihood of outperforming account average using normalized Z-scores."),
            ("7x24 Best Time Heatmap", "Evaluates 168 hourly slots across Sunday to Saturday; surfaces top 3 recommended publishing windows."),
            ("Insufficient Data Guard", "Refuses to output false precision when < 3 posts exist, maintaining transparency.")
        ]),
        ("Responsible AI & Ethical Governance", "Ethics & Compliance", [
            ("Prediction Uncertainty Disclosure", "Explicitly disclaims viral guarantees; presents probabilistic confidence intervals."),
            ("Comment Privacy Protection", "Analyzes linguistic text valence only; does NOT infer personal identity or demographic profiling."),
            ("Data Attribution Principle", "Distinguishes live platform telemetry from simulated demo data across all visual charts."),
            ("Account Disconnection Rights", "User can disconnect accounts and purge stored tokens and analytical snapshots on demand.")
        ]),
        ("Conclusion, Future Scope & Acknowledgements", "Summary & Viva Q&A", [
            ("Project Summary", "PostPilot AI fulfills all 30 acceptance criteria, combines production-style social media management with rigorous SEPM artifacts, and meets all academic targets."),
            ("Future Enhancements", "Integration with TikTok Content Posting API, Pinterest Business SDK, and multimodal video analysis."),
            ("Viva Voce Readiness", "Complete working application, 7 unit tests, E2E journey, and 32 syllabus tracker outcomes verified.")
        ])
    ]

    for title, cat, points in slides_data:
        s = prs.slides.add_slide(blank_layout)
        add_header(s, title, cat)

        content_box = s.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
        tf = content_box.text_frame
        tf.word_wrap = True

        for idx, (heading, body) in enumerate(points):
            p_h = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
            p_h.text = f"• {heading}: "
            p_h.font.size = Pt(15)
            p_h.font.bold = True
            p_h.font.color.rgb = NAVY

            run_body = p_h.add_run()
            run_body.text = body
            run_body.font.size = Pt(14)
            run_body.font.bold = False
            run_body.font.color.rgb = DARK_TEXT

            p_space = tf.add_paragraph()
            p_space.text = ""
            p_space.font.size = Pt(8)

    output_path = "PostPilot_AI_Presentation.pptx"
    prs.save(output_path)
    print(f"\x1b[32m✔ Successfully generated 12-slide presentation deck: {output_path}\x1b[0m")

if __name__ == '__main__':
    create_presentation()
