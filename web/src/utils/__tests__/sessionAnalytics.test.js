import { describe, it, expect, beforeEach } from 'vitest';
import {
  SessionMetrics,
  saveSession,
  loadAllSessions,
  clearAnalytics,
  generateAnalytics,
  exportToCSV,
  generateMarkdownReport
} from '../sessionAnalytics';

describe('SessionMetrics', () => {
  let session;

  beforeEach(() => {
    session = new SessionMetrics();
  });

  it('should initialize with correct defaults', () => {
    expect(session.totalRolls).toBe(0);
    expect(session.doublesCount).toBe(0);
    expect(session.milestonesReached).toBe(0);
    expect(session.tileTypeFrequency).toEqual({});
  });

  it('should record rolls correctly', () => {
    session.recordRoll(7, false);
    session.recordRoll(6, true);
    
    expect(session.totalRolls).toBe(2);
    expect(session.doublesCount).toBe(1);
    expect(session.rollDistribution[7]).toBe(1);
    expect(session.rollDistribution[6]).toBe(1);
  });

  it('should record tile landings', () => {
    session.recordTileLanding('FUNDS');
    session.recordTileLanding('FUNDS');
    session.recordTileLanding('HEIST');
    
    expect(session.tileTypeFrequency['FUNDS']).toBe(2);
    expect(session.tileTypeFrequency['HEIST']).toBe(1);
  });

  it('should record milestones and missions', () => {
    session.recordMilestone();
    session.recordMilestone();
    session.recordMissionComplete();
    
    expect(session.milestonesReached).toBe(2);
    expect(session.missionsCompleted).toBe(1);
  });

  it('should track funds earned and spent separately', () => {
    session.recordFundsChange(1000); // Earned
    session.recordFundsChange(500);  // Earned
    session.recordFundsChange(-300); // Spent
    
    expect(session.fundsEarned).toBe(1500);
    expect(session.fundsSpent).toBe(300);
  });

  it('should track dice gained and spent separately', () => {
    session.recordDiceChange(10); // Gained
    session.recordDiceChange(5);  // Gained
    session.recordDiceChange(-3); // Spent
    
    expect(session.diceGained).toBe(15);
    expect(session.diceSpent).toBe(3);
  });

  it('should calculate duration correctly', () => {
    const now = Date.now();
    session.startTime = now - 5000; // 5 seconds ago
    
    expect(session.getDuration()).toBeGreaterThanOrEqual(5);
  });

  it('should end session with final state', () => {
    session.endSession(10000, 50, 2, 1);
    
    expect(session.finalFunds).toBe(10000);
    expect(session.finalDice).toBe(50);
    expect(session.prestigeLevel).toBe(2);
    expect(session.cityLevel).toBe(1);
    expect(session.endTime).toBeTruthy();
  });

  it('should serialize to JSON correctly', () => {
    session.recordRoll(7, false);
    session.recordTileLanding('FUNDS');
    session.endSession(5000, 25, 0, 1);
    
    const json = session.toJSON();
    
    expect(json.totalRolls).toBe(1);
    expect(json.tileTypeFrequency['FUNDS']).toBe(1);
    expect(json.finalFunds).toBe(5000);
    expect(json.doublesRate).toBeDefined();
  });
});

describe('Analytics Storage', () => {
  beforeEach(() => {
    clearAnalytics();
  });

  it('should save and load sessions', () => {
    const session = new SessionMetrics();
    session.recordRoll(7, false);
    session.endSession(5000, 25, 0, 1);
    
    saveSession(session);
    const sessions = loadAllSessions();
    
    expect(sessions.length).toBe(1);
    expect(sessions[0].totalRolls).toBe(1);
  });

  it('should limit to MAX_SESSIONS', () => {
    // Save 55 sessions (MAX is 50)
    for (let i = 0; i < 55; i++) {
      const session = new SessionMetrics();
      session.endSession(1000, 10, 0, 1);
      saveSession(session);
    }
    
    const sessions = loadAllSessions();
    expect(sessions.length).toBe(50);
  });

  it('should clear analytics', () => {
    const session = new SessionMetrics();
    saveSession(session);
    
    clearAnalytics();
    const sessions = loadAllSessions();
    
    expect(sessions.length).toBe(0);
  });

  it('should handle corrupted data gracefully', () => {
    localStorage.setItem('city_slacker_analytics', '{invalid json}');
    const sessions = loadAllSessions();
    expect(sessions).toEqual([]);
  });
});

describe('Analytics Generation', () => {
  beforeEach(() => {
    clearAnalytics();
  });

  it('should return null when no sessions exist', () => {
    const analytics = generateAnalytics();
    expect(analytics).toBeNull();
  });

  it('should calculate averages correctly', () => {
    // Create 3 test sessions
    for (let i = 0; i < 3; i++) {
      const session = new SessionMetrics();
      session.startTime = Date.now() - 90000; // 90 seconds ago
      session.recordRoll(7, false);
      session.recordRoll(8, false);
      session.recordRoll(6, true);
      session.recordMilestone();
      session.recordMilestone();
      session.recordStickerEarned(2);
      session.endSession(5000, 25, 0, 1);
      saveSession(session);
    }
    
    const analytics = generateAnalytics();
    
    expect(analytics.totalSessions).toBe(3);
    expect(analytics.averages.rolls).toBe('3.0');
    expect(analytics.averages.milestones).toBe('2.0');
    expect(analytics.averages.stickers).toBe('2.0');
  });

  it('should identify sessions in target range', () => {
    // Create sessions: 1 short, 2 in range, 1 long
    const durations = [30, 80, 100, 150];
    
    durations.forEach(duration => {
      const session = new SessionMetrics();
      session.startTime = Date.now() - (duration * 1000);
      session.endSession(5000, 25, 0, 1);
      saveSession(session);
    });
    
    const analytics = generateAnalytics();
    
    expect(analytics.outliers.shortSessions).toBe(1);
    expect(analytics.outliers.longSessions).toBe(1);
    expect(parseFloat(analytics.targets.percentInRange)).toBe(50.0);
  });

  it('should aggregate tile frequency across sessions', () => {
    for (let i = 0; i < 2; i++) {
      const session = new SessionMetrics();
      session.recordTileLanding('FUNDS');
      session.recordTileLanding('FUNDS');
      session.recordTileLanding('HEIST');
      session.endSession(5000, 25, 0, 1);
      saveSession(session);
    }
    
    const analytics = generateAnalytics();
    
    expect(analytics.distributions.tileFrequency['FUNDS']).toBe(4);
    expect(analytics.distributions.tileFrequency['HEIST']).toBe(2);
  });

  it('should include recent sessions', () => {
    for (let i = 0; i < 15; i++) {
      const session = new SessionMetrics();
      session.endSession(5000, 25, 0, 1);
      saveSession(session);
    }
    
    const analytics = generateAnalytics();
    
    expect(analytics.recentSessions.length).toBe(10);
  });
});

describe('CSV Export', () => {
  beforeEach(() => {
    clearAnalytics();
  });

  it('should return empty string when no sessions', () => {
    const csv = exportToCSV();
    expect(csv).toBe('');
  });

  it('should generate valid CSV format', () => {
    const session = new SessionMetrics();
    session.recordRoll(7, false);
    session.endSession(5000, 25, 0, 1);
    saveSession(session);
    
    const csv = exportToCSV();
    
    expect(csv).toContain('Session ID');
    expect(csv).toContain('Duration (s)');
    expect(csv).toContain('Rolls');
    expect(csv.split('\n').length).toBeGreaterThan(1);
  });

  it('should include all session data in CSV', () => {
    const session = new SessionMetrics();
    session.recordRoll(7, false);
    session.recordMilestone();
    session.recordStickerEarned(2);
    session.endSession(5000, 25, 1, 1);
    saveSession(session);
    
    const csv = exportToCSV();
    const lines = csv.split('\n');
    const dataLine = lines[1];
    
    expect(dataLine).toContain('1'); // totalRolls
    expect(dataLine).toContain('1'); // milestones
    expect(dataLine).toContain('2'); // stickers
    expect(dataLine).toContain('5000'); // finalFunds
  });
});

describe('Markdown Report', () => {
  beforeEach(() => {
    clearAnalytics();
  });

  it('should handle no sessions', () => {
    const report = generateMarkdownReport();
    expect(report).toContain('No session data available');
  });

  it('should generate complete report', () => {
    const session = new SessionMetrics();
    session.startTime = Date.now() - 90000; // 90 seconds
    session.recordRoll(7, false);
    session.recordRoll(8, false);
    session.recordMilestone();
    session.recordMilestone();
    session.recordStickerEarned(2);
    session.endSession(5000, 25, 0, 1);
    saveSession(session);
    
    const report = generateMarkdownReport();
    
    expect(report).toContain('# Session Analysis Report');
    expect(report).toContain('Total Sessions Analyzed');
    expect(report).toContain('Target Metrics');
    expect(report).toContain('Gameplay Metrics');
    expect(report).toContain('Economy Balance');
    expect(report).toContain('Recommendations');
  });

  it('should show correct status indicators', () => {
    // Create session in target range
    const session = new SessionMetrics();
    session.startTime = Date.now() - 90000; // 90 seconds (in range)
    for (let i = 0; i < 10; i++) {
      session.recordRoll(7, false); // 10 rolls (in range)
    }
    session.recordStickerEarned(2); // 2 stickers (in range)
    session.endSession(5000, 25, 0, 1);
    saveSession(session);
    
    const report = generateMarkdownReport();
    
    // Should have check marks for metrics in range
    expect(report).toContain('✅');
  });

  it('should provide recommendations for out-of-range metrics', () => {
    // Create short session
    const session = new SessionMetrics();
    session.startTime = Date.now() - 30000; // 30 seconds (too short)
    session.recordRoll(7, false);
    session.endSession(5000, 25, 0, 1);
    saveSession(session);
    
    const report = generateMarkdownReport();
    
    expect(report).toContain('Recommendations');
    expect(report).toContain('⚠️');
  });
});
