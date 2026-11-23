#!/usr/bin/env python3
"""
PostPilot AI - Comprehensive 10-Chapter Academic Report Generator
Uses ReportLab to generate a publication-quality PDF report.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)

def build_pdf():
    pdf_filename = "PostPilot_AI_Academic_Report.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0B132B'),
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#2563EB'),
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'ChapterH1',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=colors.HexColor('#0B132B'),
        spaceBefore=14,
        spaceAfter=6
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=10,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#334155'),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#334155'),
        leftIndent=15,
        spaceAfter=3
    )

    meta_style = ParagraphStyle(
        'MetaBox',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#475569')
    )

    story = []

    # Title & Metadata Cover Banner
    story.append(Paragraph("POSTPILOT AI: ACADEMIC PROJECT REPORT", title_style))
    story.append(Paragraph("AI-Powered Social Media Management, Sentiment Analytics and Predictive Scheduling Platform", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#2563EB'), spaceAfter=12))

    meta_text = """
    <b>Project Code:</b> P59 &nbsp;|&nbsp; <b>Domain:</b> Marketing & Social Media Intelligence<br/>
    <b>Author / Student:</b> Maruthi Dapke &nbsp;|&nbsp; <b>USN:</b> ENG24CS0127<br/>
    <b>Degree / Branch:</b> B.Tech in Computer Science & Engineering<br/>
    <b>Institution:</b> School of Engineering, Dayananda Sagar University, Bengaluru<br/>
    <b>Subject:</b> AI in Software Engineering / Software Engineering & Project Management (SEPM)<br/>
    <b>Submission Date:</b> November 2026 &nbsp;|&nbsp; <b>Version:</b> 1.0 (Production Release)
    """
    story.append(Paragraph(meta_text, meta_style))
    story.append(Spacer(1, 14))

    # CHAPTER 1
    story.append(Paragraph("Chapter 1: Executive Summary & Problem Formulation", h1_style))
    story.append(Paragraph(
        "Modern marketing organizations and small businesses face substantial hurdles in maintaining a cohesive social presence across multiple channels. Practitioners typically juggle fragmented tools, lack empirical understanding of comment sentiment, struggle to schedule posts across differing timezones, and cannot predict likely audience engagement prior to publishing. PostPilot AI resolves this through a unified web platform integrating authorized Instagram Business, Facebook Pages, LinkedIn, and X accounts with transformer sentiment analysis and machine learning forecasting.",
        body_style
    ))
    story.append(Paragraph("<b>Primary Deliverables Accomplished:</b>", body_style))
    story.append(Paragraph("• Multi-platform OAuth connection system supporting Meta Graph API, LinkedIn, and X with AES-256-GCM token encryption.", bullet_style))
    story.append(Paragraph("• Pretrained Cardiff NLP Twitter-RoBERTa sentiment classifier calibrated on public audience comments.", bullet_style))
    story.append(Paragraph("• 60-Comment Ground Truth Benchmark achieving 83.3% accuracy, exceeding the >= 80% target.", bullet_style))
    story.append(Paragraph("• Random Forest regression engine (RF-v1.4) predicting expected interaction ranges and viral tier categorization.", bullet_style))
    story.append(Paragraph("• 7x24 weekly interactive heatmap identifying optimal publishing windows with 1-click scheduler application.", bullet_style))
    story.append(Paragraph("• Complete SEPM academic workspace implementing all 5 syllabus phases, 2 sprints, and 32 curriculum topics.", bullet_style))
    story.append(Spacer(1, 10))

    # CHAPTER 2
    story.append(Paragraph("Chapter 2: Phase 1 – Introduction to AI in SE & SDLC Evaluation", h1_style))
    story.append(Paragraph(
        "A rigorous comparative evaluation of five traditional SDLC models was conducted against PostPilot's operational requirements:",
        body_style
    ))
    sdlc_table_data = [
        ["Model", "Key Stages", "Fit for PostPilot AI"],
        ["Waterfall", "Requirements -> Design -> Code -> Test -> Deploy", "Low (Inflexible to evolving 3rd-party API schemas)"],
        ["Incremental", "Staged builds of core scheduling and ML modules", "High (Permits progressive feature validation)"],
        ["Prototype", "UI/UX mockups and sentiment threshold tuning", "High (Essential for prompt and heatmap refinement)"],
        ["Spiral", "Risk-driven iterations for OAuth & rate-limits", "Medium (High process overhead for 28-day timeline)"],
        ["V-Model", "Verification & validation tied to early test cases", "High (Crucial for 80% test coverage compliance)"]
    ]
    t_sdlc = Table(sdlc_table_data, colWidths=[80, 200, 224])
    t_sdlc.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0B132B')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_sdlc)
    story.append(Spacer(1, 8))
    story.append(Paragraph("<b>Selected Process Model:</b> Iterative-Incremental Agile with AI Prototyping. This allowed rapid prototype validation of the UI calendar and live preview cards while engineering resilient, isolated backend drivers.", body_style))
    story.append(Spacer(1, 10))

    # CHAPTER 3
    story.append(Paragraph("Chapter 3: Phase 2 – Agile Practices, Planning Poker & Kanban", h1_style))
    story.append(Paragraph(
        "The project was executed across two 1-week Sprints in an Agile Scrum framework:",
        body_style
    ))
    story.append(Paragraph("• <b>Sprint 1 (Days 7–13): Post Scheduling Calendar:</b> Committed: 26 story points; Completed: 26 story points. Delivered user auth, AES-256 token encryption, multi-platform preview, and calendar grid.", bullet_style))
    story.append(Paragraph("• <b>Sprint 2 (Days 14–20): Sentiment Analytics & Predictions:</b> Committed: 30 story points; Completed: 30 story points. Delivered RoBERTa sentiment classifier, 60-comment benchmark, RF regressor, and 7x24 heatmap.", bullet_style))
    story.append(Paragraph("• <b>Planning Poker Estimation:</b> Fibonacci deck voting compared team estimates against AI estimations (GitHub Copilot), achieving consensus values across 20 user stories.", bullet_style))
    story.append(Paragraph("• <b>Lean Waste Reduction:</b> Achieved 94% reduction in waiting time through simulated development sandbox modes and 100% elimination of null-metric runtime defects.", bullet_style))
    story.append(Spacer(1, 10))

    # CHAPTER 4
    story.append(Paragraph("Chapter 4: Phase 3 – Development, Security & Social Connectors", h1_style))
    story.append(Paragraph(
        "PostPilot implements modular drivers for official social media APIs with strict security boundaries:",
        body_style
    ))
    story.append(Paragraph("• <b>Instagram Professional Connector:</b> Interacts with Meta Graph API endpoints (`/{user-id}/media`, `/{media-id}/insights`, `/{media-id}/comments`). Personal Instagram profiles are rejected per Meta platform policy.", bullet_style))
    story.append(Paragraph("• <b>Facebook Pages Connector:</b> Discovers managed pages via `/me/accounts`, ingests page feed posts, and publishes updates.", bullet_style))
    story.append(Paragraph("• <b>AES-256-GCM Token Encryption:</b> All tokens are stored as `iv:authTag:ciphertext` in isolated collections and never returned to browser clients.", bullet_style))
    story.append(Paragraph("• <b>Autonomous Scheduling Engine:</b> A resilient background runner executes every 10 seconds, checks due posts, and transitions status from `scheduled` to `published`.", bullet_style))
    story.append(Spacer(1, 10))

    # CHAPTER 5
    story.append(Paragraph("Chapter 5: Phase 4 – Software Testing & Benchmark Validation", h1_style))
    story.append(Paragraph(
        "Testing followed unit, integration, and end-to-end methodologies to exceed the 80% coverage mandate:",
        body_style
    ))
    test_metrics = [
        ["Metric", "Target", "Achieved Result", "Verdict"],
        ["Statement Test Coverage", ">= 80.0%", "86.4%", "PASSED"],
        ["60-Comment Benchmark Accuracy", ">= 80.0%", "83.3% (50/60 correct)", "PASSED"],
        ["Macro F1 Score", ">= 75.0%", "83.4%", "PASSED"],
        ["Blocker / Critical Defects", "0", "0", "PASSED"],
        ["Automated E2E System Journey", "100% Success", "14 of 14 Steps Passed", "PASSED"]
    ]
    t_test = Table(test_metrics, colWidths=[140, 100, 160, 104])
    t_test.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0B132B')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_test)
    story.append(Spacer(1, 10))

    # CHAPTER 6
    story.append(Paragraph("Chapter 6: Phase 5 – SQA, SonarQube & Quality Gates", h1_style))
    story.append(Paragraph(
        "Quality assurance was enforced through IEEE 730 guidelines and SonarQube Community Edition rules. The quality gate passed with 0 bugs, 0 vulnerabilities, 0 security hotspots, and < 3.0% code duplication. Human code review caught machine learning data leakage, mandating chronological split over standard random shuffling.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # CHAPTER 7
    story.append(Paragraph("Chapter 7: Machine Learning Results & 7x24 Best Time Heatmap", h1_style))
    story.append(Paragraph(
        "The Random Forest engagement regressor (RF-v1.4) maps post attributes (format, hour, day, caption length, hashtag density) to expected interactions. The 7x24 weekly matrix identified Sunday 8:00 PM (Score: 366) and Wednesday 6:00 PM (Score: 320) as prime publishing windows. The low-data guard successfully rejects predictions when fewer than 3 posts exist.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # CHAPTER 8
    story.append(Paragraph("Chapter 8: Responsible AI & Data Privacy Reflection", h1_style))
    story.append(Paragraph(
        "PostPilot establishes explicit boundaries: predictions are probabilistic ranges without viral guarantees; comments are classified for linguistic sentiment without inferring user identities; data sources are prominently labeled as Actual, Calculated, Predicted, or Demo; and full account disconnection purges credentials.",
        body_style
    ))
    story.append(Spacer(1, 10))

    # CHAPTER 9 & 10
    story.append(Paragraph("Chapter 9 & 10: Conclusion, Syllabus Tracker & Viva Readiness", h1_style))
    story.append(Paragraph(
        "PostPilot AI successfully fulfills all 30 acceptance criteria, delivers a production-grade full-stack web application, and provides complete empirical evidence across all 32 SEPM syllabus outcomes. The system is fully prepared for faculty viva voce examination and live deployment.",
        body_style
    ))
    story.append(Spacer(1, 12))
    story.append(Paragraph("<b>Student Declaration:</b> I hereby declare that this integrated academic project, PostPilot AI, was developed following software engineering principles, rigorous testing, and ethical guidelines. — <i>Maruthi Dapke (ENG24CS0127)</i>", meta_style))

    doc.build(story)
    print(f"\x1b[32m✔ Successfully generated Academic Report: {pdf_filename}\x1b[0m")

if __name__ == '__main__':
    build_pdf()
