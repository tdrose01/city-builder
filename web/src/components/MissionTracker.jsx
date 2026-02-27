/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { DAILY_MISSIONS, WEEKLY_MISSIONS, MONTHLY_MISSIONS } from '../config/missions';

export default function MissionTracker({ 
  rolls, 
  upgrades, 
  shieldsCollected, 
  currentShields,
  fundsTilesLanded, 
  missionState, 
  setMissionState,
  onMissionComplete, 
  onAllMissionsComplete, 
  onResetAvailable,
  missionResetCount
}) {
  const [activeTab, setActiveTab] = useState('daily');
  const [allDailyCompletedNotified, setAllDailyCompletedNotified] = useState(false);
  const effectiveShields = Math.max(shieldsCollected || 0, currentShields || 0);

  // Helper to calculate progress
  const getProgress = (type, startVal, currentVal) => {
    return Math.max(0, currentVal - startVal);
  };

  // Helper to process missions of a specific type (daily, weekly, monthly)
  const processMissions = (category, missionConfig, startValues) => {
    return missionConfig.map(mission => {
      // Check if already completed in state
      if (missionState[category].completed.includes(mission.id)) {
        return { ...mission, current: mission.target, completed: true };
      }

      let current = 0;
      switch (mission.type) {
        case 'rolls':
          current = getProgress(mission.type, startValues.startRolls || 0, rolls);
          break;
        case 'upgrades':
          current = getProgress(mission.type, startValues.startUpgrades || 0, upgrades);
          break;
        case 'shields':
          current = getProgress(mission.type, startValues.startShields || 0, effectiveShields);
          break;
        case 'fundsTiles':
          current = getProgress(mission.type, startValues.startFundsTiles || 0, fundsTilesLanded);
          break;
        case 'dailyCycles':
          current = getProgress(mission.type, startValues.startDailyCycles || 0, missionResetCount);
          break;
        default:
          break;
      }

      return { ...mission, current: Math.min(current, mission.target), completed: current >= mission.target };
    });
  };

  const dailyMissions = processMissions('daily', DAILY_MISSIONS, missionState.daily);
  const weeklyMissions = processMissions('weekly', WEEKLY_MISSIONS, missionState.weekly);
  const monthlyMissions = processMissions('monthly', MONTHLY_MISSIONS, missionState.monthly);

  // Effect to handle completions
  useEffect(() => {
    const handleCompletion = (category, missions) => {
      const newlyCompleted = missions.filter(m => m.completed && !missionState[category].completed.includes(m.id));
      
      if (newlyCompleted.length > 0) {
        // Update state to mark as completed
        console.log("setMissionState called"); setMissionState(prev => ({
          ...prev,
          [category]: {
            ...prev[category],
            completed: [...prev[category].completed, ...newlyCompleted.map(m => m.id)]
          }
        }));

        // Grant rewards
        newlyCompleted.forEach(m => {
          if (onMissionComplete) onMissionComplete(m.reward);
        });
      }
    };

    handleCompletion('daily', dailyMissions);
    handleCompletion('weekly', weeklyMissions);
    handleCompletion('monthly', monthlyMissions);

    // Check all daily completed
    const allDailyComplete = dailyMissions.every(m => m.completed);
    if (allDailyComplete && !allDailyCompletedNotified) {
      setAllDailyCompletedNotified(true);
      if (onAllMissionsComplete) onAllMissionsComplete();
    }
  }, [rolls, upgrades, shieldsCollected, currentShields, fundsTilesLanded, missionResetCount]); // Deps trigger recalc

  // Reset Logic for Daily
  const handleResetDaily = () => {
    console.log("setMissionState called"); setMissionState(prev => ({
      ...prev,
      daily: {
        startRolls: rolls,
        startUpgrades: upgrades,
        startShields: effectiveShields,
        startFundsTiles: fundsTilesLanded,
        completed: [],
        resetCount: (prev.daily.resetCount || 0) + 1
      }
    }));
    setAllDailyCompletedNotified(false);
  };

  // Notify parent about reset availability
  const allDailyComplete = dailyMissions.every(m => m.completed);
  useEffect(() => {
    if (onResetAvailable) {
      onResetAvailable(allDailyComplete, handleResetDaily);
    }
  }, [allDailyComplete]);

  const renderMissionList = (missions) => (
    <div className="mission-list">
      {missions.map(mission => (
        <div key={mission.id} className={`mission-item ${mission.completed ? 'completed' : ''}`}>
          <div className="mission-desc">
            {mission.description}
            <div className="mission-reward-preview">
              {mission.reward.type === 'funds' ? '$' : ''}{mission.reward.amount} {mission.reward.type}
            </div>
          </div>
          <div className="mission-progress">
            <span className="mission-current">{mission.current}</span>
            <span className="mission-separator">/</span>
            <span className="mission-target">{mission.target}</span>
            {mission.completed && (
              <svg className="mission-check" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="mission-tracker">
      <div className="mission-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        {['daily', 'weekly', 'monthly'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '6px',
              fontSize: '11px',
              backgroundColor: activeTab === tab ? '#fbbf24' : 'rgba(255,255,255,0.1)',
              color: activeTab === tab ? '#000' : '#fff',
              border: 'none',
              borderRadius: '6px',
              textTransform: 'capitalize',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mission-content">
        {activeTab === 'daily' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold' }}>
                Cycle {missionResetCount + 1}
              </span>
            </div>
            {renderMissionList(dailyMissions)}
          </>
        )}
        {activeTab === 'weekly' && renderMissionList(weeklyMissions)}
        {activeTab === 'monthly' && renderMissionList(monthlyMissions)}
      </div>
    </div>
  );
}
