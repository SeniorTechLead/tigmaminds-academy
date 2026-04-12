import { test, expect } from 'playwright/test';

const COURSES = [
  { url: '/learn/web-basics', name: 'Web Basics' },
  { url: '/learn/arduino-basics', name: 'Arduino Basics' },
  { url: '/learn/python-basics', name: 'Python Basics' },
  { url: '/learn/sql-basics', name: 'SQL Basics' },
];

for (const course of COURSES) {
  test(`${course.name}: subtitle not truncated and scroll to top on expand`, async ({ page }) => {
    await page.goto(`http://localhost:3000${course.url}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Bug 1: Check subtitle text is NOT truncated (no truncate class, no ellipsis clipping)
    const firstSubtitle = page.locator('.space-y-6 button p.text-sm.text-gray-500').first();
    const hasClass = await firstSubtitle.evaluate(el => el.classList.contains('truncate'));
    console.log(`${course.name} - truncate class: ${hasClass ? 'STILL PRESENT ✗' : 'REMOVED ✓'}`);
    expect(hasClass, 'truncate class should be removed').toBe(false);

    // Bug 2: Click lesson 1, check scroll position puts the lesson at the top of viewport
    const lessonDiv = page.locator('#lesson-0');
    await lessonDiv.locator('button').first().click();
    await page.waitForTimeout(500);

    const rect = await lessonDiv.boundingBox();
    console.log(`${course.name} - lesson-0 top after click: ${rect?.y?.toFixed(0)}px`);
    // The lesson should be near the top of the viewport (within ~150px for header)
    expect(rect?.y).toBeLessThan(150);
  });
}
