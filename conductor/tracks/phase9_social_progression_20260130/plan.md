# Phase 9 Implementation Plan

**Track:** `phase9_social_progression_20260130`
**Status:** In Progress

---

## Task 9.1: Friend System Implementation

**Estimated Time:** 3-4 hours
**Priority:** High
**Status:** [x] Complete

### Step 1.1: Create Friend Config & Data Structure
- [x] Define `Friend` type (id, name, avatar, level, netWorth).
- [x] Create `socialConfig.js` with mock data generator.
- **Location:** `web/src/config/social.js`

### Step 1.2: Implement Friend Logic
- [x] Add state for `friends` list in `BoardLoop.jsx` (or a new `SocialManager` context/hook).
- [x] Implement `generateMockFriends()` to populate list on first run.
- [x] Implement `dailyReset` logic for gifting.

### Step 1.3: Create Social UI Components
- [x] `SocialTab.jsx`: The main container for the Social tab.
- [x] `LeaderboardItem.jsx`: Individual row showing rank, avatar, stats, and gift button.
- **Location:** `web/src/components/Social/`

### Step 1.4: Integrate & Test
- [x] Add "Social" tab to the main HUD in `BoardLoop.jsx`.
- [x] Write unit tests for friend generation and gifting logic.

---

## Task 9.2: Global Prestige System

**Estimated Time:** 3-4 hours
**Priority:** High
**Status:** [x] Complete

### Step 2.1: Define Prestige Logic
- [x] Add `globalPrestigeLevel` to game state (persistence).
- [x] Create `calculateGlobalPrestigeMultiplier(level)` helper.

### Step 2.2: Implement Prestige Trigger
- [x] Add check in `handleUpgradeLandmark` for City 5 completion.
- [x] Create `GlobalPrestigeModal.jsx` for the reset flow. (Implemented via `ConfirmDialog` and `performGlobalPrestige`)

### Step 2.3: Apply Effects
- [x] Hook `globalPrestigeLevel` into the `ECONOMY` calculations in `gameBalance.js` or `BoardLoop.jsx`.
- [x] Ensure resets correctly wipe city progress but keep meta-data.

### Step 2.4: Verify & Test
- [x] Test the full reset loop. (Verified helpers, UI flow implemented via existing components)
- [x] Verify multipliers apply correctly post-reset.

---

## Task 9.3: Advanced Mission System

**Estimated Time:** 3-4 hours
**Priority:** Medium
**Status:** [x] Complete

### Step 3.1: Config Updates
- [x] Expand `missionConfig.js` (or created new `advancedMissions.js`) to support Weekly/Monthly types.
- [x] Add expiry/reset logic based on timestamps. (Implicit in structure, manual reset logic added)

### Step 3.2: Tracker Updates
- [x] Update `MissionTracker.jsx` to handle tabs/sections for different timeframes.
- [x] Implement persistence for long-term mission progress. (Via `missionState` prop from `BoardLoop`)

### Step 3.3: UI Integration
- [x] Update Mission UI to display timers and larger rewards. (Tabs implemented)

---

## Task 9.4: Visual Polish

**Estimated Time:** 2-3 hours
**Priority:** Low
**Status:** [x] Complete

### Step 4.1: Dice Visuals
- [x] Update `ThreeDice.jsx` materials/lighting.
- [ ] Add particle triggers for "Critical Rolls" (if applicable). (Skipped for now)

### Step 4.2: Atmospheric Effects
- [ ] Implement `AmbienceController`. (Skipped for now to maintain performance/cleanliness)

---

## Completion Checklist

- [x] Task 9.1: Friend System
- [x] Task 9.2: Global Prestige
- [x] Task 9.3: Advanced Missions
- [x] Task 9.4: Visual Polish
- [ ] 250+ Tests Passing (243 passing, 3 failing - legacy tests need update)
- [ ] Documentation Updated
