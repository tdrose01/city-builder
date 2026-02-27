# City-Builder Roadmap

## 🔧 Stabilization Hotfixes (2026-02-23)
- [x] Fixed JSX parse issue in `web/src/components/StickerPackOpener.jsx` (`as number` removed for JS-safe `Number(...)`).
- [x] Fixed malformed API startup log line in `apps/api-node/src/index.js` (`app.listen` string repaired).
- [x] Converted TS-only syntax out of JSX in `web/src/components/Perks/PerkTreeModal.jsx`.
- [x] Exported `storageAdapter` from `web/src/social/core/SocialStore.js` to satisfy `friendManager` import.
- [x] Removed TS type-only imports from JSX files (`PackType`, `PassTier`) causing build-time export errors.
- [x] Fixed CSS animation declaration in `web/src/index.css` (`.board-stage-shake` block -> `@keyframes board-stage-shake`).
- [x] Build verification: `web` production build passes (warnings only).
- [ ] ACTIVE: investigate high-severity runtime bug where game screen flashes then disappears (`BUGS.md`).


## 🧪 Test Stabilization Sprint (2026-02-23 Night)
- [x] Run validation suite (`web` build + vitest + api-node syntax check).
- [ ] ACTIVE: Fix `BoardLoop` missing state declarations and `activeSeason` initialization order bug.
- [ ] ACTIVE: Fix `BoardLoop` test/runtime infinite render loop (`Maximum update depth exceeded`).
- [ ] Add test-safe WebGL/canvas mocks for jsdom (`HTMLCanvasElement.getContext` not implemented in test env).
- [ ] Restore reliable `localStorage` test mocks (`clear/setItem` missing in failing suites).
- [ ] Fix social constants wiring (`VISITOR_LOG_KEY` undefined in `visitManager` path).
- [ ] Re-run `npm run test` until core regression suites are green.
- [ ] Follow-up: investigate runtime bug where game screen flashes then disappears (`BUGS.md`).

## ✅ Phase 12: Events & Seasons
- [x] Season Pass System (20-level "Solar Surge")
- [x] Limited-Time Event logic (Gold Rush, Halloween Hunt)
- [x] Community Simulation engine (Global Milestones)
- [x] Event Center UI Hub
- [x] Visual Themes & Atmospheric VFX (Lighting, Particles)

## ✅ Phase 13: Collections & Stickers
- [x] Sticker Data Architecture (Sets, Rarities)
- [x] Pack Opening Engine & Animations
- [x] Sticker Album UI
- [x] Social Trading & Requests
- [x] The Vault (Duplicate conversion to Star Power)

## ✅ Phase 14: Daily Goals & Missions
- [x] Mission Store & Daily Reset Engine (`useMissionStore.ts`)
- [x] Mission Board UI (`MissionBoard.jsx`)
- [x] Gameplay Integration (Rolls, Upgrades, Earnings, Social)
- [x] Streak Logic & Milestone Rewards (2, 7, 14, 30 day streaks)

## ✅ Phase 15: Social Simulation & Polish
- [x] Reciprocity Engine (High-frequency simulated friend gifting)
- [x] Dynamic Friend Growth (Leaderboard moves in real-time)
- [x] Simulated Visitors (Friends drop bonuses on the board)
- [x] Social Activity Feed (Unified interaction history)
- [x] 3D Visitor Avatars (Floating friend emojis on gifted tiles)

## ✅ Phase 16: Dynamic World & Meta-Progression
- [x] Dynamic Weather System (Rain/Snow/Storm modifiers & VFX)
- [x] Landmark Tier 2 Mastery (Ascension system)
- [x] Global Mastery Persistence (`useMasteryStore.ts`)
- [x] Global Buff Integration (Applying Mastery bonuses to economy)
- [x] Prestige City Implementation (New city unlocks via Global Prestige)
- [x] Final Balance Pass & Bug Fixes

## ✅ Phase 17: Competitive Social & Advanced Economy
- [x] Group Leaderboards (Dynamic cohorts of 50 players)
- [x] Social Heist Counter-mechanics (Shield traps)
- [x] Economy Sink: Landmark Decoration (Cosmetic upgrades for mastered buildings)
- [x] Legendary Sticker Sets (Ultra-rare cross-season collections)
- [x] Global Event: "The Great Reconstruction" (World-wide construction goal)

## 🏗️ Phase 18: Urban Engineering & Perk Mastery
- [x] District Synergies (Synergy bonuses for landmark groupings)
- [x] The Nexus Perk Tree (Permanent branching skill tree)
- [ ] Building Skins (Cosmetic variants for Tier 2 buildings)
- [ ] Historical Archives (Player statistics and legacy timeline)
- [ ] Dynamic Time of Day (Day/Night cycle synced to real-world time)
