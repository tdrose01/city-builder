import { expect, test } from '@playwright/test'

/**
 * Board Alignment Diagnostic Test
 * 
 * Simple test to diagnose board tile rendering and alignment issues
 */

test.describe('Board Alignment Diagnostics', () => {

    test('board renders with tiles', async ({ page }) => {
        await page.goto('/?mode=2d', { waitUntil: 'domcontentloaded' })

        // Wait for board to render
        await expect(page.locator('.board-grid')).toBeVisible()

        // Check for tiles - try different selectors
        const tileSelectors = [
            '.board-tile',
            '[class*="tile"]',
            '.board-grid > *',
        ]

        for (const selector of tileSelectors) {
            const elements = page.locator(selector)
            const count = await elements.count()
            console.log(`Selector "${selector}": found ${count} elements`)
        }

        // Get board HTML structure
        const boardHTML = await page.locator('.board-grid').innerHTML()
        console.log('Board grid HTML length:', boardHTML.length)

        // Check if board has children
        const boardChildren = page.locator('.board-grid > *')
        const childCount = await boardChildren.count()
        console.log(`Board has ${childCount} direct children`)

        // Verify board is visible
        const boardBox = await page.locator('.board-grid').boundingBox()
        console.log('Board bounding box:', boardBox)

        expect(childCount).toBeGreaterThan(0)
    })

    test('verify tile structure', async ({ page }) => {
        await page.goto('/', { waitUntil: 'domcontentloaded' })
        await expect(page.locator('.board-grid')).toBeVisible()

        // Get all elements with class containing "tile"
        const allElements = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('[class*="tile"]'))
            return elements.map(el => ({
                tag: el.tagName,
                classes: el.className,
                text: el.textContent?.substring(0, 50),
            }))
        })

        console.log('Elements with "tile" in class:', JSON.stringify(allElements, null, 2))

        expect(allElements.length).toBeGreaterThan(0)
    })

    test('check viewport and board dimensions', async ({ page }) => {
        const viewport = page.viewportSize()
        console.log('Viewport:', viewport)

        await page.goto('/', { waitUntil: 'domcontentloaded' })
        await expect(page.locator('.board-grid')).toBeVisible()

        const boardBox = await page.locator('.board-grid').boundingBox()
        console.log('Board dimensions:', boardBox)

        if (boardBox && viewport) {
            console.log('Board fits in viewport:', {
                width: boardBox.width <= viewport.width,
                height: boardBox.height <= viewport.height,
            })
        }

        expect(boardBox).toBeTruthy()
    })
})
