---
id: CUJ-002
schema: 1
title: Complete a task
actor: "The same casual gamer, now holding the single task they seeded — Sprout is a single-user app"
goal: "Harvest a task and see it credited to today's plant"
criticality: high
entry_point: "/"
preconditions:
  - "Sprout's harvest log has been cleared, so no tasks are recorded as harvested today"
  - "Exactly one incomplete task titled 'Water my plants' is in the list at /"
steps:
  - n: 1
    action: "Check the checkbox on the 'Water my plants' row"
    expect: "The row text 'Water my plants' turns to strikethrough"
success_criteria:
  - "'Water my plants' is still checked off after a full page reload"
  - "The garden card reads '1 harvested today' and its progress bar has grown"
---

# CUJ-002 — Complete a task

## Narrative

Completing a task is how Sprout pays off. Harvesting is the only thing that grows the virtual tree,
which is the reward the whole app is built around. If completion breaks, the gamer never makes
progress on their plant, and the loop that gives Sprout its point never closes.

## Out of scope

- Adding a task (CUJ-001).
- The plant reaching full bloom at five harvests.
