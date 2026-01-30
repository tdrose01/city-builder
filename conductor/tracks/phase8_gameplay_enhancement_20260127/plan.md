# Phase 8: Gameplay Enhancement - Implementation Plan

**Last Updated:** 2026-01-30  
**Status:** In Progress (Tasks 8.1-8.2 complete)

---

## Task 8.1: New Tile Types Implementation

**Estimated Time:** 3-4 hours  
**Priority:** High  
**Status:** [x] Complete

### Step 1.1: Create Tile Type Configuration File

**Location:** `web/src/config/tileTypes.js` (NEW FILE)

```javascript
/**
 * Extended tile type configurations
 * Includes new gameplay tile types: Lottery, Tax, Jail, Fortune
 */

export const TILE_CONFIGS = {
  // Existing tiles...
  
  LOTTERY: {
    name: 'Lottery',
    icon: '🎰',
    color: '#fbbf24',
    ticketCost: (cityLevel) => 500 * Math.pow(1.4, cityLevel - 1),
    smallWinChance: 0.20,  // 20%
    smallWinMultiplier: 10,
    jackpotChance: 0.05,   // 5%
    jackpotMultiplier: 100,
    description: 'Try your luck!',
  },
  
  TAX: {
    name: 'Tax',
    icon: '💸',
    color: '#ef4444',
    taxRate: 0.10,  // 10% of funds
    minTax: 100,
    maxTax: (cityLevel) => 5000 * Math.pow(1.4, cityLevel - 1),
    description: 'Pay your dues',
  },
  
  JAIL: {
    name: 'Jail',
    icon: '🔒',
    color: '#6b7280',
    turnsSkipped: 3,
    bailCost: (cityLevel) => 1000 * Math.pow(1.4, cityLevel - 1),
    doublesEscapeChance: 1.0,  // 100% if roll doubles
    description: 'Caught!',
  },
  
  FORTUNE: {
    name: 'Fortune',
    icon: '🔮',
    color: '#a855f7',
    events: [
      // Positive (60%)
      { type: 'BONUS_FUNDS', weight: 30, value: (city) => 2000 * Math.pow(1.4, city - 1) },
      { type: 'FREE_DICE', weight: 15, value: 5 },
      { type: 'SHIELDS', weight: 15, value: 2 },
      
      // Neutral (30%)
      { type: 'TELEPORT', weight: 15, value: null },
      { type: 'SWAP_LANDMARK', weight: 15, value: null },
      
      // Negative (10%)
      { type: 'LOSE_FUNDS', weight: 5, value: (city) => 1000 * Math.pow(1.4, city - 1) },
      { type: 'SKIP_TURN', weight: 5, value: 1 },
    ],
    description: 'Twist of fate',
  }
};
```

**Checkpoint:** `[commit SHA]` - Tile type configs added

---

### Step 1.2: Implement Lottery Tile Component

**Location:** `web/src/components/LotteryTile.jsx` (NEW FILE)

```javascript
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TILE_CONFIGS } from '../config/tileTypes';

/**
 * LotteryTile Component
 * Interactive scratch-off lottery experience
 */
export default function LotteryTile({ 
  cityLevel, 
  onResult, 
  onClose 
}) {
  const [scratching, setScratching] = useState(false);
  const [result, setResult] = useState(null);
  
  const config = TILE_CONFIGS.LOTTERY;
  const ticketCost = config.ticketCost(cityLevel);
  
  const scratchTicket = () => {
    setScratching(true);
    
    const roll = Math.random();
    let winAmount = 0;
    let winType = 'lose';
    
    if (roll < config.jackpotChance) {
      winAmount = ticketCost * config.jackpotMultiplier;
      winType = 'jackpot';
    } else if (roll < config.jackpotChance + config.smallWinChance) {
      winAmount = ticketCost * config.smallWinMultiplier;
      winType = 'win';
    }
    
    setTimeout(() => {
      setResult({ winAmount, winType, ticketCost });
      onResult(winAmount - ticketCost);  // Net gain/loss
    }, 2000);
  };
  
  return (
    <motion.div
      className="lottery-modal"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <h2>🎰 Lottery Ticket</h2>
      <p>Cost: ${ticketCost.toLocaleString()}</p>
      
      {!scratching && (
        <button onClick={scratchTicket}>
          Scratch to Reveal!
        </button>
      )}
      
      {scratching && !result && (
        <div className="scratch-animation">
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            ✨ Scratching... ✨
          </motion.div>
        </div>
      )}
      
      <AnimatePresence>
        {result && (
          <motion.div
            className={`lottery-result ${result.winType}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            {result.winType === 'jackpot' && (
              <>
                <h1>🎉 JACKPOT! 🎉</h1>
                <p>You won ${result.winAmount.toLocaleString()}!</p>
              </>
            )}
            {result.winType === 'win' && (
              <>
                <h2>🎊 Winner! 🎊</h2>
                <p>You won ${result.winAmount.toLocaleString()}!</p>
              </>
            )}
            {result.winType === 'lose' && (
              <>
                <h3>Better luck next time!</h3>
                <p>Lost ${result.ticketCost.toLocaleString()}</p>
              </>
            )}
            <button onClick={onClose}>Continue</button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
```

**Checkpoint:** `[commit SHA]` - Lottery tile component complete

---

### Step 1.3: Implement Tax, Jail, Fortune Tiles

Similar pattern to Lottery tile:
- Create `TaxTile.jsx` - Animated tax collection
- Create `JailTile.jsx` - Jail escape mechanics
- Create `FortuneTile.jsx` - Random event selector

**Checkpoint:** `[commit SHA]` - All tile components complete

---

### Step 1.4: Integrate New Tiles into BoardLoop

**Location:** `web/src/components/BoardLoop.jsx`

Update `CITIES` object to include new tiles:

```javascript
// Example for City 1
tiles: [
  { id: 0, type: 'Start', name: 'START', payout: 2000 },
  { id: 1, type: 'Funds', name: 'Funds', payout: 1200 },
  { id: 2, type: 'Lottery', name: 'Lottery' },  // NEW
  { id: 3, type: 'Bonus', name: 'Bonus' },
  { id: 4, type: 'Tax', name: 'Tax' },           // NEW
  // ... continue pattern
  { id: 7, type: 'Jail', name: 'Jail' },         // NEW
  // ...
  { id: 11, type: 'Fortune', name: 'Fortune' },  // NEW
  // ...
]
```

Add tile handlers:

```javascript
const handleTileLanding = useCallback((tile) => {
  switch(tile.type) {
    case 'Lottery':
      setActiveMiniGame({ type: 'lottery', tile });
      break;
    case 'Tax':
      handleTaxTile(tile);
      break;
    case 'Jail':
      handleJailTile(tile);
      break;
    case 'Fortune':
      handleFortuneTile(tile);
      break;
    // ... existing cases
  }
}, [cityLevel, funds]);
```

**Checkpoint:** `8f32cfa` - New tiles integrated

---

### Step 1.5: Write Tile Tests

**Location:** `web/src/components/__tests__/TileTypes.test.jsx` (NEW)

```javascript
describe('New Tile Types', () => {
  describe('Lottery Tile', () => {
    test('calculates ticket cost correctly per city', () => {
      expect(TILE_CONFIGS.LOTTERY.ticketCost(1)).toBe(500);
      expect(TILE_CONFIGS.LOTTERY.ticketCost(2)).toBe(700);
      expect(TILE_CONFIGS.LOTTERY.ticketCost(5)).toBe(1921);
    });
    
    test('jackpot has 5% chance', () => {
      // ... test odds
    });
    
    test('renders lottery UI', () => {
      // ... component test
    });
  });
  
  // Similar for Tax, Jail, Fortune tiles
});
```

**Checkpoint:** `8f32cfa` - Tile tests passing (~10 new tests)

---

## Task 8.2: Power-Up System

**Estimated Time:** 2-3 hours  
**Priority:** High  
**Status:** [x] Complete

### Step 2.1: Create Power-Up Configuration

**Location:** `web/src/config/powerUps.js` (NEW)

```javascript
export const POWER_UPS = {
  HOT_STREAK: {
    id: 'hot_streak',
    name: 'Hot Streak',
    icon: '🔥',
    type: 'passive',
    cost: 0,  // Auto-activated
    duration: 5,  // rolls
    effect: { fundsMultiplier: 1.5 },
    trigger: { consecutivePositiveTiles: 3 },
    description: '+50% funds for 5 rolls after 3 positive tiles',
  },
  
  MEGA_MULTIPLIER: {
    id: 'mega_multiplier',
    name: 'Mega Multiplier',
    icon: '💪',
    type: 'active',
    cost: (cityLevel) => 2000 * Math.pow(1.4, cityLevel - 1),
    duration: 1,  // Next roll only
    effect: { rewardMultiplier: 3 },
    cooldown: 0,
    description: '3x rewards on next roll',
  },
  
  SHIELD_STORM: {
    id: 'shield_storm',
    name: 'Shield Storm',
    icon: '🛡️',
    type: 'active',
    cost: (cityLevel) => 1500 * Math.pow(1.4, cityLevel - 1),
    effect: { shields: 3 },
    cooldown: 30,  // seconds
    description: 'Gain 3 shields instantly',
  },
  
  LUCKY_DICE: {
    id: 'lucky_dice',
    name: 'Lucky Dice',
    icon: '🎲',
    type: 'active',
    cost: (cityLevel) => 3000 * Math.pow(1.4, cityLevel - 1),
    effect: { guaranteeDoubles: true },
    duration: 1,
    description: 'Next roll is guaranteed doubles',
  },
  
  SPEED_BOOST: {
    id: 'speed_boost',
    name: 'Speed Boost',
    icon: '🏃',
    type: 'passive',
    cost: (cityLevel) => 2500 * Math.pow(1.4, cityLevel - 1),
    duration: 10,  // rolls
    effect: { diceCostMultiplier: 0.5 },
    description: 'Rolls cost 50% less dice for 10 rolls',
  },
  
  MONEY_MAGNET: {
    id: 'money_magnet',
    name: 'Money Magnet',
    icon: '💰',
    type: 'passive',
    cost: (cityLevel) => 5000 * Math.pow(1.4, cityLevel - 1),
    duration: Infinity,  // Entire city
    effect: { fundsFromFundsTiles: 1.25 },
    maxPerCity: 1,
    description: '+25% funds from Funds tiles for entire city',
  },
};
```

**Checkpoint:** `[commit SHA]` - Power-up configs added

---

### Step 2.2: Create PowerUpShop Component

**Location:** `web/src/components/PowerUpShop.jsx` (NEW)

**Checkpoint:** `[commit SHA]` - Power-up shop complete

---

### Step 2.3: Create PowerUpIndicator Component

Shows active power-ups in HUD.

**Location:** `web/src/components/PowerUpIndicator.jsx` (NEW)

**Checkpoint:** `[commit SHA]` - Power-up indicator complete

---

### Step 2.4: Integrate Power-Ups into BoardLoop

Add power-up state and logic to apply effects.

**Checkpoint:** `[commit SHA]` - Power-ups integrated

---

### Step 2.5: Write Power-Up Tests

**Checkpoint:** `[commit SHA]` - Power-up tests passing (~12 new tests)

---

## Task 8.3: Special Events System

**Estimated Time:** 2-3 hours  
**Priority:** Medium  
**Status:** [ ] Not Started

### Step 3.1: Create Event Configuration

**Location:** `web/src/config/events.js` (NEW)

**Checkpoint:** `[commit SHA]` - Event configs added

---

### Step 3.2: Implement Event Trigger Logic

Add event probability system to BoardLoop.

**Checkpoint:** `[commit SHA]` - Event triggers working

---

### Step 3.3: Create SpecialEventModal Component

**Location:** `web/src/components/SpecialEventModal.jsx` (NEW)

**Checkpoint:** `[commit SHA]` - Event modal complete

---

### Step 3.4: Write Event Tests

**Checkpoint:** `[commit SHA]` - Event tests passing (~8 new tests)

---

## Task 8.4: Mini-Games

**Estimated Time:** 2-3 hours  
**Priority:** Medium  
**Status:** [ ] Not Started

### Step 4.1: Create SlotMachine Component

**Location:** `web/src/components/SlotMachine.jsx` (NEW)

**Checkpoint:** `[commit SHA]` - Slot machine complete

---

### Step 4.2: Create WheelOfFortune Component

**Location:** `web/src/components/WheelOfFortune.jsx` (NEW)

**Checkpoint:** `[commit SHA]` - Wheel complete

---

### Step 4.3: Write Mini-Game Tests

**Checkpoint:** `[commit SHA]` - Mini-game tests passing (~6 new tests)

---

## Task 8.5: Enhanced Combo System

**Estimated Time:** 1-2 hours  
**Priority:** Low  
**Status:** [ ] Not Started

### Step 5.1: Implement Combo Chain Logic

Add combo tracking to BoardLoop.

**Checkpoint:** `[commit SHA]` - Combo logic complete

---

### Step 5.2: Create ComboTracker Component

**Location:** `web/src/components/ComboTracker.jsx` (NEW)

**Checkpoint:** `[commit SHA]` - Combo tracker complete

---

### Step 5.3: Write Combo Tests

**Checkpoint:** `[commit SHA]` - Combo tests passing (~4 new tests)

---

## Phase 8 Completion Checklist

- [x] Task 8.1: New Tile Types complete
- [x] Task 8.2: Power-Up System complete
- [ ] Task 8.3: Special Events System complete
- [ ] Task 8.4: Mini-Games complete
- [ ] Task 8.5: Enhanced Combo System complete
- [ ] 230+ tests passing (100%)
- [ ] Performance at 60 FPS
- [ ] Documentation updated
- [ ] Git commits pushed

---

## Success Criteria

✅ 4 new tile types functional (Lottery, Tax, Jail, Fortune)  
✅ 6 power-ups working (3 active, 3 passive)  
✅ Special events system implemented  
✅ 2 mini-games playable (Slots, Wheel)  
✅ Combo system enhanced  
✅ All tests passing  
✅ Code is clean and documented

---

**Let's make City Slacker even more fun! 🎮✨**
