---
id: CUJ-003
schema: 1
title: Reach full bloom
actor: "The same casual gamer, working through a day's list of five tasks, chasing the garden's full-bloom reward"
goal: "Grow today's plant to full bloom by harvesting five tasks in a single day"
criticality: medium
entry_point: "/"
preconditions:
  - "Sprout's harvest log has been cleared, so the garden card starts at 🌰 seed with today's count at 0"
  - "Exactly five incomplete tasks are in the list at /, none of them checked"
steps:
  - n: 1
    action: "Check the checkbox on the first task"
    expect: "The garden card reads '1 harvested today' with a '4 to bloom' hint, the plant is a sprout 🌱, and the progress bar is 1 of 5"
  - n: 2
    action: "Check the checkbox on the second task"
    expect: "The garden card reads '2 harvested today' with a '3 to bloom' hint, the plant is a seedling 🌿, and the progress bar is 2 of 5"
  - n: 3
    action: "Check the checkbox on the third task"
    expect: "The garden card reads '3 harvested today' with a '2 to bloom' hint, the plant is leafing 🪴, and the progress bar is 3 of 5"
  - n: 4
    action: "Check the checkbox on the fourth task"
    expect: "The garden card reads '4 harvested today' with a '1 to bloom' hint, the plant is leafing 🪴, and the progress bar is 4 of 5"
  - n: 5
    action: "Check the checkbox on the fifth task"
    expect: "The garden card caption switches to 'In full bloom 🌳', the plant is a tree 🌳, and the progress bar is full at 5 of 5"
success_criteria:
  - "After a full page reload, the garden card still reads 'In full bloom 🌳' and the progress bar is still full at 5 of 5"
  - "After the reload, all five tasks remain checked"
---

# CUJ-003 — Reach full bloom

## Narrative

Full bloom is the reward the whole garden mechanic builds toward: five harvests in a day grows
today's plant all the way to the tree 🌳 and flips the caption to "In full bloom". It is the
moment that turns a plain todo list into a game worth returning to. If the fifth harvest never
tips the plant into bloom — the count stalls, the stage sticks, or the "N to bloom" hint never
resolves — the daily goal Sprout dangles is unreachable, and the reason a casual gamer keeps
coming back quietly disappears.

## Out of scope

- Adding a task (CUJ-001) and completing a single task (CUJ-002).
- Un-completing a task and watching the plant regress a stage.
- Garden history across multiple days (Slice 2) and streaks/trends (Slice 3).
