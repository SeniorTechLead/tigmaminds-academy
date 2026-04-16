import { test, expect } from 'playwright/test';

const BASE = 'http://localhost:3000';

test.describe('client-side navigation', () => {
  test('nav bar links work: Home → Lessons → detail → back', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');

    // Click "Lessons" in the nav bar
    await page.locator('nav a[href="/lessons"], header a[href="/lessons"]').first().click();
    await page.waitForURL('**/lessons', { timeout: 10000 });
    await expect(page.getByRole('heading', { name: 'All Lessons' })).toBeVisible({ timeout: 10000 });

    // Click first lesson card
    const firstCard = page.locator('a[href^="/lessons/"]').first();
    const href = await firstCard.getAttribute('href');
    await firstCard.click();
    await page.waitForURL(`**${href}`, { timeout: 10000 });
    // Lesson detail should render some content
    await page.waitForTimeout(2000);
    const body = await page.textContent('body');
    expect(body!.length).toBeGreaterThan(200);
  });

  test('nav bar links: Home → Programs', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.locator('nav a[href="/programs"], header a[href="/programs"]').first().click();
    await page.waitForURL('**/programs', { timeout: 10000 });
    const body = await page.textContent('body');
    expect(body).toMatch(/Bootcamp|Curriculum/);
  });

  test('nav bar links: Home → Library', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.locator('nav a[href="/library"], header a[href="/library"]').first().click();
    await page.waitForURL('**/library', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    const body = await page.textContent('body');
    expect(body).toMatch(/Reference|Library/);
  });

  test('nav bar links: Home → Playground', async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState('networkidle');
    await page.locator('nav a[href="/playground"], header a[href="/playground"]').first().click();
    await page.waitForURL('**/playground', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    const body = await page.textContent('body');
    expect(body).toMatch(/problem|challenge|playground/i);
  });

  test('lessons page → plan link', async ({ page }) => {
    await page.goto(`${BASE}/lessons`);
    await page.waitForLoadState('networkidle');
    const planLink = page.locator('a[href="/plan"]').first();
    if (await planLink.isVisible()) {
      await planLink.click();
      await page.waitForURL('**/plan', { timeout: 10000 });
      const body = await page.textContent('body');
      expect(body).toMatch(/plan|lesson/i);
    }
  });
});
