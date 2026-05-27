# PDX Future Scope

Last updated: 2026-05-28

This document defines the revamp direction for PDX. The goal is to move beyond generic AI notes and build an exam-focused study system that turns a student's exact syllabus, uploaded notes, and previous-year question patterns into verified study packs, practice loops, and revision plans.

## Product Positioning

PDX should not compete with ChatGPT on raw generation. ChatGPT can already generate notes, quizzes, explanations, and study plans. PDX should compete on structure, trust, exam specificity, and workflow completion.

Core promise:

```text
PDX turns your syllabus, notes, and previous papers into verified, exam-specific study packs with PYQ intelligence, editable structure, and adaptive revision.
```

Short product lines:

- Exam-ready study packs from your exact syllabus.
- Know what to study, what to skip, and what to practice.
- Not generic AI notes. Material mapped to your exam.
- Turn notes, PDFs, PPTs, and PYQs into a complete revision system.

## Strategic Pillars

### 1. Exam Specificity

Users should be able to select:

- university, board, or exam
- class, semester, or year
- subject and subject code
- module/unit/chapter
- exam pattern
- marks split
- answer format
- past-paper style
- preferred language

The output should feel like:

```text
KTU S4 DBMS Module 3, 5-mark and 10-mark university answer format
```

not:

```text
AI notes on DBMS
```

### 2. Source-Grounded Generation

Every generated study pack should know what it is based on:

- uploaded syllabus
- uploaded class notes
- uploaded PPTs
- official previous papers
- extracted PYQ patterns
- user instructions
- model inference

The UI should expose source confidence clearly. Users should be able to see whether a claim came from an uploaded source, a previous paper, or AI inference.

### 3. Practice And Revision After Generation

PDF export is not the final product. The generation flow should create a living study workspace:

- theory notes
- short-answer questions
- long-answer questions
- MCQs
- solved numericals
- flashcards
- mock tests
- weak-topic drills
- adaptive revision schedule

### 4. Quality Control As A Feature

The product should make correctness visible. A quality panel should show:

- syllabus coverage
- missing topics
- weakly covered topics
- unsupported claims
- possible hallucinations
- answer-length mismatch
- difficulty mismatch
- formula/numerical issues
- duplicate questions

Trust should be part of the user experience, not a hidden backend detail.

## Major Feature Areas

### A. Web And PYQ Intelligence

Build a paper discovery and ingestion system for supported exams.

Initial sources should be official or explicitly allowed sources:

- CBSE previous question papers
- NTA downloads
- JEE Main official resources
- university official portals where available
- user-uploaded papers

Avoid relying on random coaching-site scraping unless their terms allow it or a partnership/licensing path exists.

Pipeline:

1. Discover official paper links.
2. Download or ingest PDFs.
3. Extract text, images, tables, equations, and options.
4. Split into question-level units.
5. Classify by exam, year, session, subject, chapter, topic, question type, marks, and difficulty.
6. Detect answer keys and solution availability.
7. Store structured metadata separately from source files.
8. Use the metadata to weight generation and practice.

PYQ intelligence outputs:

- chapter frequency
- repeated concepts
- question-type distribution
- likely marks allocation
- high-return topics
- low-frequency but high-mark topics
- last-minute revision priority
- chapter-wise PYQ packs
- topic-to-paper traceability

Important legal/product note:

- Store source attribution and metadata.
- Do not republish full copyrighted papers unless permitted.
- Prefer summaries, derived analytics, and user-uploaded/private use cases.
- Add source allowlists and robots/terms checks before automated scraping.

### B. Generate From Uploaded Content

Add a third generation mode:

- theory generation
- question-bank generation
- generate from uploads

Accepted uploads:

- text PDFs
- scanned PDFs
- images
- handwritten notes
- PPT/PPTX
- DOCX
- syllabus documents
- previous papers

Extraction approach:

- use direct text extraction for digital PDFs
- use OCR for scanned PDFs and image-heavy documents
- use handwritten OCR with confidence scoring
- extract slide text and speaker notes from PPT/PPTX
- OCR images embedded inside PDFs and slides
- caption diagrams/images when useful
- preserve page/slide references for citations

User flow:

1. Upload files.
2. Show extraction status per file.
3. Display detected outline.
4. Highlight low-confidence OCR sections.
5. Let the user edit, remove, merge, or rename extracted sections.
6. Let the user choose output format.
7. Generate theory, QnA, flashcards, and revision schedule.
8. Run quality checks.
9. Export or continue in the study workspace.

OCR UX requirements:

- Never pretend OCR is perfect.
- Show confidence labels.
- Let users inspect original page/slide beside extracted text.
- Offer "fix extraction" and "ignore this page" controls.
- Keep extraction errors isolated so one bad page does not fail the whole generation.

### C. Exam Corners

Exam corners should be focused, fast, and action-first.

Examples:

- JEE Main Corner
- NEET Corner
- CBSE Class 10 Corner
- CBSE Class 12 Corner
- KTU Corner
- Anna University Corner

The UX must be very nuclear:

1. Pick exam.
2. Pick subject.
3. Pick chapter or full syllabus.
4. Choose one action:
   - start mock quiz
   - generate study pack
   - practice PYQs
   - revise weak topics
   - view chapter trends

Avoid making exam corners into blog portals. They should behave like exam-prep tools.

JEE Main example:

- Physics, Chemistry, Mathematics tabs
- chapter grid with progress and PYQ frequency
- "20-question mock" action
- "Generate chapter pack" action
- "PYQ trend" action
- "Formula revision" action
- adaptive weak-topic queue

### D. Adaptive Revision

Every generated material should produce a revision plan.

Inputs:

- exam date
- syllabus size
- user confidence
- quiz performance
- skipped topics
- time spent
- repeated mistakes
- topic weightage
- PYQ frequency

Outputs:

- Day 0 generated study pack
- Day 1 recall quiz
- Day 3 weak-topic drill
- Day 7 mixed mock
- final last-minute sheet

Adaptive rules:

- wrong answers increase topic priority
- slow answers increase drill frequency
- high-confidence correct answers reduce repetition
- high-frequency PYQ topics stay in rotation
- low-confidence OCR sections ask for review before becoming core material

### E. Quality Control Pipeline

The quality control pipeline should run after generation and before final export.

Checks:

- syllabus coverage check
- source grounding check
- hallucination risk check
- missing-topic check
- answer-format check
- difficulty distribution check
- marks allocation check
- formula and numerical consistency check
- duplicate question check
- solution consistency check
- readability check
- unsupported claim check

Hallucination combat:

- Use retrieval-grounded generation wherever source material exists.
- Require every factual section to cite source chunks.
- Use "no source, no strong claim" as a rule.
- Label unsupported content as AI-inferred.
- Run an independent verification pass after generation.
- Cross-check answer keys and generated solutions.
- For math/science, run solver-style verification for generated numericals where possible.
- Compare generated topic list against syllabus topic list.
- Keep provenance IDs in the database and PDF export.
- Expose source confidence in the UI.

Quality panel examples:

```text
Coverage: 92%
Unsupported claims: 3
Low-confidence OCR sections used: 2
Duplicate questions removed: 5
Numerical answers verified: 18 / 21
PYQ alignment: strong
```

Users should be able to click each warning and fix it.

### F. Editable Structured Workspace

Chat is not enough. PDX should have a structured workspace.

Workspace sections:

- source library
- extracted outline
- syllabus map
- generated theory
- generated questions
- PYQ insights
- flashcards
- mock tests
- quality checks
- revision plan
- export settings

Core interactions:

- drag and reorder topics
- rename topics
- merge duplicate topics
- delete irrelevant extracted sections
- lock approved sections
- regenerate one section
- regenerate with stricter source grounding
- compare versions
- export selected sections
- save templates

Important UX principle:

Regeneration must be local and surgical. Users should not have to regenerate the whole material when only one section is weak.

### G. Localized Academic Formats

Build templates that reflect real academic expectations.

CBSE:

- NCERT-first explanations
- one-mark, two-mark, three-mark, and five-mark answers
- diagrams where relevant
- value points
- sample-paper style practice

JEE Main:

- concept summary
- formula sheet
- solved examples
- single-correct MCQs
- numerical value questions
- chapter-wise PYQs
- timed mock tests

NEET:

- NCERT-first biology
- assertion-reason questions
- diagram-based questions
- high-yield facts
- chapter-wise PYQ drills

University exams:

- module-wise notes
- two-mark answers
- five-mark answers
- ten-mark answers
- repeated questions
- important diagrams
- answer-writing style

Template fields:

- exam name
- institution/board
- subject code
- marks pattern
- unit/module names
- preferred answer length
- diagram requirement
- numerical/formula requirement
- language
- citation strictness

## UI/UX Standard

The revamp should be visually pleasing, calm, fast to understand, and easy on the eye. It should feel like a serious study product, not a generic AI dashboard.

### Design Thesis

PDX should feel like a focused academic workbench: calm surfaces, clear hierarchy, warm accent moments, precise typography, and visible confidence signals.

### Frontend Skills To Apply

Implementation should follow these frontend skill principles:

- `frontend-design`: distinct product aesthetic, not generic SaaS or AI-slop styling
- `frontend-skill`: restrained composition, action-first sections, cardless layouts where possible
- `design-taste-frontend`: Tailwind discipline, responsive grid systems, one primary accent, production interaction states
- `make-interfaces-feel-better`: typography polish, tabular numbers, tactile buttons, concentric radii, interruptible animations
- `emil-design-eng`: purposeful animation, responsive feedback, invisible details that make the interface feel right

### Component System

Use shadcn/ui as the default component base.

Revamp requirement:

- upgrade shadcn/ui to the current recommended setup
- install all shadcn components into the project
- standardize all primitives under `src/components/ui`
- always use shadcn components before creating custom primitives
- customize shadcn tokens, radii, colors, shadows, and motion so the app does not look like untouched default shadcn
- keep all feature UI built from shared primitives and compositions
- treat shadcn as the primary UI implementation layer for the authenticated app, generation workflows, workspace panels, quality inspectors, settings, tables, dialogs, forms, and command/search surfaces

Component policy:

- use shadcn Button, Input, Textarea, Select, Dialog, Sheet, Tabs, Accordion, Table, Badge, Tooltip, Progress, Dropdown Menu, Command, Popover, Alert, Skeleton, Card, Separator, Scroll Area, Toggle, Toggle Group, Radio Group, Checkbox, Slider, Calendar, Form, Toast/Sonner, and Navigation/Menu primitives where relevant
- wrap recurring product patterns in app-specific components
- do not create one-off form controls inside feature files
- do not nest cards inside cards
- use Tailwind for styling
- use lucide icons consistently unless a shadcn component already supplies an icon pattern

### Client Data And Performance

Use TanStack Query for client-side server state in the authenticated application.

TanStack Query should own:

- upload and extraction status polling
- generation progress polling
- material/workspace detail reads
- history and dashboard list reads
- quality finding refreshes
- quiz attempt state that round-trips to the server
- settings and account mutations where optimistic updates are safe

Performance rules:

- keep route handlers and server components responsible for secure initial reads where appropriate
- use TanStack Query for cache reuse, background refresh, mutation retries, invalidation, and optimistic UI only when the rollback path is clear
- avoid duplicated `useEffect` fetch logic in feature components
- keep query keys centralized and typed
- keep payloads small and paginated for history, PYQ, source chunks, and activity lists
- avoid refetching large generated content when a section-level query or mutation is enough
- use skeletons, progressive loading, and streaming-friendly UI where it improves perceived speed
- measure slow surfaces before adding client complexity

### Typography

Fonts must be easy on the eye.

Recommended direction:

- use a clean modern sans for product UI
- use a readable serif only for generated academic content or PDF preview if it improves long-form reading
- avoid overused generic UI defaults in the revamp
- keep body copy at comfortable sizes and line heights
- use `text-wrap: balance` for headings
- use `text-wrap: pretty` for body text
- use tabular numbers for scores, progress, timers, and token/credit metrics

Possible font pairings:

- Geist Sans + Geist Mono for app UI
- Satoshi + JetBrains Mono for product UI and metrics
- Source Serif 4 or Literata for generated study material preview

Do not mix too many typefaces. Two primary families plus a monospace is the upper limit.

### Color And Surface Direction

The current product has a dark academic style with warm yellow, green, and blue accents. The revamp should keep that memory but make it calmer and more systematic.

Rules:

- no generic purple/blue AI gradients
- no raw hex values in feature components
- no oversaturated glow effects
- use one main action accent per view
- use semantic colors for quality states
- use source-confidence colors consistently
- use subtle shadows and inner borders instead of heavy borders everywhere

Suggested confidence colors:

- verified: green
- source-backed: blue
- inferred: amber
- low confidence: orange
- blocked/error: red

### Layout Principles

Study workflows should be easy to understand at a glance.

Rules:

- start each product surface with the task, not marketing copy
- keep one primary action per screen
- use progressive disclosure
- keep forms short and grouped
- show extraction/generation progress in plain language
- make warnings actionable
- use side-by-side source and generated content where review is needed
- avoid dashboard card mosaics
- use panels only when they map to real workflow regions

Recommended core layout for the workspace:

```text
Left rail: sources, outline, generated sections
Center: active editor/preview
Right inspector: quality, sources, settings, actions
Bottom/status: generation progress and revision queue
```

### Motion And Microinteractions

Motion should feel tasteful and purposeful. It should never feel like generic AI slop.

Use motion for:

- upload progress
- extraction completion
- source chunk reveal
- quality warning resolution
- section regeneration
- drag-reorder feedback
- tab/sheet/dialog transitions
- button press feedback
- quiz answer feedback
- revision streak/progress feedback

Motion rules:

- no animation for high-frequency keyboard actions
- keep routine UI motion under 300ms
- animate transform and opacity, not layout properties
- avoid `transition-all`
- make animations interruptible
- use subtle scale on press, around `scale(0.96)`
- stagger long generated lists only on first reveal
- respect reduced-motion preferences
- no decorative looping animations in dense work areas

### Accessibility

Minimum standard:

- keyboard navigation for every workflow
- visible focus states
- accessible labels for all form controls
- readable contrast
- no text trapped in images
- error messages tied to fields
- PDF/export content remains readable
- OCR confidence warnings are text, not color-only

### Visual QA Checklist

Every major frontend change should be checked on:

- `/`
- `/pricing`
- `/login`
- `/dashboard`
- `/dashboard/generate/theory`
- `/dashboard/generate/qbank`
- future `/dashboard/generate/uploads`
- future `/workspace/[materialId]`
- future `/exams`
- future `/exams/jee-main`
- `/history`
- `/settings`

Check desktop and mobile.

## Backend And Scalability Standard

The revamp backend must be built as a reliable pipeline, not a pile of request handlers.

The goal is a highly scalable and performant application from v1. The first implementation should not rely on temporary shortcuts that will collapse when uploads, OCR, generation, PYQ ingestion, or practice activity volume grows.

### Core Architecture

Recommended services/modules:

- web app and API
- ingestion worker
- OCR worker
- generation worker
- quality-control worker
- quiz/revision worker
- file/object storage
- relational database
- search/vector index
- queue system
- observability/logging

Long-running work must stay out of the request lifecycle. The web app should enqueue jobs and display progress.

### Performance And Scalability Rules

- design every heavy workflow as async jobs, not synchronous API calls
- keep APIs cursor-paginated for lists, source chunks, PYQs, generated sections, activity events, and transactions
- index all high-cardinality lookup paths, especially user/material, workspace/source, topic/PYQ, status/stage, and created-at queries
- avoid `SELECT *` style overfetching in data access helpers and route handlers
- keep large source text, extracted chunks, and generated content out of queue payloads
- cache stable exam metadata, template definitions, and source-derived analytics
- support incremental loading for large workspaces
- support section-level regeneration without invalidating or refetching the entire material
- keep provider/model usage, token cost, job duration, and queue latency observable from day one
- make background jobs horizontally scalable by queue type and concurrency setting
- design file ingestion, OCR, generation, quality checks, and exports so each can scale independently

### Pipeline Design

Use durable job stages:

1. upload received
2. file stored
3. text extraction queued
4. OCR queued when needed
5. document chunks created
6. outline generated
7. user review required if confidence is low
8. study pack generation queued
9. quality checks queued
10. revision assets generated
11. export generated

Each stage should be:

- idempotent
- retryable
- observable
- tied to a material/workspace ID
- safe to resume
- safe to partially fail

### Data Model Direction

Add concepts for:

- source document
- source page/slide
- extracted chunk
- OCR confidence
- syllabus topic
- topic mapping
- generated section
- generated question
- PYQ question
- quality finding
- revision event
- quiz attempt
- user answer
- source citation

Every generated object should keep source/provenance metadata.

### Reliability Rules

- use shared schemas/contracts between web and worker
- validate env at startup
- validate queue payloads
- authenticate worker callbacks
- use idempotency keys for callbacks
- never mark a material complete before the final artifact is ready
- never double-deduct credits
- separate reserved credits from final deduction
- make retries safe
- store failure reason and recovery action
- keep object storage writes atomic from the user's point of view
- clean temporary files after upload or failure

### Scaling Rules

- split ingestion, OCR, generation, and export into separate queues
- configure concurrency per queue
- use backpressure for OCR and generation
- avoid putting large extracted text in queue payloads
- store large content in object storage or DB rows and pass IDs through queues
- cache official exam metadata
- dedupe uploaded files by hash
- dedupe papers by source URL and checksum
- support partial regeneration at section level
- instrument token usage and cost per material

### Observability

Every job should emit:

- workspace/material ID
- user ID
- stage
- attempt count
- duration
- provider/model used
- token usage
- source document IDs
- quality score
- failure reason

Admin/debug views should show:

- stuck jobs
- failed OCR pages
- provider failures
- model fallback rates
- average generation time
- cost per output type
- quality finding frequency

## Implementation Phases

### Phase 1: Foundations

- create revamp design tokens
- upgrade shadcn/ui
- install all shadcn components
- standardize component primitives
- add TanStack Query and standardize typed query keys, mutations, invalidation, polling, and optimistic-update rules
- define model/provider registry
- define source/provenance schema
- define shared contracts for generation and quality checks
- define performance budgets, pagination conventions, caching boundaries, and queue observability requirements

### Phase 2: Uploaded Content Mode

- file upload UI
- source document model
- direct PDF text extraction
- PPT/PPTX extraction
- OCR pipeline
- extraction review screen
- generate theory + QnA from reviewed outline

### Phase 3: Structured Workspace

- workspace route
- source library panel
- outline editor
- generated section editor
- quality inspector
- section-level regeneration
- export settings

### Phase 4: Quality Control

- syllabus coverage checker
- source grounding checker
- hallucination-risk checker
- duplicate question checker
- answer-format checker
- quality panel UI

### Phase 5: PYQ Intelligence

- official source allowlist
- paper ingestion jobs
- question parser
- chapter/topic classifier
- PYQ trend UI
- PYQ-weighted generation

### Phase 6: Exam Corners

- `/exams`
- `/exams/jee-main`
- chapter-level actions
- mock quiz engine
- chapter study-pack generation
- PYQ trend views

### Phase 7: Adaptive Revision

- quiz attempts
- weak-topic model
- spaced repetition schedule
- revision dashboard
- regenerated weak-topic packs

## Non-Goals For This Revamp

- teacher/coaching institute mode
- broad social/community features
- generic AI chat as the primary interface
- scraping unapproved copyrighted sources
- large redesign without component/token foundations

## Success Metrics

Product:

- percentage of generated packs with 90%+ syllabus coverage
- percentage of generated claims with source grounding
- upload-to-study-pack completion rate
- quiz improvement after revision cycle
- repeat usage per exam/chapter
- export/download rate

Operational:

- job success rate
- OCR failure rate
- generation fallback rate
- average generation time
- cost per material
- queue latency
- duplicate callback rate

UX:

- time to first generated outline
- time to first practice question
- section-regeneration success rate
- number of unresolved quality findings at export
- mobile completion rate

## Decision Principles

- Build workflows, not one-off generations.
- Prefer official and user-provided sources.
- Make quality and uncertainty visible.
- Keep the UI calm and action-first.
- Use shadcn primitives and Tailwind consistently.
- Use TanStack Query for client server-state performance, cache correctness, polling, and mutation orchestration.
- Keep backend jobs durable, observable, and idempotent.
- Build for scale from v1: async pipelines, pagination, indexed queries, small payloads, independent worker queues, and measurable performance.
- Make regeneration small, local, and reversible.
- Optimize for exam outcomes, not AI novelty.
