# Autoroll Feature Specification

## Feature Description
Add an autoroll toggle button that enables continuous automatic dice rolling, allowing players to progress through the game without manually clicking the "Roll Dice" button for each roll.

## User Stories

### Primary User Story
**As a player**, I want to enable autoroll so that I can quickly use multiple dice without clicking the roll button repeatedly.

### Supporting User Stories
1. **As a player**, I want clear visual feedback when autoroll is active so I know the feature is working.
2. **As a player**, I want to be able to stop autoroll at any time so I can regain manual control.
3. **As a player**, I want autoroll to stop automatically when I run out of dice so the game doesn't get stuck.
4. **As a player**, I want to see all animations and effects during autoroll so the game still feels satisfying.

## Functional Requirements

### FR1: Autoroll Toggle Button
- Add a toggle button in the board actions area (near the "Roll Dice" button)
- Button should clearly indicate autoroll state (ON/OFF)
- Button should be styled consistently with the city theme color
- Button should be disabled when dice count is 0

### FR2: Autoroll Behavior
- When enabled, automatically trigger dice rolls after each roll completes
- Wait for all animations to complete before triggering next roll:
  - Dice tumble animation (~800ms)
  - Player piece movement animation (150-250ms per tile)
  - Tile landing effects and resolution
- Add a small delay (500ms) between rolls for better UX
- Respect all game state checks (isMoving, rolling, dice > 0)

### FR3: Autoroll Termination
- Automatically stop when dice count reaches 0
- Allow manual stop by clicking the toggle button again
- Stop if player navigates away or game state becomes invalid
- Show brief notification when autoroll stops due to no dice

### FR4: Visual Feedback
- Toggle button shows clear ON/OFF state with color and text
- Active autoroll indicated by theme color background
- Inactive autoroll shown with secondary/outline styling
- Optional: Add a subtle pulsing animation when autoroll is active

### FR5: State Management
- Add `autoRollEnabled` state to track toggle status
- Add `autoRollInProgress` state to track if autoroll is currently executing
- Ensure autoroll stops when component unmounts or city changes

## Non-Functional Requirements

### NFR1: Performance
- Autoroll should not cause UI lag or frame drops
- All animations should remain smooth during autoroll
- Memory usage should remain stable during extended autoroll sessions

### NFR2: User Experience
- Delay between rolls should feel natural (not too fast, not too slow)
- All game feedback (particles, text pops, HUD messages) should still appear
- Players should feel in control and able to stop at any time

### NFR3: Accessibility
- Button should have clear label text
- Button state should be distinguishable by color and text (not color alone)
- Keyboard users should be able to toggle autoroll (if keyboard support exists)

## Technical Design

### State Variables (in BoardLoop.jsx)
```javascript
const [autoRollEnabled, setAutoRollEnabled] = useState(false);
const [autoRollInProgress, setAutoRollInProgress] = useState(false);
```

### Autoroll Logic Flow
1. User clicks "Auto Roll" button → `setAutoRollEnabled(true)`
2. `useEffect` watches `autoRollEnabled` and game state
3. When enabled and conditions met, trigger `handleRollDice()`
4. After roll completes, check if autoroll still enabled and dice > 0
5. If yes, wait 500ms and trigger next roll
6. If no, set `autoRollEnabled(false)` and show notification

### Button Placement
- Position in `.board-actions` div, below the "Roll Dice" button
- Use same width as primary button for visual consistency
- Style with theme color when active, outline style when inactive

## UI Mockup (Text Description)

### Inactive State
```
┌─────────────────────────────────┐
│  Roll Dice                      │ ← Primary button (theme color)
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  ⚡ Auto Roll: OFF               │ ← Secondary button (outline)
└─────────────────────────────────┘
```

### Active State
```
┌─────────────────────────────────┐
│  Roll Dice (disabled)           │ ← Disabled while autoroll active
└─────────────────────────────────┘
┌─────────────────────────────────┐
│  ⏸ Auto Roll: ON                │ ← Primary button (theme color, pulsing)
└─────────────────────────────────┘
```

## Edge Cases

### EC1: Rapid Toggle
- If user rapidly clicks toggle, ensure only one autoroll loop runs
- Use `autoRollInProgress` flag to prevent multiple concurrent loops

### EC2: Doubles Bonus
- Autoroll should continue even when doubles give bonus dice
- Ensure dice count check happens after doubles bonus is applied

### EC3: City Completion
- If all landmarks upgraded during autoroll, stop autoroll
- Show city completion alert, then allow user to manually continue

### EC4: Milestone/Mission Completion
- Autoroll should continue through milestone/mission alerts
- Consider auto-claiming milestones during autoroll (optional enhancement)

## Testing Requirements

### Unit Tests
- Test autoroll enables/disables correctly
- Test autoroll stops when dice = 0
- Test autoroll respects isMoving and rolling states
- Test manual stop works correctly

### Integration Tests
- Test full autoroll sequence (enable → multiple rolls → auto stop)
- Test autoroll with doubles bonus
- Test autoroll with city completion
- Test autoroll state persists correctly between rolls

### Manual Testing
- Verify smooth animations during autoroll
- Verify all visual effects still appear
- Verify button states are clear and intuitive
- Test on different screen sizes (desktop, mobile)

## Future Enhancements (Out of Scope)
- Autoroll speed control (slow/medium/fast)
- Auto-claim milestones during autoroll
- Stop autoroll after N rolls (configurable limit)
- Autoroll statistics (rolls per session, etc.)
