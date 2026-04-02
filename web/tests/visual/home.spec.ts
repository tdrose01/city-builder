import { expect, test } from '@playwright/test';

test.describe('City Slacker visual regression', () => {
  test('homepage loads in 2D mode', async ({ page }) => {
    await page.goto('/?mode=2d', { waitUntil: 'domcontentloaded' });
    
    // Check the page loaded - verify START tile is visible
    await expect(page.locator('text=START').first()).toBeVisible({ timeout: 10_000 });
    
    // Check for board tiles (2D mode)
    const boardTiles = page.locator('.board-tile');
    await expect(boardTiles.first()).toBeVisible({ timeout: 10_000 });
  });
});
