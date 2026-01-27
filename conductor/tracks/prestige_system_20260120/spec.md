# Event Prestige System Specification

## Feature Description
Add a prestige system that allows players who have completed all event milestones to reset their progress in exchange for a prestige level that permanently increases all future milestone rewards.

## User Stories

### Primary User Story
**As a player**, I want to prestige my event progress after completing all milestones so that I can earn better rewards on my next run and have a sense of long-term progression.

### Supporting User Stories
1. **As a player**, I want to see my prestige level displayed so I know how many times I've prestiged.
2. **As a player**, I want to see how much better the rewards will be before I prestige so I can make an informed decision.
3. **As a player**, I want a confirmation dialog before prestiging so I don't accidentally reset my progress.
4. **As a player**, I want to feel rewarded for prestiging with noticeably better milestone rewards.

## Functional Requirements

### FR1: Prestige State Management
- Add `eventPrestigeLevel` state (integer, starts at 0)
- Track total lifetime event points across all prestiges (optional stat)
- Prestige level persists in component state (no localStorage for now)

### FR2: Prestige Eligibility
- Player becomes eligible to prestige when:
  - All 5 milestones have been claimed
  - Event progress >= 120 points
- "Prestige" button appears in Event Progress section when eligible
- Button styled prominently with special color/animation

### FR3: Prestige Action
- Clicking "Prestige" button shows confirmation dialog
- Dialog displays:
  - Current prestige level
  - Next prestige level
  - Current reward multiplier
  - Next reward multiplier
  - Example of improved rewards
- Confirmation required to proceed

### FR4: Prestige Reset Logic
- When player confirms prestige:
  - Increment `eventPrestigeLevel` by 1
  - Reset `eventProgress` to 0
  - Reset all `milestoneRewardsClaimed` to false
  - Show celebration message/animation
  - Update milestone rewards with new multiplier

### FR5: Reward Scaling
- Base multiplier: 1.0 (no prestige)
- Prestige 1: 1.5x rewards
- Prestige 2: 2.0x rewards
- Prestige 3: 2.5x rewards
- Prestige 4+: 3.0x rewards (cap)
- Formula: `multiplier = 1.0 + (prestigeLevel * 0.5)` capped at 3.0x

### FR6: UI Display
- Show prestige level badge in Event Progress header
- Display current multiplier (e.g., "2.0x Rewards")
- Update milestone reward displays to show scaled amounts
- Add prestige level to board panel metrics (optional)

## Non-Functional Requirements

### NFR1: Balance
- Reward scaling should feel meaningful but not game-breaking
- Prestiging should feel like a milestone achievement
- Players should want to prestige multiple times

### NFR2: User Experience
- Prestige action should feel celebratory (particles, animations)
- Clear communication about what prestiging does
- No accidental prestiges (confirmation required)

### NFR3: Performance
- Prestige calculation should be instant
- No lag when updating milestone displays
- Efficient reward multiplier calculation

## Technical Design

### State Variables
```javascript
const [eventPrestigeLevel, setEventPrestigeLevel] = useState(0);
const [lifetimeEventPoints, setLifetimeEventPoints] = useState(0); // Optional
```

### Prestige Eligibility Check
```javascript
const allMilestonesClaimed = MILESTONES.every((m, idx) => 
  eventProgress >= m.threshold && milestoneRewardsClaimed[idx]
);
const canPrestige = allMilestonesClaimed && eventProgress >= 120;
```

### Reward Multiplier Calculation
```javascript
const getRewardMultiplier = (prestigeLevel) => {
  return Math.min(3.0, 1.0 + (prestigeLevel * 0.5));
};

const currentMultiplier = getRewardMultiplier(eventPrestigeLevel);
```

### Scaled Milestone Rewards
```javascript
const getScaledReward = (baseAmount, prestigeLevel) => {
  const multiplier = getRewardMultiplier(prestigeLevel);
  return Math.floor(baseAmount * multiplier);
};
```

### Prestige Function
```javascript
const handlePrestige = () => {
  if (!window.confirm(
    `Prestige to Level ${eventPrestigeLevel + 1}?\n\n` +
    `Current Multiplier: ${currentMultiplier.toFixed(1)}x\n` +
    `Next Multiplier: ${getRewardMultiplier(eventPrestigeLevel + 1).toFixed(1)}x\n\n` +
    `Your event progress will reset to 0, but all future milestone rewards will be increased!`
  )) {
    return;
  }
  
  setEventPrestigeLevel(prev => prev + 1);
  setEventProgress(0);
  setMilestoneRewardsClaimed(Array(MILESTONES.length).fill(false));
  
  setHudMessage(`PRESTIGE ${eventPrestigeLevel + 1} ACHIEVED!`);
  setTextPop({ 
    x: window.innerWidth / 2, 
    y: window.innerHeight / 2, 
    text: `PRESTIGE ${eventPrestigeLevel + 1}!`, 
    color: '#d946ef' 
  });
  setTimeout(() => {
    setHudMessage(null);
    setTextPop(null);
  }, 3000);
};
```

## UI Mockup (Text Description)

### Event Progress Header (No Prestige)
```
┌─────────────────────────────────┐
│ Event Progress        120 / 120 │
│ ████████████████████████ 100%   │
│ Next: All Complete!             │
│ [PRESTIGE] ← New button         │
└─────────────────────────────────┘
```

### Event Progress Header (Prestige 2)
```
┌─────────────────────────────────┐
│ Event Progress  ⭐ Prestige 2   │
│ 2.0x Rewards         45 / 120   │
│ ████████░░░░░░░░░░░░░ 37%       │
│ Next: 40 Dice (was 20)          │
└─────────────────────────────────┘
```

### Prestige Confirmation Dialog
```
╔═══════════════════════════════════╗
║  PRESTIGE TO LEVEL 3?             ║
╟───────────────────────────────────╢
║  Current: Prestige 2 (2.0x)       ║
║  Next:    Prestige 3 (2.5x)       ║
║                                   ║
║  Example Rewards:                 ║
║  • 10 pts: 20 → 50 Dice          ║
║  • 20 pts: $8k → $20k Funds      ║
║  • 120 pts: $15k → $37.5k Funds  ║
║                                   ║
║  Your event progress will reset   ║
║  to 0, but rewards will be 25%    ║
║  better!                          ║
╟───────────────────────────────────╢
║  [Cancel]  [PRESTIGE!]            ║
╚═══════════════════════════════════╝
```

## Edge Cases

### EC1: Prestige with Unclaimed Rewards
- Should not be able to prestige if any milestone is unclaimed
- "Claim All" button should be prominent before prestige option appears

### EC2: Prestige Level Cap
- Multiplier caps at 3.0x (Prestige 4+)
- Prestige level itself has no cap (can go to 5, 6, 7+ for bragging rights)
- Display "MAX" badge when at 3.0x multiplier

### EC3: Prestige During Autoroll
- Autoroll should not prevent prestiging
- Prestige action should pause/stop autoroll

### EC4: City Change After Prestige
- Prestige level should persist when changing cities
- Event progress is city-independent

## Milestone Reward Scaling Examples

### Base Rewards (Prestige 0 - 1.0x)
- 10 pts: 20 Dice
- 20 pts: $8,000 Funds
- 40 pts: 1 Sticker Pack
- 80 pts: 35 Dice
- 120 pts: $15,000 Funds

### Prestige 1 (1.5x)
- 10 pts: 30 Dice
- 20 pts: $12,000 Funds
- 40 pts: 1 Sticker Pack (doesn't scale)
- 80 pts: 52 Dice
- 120 pts: $22,500 Funds

### Prestige 2 (2.0x)
- 10 pts: 40 Dice
- 20 pts: $16,000 Funds
- 40 pts: 2 Sticker Packs
- 80 pts: 70 Dice
- 120 pts: $30,000 Funds

### Prestige 4+ (3.0x MAX)
- 10 pts: 60 Dice
- 20 pts: $24,000 Funds
- 40 pts: 3 Sticker Packs
- 80 pts: 105 Dice
- 120 pts: $45,000 Funds

## Testing Requirements

### Unit Tests
- Test prestige eligibility logic
- Test reward multiplier calculation
- Test prestige reset logic
- Test reward scaling for different prestige levels

### Integration Tests
- Test full prestige flow (complete milestones → prestige → earn new rewards)
- Test prestige with different prestige levels
- Test prestige confirmation dialog
- Test prestige celebration effects

### Manual Testing
- Verify prestige button appears at correct time
- Verify confirmation dialog is clear and accurate
- Verify rewards scale correctly
- Verify prestige feels rewarding and celebratory
- Test on different screen sizes

## Future Enhancements (Out of Scope)
- Prestige-exclusive rewards (special stickers, badges)
- Prestige leaderboard (if multiplayer added)
- Different prestige paths (speed vs. rewards)
- Prestige milestones (every 5 prestiges = bonus)
- Prestige skins/themes for the board
