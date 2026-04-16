import { test, expect } from 'playwright/test';

test('Mathematics filter shows cross-tagged guides like ML', async ({ page }) => {
  await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle' });
  await page.waitForSelector('h1:has-text("Reference Library")', { timeout: 10000 });

  // Click Mathematics category pill
  const mathPill = page.locator('button:has-text("Mathematics")');
  await mathPill.click();
  await page.waitForTimeout(500);

  // Get all visible guide slugs
  const cards = page.locator('[id^="ref-"]');
  const count = await cards.count();
  const slugs: string[] = [];
  for (let i = 0; i < count; i++) {
    slugs.push((await cards.nth(i).getAttribute('id'))?.replace('ref-', '') || '');
  }
  console.log(`Math filter: ${count} guides`);
  console.log('Includes ML:', slugs.includes('machine-learning'));
  console.log('Includes signal-processing:', slugs.includes('signal-processing'));
  console.log('Includes statistics-basics:', slugs.includes('statistics-basics'));
  console.log('Includes algorithms:', slugs.includes('algorithms-data-structures'));

  expect(slugs).toContain('machine-learning');
  expect(slugs).toContain('statistics-basics');
  expect(slugs).toContain('algorithms-data-structures');
});

test('Search "gaussian" with Math filter finds ML', async ({ page }) => {
  await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle' });
  await page.waitForSelector('h1:has-text("Reference Library")', { timeout: 10000 });

  // Select Math filter
  const mathPill = page.locator('button:has-text("Mathematics")');
  await mathPill.click();
  await page.waitForTimeout(300);

  // Search for gaussian
  const searchInput = page.locator('input[placeholder*="Search"]');
  await searchInput.fill('gaussian');
  await page.waitForTimeout(500);

  const cards = page.locator('[id^="ref-"]');
  const count = await cards.count();
  const slugs: string[] = [];
  for (let i = 0; i < count; i++) {
    slugs.push((await cards.nth(i).getAttribute('id'))?.replace('ref-', '') || '');
  }
  console.log(`"gaussian" + Math filter: ${count} results`, slugs);

  expect(slugs).toContain('machine-learning');
  expect(slugs).toContain('statistics-and-distributions');
});

test('Category-filtered guide expands with content', async ({ page }) => {
  await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle' });
  await page.waitForSelector('h1:has-text("Reference Library")', { timeout: 10000 });

  // Select Math filter
  const mathPill = page.locator('button:has-text("Mathematics")');
  await mathPill.click();
  await page.waitForTimeout(300);

  // Click ML guide
  const mlCard = page.locator('#ref-machine-learning');
  await mlCard.scrollIntoViewIfNeeded();
  await mlCard.locator('[role="button"]').click();
  await page.waitForTimeout(1500);

  // Verify content loaded
  const content = mlCard.locator('.px-4.pb-5');
  const textLen = await content.isVisible() ? (await content.innerText()).length : 0;
  console.log(`ML guide under Math filter: ${textLen} chars`);

  expect(textLen).toBeGreaterThan(100);
});
