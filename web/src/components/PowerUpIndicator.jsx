import React, { useMemo } from 'react';
import { POWER_UPS, getPowerUpDurationLabel } from '../config/powerUps';

const PowerUpIndicator = ({ activePowerUps = [] }) => {
  const powerUpEntries = useMemo(() => {
    return activePowerUps.map((powerUp) => {
      const config = Object.values(POWER_UPS).find((entry) => entry.id === powerUp.id);
      return {
        ...powerUp,
        name: config?.name ?? powerUp.id,
        icon: config?.icon ?? '✨',
        duration: config?.duration,
      };
    });
  }, [activePowerUps]);

  if (!powerUpEntries.length) {
    return (
      <div className="powerup-indicator powerup-indicator-empty">
        <span className="powerup-indicator-title">Power-Ups</span>
        <span className="powerup-indicator-muted">None active</span>
      </div>
    );
  }

  return (
    <div className="powerup-indicator">
      <span className="powerup-indicator-title">Power-Ups</span>
      <div className="powerup-indicator-list">
        {powerUpEntries.map((powerUp) => (
          <div key={powerUp.id} className="powerup-indicator-item">
            <span className="powerup-indicator-icon">{powerUp.icon}</span>
            <div>
              <p className="powerup-indicator-name">{powerUp.name}</p>
              <p className="powerup-indicator-meta">
                {powerUp.remainingRolls
                  ? `${powerUp.remainingRolls} roll${powerUp.remainingRolls === 1 ? '' : 's'} left`
                  : getPowerUpDurationLabel(powerUp.duration)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PowerUpIndicator;
