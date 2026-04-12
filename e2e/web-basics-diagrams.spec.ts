import { test, expect } from 'playwright/test';

const DIAGRAM_LABELS = [
  { lesson: 0, text: 'HTML Document Tree' },
  { lesson: 1, text: 'Page Structure' },
  { lesson: 2, text: 'CSS Box Model' },
  { lesson: 3, text: 'Flexbox Playground' },
  { lesson: 4, text: 'JavaScript' },
  { lesson: 5, text: 'Event Listener Flow' },
  { lesson: 6, text: 'One Component = Three Layers' },
  { lesson: 7, text: 'Todo App' },
];

test('All 8 Web Basics diagrams render in lessons', async ({ page }) => {
  await page.goto('http://localhost:3000/learn/web-basics', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  let found = 0;
  for (const d of DIAGRAM_LABELS) {
    // Click the lesson card to expand it (lesson number buttons are 1-indexed)
    const lessonBtn = page.locator('button').filter({ has: page.locator(`text="${d.lesson + 1}"`) }).first();
    await lessonBtn.click();
    await page.waitForTimeout(800);

    // Scroll down to make diagram visible
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);

    const el = page.getByText(d.text, { exact: false }).first();
    const visible = await el.isVisible().catch(() => false);
    console.log(`Lesson ${d.lesson + 1} - "${d.text}": ${visible ? 'VISIBLE ✓' : 'NOT VISIBLE ✗'}`);
    if (visible) found++;
  }

  await page.screenshot({ path: '/tmp/web-basics-diagrams.png', fullPage: true });
  console.log(`\n${found}/${DIAGRAM_LABELS.length} diagrams visible`);
  expect(found).toBe(DIAGRAM_LABELS.length);
});
