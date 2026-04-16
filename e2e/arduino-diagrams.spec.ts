import { test, expect } from 'playwright/test';

const DIAGRAM_TITLES = [
  'Your First Circuit',                    // Lesson 1
  'Variables Control Everything',          // Lesson 2
  'Multiple LEDs in Sequence',             // Lesson 3
  'Reading Input',                         // Lesson 4
  'Analog Output with PWM',               // Lesson 5
  'Talking to the Computer',               // Lesson 6
  'Frequency Explorer',                    // Lesson 7
];

test('All 7 Arduino Basics lessons render with interactive diagrams', async ({ page }) => {
  await page.goto('http://localhost:3000/learn/arduino-basics', { waitUntil: 'networkidle' });
  await page.waitForSelector('h1:has-text("Arduino Basics")', { timeout: 10000 });

  const gridButtons = page.locator('.aspect-square');
  await expect(gridButtons).toHaveCount(7, { timeout: 10000 });

  for (let i = 0; i < 7; i++) {
    await gridButtons.nth(i).click();
    await page.waitForTimeout(500);

    // Verify the diagram rendered by checking for its heading
    const diagramTitle = page.locator(`text=${DIAGRAM_TITLES[i]}`).first();
    await expect(diagramTitle).toBeVisible({ timeout: 5000 });

    // Scroll to it and screenshot
    await diagramTitle.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: `/tmp/arduino-diagram-${i + 1}.png` });
    console.log(`Lesson ${i + 1} "${DIAGRAM_TITLES[i]}" ✓`);
  }
});
