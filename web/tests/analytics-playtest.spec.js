import { test } from '@playwright/test';

/**
 * Automated Playtest for Analytics Collection
 * Plays 10 complete sessions with different strategies
 */

test.describe('Analytics Playtest - 10 Sessions', () => {
  test.setTimeout(600000); // 10 minutes total

  // Helper function to play a complete session
  async function playSession(page, strategy = 'normal') {
    // Wait for game to load
    await page.waitForSelector('.board-grid', { timeout: 10000 });

    const rollButton = page.locator('button[title="Roll Dice"]');
    const autoButton = page.locator('button[title^="Auto Roll"]');
    const upgradeButton = page.locator('button.action-btn-upgrade'); // Updated class selector
    const resetButton = page.locator('button[title="Reset everything and start over"]'); // Updated title selector

    let rollCount = 0;
    const maxRolls = strategy === 'aggressive' ? 20 : strategy === 'conservative' ? 15 : 18;

    if (strategy === 'aggressive') {
      // Enable auto-roll for aggressive strategy
      await autoButton.click();
      await page.waitForTimeout(15000); // Let it auto-roll for 15 seconds

      // Try to upgrade if possible
      const upgradeDisabled = await upgradeButton.isDisabled();
      if (!upgradeDisabled) {
        await upgradeButton.click();
        await page.waitForTimeout(1000);
      }

      // EXPLICITLY turn off auto roll
      await autoButton.click();
      await page.waitForTimeout(1000);
    } else if (strategy === 'conservative') {
      // Manual rolling with delays
      while (rollCount < maxRolls) {
        const isDisabled = await rollButton.isDisabled();
        if (isDisabled) break;

        await rollButton.click();
        await page.waitForTimeout(3000); // Wait 3s between rolls
        rollCount++;

        // Try to upgrade occasionally
        if (rollCount % 5 === 0) {
          const upgradeDisabled = await upgradeButton.isDisabled();
          if (!upgradeDisabled) {
            await upgradeButton.click();
            await page.waitForTimeout(1000);
          }
        }
      }
    } else {
      // Normal strategy - mix of manual and auto
      // Do some manual rolls first
      for (let i = 0; i < 5; i++) {
        const isDisabled = await rollButton.isDisabled();
        if (isDisabled) break;

        await rollButton.click();
        await page.waitForTimeout(1500);
        rollCount++;
      }

      // Enable auto for a bit
      await autoButton.click();
      await page.waitForTimeout(8000);

      // Try upgrades
      const upgradeDisabled = await upgradeButton.isDisabled();
      if (!upgradeDisabled) {
        await upgradeButton.click();
        await page.waitForTimeout(1000);
      }

      // EXPLICITLY turn off auto roll before reset to avoid UI conflicts
      const isAutoOn = await page.evaluate(() => {
        const btn = document.querySelector('button[title^="Auto Roll"]');
        return btn && btn.textContent.includes('ON');
      });
      if (isAutoOn) {
        await autoButton.click();
        await page.waitForTimeout(1000);
      }
    }

    // Wait for any animations to finish
    await page.waitForFunction(() => {
      const rollBtn = document.querySelector('button[title="Roll Dice"]');
      return rollBtn && !rollBtn.textContent.includes('Rolling') && !rollBtn.textContent.includes('Moving');
    }, { timeout: 10000 }).catch(() => console.log("Timed out waiting for movement to stop"));

    // End session by clicking Reset
    await resetButton.click();

    // Confirm reset dialog
    // Wait for the ConfirmDialog to appear ("RESET ALL PROGRESS?" or similar title)
    // The button text is "RESET EVERYTHING" in red.
    const confirmButton = page.locator('button:has-text("RESET EVERYTHING")');
    await confirmButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
      console.log("Reset confirmation not found or timed out");
    });

    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }

    // Wait for reset to complete
    await page.waitForTimeout(2000);
  }

  test('Session 1: Natural play', async ({ page }) => {
    await page.goto('/');
    await playSession(page, 'normal');
    console.log('✅ Session 1 complete');
  });

  test('Session 2: Natural play', async ({ page }) => {
    await page.goto('/');
    await playSession(page, 'normal');
    console.log('✅ Session 2 complete');
  });

  test('Session 3: Natural play', async ({ page }) => {
    await page.goto('/');
    await playSession(page, 'normal');
    console.log('✅ Session 3 complete');
  });

  test('Session 4: Aggressive strategy', async ({ page }) => {
    await page.goto('/');
    await playSession(page, 'aggressive');
    console.log('✅ Session 4 complete');
  });

  test('Session 5: Aggressive strategy', async ({ page }) => {
    await page.goto('/');
    await playSession(page, 'aggressive');
    console.log('✅ Session 5 complete');
  });

  test('Session 6: Aggressive strategy', async ({ page }) => {
    await page.goto('/');
    await playSession(page, 'aggressive');
    console.log('✅ Session 6 complete');
  });

  test('Session 7: Conservative strategy', async ({ page }) => {
    await page.goto('/');
    await playSession(page, 'conservative');
    console.log('✅ Session 7 complete');
  });

  test('Session 8: Conservative strategy', async ({ page }) => {
    await page.goto('/');
    await playSession(page, 'conservative');
    console.log('✅ Session 8 complete');
  });

  test('Session 9: Conservative strategy', async ({ page }) => {
    await page.goto('/');
    await playSession(page, 'conservative');
    console.log('✅ Session 9 complete');
  });

  test('Session 10: Mixed strategy', async ({ page }) => {
    await page.goto('/');
    await playSession(page, 'normal');
    console.log('✅ Session 10 complete');
  });

  test('Export analytics report', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.board-grid');

    // Click Analytics button
    const analyticsButton = page.locator('button:has-text("Analytics")');
    await analyticsButton.click();

    // Wait for analytics viewer to open
    await page.waitForSelector('.analytics-viewer', { timeout: 5000 });

    // Take screenshot of summary
    await page.screenshot({ path: 'playtest-results/analytics-summary.png', fullPage: true });

    // Get the analytics data from localStorage
    const analyticsData = await page.evaluate(() => {
      const data = localStorage.getItem('city_slacker_analytics');
      return data ? JSON.parse(data) : null;
    });

    console.log('📊 Analytics Data Collected:');
    console.log(`Total Sessions: ${analyticsData?.length || 0}`);

    if (analyticsData && analyticsData.length > 0) {
      const avgDuration = analyticsData.reduce((sum, s) => sum + s.duration, 0) / analyticsData.length;
      const avgRolls = analyticsData.reduce((sum, s) => sum + s.totalRolls, 0) / analyticsData.length;
      const avgStickers = analyticsData.reduce((sum, s) => sum + s.stickersEarned, 0) / analyticsData.length;

      console.log(`Average Duration: ${Math.round(avgDuration)}s (Target: 60-120s)`);
      console.log(`Average Rolls: ${avgRolls.toFixed(1)} (Target: 8-12)`);
      console.log(`Average Stickers: ${avgStickers.toFixed(1)} (Target: 1-3)`);

      // Export to JSON file
      // eslint-disable-next-line
      const fs = require('fs');
      // eslint-disable-next-line
      const path = require('path');

      // eslint-disable-next-line
      const resultsDir = path.join(process.cwd(), 'playtest-results');
      if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir, { recursive: true });
      }

      fs.writeFileSync(
        path.join(resultsDir, 'session-data.json'),
        JSON.stringify(analyticsData, null, 2)
      );

      console.log('✅ Analytics data exported to playtest-results/session-data.json');
    }
  });
});
