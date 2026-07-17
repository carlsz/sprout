---
id: CUJ-001
schema: 1
title: Add a task
actor: "Casual gamer evaluating Sprout for the first time, with no tasks saved yet"
goal: "Seed a first task from the empty state without navigating away"
criticality: critical
entry_point: "/"
preconditions:
  - "Sprout's saved tasks and harvest log have been cleared, so / shows the empty state with the new-task input and the Seed button"
steps:
  - n: 1
    action: "Enter 'Water my plants' in the new-task input box and tap the Seed button"
    expect: "A new list item reading 'Water my plants' appears in the list"
success_criteria:
  - "'Water my plants' is still present in the list after a full page reload"
---

# CUJ-001 — Add a task

## Narrative

Adding a task is the core experience of Sprout. It is the first thing a casual gamer tries when
evaluating the app, and everything else the product does — completing a task, growing the virtual
plant — depends on a task existing first. If a first-time evaluator types a task, taps Seed, and
nothing lands, there is nothing else in the product for them to try and no reason to come back.

## Out of scope

- Completing a task (CUJ-002).
- The virtual plant growing.
- Deleting or editing a task.
