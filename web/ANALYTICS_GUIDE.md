# Session Analytics Guide

## Overview
City Slacker includes a built-in session analytics system to track gameplay metrics for balance tuning. This guide explains how to collect data, analyze it, and use the insights for gameplay improvements.

## Quick Start

### 1. Enable Analytics Tracking
Analytics tracking is automatic when integrated into BoardLoop. Session data is collected passively during gameplay.

### 2. Play Test Sessions
- **Manual Play:** Play naturally, mix strategies, and complete sessions.
- **Automated Play:** Use the Playwright automated suite for consistent data collection:
  ```bash
  cd web
  npx playwright test tests/comprehensive-playtest.spec.js --project=chromium
  ```
  This simulates 10 sessions with varied strategies (normal, aggressive, conservative) and exports data to `playtest-results/automated-playtest-data.json`.

### 3. View Analytics
Access the analytics viewer to see:
- Target metric comparisons (duration, rolls, stickers)
- Average gameplay statistics
- Economy balance (funds/dice flow)
- Roll and tile distributions
- Recent session details

### 4. Export Data
- **CSV Export:** Raw data for Excel/spreadsheet analysis
- **Markdown Report:** Formatted analysis with recommendations

## Metrics Tracked

### Primary Targets
| Metric | Target | Purpose |
|--------|--------|---------|
| Session Duration | 60-120s | Optimal mobile session length |
| Rolls per Session | 8-12 | Maintains engagement without fatigue |
| Stickers per Session | 1-3 | Steady collection progression |

### Gameplay Metrics
- **Total Rolls:** Number of dice rolls in session
- **Doubles Count:** Frequency of rolling doubles
- **Milestones Reached:** Event progress milestones claimed
- **Missions Completed:** Short objectives finished
- **Upgrades Made:** Landmark level-ups performed
- **Heists/Shutdowns:** Frequency of special tiles

### Economy Metrics
- **Funds Earned:** Total funds collected from tiles/rewards
- **Funds Spent:** Total funds used for upgrades
- **Dice Spent:** Dice consumed for rolls (including High Roller)
- **Dice Gained:** Dice earned from tiles/rewards/bonuses

### Distribution Data
- **Tile Frequency:** How often each tile type is landed on
- **Roll Distribution:** Frequency of each dice roll (2-12)

## Integration with BoardLoop

### Automatic Tracking
The SessionMetrics class should be instantiated at session start and track events as they occur:

```javascript
import { SessionMetrics, saveSession } from './utils/sessionAnalytics';

// In BoardLoop component
const [currentSession] = useState(() => new SessionMetrics());

// On roll
currentSession.recordRoll(diceTotal, isDoubles);

// On tile landing
currentSession.recordTileLanding(tile.type);

// On funds change
currentSession.recordFundsChange(delta);

// On session end (city complete, manual reset, etc.)
currentSession.endSession(funds, dice, prestigeLevel, cityLevel);
saveSession(currentSession);
```

### Session Lifecycle
1. **Start:** SessionMetrics created with timestamp
2. **During:** Events recorded as they occur
3. **End:** Final state captured and session saved to localStorage
4. **Storage:** Up to 50 most recent sessions retained

## Analysis Workflow

### Phase 1: Initial Data Collection
1. Play 10 sessions without adjustments
2. Export markdown report
3. Review target metrics vs. actuals
4. Identify which metrics are out of range

### Phase 2: Hypothesis and Tuning
1. Review recommendations in report
2. Adjust gameBalance.js parameters
3. Test changes with 5 new sessions
4. Compare before/after metrics

### Phase 3: Iterative Refinement
1. Make small adjustments (10-20% changes)
2. Test 3-5 sessions after each change
3. Document which changes improved metrics
4. Continue until 80% of sessions in target range

### Phase 4: External Validation
1. Have 2-3 others play 5 sessions each
2. Export their analytics
3. Verify metrics hold across different players
4. Make final minor adjustments

## Reading the Analysis Report

### Summary Section
Shows overall session count and percentage within target range. 
- **Goal:** 80%+ sessions in 60-120s range

### Target Metrics Table
Each metric shows:
- ✅ Green checkmark: Within target range
- ⚠️ Warning icon: Outside target range

### Recommendations
Auto-generated suggestions based on deviations:
- **Sessions too short:** Increase costs, reduce rewards, add objectives
- **Sessions too long:** Decrease costs, increase rewards, streamline objectives
- **Too few rolls:** Increase starting dice, boost dice rewards
- **Too many rolls:** Reduce starting dice, limit dice generation

### Economy Balance
Indicates resource flow:
- **Positive funds flow:** Players accumulate funds (may need more sinks)
- **Negative funds flow:** Players spend more than earn (may need more sources)
- **Positive dice flow:** Dice accumulate (reduce generation or add uses)
- **Negative dice flow:** Dice deplete (increase generation or reduce costs)

## Common Tuning Scenarios

### Scenario 1: Sessions Too Short (< 60s avg)
**Symptoms:**
- Average duration: 30-50s
- Players maxing out too quickly
- Not enough meaningful decisions

**Fixes:**
```javascript
// gameBalance.js
STARTING_FUNDS: 3000, // Reduced from 5000
STARTING_DICE: 40,    // Reduced from 50
MILESTONE_THRESHOLDS: [15, 30, 60, 100, 150], // Increased
```

### Scenario 2: Sessions Too Long (> 120s avg)
**Symptoms:**
- Average duration: 150-180s
- Players losing interest mid-session
- Too much grinding

**Fixes:**
```javascript
// gameBalance.js
STARTING_FUNDS: 7000, // Increased from 5000
STARTING_DICE: 60,    // Increased from 50
MILESTONE_THRESHOLDS: [8, 15, 30, 60, 90], // Decreased
POINTS_PER_ROLL: 12,  // Increased from 10
```

### Scenario 3: Too Few Rolls (< 8 avg)
**Symptoms:**
- Average rolls: 4-6
- Players running out of dice
- Session ends prematurely

**Fixes:**
```javascript
// gameBalance.js
STARTING_DICE: 60,        // Increased from 50
DICE_TILE_PAYOUT_BASE: 6, // Increased from 4
START_TILE_PAYOUT_BASE: 2000, // Add dice reward here
```

### Scenario 4: Sticker Rewards Off
**Symptoms:**
- Average stickers: < 1 or > 3
- Collection feels too slow/fast

**Fixes:**
Adjust milestone/mission rewards in BoardLoop:
- Increase pack rewards if avg < 1
- Decrease pack rewards if avg > 3
- Adjust sticker drop rates in packs

## Advanced Analysis

### CSV Export Analysis
Import the CSV into Excel/Google Sheets for:
- **Scatter plots:** Duration vs. Rolls, Funds vs. Duration
- **Correlation analysis:** Which variables predict session length?
- **Outlier identification:** Which sessions were anomalies?
- **Trend analysis:** Are later sessions different from earlier ones?

### Roll Distribution Check
Expected probabilities for fair 2d6:
- 2 or 12: 2.78% (1/36)
- 3 or 11: 5.56% (2/36)
- 4 or 10: 8.33% (3/36)
- 5 or 9: 11.11% (4/36)
- 6 or 8: 13.89% (5/36)
- 7: 16.67% (6/36)

Large deviations indicate:
- Sample size too small (need more sessions)
- Dice implementation bug
- Player selectively recording sessions

### Tile Frequency Analysis
With 20 tiles and 5 per side:
- Each tile should be hit roughly equally over many sessions
- High variance tiles (HEIST, BONUS) may cluster
- START tile hit once per city completion
- Outliers indicate board balance issues

## Tips for Accurate Data

### Do's
✅ Play complete sessions (don't quit mid-game)
✅ Play at different times of day
✅ Try different strategies
✅ Let others playtest
✅ Track 10+ sessions before tuning

### Don'ts
❌ Cherry-pick "good" sessions to record
❌ Restart sessions that feel "bad"
❌ Over-optimize your play
❌ Make multiple changes simultaneously
❌ Tune based on 1-2 sessions

## Troubleshooting

### "No session data available"
- Analytics viewer shows this when 0 sessions recorded
- Play at least one session to generate data
- Check that saveSession() is being called

### "Data seems wrong"
- Check console for errors during session recording
- Verify localStorage isn't full (unlikely but possible)
- Clear analytics and start fresh if corrupted

### "Export buttons don't work"
- Check browser allows file downloads
- Try a different browser
- Check browser console for errors

### "Too much variance in metrics"
- Need more sessions (aim for 20+)
- Eliminate outlier sessions manually in CSV
- Consider different player skill levels

## Storage and Privacy

- **Storage:** localStorage, client-side only
- **Persistence:** Up to 50 most recent sessions
- **Size:** ~2KB per session (~100KB total max)
- **Privacy:** Never leaves user's device
- **Clearing:** Use "Clear Data" button or browser localStorage tools

## Future Enhancements

Planned features:
- [ ] Auto-session detection (start/end)
- [ ] Real-time metric display during gameplay
- [ ] Comparison mode (before/after tuning)
- [ ] Session replay visualization
- [ ] Cloud backup for cross-device analysis
- [ ] A/B testing framework
- [ ] Player cohort analysis

---

**Last Updated:** January 21, 2026
**Version:** 1.0.0
