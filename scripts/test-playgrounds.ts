/**
 * Automated UI test for all interactive playgrounds.
 * Run: npx tsx scripts/test-playgrounds.ts
 *
 * Requires: dev server running on localhost:5174
 * Requires: playwright installed
 */

import { chromium } from 'playwright';

interface TestResult {
  story: string;
  test: string;
  passed: boolean;
  detail: string;
}

const results: TestResult[] = [];

function pass(story: string, test: string, detail: string) {
  results.push({ story, test, passed: true, detail });
  console.log(`  ✓ ${test}: ${detail}`);
}

function fail(story: string, test: string, detail: string) {
  results.push({ story, test, passed: false, detail });
  console.log(`  ✗ ${test}: ${detail}`);
}

async function testArduinoCircuits(page: any, story: string, expectedCircuits: number) {
  const runBtns = await page.locator('button:has-text("Upload & Run")').all();

  if (runBtns.length !== expectedCircuits) {
    fail(story, 'circuit count', `Expected ${expectedCircuits} circuits, found ${runBtns.length}`);
    return;
  }
  pass(story, 'circuit count', `${runBtns.length} circuits found`);

  for (let i = 0; i < runBtns.length; i++) {
    const circuitNum = i + 1;
    try {
      await runBtns[i].scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await runBtns[i].click();
      await page.waitForTimeout(2000);

      // Check serial output
      const serialTexts = await page.evaluate(() => {
        const pres = document.querySelectorAll('pre');
        const texts: string[] = [];
        pres.forEach((pre: any) => {
          const t = pre.textContent;
          if (t && t.length > 10 && !t.includes('waiting for output')) texts.push(t.substring(0, 80));
        });
        return texts;
      });

      if (serialTexts.length > 0) {
        pass(story, `circuit ${circuitNum} serial`, serialTexts[serialTexts.length - 1].substring(0, 60));
      } else {
        fail(story, `circuit ${circuitNum} serial`, 'No serial output detected');
      }

      // Check LED glow (for circuits with LEDs)
      const glowingLeds = await page.evaluate(() => {
        const els = document.querySelectorAll('.rounded-full');
        let count = 0;
        els.forEach((el: any) => {
          const bg = el.style?.backgroundColor;
          if (bg && bg.includes('34, 197, 94') && !bg.endsWith(', 0)')) count++;
        });
        return count;
      });

      // Check if this circuit's code actually uses analogWrite/digitalWrite
      const codeArea = await page.locator('textarea').nth(i);
      const codeText = await codeArea.inputValue().catch(() => '');
      const hasLedWrites = /analogWrite|digitalWrite/.test(codeText);
      const hasNonZeroWrite = /analogWrite\(\d+,\s*(?!0\b)\d+|analogWrite\(\d+,\s*random|digitalWrite\(\d+,\s*HIGH/.test(codeText);

      if (!hasLedWrites || !hasNonZeroWrite) {
        pass(story, `circuit ${circuitNum} LEDs`, 'No LED writes in code (serial-only lesson)');
      } else if (glowingLeds > 0) {
        pass(story, `circuit ${circuitNum} LEDs`, `${glowingLeds} LED(s) glowing`);
      } else {
        // Might be timing — LED could be at brightness 0 in a blink cycle
        // Take a second sample
        await page.waitForTimeout(500);
        const retry = await page.evaluate(() => {
          const els = document.querySelectorAll('.rounded-full');
          let count = 0;
          els.forEach((el: any) => {
            const bg = el.style?.backgroundColor;
            if (bg && bg.includes('34, 197, 94') && !bg.endsWith(', 0)')) count++;
          });
          return count;
        });
        if (retry > 0) {
          pass(story, `circuit ${circuitNum} LEDs`, `${retry} LED(s) glowing (on retry)`);
        } else {
          fail(story, `circuit ${circuitNum} LEDs`, 'No glowing LEDs after 2 attempts (may be timing)');
        }
      }

      // Stop the circuit
      const stopBtns = await page.locator('button:has-text("Stop")').all();
      for (const btn of stopBtns) {
        if (await btn.isVisible()) { await btn.click(); break; }
      }
      await page.waitForTimeout(300);
    } catch (err: any) {
      fail(story, `circuit ${circuitNum}`, `Error: ${err.message.substring(0, 100)}`);
    }
  }
}

async function testPyodideLessons(page: any, story: string) {
  // Check if Load Python button exists
  const loadBtn = await page.locator('button:has-text("Load Python")').first();
  if (await loadBtn.isVisible()) {
    pass(story, 'python loader', 'Load Python button found');
  } else {
    fail(story, 'python loader', 'No Load Python button');
  }
}

async function testHtmlPlayground(page: any, story: string) {
  const iframes = await page.locator('iframe[title="Preview"]').all();
  if (iframes.length > 0) {
    pass(story, 'html playground', `${iframes.length} live preview iframe(s) found`);
  } else {
    fail(story, 'html playground', 'No preview iframes');
  }
}

async function testLevelTabs(page: any, story: string) {
  const l1btn = await page.locator('button:has-text("Level 1: Explorer")');
  const l2btn = await page.locator('button:has-text("Level 2: Builder")');
  const l3btn = await page.locator('button:has-text("Level 3: Engineer")');

  const l1 = await l1btn.isVisible().catch(() => false);
  const l2 = await l2btn.isVisible().catch(() => false);
  const l3 = await l3btn.isVisible().catch(() => false);

  if (l1 && l2 && l3) {
    pass(story, 'level tabs', 'All 3 level tabs visible');
  } else {
    fail(story, 'level tabs', `L1:${l1} L2:${l2} L3:${l3}`);
  }
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const stories = [
    { slug: 'girl-who-spoke-to-elephants', name: 'Elephant', type: 'pyodide' },
    { slug: 'dragonfly-and-the-paddy-field', name: 'Dragonfly', type: 'pyodide' },
    { slug: 'boy-who-built-a-library', name: 'Library', type: 'html' },
    { slug: 'firefly-festival-of-majuli', name: 'Firefly', type: 'arduino', circuits: 6 },
    { slug: 'river-dolphins-secret', name: 'Dolphin', type: 'arduino', circuits: 6 },
    { slug: 'why-the-muga-silk-is-golden', name: 'Muga Silk', type: 'pyodide' },
  ];

  for (const story of stories) {
    console.log(`\n=== ${story.name} ===`);

    try {
      await page.goto(`http://localhost:5174/lessons/${story.slug}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Check page loaded (not blank)
      const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML?.length || 0);
      if (rootHtml > 100) {
        pass(story.name, 'page load', `${rootHtml} chars rendered`);
      } else {
        fail(story.name, 'page load', 'Page appears blank');
        continue;
      }

      // Check for JS errors
      const errors: string[] = [];
      page.on('pageerror', (err: any) => errors.push(err.message));

      // Test level tabs
      await testLevelTabs(page, story.name);

      // Test playground based on type
      if (story.type === 'arduino') {
        await testArduinoCircuits(page, story.name, story.circuits || 6);
      } else if (story.type === 'pyodide') {
        await testPyodideLessons(page, story.name);
      } else if (story.type === 'html') {
        await testHtmlPlayground(page, story.name);
      }

      if (errors.length > 0) {
        fail(story.name, 'JS errors', errors.slice(0, 2).join('; '));
      }
    } catch (err: any) {
      fail(story.name, 'navigation', err.message.substring(0, 100));
    }
  }

  await browser.close();

  // Summary
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  console.log(`\n${'='.repeat(50)}`);
  console.log(`RESULTS: ${passed} passed, ${failed} failed, ${results.length} total`);

  if (failed > 0) {
    console.log('\nFAILURES:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  ✗ [${r.story}] ${r.test}: ${r.detail}`);
    });
    process.exit(1);
  }
}

main().catch(console.error);
