# Playtest Results & Automation

This directory contains playtest data, analysis reports, and findings from balance tuning sessions.

## 📁 Directory Structure

```
playtest-results/
├── README.md                          # This file
├── session-data-[timestamp].csv       # Exported CSV data from analytics
├── analysis-[timestamp].md            # Automated analysis reports
├── balance-analysis-[timestamp].md    # Manual markdown exports from game
└── findings.md                        # Your subjective observations
```

## 🎮 Workflow Overview

### 1. Play Sessions (Manual - 30-45 min)
```bash
cd web
npm run dev
# Open http://localhost:5173
# Play 10 sessions following PLAYTEST_GUIDE.md
# Click Reset after each session
# Click Analytics → Export CSV after all 10
```

### 2. Run Automated Analysis (5 seconds)
```bash
node scripts/analyze-playtest.js playtest-results/session-data-*.csv
```

This generates:
- Statistical breakdown of all metrics
- Identification of balance issues
- Concrete code change recommendations
- Priority-ordered fix list

### 3. Review & Apply Changes (5-10 min)
```bash
# Interactive mode (recommended for first time)
node scripts/apply-balance-changes.js --interactive

# Or use presets
node scripts/apply-balance-changes.js --preset=faster
node scripts/apply-balance-changes.js --preset=more_dice

# Or specify exact issues
node scripts/apply-balance-changes.js --duration=short --rolls=few
```

### 4. Test Changes (15-20 min)
```bash
cd web
npm run dev
# Play 5 new sessions
# Export new CSV
```

### 5. Re-analyze (5 seconds)
```bash
node scripts/analyze-playtest.js playtest-results/session-data-[new-timestamp].csv
```

### 6. Iterate Until Success
Repeat steps 3-5 until:
- ✅ 80%+ sessions in 60-120s duration range
- ✅ 80%+ sessions with 8-12 rolls
- ✅ 80%+ sessions with 1-3 stickers

## 📊 Analysis Script Features

The automated analysis script (`analyze-playtest.js`) provides:

### Statistical Analysis
- **Averages:** Mean, median, standard deviation for all metrics
- **Range Analysis:** Min/max values, outlier detection
- **Target Compliance:** Percentage of sessions hitting target ranges
- **Distribution:** Session counts for too short/long/few/many

### Issue Identification
- **Severity Ratings:** HIGH/MEDIUM based on deviation from targets
- **Priority Ordering:** Most critical issues first
- **Root Cause Analysis:** Identifies specific parameters causing issues

### Recommendations
- **Specific Values:** Exact numbers to change (not just "increase")
- **Multiple Solutions:** Different approaches for each issue
- **Reasoning:** Why each change will help
- **Code Locations:** Exact files and sections to modify

### Code Patches
- **Ready-to-Apply:** Shows before/after values
- **Context-Aware:** Understands current balance state
- **Safe Defaults:** Conservative changes (10-20% adjustments)

## 🔧 Apply Changes Script Features

The change application script (`apply-balance-changes.js`) provides:

### Interactive Mode
```bash
node scripts/apply-balance-changes.js --interactive
```
- Asks questions about your playtest results
- Generates recommendations based on answers
- Confirms before applying changes
- Creates automatic backups

### Preset Mode
```bash
node scripts/apply-balance-changes.js --preset=faster
```

Available presets:
- `faster` - Speed up sessions (for "too long" issue)
- `slower` - Slow down sessions (for "too short" issue)
- `more_dice` - Increase dice generation (for "too few rolls")
- `less_dice` - Decrease dice generation (for "too many rolls")
- `more_stickers` - Notes on increasing sticker rewards
- `less_stickers` - Notes on decreasing sticker rewards

### Custom Mode
```bash
node scripts/apply-balance-changes.js --duration=short --rolls=few
```
- Specify exact issues as CLI arguments
- Combines multiple fixes automatically
- Applies all changes in one operation

### Safety Features
- **Automatic Backups:** Creates `.backup` file before changes
- **Validation:** Checks if parameters exist before modifying
- **Dry-Run Preview:** Shows changes before applying
- **Rollback:** Easy to restore from backup if needed

## 📝 Example Session

```bash
# 1. Play 10 sessions (manual)
cd web && npm run dev
# ... play sessions, export CSV ...

# 2. Analyze
node scripts/analyze-playtest.js playtest-results/session-data-1737500000000.csv

# Output shows:
# Duration: 45s avg (target: 60-120s) - 20% in range ⚠️
# Rolls: 6.2 avg (target: 8-12) - 30% in range ⚠️
# Stickers: 1.8 avg (target: 1-3) - 90% in range ✅

# 3. Apply recommended fixes
node scripts/apply-balance-changes.js --duration=short --rolls=few

# Output:
# ✅ Updated PACING.POINTS_PER_ROLL → 8
# ✅ Updated ECONOMY.MILESTONE_THRESHOLDS → [15, 30, 60, 100, 150]
# ✅ Updated INITIAL_STATE.DICE → 60
# ✅ Updated ECONOMY.DICE_TILE_PAYOUT_BASE → 6

# 4. Test with 5 sessions
cd web && npm run dev
# ... play 5 sessions, export new CSV ...

# 5. Re-analyze
node scripts/analyze-playtest.js playtest-results/session-data-1737501000000.csv

# Output shows:
# Duration: 72s avg (target: 60-120s) - 80% in range ✅
# Rolls: 9.4 avg (target: 8-12) - 80% in range ✅
# Stickers: 2.1 avg (target: 1-3) - 100% in range ✅

# 6. Success! Commit changes
git add web/src/config/gameBalance.js
git commit -m "Balance: Tune duration and dice economy based on playtest data"
```

## 🎯 Success Criteria

Phase 3 is complete when:
- ✅ 80%+ sessions in 60-120s range
- ✅ 80%+ sessions with 8-12 rolls
- ✅ 80%+ sessions with 1-3 stickers
- ✅ Economy feels balanced (subjective)
- ✅ Positive player feedback
- ✅ No major bugs

## 📋 Tracking Your Progress

Create a `findings.md` file in this directory to track:

```markdown
# Playtest Findings

## Round 1 - [Date]
**Sessions:** 10
**Issues:** Duration too short (45s avg), rolls too few (6.2 avg)
**Changes Applied:** Increased milestone thresholds, boosted starting dice
**Result:** Duration improved to 72s, rolls improved to 9.4

## Round 2 - [Date]
**Sessions:** 5
**Issues:** Minor - some sessions still slightly short
**Changes Applied:** Small adjustment to POINTS_PER_ROLL (8 → 9)
**Result:** 85% sessions now in target range ✅

## Subjective Feedback
- Most fun: Landing on HEIST tiles
- Least fun: Waiting for funds to upgrade landmarks
- Confusing: Not clear when city is complete
- Suggestions: Add visual progress bar for milestones
```

## 🆘 Troubleshooting

### "Cannot find module" error
```bash
# Make sure you're in the project root
cd c:\city-slacker
node scripts/analyze-playtest.js playtest-results/session-data-*.csv
```

### Analysis shows weird results
- Need more sessions (10 minimum, 20 better)
- Check for outlier sessions (very short/long)
- Verify you're playing consistently

### Changes not working
- Clear browser cache and reload
- Check that gameBalance.js was actually modified
- Verify no syntax errors: `cd web && npm run dev`

### Want to undo changes
```bash
# Restore from backup
cp web/src/config/gameBalance.js.backup web/src/config/gameBalance.js
```

## 🚀 Advanced Usage

### Compare Before/After
```bash
# Save baseline
node scripts/analyze-playtest.js playtest-results/baseline.csv > baseline-report.txt

# Make changes and test
node scripts/apply-balance-changes.js --preset=faster

# Compare
node scripts/analyze-playtest.js playtest-results/after-changes.csv > after-report.txt
diff baseline-report.txt after-report.txt
```

### Batch Analysis
```bash
# Analyze all CSV files
for file in playtest-results/session-data-*.csv; do
  echo "Analyzing $file..."
  node scripts/analyze-playtest.js "$file"
done
```

### Custom Targets
Edit `scripts/analyze-playtest.js` to change target ranges:
```javascript
const TARGETS = {
  duration: { min: 60, max: 120, ideal: 90 },
  rolls: { min: 8, max: 12, ideal: 10 },
  stickers: { min: 1, max: 3, ideal: 2 }
};
```

---

**Ready to start?** Run your 10 playtest sessions, export the CSV, and let the automation handle the analysis! 🎮📊
