import { test } from 'playwright/test';

test('Matching activity shows visual explanation on match', async ({ page }) => {
  await page.goto('http://localhost:3000/auth');
  await page.waitForTimeout(2000);
  await page.fill('input[type="email"]', 'mintu.bora@gmail.com');
  await page.fill('input[type="password"]', 'Password@1');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  await page.goto('http://localhost:3000/library/matrices-and-vectors');
  await page.waitForTimeout(4000);

  // Scroll to the matching activity
  const matchTitle = page.getByText('Match the matrix to its transformation').first();
  if (await matchTitle.count() > 0) {
    await matchTitle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/matching-before.png' });

    // Click the rotation matrix on the left
    const rotButton = page.getByText('[cos θ, −sin θ; sin θ, cos θ]').first();
    await rotButton.click();
    await page.waitForTimeout(300);

    // Click the correct match on the right
    const rotMatch = page.getByText('Rotation by angle θ around the origin').first();
    await rotMatch.click();
    await page.waitForTimeout(500);

    await page.screenshot({ path: '/tmp/matching-after-match.png' });

    // Check if explanation appeared
    const explanation = page.getByText('east becomes north');
    console.log('Explanation visible:', await explanation.count() > 0);
  } else {
    console.log('Matching activity not found');
  }
});
