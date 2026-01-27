# Phase 6: Multi-City Content Expansion - Implementation Plan

**Last Updated:** 2026-01-27  
**Status:** Ready to Execute

---

## Task 6.1: City 3 - Crystal Plaza Implementation

**Estimated Time:** 2-3 hours  
**Priority:** High  
**Status:** [ ] Not Started

### Step 1.1: Add City 3 Data to CITIES Object

**Location:** `web/src/components/BoardLoop.jsx`

**Add after City 2:**

```javascript
3: {
  name: 'Crystal Plaza',
  themeColor: '#a855f7',
  glowColor: 'rgba(168, 85, 247, 0.05)',
  backdropClass: 'theme-crystal-plaza',
  tiles: [
    { id: 0, type: 'Start', name: 'START', payout: 3920 },
    { id: 1, type: 'Funds', name: 'Funds', payout: 2352 },
    { id: 2, type: 'Rent', name: 'Rent' },
    { id: 3, type: 'Bonus', name: 'Bonus' },
    { id: 4, type: 'Shield', name: 'Shield', payout: 1 },
    { id: 5, type: 'Corner', name: 'BONUS' },
    { id: 6, type: 'Funds', name: 'Funds', payout: 2940 },
    { id: 7, type: 'Heist', name: 'Heist' },
    { id: 8, type: 'Landmark', name: 'Upgrade', level: 0, upgradeCost: [1960, 3920, 7840, 15680, 31360], maxLevel: 5 },
    { id: 9, type: 'Card', name: 'Card' },
    { id: 10, type: 'Corner', name: 'HEIST' },
    { id: 11, type: 'Sticker', name: 'Sticker' },
    { id: 12, type: 'Funds', name: 'Funds', payout: 3920 },
    { id: 13, type: 'Shutdown', name: 'Shutdown' },
    { id: 14, type: 'Bonus', name: 'Bonus' },
    { id: 15, type: 'Corner', name: 'HEIST' },
    { id: 16, type: 'Shield', name: 'Shield', payout: 1 },
    { id: 17, type: 'Dice', name: 'Free Dice', payout: 4 },
    { id: 18, type: 'Funds', name: 'Funds', payout: 4900 },
    { id: 19, type: 'Rent', name: 'Rent' },
  ]
},
```

**Notes:**
- Multiplier: 1.96x
- Base payout × 1.96 (e.g., $2000 → $3920)
- Landmark costs: $1960, $3920, $7840, $15680, $31360

**Checkpoint:** `[commit SHA]` - City 3 data added

---

### Step 1.2: Add City 3 Theme Styling

**Location:** `web/src/index.css`

**Add after City 2 theme:**

```css
.theme-crystal-plaza .city-grid {
  background-image: 
    linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px);
}

.theme-crystal-plaza .city-glow {
  background: radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.05) 0%, transparent 70%) !important;
}
```

**Checkpoint:** `[commit SHA]` - City 3 theme styling added

---

### Step 1.3: Update CityTransition Component

**Location:** `web/src/components/CityTransition.jsx`

**Add City 3 celebration config:**

```javascript
3: {
  name: 'Crystal Plaza',
  color: '#a855f7', // Purple
  particles: '💎',
  message: 'Enter the Crystalline Realm!',
  emoji: '💎'
},
```

**Checkpoint:** `[commit SHA]` - City 3 transition added

---

### Step 1.4: Test City 3 Unlock

**Manual Testing:**
1. Start new game
2. Progress to City 2
3. Max all 5 landmarks in City 2
4. Verify "Unlock City 3" button appears
5. Click unlock
6. Verify Crystal Plaza transition plays
7. Verify purple theme applied
8. Verify multiplier working (payouts × 1.96)

**Checkpoint:** `[commit SHA]` - City 3 tested and working

---

### Step 1.5: Write City 3 Tests

**Location:** `web/src/components/__tests__/BoardLoop.test.jsx`

**Add tests:**
- City 3 unlocks after City 2 completion
- City 3 theme applied correctly
- City 3 multiplier calculations correct
- City 3 transition animation works

**Checkpoint:** `[commit SHA]` - City 3 tests added (175+ tests passing)

---

## Task 6.2: City 4 - Starlight District Implementation

**Estimated Time:** 2-3 hours  
**Priority:** High  
**Status:** [ ] Not Started  
**Dependencies:** Task 6.1 complete

### Step 2.1: Add City 4 Data to CITIES Object

**Add after City 3:**

```javascript
4: {
  name: 'Starlight District',
  themeColor: '#3b82f6',
  glowColor: 'rgba(59, 130, 246, 0.05)',
  backdropClass: 'theme-starlight-district',
  tiles: [
    { id: 0, type: 'Start', name: 'START', payout: 5488 },
    { id: 1, type: 'Funds', name: 'Funds', payout: 3293 },
    { id: 2, type: 'Rent', name: 'Rent' },
    { id: 3, type: 'Bonus', name: 'Bonus' },
    { id: 4, type: 'Shield', name: 'Shield', payout: 1 },
    { id: 5, type: 'Corner', name: 'BONUS' },
    { id: 6, type: 'Funds', name: 'Funds', payout: 4116 },
    { id: 7, type: 'Heist', name: 'Heist' },
    { id: 8, type: 'Landmark', name: 'Upgrade', level: 0, upgradeCost: [2744, 5488, 10976, 21952, 43904], maxLevel: 5 },
    { id: 9, type: 'Card', name: 'Card' },
    { id: 10, type: 'Corner', name: 'HEIST' },
    { id: 11, type: 'Sticker', name: 'Sticker' },
    { id: 12, type: 'Funds', name: 'Funds', payout: 5488 },
    { id: 13, type: 'Shutdown', name: 'Shutdown' },
    { id: 14, type: 'Bonus', name: 'Bonus' },
    { id: 15, type: 'Corner', name: 'HEIST' },
    { id: 16, type: 'Shield', name: 'Shield', payout: 1 },
    { id: 17, type: 'Dice', name: 'Free Dice', payout: 4 },
    { id: 18, type: 'Funds', name: 'Funds', payout: 6860 },
    { id: 19, type: 'Rent', name: 'Rent' },
  ]
},
```

**Notes:**
- Multiplier: 2.744x
- Landmark costs: $2744, $5488, $10976, $21952, $43904

**Checkpoint:** `[commit SHA]` - City 4 data added

---

### Step 2.2: Add City 4 Theme Styling

```css
.theme-starlight-district .city-grid {
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
}

.theme-starlight-district .city-glow {
  background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 70%) !important;
}
```

**Checkpoint:** `[commit SHA]` - City 4 theme styling added

---

### Step 2.3: Update CityTransition Component

```javascript
4: {
  name: 'Starlight District',
  color: '#3b82f6', // Blue
  particles: '⭐',
  message: 'Reach for the Stars!',
  emoji: '⭐'
},
```

**Checkpoint:** `[commit SHA]` - City 4 transition added

---

### Step 2.4: Test City 4 Unlock

Similar to City 3 testing process.

**Checkpoint:** `[commit SHA]` - City 4 tested and working

---

### Step 2.5: Write City 4 Tests

**Checkpoint:** `[commit SHA]` - City 4 tests added (180+ tests passing)

---

## Task 6.3: City 5 - Neon Skyline Implementation

**Estimated Time:** 2-3 hours  
**Priority:** High  
**Status:** [ ] Not Started  
**Dependencies:** Task 6.2 complete

### Step 3.1: Add City 5 Data to CITIES Object

```javascript
5: {
  name: 'Neon Skyline',
  themeColor: '#06b6d4',
  glowColor: 'rgba(6, 182, 212, 0.05)',
  backdropClass: 'theme-neon-skyline',
  tiles: [
    { id: 0, type: 'Start', name: 'START', payout: 7683 },
    { id: 1, type: 'Funds', name: 'Funds', payout: 4610 },
    { id: 2, type: 'Rent', name: 'Rent' },
    { id: 3, type: 'Bonus', name: 'Bonus' },
    { id: 4, type: 'Shield', name: 'Shield', payout: 1 },
    { id: 5, type: 'Corner', name: 'BONUS' },
    { id: 6, type: 'Funds', name: 'Funds', payout: 5762 },
    { id: 7, type: 'Heist', name: 'Heist' },
    { id: 8, type: 'Landmark', name: 'Upgrade', level: 0, upgradeCost: [3842, 7683, 15366, 30733, 61466], maxLevel: 5 },
    { id: 9, type: 'Card', name: 'Card' },
    { id: 10, type: 'Corner', name: 'HEIST' },
    { id: 11, type: 'Sticker', name: 'Sticker' },
    { id: 12, type: 'Funds', name: 'Funds', payout: 7683 },
    { id: 13, type: 'Shutdown', name: 'Shutdown' },
    { id: 14, type: 'Bonus', name: 'Bonus' },
    { id: 15, type: 'Corner', name: 'HEIST' },
    { id: 16, type: 'Shield', name: 'Shield', payout: 1 },
    { id: 17, type: 'Dice', name: 'Free Dice', payout: 4 },
    { id: 18, type: 'Funds', name: 'Funds', payout: 9604 },
    { id: 19, type: 'Rent', name: 'Rent' },
  ]
},
```

**Notes:**
- Multiplier: 3.8416x
- Landmark costs: $3842, $7683, $15366, $30733, $61466

**Checkpoint:** `[commit SHA]` - City 5 data added

---

### Step 3.2: Add City 5 Theme Styling

```css
.theme-neon-skyline .city-grid {
  background-image: 
    linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
}

.theme-neon-skyline .city-glow {
  background: radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 70%) !important;
}
```

**Checkpoint:** `[commit SHA]` - City 5 theme styling added

---

### Step 3.3: Update CityTransition Component

```javascript
5: {
  name: 'Neon Skyline',
  color: '#06b6d4', // Cyan
  particles: '🌆',
  message: 'Welcome to the Future!',
  emoji: '🌆'
},
```

**Checkpoint:** `[commit SHA]` - City 5 transition added

---

### Step 3.4: Add City 5 Completion Celebration

When player maxes all landmarks in City 5, show special "Master Builder" message:

```javascript
if (cityLevel === 5 && allLandmarksMaxed) {
  showNotification('🎉 Master Builder! You\'ve conquered all 5 cities!', 'success', 5000);
  // Play special celebration
  addParticleEffect('fireworks', window.innerWidth / 2, window.innerHeight / 2, { 
    count: 50, 
    distance: 200,
    duration: 3,
    customColors: ['#2cf7cc', '#fbbf24', '#a855f7', '#3b82f6', '#06b6d4']
  });
}
```

**Checkpoint:** `[commit SHA]` - City 5 completion celebration added

---

### Step 3.5: Test City 5 Unlock

Similar to previous cities.

**Checkpoint:** `[commit SHA]` - City 5 tested and working

---

### Step 3.6: Write City 5 Tests

**Checkpoint:** `[commit SHA]` - City 5 tests added (185+ tests passing)

---

## Task 6.4: Integration & Polish

**Estimated Time:** 1-2 hours  
**Priority:** Medium  
**Status:** [ ] Not Started  
**Dependencies:** Tasks 6.1, 6.2, 6.3 complete

### Step 4.1: Full Progression Test

**Manual Testing:**
1. Start new game
2. Play through City 1 → City 5
3. Verify all transitions
4. Verify all themes
5. Verify economic scaling
6. Check performance (FPS, memory)

**Checkpoint:** `[notes]` - Full progression tested

---

### Step 4.2: Update City Indicator UI

Update the HUD to show all 5 cities in progression:

```javascript
// In HUD, show city progress
Cities: 1 ● 2 ● 3 ○ ○ ○  (example: at City 2, completed Cities 1-2)
```

**Checkpoint:** `[commit SHA]` - City indicator updated

---

### Step 4.3: Performance Verification

Run performance tests:
- Load all 5 cities
- Check FPS during gameplay
- Monitor memory usage
- Verify no lag during transitions

**Target:** Maintain 60 FPS

**Checkpoint:** `[notes]` - Performance verified

---

### Step 4.4: Update Documentation

Update the following files:

**README.md:**
- Update "Cities: 35 total (currently 5 implemented)"
- Add Cities 3-5 to features list

**CHANGELOG.md:**
- Add Phase 6 entry with all 3 cities

**KNOWLEDGE_BASE.md:**
- Add Phase 6 entry
- Update statistics (commits, files, tests)

**STATUS.md:**
- Mark Phase 6 complete
- Update current features list

**CURRENT_PHASE.md:**
- Update to Phase 6 complete
- Point to Phase 7

**Checkpoint:** `[commit SHA]` - Documentation updated

---

### Step 4.5: Final Testing

Run full test suite:

```powershell
cd web
npm test
```

**Expected:** 185+ tests passing (100%)

**Checkpoint:** `[commit SHA]` - All tests passing

---

## Phase 6 Completion Checklist

- [ ] Task 6.1: City 3 - Crystal Plaza complete
- [ ] Task 6.2: City 4 - Starlight District complete
- [ ] Task 6.3: City 5 - Neon Skyline complete
- [ ] Task 6.4: Integration & Polish complete
- [ ] All 5 cities functional
- [ ] All transitions working
- [ ] Economic scaling balanced
- [ ] 185+ tests passing (100%)
- [ ] Performance at 60 FPS
- [ ] Documentation updated
- [ ] KNOWLEDGE_BASE.md updated
- [ ] Git commits pushed

---

## Success Criteria

✅ Players can progress from City 1 → City 5  
✅ Each city has unique visual theme  
✅ Economic scaling feels balanced  
✅ City transitions are celebratory  
✅ No performance issues  
✅ All tests passing  
✅ Code is clean and documented

---

**Let's build an epic 5-city experience! 🏙️✨**
