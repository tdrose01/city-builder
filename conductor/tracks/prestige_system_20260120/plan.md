# Event Prestige System - Implementation Plan

**Track:** prestige_system_20260120  
**Created:** 2026-01-20  
**Status:** In Progress

---

## Phase 1: Core Prestige Implementation [checkpoint: 22a70d3]

### Task 1.1: Add Prestige State Management [22a70d3]
- [x] Add `eventPrestigeLevel` state variable (integer, default 0)
- [x] Add helper function `getRewardMultiplier(prestigeLevel)`
- [x] Add helper function `getScaledReward(baseAmount, prestigeLevel)`
- **Acceptance Criteria:**
  - State properly initialized
  - Multiplier calculation works correctly (1.0 + level * 0.5, capped at 3.0)
  - Scaled reward calculation returns correct values

### Task 1.2: Implement Prestige Eligibility Logic [22a70d3]
- [x] Create `canPrestige` computed value
- [x] Check all milestones claimed
- [x] Check event progress >= 120
- **Acceptance Criteria:**
  - Returns true only when all milestones claimed and progress >= 120
  - Returns false otherwise
  - Updates correctly when milestones are claimed

### Task 1.3: Create Prestige Button UI [22a70d3]
- [x] Add "Prestige" button in Event Progress expandable section
- [x] Show button only when `canPrestige` is true
- [x] Style button prominently (special color, glow effect)
- [x] Position below milestone list
- **Acceptance Criteria:**
  - Button appears when eligible
  - Button hidden when not eligible
  - Button is visually distinct and appealing
  - Button shows prestige level info

### Task 1.4: Implement Prestige Confirmation Dialog [22a70d3]
- [x] Create confirmation dialog with prestige details
- [x] Show current and next prestige level
- [x] Show current and next multiplier
- [x] Show example reward improvements
- [x] Require explicit confirmation
- **Acceptance Criteria:**
  - Dialog shows accurate information
  - Dialog is clear and informative
  - Cancel button works
  - Confirm button triggers prestige

### Task 1.5: Implement Prestige Reset Logic [22a70d3]
- [x] Create `handlePrestige` function
- [x] Increment prestige level
- [x] Reset event progress to 0
- [x] Reset all milestone claims to false
- [x] Show celebration message and effects
- **Acceptance Criteria:**
  - Prestige level increments correctly
  - Event progress resets to 0
  - Milestone claims all reset
  - Celebration effects appear
  - No errors during prestige

---

## Phase 2: Reward Scaling and Display [checkpoint: 22a70d3]

### Task 2.1: Update Milestone Display with Scaled Rewards [22a70d3]
- [x] Modify milestone rendering to show scaled rewards
- [x] Calculate scaled amounts based on prestige level
- [x] Update milestone descriptions with scaled values
- [x] Show multiplier in parentheses (e.g., "20 Dice (1.5x)")
- **Acceptance Criteria:**
  - Milestone rewards display correct scaled amounts
  - Scaling updates when prestige level changes
  - Display is clear and not cluttered

### Task 2.2: Update claimReward Function for Scaling [22a70d3]
- [x] Modify `claimReward` to use scaled amounts
- [x] Apply multiplier to dice rewards
- [x] Apply multiplier to funds rewards
- [x] Apply multiplier to sticker pack rewards (round up)
- **Acceptance Criteria:**
  - Players receive scaled rewards when claiming
  - Scaling calculation is correct
  - All reward types scale properly

### Task 2.3: Add Prestige Level Display to UI [22a70d3]
- [x] Add prestige badge to Event Progress header
- [x] Show current multiplier (e.g., "⭐ Prestige 2 - 2.0x")
- [x] Update progress bar label
- [x] Add prestige info to expandable header
- **Acceptance Criteria:**
  - Prestige level clearly visible
  - Multiplier displayed prominently
  - Display updates when prestige changes
  - Design fits with existing UI

### Task 2.4: Update "Claim All" Function for Scaling [22a70d3]
- [x] Modify `handleClaimAllRewards` to use scaled amounts
- [x] Calculate scaled totals for summary message
- [x] Apply scaling to all reward types
- **Acceptance Criteria:**
  - Claim All gives scaled rewards
  - Summary message shows correct scaled totals
  - No rewards are missed or duplicated

---

## Phase 3: Polish and Effects

### Task 3.1: Add Prestige Celebration Effects
- [ ] Create particle burst effect for prestige
- [ ] Add large text pop "PRESTIGE X!"
- [ ] Add special HUD message
- [ ] Add sound effect placeholder (comment for future)
- [ ] Add brief screen flash or glow effect
- **Acceptance Criteria:**
  - Prestige feels celebratory and rewarding
  - Effects are noticeable but not annoying
  - Effects don't interfere with gameplay
  - Effects clear properly after animation

### Task 3.2: Add Prestige Button Animation
- [ ] Add pulsing glow to prestige button
- [ ] Add hover effect
- [ ] Add click animation
- [ ] Use special prestige color (purple/gold)
- **Acceptance Criteria:**
  - Button draws attention when available
  - Animations are smooth
  - Button feels premium/special

### Task 3.3: Improve Prestige Confirmation Dialog
- [ ] Style dialog with prestige theme
- [ ] Add visual comparison of rewards (before/after)
- [ ] Add warning about progress reset
- [ ] Make benefits clear and exciting
- **Acceptance Criteria:**
  - Dialog is visually appealing
  - Information is easy to understand
  - Player understands trade-off
  - Dialog feels premium

---

## Phase 4: Edge Cases and Testing

### Task 4.1: Handle Edge Cases
- [ ] Prevent prestige with unclaimed rewards
- [ ] Handle prestige during autoroll (pause autoroll)
- [ ] Test prestige at multiplier cap (3.0x)
- [ ] Test prestige with city changes
- [ ] Test rapid prestige attempts
- **Acceptance Criteria:**
  - All edge cases handled gracefully
  - No errors or unexpected behavior
  - User experience is smooth

### Task 4.2: Write Unit Tests
- [ ] Test `getRewardMultiplier` function
- [ ] Test `getScaledReward` function
- [ ] Test prestige eligibility logic
- [ ] Test prestige reset logic
- [ ] Test reward scaling calculations
- **Acceptance Criteria:**
  - All unit tests pass
  - Code coverage > 80%
  - Tests cover edge cases

### Task 4.3: Write Integration Tests
- [ ] Test full prestige flow
- [ ] Test prestige with different prestige levels
- [ ] Test reward claiming after prestige
- [ ] Test UI updates after prestige
- **Acceptance Criteria:**
  - Integration tests pass
  - Complete user flows tested
  - No regression issues

### Task 4.4: Manual Testing and QA
- [ ] Test prestige flow from start to finish
- [ ] Test at different prestige levels (0, 1, 2, 4+)
- [ ] Test reward scaling accuracy
- [ ] Test UI on different screen sizes
- [ ] Test with autoroll enabled
- [ ] Verify celebration effects
- **Acceptance Criteria:**
  - Feature works smoothly
  - No visual glitches
  - Feels rewarding and fun
  - Works on all platforms

### Task 4.5: Update Documentation
- [ ] Update PRD.md with prestige system
- [ ] Update conductor/product.md
- [ ] Add prestige to build checklist
- [ ] Document prestige formulas and scaling
- [ ] Update CHANGELOG.md
- **Acceptance Criteria:**
  - All documentation current
  - Feature properly described
  - Formulas documented for future reference

---

## Quality Gates

Before marking this track complete:
- [ ] All tasks completed and marked with commit SHAs
- [ ] All tests passing (unit + integration)
- [ ] Code coverage > 80%
- [ ] Manual testing complete
- [ ] Documentation updated
- [ ] No linting errors
- [ ] Feature reviewed and approved
- [ ] Checkpoint commit created

---

## Notes

### Design Decisions
- **Multiplier scaling:** 0.5x per prestige level, capped at 3.0x (Prestige 4+)
- **Prestige requirement:** All milestones claimed + 120+ event points
- **Sticker pack scaling:** Rounds up (1.5 packs = 2 packs)
- **Confirmation required:** Prevents accidental prestige
- **Celebration effects:** Makes prestige feel like an achievement

### Balance Considerations
- 3.0x cap prevents infinite scaling
- Prestige 1 (1.5x) should feel meaningful
- Prestige 4+ (3.0x) should feel powerful but not game-breaking
- Players should want to prestige multiple times

### Technical Considerations
- Prestige level stored in component state (no persistence yet)
- Reward scaling calculated on-the-fly
- Milestone display updates reactively
- Confirmation dialog uses native confirm() for now (can upgrade to custom modal later)

### Future Enhancements (Deferred)
- Persist prestige level to localStorage
- Add prestige-exclusive rewards
- Add prestige statistics tracking
- Add custom prestige dialog component
- Add prestige leaderboard (if multiplayer added)
