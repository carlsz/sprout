import { describe, it, expect } from "vitest";
import {
  localDate,
  recordHarvest,
  logToggle,
  stageFor,
  BLOOM_THRESHOLD,
  type HarvestLog,
} from "@/lib/harvest";
import type { Todo } from "@/lib/todos";

// Local noon avoids any timezone/DST edge flipping the calendar date.
const dayA = new Date(2026, 6, 15, 12).getTime(); // 2026-07-15
const dayB = new Date(2026, 6, 16, 12).getTime(); // 2026-07-16

function todo(overrides: Partial<Todo> = {}): Todo {
  return { id: "a", title: "t", done: false, createdAt: 0, ...overrides };
}

describe("localDate", () => {
  it("formats local epoch ms as YYYY-MM-DD", () => {
    expect(localDate(dayA)).toBe("2026-07-15");
  });
});

describe("recordHarvest", () => {
  it("adds to a day's count", () => {
    expect(recordHarvest({}, "2026-07-15", 1)).toEqual({ "2026-07-15": 1 });
  });

  it("prunes a day that falls to zero", () => {
    expect(recordHarvest({ "2026-07-15": 1 }, "2026-07-15", -1)).toEqual({});
  });

  it("never goes negative (floors by pruning)", () => {
    expect(recordHarvest({}, "2026-07-15", -1)).toEqual({});
  });
});

describe("logToggle", () => {
  it("credits today when a todo becomes done", () => {
    const log = logToggle({}, todo({ done: false }), dayA);
    expect(log).toEqual({ "2026-07-15": 1 });
  });

  it("debits the completion day when a todo becomes active — even across midnight", () => {
    // Completed on day A, un-completed on day B: day A must lose the credit.
    const start: HarvestLog = { "2026-07-15": 2 };
    const log = logToggle(start, todo({ done: true, completedAt: dayA }), dayB);
    expect(log).toEqual({ "2026-07-15": 1 });
  });

  it("does nothing when un-completing a todo that has no completedAt", () => {
    const start: HarvestLog = { "2026-07-15": 1 };
    expect(logToggle(start, todo({ done: true }), dayB)).toBe(start);
  });
});

describe("stageFor", () => {
  it("maps counts to stages", () => {
    expect(stageFor(0).name).toBe("seed");
    expect(stageFor(1).name).toBe("sprout");
    expect(stageFor(2).name).toBe("seedling");
    expect(stageFor(3).name).toBe("leafing");
    expect(stageFor(BLOOM_THRESHOLD).name).toBe("bloom");
    expect(stageFor(BLOOM_THRESHOLD).emoji).toBe("🌳");
  });
});
