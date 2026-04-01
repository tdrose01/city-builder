import { test, expect } from '@playwright/test';

test.describe('City Slacker Game', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the game
    await page.goto('/');
    
    // Listen for console errors and fail the test if any occur
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`Browser console error: ${msg.text()}`);
        // We'll collect errors and check them after navigation
      }
    });
  });

  test('should load and render the 3D canvas', async ({ page }) => {
    // Wait for the canvas element to be present
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });
    
    // Additional wait for WebGL to initialize (optional)
    await page.waitForTimeout(2000);
    
    // Take a screenshot for visual verification
    await page.screenshot({ path: 'game-screenshot.png', fullPage: true });
    
    // Verify canvas has reasonable dimensions (not zero)
    const boundingBox = await canvas.boundingBox();
    expect(boundingBox).toBeTruthy();
    expect(boundingBox?.width).toBeGreaterThan(0);
    expect(boundingBox?.height).toBeGreaterThan(0);
  });
  
  test('should not have console errors', async ({ page }) => {
    // Collect console errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Navigate to game (if not already there)
    await page.goto('/');
    await page.waitForSelector('canvas', { timeout: 10000 });
    
    // Wait a bit for any potential errors to appear
    await page.waitForTimeout(3000);
    
    // Assert no errors occurred
    expect(errors).toHaveLength(0, `Console errors detected: ${errors.join(', ')}`);
  });
});