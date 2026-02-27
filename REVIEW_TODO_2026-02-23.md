# Code Review TODO (2026-02-23)

## Requested by Tom
- Fix item 1 now.
- Document and queue items 2-4.
- Keep a trackable TODO for Telegram reporting.

## Status
- [x] **1) Fix JSX structure**
  - File: `web/src/components/BoardLoop.jsx`
  - Action: Removed stray duplicated sticker/crafting markup block causing mismatched closing tags.
  - Result: Build moved past previous `</div>/</section>` mismatch.

- [ ] **2) Restore missing state/setter declarations in BoardLoop**
  - Missing symbols observed in usage:
    - `eventPrestigeLevel`, `setEventPrestigeLevel`
    - `isEventCenterOpen`, `setIsEventCenterOpen`
    - `setComparisonTarget`
    - `setNotification`
    - `updateMissionProgress`

- [x] **3) Fix API syntax error**
  - File: `apps/api-node/src/index.js`
  - Action: repaired malformed `app.listen(...console.log...)` string.
  - Result: API file now parses and build proceeds.

- [ ] **4) Stabilize BoardLoop module boundaries**
  - Split into focused hooks/modules (roll engine, economy resolver, event orchestration, UI state).

## Verification notes
- Build blocker in `web/src/components/StickerPackOpener.jsx` was fixed (`rarity as number` -> `Number(...)`).
- Additional JSX/TS cleanup completed in `PerkTreeModal.jsx` and `SeasonPassView.jsx`.
- `npm run build` now succeeds (warnings only).

## Telegram report template
"Items 1 and 3 are done (BoardLoop JSX structure + API syntax fix). Build blockers in StickerPackOpener/PerkTreeModal were also fixed and web build now passes with warnings only. Items 2 and 4 remain queued in `REVIEW_TODO_2026-02-23.md` and BUGS.md."