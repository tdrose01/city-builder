# Changelog

## [2026-01-23] - City 2 Expansion & Persistence Fixes

### New Features

#### City 2: Deco Heights
- **New City Content**: Fully implemented "Deco Heights" with a unique 20-tile layout and Gold/Amber theme.
- **Economic Scaling**: 1.4x multiplier applied to all tile payouts and landmark upgrade costs.
- **Visual Improvements**: Custom background grid and radial glow specific to Deco Heights.
- **Unlock System**: Automated progression check; advances from Neon Harbor when all 5 landmarks are maxed.
- **Transition Flow**: Celebratory confirmation dialog with "Travel to City 2" action and travel bonus (+1 Sticker Pack).
- **Gated Mechanics**: "Combo" mechanic (3 hits in 10 rolls) is now gated to City 2+, simplifying the early game.

### Bug Fixes & Stability

#### State Persistence (Critical Fix)
- **Landmark Level Save**: Fixed bug where landmark upgrades were lost upon page refresh. Tiles and their levels are now properly serialized to localStorage.
- **Player Position Save**: The player's current tile position is now saved and restored.
- **Autoroll Reset**: Fixed UI conflict where autoroll could stay active during a full game reset.

#### Automated Testing
- **Progression Spec**: Added `tests/city-progression.spec.js` to verify city unlock and transition.
- **Test Robustness**: Updated analytics playtests to handle modern HUD selectors and async movement states.

## [2026-01-23] - Gameplay Balance & Data Collection

### New Features

#### Automated Playtest Suite
- **Playwright-driven sessions** (normal, aggressive, conservative) for repeatable data collection
- **LocalStorage extraction** and automated JSON export to `playtest-results/`
- **10-session automated validation** integrated into the development workflow

#### Gameplay Analytics System
- **SessionMetrics tracker** recording rolls, tile frequency, economy (funds/dice), and meta-progression
- **Markdown and CSV reporting** with automated goal validation and tuning recommendations
- **In-game Analytics Viewer** for immediate feedback on balance targets

### Gameplay Balance Tuning

#### Dice & Economy
- **Doubles Bonus**: Increased to 0.50x of total roll (e.g., Double 6 = +6 Dice) for sustainable sessions
- **Points per Roll**: Increased to 15 (from 10) to ensure Milestone 1 is hit on the first roll
- **Starting Funds**: Increased to $7,500 (from $5,000) to enable immediate first-lap upgrades
- **Starting Dice**: Baselined at 50 for City 1

#### Event Progression
- **Milestone Thresholds**: Optimized to `[15, 30, 50, 75, 100]` for reachable targets within a single session
- **Reward Hook**: Guaranteed first reward within 1-2 rolls

### Documentation
- Created `web/ANALYTICS_GUIDE.md` and `web/PLAYTEST_GUIDE.md`
- Updated `PRD.md`, `GDD.md`, and `DESIGN_DOC.md` with final balance values
- Updated `ARCHITECTURE.md` to reflect new balance configuration

---

## [2026-01-20] - Major Feature Update

### New Features

#### Autoroll System
- **Autoroll toggle button** for continuous automatic dice rolling
- Automatically pauses when landing on upgradeable landmarks
- Shows clear ON/OFF state with pulsing animation when active
- Stops automatically when dice run out or city changes
- 500ms delay between rolls for smooth gameplay

#### Event Prestige System
- **Prestige levels** allow resetting milestone progress for enhanced rewards
- Reward multiplier scaling: 1.5x per prestige level (capped at 3.0x at Prestige 4+)
- Prestige confirmation dialog showing reward improvements
- Prestige badge and multiplier display in Event Progress section
- Celebration effects (particles, text pop) when prestiging
- All milestone rewards scale with prestige level
- Example: At Prestige 2 (2.0x), the 120pt milestone gives $30,000 instead of $15,000

#### Mission System Improvements
- **Completion rewards**: $10,000 Funds + 25 Dice + 2 Sticker Packs when all missions complete
- **Mission reset system**: "Start New Mission Cycle" button for infinite replayability
- Mission cycle counter tracks how many times missions have been completed
- Particle burst celebration effect on completion
- Total rewards per cycle: $13,500 Funds + 30 Dice + 2 Shields + 2 Packs

#### Landmark Visibility Improvements
- Landmark tiles always show level progression (e.g., "3/5")
- Color-coded: Gold for upgradeable, Green when maxed
- "MAX" badge displayed when fully upgraded
- Upgrade button shows clear level transition (e.g., "Upgrade 2→3 ($4,000)")
- Larger, more visible level display (11px font)

### Technical Changes
- Added `eventPrestigeLevel` state management
- Implemented `getRewardMultiplier()` and `getScaledReward()` helper functions
- Updated `claimReward()` and `handleClaimAllRewards()` to use scaled amounts
- Added `handlePrestige()` function with confirmation dialog
- Enhanced `handleAllMissionsComplete()` with substantial rewards
- Added mission reset functionality in MissionTracker component
- Improved landmark tile rendering with always-visible level display

### Files Modified
- `web/src/components/BoardLoop.jsx` - Autoroll, prestige, mission rewards, landmark display
- `web/src/components/MissionTracker.jsx` - Mission reset and cycle tracking
- `conductor/tracks/autoroll_20260120/` - New track for autoroll feature
- `conductor/tracks/prestige_system_20260120/` - New track for prestige system

### User Experience
- ✅ Reduced repetitive clicking with autoroll
- ✅ Infinite replayability with prestige system
- ✅ Meaningful rewards for mission completion
- ✅ Clear visibility of landmark upgrade progress
- ✅ Better progression feedback and celebration effects

---

## [2026-01-20] - Board Redesign

### Major Changes
- **Complete board redesign** to match reference image with cleaner, more spacious layout
- Reduced from 40 tiles (10 per side) to **20 tiles (5 per side)** for better readability
- Changed grid from 11x11 to **6x6 uniform grid** with all tiles same size
- Increased tile sizes and spacing for improved user experience

### Visual Improvements
- **Uniform tile sizing**: All tiles (including corners) are now exactly the same size
- **Larger gaps**: Increased spacing between tiles from 6-10px to 12-20px
- **Bigger tiles**: Increased min-height from 60px to 110px with more padding
- **Cleaner labels**: Simplified to show just tile type in uppercase (FUNDS, HEIST, SHIELD, etc.)
- **Better text sizing**: Optimized font size (10px) and letter-spacing (0.05em) to fit on one line
- **Removed tile tags and payout info** from tile faces for cleaner look

### Layout Changes
- **Board status moved**: Relocated from bulky HUD bar above board to compact inline display in center
- **Equal space distribution**: Board and right panel now share space equally (1:1 ratio)
- **Responsive design**: Maintains clean layout on both desktop and mobile devices
- **Color-coded tiles**: Each tile type has distinct border color and subtle background tint

### Technical Changes
- Updated `TILE_COUNT` from 40 to 20
- Modified `getTilePosition` function for 6x6 grid layout
- Updated corner detection to check positions 0, 5, 10, 15 (instead of 0, 10, 20, 30)
- Removed all special corner tile styling - corners now inherit from regular tile styles
- Simplified tile rendering - removed corner class distinctions

### Tile Types (20 Total)
- **Corners (4)**: START, BONUS, HEIST (x2)
- **Regular tiles (16)**: FUNDS, RENT, BONUS, SHIELD, HEIST, STICKER, SHUTDOWN, DICE, CARD, LANDMARK

### Files Modified
- `web/src/index.css` - Complete board styling overhaul
- `web/src/components/BoardLoop.jsx` - Updated tile data, positioning, and rendering logic

### User Experience
- ✅ Much less congested board with breathing room
- ✅ All tiles clearly visible and readable
- ✅ Consistent spacing and sizing
- ✅ Clean, modern aesthetic matching reference design
- ✅ Board status integrated into center without taking extra space
