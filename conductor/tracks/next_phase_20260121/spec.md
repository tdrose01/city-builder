# Post-Cleanup Enhancement Phase - Specification

## Phase 1: Visual Cleanup Validation

### Objective
Ensure all game mechanics work correctly and perform optimally after removing glow effects, dark overlays, and parallax movement.

### Functional Requirements

#### FR1.1: Core Gameplay Testing
- All tile types resolve correctly (Funds, Heist, Shield, Rent, Bonus, Shutdown, Sticker, Card, Dice, Landmark)
- Dice roll and player movement animations work smoothly
- Landmark upgrade flow functions correctly
- Autoroll system operates without errors
- Mission tracking updates properly
- Event progress and milestone claims work
- Sticker pack opening and collection functional
- Prestige system reset and scaling operational
- Mission reset cycle works correctly

#### FR1.2: Performance Validation
- Maintain 60fps during idle state
- Maintain 55-60fps during animations (dice roll, player movement)
- Page load time under 2 seconds
- No performance degradation over extended play (5+ minutes)
- Memory usage stable over time

#### FR1.3: UI/UX Verification
- All text readable without glow effects
- Tile borders provide sufficient visual separation
- Board center visible and appropriately transparent
- Progress bars clear without glows
- Button states (hover, active, disabled) distinct
- Tab navigation intuitive and functional
- Floating action buttons visible and accessible
- Notifications display correctly
- WCAG AA contrast standards met

#### FR1.4: Cross-Browser Compatibility
- Works correctly in Chrome/Chromium (latest)
- Works correctly in Firefox (latest)
- Works correctly in Safari (latest)
- Works correctly in Edge (latest)
- Responsive on mobile devices (iOS Safari, Chrome Mobile)

### Non-Functional Requirements
- No JavaScript errors in console
- No visual artifacts or rendering glitches
- Smooth animations without jank
- Professional, clean appearance maintained

---

## Phase 2: Persistence Implementation

### Objective
Add localStorage-based save system to persist player progress across browser sessions.

### Data Model

```javascript
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
  comboTarget: number,
  currentCombo: number
};
```

### Functional Requirements

#### FR2.1: Save System Module
- Create `web/src/utils/saveSystem.js` with save/load functions
- Implement `saveGame(state)` - serializes and saves to localStorage
- Implement `loadGame()` - loads and deserializes from localStorage
- Implement `clearSave()` - removes save data
- Implement `hasSaveData()` - checks if save exists
- Include version migration system for future updates
- Handle corrupted save data gracefully

#### FR2.2: Auto-Save Integration
- Load saved game on component mount
- Auto-save on key state changes (funds, dice, shields, city level)
- Debounce auto-saves (max once per 2 seconds)
- Show brief "Game Saved" indicator when saving
- Handle localStorage quota exceeded errors

#### FR2.3: UI Controls
- Add "New Game" button in UI
- Implement confirmation dialog for "New Game"
- Display last save timestamp
- Add manual "Save Game" button (optional)
- Show "Loaded from Save" indicator on startup

#### FR2.4: Error Handling
- Graceful handling of missing localStorage data
- Handle corrupted JSON data
- Handle localStorage disabled (private browsing)
- Handle quota exceeded scenarios
- Fallback to in-memory state if localStorage unavailable

### Non-Functional Requirements
- Save operations complete in <100ms
- No blocking of UI during save/load
- Save data size under 50KB
- Compatible with all modern browsers
- Works in incognito/private mode (with limitations)

---

## Phase 3: Gameplay Balance Tuning

### Objective
Tune game pacing to consistently achieve 60-120 second session targets with satisfying progression.

### Target Metrics
- **Session Length:** 60-120 seconds (80% of sessions)
- **Rolls Per Session:** 8-12 average
- **Stickers Per Session:** 1-3 earned
- **First Milestone:** Reached within 30 seconds
- **Mission Completion:** 2-3 missions per session

### Functional Requirements

#### FR3.1: Data Collection
- Play 10+ sessions with current balance
- Record: session length, rolls, milestones, missions completed
- Calculate averages and identify bottlenecks
- Document findings in balance report

#### FR3.2: Economy Tuning

**Dice Economy:**
- Review starting dice count (current: 50)
- Adjust dice tile payouts (current: 4-5)
- Review START tile bonus (add dice bonus if needed)
- Ensure player never feels "stuck" waiting for dice

**Event Progression:**
- Review points per roll (current: 10)
- Adjust milestone thresholds (current: 10, 20, 40, 80, 120)
- Review doubles bonus multiplier (current: 0.35)
- Consider adding 6th milestone for longer sessions

**Funds Economy:**
- Review funds tile payouts by city
- Adjust landmark upgrade costs
- Balance heist percentages
- Tune rent deductions
- Adjust START tile payout

**Mission Difficulty:**
- Review mission thresholds for achievability
- Ensure missions complete in 8-12 rolls
- Balance variety to avoid bottlenecks

**Sticker Drop Rates:**
- Review sticker tile frequency
- Adjust pack rewards from milestones
- Ensure 1-3 stickers per session target

#### FR3.3: Configuration System
- Create `web/src/config/gameBalance.js`
- Centralize all tunable values
- Document each parameter's impact
- Make values easy to adjust

#### FR3.4: Validation
- Play 10+ sessions with adjusted values
- Measure against target metrics
- Iterate 2-3 times until targets met
- Get external tester feedback

### Non-Functional Requirements
- Balance changes maintain fun factor
- Progression feels rewarding
- No artificial difficulty spikes
- Economy feels fair and achievable

---

## Phase 4: Content Expansion - Second City

### Objective
Implement fully functional second city (Deco Heights) with unique theme and scaled rewards.

### City 2 Definition

```javascript
{
  name: 'Deco Heights',
  themeColor: '#fbbf24', // Gold/amber
  unlockRequirement: 'Complete all City 1 landmarks (reach MAX on landmark)',
  payoutMultiplier: 1.4,
  tiles: [...] // 20 tiles with same structure as City 1
}
```

### Functional Requirements

#### FR4.1: City Data & Design
- Finalize 20-tile layout for City 2
- Verify tile distribution (mix of types)
- Confirm 1.4x multiplier on all payouts
- Scale landmark costs appropriately (1.4x)
- Define visual theme and colors

#### FR4.2: City Transition System
- Add unlock check when all City 1 landmarks maxed
- Display "City 2 Unlocked!" notification
- Add UI indicator showing unlock progress
- Implement smooth city transition (fade effect)
- Update city stack visualization for City 2
- Persist current city in save system

#### FR4.3: Theme & Styling
- Update all UI to use City 2 theme color (#fbbf24) when active
- Ensure dynamic color references work (`cityData.themeColor`)
- Test color contrast for readability
- Update board center subtitle with city name
- Add any City 2-specific visual elements

#### FR4.4: Reward Scaling
- Apply 1.4x multiplier to all funds payouts
- Scale landmark upgrade costs by 1.4x
- Update heist percentages if needed
- Ensure milestone rewards scale appropriately
- Test economy balance in City 2

#### FR4.5: Unlock Flow
- Check for all City 1 landmarks at MAX level
- Show celebration notification on unlock
- Add "Advance to City 2" button
- Implement confirmation dialog for city transition
- Handle edge cases (save/load with City 2 active)

### Non-Functional Requirements
- City transition smooth and bug-free
- Performance maintained in City 2
- Visual distinction clear between cities
- Rewards feel appropriately scaled
- Unlock moment feels celebratory

---

## Testing Requirements

### Unit Tests
- Save/load system functions
- Prestige level calculation
- Reward scaling calculations
- City unlock logic
- Mission completion tracking

### Integration Tests
- Full save/load cycle
- City transition flow
- Complete gameplay session in City 2
- Auto-save triggers and timing
- Balance tuning validation

### Manual Testing
- Complete gameplay loop testing
- Cross-browser compatibility check
- Performance profiling
- Mobile device testing
- User acceptance testing

---

## Success Metrics

### Phase 1
- ✅ All tests pass
- ✅ 60fps maintained
- ✅ Zero console errors
- ✅ Works in all browsers

### Phase 2
- ✅ Save/load works reliably
- ✅ No data loss
- ✅ Graceful error handling
- ✅ Auto-save performs well

### Phase 3
- ✅ 80% sessions within 60-120s
- ✅ Economy feels balanced
- ✅ No progression bottlenecks
- ✅ Positive tester feedback

### Phase 4
- ✅ City 2 unlocks correctly
- ✅ All features work in City 2
- ✅ Theme visually distinct
- ✅ Rewards properly scaled
