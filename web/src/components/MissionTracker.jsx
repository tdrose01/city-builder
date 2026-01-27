/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';

const MISSIONS = [
  { id: 1, description: "Roll the dice 10 times", target: 10, current: 0, completed: false, reward: { type: 'dice', amount: 5 } },
  { id: 2, description: "Upgrade a landmark", target: 1, current: 0, completed: false, reward: { type: 'funds', amount: 1500 } },
  { id: 3, description: "Collect 5 shields", target: 5, current: 0, completed: false, reward: { type: 'shields', amount: 2 } },
  { id: 4, description: "Land on a Funds tile 3 times", target: 3, current: 0, completed: false, reward: { type: 'funds', amount: 2000 } },
];

export default function MissionTracker({ rolls, upgrades, shieldsCollected, fundsTilesLanded, onMissionComplete, onAllMissionsComplete, onResetAvailable }) {
  const [missions, setMissions] = useState(MISSIONS);
  const [allCompletedNotified, setAllCompletedNotified] = useState(false);
  const [missionResetCount, setMissionResetCount] = useState(0);
  
  // Track starting values for current cycle
  const [cycleStartRolls, setCycleStartRolls] = useState(0);
  const [cycleStartUpgrades, setCycleStartUpgrades] = useState(0);
  const [cycleStartShields, setCycleStartShields] = useState(0);
  const [cycleStartFundsTiles, setCycleStartFundsTiles] = useState(0);

  useEffect(() => {
    let hasChanges = false;
    const updatedMissions = missions.map(mission => {
      if (mission.completed) return mission;
      
      let newCurrent = mission.current;

      if (mission.id === 1) { // Roll the dice mission
        newCurrent = Math.min(rolls - cycleStartRolls, mission.target);
      } else if (mission.id === 2) { // Upgrade a landmark mission
        newCurrent = Math.min(upgrades - cycleStartUpgrades, mission.target);
      } else if (mission.id === 3) { // Collect shields mission
        newCurrent = Math.min(shieldsCollected - cycleStartShields, mission.target);
      } else if (mission.id === 4) { // Land on a Funds tile mission
        newCurrent = Math.min(fundsTilesLanded - cycleStartFundsTiles, mission.target);
      }

      if (newCurrent !== mission.current) {
        hasChanges = true;
        
        if (newCurrent >= mission.target) {
          if (onMissionComplete) {
            onMissionComplete(mission.reward);
          }
          return { ...mission, current: newCurrent, completed: true };
        }
        return { ...mission, current: newCurrent };
      }
      
      return mission;
    });

    // Only update state if there's an actual change
    if (hasChanges) {
      setMissions(updatedMissions);
      
      const isAllCompletedNow = updatedMissions.every(m => m.completed);
      if (isAllCompletedNow && !allCompletedNotified) {
        setAllCompletedNotified(true);
        if (onAllMissionsComplete) {
          onAllMissionsComplete();
        }
      }
    }
  }, [rolls, upgrades, shieldsCollected, fundsTilesLanded, cycleStartRolls, cycleStartUpgrades, cycleStartShields, cycleStartFundsTiles]);

  const allMissionsComplete = missions.every(m => m.completed);
  
  const handleResetMissions = () => {
    // Set new cycle start values to current cumulative stats
    setCycleStartRolls(rolls);
    setCycleStartUpgrades(upgrades);
    setCycleStartShields(shieldsCollected);
    setCycleStartFundsTiles(fundsTilesLanded);
    
    // Reset missions
    setMissions(MISSIONS.map(m => ({ ...m, completed: false, current: 0 })));
    setAllCompletedNotified(false);
    setMissionResetCount(prev => prev + 1);
  };

  // Notify parent when reset is available
  React.useEffect(() => {
    if (onResetAvailable) {
      onResetAvailable(allMissionsComplete, handleResetMissions);
    }
  }, [allMissionsComplete]);

  return (
    <div className="mission-tracker">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ margin: 0 }}>Active Missions</h3>
        {missionResetCount > 0 && (
          <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 'bold' }}>
            Cycle {missionResetCount + 1}
          </span>
        )}
      </div>
      {missions.map(mission => (
        <div key={mission.id} className={`mission-item ${mission.completed ? 'completed' : ''}`}>
          <div className="mission-desc">{mission.description}</div>
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
}