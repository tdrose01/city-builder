import { POWER_UPS } from '../config/powerUps';

/**
 * PowerUpIndicator Component
 *
 * Displays active power-ups and temporary effects in the HUD.
 */
export default function PowerUpIndicator({
  activePowerUps = [],
  hasTaxHavenPowerUp = false,
  hasJailFreeCard = false,
  themeColor = '#ffffff'
}) {
  const extraEffects = [];

  if (hasTaxHavenPowerUp) {
    extraEffects.push({
      id: 'tax_haven',
      name: 'Tax Haven',
      icon: '🛡️',
      remainingRolls: 1
    });
  }

  if (hasJailFreeCard) {
    extraEffects.push({
      id: 'jail_free_card',
      name: 'Jail Free',
      icon: '🎫'
    });
  }

  const displayPowerUps = [
    ...activePowerUps.map((powerUp) => {
      const config = Object.values(POWER_UPS).find((entry) => entry.id === powerUp.id);
      return {
        id: powerUp.id,
        name: config?.name || powerUp.id,
        icon: config?.icon || '✨',
        remainingRolls: powerUp.remainingRolls
      };
    }),
    ...extraEffects
  ];

  return (
    <div className="powerup-indicator" style={{ borderColor: `${themeColor}33` }}>
      <div className="powerup-indicator-title" style={{ color: themeColor }}>
        Active Power-Ups
      </div>
      {displayPowerUps.length === 0 ? (
        <div className="powerup-empty">None active</div>
      ) : (
        <div className="powerup-chip-row">
          {displayPowerUps.map((powerUp) => (
            <div
              key={powerUp.id}
              className="powerup-chip"
              style={{ borderColor: `${themeColor}55` }}
            >
              <span className="powerup-chip-icon">{powerUp.icon}</span>
              <span className="powerup-chip-name">{powerUp.name}</span>
              {Number.isFinite(powerUp.remainingRolls) ? (
                <span className="powerup-chip-remaining">
                  {powerUp.remainingRolls}r
                </span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
