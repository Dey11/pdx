# PDX / LearnStack Future Scope

Last updated: 2026-05-28

This document defines the revamp scope for the application after reviewing the current repo docs and the LearnStack Figma file:

- Figma file: `LearnStack`, file key `KnKJQBgfUYI2s7t66H2Oaw`
- Figma page: `Page 1`
- Primary inspected nodes:
  - `1:87` - `v2 Dashboard`
  - `1:367` - `v2 Dashboard - My courses`
  - `1:456` - `My courses - No courses case`
  - `1:333` - `Music player`
  - full-page screenshot covering dashboard, course study, profile, settings, edit-profile modals, and landing/pricing sections

The Figma direction is the source of truth for the v1 revamp product shape. The current PDX codebase is PDF-first, but the revamp should become a web-first learning workspace. PDF generation should no longer be the main product outcome.

Do not revamp the public landing page or login page in this implementation pass. They can remain as-is while the authenticated application is rebuilt.

## Product Direction

PDX should become LearnStack: an AI-assisted study workspace where a student creates courses from their syllabus and sources, studies generated material in the web app, practices with quizzes and flashcards, tracks progress, and uses trust signals to understand what is source-backed and what needs review.

Core promise:

```text
LearnStack turns your syllabus and study sources into structured web courses with verified lessons, quizzes, flashcards, progress tracking, and focused study tools.
```

V1 should feel like a serious course workspace, not a PDF factory and not a generic AI chat app.

## Design Inventory From Figma

The app designs currently support these product surfaces.

| Surface | Design Coverage | V1 Decision |
| --- | --- | --- |
| Dashboard | Designed in light and dark variants with hero CTA, recent courses, notes, pomodoro timer, friend activity, study-session CTA, sidebar, topbar, music launcher | Build in v1 |
| My Courses | Designed with search, filter, tabs, new-course CTA, course cards, progress, favorites, collaborative filter, empty state | Build in v1 |
| Course Study | Designed with course header, study tabs, content panel, right course-content panel, quiz/progress states, note editor, AI/help style interaction, loading modal | Build in v1 |
| Notes | Present in dashboard/sidebar and course workspace; standalone notes card patterns visible | Build a practical v1 notes surface |
| Quiz / Practice | Designed through course workspace quiz screens and profile activity/score references | Build in v1 |
| Flashcards | Mentioned in landing/pricing copy and course tabs; no detailed flashcard screen visible | Build basic course flashcards by extending course study layout |
| Pomodoro / Focus | Designed on dashboard with focus duration, short break, long break, session count, active timer chip | Build in v1 |
| Music Player | Designed as compact radio player with art, progress, controls, and genres | Build in v1 if lightweight; can use static/local tracks first |
| Study Sessions | Dashboard CTA and sidebar route are designed; social study intent is visible | Build lightweight v1 session creation/join flow |
| Friend Activity | Designed on dashboard and profile | Build activity feed in v1 |
| Profile | Designed with profile header, stats, activity calendar, recent activity, insights placeholders, study buddies states | Build in v1 |
| Edit Profile | Designed as modal/drawer variants | Build in v1 |
| Settings | Designed with account information, profile photo, focus settings, language, security/data, manage account, delete account | Build in v1 |
| Classroom | Sidebar and marketing copy mention it, but no full classroom management screen is visible | Not-now scope except navigation placeholder if needed |
| Referral | Sidebar has route, but no full referral screen is visible | Not-now scope |
| Insights | Sidebar route and profile/dashboard analytics patterns exist, but standalone insights screen is not deeply designed | Build basic v1 analytics; expand later |
| Landing / Pricing | Designed in the file, but explicitly out of scope for now | Do not touch now |
| Login | Existing app route; no revamp requested now | Do not touch now |

## V1 Scope

### 1. Authenticated App Shell

Use the Figma app shell as the base for all authenticated routes.

Required:

- persistent left sidebar
- topbar with collapse/menu, notifications, theme toggle
- routes for Dashboard, My Courses, Notes, Insights, Study Session, Profile, Settings
- music launcher in the bottom-right
- shared card/panel/list styles based on the Figma light theme first
- dark mode support only if it can use the Figma dark dashboard/course variants cleanly

Routes:

- `/dashboard`
- `/courses`
- `/courses/new`
- `/courses/[courseId]`
- `/notes`
- `/insights`
- `/study-session`
- `/profile`
- `/settings`

Keep `/` and `/login` out of this revamp pass.

### 2. Course Creation And Web Generation

Figma shows "Create New Course" and "New Course" entry points, but it does not show the full creation wizard. V1 needs a small added design layer for this because the product cannot work without it.

Required course setup fields:

- course title
- subject
- exam or institution context, optional in v1
- difficulty level
- preferred language
- syllabus text
- optional source uploads
- generation goal: study material, quiz, flashcards, or complete course

V1 upload support:

- digital PDF text extraction
- plain text / pasted syllabus
- image upload can be accepted but should be marked experimental if OCR is not stable

Not required in v1:

- polished multi-format upload support for PPTX, DOCX, scanned PDFs, and handwritten notes
- official web scraping or automatic public paper discovery
- direct PDF output as the completion goal

Output:

- a course workspace in the web app
- generated modules/lessons
- quiz questions
- flashcards
- notes workspace
- quality findings and source confidence

### 3. My Courses

Implement the Figma course library as the main management surface.

Required:

- search courses
- filter button
- tabs: All Courses, Collaborative, Favorites
- New Course button
- course cards with title, description, progress, last studied, plan/status badge, favorite action, download/export action if available, delete action
- empty state from `My courses - No courses case`
- progress persistence per course

V1 simplification:

- Collaborative tab can show an empty state until collaboration is implemented.
- Download/export should not imply PDF-first behavior. It can export selected web content later.

### 4. Course Study Workspace

This is the core v1 product surface. It replaces the current PDF download flow.

Required:

- course header with title and progress
- study tabs based on the Figma workspace:
  - Study Materials
  - Quiz
  - Flashcards
  - Notes
  - AI / Doubt help
- center content area for lesson material, quiz, note editor, or flashcards
- right panel for course content/module outline
- per-section progress and completion state
- loading/generation state based on the designed modal
- course-specific actions: continue, favorite, share later, export later

Study material requirements:

- generated content must be structured into modules, lessons, and sections
- sections should be readable in the browser
- each factual section should keep citation/provenance metadata
- unsupported or inferred sections must be labeled
- users should be able to regenerate a section without regenerating the whole course

### 5. Quality And Hallucination Detection

This must be in v1 even though Figma does not yet show a detailed quality panel. Add it as a right-panel or inspector extension inside the Course Study layout.

Required v1 checks:

- syllabus coverage
- source grounding
- unsupported claim detection
- hallucination risk score
- missing topic detection
- duplicate generated question detection
- quiz answer consistency check
- low-confidence extraction warning

Rules:

- no strong factual claim without a source when source material exists
- AI-inferred content must be visibly labeled
- quality findings must be stored as structured records
- every generated lesson section, question, answer, and flashcard should be linkable to source chunks where possible
- users should be able to open a finding, see the affected content, and regenerate or accept it

V1 quality UI additions:

- source-backed / inferred / low-confidence badges
- quality score in course header or right panel
- warning list in the Course Study right panel
- section-level "Regenerate with stricter grounding"

### 6. Quizzes And Practice

Build quizzes as web-native practice, not PDF question banks.

Required:

- course-level quiz list
- generated MCQs and short-answer questions
- answer submission
- immediate feedback
- score persistence
- quiz attempt history
- weak-topic marking
- dashboard/profile activity event when a quiz is completed

V1 can skip:

- timed mock exams
- multi-exam rank prediction
- advanced numerical solver verification beyond basic answer consistency checks

### 7. Flashcards

Figma references flashcards but does not include a detailed flashcard screen. Build a minimal version using the Course Study layout.

Required:

- generated flashcards per lesson/module
- flip/reveal answer
- mark known / needs review
- store review state

Not now:

- full spaced-repetition algorithm
- calendar-based revision planner

### 8. Notes

Notes are a first-class surface in the Figma navigation and dashboard.

Required:

- notes list
- create/edit/delete note
- course-linked notes
- note editor inside Course Study
- recent notes on dashboard
- last edited timestamps

V1 can keep note editing simple with plain text or markdown. Rich block editing can come later.

### 9. Focus Tools

The designed focus features should be included because they give the app its study-workbench feel.

Required:

- Pomodoro timer
- focus duration, short break, long break settings
- start/reset controls
- active focus timer chip in top area
- session count
- focus settings in Settings

Optional v1:

- compact music/radio player
- genre chips
- play/pause/progress controls

The music player should be lightweight. Do not let it slow down the core course/generation work.

### 10. Activity, Profile, And Basic Insights

Profile and activity are strongly represented in Figma.

Required:

- profile header with name, username, bio/context, avatar
- edit-profile modal
- study stats: completed courses, total hours, study streak
- activity calendar
- recent activity feed
- quiz score events
- study buddy list state
- empty buddy state
- basic insights cards

V1 insight examples:

- courses in progress
- completed quizzes
- average quiz score
- study streak
- focus time
- weak topics

Not now:

- advanced predictive analytics
- public profile pages
- social graph recommendations

### 11. Settings

Implement the designed settings surface.

Required:

- account information
- profile photo controls
- focus settings
- language selector
- security and data section
- manage account section
- delete-account action with confirmation

Billing can stay aligned with the existing app, but the settings UI should not be blocked on a billing redesign.

## Backend And Scalability Standard

The backend must be sturdy in v1. Even if UI features are introduced gradually, the data and job pipeline should not be makeshift.

### Architecture Direction

Use a web app plus worker architecture with durable queues. Long-running work must stay out of request handlers.

Core modules/services:

- Next.js app and API
- worker process for ingestion, generation, verification, and exports
- PostgreSQL relational data model
- Redis/BullMQ queues
- object storage for uploaded source files and generated export artifacts
- shared contracts package/module
- env validation package/module
- AI provider registry and fallback chain
- observability/logging for jobs and provider calls

The current PDF worker can inform the worker structure, but v1 should produce web course records first.

### Required Pipeline

V1 course generation should be stage-based:

1. course draft created
2. sources saved
3. extraction queued
4. chunks created
5. outline generated
6. user review requested when confidence is low
7. lesson generation queued
8. quiz and flashcard generation queued
9. quality checks queued
10. course workspace published
11. optional export generated later

Every stage must be:

- idempotent
- retryable
- observable
- tied to a course/workspace ID
- safe to resume
- safe to partially fail

### V1 Data Model Direction

Add or map concepts for:

- Course
- CourseSource
- SourcePage or SourceDocumentPart
- SourceChunk
- CourseModule
- LessonSection
- GeneratedQuestion
- Flashcard
- Note
- QuizAttempt
- UserAnswer
- QualityFinding
- SourceCitation
- StudySession
- ActivityEvent
- UserLearningSettings

Every generated object should keep provenance metadata.

### Reliability Rules

- share queue and callback schemas between web and worker
- validate env at startup
- validate queue payloads
- authenticate worker callbacks
- use idempotency keys for callbacks and generation stages
- never mark a course ready before required lesson records exist
- store partial generation failures with recovery actions
- make section-level regeneration safe
- avoid large text in queue payloads; pass IDs
- dedupe uploaded files by hash
- track token usage and provider cost per course
- reserve and finalize credits through a ledger-style model before serious billing use

### Observability

Each job should emit:

- course ID
- user ID
- stage
- attempt count
- duration
- provider/model used
- token usage
- source IDs
- quality score
- failure reason

Admin/debug views are not part of v1 UI, but logs and data should support them later.

## Explicit Not-Now Scope

These items were in the older future scope or visible only as marketing/navigation hints, but they are not supported enough by the current app designs for v1.

### Not Now Because Designs Are Missing

- full classroom management
- referral screen
- collaborative editing
- friend invitations and social graph
- public/private classroom roles
- advanced standalone insights dashboard
- polished flashcard-only screen beyond the Course Study tab
- full document extraction review UI with side-by-side OCR page viewer
- full source library management screen
- teacher/coaching institute mode

### Not Now Because Product Direction Changed

- PDF generation as the primary output
- one final merged PDF per material as the core success state
- PDF-first theory and qbank flows
- history page centered only on downloads

PDF/export can return later as an optional export from a web course.

### Not Now Because Scope Is Too Large For V1

- official web/PYQ crawler
- automatic source discovery from CBSE, NTA, university portals, and other websites
- full PYQ intelligence platform
- JEE/NEET/CBSE/KTU exam corners
- chapter frequency analytics from official papers
- adaptive revision engine with spaced repetition scheduling
- handwritten OCR as a dependable production feature
- scanned PDF OCR at scale
- PPTX/DOCX extraction with rich layout preservation
- advanced math/numerical solver verification
- mobile app

## Revised Implementation Phases

### Phase 1: Foundations

- align authenticated app shell with Figma
- define LearnStack tokens and typography from the Figma direction
- keep Tailwind and shadcn-style primitives
- create shared layout components for sidebar, topbar, panels, cards, tabs, and right inspectors
- define Course and source/provenance data model
- define shared contracts for course generation and quality checks
- define AI provider registry and fallback chain

### Phase 2: Courses And Dashboard

- implement `/dashboard`
- implement `/courses`
- implement course empty state
- implement course cards, search, filter, tabs, favorite, progress
- implement `/courses/new` with the minimal added creation flow
- create courses from syllabus text and optional digital PDF source

### Phase 3: Course Study Workspace

- implement `/courses/[courseId]`
- render generated modules and lesson sections in the web app
- implement right course-content panel
- implement Study Materials, Quiz, Flashcards, Notes, and AI/Doubt tabs
- implement generation/loading states
- implement section-level regeneration

### Phase 4: Quality And Trust

- implement source citations
- implement quality findings
- implement hallucination-risk checks
- implement unsupported-claim labels
- expose quality badges and warnings in the course workspace
- block or warn before publishing low-trust sections

### Phase 5: Practice, Notes, And Activity

- implement quiz attempts
- implement flashcard review state
- implement notes list/editor
- implement activity feed
- implement dashboard recent activity
- implement profile stats and activity calendar

### Phase 6: Focus, Profile, And Settings

- implement Pomodoro timer
- implement optional music player
- implement profile and edit-profile modal
- implement settings account/focus/language/security/manage sections
- implement basic insights cards

### Phase 7: Optional Export And Later Expansion

- add print/PDF export only after web courses are stable
- add richer upload extraction
- add classroom/collaboration
- add PYQ intelligence and exam corners
- add adaptive revision

## Success Metrics

Product:

- course creation completion rate
- time from syllabus input to first usable course outline
- percentage of generated sections with source citations
- number of unresolved quality findings per course
- quiz completion rate
- flashcard review usage
- repeat course visits

Operational:

- job success rate per stage
- generation retry rate
- hallucination/unsupported-claim finding rate
- average generation time
- queue latency
- provider fallback rate
- cost per course
- duplicate callback count

UX:

- time to resume a course from dashboard
- time to first quiz attempt
- section-level regeneration success rate
- notes created per course
- focus session starts
- mobile usability of dashboard, courses, and course workspace

## Decision Principles

- Build the authenticated LearnStack app first; leave landing and login alone.
- Make courses and web study workspaces the core artifact.
- Treat PDF/export as optional, not the product center.
- Build source grounding and hallucination detection into v1.
- Prefer generated structured records over generated blobs.
- Keep backend jobs durable, observable, and idempotent.
- Make regeneration local and reversible.
- Keep the Figma app shell as the base design.
- Add only the missing UI needed to make the designed product functional.
- Do not promote features to v1 unless they are designed or are required for the designed workflow to work.
