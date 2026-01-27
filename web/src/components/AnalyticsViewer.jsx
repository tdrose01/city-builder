import React, { useState, useEffect, useCallback } from 'react';
import {
  generateAnalytics,
  exportToCSV,
  generateMarkdownReport,
  clearAnalytics
} from '../utils/sessionAnalytics';

/**
 * Analytics Viewer Component
 * Displays session analytics for gameplay balance tuning.
 */
export default function AnalyticsViewer({ onClose }) {
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');

  const refreshAnalytics = useCallback(() => {
    const data = generateAnalytics();
    setAnalytics(data);
  }, []);

  useEffect(() => {
    refreshAnalytics();
  }, [refreshAnalytics]);

  const handleExportCSV = () => {
    const csv = exportToCSV();
    if (!csv) {
      alert('No session data to export');
      return;
    }
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `city-slacker-analytics-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    const report = generateMarkdownReport();
    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `balance-analysis-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (window.confirm('Clear all analytics data? This cannot be undone.')) {
      clearAnalytics();
      refreshAnalytics();
    }
  };

  if (!analytics) {
    return (
      <div className="analytics-viewer">
        <div className="analytics-header">
          <h2>Session Analytics</h2>
          <button onClick={onClose} className="analytics-close-btn">✕</button>
        </div>
        <div className="analytics-empty">
          <p>No session data available.</p>
          <p>Play some sessions to generate analytics!</p>
        </div>
      </div>
    );
  }

  const { totalSessions, averages, targets, outliers, distributions, recentSessions } = analytics;

  const getStatusIcon = (value, min, max) => {
    const num = parseFloat(value);
    return num >= min && num <= max ? '✅' : '⚠️';
  };

  return (
    <div className="analytics-viewer">
      <div className="analytics-header">
        <h2>Session Analytics</h2>
        <button onClick={onClose} className="analytics-close-btn">✕</button>
      </div>

      <div className="analytics-actions">
        <button onClick={handleExportCSV} className="analytics-btn">
          📊 Export CSV
        </button>
        <button onClick={handleExportMarkdown} className="analytics-btn">
          📝 Export Report
        </button>
        <button onClick={handleClearData} className="analytics-btn analytics-btn-danger">
          🗑️ Clear Data
        </button>
        <button onClick={refreshAnalytics} className="analytics-btn">
          🔄 Refresh
        </button>
      </div>

      <div className="analytics-tabs">
        <button
          className={`analytics-tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
        <button
          className={`analytics-tab ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          Recent Sessions
        </button>
        <button
          className={`analytics-tab ${activeTab === 'distribution' ? 'active' : ''}`}
          onClick={() => setActiveTab('distribution')}
        >
          Distributions
        </button>
      </div>

      <div className="analytics-content">
        {activeTab === 'summary' && (
          <div className="analytics-summary">
            <div className="analytics-stat-box">
              <h3>Overview</h3>
              <p><strong>Total Sessions:</strong> {totalSessions}</p>
              <p><strong>In Target Range (60-120s):</strong> {targets.percentInRange}%</p>
              <p><strong>Too Short (&lt;60s):</strong> {outliers.shortSessions}</p>
              <p><strong>Too Long (&gt;120s):</strong> {outliers.longSessions}</p>
            </div>

            <div className="analytics-stat-box">
              <h3>Target Metrics</h3>
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Target</th>
                    <th>Average</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Duration</td>
                    <td>{targets.duration}</td>
                    <td>{averages.duration}s</td>
                    <td>{getStatusIcon(averages.duration, 60, 120)}</td>
                  </tr>
                  <tr>
                    <td>Rolls</td>
                    <td>{targets.rolls}</td>
                    <td>{averages.rolls}</td>
                    <td>{getStatusIcon(averages.rolls, 8, 12)}</td>
                  </tr>
                  <tr>
                    <td>Stickers</td>
                    <td>{targets.stickers}</td>
                    <td>{averages.stickers}</td>
                    <td>{getStatusIcon(averages.stickers, 1, 3)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="analytics-stat-box">
              <h3>Gameplay Averages</h3>
              <table className="analytics-table">
                <tbody>
                  <tr>
                    <td>Milestones Reached</td>
                    <td>{averages.milestones}</td>
                  </tr>
                  <tr>
                    <td>Missions Completed</td>
                    <td>{averages.missions}</td>
                  </tr>
                  <tr>
                    <td>Upgrades Made</td>
                    <td>{averages.upgrades}</td>
                  </tr>
                  <tr>
                    <td>Doubles Rate</td>
                    <td>{averages.doublesRate}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="analytics-stat-box">
              <h3>Economy Balance</h3>
              <table className="analytics-table">
                <tbody>
                  <tr>
                    <td>Funds Earned</td>
                    <td>${averages.fundsEarned.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Funds Spent</td>
                    <td>${averages.fundsSpent.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Dice Spent</td>
                    <td>{averages.diceSpent}</td>
                  </tr>
                  <tr>
                    <td>Dice Gained</td>
                    <td>{averages.diceGained}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="analytics-sessions">
            <h3>Recent Sessions (Last 10)</h3>
            <div className="sessions-list">
              {recentSessions.map((session, i) => (
                <div key={session.sessionId} className="session-card">
                  <div className="session-header">
                    <strong>Session {i + 1}</strong>
                    <span className="session-date">
                      {new Date(session.startTime).toLocaleString()}
                    </span>
                  </div>
                  <div className="session-stats">
                    <div className="session-stat">
                      <span className="stat-label">Duration:</span>
                      <span className={`stat-value ${session.duration >= 60 && session.duration <= 120 ? 'stat-good' : 'stat-warn'}`}>
                        {session.duration}s {session.duration >= 60 && session.duration <= 120 ? '✅' : '⚠️'}
                      </span>
                    </div>
                    <div className="session-stat">
                      <span className="stat-label">Rolls:</span>
                      <span className="stat-value">{session.totalRolls}</span>
                    </div>
                    <div className="session-stat">
                      <span className="stat-label">Milestones:</span>
                      <span className="stat-value">{session.milestonesReached}</span>
                    </div>
                    <div className="session-stat">
                      <span className="stat-label">Missions:</span>
                      <span className="stat-value">{session.missionsCompleted}</span>
                    </div>
                    <div className="session-stat">
                      <span className="stat-label">Stickers:</span>
                      <span className="stat-value">{session.stickersEarned}</span>
                    </div>
                    <div className="session-stat">
                      <span className="stat-label">Upgrades:</span>
                      <span className="stat-value">{session.upgradesMade}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'distribution' && (
          <div className="analytics-distribution">
            <div className="analytics-stat-box">
              <h3>Tile Landing Frequency</h3>
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Tile Type</th>
                    <th>Total Landings</th>
                    <th>Per Session</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(distributions.tileFrequency)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => (
                      <tr key={type}>
                        <td>{type}</td>
                        <td>{count}</td>
                        <td>{(count / totalSessions).toFixed(1)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="analytics-stat-box">
              <h3>Roll Distribution</h3>
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>Roll</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(distributions.rollDistribution)
                    .map(([roll, count]) => {
                      const total = Object.values(distributions.rollDistribution).reduce((a, b) => a + b, 0);
                      const percentage = total > 0 ? (count / total * 100).toFixed(2) : 0;
                      return (
                        <tr key={roll}>
                          <td>{roll}</td>
                          <td>{count}</td>
                          <td>{percentage}%</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
