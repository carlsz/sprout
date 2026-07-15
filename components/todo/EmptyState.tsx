/** Branded empty state — shown when there are no todos yet. */
export function EmptyState() {
  return (
    <div className="rounded-xl bg-canvas-soft p-12 text-center">
      <p className="text-4xl" aria-hidden>
        🌱
      </p>
      <p className="mt-3 font-display text-xl font-extrabold text-ink">
        Nothing seeded yet
      </p>
      <p className="mt-1 text-body">
        Seed your first task below to get growing.
      </p>
    </div>
  );
}
