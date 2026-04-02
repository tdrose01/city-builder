import { test, expect } from '@playwright/test';

test('debug page', async ({ page }) => {
  await page.goto('/?mode=2d', { waitUntil: 'networkidle' });
  await page.waitForSelector('.board-grid', { state: 'visible' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('canvas', { state: 'visible', timeout: 30_000 });
  await page.waitForFunction(() => {
    const canvas = document.querySelector('canvas');
    return !!canvas && canvas.width > 0 && canvas.height > 0;
  }, { timeout: 30_000 });
  await page.waitForTimeout(8_000);
  
  // Dump page content
  const content = await page.content();
  console.log('PAGE CONTENT SNIPPET:', content.substring(0, 2000));
  
  // Check for the text element
  const textEls = await page.$$('text=City Slacker');
  console.log('Number of elements with text "City Slacker":', textEls.length);
  for (let i = 0; i < textEls.length; i++) {
    const el = textEls[i];
    const isVisible = await el.isVisible();
    const boundingBox = await el.boundingBox();
    const className = await el.getAttribute('class');
    console.log(`Element ${i}: visible=${isVisible}, bbox=${JSON.stringify(boundingBox)}, class=${className}`);
  }
  
  // Also check all elements containing City Slacker
  const allEls = await page.$$('*');
  for (const el of allEls) {
    const text = await el.textContent();
    if (text && text.includes('City Slacker')) {
      const isVisible = await el.isVisible();
      const className = await el.getAttribute('class');
      console.log(`Element with text: visible=${isVisible}, class=${className}, text="${text}"`);
    }
  }
});
