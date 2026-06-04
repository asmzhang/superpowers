---
name: agent-os-router
description: Use when a request must be automatically routed into the correct workflow phase based on project state, user intent, and handoff validity.
---

# Agent OS Router

## Use when
- A request arrives and the next phase must be chosen automatically.
- The request may be ambiguous, incomplete, or missing a valid handoff.
- You need a single phase decision before any other work happens.

## Purpose
Route every request into exactly one workflow phase.

## Decision factors
- Project state
- Work intent
- Existing handoff validity
- Risk level
- User constraints

## Routing rules
- Unknown / insufficient context -> `00 Intake`
- Existing / partial / broken / legacy + need understanding -> `01 Discovery`
- Goal or scope conflict -> `02 Direction`
- Clear target and impact -> `03 Planning`
- Explicit execution request with clear plan -> `04 Execution`
- Validation / regression / release check -> `05 Verification`
- Summary / transfer / closeout -> `06 Handoff`

## Operating rules
- Decide first, then act.
- Only one phase per request.
- If the handoff is invalid, return to `00 Intake`.
- If impact is unclear, prefer `01 Discovery`.
- If goals conflict or drift is present, prefer `02 Direction`.
- Keep project-specific exceptions outside this skill.

## Output
- Project State
- Work Intent
- Current Phase
- Recommended Phase
- Deferred Phase
- Open Questions
- Bypass Reason, when `00 Intake` is skipped
