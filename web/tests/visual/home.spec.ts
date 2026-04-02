import { expect, test } from '@playwright/test';

test.describe('City Slacker visual regression', () => {
  test('homepage loads in 2D mode', async ({ page }) => {
    await page.goto('/?mode=2d', { waitUntil: 'domcontentloaded' });
    
    // Just check the page loaded
    await expect(page.locator('text=City Slacker').first()).toBeVisible({ timeout: 10_000 });
    
    // Check for board tiles (2D mode)
    const boardTiles = page.locator('.board-tile');
    await expect(boardTiles.first()).toBeVisible({ timeout: 10_000 });
  });
});
