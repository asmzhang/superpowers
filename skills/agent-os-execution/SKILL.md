---
name: agent-os-execution
description: Use when a plan is approved and you need to implement the requested change without widening scope.
---

# Agent OS Execution

## Use when
- The plan is approved.
- The user has requested implementation.
- The scope is already locked.

## What it produces
- Implemented changes
- Minimal diffs
- Follow-up notes for any deferred work

## Must not do
- Do not re-litigate direction.
- Do not expand scope.
- Do not mix in verification except what is needed to support the change.

## Handoff
If the change is complete, hand off to `05 Verification`.
If the implementation reveals a plan gap, return to `03 Planning`.