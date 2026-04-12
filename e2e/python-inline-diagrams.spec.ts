import { test, expect } from 'playwright/test';

const LESSONS = [
  { idx: 0, label: 'Python Terminal', content: 'My name is Python' },
  { idx: 1, label: 'Labeled Boxes', content: '"Kavitha"' },
  { idx: 2, label: 'animals', content: '"elephant"' },
  { idx: 3, label: 'for animal', content: '"tiger"' },
  { idx: 4, label: 'if / elif / else', content: 'temperature' },
  { idx: 5, label: 'Function Call', content: 'greet' },
  { idx: 6, label: 'Numpy', content: 'temps' },
  { idx: 7, label: 'plt.plot', content: 'Honey' },
];

test('All 8 Python diagrams render inline with matching content', async ({ page }) => {
  await page.goto('http://localhost:3000/learn/python-basics', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  let found = 0;
  for (const l of LESSONS) {
    const btn = page.locator(`#lesson-${l.idx} button`).first();
    await btn.click();
    await page.waitForTimeout(800);
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(300);

    const labelEl = page.getByText(l.label, { exact: false }).first();
    const contentEl = page.getByText(l.content, { exact: false }).first();
    const labelVis = await labelEl.isVisible().catch(() => false);
    const contentVis = await contentEl.isVisible().catch(() => false);
    const ok = labelVis && contentVis;
    console.log(`Lesson ${l.idx + 1}: label="${l.label}" ${labelVis ? '✓' : '✗'} | content="${l.content}" ${contentVis ? '✓' : '✗'}`);
    if (ok) found++;
  }

  console.log(`\n${found}/${LESSONS.length} diagrams with correct content`);
  expect(found).toBe(LESSONS.length);
});
