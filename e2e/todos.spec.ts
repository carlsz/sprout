import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  // Start each run from a clean slate.
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("plant, complete, edit, delete, and persist", async ({ page }) => {
  const input = page.getByLabel("New task");

  // Empty state.
  await expect(page.getByText("Nothing seeded yet")).toBeVisible();

  // Seed two todos with Enter (real keyboard submit).
  await input.fill("Water the ferns");
  await input.press("Enter");
  await input.fill("Repot the basil");
  await input.press("Enter");

  // Newest-first ordering.
  const items = page.getByRole("listitem");
  await expect(items).toHaveCount(2);
  await expect(items.first()).toContainText("Repot the basil");

  // Garden starts at the seed stage.
  await expect(
    page.getByText("Harvest a task to start growing."),
  ).toBeVisible();

  // Complete one — the plant grows and today's harvest is counted.
  await page
    .getByRole("checkbox", { name: 'Mark "Water the ferns" done' })
    .check();
  await expect(page.getByText("1 task growing")).toBeVisible();
  await expect(page.getByText("1 harvested today")).toBeVisible();

  // Edit one (open editor, retype, save on Enter).
  // exact:true — otherwise the name substring-matches the Delete button too.
  await page
    .getByRole("button", { name: "Repot the basil", exact: true })
    .click();
  const editor = page.getByLabel("Edit task");
  await editor.fill("Repot the basil in fresh soil");
  await editor.press("Enter");
  await expect(
    page.getByRole("button", {
      name: "Repot the basil in fresh soil",
      exact: true,
    }),
  ).toBeVisible();

  // Delete one via the two-step confirm.
  await page
    .getByRole("button", { name: 'Delete "Repot the basil in fresh soil"' })
    .click();
  await page.getByRole("button", { name: "Remove" }).click();
  await expect(items).toHaveCount(1);

  // Persist across a reload.
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Water the ferns", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("checkbox", { name: 'Mark "Water the ferns" active' }),
  ).toBeChecked();
  await expect(items).toHaveCount(1);
  // The harvest survived the reload too.
  await expect(page.getByText("1 harvested today")).toBeVisible();
});
