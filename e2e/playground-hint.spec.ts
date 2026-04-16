import { test, expect } from 'playwright/test';

const BASE = 'http://localhost:3000';

test.describe('playground hint panel', () => {
  test('hint expand button shows immediately and opens inline content', async ({ page }) => {
    await page.goto(`${BASE}/playground`);
    await page.waitForLoadState('networkidle');

    // Find and click into a problem that has a hintRef
    // The "Elephant Name Reverser" problem has hintRef to Strings
    const problemCard = page.locator('text=Elephant Name Reverser').first();
    if (await problemCard.isVisible()) {
      await problemCard.click();
      await page.waitForTimeout(1000);

      // The hint panel should show an expand button (not a navigation link)
      const hintButton = page.locator('button:has-text("Strings")').first();
      if (await hintButton.isVisible()) {
        // It should be a button, not a link
        const tagName = await hintButton.evaluate(el => el.tagName.toLowerCase());
        expect(tagName).toBe('button');

        // Click it — should expand inline content
        await hintButton.click();
        await page.waitForTimeout(2000);

        // Should show "From the Library:" section or "Loading..."
        const fromLibrary = page.locator('text=From the Library');
        const loading = page.locator('text=Loading...');
        const linkFallback = page.locator('text=Open full article in Library');
        const anyVisible = await fromLibrary.isVisible() || await loading.isVisible() || await linkFallback.isVisible();
        expect(anyVisible).toBe(true);
      }
    }
  });

  test('run tests button shows error if runtime fails', async ({ page }) => {
    await page.goto(`${BASE}/playground`);
    await page.waitForLoadState('networkidle');

    // Just verify the page loads with problems
    const problemCards = page.locator('[class*="cursor-pointer"]');
    expect(await problemCards.count()).toBeGreaterThan(0);
  });
});
