# Agent OS Generalization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `Agent OS` into a reusable, auto-triggered workflow framework that maps project state and user intent to the correct phase, while keeping project-specific routing rules configurable.

**Architecture:** Keep the current Phase model, but split responsibilities into three layers: a reusable router skill, reusable phase skills, and a small project-config layer for per-repo overrides. The router determines the current phase from input and context; phase skills do the actual work for intake, discovery, direction, planning, execution, verification, and handoff.

**Tech Stack:** Markdown skill docs, existing Superpowers skill conventions, repository documentation, optional minimal config files for project-specific routing rules.

---

### Task 1: Define the generic router contract

**Files:**
- Create: `skills/agent-os-router/SKILL.md`
- Modify: `README.md:1-80`

- [ ] **Step 1: Write the failing test**

There is no code test harness for skills in this repo, so use an acceptance-style checklist in the skill itself. Add explicit routing examples that must be supported:

```markdown
- User asks to understand an existing repo with unknown state -> route to `00 Intake`
- User asks to clarify scope or goals -> route to `02 Direction`
- User asks to inspect an existing codebase with unclear impact -> route to `01 Discovery`
- User has a clear plan and wants implementation -> route to `04 Execution`
```

- [ ] **Step 2: Run test to verify it fails**

Run: review the current `Agent OS.md` and `README.md` manually against the above checklist.
Expected: the current docs describe the flow, but do not yet expose a reusable router skill.

- [ ] **Step 3: Write minimal implementation**

Create a new skill that documents the reusable router contract and the inputs it expects:

```markdown
---
name: agent-os-router
description: Use when a coding agent needs to automatically route a request into the correct workflow phase based on project state, user intent, and handoff validity.
---

# Agent OS Router

## Purpose
Route each request to exactly one phase.

## Inputs
- Project state
- Work intent
- Existing handoff validity
- Risk level
- User request constraints

## Routing rules
- Unknown / insufficient context -> `00 Intake`
- Existing / partial / broken / legacy + need understanding -> `01 Discovery`
- Goal or scope conflict -> `02 Direction`
- Clear target and impact -> `03 Planning`
- Explicit execution request with clear plan -> `04 Execution`
- Validation / regression / release check -> `05 Verification`
- Summary / transfer / closeout -> `06 Handoff`
```

Update the repo README to describe `Agent OS` as a reusable phase-routing model rather than a single project-only workflow.

- [ ] **Step 4: Run test to verify it passes**

Run: inspect the updated README and new skill file.
Expected: the repo now exposes a reusable router contract that other projects can adopt.

- [ ] **Step 5: Commit**

```bash
git add README.md skills/agent-os-router/SKILL.md
git commit -m "docs: add reusable agent os router contract"
```

### Task 2: Extract phase-specific reusable skills

**Files:**
- Create: `skills/agent-os-intake/SKILL.md`
- Create: `skills/agent-os-discovery/SKILL.md`
- Create: `skills/agent-os-direction/SKILL.md`
- Create: `skills/agent-os-planning/SKILL.md`
- Create: `skills/agent-os-execution/SKILL.md`
- Create: `skills/agent-os-verification/SKILL.md`
- Create: `skills/agent-os-handoff/SKILL.md`
- Modify: `README.md:1-120`

- [ ] **Step 1: Write the failing test**

Define the minimum acceptance rule for every phase skill:

```markdown
Each phase skill must state:
- when it should be used
- what it produces
- what it must not do
- how it hands off to the next phase
```

- [ ] **Step 2: Run test to verify it fails**

Run: review the existing `superpowers` skill list and the current `Agent OS` docs.
Expected: there are no dedicated reusable phase skills yet.

- [ ] **Step 3: Write minimal implementation**

Create one skill per phase, each with a narrow responsibility and a consistent structure:

```markdown
---
name: agent-os-intake
description: Use when the request is new or the project state is uncertain and you need to identify the project state, work intent, and correct next phase.
---

# Agent OS Intake

## Use when
...

## Output
...

## Must not do
- Do not plan implementation
- Do not mix multiple phases
```

Repeat the same pattern for discovery, direction, planning, execution, verification, and handoff.

- [ ] **Step 4: Run test to verify it passes**

Run: verify each skill file has a clear trigger, output, and boundary.
Expected: the phase behaviors are reusable and consistent across projects.

- [ ] **Step 5: Commit**

```bash
git add skills/agent-os-*/SKILL.md README.md
git commit -m "docs: split agent os phases into reusable skills"
```

### Task 3: Add a project configuration layer for repo-specific routing

**Files:**
- Create: `agent-os.config.md`
- Modify: `README.md:1-120`
- Modify: `Agent OS.md:1-220`

- [ ] **Step 1: Write the failing test**

Define the configuration fields that must be overrideable by a project:

```markdown
- default phase entry point
- allowed phase skips
- handoff required fields
- project-specific route exceptions
```

- [ ] **Step 2: Run test to verify it fails**

Run: compare the current `Agent OS.md` rules against the proposed configuration fields.
Expected: the current rules are embedded directly in the docs and are not yet separable.

- [ ] **Step 3: Write minimal implementation**

Create a compact project config document that holds the repo-specific defaults and exceptions while referencing the reusable skills:

```markdown
# Agent OS Project Config

- Default entry: `00 Intake`
- Skip rules: only with valid handoff or explicit bypass
- Handoff fields: Project State, Work Intent, Workflow Phase, Recommended Phase
- Project-specific exception: ...
```

Refactor `Agent OS.md` so the core routing logic points to the reusable skills and keeps only the project-specific phase rules.

- [ ] **Step 4: Run test to verify it passes**

Run: manually inspect that project-specific rules live in config, while generic behavior lives in skills.
Expected: the repo no longer hard-codes all routing behavior in one document.

- [ ] **Step 5: Commit**

```bash
git add Agent\ OS.md README.md agent-os.config.md
git commit -m "docs: separate agent os config from reusable routing"
```

### Task 4: Update acceptance tests and self-review the design

**Files:**
- Modify: `acceptance-tests/phase-routing.md`
- Modify: `README.md:1-120`
- Modify: `Agent OS.md:1-220`

- [ ] **Step 1: Write the failing test**

Add acceptance cases that cover the new reusable routing behavior:

```markdown
- Unknown project + vague request -> `00 Intake`
- Existing repo + need understanding -> `01 Discovery`
- Clear goal + conflicting scope -> `02 Direction`
- Clear plan + explicit execution request -> `04 Execution`
- Finished work + need summary -> `06 Handoff`
```

- [ ] **Step 2: Run test to verify it fails**

Run: review the updated acceptance list against the current wording.
Expected: the old samples do not yet cover the generalization layer.

- [ ] **Step 3: Write minimal implementation**

Update the acceptance tests and top-level docs so they describe the generalized router, the reusable skills, and the project config layer in one coherent flow.

- [ ] **Step 4: Run test to verify it passes**

Run: read through the updated README, Agent OS doc, and acceptance tests together.
Expected: the system reads as a reusable framework, not a one-off project artifact.

- [ ] **Step 5: Commit**

```bash
git add acceptance-tests/phase-routing.md README.md Agent\ OS.md
git commit -m "docs: update agent os acceptance criteria for reusable routing"
```

## Self-Review Checklist

- [ ] Every phase mentioned in the goal has a task.
- [ ] The router contract is defined before phase skills depend on it.
- [ ] Project-specific rules are separated from reusable behavior.
- [ ] No step says "TBD", "TODO", or "implement later".
- [ ] Every code or doc change has an exact file path.
- [ ] The plan can be executed task-by-task without guessing.
