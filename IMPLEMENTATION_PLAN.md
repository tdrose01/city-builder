# City Slacker - Implementation Plan
**Created:** 2026-01-21  
**Status:** Active

## Overview
This document outlines the detailed implementation plan for the next four phases of City Slacker development following the successful visual cleanup and performance optimization.

---

## Phase 1: Visual Cleanup Validation ✅

### Objective
Ensure all game mechanics work correctly and perform well after removing glow effects, dark overlays, and parallax movement.

### Tasks

#### 1.1 Test Core Gameplay
**Priority:** High  
**Estimated Time:** 2 hours

**Test Cases:**
- [ ] Roll dice and verify dice animation works correctly
- [ ] Verify player piece moves to correct tiles
- [ ] Test all tile types resolve correctly (Funds, Heist, Shield, Rent, Bonus, Shutdown, Sticker, Card, Dice, Landmark)
- [ ] Confirm landmark upgrade flow works
- [ ] Test autoroll toggle functionality
- [ ] Verify mission tracking updates correctly
- [ ] Test event progress and milestone claims
- [ ] Verify sticker pack opening and collection
- [ ] Test prestige system reset and reward scaling
- [ ] Confirm mission reset cycle works

**Success Criteria:**
- All game mechanics function without errors
- No visual artifacts or missing elements
- Player can complete a full gameplay loop

#### 1.2 Performance Validation
**Priority:** High  
**Estimated Time:** 1 hour

**Metrics to Measure:**
- [ ] FPS during idle state (target: 60fps)
- [ ] FPS during dice roll animation (target: 55-60fps)
- [ ] FPS during player piece movement (target: 55-60fps)
- [ ] Page load time (target: <2s)
- [ ] CPU usage during gameplay (compare before/after visual cleanup)
- [ ] Memory usage over 5-minute session

**Tools:**
- Chrome DevTools Performance tab
- Firefox Performance tools
- Browser FPS counter

**Success Criteria:**
- Consistent 60fps during gameplay
- No performance degradation over extended play
- Improved or maintained performance vs. before visual cleanup

#### 1.3 UI/UX Review
**Priority:** Medium  
**Estimated Time:** 1.5 hours

**Review Checklist:**
- [ ] All text is readable without glow effects
- [ ] Tile borders provide sufficient visual separation
- [ ] Board center is visible and not too dark
- [ ] Progress bars are clear without glows
- [ ] Button states (hover, active, disabled) are distinct
- [ ] Tab navigation is intuitive
- [ ] Floating action buttons are visible and accessible
- [ ] Notifications appear correctly
- [ ] Color contrast meets accessibility standards (WCAG AA)

**Success Criteria:**
- All UI elements clearly visible
- No accessibility issues
- Professional, clean appearance

#### 1.4 Cross-Browser Testing
**Priority:** Medium  
**Estimated Time:** 2 hours

**Browsers to Test:**
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Test on Each:**
- Basic gameplay loop
- Visual rendering (no glitches)
- Performance (smooth animations)
- Responsive layout

**Success Criteria:**
- Game works consistently across all browsers
- No browser-specific visual bugs
- Acceptable performance on mobile

---

## Phase 2: Persistence Implementation 💾

### Objective
Add localStorage-based save system to persist player progress across sessions.

### Architecture

#### 2.1 Data Structure
```javascript
const SAVE_KEY = 'city_slacker_save_v1';

const SaveState = {
  version: 1,
  savedAt: timestamp,
  
  // Core Resources
  funds: number,
  dice: number,
  shields: number,
  cityLevel: number,
  
  // Progression
  eventProgress: number,
  eventPrestigeLevel: number,
  milestoneRewardsClaimed: boolean[],
  
  // Missions
  missions: Mission[],
  missionCycle: number,
  
  // Stickers
  playerStickers: Sticker[],
  dust: number,
  setTokens: number,
  setCompletionRewardsClaimed: object,
  
  // Landmarks
  tiles: Tile[], // Contains landmark levels
  totalUpgrades: number,
  
  // Stats
  totalRolls: number,
  totalShieldsCollected: number,
  fundsTilesLanded: number,
  diceStreak: number,
  
  // UI State
  hasNewSticker: boolean,
  comboTarget: number,
  currentCombo: number
};
```

#### 2.2 Implementation Tasks

**2.2.1 Create Save System Module**
**Priority:** High  
**Estimated Time:** 3 hours

- [ ] Create `web/src/utils/saveSystem.js`
- [ ] Implement `saveGame(state)` function
- [ ] Implement `loadGame()` function
- [ ] Implement `clearSave()` function
- [ ] Implement `hasSaveData()` function
- [ ] Add version migration system for future updates
- [ ] Add error handling for corrupted saves

```javascript
// Example implementation
export const saveGame = (state) => {
  try {
    const saveData = {
      version: 1,
      savedAt: Date.now(),
      ...state
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (error) {
    console.error('Failed to save game:', error);
    return false;
  }
};

export const loadGame = () => {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (!saved) return null;
    
    const data = JSON.parse(saved);
    
    // Version migration if needed
    if (data.version !== 1) {
      return migrateData(data);
    }
    
    return data;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
};
```

**2.2.2 Integrate into BoardLoop**
**Priority:** High  
**Estimated Time:** 2 hours

- [ ] Import save system utilities
- [ ] Add `useEffect` to load game on mount
- [ ] Create `saveGameState()` function that extracts current state
- [ ] Add auto-save on key state changes (funds, dice, shields, city level)
- [ ] Add debounced auto-save (save at most once per 2 seconds)
- [ ] Show "Game Saved" indicator briefly when saving

**2.2.3 Add UI Controls**
**Priority:** Medium  
**Estimated Time:** 1.5 hours

- [ ] Add "New Game" button to UI (in settings or footer)
- [ ] Add confirmation dialog for "New Game"
- [ ] Show last save timestamp in UI
- [ ] Add manual "Save Game" button (optional)
- [ ] Add visual indicator when game is loaded from save

**2.2.4 Testing**
**Priority:** High  
**Estimated Time:** 2 hours

- [ ] Test save/load cycle works correctly
- [ ] Test with missing/corrupted localStorage data
- [ ] Test localStorage quota exceeded scenario
- [ ] Test incognito/private browsing mode
- [ ] Test "New Game" clears data correctly
- [ ] Verify no data loss on state updates

**Success Criteria:**
- Player progress persists across page reloads
- Save system handles errors gracefully
- "New Game" resets to initial state
- Performance impact is negligible

---

## Phase 3: Gameplay Balance Tuning ⚖️

### Objective
Tune game pacing to achieve target 60-120 second sessions with satisfying progression.

### Analysis Phase

#### 3.1 Current State Analysis
**Priority:** High  
**Estimated Time:** 2 hours

**Data to Collect:**
- [ ] Play 10 sessions and record timings
- [ ] Calculate average session length
- [ ] Count average rolls per session
- [ ] Measure time to first milestone
- [ ] Measure time to city completion
- [ ] Track funds generation vs. upgrade costs
- [ ] Analyze mission completion rates

**Metrics Template:**
```
Session 1: ____ seconds, ____ rolls, ____ milestones, ____ missions
Session 2: ____ seconds, ____ rolls, ____ milestones, ____ missions
...
Average: ____ seconds
```

#### 3.2 Pacing Adjustments
**Priority:** High  
**Estimated Time:** 3 hours

**Areas to Tune:**

**3.2.1 Dice Economy**
- [ ] Review starting dice count (current: 50)
- [ ] Adjust dice tile payouts (current: 4-5)
- [ ] Review START tile bonus (current: 2000 funds only)
- [ ] Consider adding dice bonus to START (e.g., +2 dice)

**3.2.2 Event Progression**
- [ ] Review points per roll (current: 10)
- [ ] Adjust milestone thresholds (current: 10, 20, 40, 80, 120)
- [ ] Consider adding 6th milestone at 160 for longer sessions
- [ ] Review doubles bonus multiplier (current: 0.35)

**3.2.3 Funds Economy**
- [ ] Review funds tile payouts by city
- [ ] Adjust landmark upgrade costs
- [ ] Review heist percentage (needs to be balanced)
- [ ] Tune rent deductions
- [ ] Adjust START tile payout

**3.2.4 Mission Difficulty**
- [ ] Review mission thresholds (e.g., "Land on 5 Funds tiles")
- [ ] Adjust to be achievable in 8-12 rolls
- [ ] Ensure variety doesn't create bottlenecks

**3.2.5 Sticker Drop Rates**
- [ ] Review sticker tile frequency
- [ ] Adjust pack rewards from milestones
- [ ] Ensure 1-3 stickers per session target is met

#### 3.3 Configuration System
**Priority:** Medium  
**Estimated Time:** 2 hours

- [ ] Create `web/src/config/gameBalance.js`
- [ ] Centralize all tunable values
- [ ] Document each parameter's impact
- [ ] Make easy to adjust without code diving

```javascript
export const GAME_BALANCE = {
  // Starting Resources
  STARTING_FUNDS: 5000,
  STARTING_DICE: 50,
  STARTING_SHIELDS: 1,
  
  // Event Progression
  POINTS_PER_ROLL: 10,
  DOUBLES_BONUS_MULTIPLIER: 0.35,
  MILESTONE_THRESHOLDS: [10, 20, 40, 80, 120],
  
  // Dice Economy
  START_TILE_DICE_BONUS: 2,
  DICE_TILE_PAYOUT: 4,
  
  // Funds Scaling
  CITY_1_FUNDS_MULTIPLIER: 1.0,
  CITY_2_FUNDS_MULTIPLIER: 1.4,
  
  // Target Metrics
  TARGET_SESSION_LENGTH_MIN: 60,
  TARGET_SESSION_LENGTH_MAX: 120,
  TARGET_ROLLS_PER_SESSION: 10,
};
```

#### 3.4 Testing & Iteration
**Priority:** High  
**Estimated Time:** 3 hours

- [ ] Play 10 sessions with adjusted values
- [ ] Measure against target metrics
- [ ] Iterate 2-3 times until targets are met
- [ ] Get feedback from external testers
- [ ] Document final balance decisions

**Success Criteria:**
- 80% of sessions fall within 60-120 seconds
- Progression feels rewarding and achievable
- No bottlenecks or frustrating waits
- Economy feels balanced (not too easy or hard)

---

## Phase 4: Content Expansion - Second City 🏙️

### Objective
Implement fully functional second city (Deco Heights) with unique theme and scaled rewards.

### Design Phase

#### 4.1 City Definition
**Priority:** High  
**Estimated Time:** 2 hours

**Current City 2 Data (Review & Finalize):**
```javascript
{
  name: 'Deco Heights',
  themeColor: '#fbbf24', // Gold/amber
  glowColor: 'rgba(251, 191, 36, 0.05)', // REMOVED
  backdropClass: 'theme-deco-heights', // UNUSED
  unlockRequirement: 'Complete all City 1 landmarks',
  payoutMultiplier: 1.4,
  tiles: [...] // 20 tiles defined
}
```

**Review Checklist:**
- [x] Verify 20-tile layout matches City 1 structure
- [x] Confirm 1.4x multiplier on all payouts
- [x] Review tile distribution (mix of types)
- [x] Ensure landmark costs are scaled appropriately
- [x] Define visual theme/color scheme

#### 4.2 Implementation Tasks

**4.2.1 City Transition System**
**Priority:** High  
**Estimated Time:** 3 hours

- [x] Add city unlock check in `BoardLoop.jsx`
- [x] Implement city selection UI (if needed)
- [x] Add celebration effect when unlocking City 2
- [x] Implement smooth city transition (fade out/in)
- [x] Update city stack visualization to show City 2
- [x] Persist current city in localStorage

**4.2.2 Theme & Styling**
**Priority:** Medium  
**Estimated Time:** 2 hours

- [x] Update UI to use City 2 theme color (#fbbf24) when active
- [x] Ensure all dynamic color references use `cityData.themeColor`
- [x] Add any City 2-specific visual elements
- [x] Test color contrast for readability
- [x] Update board center subtitle with city name

**4.2.3 Reward Scaling**
**Priority:** High  
**Estimated Time:** 1.5 hours

- [x] Verify all funds payouts use city multiplier
- [x] Scale landmark upgrade costs by 1.4x
- [x] Update heist percentages if needed
- [x] Ensure milestone rewards scale appropriately
- [x] Test economy balance in City 2

**4.2.4 Tile Variety (Optional Enhancement)**
**Priority:** Low  
**Estimated Time:** 4 hours

- [ ] Design new tile types unique to City 2
- [ ] Implement new tile resolution logic
- [ ] Add new tile styling
- [ ] Test integration with existing systems

**4.2.5 Unlock Flow**
**Priority:** High  
**Estimated Time:** 2 hours

- [x] Add check for all City 1 landmarks maxed
- [x] Display "City 2 Unlocked!" notification
- [x] Add UI indicator for city unlock progress
- [x] Add button to advance to City 2
- [x] Implement confirmation dialog for city transition

#### 4.3 Testing
**Priority:** High  
**Estimated Time:** 2 hours

**Test Cases:**
- [x] Complete City 1 and unlock City 2
- [x] Verify City 2 tiles load correctly
- [x] Test all tile types in City 2
- [x] Verify theme color changes throughout UI
- [x] Test save/load with City 2 active
- [x] Verify reward scaling is correct
- [x] Test going back to City 1 (if supported)
- [x] Verify city level persists correctly

**Success Criteria:**
- City 2 unlocks when conditions are met
- All tiles function correctly in City 2
- Theme colors update throughout UI
- Rewards are properly scaled
- Progression feels natural and rewarding

---

## Implementation Order & Timeline

### Week 1: Testing & Persistence
- **Days 1-2:** Phase 1 - Visual Cleanup Validation
- **Days 3-5:** Phase 2 - Persistence Implementation

### Week 2: Balance & Content
- **Days 1-3:** Phase 3 - Gameplay Balance Tuning
- **Days 4-5:** Phase 4 - Content Expansion (City 2)

### Total Estimated Time
- Phase 1: 6.5 hours
- Phase 2: 8.5 hours
- Phase 3: 10 hours
- Phase 4: 11.5 hours
- **Total: ~36 hours** (approximately 1 week of full-time work)

---

## Success Metrics

### Phase 1 Success
- ✅ All tests pass
- ✅ 60fps performance maintained
- ✅ No visual bugs
- ✅ Works across all browsers

### Phase 2 Success
- ✅ Save/load works reliably
- ✅ No data loss
- ✅ Graceful error handling
- ✅ Player can resume progress

### Phase 3 Success
- ✅ 80% sessions within 60-120s
- ✅ Economy feels balanced
- ✅ No progression bottlenecks
- ✅ Positive player feedback

### Phase 4 Success
- ✅ City 2 unlocks correctly
- ✅ All features work in City 2
- ✅ Visual theme is distinct
- ✅ Rewards scaled appropriately

---

## Risk Mitigation

### Risks
1. **localStorage limitations** - Mobile browsers may have small quotas
   - *Mitigation:* Keep save data minimal, handle quota errors gracefully

2. **Balance is subjective** - Hard to hit exact timing targets
   - *Mitigation:* Get multiple playtesters, iterate based on feedback

3. **City 2 may feel repetitive** - Same mechanics, just scaled
   - *Mitigation:* Add unique tile types or mechanics in future phases

4. **Performance regression** - New features might slow the game
   - *Mitigation:* Profile after each phase, optimize as needed

---

## Next Steps After Completion

1. **Phase 5: Additional Cities** - City 3, 4, etc.
2. **Phase 6: Meta Progression** - Permanent upgrades, achievements
3. **Phase 7: Polish** - Sound effects, particle effects, juice
4. **Phase 8: Mobile Optimization** - Touch controls, responsive refinements
5. **Phase 9: Social Features** - Leaderboards, sharing (if desired)

---

## Notes
- All phases should update PRD.md checklist items as they're completed
- Use git commits to track progress through each phase
- Document any balance changes and reasoning
- Keep performance profiling data for future reference
