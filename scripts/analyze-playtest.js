#!/usr/bin/env node

/**
 * Post-Playtest Analysis Automation
 * 
 * This script analyzes exported CSV data and generates:
 * 1. Statistical analysis of metrics
 * 2. Specific balance issues identified
 * 3. Concrete tuning recommendations with code changes
 * 4. Priority order for fixes
 * 
 * Usage:
 *   node scripts/analyze-playtest.js <path-to-csv>
 *   node scripts/analyze-playtest.js playtest-results/session-data-*.csv
 */

const fs = require('fs');
const path = require('path');

// Target ranges
const TARGETS = {
  duration: { min: 60, max: 120, ideal: 90 },
  rolls: { min: 8, max: 12, ideal: 10 },
  stickers: { min: 1, max: 3, ideal: 2 }
};

// Parse CSV file
function parseCSV(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  
  const sessions = lines.slice(1).map(line => {
    const values = line.split(',');
    const session = {};
    headers.forEach((header, i) => {
      const value = values[i];
      // Try to parse as number if possible
      session[header] = isNaN(value) ? value : parseFloat(value);
    });
    return session;
  });
  
  return sessions;
}

// Calculate statistics
function calculateStats(sessions) {
  const durations = sessions.map(s => s['Duration (s)']);
  const rolls = sessions.map(s => s['Rolls']);
  const stickers = sessions.map(s => s['Stickers']);
  const fundsEarned = sessions.map(s => s['Funds Earned']);
  const fundsSpent = sessions.map(s => s['Funds Spent']);
  const diceGained = sessions.map(s => s['Dice Gained']);
  const diceSpent = sessions.map(s => s['Dice Spent']);
  
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  const median = (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  };
  const stdDev = (arr) => {
    const mean = avg(arr);
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  };
  const percentInRange = (arr, min, max) => {
    const inRange = arr.filter(v => v >= min && v <= max).length;
    return (inRange / arr.length * 100).toFixed(1);
  };
  
  return {
    totalSessions: sessions.length,
    duration: {
      avg: avg(durations).toFixed(1),
      median: median(durations).toFixed(1),
      stdDev: stdDev(durations).toFixed(1),
      min: Math.min(...durations),
      max: Math.max(...durations),
      percentInRange: percentInRange(durations, TARGETS.duration.min, TARGETS.duration.max),
      tooShort: durations.filter(d => d < TARGETS.duration.min).length,
      tooLong: durations.filter(d => d > TARGETS.duration.max).length
    },
    rolls: {
      avg: avg(rolls).toFixed(1),
      median: median(rolls).toFixed(1),
      stdDev: stdDev(rolls).toFixed(1),
      min: Math.min(...rolls),
      max: Math.max(...rolls),
      percentInRange: percentInRange(rolls, TARGETS.rolls.min, TARGETS.rolls.max),
      tooFew: rolls.filter(r => r < TARGETS.rolls.min).length,
      tooMany: rolls.filter(r => r > TARGETS.rolls.max).length
    },
    stickers: {
      avg: avg(stickers).toFixed(1),
      median: median(stickers).toFixed(1),
      stdDev: stdDev(stickers).toFixed(1),
      min: Math.min(...stickers),
      max: Math.max(...stickers),
      percentInRange: percentInRange(stickers, TARGETS.stickers.min, TARGETS.stickers.max),
      tooFew: stickers.filter(s => s < TARGETS.stickers.min).length,
      tooMany: stickers.filter(s => s > TARGETS.stickers.max).length
    },
    economy: {
      avgFundsEarned: avg(fundsEarned).toFixed(0),
      avgFundsSpent: avg(fundsSpent).toFixed(0),
      avgFundsNet: (avg(fundsEarned) - avg(fundsSpent)).toFixed(0),
      avgDiceGained: avg(diceGained).toFixed(1),
      avgDiceSpent: avg(diceSpent).toFixed(1),
      avgDiceNet: (avg(diceGained) - avg(diceSpent)).toFixed(1)
    }
  };
}

// Identify balance issues
function identifyIssues(stats) {
  const issues = [];
  
  // Duration issues
  if (stats.duration.avg < TARGETS.duration.min) {
    const severity = TARGETS.duration.min - stats.duration.avg;
    issues.push({
      category: 'duration',
      type: 'too_short',
      severity: severity > 20 ? 'HIGH' : 'MEDIUM',
      description: `Sessions averaging ${stats.duration.avg}s (target: ${TARGETS.duration.min}-${TARGETS.duration.max}s)`,
      metric: `${stats.duration.tooShort}/${stats.totalSessions} sessions too short`,
      priority: 1
    });
  } else if (stats.duration.avg > TARGETS.duration.max) {
    const severity = stats.duration.avg - TARGETS.duration.max;
    issues.push({
      category: 'duration',
      type: 'too_long',
      severity: severity > 30 ? 'HIGH' : 'MEDIUM',
      description: `Sessions averaging ${stats.duration.avg}s (target: ${TARGETS.duration.min}-${TARGETS.duration.max}s)`,
      metric: `${stats.duration.tooLong}/${stats.totalSessions} sessions too long`,
      priority: 1
    });
  }
  
  // Roll count issues
  if (stats.rolls.avg < TARGETS.rolls.min) {
    const severity = TARGETS.rolls.min - stats.rolls.avg;
    issues.push({
      category: 'rolls',
      type: 'too_few',
      severity: severity > 2 ? 'HIGH' : 'MEDIUM',
      description: `Averaging ${stats.rolls.avg} rolls per session (target: ${TARGETS.rolls.min}-${TARGETS.rolls.max})`,
      metric: `${stats.rolls.tooFew}/${stats.totalSessions} sessions with too few rolls`,
      priority: 2
    });
  } else if (stats.rolls.avg > TARGETS.rolls.max) {
    const severity = stats.rolls.avg - TARGETS.rolls.max;
    issues.push({
      category: 'rolls',
      type: 'too_many',
      severity: severity > 3 ? 'HIGH' : 'MEDIUM',
      description: `Averaging ${stats.rolls.avg} rolls per session (target: ${TARGETS.rolls.min}-${TARGETS.rolls.max})`,
      metric: `${stats.rolls.tooMany}/${stats.totalSessions} sessions with too many rolls`,
      priority: 2
    });
  }
  
  // Sticker issues
  if (stats.stickers.avg < TARGETS.stickers.min) {
    issues.push({
      category: 'stickers',
      type: 'too_few',
      severity: 'MEDIUM',
      description: `Averaging ${stats.stickers.avg} stickers per session (target: ${TARGETS.stickers.min}-${TARGETS.stickers.max})`,
      metric: `${stats.stickers.tooFew}/${stats.totalSessions} sessions with too few stickers`,
      priority: 3
    });
  } else if (stats.stickers.avg > TARGETS.stickers.max) {
    issues.push({
      category: 'stickers',
      type: 'too_many',
      severity: 'MEDIUM',
      description: `Averaging ${stats.stickers.avg} stickers per session (target: ${TARGETS.stickers.min}-${TARGETS.stickers.max})`,
      metric: `${stats.stickers.tooMany}/${stats.totalSessions} sessions with too many stickers`,
      priority: 3
    });
  }
  
  // Economy issues
  const fundsNet = parseFloat(stats.economy.avgFundsNet);
  const diceNet = parseFloat(stats.economy.avgDiceNet);
  
  if (Math.abs(fundsNet) > 5000) {
    issues.push({
      category: 'economy',
      type: fundsNet > 0 ? 'funds_accumulating' : 'funds_depleting',
      severity: Math.abs(fundsNet) > 10000 ? 'HIGH' : 'MEDIUM',
      description: `Funds flow: ${fundsNet > 0 ? '+' : ''}${fundsNet} per session`,
      metric: `Earning $${stats.economy.avgFundsEarned}, spending $${stats.economy.avgFundsSpent}`,
      priority: 4
    });
  }
  
  if (Math.abs(diceNet) > 10) {
    issues.push({
      category: 'economy',
      type: diceNet > 0 ? 'dice_accumulating' : 'dice_depleting',
      severity: Math.abs(diceNet) > 20 ? 'HIGH' : 'MEDIUM',
      description: `Dice flow: ${diceNet > 0 ? '+' : ''}${diceNet} per session`,
      metric: `Gaining ${stats.economy.avgDiceGained}, spending ${stats.economy.avgDiceSpent}`,
      priority: 4
    });
  }
  
  return issues.sort((a, b) => a.priority - b.priority);
}

// Generate tuning recommendations
function generateRecommendations(issues, stats) {
  const recommendations = [];
  
  issues.forEach(issue => {
    let rec = {
      issue: issue.description,
      severity: issue.severity,
      changes: []
    };
    
    switch (issue.type) {
      case 'too_short':
        const durationDeficit = TARGETS.duration.ideal - parseFloat(stats.duration.avg);
        const durationAdjustPercent = (durationDeficit / TARGETS.duration.ideal * 100).toFixed(0);
        
        rec.changes = [
          {
            file: 'web/src/config/gameBalance.js',
            section: 'PACING',
            parameter: 'POINTS_PER_ROLL',
            currentValue: 10,
            suggestedValue: Math.max(6, Math.floor(10 * (1 - durationAdjustPercent / 100))),
            reasoning: 'Reduce points per roll to slow milestone progression'
          },
          {
            file: 'web/src/config/gameBalance.js',
            section: 'ECONOMY',
            parameter: 'MILESTONE_THRESHOLDS',
            currentValue: '[10, 20, 40, 80, 120]',
            suggestedValue: '[15, 30, 60, 100, 150]',
            reasoning: 'Increase thresholds by ~50% to extend session length'
          },
          {
            file: 'web/src/config/gameBalance.js',
            section: 'INITIAL_STATE',
            parameter: 'FUNDS',
            currentValue: 5000,
            suggestedValue: Math.max(3000, Math.floor(5000 * (1 - durationAdjustPercent / 200))),
            reasoning: 'Reduce starting funds to slow early progression'
          }
        ];
        break;
        
      case 'too_long':
        const durationSurplus = parseFloat(stats.duration.avg) - TARGETS.duration.ideal;
        const durationBoostPercent = (durationSurplus / TARGETS.duration.ideal * 100).toFixed(0);
        
        rec.changes = [
          {
            file: 'web/src/config/gameBalance.js',
            section: 'PACING',
            parameter: 'POINTS_PER_ROLL',
            currentValue: 10,
            suggestedValue: Math.min(15, Math.ceil(10 * (1 + durationBoostPercent / 100))),
            reasoning: 'Increase points per roll to speed up milestone progression'
          },
          {
            file: 'web/src/config/gameBalance.js',
            section: 'ECONOMY',
            parameter: 'MILESTONE_THRESHOLDS',
            currentValue: '[10, 20, 40, 80, 120]',
            suggestedValue: '[8, 15, 30, 60, 90]',
            reasoning: 'Decrease thresholds by ~25% to shorten session length'
          },
          {
            file: 'web/src/config/gameBalance.js',
            section: 'INITIAL_STATE',
            parameter: 'FUNDS',
            currentValue: 5000,
            suggestedValue: Math.min(7000, Math.ceil(5000 * (1 + durationBoostPercent / 200))),
            reasoning: 'Increase starting funds to accelerate early progression'
          }
        ];
        break;
        
      case 'too_few':
        const rollDeficit = TARGETS.rolls.ideal - parseFloat(stats.rolls.avg);
        const rollAdjustPercent = (rollDeficit / TARGETS.rolls.ideal * 100).toFixed(0);
        
        rec.changes = [
          {
            file: 'web/src/config/gameBalance.js',
            section: 'INITIAL_STATE',
            parameter: 'DICE',
            currentValue: 50,
            suggestedValue: Math.min(70, Math.ceil(50 * (1 + rollAdjustPercent / 50))),
            reasoning: 'Increase starting dice to enable more rolls'
          },
          {
            file: 'web/src/config/gameBalance.js',
            section: 'ECONOMY',
            parameter: 'DICE_TILE_PAYOUT_BASE',
            currentValue: 4,
            suggestedValue: Math.min(8, Math.ceil(4 * (1 + rollAdjustPercent / 100))),
            reasoning: 'Increase dice rewards from tiles'
          }
        ];
        break;
        
      case 'too_many':
        const rollSurplus = parseFloat(stats.rolls.avg) - TARGETS.rolls.ideal;
        const rollReducePercent = (rollSurplus / TARGETS.rolls.ideal * 100).toFixed(0);
        
        rec.changes = [
          {
            file: 'web/src/config/gameBalance.js',
            section: 'INITIAL_STATE',
            parameter: 'DICE',
            currentValue: 50,
            suggestedValue: Math.max(30, Math.floor(50 * (1 - rollReducePercent / 50))),
            reasoning: 'Reduce starting dice to limit rolls'
          },
          {
            file: 'web/src/config/gameBalance.js',
            section: 'ECONOMY',
            parameter: 'DICE_TILE_PAYOUT_BASE',
            currentValue: 4,
            suggestedValue: Math.max(2, Math.floor(4 * (1 - rollReducePercent / 100))),
            reasoning: 'Decrease dice rewards from tiles'
          }
        ];
        break;
        
      case 'funds_accumulating':
        rec.changes = [
          {
            file: 'web/src/components/BoardLoop.jsx',
            section: 'CITIES[0].tiles (Landmark)',
            parameter: 'upgradeCost',
            currentValue: '[1000, 2000, 4000, 8000, 16000]',
            suggestedValue: '[1500, 3000, 6000, 12000, 24000]',
            reasoning: 'Increase upgrade costs by 50% to create more funds sinks'
          }
        ];
        break;
        
      case 'funds_depleting':
        rec.changes = [
          {
            file: 'web/src/components/BoardLoop.jsx',
            section: 'CITIES[0].tiles (Funds)',
            parameter: 'payout',
            currentValue: '1200',
            suggestedValue: '1500',
            reasoning: 'Increase funds tile payouts by 25%'
          }
        ];
        break;
        
      case 'dice_accumulating':
        rec.changes = [
          {
            file: 'web/src/config/gameBalance.js',
            section: 'ECONOMY',
            parameter: 'DICE_TILE_PAYOUT_BASE',
            currentValue: 4,
            suggestedValue: 3,
            reasoning: 'Reduce dice generation to prevent accumulation'
          }
        ];
        break;
        
      case 'dice_depleting':
        rec.changes = [
          {
            file: 'web/src/config/gameBalance.js',
            section: 'ECONOMY',
            parameter: 'DICE_TILE_PAYOUT_BASE',
            currentValue: 4,
            suggestedValue: 6,
            reasoning: 'Increase dice generation to prevent depletion'
          }
        ];
        break;
    }
    
    recommendations.push(rec);
  });
  
  return recommendations;
}

// Generate code patches
function generateCodePatches(recommendations) {
  const patches = {};
  
  recommendations.forEach(rec => {
    rec.changes.forEach(change => {
      if (!patches[change.file]) {
        patches[change.file] = [];
      }
      patches[change.file].push({
        section: change.section,
        parameter: change.parameter,
        from: change.currentValue,
        to: change.suggestedValue,
        reasoning: change.reasoning
      });
    });
  });
  
  return patches;
}

// Generate output report
function generateReport(stats, issues, recommendations, patches) {
  const timestamp = new Date().toLocaleString();
  
  let report = `# Automated Playtest Analysis Report
Generated: ${timestamp}

## 📊 Statistical Summary

### Session Overview
- **Total Sessions:** ${stats.totalSessions}
- **Duration:** ${stats.duration.avg}s avg (median: ${stats.duration.median}s, σ: ${stats.duration.stdDev}s)
  - Range: ${stats.duration.min}s - ${stats.duration.max}s
  - In target (60-120s): ${stats.duration.percentInRange}%
  - Too short (<60s): ${stats.duration.tooShort}
  - Too long (>120s): ${stats.duration.tooLong}

- **Rolls:** ${stats.rolls.avg} avg (median: ${stats.rolls.median}, σ: ${stats.rolls.stdDev})
  - Range: ${stats.rolls.min} - ${stats.rolls.max}
  - In target (8-12): ${stats.rolls.percentInRange}%
  - Too few (<8): ${stats.rolls.tooFew}
  - Too many (>12): ${stats.rolls.tooMany}

- **Stickers:** ${stats.stickers.avg} avg (median: ${stats.stickers.median}, σ: ${stats.stickers.stdDev})
  - Range: ${stats.stickers.min} - ${stats.stickers.max}
  - In target (1-3): ${stats.stickers.percentInRange}%
  - Too few (<1): ${stats.stickers.tooFew}
  - Too many (>3): ${stats.stickers.tooMany}

### Economy Flow
- **Funds:** +$${stats.economy.avgFundsEarned} earned, -$${stats.economy.avgFundsSpent} spent (net: ${stats.economy.avgFundsNet > 0 ? '+' : ''}$${stats.economy.avgFundsNet})
- **Dice:** +${stats.economy.avgDiceGained} gained, -${stats.economy.avgDiceSpent} spent (net: ${stats.economy.avgDiceNet > 0 ? '+' : ''}${stats.economy.avgDiceNet})

---

## 🚨 Issues Identified (${issues.length})

${issues.length === 0 ? '✅ **No issues found!** All metrics are within target ranges.' : issues.map((issue, i) => `
### ${i + 1}. [${issue.severity}] ${issue.category.toUpperCase()}: ${issue.type.replace(/_/g, ' ')}
- **Problem:** ${issue.description}
- **Data:** ${issue.metric}
- **Priority:** ${issue.priority}
`).join('\n')}

---

## 🔧 Recommended Changes

${recommendations.length === 0 ? '✅ **No changes needed!**' : recommendations.map((rec, i) => `
### Fix ${i + 1}: ${rec.issue}
**Severity:** ${rec.severity}

${rec.changes.map(change => `
#### ${change.file}
\`\`\`javascript
// Section: ${change.section}
// Parameter: ${change.parameter}
// Current: ${change.currentValue}
// Suggested: ${change.suggestedValue}
// Reasoning: ${change.reasoning}
\`\`\`
`).join('\n')}
`).join('\n')}

---

## 📝 Code Patches

${Object.keys(patches).length === 0 ? 'No patches needed.' : Object.entries(patches).map(([file, changes]) => `
### \`${file}\`

\`\`\`javascript
${changes.map(c => `// ${c.section} - ${c.parameter}
// Change: ${c.from} → ${c.to}
// Reason: ${c.reasoning}`).join('\n\n')}
\`\`\`
`).join('\n')}

---

## ✅ Next Steps

1. **Review recommendations** above and decide which to implement
2. **Apply changes** to \`gameBalance.js\` (or other files as indicated)
3. **Test with 5 new sessions** to validate improvements
4. **Re-run this analysis** on new data: \`node scripts/analyze-playtest.js <new-csv>\`
5. **Iterate** until 80%+ sessions hit target ranges

---

## 📈 Success Criteria

- [ ] Duration: 80%+ sessions in 60-120s range (currently: ${stats.duration.percentInRange}%)
- [ ] Rolls: 80%+ sessions with 8-12 rolls (currently: ${stats.rolls.percentInRange}%)
- [ ] Stickers: 80%+ sessions with 1-3 stickers (currently: ${stats.stickers.percentInRange}%)

---

*Analysis powered by City Slacker automated balance tuning*
`;
  
  return report;
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node scripts/analyze-playtest.js <path-to-csv>');
    console.error('Example: node scripts/analyze-playtest.js playtest-results/session-data-1737500000000.csv');
    process.exit(1);
  }
  
  const csvPath = args[0];
  
  if (!fs.existsSync(csvPath)) {
    console.error(`Error: File not found: ${csvPath}`);
    process.exit(1);
  }
  
  console.log('🔍 Analyzing playtest data...\n');
  
  // Parse CSV
  const sessions = parseCSV(csvPath);
  console.log(`✅ Loaded ${sessions.length} sessions\n`);
  
  // Calculate statistics
  const stats = calculateStats(sessions);
  console.log('📊 Statistics calculated\n');
  
  // Identify issues
  const issues = identifyIssues(stats);
  console.log(`🚨 Found ${issues.length} balance issue(s)\n`);
  
  // Generate recommendations
  const recommendations = generateRecommendations(issues, stats);
  console.log(`🔧 Generated ${recommendations.length} recommendation(s)\n`);
  
  // Generate code patches
  const patches = generateCodePatches(recommendations);
  
  // Generate report
  const report = generateReport(stats, issues, recommendations, patches);
  
  // Save report
  const outputDir = path.dirname(csvPath);
  const timestamp = Date.now();
  const reportPath = path.join(outputDir, `analysis-${timestamp}.md`);
  
  fs.writeFileSync(reportPath, report);
  console.log(`✅ Analysis complete! Report saved to:\n   ${reportPath}\n`);
  
  // Print summary to console
  console.log('='.repeat(60));
  console.log('QUICK SUMMARY');
  console.log('='.repeat(60));
  console.log(`Duration: ${stats.duration.avg}s avg (target: 60-120s) - ${stats.duration.percentInRange}% in range`);
  console.log(`Rolls: ${stats.rolls.avg} avg (target: 8-12) - ${stats.rolls.percentInRange}% in range`);
  console.log(`Stickers: ${stats.stickers.avg} avg (target: 1-3) - ${stats.stickers.percentInRange}% in range`);
  console.log('='.repeat(60));
  
  if (issues.length > 0) {
    console.log('\n⚠️  Issues found - see report for detailed recommendations');
  } else {
    console.log('\n✅ All metrics within target ranges!');
  }
}

main();
