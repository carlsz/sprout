// Pure, framework-free logic for the daily harvest log and plant growth.
// All time-dependent inputs are passed in (never read from the clock here) so
// every function is deterministic and unit-testable across day boundaries.

import type { Todo } from "@/lib/todos";

/** date key `YYYY-MM-DD` (local) → number of tasks harvested that day. */
export type HarvestLog = Record<string, number>;

/** Harvests in a day needed to reach full bloom. */
export const BLOOM_THRESHOLD = 5;

/** Local calendar date of an epoch-ms timestamp, as `YYYY-MM-DD`. */
export function localDate(ms: number): string {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Add `delta` to a day's count, pruning entries that fall to zero. */
export function recordHarvest(
  log: HarvestLog,
  dateKey: string,
  delta: number,
): HarvestLog {
  const next = { ...log };
  const value = (next[dateKey] ?? 0) + delta;
  if (value > 0) next[dateKey] = value;
  else delete next[dateKey];
  return next;
}

/**
 * Update the log for a toggle of `todo` (its state BEFORE the flip) at `now`:
 * becoming done credits today; becoming active debits the day it was completed.
 */
export function logToggle(
  log: HarvestLog,
  todo: Todo,
  now: number,
): HarvestLog {
  const becomingDone = !todo.done;
  if (becomingDone) return recordHarvest(log, localDate(now), 1);
  if (todo.completedAt != null)
    return recordHarvest(log, localDate(todo.completedAt), -1);
  return log;
}

export type Stage = { emoji: string; name: string };

/** Plant stage for a day's harvest count. */
export function stageFor(count: number): Stage {
  if (count >= BLOOM_THRESHOLD) return { emoji: "🌳", name: "bloom" };
  if (count >= 3) return { emoji: "🪴", name: "leafing" };
  if (count >= 2) return { emoji: "🌿", name: "seedling" };
  if (count >= 1) return { emoji: "🌱", name: "sprout" };
  return { emoji: "🌰", name: "seed" };
}
