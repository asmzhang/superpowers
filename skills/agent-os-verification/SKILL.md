---
name: agent-os-verification
description: Use when changes are complete and you need to validate behavior, regressions, or release readiness before handoff.
---

# Agent OS Verification

## Use when
- Code or docs have changed.
- You need to confirm the result works as intended.
- You need to check for regressions or release readiness.

## What it produces
- Verification results
- Regression notes
- Remaining risks
- Ready or not-ready handoff

## Must not do
- Do not add new features.
- Do not widen scope.
- Do not skip verification when behavior changed.

## Handoff
If verification is complete, hand off to `06 Handoff`.
If validation fails, return to the phase that owns the fix.