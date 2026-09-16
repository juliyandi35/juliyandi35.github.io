import { test, expect } from "@playwright/test";

test.describe("Portfolio smoke test", () => {
  test("loads the homepage with hero content", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Turning research methods into working systems.",
    );
  });

  test("navigates to the Project Atlas via the primary nav", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Projects" }).click();
    await expect(page.locator("#atlas")).toBeInViewport();
  });

  test("filtering the atlas by method family updates the result count and URL", async ({ page }) => {
    await page.goto("/#atlas");
    const methodSelect = page.getByLabel("Method family");
    // `allTextContents()` reads immediately, with no retry — wait for the
    // real option list (13 families + "All") to be attached first, so this
    // doesn't race React hydration and see only the initial "All" option.
    await expect(methodSelect.locator("option").nth(1)).toBeAttached();
    const options = await methodSelect.locator("option").allTextContents();
    const targetMethod = options.find((o) => o !== "All");
    expect(targetMethod).toBeTruthy();

    await methodSelect.selectOption({ label: targetMethod! });
    await expect(page).toHaveURL(/method=/);
    // Anchored, no trailing "shown": the sr-only aria-live announcer next to
    // this text repeats it with "shown" appended, which `/of 301 projects/`
    // alone also matches — a strict-mode violation (2 elements).
    await expect(page.getByText(/^\d+ of 301 projects$/)).toBeVisible();
  });

  test("a project card links to its real GitHub repository", async ({ page }) => {
    await page.goto("/#atlas");
    const firstProjectLink = page.locator('#atlas a[href^="https://github.com/juliyandi35/"]').first();
    await expect(firstProjectLink).toBeVisible();
    const href = await firstProjectLink.getAttribute("href");
    expect(href).toMatch(/^https:\/\/github\.com\/juliyandi35\//);
  });

  test("clearing filters resets the atlas", async ({ page }) => {
    await page.goto("/?method=Regresi%2C+korelasi+%26+ekonometrika#atlas");
    await page.getByRole("button", { name: "Clear all filters" }).click();
    await expect(page).not.toHaveURL(/method=/);
  });

  /** Scrolls far enough into the graph stage that the camera has arrived at the core. */
  async function arriveAtCore(page: import("@playwright/test").Page) {
    await page.goto("/#graph");
    // Trajectory's pinned ScrollTrigger adds its pin-spacer asynchronously
    // (after a dynamic `import("gsap")`), which can grow the page *after*
    // the browser's one-time hash-jump already landed — leaving #graph
    // further down than the jump targeted. Re-scrolling it into view once
    // things settle re-targets its current position instead of trusting
    // that stale jump.
    await page.locator("#graph").scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 1.2));
  }

  test("the graph stage offers every application as a real, keyboard-operable control", async ({ page }) => {
    await arriveAtCore(page);

    const graphNav = page.getByRole("navigation", { name: "Applications in the project graph" });
    await expect(graphNav).toBeVisible();

    // One button per application token in the manifest.
    const buttons = graphNav.getByRole("button");
    await expect(buttons).toHaveCount(16);

    // The largest cluster is listed first and toggles its pressed state,
    // which is what drives the camera in the 3D scene.
    const first = buttons.first();
    await expect(first).toHaveAttribute("aria-pressed", "false");
    await first.click();
    await expect(first).toHaveAttribute("aria-pressed", "true");
    await expect(graphNav.getByRole("button", { name: "Show the whole graph" })).toBeVisible();
  });

  test("the graph's controls are not focusable before the visitor arrives at the core", async ({ page }) => {
    await page.goto("/");
    // A plain CSS locator, not getByRole: `visibility: hidden` deliberately
    // removes this nav from the accessibility tree (that's the point — out
    // of the tab order), which also makes it unresolvable by role. Checking
    // raw DOM attachment needs a locator that doesn't filter on that tree.
    const graphNav = page.locator('nav[aria-label="Applications in the project graph"]');
    await expect(graphNav).toBeAttached();
    await expect(graphNav).not.toBeVisible();
  });

  test("an application focused in the graph can be listed in the atlas", async ({ page }) => {
    await arriveAtCore(page);

    const graphNav = page.getByRole("navigation", { name: "Applications in the project graph" });
    await graphNav.getByRole("button").first().click();

    await page.getByRole("link", { name: "List them in the atlas" }).click();
    await expect(page).toHaveURL(/app=/);
    await expect(page.getByText(/^\d+ of 301 projects$/)).toBeVisible();
  });
});
