import { test, expect } from 'playwright/test';

test('FireflyLevel4 Arduino code blocks render with multiple lines', async ({ page }) => {
  await page.goto('http://localhost:3000/lessons/firefly-festival-of-majuli');
  await page.waitForLoadState('networkidle');

  // Click Level 4 tab
  const level4Tab = page.locator('button:has-text("Level 4")').first();
  await level4Tab.click();
  await page.waitForTimeout(2000);

  // Find the first code editor textarea (Arduino playground)
  const textarea = page.locator('textarea').first();
  await expect(textarea).toBeVisible({ timeout: 10000 });

  const code = await textarea.inputValue();
  const lineCount = code.split('\n').length;

  // Code should have many lines, not be squashed into 1
  console.log(`Code lines: ${lineCount}`);
  console.log(`First 200 chars: ${code.slice(0, 200)}`);
  expect(lineCount).toBeGreaterThan(10);

  // Should NOT contain literal \\n sequences
  expect(code).not.toContain('\\n');
});
