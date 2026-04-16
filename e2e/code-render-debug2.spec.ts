import { test, expect } from 'playwright/test';

test('Check what renders on firefly page for anon user', async ({ page }) => {
  await page.goto('http://localhost:3000/lessons/firefly-festival-of-majuli');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // What level tab is active?
  const activeTab = page.locator('button[class*="bg-amber"], button[class*="ring-amber"]');
  const activeCount = await activeTab.count();
  console.log('Active tab buttons:', activeCount);
  if (activeCount > 0) {
    console.log('Active tab text:', await activeTab.first().textContent());
  }

  // Check all level tabs
  const allButtons = page.locator('button');
  const btnCount = await allButtons.count();
  for (let i = 0; i < Math.min(btnCount, 30); i++) {
    const text = await allButtons.nth(i).textContent();
    if (text && /level/i.test(text)) {
      console.log(`Button ${i}: "${text.trim().slice(0, 60)}"`);
    }
  }

  // Check for code blocks — could be <pre><code> or ArduinoPlayground textareas
  const textareas = page.locator('textarea');
  console.log('Textareas:', await textareas.count());

  const preBlocks = page.locator('pre');
  console.log('Pre blocks:', await preBlocks.count());

  // Check for Circuit headers specifically
  const circuits = page.locator('h3:has-text("Circuit"), [class*="font-bold"]:has-text("Circuit")');
  console.log('Circuit headers:', await circuits.count());
  for (let i = 0; i < Math.min(await circuits.count(), 5); i++) {
    const parent = circuits.nth(i).locator('..');
    const parentClass = await parent.getAttribute('class');
    console.log(`Circuit ${i+1} parent visible:`, await circuits.nth(i).isVisible());
  }
});
