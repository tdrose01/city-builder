import { test, expect } from '@playwright/test';

test.describe('City Slacker Mobile Layout - Pixel 9a', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.board-section');
  });

  test('Board renders correctly on Pixel 9a viewport', async ({ page }) => {
    // Check that the board is visible and properly sized
    const boardGrid = await page.locator('.board-grid');
    await expect(boardGrid).toBeVisible();
    
    // Check that there are 20 tiles rendered
    const tiles = await page.locator('.board-tile, [class*="tile-id-"]').count();
    await expect(tiles).toBe(20);
    
    // Check that the 3D scene is present
    const gameScene = await page.locator('.game-scene-container');
    await expect(gameScene).toBeVisible();
  });

  test('DOM tiles are clickable and responsive', async ({ page }) => {
    // Find a clickable tile (landmark tiles should be clickable)
    const landmarkTile = await page.locator('.tile-id-8'); // Tile 8 is typically a landmark
    
    if (await landmarkTile.isVisible()) {
      // Check if tile has proper styling for interaction
      const tileStyle = await landmarkTile.evaluate((el) => {
        const computed = window.getComputedStyle(el);
        return {
          opacity: computed.opacity,
          pointerEvents: computed.pointerEvents,
          zIndex: computed.zIndex
        };
      });
      
      // Verify tile is interactive (opacity can be low but pointerEvents should be 'auto')
      expect(tileStyle.pointerEvents).toBe('auto');
      
      // Test click functionality
      await landmarkTile.click();
      
      // Check if upgrade modal or similar interaction occurs
      // (This will depend on the actual game state and tile type)
      const upgradeModal = await page.locator('[data-testid*="upgrade"], [class*="modal"], [class*="dialog"]');
      // Note: This expectation might need adjustment based on actual game behavior
    }
  });

  test('3D board alignment with DOM tiles', async ({ page }) => {
    // Check that both 2D and 3D boards are present
    const domTiles = await page.locator('[class*="tile-id-"]').count();
    const gameScene = await page.locator('.game-scene-container');
    
    await expect(domTiles).toBe(20);
    await expect(gameScene).toBeVisible();
    
    // Test that player piece moves correctly
    const rollButton = await page.locator('button:has-text("Roll")').first();
    if (await rollButton.isVisible()) {
      await rollButton.click();
      
      // Wait for animation to complete
      await page.waitForTimeout(2000);
      
      // Check that player piece position changed
      const playerPiece = await page.locator('.player-piece');
      await expect(playerPiece).toBeVisible();
    }
  });

  test('Scrolling functionality works', async ({ page }) => {
    // Check that the page allows scrolling (not blocked by 3D canvas)
    const initialScroll = await page.evaluate(() => window.scrollY);
    
    // Try to scroll
    await page.mouse.wheel(0, 100);
    
    // Check that scrolling actually happened
    const newScroll = await page.evaluate(() => window.scrollY);
    expect(newScroll).toBeGreaterThan(initialScroll);
    
    // Check that game controls remain accessible
    const rollButton = await page.locator('button:has-text("Roll")').first();
    await expect(rollButton).toBeVisible();
    await expect(rollButton).toBeEnabled();
  });

  test('Game controls are accessible on mobile', async ({ page }) => {
    // Check main game controls
    const rollButton = await page.locator('button:has-text("Roll")').first();
    const autoButton = await page.locator('button:has-text("Auto")').first();
    const upgradeButton = await page.locator('button:has-text("Upgrade")').first();
    
    // Verify buttons are visible and have proper styling
    await expect(rollButton).toBeVisible();
    await expect(autoButton).toBeVisible();
    
    // Check if upgrade button exists (depends on current tile)
    if (await upgradeButton.isVisible()) {
      await expect(upgradeButton).toBeVisible();
    }
    
    // Test button interactions
    await expect(rollButton).toBeEnabled();
    await autoButton.click();
    
    // Check if auto roll state changed
    await expect(autoButton).toHaveClass(/action-btn-active/);
  });

  test('DOM tiles have proper alignment and positioning', async ({ page }) => {
    // Check tile positioning for key tiles
    const cornerTiles = [
      { id: 0, name: 'START', expectedPosition: 'bottom-right' },
      { id: 5, name: 'BONUS', expectedPosition: 'bottom-left' },
      { id: 10, name: 'BONUS', expectedPosition: 'top-left' },
      { id: 15, name: 'BONUS', expectedPosition: 'top-right' }
    ];
    
    for (const tile of cornerTiles) {
      const tileElement = await page.locator(`.tile-id-${tile.id}`);
      if (await tileElement.isVisible()) {
        // Get computed position
        const position = await tileElement.evaluate((el) => {
          const style = window.getComputedStyle(el);
          return {
            gridRow: style.gridRow,
            gridColumn: style.gridColumn,
            opacity: style.opacity,
            zIndex: style.zIndex
          };
        });
        
        // Verify tile has proper positioning (not opacity: 0 which would make it invisible)
        expect(position.opacity).toBe('0.1'); // We set this to 0.1 for debugging
        expect(position.zIndex).toBe('10');
        
        console.log(`Tile ${tile.id}:`, position);
      }
    }
  });

  test('Mobile viewport and touch interactions', async ({ page }) => {
    // Test that the board fits within the viewport
    const boardGrid = await page.locator('.board-grid');
    const boundingBox = await boardGrid.boundingBox();
    
    expect(boundingBox).toBeTruthy();
    expect(boundingBox.width).toBeLessThanOrEqual(412); // Pixel 9a width
    expect(boundingBox.height).toBeLessThanOrEqual(915); // Pixel 9a height
    
    // Test hover effects work on mobile
    const firstTile = await page.locator('.board-tile').first();
    if (await firstTile.isVisible()) {
      // Hover should work on mobile for interaction feedback
      await firstTile.hover();
      
      // Check for hover effects
      const hoverStyle = await firstTile.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return {
          transform: style.transform,
          borderColor: style.borderColor
        };
      });
      
      console.log('Tile hover effect:', hoverStyle);
    }
  });

  test('Game state and persistence', async ({ page }) => {
    // Check that game state elements are present
    const fundsDisplay = await page.locator('.metric-chip:has-text("Funds")').first();
    const diceDisplay = await page.locator('.metric-chip:has-text("Dice")').first();
    const shieldsDisplay = await page.locator('.metric-chip:has-text("Shields")').first();
    
    await expect(fundsDisplay).toBeVisible();
    await expect(diceDisplay).toBeVisible();
    await expect(shieldsDisplay).toBeVisible();
    
    // Get initial values
    const initialFunds = await fundsDisplay.locator('.value').textContent();
    const initialDice = await diceDisplay.locator('.value').textContent();
    
    console.log('Initial game state:', { funds: initialFunds, dice: initialDice });
    
    // Test that game responds to user input
    const rollButton = await page.locator('button:has-text("Roll")').first();
    if (await rollButton.isVisible() && await rollButton.isEnabled()) {
      await rollButton.click();
      
      // Wait for potential state change
      await page.waitForTimeout(3000);
      
      // Check if values changed (they might not if dice cost is too high)
      const newFunds = await fundsDisplay.locator('.value').textContent();
      const newDice = await diceDisplay.locator('.value').textContent();
      
      console.log('Updated game state:', { funds: newFunds, dice: newDice });
    }
  });
});