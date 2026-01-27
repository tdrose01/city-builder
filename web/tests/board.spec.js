import { expect, test } from '@playwright/test'

test('board loop renders and dice are visible', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.board-center-logo')).toHaveText(/City Slacker/i)
  await expect(page.locator('.board-grid')).toBeVisible()
  await expect(page.getByRole('button', { name: /^roll$/i })).toBeVisible()
  await expect(page.locator('.three-dice-container canvas')).toHaveCount(1)
})
