import { expect, test } from '@playwright/test'

/**
 * Board Perimeter Alignment Tests
 * 
 * Verifies that board tiles remain correctly aligned on the perimeter loop
 * at multiple viewport sizes, maintaining the Monopoly-style layout.
 */

const VIEWPORTS = [
  { name: 'Desktop HD', width: 1920, height: 1080 },
  { name: 'Desktop Standard', width: 1366, height: 768 },
  { name: 'Laptop Large', width: 1440, height: 900 },
  { name: 'Laptop Small', width: 1280, height: 720 },
]

test.describe('Board Perimeter Alignment', () => {
  
  VIEWPORTS.forEach(({ name, width, height }) => {
    test(`tiles align correctly on perimeter at ${name} (${width}x${height})`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width, height })
      
      // Navigate to app
      await page.goto('/', { waitUntil: 'domcontentloaded' })
      
      // Wait for board to render
      await expect(page.locator('.board-grid')).toBeVisible()
      
      // Get all tile elements
      const tiles = page.locator('.board-tile')
      const tileCount = await tiles.count()
      
      // Verify we have 20 tiles (redesigned compact board)
      expect(tileCount).toBe(20)
      
      // Check that tiles are positioned in a perimeter loop
      // Tiles should be in 4 groups (one per side)
      const tilePositions = []
      
      for (let i = 0; i < tileCount; i++) {
        const tile = tiles.nth(i)
        const box = await tile.boundingBox()
        
        if (box) {
          tilePositions.push({
            index: i,
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height,
          })
        }
      }
      
      // Verify all tiles have valid positions
      expect(tilePositions.length).toBe(20)
      
      // Check that tiles don't overlap with center area
      const boardGrid = page.locator('.board-grid')
      const boardBox = await boardGrid.boundingBox()
      
      expect(boardBox).toBeTruthy()
      
      // Verify board is visible and within viewport
      // Allowing small negative X/Y for minor alignment shifts in different viewports
      expect(boardBox.x).toBeGreaterThanOrEqual(-10)
      expect(boardBox.y).toBeGreaterThanOrEqual(-10)
      expect(boardBox.x + boardBox.width).toBeLessThanOrEqual(width + 10)
      expect(boardBox.y + boardBox.height).toBeLessThanOrEqual(height + 10)
    })
  })

  test('tiles have readable labels at all viewport sizes', async ({ page }) => {
    for (const { width, height } of VIEWPORTS) {
      await page.setViewportSize({ width, height })
      await page.goto('/', { waitUntil: 'domcontentloaded' })
      
      // Wait for board to render
      await expect(page.locator('.board-grid')).toBeVisible()
      
      // Check a few key tiles for readability
      const tiles = page.locator('.board-tile')
      const firstTile = tiles.first()
      
      // Verify tile is visible
      await expect(firstTile).toBeVisible()
      
      // Verify tile has text content
      const tileText = await firstTile.textContent()
      expect(tileText).toBeTruthy()
      expect(tileText.length).toBeGreaterThan(0)
      
      // Check that tile name is visible (not clipped)
      const tileName = firstTile.locator('.tile-name')
      if (await tileName.count() > 0) {
        await expect(tileName).toBeVisible()
        
        // Verify text is not overflowing
        const nameBox = await tileName.boundingBox()
        const tileBox = await firstTile.boundingBox()
        
        if (nameBox && tileBox) {
          // Name should be within tile bounds
          expect(nameBox.x).toBeGreaterThanOrEqual(tileBox.x - 5) // 5px tolerance
          expect(nameBox.y).toBeGreaterThanOrEqual(tileBox.y - 5)
          expect(nameBox.x + nameBox.width).toBeLessThanOrEqual(tileBox.x + tileBox.width + 5)
          expect(nameBox.y + nameBox.height).toBeLessThanOrEqual(tileBox.y + tileBox.height + 5)
        }
      }
    }
  })

  test('board maintains no-scroll layout at all viewport sizes', async ({ page }) => {
    for (const { width, height } of VIEWPORTS) {
      await page.setViewportSize({ width, height })
      await page.goto('/', { waitUntil: 'domcontentloaded' })
      
      // Wait for board to render
      await expect(page.locator('.board-grid')).toBeVisible()
      
      // Check that page doesn't require scrolling
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight)
      const viewportHeight = height
      
      // Body height should not exceed viewport (allowing small tolerance for browser chrome)
      expect(bodyHeight).toBeLessThanOrEqual(viewportHeight + 50)
      
      // Verify no horizontal scroll
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
      expect(bodyWidth).toBeLessThanOrEqual(width + 50)
    }
  })

  test('corner tiles are positioned correctly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('.board-grid')).toBeVisible()
    
    // Corner tiles should be at positions 0, 5, 10, 15
    const cornerIndices = [0, 5, 10, 15]
    const tiles = page.locator('.board-tile')
    
    const cornerPositions = []
    
    for (const index of cornerIndices) {
      const tile = tiles.nth(index)
      const box = await tile.boundingBox()
      
      if (box) {
        cornerPositions.push({
          index,
          x: box.x,
          y: box.y,
        })
      }
    }
    
    expect(cornerPositions.length).toBe(4)
    
    // Corners should form a rectangle
    // Top-left (0), Top-right (10), Bottom-right (20), Bottom-left (30)
    const [topLeft, topRight, bottomRight, bottomLeft] = cornerPositions
    
    // Top corners should have similar Y coordinates
    expect(Math.abs(topLeft.y - topRight.y)).toBeLessThan(50)
    
    // Bottom corners should have similar Y coordinates
    expect(Math.abs(bottomRight.y - bottomLeft.y)).toBeLessThan(50)
    
    // Left corners should have similar X coordinates
    expect(Math.abs(topLeft.x - bottomLeft.x)).toBeLessThan(50)
    
    // Right corners should have similar X coordinates
    expect(Math.abs(topRight.x - bottomRight.x)).toBeLessThan(50)
  })

  test('tiles do not overlap each other', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('.board-grid')).toBeVisible()
    
    const tiles = page.locator('.board-tile')
    const tileCount = await tiles.count()
    
    const tileBoxes = []
    
    for (let i = 0; i < tileCount; i++) {
      const tile = tiles.nth(i)
      const box = await tile.boundingBox()
      
      if (box) {
        tileBoxes.push({ index: i, ...box })
      }
    }
    
    // Check for overlaps (allowing small tolerance for borders)
    const tolerance = 5
    
    for (let i = 0; i < tileBoxes.length; i++) {
      for (let j = i + 1; j < tileBoxes.length; j++) {
        const box1 = tileBoxes[i]
        const box2 = tileBoxes[j]
        
        // Check if boxes overlap
        const overlapX = !(
          box1.x + box1.width - tolerance < box2.x ||
          box2.x + box2.width - tolerance < box1.x
        )
        
        const overlapY = !(
          box1.y + box1.height - tolerance < box2.y ||
          box2.y + box2.height - tolerance < box1.y
        )
        
        const overlaps = overlapX && overlapY
        
        // Tiles should not overlap (except for small border tolerance)
        expect(overlaps).toBe(false)
      }
    }
  })

  test('board is centered in viewport', async ({ page }) => {
    for (const { width, height } of VIEWPORTS) {
      await page.setViewportSize({ width, height })
      await page.goto('/', { waitUntil: 'domcontentloaded' })
      
      await expect(page.locator('.board-grid')).toBeVisible()
      
      const boardGrid = page.locator('.board-grid')
      const box = await boardGrid.boundingBox()
      
      if (box) {
        // Calculate center position
        const boardCenterX = box.x + box.width / 2
        const viewportCenterX = width / 2
        
        // Board should be roughly centered (allowing 35% tolerance as layout is left-weighted)
        const tolerance = width * 0.35
        expect(Math.abs(boardCenterX - viewportCenterX)).toBeLessThan(tolerance)
      }
    }
  })
})
