import { Card } from "@/components/ui/Card";
import { BLOOM_THRESHOLD, stageFor } from "@/lib/harvest";

type GardenProps = {
  /** Tasks harvested today. 0 on the server + first client render (pre-hydration). */
  count: number;
};

/** Today's plant — grows through stages as tasks are harvested (completed) today. */
export function Garden({ count }: GardenProps) {
  const stage = stageFor(count);
  const remaining = Math.max(0, BLOOM_THRESHOLD - count);
  const pct = Math.min(100, (count / BLOOM_THRESHOLD) * 100);

  const caption =
    count === 0
      ? "Harvest a task to start growing."
      : remaining === 0
        ? "In full bloom 🌳"
        : `${remaining} more to bloom`;

  return (
    <Card className="flex items-center gap-4">
      <span
        className="text-5xl leading-none transition-transform duration-300"
        role="img"
        aria-label={`Today's plant: ${stage.name}`}
      >
        {stage.emoji}
      </span>

      <div className="min-w-0 flex-1">
        <p className="font-display text-lg font-extrabold text-ink">
          {count === 0 ? "Your garden" : `${count} harvested today`}
        </p>
        <p className="mt-0.5 text-sm text-body">{caption}</p>

        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-canvas-soft"
          role="progressbar"
          aria-valuenow={count}
          aria-valuemin={0}
          aria-valuemax={BLOOM_THRESHOLD}
          aria-label="Progress to full bloom"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
