# Implementation Plan - Board Card Readability and Tile Layout

## Phase 1: Audit and Constraints [checkpoint: 6d7a9a1]
- [x] Task: Audit tile readability and alignment
    - [x] Inventory tiles with long names or clipped labels in `web/src/components/BoardLoop.jsx`
    - [x] Review relevant CSS in `web/src/index.css` (tile sizing, typography, spacing)
    - [x] Capture target viewport sizes for desktop/laptop no-scroll validation

## Phase 2: Implement Readability and Layout Fixes
- [x] Task: Improve tile label legibility dd54574
    - [x] Adjust typography/contrast for tile labels and info
    - [x] Validate line wrapping for long names
- [x] Task: Ensure cards sit correctly on the board 838ff20
    - [x] Tighten tile spacing if needed
    - [x] Verify perimeter alignment remains stable at multiple sizes

## Phase 3: Verification and Documentation
- [x] Task: Add or update automated checks where feasible
    - [x] Add unit or E2E assertions for tile label visibility
- [x] Task: Document updates
    - [x] Update `PRD.md` and `progress.txt` with completion notes
