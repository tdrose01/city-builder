import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Single-block automated playtest for 10 sessions.
 * Using a single context to gather all 10 sessions in localStorage.
 */

test('Perform 10 Complete Playtest Sessions', async ({ page }) => {
    // Set a massive timeout for this specific test (20 minutes)
    test.setTimeout(1200000);

    console.log('🚀 Starting 10-session automated playtest...');
    await page.goto('/');
    await page.waitForSelector('.board-grid');

    // Clear analytics to start fresh
    await page.evaluate(() => localStorage.removeItem('city_slacker_analytics'));

    for (let i = 1; i <= 10; i++) {
        const strategy = i % 3 === 0 ? 'aggressive' : (i % 3 === 1 ? 'normal' : 'conservative');
        console.log(`  Session ${i}/10 (Strategy: ${strategy})`);

        const rollButton = page.locator('button[title="Roll Dice"]');
        const autoButton = page.locator('button[title^="Auto Roll"]');
        const upgradeButton = page.locator('button.action-btn-upgrade');
        const resetButton = page.locator('button[title="Reset everything and start over"]');

        if (strategy === 'aggressive') {
            // Use autoroll for 20 seconds
            await autoButton.click();
            await page.waitForTimeout(20000);
            // Try to upgrade at least once if possible
            if (await upgradeButton.isEnabled()) {
                await upgradeButton.click();
            }
        } else {
            // Manual rolls
            const rollCount = strategy === 'normal' ? 12 : 8;
            for (let r = 0; r < rollCount; r++) {
                const moveVisible = await page.locator('button:has-text("Moving")').isVisible();
                const rollVisible = await page.locator('button:has-text("Rolling")').isVisible();

                if (!moveVisible && !rollVisible) {
                    if (await rollButton.isEnabled()) {
                        await rollButton.click();
                        await page.waitForTimeout(2500); // Wait for move
                        if (r % 4 === 0 && await upgradeButton.isEnabled()) {
                            await upgradeButton.click();
                        }
                    }
                } else {
                    await page.waitForTimeout(1000);
                    r--; // retry this roll index
                }
            }
        }

        // End session
        await resetButton.click();
        const confirmBtn = page.locator('button:has-text("RESET EVERYTHING")');
        await confirmBtn.waitFor({ state: 'visible', timeout: 5000 });
        await confirmBtn.click();
        await page.waitForTimeout(2000); // Wait for analytics save and reset
    }

    // Final export
    const analytics = await page.evaluate(() => {
        const data = localStorage.getItem('city_slacker_analytics');
        return data ? JSON.parse(data) : [];
    });

    console.log(`\n🎉 DONE! Collected ${analytics.length} sessions.`);

    const resultsDir = path.join(process.cwd(), 'playtest-results'); // eslint-disable-line
    if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });
    fs.writeFileSync(path.join(resultsDir, 'automated-playtest-data.json'), JSON.stringify(analytics, null, 2));

    expect(analytics.length).toBeGreaterThanOrEqual(10);
});
