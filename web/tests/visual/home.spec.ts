import { expect, test } from '@playwright/test';

test.describe('City Slacker visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/?mode=2d', { waitUntil: 'networkidle' });
    await page.waitForSelector('.board-grid', { state: 'visible' });
  });

  test('homepage loads and game board renders', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('canvas', { state: 'visible', timeout: 30_000 });
    await page.waitForFunction(() => {
      const canvas = document.querySelector('canvas');
      return Boolean(canvas && canvas.clientWidth > 0 && canvas.clientHeight > 0);
    }, { timeout: 30_000 });

    // Give Three.js time to finish initial scene render.
    await page.waitForTimeout(5_000);

    await expect(page.locator('text=City Slacker').first()).toBeVisible();

    await expect(page).toHaveScreenshot('homepage-board.png', {
      fullPage: true,
      timeout: 30_000,
      mask: [page.locator('.board-stage-hud')],
    });
  });

  test('player character is visible', async ({ page }) => {
    const playerPiece = page.locator('.player-piece').first();
    await expect(playerPiece).toBeVisible();

    await expect(playerPiece).toHaveScreenshot('player-character.png');
  });

  test('board tiles are visible', async ({ page }) => {
    const boardTiles = page.locator('.board-tile');
    await expect(boardTiles.first()).toBeVisible();
    await expect(boardTiles).toHaveCount(20);

    await expect(page.locator('.board-grid')).toHaveScreenshot('board-tiles.png');
  });
});
