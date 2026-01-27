# Playtest Guide - Session Analytics Collection

## Goal
Play 10 complete gameplay sessions to collect analytics data for balance tuning.

## Before You Start

### 1. Start the Dev Server
```bash
cd web
npm run dev
```

### 2. Open the Game
Navigate to `http://localhost:5173` in your browser

### 3. Clear Previous Analytics (Optional)
If you want to start fresh:
1. Click the **Analytics** button (purple, chart icon)
2. Click **Clear Data**
3. Close the analytics viewer

## How to Play a Session

### Session Start
A session automatically starts when you load the game. The SessionMetrics tracker is running in the background recording all your actions.

### Gameplay Loop
1. **Roll Dice** - Click the "Roll" button or enable "Auto Roll"
2. **Move Around Board** - Watch your piece move and land on tiles
3. **Collect Resources** - Funds, dice, shields are added automatically
4. **Upgrade Landmarks** - Click "Upgrade" when on a landmark tile
5. **Claim Milestones** - Click "CLAIM ALL AVAILABLE" in the Events tab
6. **Complete Missions** - Track progress in the Missions tab
7. **Open Sticker Packs** - Visit the Stickers tab to open packs

### Session End
A session ends when you:
- Click **Reset** button (starts a new session automatically)
- Complete all landmarks and advance to City 2
- Manually refresh the page (session is saved)

## Automated Playtesting (Recommended for Balancing)
If you want to quickly generate data for balance tuning without manual play:
1. Open a terminal in `web/`
2. Run the automated suite:
   ```bash
   npx playwright test tests/comprehensive-playtest.spec.js --project=chromium
   ```
3. This will perform 10 sessions with varied strategies:
   - **Normal:** Moderate pace, mixed manual/auto.
   - **Aggressive:** Uses continuous Autoroll and immediate upgrades.
   - **Conservative:** Slower manual rolls and saved funds.
4. Results are saved to `playtest-results/automated-playtest-data.json`.

## Playtest Instructions

### Session 1-3: Natural Play
**Goal:** Play naturally without trying to optimize

1. Start a new game
2. Roll dice and move around
3. Upgrade landmarks when you can afford them
4. Claim milestones as they become available
5. Complete missions naturally
6. Play until you run out of dice or complete the city
7. Click **Reset** to end the session

**Time:** Aim for natural completion (don't rush or stall)

### Session 4-6: Aggressive Strategy
**Goal:** Try to complete everything as fast as possible

1. Start a new game
2. Enable **Auto Roll** for continuous rolling
3. Upgrade landmarks immediately when affordable
4. Claim all milestones as soon as possible
5. Focus on completing missions quickly
6. Use prestige system if available
7. Click **Reset** when done

**Time:** Try to finish in under 60 seconds

### Session 7-9: Conservative Strategy
**Goal:** Play slowly and methodically

1. Start a new game
2. Roll manually (no auto-roll)
3. Save up funds before upgrading
4. Wait to claim milestones until multiple are available
5. Take time between rolls
6. Explore all tabs and features
7. Click **Reset** when done

**Time:** Aim for 2-3 minutes per session

### Session 10: Mixed Strategy
**Goal:** Play however feels most fun

1. Start a new game
2. Mix manual and auto-rolling
3. Experiment with prestige system
4. Try mission reset cycles
5. Open sticker packs
6. Play until it feels complete
7. Click **Reset** when done

## Viewing Analytics

### After Each Session
1. Click the **Analytics** button (purple, chart icon)
2. Check the **Summary** tab to see averages
3. Look at **Recent Sessions** tab to see your last session
4. Note any interesting patterns

### After All 10 Sessions
1. Click **Analytics** button
2. Review the **Summary** tab:
   - Check if average duration is 60-120s (target)
   - Check if average rolls is 8-12 (target)
   - Check if average stickers is 1-3 (target)
3. Click **Export Report** to download markdown analysis
4. Click **Export CSV** to download raw data

## What to Look For

### Good Signs ✅
- Sessions feel satisfying and complete
- You're making meaningful decisions
- Progression feels rewarding
- You want to play another session

### Red Flags ⚠️
- Sessions feel too short or too long
- Running out of resources prematurely
- Upgrades feel too expensive or too cheap
- Waiting around with nothing to do
- Feeling overwhelmed with too many actions

## Troubleshooting

### "Analytics button not showing"
- Refresh the page
- Make sure you're running the latest code
- Check browser console for errors

### "Session data not saving"
- Check if localStorage is enabled
- Try a different browser
- Check browser console for errors

### "Game feels broken"
- This is valuable feedback!
- Note what happened
- Check the Recent Sessions tab to see metrics
- Include this in your feedback

## After Playtesting

### 1. Export Data
- Click **Export Report** (markdown file)
- Click **Export CSV** (spreadsheet file)
- Save both files to `c:\city-slacker\playtest-results\`

### 2. Review Report
Open the markdown report and look for:
- Are metrics in target range?
- What does the report recommend?
- Which sessions felt best?
- Which sessions felt worst?

### 3. Provide Feedback
Create a file `c:\city-slacker\playtest-results\feedback.md` with:
- Overall impression (fun? boring? confusing?)
- What felt too fast or too slow?
- What was most/least enjoyable?
- Any bugs or issues encountered?
- Suggestions for improvement

## Tips for Quality Data

### Do ✅
- Play all 10 sessions in one sitting if possible
- Try different strategies across sessions
- Play naturally (don't try to "game" the metrics)
- Note any confusing or frustrating moments
- Complete full sessions (don't quit mid-game)

### Don't ❌
- Cherry-pick only "good" sessions
- Restart sessions that feel "bad"
- Try to hit exact target numbers
- Skip features you don't understand
- Multitask while playing (focus on the game)

## Expected Time Commitment

- **Per Session:** 1-3 minutes
- **Total Playtime:** 15-30 minutes
- **Review & Export:** 5 minutes
- **Feedback Writing:** 10 minutes
- **Total:** 30-45 minutes

## Questions?

If you encounter any issues or have questions:
1. Check browser console for errors
2. Try refreshing the page
3. Clear localStorage and start fresh
4. Document the issue for later review

---

**Ready to start?** Load the game, play naturally, and let the analytics system do its work!

Good luck! 🎲🎮
