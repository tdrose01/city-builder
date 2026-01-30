/**
 * Session Analytics Module
 * Tracks gameplay metrics for balance tuning and analysis.
 */

const ANALYTICS_KEY = 'city_slacker_analytics';
const MAX_SESSIONS = 50; // Keep last 50 sessions

/**
 * Session data structure
 */
export class SessionMetrics {
  constructor() {
    this.sessionId = Date.now();
    this.startTime = Date.now();
    this.endTime = null;
    this.totalRolls = 0;
    this.doublesCount = 0;
    this.milestonesReached = 0;
    this.missionsCompleted = 0;
    this.stickersEarned = 0;
    this.fundsEarned = 0;
    this.fundsSpent = 0;
    this.diceSpent = 0;
    this.diceGained = 0;
    this.upgradesMade = 0;
    this.heistsLanded = 0;
    this.shutdownsLanded = 0;
    this.prestigeLevel = 0;
    this.cityLevel = 1;
    this.finalFunds = 0;
    this.finalDice = 0;
    this.tileTypeFrequency = {};
    this.rollDistribution = { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0 };
  }

  recordRoll(diceValue, isDoubles) {
    this.totalRolls++;
    if (isDoubles) this.doublesCount++;
    if (this.rollDistribution[diceValue] !== undefined) {
      this.rollDistribution[diceValue]++;
    }
  }

  recordTileLanding(tileType) {
    if (!this.tileTypeFrequency[tileType]) {
      this.tileTypeFrequency[tileType] = 0;
    }
    this.tileTypeFrequency[tileType]++;
  }

  recordMilestone() {
    this.milestonesReached++;
  }

  recordMissionComplete() {
    this.missionsCompleted++;
  }

  recordStickerEarned(count = 1) {
    this.stickersEarned += count;
  }

  recordStickerPackEarned(count = 1) {
    // Assuming 3 stickers per pack for analytics approximation
    this.stickersEarned += count * 3;
  }

  recordFundsChange(delta) {
    if (delta > 0) {
      this.fundsEarned += delta;
    } else {
      this.fundsSpent += Math.abs(delta);
    }
  }

  recordDiceChange(delta) {
    if (delta > 0) {
      this.diceGained += delta;
    } else {
      this.diceSpent += Math.abs(delta);
    }
  }

  recordUpgrade() {
    this.upgradesMade++;
  }

  recordHeist() {
    this.heistsLanded++;
  }

  recordShutdown() {
    this.shutdownsLanded++;
  }

  recordShieldGained(count = 1) {
    // Track shield gains (not currently stored in metrics but prevents crashes)
  }

  endSession(finalFunds, finalDice, prestigeLevel, cityLevel) {
    this.endTime = Date.now();
    this.finalFunds = finalFunds;
    this.finalDice = finalDice;
    this.prestigeLevel = prestigeLevel;
    this.cityLevel = cityLevel;
  }

  getDuration() {
    const end = this.endTime || Date.now();
    return Math.floor((end - this.startTime) / 1000); // Duration in seconds
  }

  toJSON() {
    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.getDuration(),
      totalRolls: this.totalRolls,
      doublesCount: this.doublesCount,
      doublesRate: this.totalRolls > 0 ? (this.doublesCount / this.totalRolls * 100).toFixed(1) : 0,
      milestonesReached: this.milestonesReached,
      missionsCompleted: this.missionsCompleted,
      stickersEarned: this.stickersEarned,
      fundsEarned: this.fundsEarned,
      fundsSpent: this.fundsSpent,
      fundsNet: this.fundsEarned - this.fundsSpent,
      diceSpent: this.diceSpent,
      diceGained: this.diceGained,
      diceNet: this.diceGained - this.diceSpent,
      upgradesMade: this.upgradesMade,
      heistsLanded: this.heistsLanded,
      shutdownsLanded: this.shutdownsLanded,
      prestigeLevel: this.prestigeLevel,
      cityLevel: this.cityLevel,
      finalFunds: this.finalFunds,
      finalDice: this.finalDice,
      tileTypeFrequency: this.tileTypeFrequency,
      rollDistribution: this.rollDistribution
    };
  }
}

/**
 * Save completed session to localStorage
 */
export const saveSession = (sessionMetrics) => {
  try {
    const sessions = loadAllSessions();
    sessions.push(sessionMetrics.toJSON());
    
    // Keep only last MAX_SESSIONS
    if (sessions.length > MAX_SESSIONS) {
      sessions.splice(0, sessions.length - MAX_SESSIONS);
    }
    
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(sessions));
    return true;
  } catch (error) {
    console.error('Failed to save session analytics:', error);
    return false;
  }
};

/**
 * Load all sessions from localStorage
 */
export const loadAllSessions = () => {
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load session analytics:', error);
    return [];
  }
};

/**
 * Clear all analytics data
 */
export const clearAnalytics = () => {
  try {
    localStorage.removeItem(ANALYTICS_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear analytics:', error);
    return false;
  }
};

/**
 * Generate aggregate statistics from all sessions
 */
export const generateAnalytics = () => {
  const sessions = loadAllSessions();
  
  if (sessions.length === 0) {
    return null;
  }

  // Calculate averages
  const totalSessions = sessions.length;
  const avgDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / totalSessions;
  const avgRolls = sessions.reduce((sum, s) => sum + s.totalRolls, 0) / totalSessions;
  const avgMilestones = sessions.reduce((sum, s) => sum + s.milestonesReached, 0) / totalSessions;
  const avgMissions = sessions.reduce((sum, s) => sum + s.missionsCompleted, 0) / totalSessions;
  const avgStickers = sessions.reduce((sum, s) => sum + s.stickersEarned, 0) / totalSessions;
  const avgUpgrades = sessions.reduce((sum, s) => sum + s.upgradesMade, 0) / totalSessions;
  const avgDoublesRate = sessions.reduce((sum, s) => sum + parseFloat(s.doublesRate), 0) / totalSessions;

  // Find sessions within target range (60-120s)
  const sessionsInRange = sessions.filter(s => s.duration >= 60 && s.duration <= 120);
  const percentInRange = (sessionsInRange.length / totalSessions * 100).toFixed(1);

  // Find outliers
  const shortSessions = sessions.filter(s => s.duration < 60);
  const longSessions = sessions.filter(s => s.duration > 120);

  // Aggregate tile frequency
  const aggregateTileFreq = {};
  sessions.forEach(s => {
    Object.entries(s.tileTypeFrequency).forEach(([type, count]) => {
      if (!aggregateTileFreq[type]) aggregateTileFreq[type] = 0;
      aggregateTileFreq[type] += count;
    });
  });

  // Aggregate roll distribution
  const aggregateRollDist = {};
  sessions.forEach(s => {
    Object.entries(s.rollDistribution).forEach(([roll, count]) => {
      if (!aggregateRollDist[roll]) aggregateRollDist[roll] = 0;
      aggregateRollDist[roll] += count;
    });
  });

  // Economy metrics
  const avgFundsEarned = sessions.reduce((sum, s) => sum + s.fundsEarned, 0) / totalSessions;
  const avgFundsSpent = sessions.reduce((sum, s) => sum + s.fundsSpent, 0) / totalSessions;
  const avgDiceSpent = sessions.reduce((sum, s) => sum + s.diceSpent, 0) / totalSessions;
  const avgDiceGained = sessions.reduce((sum, s) => sum + s.diceGained, 0) / totalSessions;

  return {
    totalSessions,
    averages: {
      duration: Math.round(avgDuration),
      rolls: avgRolls.toFixed(1),
      milestones: avgMilestones.toFixed(1),
      missions: avgMissions.toFixed(1),
      stickers: avgStickers.toFixed(1),
      upgrades: avgUpgrades.toFixed(1),
      doublesRate: avgDoublesRate.toFixed(1),
      fundsEarned: Math.round(avgFundsEarned),
      fundsSpent: Math.round(avgFundsSpent),
      diceSpent: avgDiceSpent.toFixed(1),
      diceGained: avgDiceGained.toFixed(1)
    },
    targets: {
      duration: '60-120s',
      rolls: '8-12',
      stickers: '1-3',
      percentInRange: percentInRange
    },
    outliers: {
      shortSessions: shortSessions.length,
      longSessions: longSessions.length
    },
    distributions: {
      tileFrequency: aggregateTileFreq,
      rollDistribution: aggregateRollDist
    },
    recentSessions: sessions.slice(-10).reverse() // Last 10 sessions, most recent first
  };
};

/**
 * Export analytics to CSV format
 */
export const exportToCSV = () => {
  const sessions = loadAllSessions();
  
  if (sessions.length === 0) {
    return '';
  }

  // CSV headers
  const headers = [
    'Session ID',
    'Date',
    'Duration (s)',
    'Rolls',
    'Doubles',
    'Doubles %',
    'Milestones',
    'Missions',
    'Stickers',
    'Funds Earned',
    'Funds Spent',
    'Funds Net',
    'Dice Spent',
    'Dice Gained',
    'Dice Net',
    'Upgrades',
    'Heists',
    'Shutdowns',
    'Prestige',
    'City',
    'Final Funds',
    'Final Dice'
  ];

  // CSV rows
  const rows = sessions.map(s => [
    s.sessionId,
    new Date(s.startTime).toISOString(),
    s.duration,
    s.totalRolls,
    s.doublesCount,
    s.doublesRate,
    s.milestonesReached,
    s.missionsCompleted,
    s.stickersEarned,
    s.fundsEarned,
    s.fundsSpent,
    s.fundsNet,
    s.diceSpent,
    s.diceGained,
    s.diceNet,
    s.upgradesMade,
    s.heistsLanded,
    s.shutdownsLanded,
    s.prestigeLevel,
    s.cityLevel,
    s.finalFunds,
    s.finalDice
  ]);

  // Combine headers and rows
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  return csv;
};

/**
 * Generate markdown analysis report
 */
export const generateMarkdownReport = () => {
  const analytics = generateAnalytics();
  
  if (!analytics) {
    return '# Session Analysis Report\n\nNo session data available. Play at least one session to generate analytics.';
  }

  const { totalSessions, averages, targets, outliers, distributions, recentSessions } = analytics;

  let report = `# Session Analysis Report
Generated: ${new Date().toLocaleString()}

## Summary
- **Total Sessions Analyzed:** ${totalSessions}
- **Sessions in Target Range (60-120s):** ${targets.percentInRange}%

## Target Metrics
| Metric | Target | Average | Status |
|--------|--------|---------|--------|
| Session Duration | ${targets.duration} | ${averages.duration}s | ${averages.duration >= 60 && averages.duration <= 120 ? '✅' : '❌'} |
| Rolls per Session | ${targets.rolls} | ${averages.rolls} | ${averages.rolls >= 8 && averages.rolls <= 12 ? '✅' : '❌'} |
| Stickers per Session | ${targets.stickers} | ${averages.stickers} | ${averages.stickers >= 1 && averages.stickers <= 3 ? '✅' : '❌'} |

## Gameplay Metrics
| Metric | Average |
|--------|---------|
| Milestones Reached | ${averages.milestones} |
| Missions Completed | ${averages.missions} |
| Upgrades Made | ${averages.upgrades} |
| Doubles Rate | ${averages.doublesRate}% |

## Economy Balance
| Metric | Average |
|--------|---------|
| Funds Earned | $${averages.fundsEarned.toLocaleString()} |
| Funds Spent | $${averages.fundsSpent.toLocaleString()} |
| Dice Spent | ${averages.diceSpent} |
| Dice Gained | ${averages.diceGained} |

## Session Distribution
- **Too Short (<60s):** ${outliers.shortSessions} sessions
- **In Range (60-120s):** ${totalSessions - outliers.shortSessions - outliers.longSessions} sessions
- **Too Long (>120s):** ${outliers.longSessions} sessions

## Tile Landing Frequency
${Object.entries(distributions.tileFrequency)
  .sort((a, b) => b[1] - a[1])
  .map(([type, count]) => `- **${type}:** ${count} times (${(count / totalSessions).toFixed(1)} per session)`)
  .join('\n')}

## Roll Distribution (Expected: 2.78% for 2/12, 5.56% for 3/11, etc.)
${Object.entries(distributions.rollDistribution)
  .map(([roll, count]) => {
    const total = Object.values(distributions.rollDistribution).reduce((a, b) => a + b, 0);
    const percentage = total > 0 ? (count / total * 100).toFixed(2) : 0;
    return `- **${roll}:** ${count} times (${percentage}%)`;
  })
  .join('\n')}

## Recent Sessions (Last 10)
${recentSessions.map((s, i) => `
### Session ${i + 1} - ${new Date(s.startTime).toLocaleString()}
- Duration: ${s.duration}s ${s.duration >= 60 && s.duration <= 120 ? '✅' : '⚠️'}
- Rolls: ${s.totalRolls}
- Milestones: ${s.milestonesReached}
- Missions: ${s.missionsCompleted}
- Stickers: ${s.stickersEarned}
- Upgrades: ${s.upgradesMade}
`).join('\n')}

## Recommendations

### Session Duration
${averages.duration < 60 
  ? '⚠️ **Sessions too short:** Increase milestone thresholds, reduce dice/funds generation, or add more upgrade requirements.'
  : averages.duration > 120
  ? '⚠️ **Sessions too long:** Reduce milestone thresholds, increase dice/funds generation, or reduce upgrade costs.'
  : '✅ **Duration is optimal.** Sessions are hitting the 60-120s target.'}

### Roll Count
${averages.rolls < 8
  ? '⚠️ **Too few rolls:** Increase starting dice, add more dice rewards, or reduce dice costs.'
  : averages.rolls > 12
  ? '⚠️ **Too many rolls:** Reduce starting dice, decrease dice rewards, or increase dice costs.'
  : '✅ **Roll count is optimal.** Players are rolling 8-12 times per session.'}

### Sticker Rewards
${averages.stickers < 1
  ? '⚠️ **Too few stickers:** Increase pack rewards from milestones/missions, or reduce pack costs.'
  : averages.stickers > 3
  ? '⚠️ **Too many stickers:** Decrease pack rewards or increase pack costs.'
  : '✅ **Sticker rewards are optimal.** Players earn 1-3 stickers per session.'}

### Economy Balance
- Funds flow: ${averages.fundsEarned > averages.fundsSpent ? 'Positive (players accumulating funds)' : 'Negative (players spending more than earning)'}
- Dice flow: ${averages.diceGained > averages.diceSpent ? 'Positive (players accumulating dice)' : 'Negative (players consuming dice faster than earning)'}

---
*Report generated by City Slacker Session Analytics*
`;

  return report;
};
