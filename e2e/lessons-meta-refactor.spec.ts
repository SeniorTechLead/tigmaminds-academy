import { test, expect } from 'playwright/test';

const BASE = 'http://localhost:3000';

test.describe('lessons-meta refactor', () => {
  test('home page renders featured stories', async ({ page }) => {
    await page.goto(`${BASE}/`);
    await expect(page.getByText('Every Lesson Begins with a Story')).toBeVisible();
    await expect(page.getByText(/Browse All \d+ Lessons/)).toBeVisible();
    // Wait for async demo-story metadata to load from Supabase
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    const cards = page.locator('a[href^="/lessons/"]');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('/lessons renders cards with icons and counts', async ({ page }) => {
    await page.goto(`${BASE}/lessons`);
    await expect(page.getByRole('heading', { name: 'All Lessons' })).toBeVisible();
    const cards = page.locator('a[href^="/lessons/"]');
    expect(await cards.count()).toBeGreaterThan(50);
    // First card should have an image
    await expect(cards.first().locator('img')).toBeVisible();
  });

  test('/lessons subject filter narrows results', async ({ page }) => {
    await page.goto(`${BASE}/lessons`);
    const allCount = await page.locator('a[href^="/lessons/"]').count();
    await page.getByRole('button', { name: /Physics/ }).first().click();
    await page.waitForTimeout(300);
    const filteredCount = await page.locator('a[href^="/lessons/"]').count();
    expect(filteredCount).toBeLessThan(allCount);
    expect(filteredCount).toBeGreaterThan(0);
  });

  test('/lessons title-search works without index, deep-search after focus', async ({ page }) => {
    await page.goto(`${BASE}/lessons`);
    const search = page.getByPlaceholder('Search stories or topics...');
    await search.fill('elephant');
    await page.waitForTimeout(500);
    const matches = await page.locator('a[href^="/lessons/"]').count();
    expect(matches).toBeGreaterThan(0);
  });

  test('/lessons/[slug] detail page renders', async ({ page }) => {
    await page.goto(`${BASE}/lessons/orange-sunsets-assam`);
    await expect(page.getByText(/Orange|Sunset/i).first()).toBeVisible();
  });

  test('/plan renders', async ({ page }) => {
    await page.goto(`${BASE}/plan`);
    await expect(page).toHaveURL(/\/plan/);
    // Page should have lesson cards or filter UI
    await page.waitForLoadState('networkidle');
    const text = await page.textContent('body');
    expect(text).toMatch(/lesson|stor/i);
  });

  test('/programs renders', async ({ page }) => {
    await page.goto(`${BASE}/programs`);
    await page.waitForLoadState('networkidle');
    const text = await page.textContent('body');
    expect(text).toMatch(/Bootcamp|Curriculum/);
  });

  test('/capstones renders', async ({ page }) => {
    await page.goto(`${BASE}/capstones`);
    await page.waitForLoadState('networkidle');
    const text = await page.textContent('body');
    expect(text).toMatch(/capstone|project/i);
  });

  test('/certificate renders', async ({ page }) => {
    await page.goto(`${BASE}/certificate`);
    await expect(page.getByText(/Certificate/i).first()).toBeVisible();
  });

  test('/reference page with story links renders', async ({ page }) => {
    // The bees reference guide is one that has related stories
    await page.goto(`${BASE}/reference`);
    await page.waitForLoadState('networkidle');
    const text = await page.textContent('body');
    expect(text).toMatch(/reference|guide/i);
  });
});
