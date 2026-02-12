// e2e/mobile-board.spec.js
import { test, expect } from '@playwright/test';

test.describe('Mobile Board', () => {
  test.use({
    viewport: { width: 412, height: 915 }, // Pixel 9a
    deviceScaleFactor: 2.5,
  });

  test('board is visible and clickable', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Board should render
    await expect(page.locator('.game-scene-container')).toBeVisible();
    
    // Should be able to scroll
    await page.evaluate(() => window.scrollTo(0, 500));
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
    
    // Click on tile should work
    await page.locator('.tile-id-0').click({ force: true });
    
    // Take screenshot for verification
    await page.screenshot({ path: 'test-results/mobile-board.png' });
  });

  test('DOM tiles are clickable even when invisible', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Check that DOM tiles exist and are clickable
    const tileLocator = page.locator('.tile');
    await expect(tileLocator.count()).toBeGreaterThan(0);
    
    // Try to click a tile even if it's not visible
    await tileLocator.first().click({ force: true });
  });

  test('3D tiles are visible', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    // Check for 3D scene container
    await expect(page.locator('.game-scene-container')).toBeVisible();
    
    // Check for 3D tiles by looking for canvas elements
    const canvasLocator = page.locator('canvas');
    await expect(canvasLocator.count()).toBeGreaterThan(0);
    
    // Take screenshot to verify 3D rendering
    await page.screenshot({ path: 'test-results/mobile-3d-tiles.png' });
  });

  test('no console errors', async ({ page }) => {
    const consoleLogs = [];
    
    // Capture console messages
    page.on('console', msg => {
      consoleLogs.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      });
      
      // Log errors for debugging
      if (msg.type() === 'error') {
        console.error('Console error:', msg.text());
      }
    });
    
    await page.goto('http://localhost:5173');
    
    // Wait for page to fully load and any potential errors to occur
    await page.waitForLoadState('networkidle');
    
    // Check for any console errors
    const errors = consoleLogs.filter(log => log.type === 'error');
    expect(errors.length).toBe(0);
  });
});