# Implementation Plan - Gameplay Balance and Content Expansion

## Phase 1: Gameplay Balance and Pacing [checkpoint: 41188aa]
- [x] Task: Audit current pacing inputs
    - [x] Review `DESIGN_DOC.md` targets and existing tuning notes
    - [x] Inventory current values in `web/src/components/BoardLoop.jsx` and economy CSVs
    - [x] Identify the deltas from 60-120s / 8-12 roll targets
- [x] Task: Tune roll probabilities and milestone rewards
    - [x] Adjust dice roll and multiplier tuning inputs
    - [x] Update milestone thresholds and payouts for pacing
    - [x] Verify mission/event cadence targets in a simulated session
- [x] Task: Sync documentation and data
    - [x] Update affected CSVs and any tuning notes in `DESIGN_DOC.md`
    - [x] Add or update tests covering tuning logic
    - [x] Confirm no-scroll layout and readability remain intact
- [x] Task: Conductor - User Manual Verification "Phase 1: Gameplay Balance and Pacing" (Protocol in workflow.md)
- [x] Task: Address Feedback - Mission Completion and Claim All 291487b
    - [x] Implement a "Claim All" button for milestone rewards
    - [x] Add visual/functional feedback when all missions are complete
    - [x] Ensure "nothing happened" state is resolved when all rewards are claimed

## Phase 2: Second City Content [checkpoint: 2754e40]
- [x] Task: Define second city layout and tiles
    - [x] Create a second city tile set with unique labels and rewards
    - [x] Add a selection or progression hook to switch cities
    - [x] Ensure tile layout remains perimeter loop consistent
- [x] Task: Implement visuals and labels
    - [x] Update tile rendering for second city visuals
    - [x] Confirm readability on desktop and mobile
- [x] Task: Automated Verification - Phase 2: Second City Content (BoardLoop unit tests)

## Phase 3: Sticker Progression Hints
- [x] Task: Surface sticker album progress hints
    - [x] Add HUD cues for set progress and currency flow
    - [x] Keep hints compact and no-scroll compliant
    - [x] Update documentation if UI copy changes
- [x] Task: Automated Verification - Phase 3: Sticker Progression Hints (BoardLoop unit tests)
