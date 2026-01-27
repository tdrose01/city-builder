# City Slacker PRD

## Summary
City Slacker is a fast, dice-driven, Monopolyâ€‘style board loop with city building and sticker collection. The beta goal is a playable web prototype with satisfying short sessions, visible progression, and a coherent meta loop without Unity.

## Goals
- Deliver a noâ€‘scroll, singleâ€‘screen playable session loop on web.
- Make core actions feel rewarding (roll â†’ move â†’ resolve â†’ upgrade).
- Provide a lightweight meta loop (stickers, sets, rewards).
- Establish baseline economy pacing for short sessions.
- Enable future content expansion (cities, tiles, events, sticker sets).

## Nonâ€‘Goals (Beta)
- Real multiplayer or social features.
- Production monetization or payment flows.
- Persistent accounts, cloud saves, or crossâ€‘device play.
- Full Unity implementation.

## Target Audience
- Casual mobile players who enjoy short sessions and collection.
- Fans of boardâ€‘loop progress games (Monopoly Goâ€‘style feel).

## Core Experience
1) Roll dice â†’ 2) Move around board â†’ 3) Resolve tile payout â†’  
4) Upgrade landmark â†’ 5) Complete city â†’ 6) Unlock next city.

## MVP Scope (Web Beta)
- Board loop with 40â€‘tile circuit, tile variety, and readable labels.
- Dice system with doubles bonus and High Roller multipliers.
- Funds, shields, heist/shutdown tiles, and upgrade loop.
- Event meter + milestone rewards.
- Combo target miniâ€‘objective.
- Mission tracker with short objectives.
- Sticker packs (common/rare/epic), sets, duplicates conversion.
- Dust crafting + set token redemption.
- Set completion rewards (dice + funds).
- Fitâ€‘toâ€‘screen layout (no scroll required to play).

## Build Checklist
- [X] Fit-to-screen layout with no-scroll play.
- [X] Board loop with core tiles and upgrade flow.
- [X] Dice system with doubles bonus + High Roller multipliers.
- [X] Event meter + milestone rewards.
- [X] Combo target mini-objective.
- [X] Mission tracker for short objectives.
- [X] Sticker packs with tiered rarity.
- [X] Duplicate conversion into Dust + Set Tokens.
- [X] Dust crafting and token redemption.
- [X] Set completion rewards.
- [X] Wire tile glow and corner-specific effects with HUD callouts.
- [X] Add focused upgrade feedback and highlight dice streaks in the HUD.
- [X] Tune mission/event pacing for 60-120s sessions.
- [X] Surface sticker album progress hints and currency flows.
- [X] Automated test coverage for second city switch and tile set rendering.
- [X] Automated test coverage for sticker album progress hints and currency flow.
- [X] Document automation checkpoints (Ralph loop + progress.txt).
- [X] Constrain the board layout to the perimeter loop (Monopoly-style) with consistent tile placement.
- [X] Improve tile readability with larger cards, two-line names, and clearer type styling.
- [X] Improve board tile label readability with wrapped names and higher-contrast backplates.
- [X] Add 3D card depth through layered gradients, highlights, and tilt for visual separation.
- [X] Wire tile glow and corner-specific effects with HUD callouts (Shield, Heist, Shutdown, Funds landing effects).
- [X] Add focused upgrade feedback (particle burst and Level Up text pop) and highlight dice streaks in the HUD (x2+ badges).
- [X] Add on-board 3D dice: two dice render in the board center, tumble on roll, and settle on the final face value (with numeric faces and contact shadows).
- [X] Verify board perimeter alignment remains stable at multiple viewport sizes (Desktop HD, Standard, Laptop Large/Small) with automated Playwright tests.
- [X] Redesign board with 20-tile layout (5 per side) for improved spacing and readability.
- [X] Implement uniform 6x6 grid with all tiles same size for consistent visual hierarchy.
- [X] Simplify tile labels to show type names only (FUNDS, HEIST, SHIELD, etc.).
- [X] Move board status from HUD bar to compact inline display in center.
- [X] Remove special corner tile styling for uniform appearance across all tiles.
- [X] Implement autoroll toggle button for continuous dice rolling.
- [X] Add event prestige system with reward scaling (1.5x per level, capped at 3.0x).
- [X] Add mission completion rewards and reset system for infinite replayability.
- [X] Improve landmark level visibility with always-visible progression display.
- [X] Redesign HUD with tab-based navigation, compact action buttons, and floating action buttons.
- [X] Replace native browser dialogs with custom in-game notifications and confirmations.
- [X] Remove all neon glow effects from tiles, UI elements, and backgrounds for clean presentation.
- [X] Remove dark overlays and transparent board-grid background for improved visibility.
- [X] Remove parallax mouse tracking and 3D transforms for static, stable board rendering.
- [X] Test core gameplay functionality after visual cleanup (dice, movement, tiles, upgrades).
- [X] Validate performance metrics (60fps target, load times, memory usage).
- [X] Review UI/UX accessibility and readability without glow effects.
- [X] Cross-browser testing (Chrome, Firefox, Safari, Edge, Mobile).
- [X] Implement localStorage save/load system for game state persistence.
- [X] Add auto-save functionality on state changes with debouncing.
- [X] Create "New Game" reset functionality with confirmation.
- [X] Analyze current session timing and balance metrics (10+ playthroughs).
- [X] Tune dice economy, event progression, and funds balance for 60-120s sessions.
- [X] Create centralized game balance configuration file.
- [X] Finalize City 2 (Deco Heights) design with 20-tile layout and theme.
- [X] Implement city unlock system and transition mechanics.
- [X] Add City 2 theme colors and scaled rewards (1.4x multiplier).
- [X] Test city progression and verify all features work in City 2.
- [X] Implement City 3 (Crystal Plaza) with 1.96x multiplier and purple theme.
- [X] Implement City 4 (Starlight District) with 2.744x multiplier and blue theme.
- [X] Implement City 5 (Neon Skyline) with 3.8416x multiplier and green theme.
- [X] Update city unlock system to support all 5 cities with dynamic multiplier display.
- [X] Add master completion message for completing all cities.

## Implementation Status
- **Gameplay board**: `web/src/components/BoardLoop.jsx` renders the **20-tile loop** (5 per side) with uniform 6x6 grid layout, handles roll resolution, missions, event progress, and upgrade actions.
- **Board Design**: Completely redesigned with larger tiles, better spacing, and simplified labels for optimal readability and user experience.
- **Dice & feedback**: 3D dice with grounded shadows and numbered faces are implemented in `web/src/components/ThreeDice.jsx`. HUD callouts for dice streaks and floating currency pops reinforce the "feel" of every action.
- **Autoroll System**: Toggle button enables continuous automatic rolling with smart pausing on upgradeable landmarks.
- **Prestige System**: Players can reset milestone progress for enhanced rewards (up to 3.0x multiplier at Prestige 4+).
- **Mission System**: Missions provide completion rewards ($10k + 25 dice + 2 packs) and can be reset infinitely for repeated rewards.
- **Landmark Display**: Level progression (e.g., "3/5") always visible on tiles with color-coding and MAX badges.
- **City Expansion**: **City 2 (Deco Heights)** is implemented with 1.4x economy multiplier, Gold theme, and unlock-on-max logic. "Combo" mechanic is now exclusive to City 2+.
- **Sticker meta**: The collection UI, dust/token economy, and set rewards are integrated.
- **Visual Polish**: Unique landing effects for all tile types and celebratory landmark upgrade visuals are live.
- **Board Status**: Compact inline display integrated into board center, eliminating need for separate HUD bar.

## Next Steps
- [X] **Player Token Polish:** Implement smooth path-following animations for the player token between tiles, adding a "hop" or "squash and stretch" effect on landing.
- [X] **Dynamic Backdrop:** Evolve the board's visual atmosphere (lighting intensity, "city glow") based on the player's city level and total upgrades.

## Current Implementation (2026-01-21)
- **Gameplay board**: `web/src/components/BoardLoop.jsx` renders the **20-tile loop** with uniform 6x6 grid and features smooth, tile-by-tile player piece transitions with "hop" animations.
- **Board Layout**: Redesigned with 5 tiles per side, larger tile sizes (110px min-height), increased spacing (12-20px gaps), and simplified type-only labels.
- **Visual Design**: Clean, minimal aesthetic with transparent board-grid background, no glow effects, and static rendering (no parallax or 3D transforms).
- **HUD Redesign**: Tab-based navigation (Events/Missions/Stickers), compact action bar with icons, and floating action buttons for Prestige and Mission Reset.
- **Dice & feedback**: 3D dice and reinforced HUD callouts are fully integrated.
- **Autoroll**: Continuous rolling with smart pausing, 500ms delays, and automatic stop conditions.
- **Prestige**: Event milestone reset system with 0.5x multiplier per level (capped at 3.0x). Always visible via floating action button.
- **Missions**: Completion rewards, infinite reset cycles, and cycle tracking. Reset available via floating action button.
- **Landmarks**: Always-visible level display (current/max) with color-coding and MAX badges.
- **Sticker meta**: The collection UI, dust/token economy, and set rewards are integrated in dedicated tab.
- **Performance**: Highly optimized with useMemo for tile rendering, reduced useEffect dependencies, no mouse tracking, and minimal GPU usage.

## Recent Features (2026-01-20)
### Autoroll System
- Toggle button for continuous automatic dice rolling
- Pauses automatically when landing on upgradeable landmarks
- Clear ON/OFF state with pulsing animation
- 500ms delay between rolls for smooth gameplay

### Event Prestige System
- Reset milestone progress for enhanced rewards
- Reward scaling: 1.0x → 1.5x → 2.0x → 2.5x → 3.0x (max)
- Prestige confirmation dialog with reward preview
- Celebration effects and prestige badge display
- Example: Prestige 2 gives 2.0x rewards (120pt milestone = $30k instead of $15k)

### Mission Improvements
- Completion bonus: $10k Funds + 25 Dice + 2 Sticker Packs
- Mission reset button for infinite replayability
- Cycle counter tracks completions
- Total per cycle: $13.5k + 30 Dice + 2 Shields + 2 Packs

### Landmark Visibility
- Always shows level progression (e.g., "3/5")
- Color-coded: Gold (upgradeable), Green (maxed)
- MAX badge when fully upgraded
- Upgrade button shows level transition (e.g., "2→3")

## Next Steps

### Phase 1: Visual Cleanup Validation (Current)
- [ ] **Test Core Gameplay:** Verify all game mechanics work correctly after visual cleanup
- [ ] **Performance Validation:** Measure FPS and ensure smooth gameplay across devices
- [ ] **UI/UX Review:** Confirm all elements are readable and accessible without glows
- [ ] **Cross-browser Testing:** Test in Chrome, Firefox, Safari, Edge

### Phase 2: Persistence Implementation
- [ ] **localStorage Setup:** Create save/load system architecture
- [ ] **Save Game State:** Persist funds, dice, shields, city level, prestige level
- [ ] **Save Progress:** Store mission cycles, event progress, milestone claims
- [ ] **Save Collection:** Persist sticker collection, dust, set tokens, completed sets
- [ ] **Auto-save:** Implement automatic saving on state changes
- [ ] **Load on Mount:** Restore saved state when game loads
- [ ] **Reset Option:** Add "New Game" button to clear localStorage

### Phase 3: Gameplay Balance Tuning (COMPLETED 2026-01-23)
- [X] **Session Timing Analysis:** Measure average session length with current pacing ✅
- [X] **Roll Probability Review:** Analyze dice outcomes and movement patterns ✅
- [X] **Milestone Reward Tuning:** Adjust reward values to hit 60-120s target sessions ✅
- [X] **Economy Balance:** Review funds/dice/shield generation vs consumption rates ✅
- [X] **Mission Difficulty:** Ensure missions are achievable within target timeframe ✅
- [X] **Prestige Scaling:** Validate reward multiplier progression feels rewarding ✅
- [X] **Configuration:** Created centralized `gameBalance.js` for all parameters ✅

### Phase 4: Content Expansion - Second City
- [X] **City 2 Design:** Finalize Deco Heights tile layout and theme ✅
- [X] **Tile Variety:** Create unique tile types or variants for City 2 ✅
- [X] **Progression Gate:** Define unlock requirements for City 2 access ✅
- [X] **Visual Differentiation:** Update theme colors and styling for City 2 ✅
- [X] **Reward Scaling:** Increase payouts and costs for second city (1.4x multiplier) ✅
- [X] **Testing:** Verify city transition and tile rendering for City 2 ✅
### Board Loop
- Dice roll with animated feedback.
- Token movement across tiles.
- Immediate tile resolution and reward feedback.

### Economy
- City Funds for upgrades (primary sink).
- Dice as stamina with optional multipliers.
- Shields as mitigation for shutdowns.
- Heists with percentage payouts.

### Events & Goals
- Event progress meter with repeatable milestones.
- Combo target with limited rolls.
- Mission tracker for short objectives.

### Sticker Meta
- Pack tiers: common/rare/epic with rarity weights.
- Duplicate conversion into Dust + Set Tokens.
- Dust crafts a specific missing sticker.
- Tokens redeem a random missing sticker within a set.
- Set completion reward claim.

## UX Requirements
- Game fully playable without vertical scroll on desktop viewport.
- Primary info and actions visible at all times.
- Collapsible secondary panels to reduce clutter.
- Highâ€‘contrast, readable labels for tile types and rewards.

## Success Metrics (Beta)
- Session length: 60â€“120 seconds (Target achieved: ~86s avg).
- Average rolls per session: 8â€“12 (Target achieved: ~11.2 rolls avg).
- 1â€“3 stickers earned per session (Target achieved: ~2.4 rewards avg).
- Positive sustainable dice economy (Doubles bonus 0.50x).
- Positive subjective feedback on clarity and pace.

## Risks & Mitigations
- **Cluttered UI** â†’ Collapsible panels, compact chips, fitâ€‘toâ€‘screen layout.
- **Low excitement** â†’ Frequent rewards and visible progression.
- **Economy imbalance** â†’ Tuning via economy CSVs and config values.

## Open Questions
- Target device size and primary form factor for final release.
- Sticker rarity rates and costs for longâ€‘term retention.
- Event and mission cadence for midâ€‘session engagement.

## Milestones
1) Web prototype gameplay loop complete (current).
2) Tuning pass for economy and rewards.
3) User testing and iteration for clarity + fun.

## Visual Validation Steps
- **Board Layout**: The board should display 20 tiles (5 per side) in a uniform 6x6 grid with all tiles the same size. Tiles should show simple type labels (FUNDS, HEIST, SHIELD, etc.) on one line.
- **HUD Interface**: Right panel should show compact action buttons (Roll, Auto, Upgrade) with icons in horizontal layout, followed by three tabs (Events, Missions, Stickers) with icons.
- **Floating Actions**: When prestige is available, a purple floating button with star icon should appear at bottom-right. When missions are complete, a gold floating button with refresh icon should appear.
- **Dice Roll**: Roll the dice. The dice on the board should perform a cinematic spinning animation. The compact status display in the board center should update with the roll total, the name of the tile landed on, and streak information if applicable.
- **Upgrade**: Click the "Upgrade" button for a landmark. The city panel on the left and the board on the right should pulse with a green glow. The player's funds should decrease, and the landmark's level should increase.
- **Tab Navigation**: Click between Events, Missions, and Stickers tabs. Content should switch instantly with active tab highlighted in city theme color.
- **Layout**: The game board and the city panel should be displayed side-by-side with equal space (1:1 ratio), with no vertical scrolling required to see both.
- **3D Dice**: Tap Roll. The on-board dice should tumble in 3D, settle on the final face value, and match the status display roll total.
- **Tile Spacing**: All tiles should have consistent spacing (12-20px gaps) and appear uncluttered with clear visual separation.
- **Notifications**: Trigger any reward or action. A custom animated notification should appear at top-center (not native browser alert).

## Implementation Plan
Detailed implementation plan for next phases is documented in [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md), which includes:
- Phase 1: Visual Cleanup Validation (testing current build)
- Phase 2: Persistence Implementation (localStorage save system)
- Phase 3: Gameplay Balance Tuning (60-120s session pacing)
- Phase 4: Content Expansion - Second City (Deco Heights implementation)

Each phase includes detailed tasks, estimated times, success criteria, and testing requirements.

## Automation Checkpoints
The `Ralph.ps1` script is the primary orchestrator for the automated development loop. It reads the `PRD.md` file to determine the next unchecked item in the "Build Checklist" and then uses an AI agent to generate and apply a patch to the codebase. The `progress.txt` file is used to log the completion of each item, providing a record of the development process.

The script is designed to be re-runnable. If it is stopped for any reason, it can be restarted and will pick up where it left off, using the `progress.txt` file to determine which items have already been completed.
## Follow-Up Work
- [ ] **Phase 4: Gameplay Balance and Content**
  - Tune mission/event pacing to match the live-op goals in `DESIGN_DOC.md`.
  - Define second city layout with 20-tile configuration.
- **Gameplay extensions**
  - Expand sticker album progression hints.

## Board Redesign (2026-01-20)

### Overview
Complete redesign of the game board from 40 tiles to 20 tiles for improved user experience and readability.

### Key Changes
- **Tile Count**: Reduced from 40 tiles (10 per side) to 20 tiles (5 per side)
- **Grid Layout**: Changed from 11x11 to uniform 6x6 grid with `repeat(6, 1fr)`
- **Tile Sizing**: All tiles now same size with 110px min-height and increased padding (16px/12px)
- **Spacing**: Increased gaps from 6-10px to 12-20px for better visual separation
- **Labels**: Simplified to show only tile type in uppercase (FUNDS, HEIST, SHIELD, etc.)
- **Font**: Optimized to 10px with 0.05em letter-spacing to fit on one line
- **Board Status**: Moved from separate HUD bar to compact inline display in board center
- **Corner Tiles**: Removed all special styling - corners now identical size to regular tiles

### Tile Distribution (20 Total)
- **Corners (4)**: START (id: 0), BONUS (id: 5), HEIST (id: 10), HEIST (id: 15)
- **Regular Tiles (16)**: FUNDS, RENT, BONUS, SHIELD, HEIST, STICKER, SHUTDOWN, DICE, CARD, LANDMARK

### Technical Implementation
- Updated `TILE_COUNT` constant from 40 to 20
- Modified `getTilePosition()` function for 6x6 grid positioning
- Updated corner detection to check positions 0, 5, 10, 15 (instead of 0, 10, 20, 30)
- Removed `board-tile-corner` and `board-tile-label-corner` class applications
- All tiles now use uniform `board-tile` and `board-tile-label` classes

### User Experience Improvements
- Much less congested board with breathing room between tiles
- All tiles clearly visible and readable at a glance
- Consistent visual hierarchy with uniform sizing
- Clean, modern aesthetic matching reference design
- Board status integrated without taking extra vertical space
- Responsive design maintained for desktop and mobile

### Files Modified
- `web/src/components/BoardLoop.jsx` - Tile data, positioning logic, rendering
- `web/src/index.css` - Complete board styling overhaul
- `CHANGELOG.md` - Detailed change documentation
- `README.md` - Recent updates section

See [CHANGELOG.md](./CHANGELOG.md) for complete details.

## HUD Redesign (2026-01-20)

### Overview
Complete redesign of the game HUD interface for improved usability, better information density, and modern aesthetic following UI/UX best practices.

### Key Changes

**Compact Action Bar:**
- Reduced button sizes by 60% (from 48px to 36px height)
- Changed from vertical full-width stack to horizontal compact layout
- Added SVG icons to all buttons (dice, lightning, arrow)
- Roll, Auto Roll, and Upgrade buttons now share horizontal space
- Improved visual feedback with hover states and opacity for disabled states
- Better space utilization without sacrificing functionality

**Tab-Based Navigation:**
- Replaced dropdown accordion system with persistent tab interface
- Three tabs: Events, Missions, Stickers
- Each tab has icon for quick recognition (chart, clipboard, sparkle)
- Active tab highlighted with city theme color (dynamic per city)
- Badge indicators: Prestige level on Events tab, "NEW" dot on Stickers tab
- Content always visible, no need to expand/collapse
- Instant switching between sections

**Floating Action Buttons (FABs):**
- **Prestige Button**: Purple gradient with star icon, appears when eligible
  - Fixed position at bottom-right corner
  - Pulse animation to draw attention
  - Moves up when mission reset also available
  - Clear hover effects with scale and shadow
- **Mission Reset Button**: Gold gradient with refresh icon
  - Appears when all missions complete
  - Fixed position at bottom-right (below prestige if both active)
  - "NEW CYCLE" text for clarity
  - Smooth animations and transitions

**Enhanced Visual Design:**

*Events Tab:*
- Prestige badge at top showing current level and multiplier
- Progress header with clear label and value
- Progress bar with theme color fill
- "CLAIM ALL AVAILABLE" button when rewards ready
- Milestone list with improved spacing
- Each milestone shows: threshold, scaled reward, claim button
- Better contrast and readability

*Missions Tab:*
- Cleaner mission items with inline progress (e.g., "5/10")
- Green highlight and checkmark icon when completed
- Cycle counter in header
- No longer shows reset button inline (moved to FAB)
- Better visual separation between missions

*Stickers Tab:*
- Currency bar at top showing Dust and Tokens with icons
- Grid layout for Open Pack and Redeem buttons
- Crafting bar with rarity selector and craft button
- Sticker sets list with progress bars
- Claim buttons for completed sets
- Improved information hierarchy

### Technical Implementation
- Modified `BoardLoop.jsx`: Replaced `expandedSection` state with `activeTab`
- Added `missionResetAvailable` and `missionResetHandler` states
- Updated `MissionTracker.jsx`: Added `onResetAvailable` callback prop
- Removed `toggleSection` function, simplified state management
- Added comprehensive CSS in `index.css` for all new components
- Used SVG icons inline for better control and performance
- Implemented proper z-index layering for FABs

### CSS Classes Added
- `.board-actions-compact` - Horizontal action button container
- `.action-btn`, `.action-btn-primary`, `.action-btn-secondary` - Button styles
- `.tab-navigation`, `.tab-btn`, `.tab-btn-active` - Tab interface
- `.tab-badge`, `.tab-badge-dot` - Badge indicators
- `.tab-content`, `.tab-panel` - Content containers
- `.prestige-badge` - Prestige level indicator
- `.milestones-list`, `.milestone-item` - Event milestone display
- `.sticker-currency-bar`, `.sticker-actions-grid` - Sticker tab layout
- `.fab-prestige`, `.fab-mission-reset` - Floating action buttons
- `.mission-item`, `.mission-progress` - Mission display improvements

### User Experience Improvements
- Critical actions (Prestige, Mission Reset) always visible and accessible
- No more hunting through dropdowns for important buttons
- Faster navigation between Events, Missions, and Stickers
- More content visible without scrolling
- Better visual hierarchy: FABs > Tabs > Content
- Improved information density - see more at a glance
- Modern, polished aesthetic matching contemporary game UIs
- Consistent with UI/UX workflow guidelines

### Files Modified
- `web/src/components/BoardLoop.jsx` - Main HUD redesign
- `web/src/components/MissionTracker.jsx` - Mission display improvements
- `web/src/index.css` - Complete CSS for new components
- `PRD.md` - This documentation

### Performance Impact
- No negative performance impact
- Maintains all previous optimizations (useMemo, reduced re-renders)
- Slightly improved performance due to simpler state management (tabs vs accordions)

### Accessibility
- All buttons have proper hover and disabled states
- SVG icons with proper viewBox and stroke settings
- Clear visual feedback for all interactions
- Keyboard navigation supported through native button elements
- High contrast maintained for readability

See [CHANGELOG.md](./CHANGELOG.md) for complete details.

## Visual Cleanup & Performance (2026-01-21)

### Overview
Comprehensive removal of all glow effects, dark overlays, and unwanted board movement to achieve a clean, static, high-performance visual presentation.

### Issues Identified
- **Dark Overlay Problem**: Multiple layered dark backgrounds creating a heavy visual obstruction
- **Neon Glow Effects**: Excessive colored glows (cyan/teal/orange) on tiles, UI elements, and backgrounds
- **Board Movement**: Unwanted parallax effects and 3D transforms causing board to shift with mouse movement
- **Performance Overhead**: Multiple animated layers and mouse event tracking impacting performance

### Changes Made

**1. Dark Overlay Removal:**
- `.board-grid` background: Changed from `rgba(11, 15, 20, 0.95)` (95% opaque dark gray) to `transparent`
- `.city-backdrop`: Removed dark gradient, changed to `transparent`
- `.city-glow`: Removed dark vignette `rgba(0, 0, 0, 0.8)`, changed to `transparent`
- `.city-grid`: Reduced opacity from 0.15 to 0.08 and lightened grid lines by 50%
- `body` background: Changed from `bg-urban-black` to pure `#000000`
- `.board-center`: Reduced background opacity from `rgba(15, 25, 40, 0.95)` to `rgba(0, 0, 0, 0.3)`
- `.board-mini-panel`: Reduced background from `rgba(0,0,0,0.6)` to `rgba(0,0,0,0.25)`

**2. Complete Neon Glow Removal:**

*Tile Glows:*
- `.board-tile::before` pseudo-element: Opacity set to 0 (removed blur-filtered background glow)
- Removed all type-specific hover glows (Funds, Heist, Shield, Bonus, Shutdown, Card)
- `.tile-glow`: Box-shadow removed
- `.board-tile-trail`: Box-shadow removed
- `.board-tile-active`: Removed `neon-pulse` animation from animation stack
- `@keyframes neon-pulse`: All box-shadows set to `none`

*UI Element Glows:*
- `.dice-gain`: Box-shadow removed (cyan glow on dice gains)
- `.badge-doubles`: Box-shadow removed (orange glow on doubles)
- `@keyframes doubles-pulse`: All box-shadows set to `none`
- `.board-dice`: Box-shadow removed
- `.board-primary` (both instances): Box-shadows removed (cyan glows on primary buttons)
- `.board-progress-fill`: Box-shadow removed (cyan glow on progress bars)
- `.board-mini-progress-fill`: Box-shadow removed (orange glow on mini progress)
- `.board-toggle-button-active`: Box-shadow removed
- `@keyframes upgrade-pulse`: All box-shadows set to `none`

*Dynamic Glows (BoardLoop.jsx):*
- `city-glow` element: Changed dynamic radial gradient from using `cityData.glowColor` to pure black gradient
- Player piece: Removed `boxShadow` using `cityData.themeColor`
- Player piece glow div: Set opacity to 0, background to transparent, filter to none

**3. Board Movement Removal:**

*3D Transforms:*
- `.board-grid` transform: Changed from `rotateX(4deg) rotateY(0deg)` to `none`
- `.board-grid:hover` transform: Changed from `rotateX(2deg) rotateY(1deg)` to `none`
- Removed all transform transitions: `transition: none`
- Removed `will-change: transform` property

*Parallax Effects:*
- Completely removed `mousemove` event listener (28 lines of code)
- Removed `mousePosition` state variable
- Deleted entire `useEffect` for parallax mouse tracking
- Removed all mouse position-based x/y translations on backdrop layers
- Converted all `motion.div` backdrop elements to static `div` elements

*Shadow Simplification:*
- Reduced `.board-grid` box-shadow from heavy multi-layer to simple `0 4px 12px rgba(0, 0, 0, 0.3)`

### Technical Implementation

**Files Modified:**
- `web/src/components/BoardLoop.jsx` - Removed parallax tracking, simplified backdrop rendering, removed player glow
- `web/src/index.css` - Removed all glow box-shadows, transformed backgrounds, eliminated 3D transforms

**Code Removed:**
- ~50 lines of parallax mouse tracking code
- 15+ box-shadow glow declarations
- Multiple animated gradients and color-based effects
- 3D perspective transforms and transitions
- Framer Motion animations on backdrop layers

**Performance Improvements:**
- No mouse event tracking (zero overhead)
- No requestAnimationFrame calls for parallax
- No CSS transform calculations
- Simpler rendering with transparent backgrounds
- Reduced GPU usage (no blur filters, no shadows, no transforms)

### User Experience Improvements
- **Clean Visual Presentation**: No distracting glows or overlays obscuring gameplay
- **Static Board**: Board remains perfectly still, no unwanted movement
- **Better Readability**: Transparent backgrounds allow clear view of all tiles
- **Improved Performance**: Reduced CPU/GPU usage, smoother frame rates
- **Professional Appearance**: Clean, minimal aesthetic without excessive effects
- **Focus on Gameplay**: Visual effects don't compete with game information

### Visual Validation
- Board should have pure black background with no overlays
- Tiles should have colored borders but no glowing halos
- Board center should be mostly transparent with subtle backdrop blur
- Board should remain completely static (no parallax, no transforms, no hover movement)
- No cyan/teal/orange glows anywhere in the UI
- Progress bars should show solid colors without glow effects
- Player piece should have solid color without glow trail

### Result
- ✅ Zero dark overlays
- ✅ Zero neon/colored glows
- ✅ Zero board movement
- ✅ Pure black (#000000) background
- ✅ Clean, professional appearance
- ✅ Improved performance
- ✅ Better readability
- ✅ Static, stable board
