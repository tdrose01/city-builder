import React, { useEffect, useMemo, useState } from 'react';
import { POWER_UPS, getPowerUpCost, getPowerUpDurationLabel } from '../config/powerUps';

const PowerUpShop = ({
  cityLevel,
  funds,
  activePowerUps,
  cooldowns,
  purchasedPowerUps,
  onPurchase,
}) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const activeMap = useMemo(() => {
    return new Map(activePowerUps.map((powerUp) => [powerUp.id, powerUp]));
  }, [activePowerUps]);

  const powerUps = Object.values(POWER_UPS);

  const renderActionLabel = (powerUp, cost, isActive, isOwned, isCoolingDown) => {
    if (powerUp.cost === 0 && powerUp.trigger) {
      return 'Auto';
    }
    if (isActive) {
      return 'Active';
    }
    if (isOwned) {
      return 'Owned';
    }
    if (isCoolingDown) {
      return 'Cooldown';
    }
    if (powerUp.type === 'active') {
      return `Activate $${cost.toLocaleString()}`;
    }
    return `Buy $${cost.toLocaleString()}`;
  };

  return (
    <div className="powerup-shop">
      <div className="powerup-shop-header">
        <div>
          <p className="powerup-shop-label">Power-Ups</p>
          <h3 className="powerup-shop-title">Boost your next rolls</h3>
        </div>
        <div className="powerup-shop-funds">${funds.toLocaleString()}</div>
      </div>

      <div className="powerup-grid">
        {powerUps.map((powerUp) => {
          const cost = getPowerUpCost(powerUp, cityLevel);
          const activeState = activeMap.get(powerUp.id);
          const isActive = Boolean(activeState);
          const isOwned = Boolean(powerUp.maxPerCity && purchasedPowerUps?.[powerUp.id]);
          const cooldownUntil = cooldowns?.[powerUp.id];
          const isCoolingDown = cooldownUntil && cooldownUntil > now;
          const canAfford = funds >= cost;
          const isAuto = powerUp.cost === 0 && powerUp.trigger;
          const isDisabled = isAuto || isActive || isOwned || isCoolingDown || !canAfford;

          const remainingLabel = activeState?.remainingRolls
            ? `${activeState.remainingRolls} roll${activeState.remainingRolls === 1 ? '' : 's'} left`
            : null;

          const cooldownLabel = isCoolingDown
            ? `${Math.ceil((cooldownUntil - now) / 1000)}s`
            : null;

          return (
            <div key={powerUp.id} className={`powerup-card ${isActive ? 'is-active' : ''}`}>
              <div className="powerup-card-header">
                <div className="powerup-icon">{powerUp.icon}</div>
                <div>
                  <p className="powerup-name">{powerUp.name}</p>
                  <p className="powerup-type">{powerUp.type} · {getPowerUpDurationLabel(powerUp.duration)}</p>
                </div>
              </div>
              <p className="powerup-description">{powerUp.description}</p>
              <div className="powerup-card-footer">
                <div className="powerup-status">
                  {remainingLabel && <span className="powerup-pill">{remainingLabel}</span>}
                  {cooldownLabel && <span className="powerup-pill powerup-pill-muted">Cooldown {cooldownLabel}</span>}
                  {isOwned && <span className="powerup-pill powerup-pill-muted">Owned</span>}
                </div>
                <button
                  className="powerup-action"
                  disabled={isDisabled}
                  onClick={() => onPurchase(powerUp.id)}
                >
                  {renderActionLabel(powerUp, cost, isActive, isOwned, isCoolingDown)}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PowerUpShop;
