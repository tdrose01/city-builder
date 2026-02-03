# Track: Phase 10 - 3D Visual Overhaul

**Status:** Active 🚧
**Start Date:** 2026-02-03
**Goal:** "Monopoly Go" aesthetic with 3D board, particles, and camera juice.

## Context
The game mechanics are solid (Phase 1-9 complete), but the visuals are still flat DOM elements. To compete with modern mobile titles, we need a "juicy" 3D presentation.

## Strategy
We will incrementally replace the view layer.
1.  **Hybrid Step:** Build the 3D board *behind* the UI first.
2.  **Migration:** Move logic from `BoardLoop`'s render method to `Board3D`.
3.  **Cleanup:** Remove old DOM tile rendering once 3D is stable.

## Key Files
- `web/src/components/Scene3D/` (New Directory)
- `web/src/components/BoardLoop.jsx` (Heavy refactor incoming)
