import { expect, test } from '@playwright/test';

test.describe('City Slacker visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?mode=2d', { waitUntil: 'networkidle' });
    // Wait for board tiles to render
    await page.waitForSelector('.board-tile', { state: 'visible', timeout: 30_000 });
  });

  test('homepage loads and game board renders', async ({ page }) => {
    await page.waitForSelector('canvas', { state: 'visible', timeout: 30_000 });
    await page.waitForFunction(() => {
      const canvas = document.querySelector('canvas');
      return !!canvas && canvas.width > 0 && canvas.height > 0;
    }, { timeout: 30_000 });
    await page.waitForTimeout(8_000);

    await expect(page.locator('text=City Slacker').first()).toBeVisible();

    await expect(page).toHaveScreenshot('homepage-board.png', {
      fullPage: true,
      timeout: 30_000,
    });
  });

  test('board tiles are visible', async ({ page }) => {
    const boardTiles = page.locator('.board-tile');
    await expect(boardTiles.first()).toBeVisible();
    await expect(boardTiles).toHaveCount(20);

    await expect(page.locator('.board-tile').first()).toHaveScreenshot('board-tiles.png');
  });
});
