---
name: agent-os-discovery
description: Use when you need to understand an existing codebase, surface facts, map architecture, or reduce uncertainty about impact and risk.
---

# Agent OS Discovery

## Use when
- The project already exists and its current state matters.
- The scope or impact is unclear.
- You need facts before planning.

## What it does
Collect facts, map the system, and reduce uncertainty about what exists, what works, and what is risky.

## What it produces
- Facts about the current system
- Architecture map
- Risks and unknowns
- Constraints that affect planning
- Recommended next phase
- Clear handoff to `02 Direction` or `03 Planning` when ready

## Must not do
- Do not define product direction.
- Do not write the implementation plan.
- Do not make unrelated refactors.
- Do not skip unknowns; surface them explicitly.

## Handoff
- Hand off to `02 Direction` when the facts are clear but the target is still ambiguous.
- Hand off to `03 Planning` when the facts are sufficient and the target is clear.
- If the evidence is too thin, return to `00 Intake`.
- Keep the focus on understanding, not deciding.
