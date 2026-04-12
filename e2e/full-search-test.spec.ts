import { test, expect } from 'playwright/test';

test('Full search flow - Rayleigh', async ({ page }) => {
  // 1. Load page
  await page.goto('http://localhost:3000/library');
  await page.waitForTimeout(3000);
  
  // 2. Screenshot before search
  await page.screenshot({ path: '/tmp/01-before-search.png' });
  
  // 3. Type Rayleigh
  const input = page.locator('input[placeholder*="Search"]');
  await input.fill('Rayleigh');
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/tmp/02-after-typing.png' });
  
  // 4. Check results exist
  const cards = page.locator('[id^="ref-"]');
  const count = await cards.count();
  console.log('Cards visible:', count);
  
  // 5. Click first card
  if (count > 0) {
    await cards.first().click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: '/tmp/03-after-expand.png' });
    
    // 6. Check for mark elements
    const marks = await page.evaluate(() => {
      const all = document.querySelectorAll('mark');
      return { count: all.length, samples: Array.from(all).slice(0, 5).map(m => ({ text: m.textContent, visible: m.offsetHeight > 0, bgColor: getComputedStyle(m).backgroundColor })) };
    });
    console.log('Marks:', JSON.stringify(marks, null, 2));
    
    // 7. Scroll to first mark if exists
    if (marks.count > 0) {
      await page.evaluate(() => {
        const m = document.querySelector('mark');
        if (m) m.scrollIntoView({ block: 'center' });
      });
      await page.waitForTimeout(500);
      await page.screenshot({ path: '/tmp/04-at-highlight.png' });
    }
  }
  
  // 8. Check for console errors
  const logs: string[] = [];
  page.on('console', msg => { if (msg.type() === 'error') logs.push(msg.text()); });
  await page.waitForTimeout(500);
  console.log('Console errors:', logs.length ? logs : 'none');
});
