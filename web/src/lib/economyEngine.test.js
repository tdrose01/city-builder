import { describe, it, expect, beforeEach } from 'vitest'
import {
  PASS_GO_BONUS,
  transferMoney,
  addMoney,
  deductMoney,
  calculateRent,
  checkMonopoly,
  purchaseProperty,
  checkPassGo,
} from './economyEngine'

describe('Economy Engine', () => {
  describe('PASS_GO_BONUS', () => {
    it('should be defined as 200', () => {
      expect(PASS_GO_BONUS).toBe(200)
    })
  })

  describe('transferMoney', () => {
    let playerA, playerB

    beforeEach(() => {
      playerA = { id: 'player1', money: 1000, properties: [] }
      playerB = { id: 'player2', money: 500, properties: [] }
    })

    it('should transfer money successfully between players', () => {
      const result = transferMoney(playerA, playerB, 300)
      expect(result.success).toBe(true)
      expect(result.from).toBe('player1')
      expect(result.to).toBe('player2')
      expect(result.amount).toBe(300)
      expect(playerA.money).toBe(700)
      expect(playerB.money).toBe(800)
    })

    it('should return error for insufficient funds', () => {
      const result = transferMoney(playerA, playerB, 1500)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Insufficient funds')
      expect(playerA.money).toBe(1000)
      expect(playerB.money).toBe(500)
    })

    it('should handle zero amount transfer', () => {
      const result = transferMoney(playerA, playerB, 0)
      expect(result.success).toBe(true)
      expect(playerA.money).toBe(1000)
      expect(playerB.money).toBe(500)
    })

    it('should handle transfer of all money', () => {
      const result = transferMoney(playerA, playerB, 1000)
      expect(result.success).toBe(true)
      expect(playerA.money).toBe(0)
      expect(playerB.money).toBe(1500)
    })

    it('should handle exact remaining balance', () => {
      playerA.money = 300
      const result = transferMoney(playerA, playerB, 300)
      expect(result.success).toBe(true)
      expect(playerA.money).toBe(0)
    })

    it('should handle large numbers', () => {
      playerA.money = 999999999
      playerB.money = 0
      const result = transferMoney(playerA, playerB, 500000000)
      expect(result.success).toBe(true)
      expect(playerA.money).toBe(499999999)
      expect(playerB.money).toBe(500000000)
    })
  })

  describe('addMoney', () => {
    let player

    beforeEach(() => {
      player = { id: 'player1', money: 1000, properties: [] }
    })

    it('should add money to player', () => {
      const result = addMoney(player, 500)
      expect(result.success).toBe(true)
      expect(result.player).toBe('player1')
      expect(result.amount).toBe(500)
      expect(player.money).toBe(1500)
    })

    it('should handle adding zero', () => {
      const result = addMoney(player, 0)
      expect(result.success).toBe(true)
      expect(player.money).toBe(1000)
    })

    it('should handle adding to zero balance', () => {
      player.money = 0
      const result = addMoney(player, 500)
      expect(result.success).toBe(true)
      expect(player.money).toBe(500)
    })

    it('should handle large amounts', () => {
      const result = addMoney(player, 999999999)
      expect(result.success).toBe(true)
      expect(player.money).toBe(1000000999)
    })
  })

  describe('deductMoney', () => {
    let player

    beforeEach(() => {
      player = { id: 'player1', money: 1000, properties: [] }
    })

    it('should deduct money from player', () => {
      const result = deductMoney(player, 300)
      expect(result.success).toBe(true)
      expect(result.player).toBe('player1')
      expect(result.amount).toBe(300)
      expect(player.money).toBe(700)
    })

    it('should return error for insufficient funds', () => {
      const result = deductMoney(player, 1500)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Insufficient funds')
      expect(player.money).toBe(1000)
    })

    it('should handle deducting zero', () => {
      const result = deductMoney(player, 0)
      expect(result.success).toBe(true)
      expect(player.money).toBe(1000)
    })

    it('should handle exact balance deduction', () => {
      const result = deductMoney(player, 1000)
      expect(result.success).toBe(true)
      expect(player.money).toBe(0)
    })

    it('should handle deducting from zero balance', () => {
      player.money = 0
      const result = deductMoney(player, 100)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Insufficient funds')
      expect(player.money).toBe(0)
    })
  })

  describe('calculateRent', () => {
    let owner, tiles

    beforeEach(() => {
      owner = { id: 'owner1', money: 1000, properties: ['tile1', 'tile2'] }
      tiles = [
        { id: 'tile1', type: 'property', group: 'groupA', baseValue: 100, rent: 10, buildings: 0, owner: 'owner1' },
        { id: 'tile2', type: 'property', group: 'groupA', baseValue: 120, rent: 12, buildings: 0, owner: 'owner1' },
        { id: 'tile3', type: 'property', group: 'groupA', baseValue: 150, rent: 15, buildings: 0, owner: null },
        { id: 'tile4', type: 'property', group: 'groupB', baseValue: 200, rent: 20, buildings: 0, owner: 'owner1' },
        { id: 'tile5', type: 'chance', group: null },
      ]
    })

    it('should calculate base rent for owned property', () => {
      const tile = tiles[0]
      const rent = calculateRent(tile, owner, tiles)
      expect(rent).toBe(10)
    })

    it('should calculate rent using baseValue * 0.1 with monopoly bonus for new group', () => {
      // When tile's group doesn't exist in tiles array, checkMonopoly returns true
      // (0 owned === 0 total, vacuously true)
      const tile = { id: 'tileX', type: 'property', group: 'groupC', baseValue: 100, buildings: 0 }
      const rent = calculateRent(tile, owner, tiles)
      // 10 * 2 (monopoly multiplier) = 20
      expect(rent).toBe(20)
    })

    it('should double rent for monopoly', () => {
      owner.properties = ['tile1', 'tile2', 'tile3']
      tiles[2].owner = 'owner1'
      const tile = tiles[0]
      const rent = calculateRent(tile, owner, tiles)
      expect(rent).toBe(20)
    })

    it('should apply building multiplier', () => {
      const tile = { id: 'tile1', type: 'property', group: 'groupB', baseValue: 100, rent: 10, buildings: 2 }
      const rent = calculateRent(tile, owner, tiles)
      expect(rent).toBe(20)
    })

    it('should combine monopoly and building multipliers', () => {
      owner.properties = ['tile1', 'tile2', 'tile3']
      tiles[2].owner = 'owner1'
      const tile = { ...tiles[0], buildings: 2 }
      const rent = calculateRent(tile, owner, tiles)
      expect(rent).toBe(40)
    })

    it('should return 0 for null tile', () => {
      const rent = calculateRent(null, owner, tiles)
      expect(rent).toBe(0)
    })

    it('should return 0 for non-property tile', () => {
      const tile = tiles[4]
      const rent = calculateRent(tile, owner, tiles)
      expect(rent).toBe(0)
    })

    it('should return 0 when no owner provided', () => {
      const tile = tiles[0]
      const rent = calculateRent(tile, null, tiles)
      expect(rent).toBe(0)
    })

    it('should floor decimal rent values with monopoly', () => {
      // tileX is only tile in its group (in the [tile] array), so monopoly applies
      const tile = { id: 'tileX', type: 'property', baseValue: 95, buildings: 1, group: 'groupX' }
      // Owner needs to own tileX for monopoly check to work
      const testOwner = { id: 'o1', money: 1000, properties: ['tileX'] }
      const testTiles = [tile]
      const rent = calculateRent(tile, testOwner, testTiles)
      // baseValue * 0.1 = 9.5, monopoly doubles to 19, building multiplier 1.5x → 28.5, floored = 28
      expect(rent).toBe(28)
    })
  })

  describe('checkMonopoly', () => {
    it('should return true when player owns all properties in group', () => {
      const player = { id: 'p1', properties: ['t1', 't2', 't3'] }
      const tiles = [
        { id: 't1', type: 'property', group: 'groupA' },
        { id: 't2', type: 'property', group: 'groupA' },
        { id: 't3', type: 'property', group: 'groupA' },
      ]
      const result = checkMonopoly(player, 'groupA', tiles)
      expect(result).toBe(true)
    })

    it('should return false when player does not own all properties in group', () => {
      const player = { id: 'p1', properties: ['t1'] }
      const tiles = [
        { id: 't1', type: 'property', group: 'groupA' },
        { id: 't2', type: 'property', group: 'groupA' },
        { id: 't3', type: 'property', group: 'groupA' },
      ]
      const result = checkMonopoly(player, 'groupA', tiles)
      expect(result).toBe(false)
    })

    it('should return true for empty group (vacuously true: 0 owned === 0 total)', () => {
      const player = { id: 'p1', properties: [] }
      const tiles = []
      const result = checkMonopoly(player, 'groupA', tiles)
      expect(result).toBe(true) // 0 === 0 is true
    })

    it('should return false for null group', () => {
      const player = { id: 'p1', properties: ['t1'] }
      const tiles = [
        { id: 't1', type: 'property', group: null },
      ]
      const result = checkMonopoly(player, null, tiles)
      expect(result).toBe(false)
    })

    it('should return true when no tiles in group (vacuously true: 0 owned === 0 total)', () => {
      const player = { id: 'p1', properties: ['t1'] }
      const tiles = [
        { id: 't1', type: 'property', group: 'groupB' },
      ]
      const result = checkMonopoly(player, 'groupA', tiles)
      expect(result).toBe(true) // No groupA tiles, so 0 === 0 is true
    })

    it('should handle single property group as monopoly', () => {
      const player = { id: 'p1', properties: ['t1'] }
      const tiles = [
        { id: 't1', type: 'property', group: 'groupA' },
      ]
      const result = checkMonopoly(player, 'groupA', tiles)
      expect(result).toBe(true)
    })

    it('should only check property types', () => {
      const player = { id: 'p1', properties: ['t1', 't2'] }
      const tiles = [
        { id: 't1', type: 'property', group: 'groupA' },
        { id: 't2', type: 'property', group: 'groupA' },
        { id: 't3', type: 'chance', group: 'groupA' },
      ]
      const result = checkMonopoly(player, 'groupA', tiles)
      expect(result).toBe(true)
    })
  })

  describe('purchaseProperty', () => {
    let player

    beforeEach(() => {
      player = { id: 'p1', money: 1000, properties: [] }
    })

    it('should successfully purchase an unowned property', () => {
      const tile = { id: 'tile1', type: 'property', baseValue: 300, owner: null }
      const result = purchaseProperty(player, tile)
      
      expect(result.success).toBe(true)
      expect(result.player).toBe('p1')
      expect(result.tile).toBe('tile1')
      expect(player.money).toBe(700)
      expect(player.properties).toContain('tile1')
      expect(tile.owner).toBe('p1')
    })

    it('should fail to purchase already owned property', () => {
      const tile = { id: 'tile1', type: 'property', baseValue: 300, owner: 'p2' }
      const result = purchaseProperty(player, tile)
      
      expect(result.success).toBe(false)
      expect(player.money).toBe(1000)
      expect(player.properties).not.toContain('tile1')
    })

    it('should fail to purchase non-property tile', () => {
      const tile = { id: 'tile1', type: 'chance', owner: null }
      const result = purchaseProperty(player, tile)
      
      expect(result.success).toBe(false)
      expect(player.money).toBe(1000)
    })

    it('should fail when player has insufficient funds', () => {
      const tile = { id: 'tile1', type: 'property', baseValue: 1500, owner: null }
      const result = purchaseProperty(player, tile)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Not enough money')
      expect(player.money).toBe(1000)
      expect(tile.owner).toBeNull()
    })

    it('should handle exact funds purchase', () => {
      const tile = { id: 'tile1', type: 'property', baseValue: 1000, owner: null }
      const result = purchaseProperty(player, tile)
      
      expect(result.success).toBe(true)
      expect(player.money).toBe(0)
    })

    it('should handle free property (baseValue: 0)', () => {
      const tile = { id: 'tile1', type: 'property', baseValue: 0, owner: null }
      const result = purchaseProperty(player, tile)
      
      expect(result.success).toBe(true)
      expect(player.money).toBe(1000)
      expect(player.properties).toContain('tile1')
    })

    it('should handle negative baseValue (edge case)', () => {
      const tile = { id: 'tile1', type: 'property', baseValue: -100, owner: null }
      const result = purchaseProperty(player, tile)
      
      expect(result.success).toBe(true)
      expect(player.money).toBe(1100)
    })
  })

  describe('checkPassGo', () => {
    it('should return true when old position > new position', () => {
      expect(checkPassGo(38, 2)).toBe(true)
      expect(checkPassGo(39, 0)).toBe(true)
      expect(checkPassGo(25, 5)).toBe(true)
    })

    it('should return false when old position <= new position', () => {
      expect(checkPassGo(0, 5)).toBe(false)
      expect(checkPassGo(10, 20)).toBe(false)
      expect(checkPassGo(5, 5)).toBe(false)
    })

    it('should handle boundary values', () => {
      expect(checkPassGo(39, 1)).toBe(true)
      expect(checkPassGo(0, 39)).toBe(false)
    })

    it('should handle same position', () => {
      expect(checkPassGo(10, 10)).toBe(false)
    })

    it('should handle wrap-around edge cases', () => {
      expect(checkPassGo(38, 0)).toBe(true)
      expect(checkPassGo(38, 39)).toBe(false)
      expect(checkPassGo(39, 1)).toBe(true)
    })
  })
})