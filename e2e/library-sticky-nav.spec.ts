import { test, expect } from 'playwright/test';

test('Floating nav appears when scrolled deep into guide', async ({ page }) => {
  // Sign in
  await page.goto('http://localhost:3000/auth', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.locator('input[type="email"]').first().fill('mintu.bora@gmail.com');
  await page.locator('input[type="password"]').first().fill('Password@1');
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(3000);

  await page.goto('http://localhost:3000/library', { waitUntil: 'networkidle' });
  await page.waitForSelector('h1:has-text("Reference Library")', { timeout: 10000 });

  // Expand Light & Color
  const card = page.locator('#ref-light-and-color');
  await card.scrollIntoViewIfNeeded();
  await card.locator('[role="button"]').click();
  await page.waitForTimeout(2000);

  const sections = card.locator('.scroll-mt-20');
  const count = await sections.count();
  console.log('Sections:', count);

  // Scroll to section 4
  await sections.nth(Math.min(3, count - 1)).scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // The floating nav should now be visible (fixed bottom-right)
  const floatingNav = page.locator('.fixed.bottom-6');
  const isVisible = await floatingNav.isVisible().catch(() => false);
  console.log('Floating nav visible:', isVisible);

  // Screenshot showing the floating nav
  await page.screenshot({ path: '/tmp/floating-nav.png' });

  // Check for the amber back-to-top button
  const backBtn = page.locator('.fixed.bottom-6 button');
  const btnVisible = await backBtn.isVisible().catch(() => false);
  console.log('Back to top button visible:', btnVisible);

  expect(isVisible, 'Floating nav must appear when scrolled deep into guide').toBe(true);
  expect(btnVisible, 'Back to top button must be visible').toBe(true);
});
