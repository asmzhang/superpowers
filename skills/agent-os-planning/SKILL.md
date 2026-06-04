---
name: agent-os-planning
description: Use when the goal is clear and you need a concrete, bite-sized implementation plan with file paths, steps, and verification.
---

# Agent OS Planning

## Use when
- The target is clear.
- The impact is understood.
- The work should be decomposed into executable steps.

## What it produces
- File-by-file implementation plan
- Bite-sized tasks
- Verification steps
- Safe execution order

## Must not do
- Do not write code.
- Do not change scope silently.
- Do not mix discovery or direction work into the plan.

## Handoff
If the plan is approved and execution is requested, hand off to `04 Execution`.
If the plan reveals missing facts or unresolved goals, return to `01 Discovery` or `02 Direction`.