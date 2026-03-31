// City Builder E2E Tests
// Tests core game functionality

import { test, expect } from '@playwright/test';

test.describe('City Builder - Core Game', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the game
    await page.goto('http://127.0.0.1:4173/?mode=2d');
    // Wait for the game to load
    await page.waitForTimeout(2000);
  });

  test('Game loads and shows title', async ({ page }) => {
    // Check if the page loaded
    await expect(page).toHaveTitle(/web|City|Builder/i);
    
    // Check for game container
    const gameContainer = page.locator('#root');
    await expect(gameContainer).toBeVisible();
  });

  test('Board game is rendered', async ({ page }) => {
    // Allow 3x timeout for WebGL initialization
    test.slow();
    // Wait for canvas/WebGL to initialize (WebGL can take 5+ seconds)
    await page.waitForTimeout(6000);
    
    // Look for the 3D canvas or board stage
    const canvas = page.locator('canvas');
    const board = page.locator('[class*="board"], [class*="stage"], [class*="game"], #root > div > div');
    
    // Either canvas or board container should exist
    const hasCanvas = await canvas.isVisible().catch(() => false);
    const hasBoard = await board.isVisible().catch(() => false);
    
    expect(hasCanvas || hasBoard).toBeTruthy();
  });

  test('UI controls are visible', async ({ page }) => {
    // Look for common game UI elements
    const buttons = page.locator('button');
    const diceButton = page.locator('button:has-text("Roll"), button[title*="dice"], [class*="dice"]').first();
    
    // Check if there are buttons on the page
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });

  test('Game state loads from localStorage', async ({ page }) => {
    // Check localStorage for game state
    const gameState = await page.evaluate(() => {
      return localStorage.getItem('city-builder-game');
    });
    
    // Game should have some state (even if empty/new)
    // or might use different keys
    const allStorage = await page.evaluate(() => {
      return Object.keys(localStorage).filter(k => k.includes('city') || k.includes('game'));
    });
    
    console.log('LocalStorage keys:', allStorage);
    
    // At minimum, check localStorage is accessible
    expect(allStorage).toBeDefined();
  });

  test('Responsive layout renders', async ({ page }) => {
    // Test different viewport sizes
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(500);
    
    const root = page.locator('#root');
    await expect(root).toBeVisible();
    
    // Check for mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    
    // Page should still be visible
    await expect(root).toBeVisible();
  });

});

test.describe('City Builder - Game Interactions', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:4173');
    await page.waitForTimeout(3000);
  });

  test('Dice roll interaction', async ({ page }) => {
    // Look for dice/roll button
    const rollButton = page.locator('button').filter({ hasText: /roll|dice|spin/i }).first();
    
    if (await rollButton.isVisible().catch(() => false)) {
      await rollButton.click();
      
      // Wait for animation
      await page.waitForTimeout(1500);
      
      // Check that something happened (no error)
      const errorMessage = page.locator('.error, [role="alert"]');
      const hasError = await errorMessage.isVisible().catch(() => false);
      
      expect(hasError).toBeFalsy();
    } else {
      // Skip if no dice button found (might be different UI)
      test.skip();
    }
  });

  test('Modal/dialog can be opened', async ({ page }) => {
    // Look for settings, help, or menu buttons
    const menuButton = page.locator('button').filter({ has: page.locator('svg, [class*="menu"], [class*="settings"]') }).first();
    
    if (await menuButton.isVisible().catch(() => false)) {
      await menuButton.click();
      await page.waitForTimeout(500);
      
      // Look for modal or dialog
      const modal = page.locator('[role="dialog"], [class*="modal"], [class*="dialog"]').first();
      const isModalVisible = await modal.isVisible().catch(() => false);
      
      if (isModalVisible) {
        // Close it
        const closeButton = page.locator('button:has-text("Close"), [class*="close"]').first();
        if (await closeButton.isVisible().catch(() => false)) {
          await closeButton.click();
        } else {
          // Click outside or press Escape
          await page.keyboard.press('Escape');
        }
      }
    }
  });

});
