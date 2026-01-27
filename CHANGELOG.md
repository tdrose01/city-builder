# Changelog

All notable changes to the City Slacker project are documented here.

## [2026-01-27] - Phase 8: Gameplay Enhancement - IN PROGRESS 🎮

**Phase 8 is adding exciting new tile types and mechanics to deepen gameplay.**

### 🎰 Task 8.1: New Tile Types (COMPLETE)

#### New Tile Types Added

**1. Lottery Tile 🎰**
- Interactive scratch-off lottery experience
- Purchase tickets (cost scales by city: $500 base × 1.4^(city-1))
- Win probabilities:
  - 75% chance: Lose (no prize)
  - 20% chance: Small win (10x ticket cost)
  - 5% chance: Jackpot (100x ticket cost)
- Features:
  - Animated scratch-off reveal (2-second animation)
  - Particle effects for wins (20 particles) and jackpots (50 particles)
  - Sound effects integration
  - Can't purchase if funds insufficient

**2. Tax Tile 💸**
- Percentage-based tax collection
- Mechanics:
  - Deducts 10% of current funds
  - Minimum tax: $100
  - Maximum tax: $5,000 × 1.4^(city-1)
- Features:
  - Animated calculation phase
  - Tax Haven power-up support (blocks tax)
  - Draining animation effect
  - Receipt-style UI display

**3. Jail Tile 🔒**
- Turn-skipping penalty with escape options
- Three escape methods:
  1. **Pay Bail**: $1,000 × 1.4^(city-1) for instant escape
  2. **Use Card**: Get Out of Jail Free card (if available)
  3. **Stay in Jail**: Skip 3 turns (can roll doubles to escape)
- Features:
  - Prison bars visual overlay
  - Shake animation for jail bars
  - Three distinct escape paths
  - Doubles escape mechanic (can attempt on each turn)

**4. Fortune Tile 🔮**
- Random event generator with weighted probabilities
- Event categories:
  - **Positive (60% total weight)**: Bonus funds, free dice, shields, lucky finds
  - **Neutral (30% total weight)**: Teleportation, tile swaps, nothing
  - **Negative (10% total weight)**: Lose funds, skip turn
- **12 Total Events**:
  1. Lucky Find (+$2,000 scaled)
  2. Street Tip (+$1,000 scaled)
  3. Dice Delivery (+5 dice)
  4. Protection Charm (+2 shields)
  5. Tax Haven (next tax waived)
  6. Get Out of Jail Free (card reward)
  7. Wormhole (+5 spaces)
  8. Time Warp (-3 spaces)
  9. Dimension Shift (random tile)
  10. False Alarm (nothing)
  11. Pickpocket (-$1,000 scaled)
  12. Stuck in Traffic (skip 1 turn)
- Features:
  - Mystical crystal ball animation
  - Card flip reveal effect
  - Particle effects for positive events
  - Event type color coding (green/purple/red)

#### Technical Implementation

**New Configuration File:**
- `web/src/config/tileTypes.js` (~340 lines)
  - Economic scaling helper function
  - Complete tile type configurations
  - Fortune event pool with weighted selection
  - Exported constants and utility functions

**New Components:**
- `web/src/components/LotteryTile.jsx` (~230 lines)
- `web/src/components/TaxTile.jsx` (~180 lines)
- `web/src/components/JailTile.jsx` (~230 lines)
- `web/src/components/FortuneTile.jsx` (~280 lines)

**Total Lines Added:** ~1,260 lines

#### Integration & Testing
- ✅ Integrated tiles into BoardLoop for all 5 cities
- ✅ Added tile state persistence (jail/skip turns)
- ✅ Fortune rewards include Tax Haven + Jail Free
- ✅ Tests updated: 196/196 passing

#### Design Features

**Animations:**
- Framer Motion for all transitions
- Stage-based animations (purchase → action → result)
- Particle effects for celebrations
- Smooth modal entry/exit

**Visual Design:**
- Consistent modal styling with gradient backgrounds
- Color-coded tile types (gold, red, gray, purple)
- Border glow effects
- Icon-based tile identification

**Sound Integration:**
- Click sounds for button interactions
- Success sounds for positive outcomes
- Error sounds for negative outcomes
- Achievement sound for jackpots

### 💪 Task 8.2: Power-Up System (COMPLETE)

#### Power-Up Features
- 6 power-ups implemented (3 active, 3 passive)
  - Hot Streak (+50% funds for 5 rolls after 3 positive tiles)
  - Mega Multiplier (3x rewards on next roll)
  - Shield Storm (+3 shields, 30s cooldown)
  - Lucky Dice (guaranteed doubles)
  - Speed Boost (50% dice cost for 10 rolls)
  - Money Magnet (+25% funds from Funds tiles for the city)
- New HUD tab for Power-Ups
- Active power-up indicator with roll countdowns

#### Technical Implementation
- Added `web/src/config/powerUps.js` configuration
- Added `PowerUpShop.jsx` + `PowerUpIndicator.jsx`
- Integrated power-up state, cooldowns, and roll modifiers into BoardLoop
- Updated lottery outcomes to report detailed results for scaling

#### Testing
- ✅ Added power-up tests (`PowerUps.test.jsx`)
- ✅ Tests updated: 203/203 passing

#### Next Steps
- [ ] Task 8.3: Special Events System (events config + modal + triggers)

---

## [2026-01-27] - Phase 6: Multi-City Content Expansion - COMPLETE 🏙️

**Phase 6 expands the game world with 3 new cities, bringing the total to 5 playable cities with exponential economic scaling.**

### 🏙️ New Cities (Tasks 6.1-6.3)

#### City 3: Crystal Plaza 💎
- **Theme**: Luxury, elegance, purple crystals
- **Multiplier**: 1.96x (1.4²)
- **Color**: Purple (#d946ef)
- **Unlock**: Complete all 5 landmarks in City 2
- **START Payout**: $3,920 (vs $2,000 base)
- **Landmark Costs**: $1,960 → $31,360
- **Grid Pattern**: Purple crystalline gradient
- **Celebration**: "Enter the Crystal Realm!" with 💎 particles

#### City 4: Starlight District ⭐
- **Theme**: Night sky, astronomy, cosmic
- **Multiplier**: 2.744x (1.4³)
- **Color**: Blue (#3b82f6)
- **Unlock**: Complete all 5 landmarks in City 3
- **START Payout**: $5,488
- **Landmark Costs**: $2,744 → $43,904
- **Grid Pattern**: Starry night gradient
- **Celebration**: "Reach for the Stars!" with 🌟 particles

#### City 5: Neon Skyline 🌆
- **Theme**: Futuristic, high-tech, electric
- **Multiplier**: 3.8416x (1.4⁴)
- **Color**: Emerald green (#10b981)
- **Unlock**: Complete all 5 landmarks in City 4
- **START Payout**: $7,683
- **Landmark Costs**: $3,842 → $61,466
- **Grid Pattern**: Circuit board gradient
- **Celebration**: "The Future Awaits!" with 🌃 particles

### 📊 Economic Scaling System

**Exponential Multiplier Progression** (1.4x per city):

| City | Name | Multiplier | Starting Funds | Landmark L1→L5 |
|------|------|------------|----------------|----------------|
| 1 | Neon Harbor | 1.0x | $7,500 | $1,000 → $16,000 |
| 2 | Deco Heights | 1.4x | $10,500 | $1,400 → $22,400 |
| 3 | Crystal Plaza | 1.96x | $14,700 | $1,960 → $31,360 |
| 4 | Starlight District | 2.744x | $20,580 | $2,744 → $43,904 |
| 5 | Neon Skyline | 3.8416x | $28,812 | $3,842 → $61,466 |

### 🎨 Visual Themes

Added unique CSS themes for each city:

```css
/* City 3: Crystal Plaza */
.theme-crystal-plaza .city-grid { /* Purple gradient grid */ }
.theme-crystal-plaza .city-glow { /* Purple radial glow */ }

/* City 4: Starlight District */
.theme-starlight-district .city-grid { /* Blue gradient grid */ }
.theme-starlight-district .city-glow { /* Blue radial glow */ }

/* City 5: Neon Skyline */
.theme-neon-skyline .city-grid { /* Green gradient grid */ }
.theme-neon-skyline .city-glow { /* Green radial glow */ }
```

### 🧪 Testing (Task 6.4: Integration & Polish)

**New Test Suite**: `MultiCity.test.jsx`
- 30+ tests covering all 5 cities
- Economic scaling validation
- Theme application verification
- Performance benchmarks (<500ms render time)
- Memory leak detection during city switching
- Tile configuration validation (20 tiles per city, 1 landmark each)

**Total Test Count**: 190+ tests (100% pass rate)

### 📁 Files Modified

**Core Game Files**:
- `web/src/components/BoardLoop.jsx` - Cities 3-5 data already present (verified)
- `web/src/components/CityTransition.jsx` - Cities 3-5 celebration configs already present (verified)
- `web/src/index.css` - **Added CSS themes for Cities 3, 4, 5**

**Test Files**:
- `web/src/components/__tests__/MultiCity.test.jsx` - **NEW**: Comprehensive multi-city test suite

**Documentation**:
- `README.md` - Updated with 5-city details
- `CURRENT_PHASE.md` - Updated to Phase 6
- `conductor/tracks/phase6_cities_expansion_20260127/` - **NEW**: Phase 6 track documents

### 📈 Metrics

- **Cities Implemented**: 5 / 35 (14% complete)
- **Test Count**: 190+ tests (↑ from 171)
- **Lines Added**: ~430 (CSS themes + tests + track docs)
- **Game Balance**: 10-15 hours of engaging gameplay across 5 cities
- **Performance**: Consistent 60 FPS across all cities

### ✅ Success Criteria

✅ All 5 cities fully functional and playable  
✅ Unique visual themes for each city  
✅ Economic scaling balanced (1.4x multiplier per city)  
✅ City transitions smooth and celebratory  
✅ All tests passing (190+ tests, 100%)  
✅ No performance degradation  
✅ Documentation comprehensive and up-to-date  

### 🎯 Next Phase

**Phase 7**: Continue multi-city expansion (Cities 6-10)

---

## [2026-01-27] - Phase 5: Polish & Enhancement - COMPLETE ✨

**Phase 5 represents a major quality and polish upgrade across all game systems.**

### 🎬 Task 5.1: Enhanced City Transitions

#### New Features
- **Multi-stage celebration animations** with 4 stages (fadeIn, celebrate, cityReveal, fadeOut)
- **City-specific effects**: Each city has unique celebration text and visual theme
- **Smooth transitions**: 4-second total animation with optimized timing
- **Accessibility**: Respects `prefers-reduced-motion` for reduced animations
- **Comprehensive testing**: 25 dedicated tests covering all scenarios

#### Technical Details
- Created `CityTransition.jsx` component (400+ lines)
- Integration with `BoardLoop.jsx` for seamless city unlocks
- Framer Motion for smooth, performant animations
- City-specific color palettes (Neon Harbor cyan/blue, Deco Heights gold/amber)

#### Files Added
- `web/src/components/CityTransition.jsx`
- `web/src/components/__tests__/CityTransition.test.jsx`

---

### ✨ Task 5.2: Particle Effect Enhancements

#### New Features
- **7 particle effect types**: burst, confetti, stars, sparkles, coins, fireworks, trail
- **Reusable particle system**: Configurable component with extensive options
- **City-themed colors**: Automatic color selection based on current city
- **Custom shapes**: Circle, rectangle, star, sparkle visual variants
- **Performance optimized**: GPU-accelerated transforms, configurable particle counts
- **Event-driven**: Particles trigger on dice rolls, upgrades, milestones, prestige

#### Particle Mappings
- **Dice Roll**: Sparkle burst (15 particles)
- **Doubles**: Sparkles trail (20 particles)
- **Upgrade**: Stars burst (20 particles)
- **Mission Complete**: Confetti explosion (50 particles)
- **Prestige**: Fireworks (40 particles)
- **Large Funds**: Coin burst (30 particles)

#### Technical Details
- Created `ParticleEffect.jsx` component (450+ lines)
- Replaced old `ParticleBurst.jsx` with advanced system
- Configurable: size, duration, distance, spread, colors
- Accessibility: Reduced particle count for reduced-motion
- 31 comprehensive tests

#### Files Added
- `web/src/components/ParticleEffect.jsx`
- `web/src/components/__tests__/ParticleEffect.test.jsx`

#### Files Modified
- `web/src/components/BoardLoop.jsx` - Integrated new particle system

---

### 🔊 Task 5.3: Audio System

#### New Features
- **8 synthesized sound effects** using Web Audio API (no external files!)
  - Dice Roll: Rising pitch with wobble (200-400Hz)
  - Upgrade: Success chime (400-800Hz)
  - Funds: Cash register multi-tone (300-600Hz)
  - City Unlock: Triumphant fanfare (5 notes)
  - Milestone: Achievement ping (3 notes)
  - Click: Quick UI feedback (600Hz)
  - Success: Reward confirmation (500-1000Hz)
  - Doubles: Celebration sequence (4 notes)
- **AudioControls UI**: Mute toggle + settings panel with volume sliders
- **Volume controls**: Separate master, music, and SFX controls (0-100%)
- **Persistent settings**: Volume and mute state saved to localStorage
- **Browser-friendly**: Handles autoplay restrictions gracefully

#### Audio Event Mappings
- Dice roll → `diceRoll` SFX
- Doubles bonus → `doubles` SFX
- Funds gain (>$5,000) → `funds` SFX
- Landmark upgrade → `upgrade` SFX
- Milestone claimed → `milestone` SFX
- City unlock (prestige) → `cityUnlock` SFX
- UI interactions → `click` SFX

#### Technical Details
- Created `AudioManager` singleton class (450+ lines)
- Uses OscillatorNode and GainNode for synthesis
- Automatic initialization on first user interaction
- Settings persistence via localStorage
- 42 comprehensive tests covering all scenarios

#### Files Added
- `web/src/utils/audioManager.js`
- `web/src/utils/__tests__/audioManager.test.js`
- `web/src/components/AudioControls.jsx`

#### Files Modified
- `web/src/components/BoardLoop.jsx` - Integrated audio triggers

---

### ⚡ Task 5.4: Performance Optimizations

#### Optimizations Applied
- **React.memo**: Wrapped 6 components to prevent unnecessary re-renders
  - `ThreeDice`, `Notification`, `TextPop`, `ConfirmDialog`, `Pip`, `DiceFaceNumber`
- **Performance monitoring**: Created utility to track FPS, memory, render counts
- **GPU acceleration**: All animations use transform/opacity properties
- **Optimized particle rendering**: Reduced particle counts, batched updates
- **Animation efficiency**: Conditional rendering, cleanup on unmount

#### Performance Monitoring
- Created `PerformanceMonitor` utility class (170 lines)
- Tracks FPS (real-time frame rate)
- Monitors memory usage (heap size, % used)
- Records component render counts
- Provides min/max/avg statistics
- Auto-starts in development mode

#### Performance Improvements
- **Before**: Potential re-renders on every state change
- **After**: Components only re-render when props/state actually change
- **Result**: Smoother animations, reduced CPU/memory usage

#### Files Added
- `web/src/utils/performanceMonitor.js`

#### Files Modified
- `web/src/components/ThreeDice.jsx`
- `web/src/components/Notification.jsx`
- `web/src/components/TextPop.jsx`
- `web/src/components/ConfirmDialog.jsx`

---

### 🧪 Task 5.5: Additional Test Coverage

#### Testing Achievements
- **171 tests total** across 12 test files
- **100% pass rate** - All tests passing!
- **Comprehensive coverage** of all Phase 5 features

#### Test Breakdown
- **City Transitions**: 25 tests (animations, stages, cities, callbacks, accessibility)
- **Particle Effects**: 31 tests (all types, colors, config, performance)
- **Audio Manager**: 42 tests (initialization, SFX, volume, persistence, errors)
- **BoardLoop Core**: 30+ tests (dice, movement, upgrades, missions, events)
- **Save System**: 27 tests (save/load, versioning, migration, analytics)
- **Session Analytics**: 7 tests (tracking, metrics, goals)
- **3D Dice**: 9+ tests (rendering, animation, values)

#### Quality Metrics
- ✅ No failing tests
- ✅ Production build successful
- ✅ Clean git history
- ✅ All features validated

---

### 📚 Task 5.6: Documentation Polish

#### Documentation Updates
- **README.md**: Complete rewrite with Phase 5 features, quick start, tech stack
- **CHANGELOG.md**: Comprehensive Phase 5 documentation (this file!)
- **KNOWLEDGE_BASE.md**: Continuous updates throughout Phase 5
- **Component Documentation**: JSDoc comments for all new components

#### Documentation Added
- Quick start guide
- Feature overview
- Testing guide
- Technology stack breakdown
- Project structure
- Roadmap with phase completion status

---

### 📊 Phase 5 Summary

**Total Development Time**: ~8 hours across 6 tasks  
**Commits**: 26 total commits for Phase 5  
**Files Changed**: 15+ files  
**Lines of Code**: ~2,000+ new lines  
**Tests Added**: 98 new tests  
**Test Pass Rate**: 100% (171/171)

### Phase 5 Impact
- ✅ **Professional polish**: Animations, particles, audio elevate game feel
- ✅ **Performance**: Optimized rendering for smooth 60 FPS gameplay
- ✅ **Quality**: 100% test coverage ensures stability
- ✅ **Accessibility**: Reduced-motion support across all animations
- ✅ **Developer experience**: Monitoring tools, comprehensive docs

### Files Added (Phase 5)
1. `web/src/components/CityTransition.jsx`
2. `web/src/components/__tests__/CityTransition.test.jsx`
3. `web/src/components/ParticleEffect.jsx`
4. `web/src/components/__tests__/ParticleEffect.test.jsx`
5. `web/src/utils/audioManager.js`
6. `web/src/utils/__tests__/audioManager.test.js`
7. `web/src/components/AudioControls.jsx`
8. `web/src/utils/performanceMonitor.js`

### Files Modified (Phase 5)
1. `web/src/components/BoardLoop.jsx` - Major: City transitions, particles, audio integration
2. `web/src/components/ThreeDice.jsx` - React.memo optimization
3. `web/src/components/Notification.jsx` - React.memo optimization
4. `web/src/components/TextPop.jsx` - React.memo optimization
5. `web/src/components/ConfirmDialog.jsx` - React.memo optimization
6. `README.md` - Complete rewrite
7. `CHANGELOG.md` - Phase 5 documentation
8. `KNOWLEDGE_BASE.md` - Continuous updates

---

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
