import { test, expect } from 'playwright/test';

const BASE = 'http://localhost:3000';

test.describe('check for console errors', () => {
  for (const path of ['/', '/lessons', '/lessons/orange-sunsets-assam', '/plan', '/programs', '/capstones', '/certificate', '/playground', '/library']) {
    test(`no JS errors on ${path}`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(`${err.name}: ${err.message}`));
      page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

      await page.goto(`${BASE}${path}`);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      const jsErrors = errors.filter(e =>
        !e.includes('favicon') &&
        !e.includes('hydration') &&
        !e.includes('supabase') &&
        !e.includes('net::ERR') &&
        !e.includes('Failed to load resource')
      );
      if (jsErrors.length > 0) {
        console.log(`JS errors on ${path}:`, jsErrors);
      }
      expect(jsErrors.length).toBe(0);
    });
  }
});
