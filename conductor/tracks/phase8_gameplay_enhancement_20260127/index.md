# Phase 8: Gameplay Enhancement - New Mechanics & Features

**Track ID:** `phase8_gameplay_enhancement_20260127`  
**Created:** 2026-01-27  
**Status:** 🚀 Active  
**Estimated Duration:** 8-10 hours

---

## 🎯 Overview

Enhance City Slacker's core gameplay loop with exciting new mechanics, tile types, power-ups, and special events. Build on the solid 5-city foundation to create deeper, more engaging moment-to-moment gameplay.

---

## 📋 Goals

### Primary Goals
1. **Add new interactive tile types** (Lottery, Tax, Jail, Fortune)
2. **Implement power-up system** (multipliers, shields, dice bonuses)
3. **Create special events system** (random events, city-wide effects)
4. **Add mini-games** (slot machine, wheel of fortune)
5. **Enhance existing mechanics** (combo chains, streak bonuses)
6. **Maintain 100% test coverage**

### Success Criteria
- ✅ 4+ new tile types functional
- ✅ 5+ power-ups implemented
- ✅ Special events system working
- ✅ 2+ mini-games playable
- ✅ Tests passing (target: 230+ tests)
- ✅ Performance maintained (60 FPS)

---

## ✅ Current Progress

- Task 8.1 complete: Lottery, Tax, Jail, Fortune tiles integrated
- Task 8.2 complete: Power-up shop, indicator, and 6 power-up effects
- Task 8.3 complete: Special events system (city-wide, random, milestone)
- Task 8.4 complete: Mini-games (Slot Machine + Wheel of Fortune via Card tile)
- Fortune rewards include Tax Haven + Get Out of Jail Free
- Tests passing: 229/229
- Next: Task 8.5 - Enhanced Combo System

---

## 🎮 Feature Specifications

### Task 8.1: New Tile Types (3-4h)

#### Lottery Tile 🎰
**Mechanics:**
- Land to buy lottery ticket ($500-$2000 based on city)
- 20% chance to win 10x your ticket price
- 5% chance to win jackpot (100x ticket price)
- Animated scratch-off reveal

**Visual:**
- Gold ticket icon
- Sparkle animation on win
- Confetti burst for jackpot

#### Tax Tile 💸
**Mechanics:**
- Lose 5-10% of current funds
- Minimum tax: $100
- Maximum tax: $5000 (scaled by city)
- Can be blocked by "Tax Haven" power-up

**Visual:**
- Red warning icon
- Draining animation for funds
- Receipt paper graphic

#### Jail Tile 🔒
**Mechanics:**
- Skip 1-3 turns (roll to escape)
- Pay bail ($1000-$5000 scaled by city)
- OR roll doubles to escape free
- "Get Out of Jail Free" card usable

**Visual:**
- Prison bars icon
- Shake animation when trying to escape
- Key icon for card

#### Fortune Tile 🔮
**Mechanics:**
- Random event from pool of 10+
- 60% positive (bonus funds, free dice, shields)
- 30% neutral (move to tile, swap landmarks)
- 10% negative (lose funds, skip turn)

**Visual:**
- Crystal ball icon
- Mystical glow effect
- Card flip animation for reveal

---

### Task 8.2: Power-Up System (2-3h)

#### Power-Up Types

**🔥 Hot Streak (Passive)**
- Activates after 3 consecutive positive tiles
- +50% funds from all tiles
- Lasts 5 rolls
- Visual: Fire trail behind player

**💪 Mega Multiplier (Active)**
- Use before roll
- Next roll rewards are 3x
- Cost: $2000 (scaled)
- Visual: Golden glow effect

**🛡️ Shield Storm (Active)**
- Gain 3 shields instantly
- Cost: $1500 (scaled)
- 30-second cooldown
- Visual: Rotating shield barrier

**🎲 Lucky Dice (Active)**
- Guarantees doubles on next roll
- Cost: $3000 (scaled)
- One-time use
- Visual: Golden dice animation

**🏃 Speed Boost (Passive)**
- Rolls cost 50% less dice
- Lasts 10 rolls
- Visual: Speed lines

**💰 Money Magnet (Passive)**
- +25% funds from Funds tiles
- Lasts entire city
- One per city
- Visual: Coin orbit effect

#### Power-Up Shop
- Accessible from HUD
- Purchase with funds
- Limited stock (refresh per city)
- Discount on bulk purchase

---

### Task 8.3: Special Events System (2-3h)

#### Event Types

**🌟 City-Wide Events (Rare)**
- **Golden Hour:** All rewards +100% for 10 rolls
- **Tax Holiday:** No rent/tax for 5 rolls
- **Sticker Frenzy:** 2x sticker drop rate for 15 rolls
- **Jackpot Day:** Lottery wins guaranteed for 3 rolls

**⚡ Random Events (Common)**
- **Bank Error:** Gain/lose random $500-$2000
- **Street Performer:** Skip turn but gain $1000
- **Parade:** Move forward 5 spaces
- **Construction:** Skip landmark upgrade this turn
- **Lucky Find:** Gain random power-up
- **Pickpocket:** Lose 10% funds (max $1000)

**🎊 Milestone Events (Triggered)**
- Every 50 rolls: Bonus reward chest
- Every 100 funds earned: Free dice pack
- Every 10 landmarks: Special sticker
- City completion: Prestige token

#### Event Display
- Toast notification
- Modal for major events
- Event log/history
- Event calendar (upcoming)

---

### Task 8.4: Mini-Games (2-3h)

#### Slot Machine 🎰
**Mechanics:**
- Cost: $1000 per spin (scaled)
- 3 reels with 6 symbols
- Match 2: 2x bet
- Match 3: 10x bet
- Jackpot (3 💎): 100x bet
- Available on specific tiles

**Visual:**
- Animated spinning reels
- Vegas-style graphics
- Win celebration effects

#### Wheel of Fortune 🎡
**Mechanics:**
- Free spin once per city
- 12 segments with prizes:
  - $5000 (3 segments)
  - Free Dice x10 (2 segments)
  - Shield x2 (2 segments)
  - Power-up (2 segments)
  - Sticker Pack (2 segments)
  - BANKRUPT (1 segment)

**Visual:**
- Spinning wheel animation
- Pointer with click sound
- Prize reveal animation

---

### Task 8.5: Enhanced Combo System (1-2h)

#### Combo Chain
- Land on same tile type consecutively
- **Chain 2:** +10% bonus
- **Chain 3:** +25% bonus
- **Chain 4:** +50% bonus
- **Chain 5+:** +100% bonus + power-up

#### Streak Bonuses
- **Perfect Roll:** Land exactly on target tile
- **Speed Run:** Complete lap in <5 rolls
- **Clean Lap:** Avoid all negative tiles
- **Collector:** Hit all tile types in one lap

#### Visual Feedback
- Combo counter HUD element
- Multiplier text pop
- Chain break animation
- Achievement badges

---

## 📊 Technical Architecture

### State Management

```javascript
// New state additions to BoardLoop
const [activePowerUps, setActivePowerUps] = useState([]);
const [specialEvent, setSpecialEvent] = useState(null);
const [comboChain, setComboChain] = useState({ type: null, count: 0 });
const [miniGameActive, setMiniGameActive] = useState(null);
const [eventHistory, setEventHistory] = useState([]);
```

### New Components

```
web/src/components/
├── PowerUpShop.jsx           # Power-up purchase UI
├── PowerUpIndicator.jsx      # Active power-ups display
├── SpecialEventModal.jsx     # Event announcements
├── SlotMachine.jsx           # Slot machine mini-game
├── WheelOfFortune.jsx        # Wheel spinner mini-game
├── ComboTracker.jsx          # Combo chain display
└── __tests__/
    ├── PowerUpShop.test.jsx
    ├── SlotMachine.test.jsx
    └── WheelOfFortune.test.jsx
```

### Configuration

```javascript
// config/gameplay.js (NEW)
export const TILE_TYPES = {
  LOTTERY: { /* ... */ },
  TAX: { /* ... */ },
  JAIL: { /* ... */ },
  FORTUNE: { /* ... */ }
};

export const POWER_UPS = {
  HOT_STREAK: { /* ... */ },
  MEGA_MULTIPLIER: { /* ... */ },
  // ...
};

export const EVENTS = {
  GOLDEN_HOUR: { /* ... */ },
  TAX_HOLIDAY: { /* ... */ },
  // ...
};
```

---

## 🧪 Testing Strategy

### Unit Tests
- Tile type logic (lottery odds, tax calculation)
- Power-up activation/deactivation
- Event triggering conditions
- Mini-game win/loss logic
- Combo chain calculation

### Integration Tests
- Power-ups affecting tile rewards
- Events modifying game state
- Mini-games with save/load
- Combo chains persisting across rolls

### UI Tests
- Power-up shop interactions
- Mini-game controls
- Event modal display
- Combo tracker updates

**Target:** 230+ total tests (add ~40 new tests)

---

## 🎨 Visual Design

### Color Scheme
- **Power-Ups:** Gold (#fbbf24) with glow
- **Events:** Purple (#a855f7) with shimmer
- **Mini-Games:** Neon multi-color
- **Combos:** Orange (#f97316) with pulse

### Animations
- Power-up activation: Scale + glow
- Event trigger: Fade in from top
- Mini-game win: Confetti + sparkles
- Combo increase: Number pulse + color shift

---

## 📦 Tasks Breakdown

### Task 8.1: New Tile Types (3-4h)
1. Implement Lottery tile logic + UI
2. Implement Tax tile logic + UI
3. Implement Jail tile logic + UI
4. Implement Fortune tile logic + UI
5. Integrate tiles into board
6. Write tile tests

### Task 8.2: Power-Up System (2-3h)
1. Create power-up data structure
2. Implement PowerUpShop component
3. Implement PowerUpIndicator component
4. Add power-up logic to BoardLoop
5. Create purchase/activation flow
6. Write power-up tests

### Task 8.3: Special Events System (2-3h)
1. Create event data structure
2. Implement event trigger logic
3. Create SpecialEventModal component
4. Add event effects to game loop
5. Implement event history
6. Write event tests

### Task 8.4: Mini-Games (2-3h)
1. Create SlotMachine component
2. Implement slot logic + animations
3. Create WheelOfFortune component
4. Implement wheel logic + animations
5. Integrate into board tiles
6. Write mini-game tests

### Task 8.5: Enhanced Combo System (1-2h)
1. Implement combo chain logic
2. Create ComboTracker component
3. Add streak bonus calculations
4. Visual feedback for combos
5. Write combo tests

---

## 🎯 Quality Gates

Before marking Phase 8 complete:

- [ ] All 4 new tile types working
- [ ] 6 power-ups implemented
- [ ] Special events system functional
- [ ] 2 mini-games playable
- [ ] Combo system enhanced
- [ ] 230+ tests passing (100%)
- [ ] No performance degradation
- [ ] Documentation updated

---

## 📚 Related Documents

- [Detailed Plan](./plan.md) - Step-by-step implementation
- [Specifications](./spec.md) - Technical requirements
- [Testing Guide](./testing.md) - Test scenarios

---

## 🎉 Expected Outcome

By the end of Phase 8, players will have:
- ✨ Exciting new tile variety (10+ tile types)
- 💪 Strategic power-up choices
- 🎲 Fun mini-games for variety
- ⚡ Dynamic special events
- 🔥 Rewarding combo chains
- 🎮 Deeper, more engaging gameplay

---

**Ready to level up the gameplay! 🎮✨**
