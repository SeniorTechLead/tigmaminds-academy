import { test, expect } from 'playwright/test';

const COURSES = [
  { url: '/learn/web-basics', name: 'Web Basics' },
  { url: '/learn/arduino-basics', name: 'Arduino Basics' },
  { url: '/learn/python-basics', name: 'Python Basics' },
  { url: '/learn/sql-basics', name: 'SQL Basics' },
];

for (const course of COURSES) {
  test(`${course.name}: lesson 4 shows sign-up gate for anon user`, async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`http://localhost:3000${course.url}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Click lesson 4
    const btn = page.locator('#lesson-3 button').first();
    await btn.click();
    await page.waitForTimeout(1000);
    await page.evaluate(() => window.scrollBy(0, 400));
    await page.waitForTimeout(500);

    // Check for Google sign-in button inside lesson 4
    const googleBtn = page.locator('#lesson-3').getByText('Continue with Google', { exact: false });
    const found = await googleBtn.count();
    console.log(`${course.name}: Google sign-in button in lesson 4: ${found > 0 ? 'FOUND ✓' : 'NOT FOUND ✗'}`);
    expect(found).toBeGreaterThan(0);

    await context.close();
  });
}
