# Autoroll Feature - Implementation Plan

**Track:** autoroll_20260120  
**Created:** 2026-01-20  
**Status:** In Progress

---

## Phase 1: Core Autoroll Implementation [checkpoint: 184689f]

### Task 1.1: Add Autoroll State Management [184689f]
- [x] Add `autoRollEnabled` state variable (boolean)
- [x] Add `autoRollInProgress` state variable (boolean)
- [x] Add state setter functions with proper TypeScript/JSDoc annotations
- **Acceptance Criteria:**
  - State variables properly initialized
  - State can be toggled without errors
  - State persists correctly during component lifecycle

### Task 1.2: Create Autoroll Toggle Button UI [184689f]
- [x] Add "Auto Roll" button in `.board-actions` section
- [x] Style button with theme color when active
- [x] Style button with outline/secondary style when inactive
- [x] Add icon/emoji indicator (⚡ for OFF, ⏸ for ON)
- [x] Disable button when dice count is 0
- [x] Add onClick handler to toggle `autoRollEnabled`
- **Acceptance Criteria:**
  - Button renders correctly below "Roll Dice" button
  - Button shows clear ON/OFF state visually
  - Button click toggles autoroll state
  - Button is disabled when appropriate

### Task 1.3: Implement Autoroll Logic with useEffect [184689f]
- [x] Create `useEffect` hook that watches `autoRollEnabled`, `dice`, `isMoving`, `rolling`
- [x] When autoroll enabled and conditions met, call `handleRollDice()`
- [x] Add 500ms delay between rolls using `setTimeout`
- [x] Set `autoRollInProgress` flag during roll execution
- [x] Clear timeout on component unmount or autoroll disable
- **Acceptance Criteria:**
  - Autoroll triggers dice rolls automatically
  - Proper delay between rolls
  - Autoroll respects game state (doesn't roll when moving/rolling)
  - No memory leaks from uncleaned timeouts

### Task 1.4: Implement Auto-Stop Logic [184689f]
- [x] Check dice count after each roll completes
- [x] If dice === 0, set `autoRollEnabled` to false
- [x] Show HUD message "Autoroll stopped - No dice left"
- [x] Ensure autoroll stops on city level change
- [x] Ensure autoroll stops on component unmount
- **Acceptance Criteria:**
  - Autoroll stops automatically when dice run out
  - User sees clear notification when autoroll stops
  - No errors when autoroll stops
  - Autoroll state resets properly

---

## Phase 2: Polish and User Experience

### Task 2.1: Add Visual Feedback for Active Autoroll
- [ ] Add subtle pulsing animation to active autoroll button
- [ ] Update button text to show "Auto Roll: ON" vs "Auto Roll: OFF"
- [ ] Disable "Roll Dice" button when autoroll is active
- [ ] Add optional badge/indicator in board center showing autoroll status
- **Acceptance Criteria:**
  - Active autoroll is clearly visible to user
  - Button animations are smooth and not distracting
  - User understands autoroll is active at a glance

### Task 2.2: Improve Autoroll Timing and Feel
- [ ] Test and adjust delay between rolls (currently 500ms)
- [ ] Ensure all animations complete before next roll
- [ ] Verify particle effects and text pops still appear
- [ ] Test with different roll values (2-12) for timing consistency
- **Acceptance Criteria:**
  - Autoroll feels smooth and natural
  - All visual feedback still appears
  - No animation conflicts or overlaps
  - Timing works well for both short and long rolls

### Task 2.3: Handle Edge Cases
- [x] Pause autoroll when landing on upgradeable landmark
- [ ] Test autoroll with doubles bonus (dice count increases mid-autoroll)
- [ ] Test autoroll with city completion (landmarks fully upgraded)
- [ ] Test rapid toggle on/off of autoroll button
- [ ] Test autoroll with milestone/mission completion alerts
- [ ] Add safeguards to prevent multiple concurrent autoroll loops
- **Acceptance Criteria:**
  - Autoroll pauses on upgradeable landmarks
  - Autoroll handles doubles correctly
  - Autoroll stops gracefully on city completion
  - Rapid toggling doesn't cause issues
  - Only one autoroll loop runs at a time

---

## Phase 3: Testing and Documentation

### Task 3.1: Write Unit Tests
- [ ] Test autoroll state toggles correctly
- [ ] Test autoroll stops when dice = 0
- [ ] Test autoroll respects isMoving/rolling states
- [ ] Test manual stop functionality
- [ ] Test cleanup on unmount
- **Acceptance Criteria:**
  - All unit tests pass
  - Code coverage > 80% for autoroll logic
  - Tests cover success and failure cases

### Task 3.2: Write Integration Tests
- [ ] Test full autoroll flow (enable → rolls → auto stop)
- [ ] Test autoroll with doubles bonus
- [ ] Test autoroll with city completion
- [ ] Test autoroll UI state changes
- **Acceptance Criteria:**
  - Integration tests pass
  - Tests verify complete user flows
  - Tests catch regression issues

### Task 3.3: Manual Testing and QA
- [ ] Test on desktop (various screen sizes)
- [ ] Test on mobile (touch interactions)
- [ ] Test with different dice counts (1, 5, 20, 50)
- [ ] Test with different game states (early game, late game)
- [ ] Verify accessibility (keyboard navigation, screen readers)
- **Acceptance Criteria:**
  - Feature works smoothly on all platforms
  - No visual glitches or performance issues
  - Accessible to all users

### Task 3.4: Update Documentation
- [ ] Update PRD.md with autoroll feature
- [ ] Update conductor/product.md with feature description
- [ ] Add autoroll to build checklist
- [ ] Document any new state variables or functions
- [ ] Update CHANGELOG.md with feature addition
- **Acceptance Criteria:**
  - All documentation is current
  - Feature is properly described
  - Future developers can understand implementation

---

## Quality Gates

Before marking this track complete:
- [ ] All tasks completed and marked with commit SHAs
- [ ] All tests passing (unit + integration)
- [ ] Code coverage > 80%
- [ ] Manual testing complete on desktop and mobile
- [ ] Documentation updated
- [ ] No linting errors
- [ ] Feature reviewed and approved
- [ ] Checkpoint commit created with verification report

---

## Notes

### Design Decisions
- **Delay between rolls:** 500ms chosen to balance speed and user perception of control
- **Button placement:** Below "Roll Dice" for logical grouping of dice actions
- **Auto-stop behavior:** Stops on dice = 0 to prevent confusion
- **Visual feedback:** Pulsing animation and color change for clear state indication

### Technical Considerations
- Use `useEffect` with proper dependency array to avoid infinite loops
- Clean up timeouts to prevent memory leaks
- Use `autoRollInProgress` flag to prevent concurrent autoroll loops
- Respect existing game state flags (isMoving, rolling) for smooth integration

### Future Enhancements (Deferred)
- Autoroll speed control (slow/medium/fast)
- Auto-claim milestones during autoroll
- Configurable stop conditions (after N rolls, after reaching X funds, etc.)
- Autoroll statistics tracking
