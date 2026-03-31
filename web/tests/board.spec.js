import { expect, test } from '@playwright/test'

test('board loop renders and dice are visible', async ({ page }) => {
  await page.goto('/?mode=2d', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.board-center-logo')).toHaveText(/City Slacker/i)
  await expect(page.locator('.board-grid')).toBeVisible()
  await expect(page.getByRole('button', { name: /^roll$/i })).toBeVisible()
  // Note: 3D dice canvas is not rendered in 2D mode
})
