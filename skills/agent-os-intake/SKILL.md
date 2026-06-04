---
name: agent-os-intake
description: Use when a request is new, the project state is uncertain, or you need to identify the project state, work intent, and correct next phase.
---

# Agent OS Intake

## Use when
- The request has no valid handoff.
- The project state is unknown or ambiguous.
- The user wants the system to decide what to do next.

## What it does
Identify the current project state, the user's real intent, and the most appropriate next phase.

## What it produces
- Project State
- Work Intent
- Current Phase
- Recommended Phase
- Open Questions
- Key unknowns
- Handoff to the next phase when appropriate

## Must not do
- Do not design the solution in detail.
- Do not implement features.
- Do not skip clarifying unknowns.
- Do not mix intake with later phases.

## Handoff
- Hand off to `01 Discovery` when facts about the existing system are missing.
- Hand off to `02 Direction` when the blocker is goals or scope.
- Keep the focus on identifying the right next phase.

## Must not do
- Do not design the solution in detail.
- Do not implement features.
- Do not mix in discovery, planning, execution, or verification.
- Do not ask more than two questions.

## Handoff
- Hand off to `01 Discovery` when facts are the blocker.
- Hand off to `02 Direction` when goals or scope are the blocker.
- If the handoff is invalid or missing, keep the request at `00 Intake`.
- Do not skip to later phases without a valid reason.
