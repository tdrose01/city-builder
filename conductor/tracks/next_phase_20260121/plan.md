# Post-Cleanup Enhancement Phase - Implementation Plan

**Track:** next_phase_20260121  
**Created:** 2026-01-21  
**Status:** In Progress

---

## Phase 1: Visual Cleanup Validation

### Task 1.1: Core Gameplay Testing
- [x] Test dice roll animation and movement
- [x] Verify all 10 tile types resolve correctly (Funds, Heist, Shield, Rent, Bonus, Shutdown, Sticker, Card, Dice, Landmark)
- [x] Test landmark upgrade flow with funds deduction
- [x] Verify autoroll toggle and automatic rolling
- [x] Test mission tracking and progress updates
- [x] Verify event progress and milestone claims
- [x] Test sticker pack opening and collection
- [x] Verify prestige system reset and reward scaling
- [x] Test mission reset cycle functionality
- [x] Create test report document with results
- **Acceptance Criteria:**
  - All game mechanics function without errors
  - No visual artifacts or missing elements
  - Player can complete full gameplay loop
  - Test report documents all results [checkpoint: test-report.md]

### Task 1.2: Performance Profiling and Validation
- [x] Measure FPS during idle state (target: 60fps)
- [x] Measure FPS during dice roll animation (target: 55-60fps)
- [x] Measure FPS during player piece movement (target: 55-60fps)
- [x] Measure page load time (target: <2s)
- [x] Monitor CPU usage during 5-minute gameplay session
- [x] Monitor memory usage over 5-minute session
- [x] Compare metrics vs. before visual cleanup
- [x] Document performance improvements
- **Acceptance Criteria:**
  - Consistent 60fps during gameplay
  - No performance degradation over time
  - Improved or maintained performance vs. before cleanup
  - Performance report created [checkpoint: test-report.md]

### Task 1.3: UI/UX Accessibility Review
- [x] Verify all text readable without glow effects
- [x] Check tile borders provide sufficient visual separation
- [x] Confirm board center transparency is appropriate
- [x] Verify progress bars are clear without glows
- [x] Test button states (hover, active, disabled) are distinct
- [x] Verify tab navigation is intuitive
- [x] Check floating action buttons are visible and accessible
- [x] Test notification display and readability
- [x] Verify color contrast meets WCAG AA standards
- [x] Create accessibility checklist report
- **Acceptance Criteria:**
  - All UI elements clearly visible
  - No accessibility issues identified
  - Professional, clean appearance maintained
  - Accessibility report completed [checkpoint: test-report.md]

### Task 1.4: Cross-Browser Testing
- [x] Test in Chrome/Chromium (latest) - desktop
- [x] Test in Firefox (latest) - desktop
- [x] Test in Safari (latest) - desktop
- [x] Test in Edge (latest) - desktop
- [x] Test in Mobile Safari (iOS)
- [x] Test in Chrome Mobile (Android)
- [x] Document any browser-specific issues
- [x] Create compatibility report
- **Acceptance Criteria:**
  - Game works consistently across all browsers
  - No browser-specific visual bugs
  - Acceptable performance on mobile
  - Compatibility report completed [checkpoint: test-report.md]

---

## Phase 2: Persistence Implementation

### Task 2.1: Create Save System Module
- [x] Create `web/src/utils/` directory if not exists
- [x] Create `web/src/utils/saveSystem.js` file
- [x] Implement `saveGame(state)` function with JSON serialization
- [x] Implement `loadGame()` function with JSON deserialization
- [x] Implement `clearSave()` function
- [x] Implement `hasSaveData()` function
- [x] Add version number to save data structure (v1)
- [x] Implement version migration placeholder system
- [x] Add try-catch error handling for localStorage operations
- [x] Add try-catch for JSON parse errors
- [x] Write unit tests for save system functions
- [x] Run tests and verify 100% pass rate
- **Acceptance Criteria:**
  - All save system functions implemented
  - Error handling for corrupted data
  - Version system for future migrations
  - Unit tests pass with >80% coverage

### Task 2.2: Integrate Save System into BoardLoop
- [x] Import save system utilities in `BoardLoop.jsx`
- [x] Add `useEffect` to load game on component mount
- [x] Extract current game state into serializable object
- [x] Implement `saveGameState()` function
- [x] Add auto-save on funds change with debounce
- [x] Add auto-save on dice change with debounce
- [x] Add auto-save on shields change with debounce
- [x] Add auto-save on city level change
- [x] Add auto-save on prestige level change
- [x] Create debounce utility (2 second delay)
- [x] Add "Game Saved" toast notification
- [x] Test save/load cycle works correctly
- [x] Write integration tests for save/load flow
- [x] Run tests and verify pass rate
- **Acceptance Criteria:**
  - Game loads from save on mount
  - Auto-save triggers on state changes
  - Debouncing prevents excessive saves
  - Integration tests pass

### Task 2.3: Add Save Management UI
- [x] Add "New Game" button to board UI
- [x] Create `ConfirmDialog` for "New Game" action
- [x] Implement "New Game" handler with save clearing
- [x] Add last save timestamp display to UI
- [x] Add "Loaded from Save" indicator on startup
- [x] Add optional manual "Save Game" button
- [x] Style new UI elements consistently
- [x] Test all new UI controls
- [x] Write tests for "New Game" flow
- [x] Run tests and verify pass rate
- **Acceptance Criteria:**
  - "New Game" button visible and functional
  - Confirmation prevents accidental resets
  - Save timestamp displays correctly
  - UI tests pass

### Task 2.4: Handle Edge Cases and Errors
- [x] Test with missing localStorage data
- [x] Test with corrupted JSON in localStorage
- [x] Test in private/incognito browsing mode
- [x] Test localStorage quota exceeded scenario
- [x] Add fallback to in-memory state
- [x] Add user-friendly error messages
- [x] Test rapid save/load cycles
- [x] Document error handling behavior
- [x] Write tests for error scenarios
- [x] Run tests and verify pass rate
- **Acceptance Criteria:**
  - Graceful handling of all error cases ✅
  - User sees helpful error messages ✅
  - Game remains playable even with save errors ✅
  - Error handling tests pass ✅ (34 tests)
  - Comprehensive documentation created ✅ (ERROR_HANDLING.md)

---

## Phase 3: Gameplay Balance Tuning

### Task 3.1: Data Collection and Analysis
- [x] Create automated analytics tracking system ✅
- [x] Implement SessionMetrics class ✅
- [x] Create analytics viewer UI ✅
- [x] Run 10 automated playtest sessions ✅
- [x] Generate and review first analytics report ✅
- **Acceptance Criteria:**
  - Analytics system fully implemented ✅
  - Playtest data collected and analyzed ✅

### Task 3.2: Create Game Balance Configuration
- [x] Create `web/src/config/gameBalance.js` ✅
- [x] Centralize all tunable parameters ✅

### Task 3.3: Tune Dice Economy
- [x] Review starting dice count (set to 50) ✅
- [x] Update DOUBLES_BONUS_MULTIPLIER to 0.50 ✅
- [x] Play verification sessions ✅

### Task 3.4: Tune Event Progression
- [x] Update POINTS_PER_ROLL to 15 ✅
- [x] Update MILESTONE_THRESHOLDS to [15, 30, 50, 75, 100] ✅

### Task 3.5: Tune Funds Economy
- [x] Update INITIAL_STATE.FUNDS to 7500 ✅
- [x] Verify upgrade flow with new starting funds ✅

### Task 3.6: Final Balance Validation
- [x] Play 10 final automated sessions ✅
- [x] Measure average session length vs. 60-120s target ✅
- [x] Measure average rolls vs. 8-12 target ✅
- [x] Update PRD.md with final balance values ✅
- **Acceptance Criteria:**
  - Economy feels balanced and sustainable ✅
  - Final report completed ✅

---

## Phase 4: Content Expansion - Second City

### Task 4.1: Finalize City 2 Design
- [x] Review existing City 2 tile data in `BoardLoop.jsx`
- [x] Verify 20-tile layout matches City 1 structure
- [x] Confirm tile type distribution is balanced
- [x] Calculate 1.4x multiplier for all payouts
- [x] Calculate 1.4x multiplier for landmark costs
- [x] Update City 2 data with calculated values
- [x] Define visual theme color scheme (#fbbf24)
- [x] Update `backdropClass` or remove if unused
- [x] Document City 2 design decisions
- [x] Create City 2 design spec document
- **Acceptance Criteria:**
  - City 2 tile data complete and balanced
  - All payouts scaled by 1.4x
  - Visual theme defined
  - Design documented

### Task 4.2: Implement City Unlock System
- [x] Add function to check all City 1 landmarks at MAX
- [x] Add unlock check in appropriate `useEffect`
- [x] Create "City 2 Unlocked!" notification
- [x] Add state variable for city unlock status
- [x] Create unlock celebration effect (particles/animation)
- [x] Add "Advance to City 2" button to UI
- [x] Style button prominently
- [x] Write tests for unlock logic
- [x] Run tests and verify pass rate
- [x] Document unlock requirements
- **Acceptance Criteria:**
  - Unlock triggers when all landmarks maxed
  - Celebration effect plays
  - UI clearly shows unlock available
  - Tests pass

### Task 4.3: Implement City Transition
- [x] Create `handleCityTransition()` function
- [x] Add confirmation dialog for city change
- [x] Implement fade-out animation
- [x] Update `cityLevel` state to 2
- [x] Reload tiles from City 2 data
- [x] Reset player position to tile 0
- [x] Implement fade-in animation
- [x] Update city stack visualization
- [x] Write tests for transition logic
- [x] Run tests and verify pass rate
- **Acceptance Criteria:**
  - Transition is smooth and bug-free
  - City 2 tiles load correctly
  - Player position resets
  - Tests pass

### Task 4.4: Apply City 2 Theme
- [x] Update all `cityData.themeColor` references to use #fbbf24
- [x] Verify tab active state uses City 2 color
- [x] Verify progress bars use City 2 color
- [x] Verify floating action buttons use City 2 color
- [x] Update board center subtitle with "Deco Heights"
- [x] Test color contrast for readability
- [x] Verify theme changes throughout entire UI
- [x] Take screenshots for documentation
- [x] Write tests for theme application
- [x] Run tests and verify pass rate
- **Acceptance Criteria:**
  - All UI elements use City 2 theme color
  - Visual distinction clear from City 1
  - Contrast remains accessible
  - Tests pass

### Task 4.5: Integrate City with Persistence
- [x] Add `cityLevel` to save state
- [x] Add `currentCity` identifier to save state
- [x] Test save/load with City 1 active
- [x] Test save/load with City 2 active
- [x] Test city unlock status persistence
- [x] Verify tiles load correctly on restore
- [x] Test "New Game" resets to City 1
- [x] Write tests for city persistence
- [x] Run tests and verify pass rate
- [x] Document save state changes
- **Acceptance Criteria:**
  - Current city persists across sessions
  - Unlock status saved correctly
  - "New Game" resets to City 1
  - Tests pass

### Task 4.6: Test City 2 End-to-End
- [x] Complete City 1 and unlock City 2
- [x] Transition to City 2
- [x] Play full session in City 2
- [x] Verify all tile types work correctly
- [x] Verify payouts are scaled by 1.4x
- [x] Verify landmark costs are scaled by 1.4x
- [x] Test mission system in City 2
- [x] Test prestige system in City 2
- [x] Test save/load in City 2
- [x] Create City 2 test report
- [x] Document any issues found
- [x] Fix any bugs discovered
- **Acceptance Criteria:**
  - All features work correctly in City 2
  - Rewards properly scaled
  - No bugs or errors
  - Test report completed

---

## Quality Gates

Before marking this track complete:
- [ ] All tasks completed and marked with commit SHAs
- [ ] All unit tests passing (>80% coverage)
- [ ] All integration tests passing
- [ ] Manual testing complete on desktop and mobile
- [ ] Performance metrics meet targets (60fps)
- [ ] Balance metrics meet targets (60-120s sessions)
- [ ] Documentation updated (PRD.md, IMPLEMENTATION_PLAN.md)
- [ ] No linting errors
- [ ] Checkpoint commit created with verification report
- [ ] User acceptance validation received

---

## Notes

### Design Decisions
- **Save System:** localStorage chosen for simplicity and zero backend dependency
- **Balance Target:** 60-120s sessions chosen based on mobile game session data
- **City 2 Multiplier:** 1.4x chosen to feel meaningfully harder without being punishing
- **Theme Color:** Gold/amber (#fbbf24) chosen to contrast with City 1's cyan/teal

### Technical Considerations
- Debounce auto-save to prevent localStorage thrashing
- Use JSON.stringify/parse for save data serialization
- Include version number for future save format migrations
- Handle localStorage quota exceeded gracefully
- Test extensively in private browsing mode

### Future Enhancements (Deferred)
- Cloud save synchronization
- Multiple save slots
- Export/import save data
- City 3, 4, 5+ content
- Dynamic difficulty adjustment
- Achievement system
- Statistics tracking dashboard
