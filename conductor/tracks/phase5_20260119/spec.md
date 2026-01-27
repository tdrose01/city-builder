# Specification - Board Card Readability and Tile Layout

## Overview
This track focuses on making board tile cards lay correctly on the perimeter and improving legibility for long labels without breaking the no-scroll layout.

## Objectives
- **Tile Readability:** Ensure every tile name and payout is readable at typical desktop and laptop resolutions.
- **Layout Fidelity:** Keep tiles aligned on the perimeter loop with consistent orientation and spacing.
- **Consistency:** Preserve the current visual theme while improving contrast and spacing.

## Requirements
- Maintain the no-scroll, single-screen layout.
- Avoid regressions to HUD density, dice visibility, and board centering.
- Keep typography and visual language aligned with the current style.
- Changes must be documented and testable where practical.

## Success Criteria
- No tile labels are clipped or illegible on desktop and common laptop viewports.
- Tile cards align consistently with the board perimeter without overlapping HUD elements.
- Readability improvements are reflected in `PRD.md` and `progress.txt`.
