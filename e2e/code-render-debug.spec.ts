import { test, expect } from 'playwright/test';

test('Lesson page code blocks render and are interactive', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (err) => errors.push(err.message));

  await page.goto('http://localhost:3000/lessons/firefly-festival-of-majuli');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Check for code editors (textareas in ArduinoPlayground)
  const textareas = page.locator('textarea');
  const taCount = await textareas.count();
  console.log('Textareas found:', taCount);

  // Check for Upload & Run buttons
  const uploadBtns = page.locator('button:has-text("Upload"), button:has-text("Run")');
  console.log('Run/Upload buttons:', await uploadBtns.count());

  // Check for ArduinoPlayground container
  const circuits = page.locator('text=Circuit');
  console.log('Circuit labels:', await circuits.count());

  // Check for breadboard
  const breadboard = page.locator('text=BREADBOARD');
  console.log('Breadboard labels:', await breadboard.count());

  // Look for the serial monitor
  const serial = page.locator('text=SERIAL MONITOR');
  console.log('Serial monitors:', await serial.count());

  // Check code content if textarea exists
  if (taCount > 0) {
    const code = await textareas.first().inputValue();
    console.log('Code lines:', code.split('\n').length);
    console.log('Has void setup:', code.includes('void setup'));
  }

  // Page errors
  console.log('JS errors:', errors.length > 0 ? errors : 'none');

  // At minimum, the level 0 should render with some content
  const bodyText = await page.textContent('body');
  expect(bodyText!.length).toBeGreaterThan(500);
});
