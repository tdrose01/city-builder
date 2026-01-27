import { POWER_UPS, POWER_UP_ORDER, getPowerUpCost, getPowerUpDurationLabel } from '../config/powerUps';

/**
 * PowerUpShop Component
 *
 * Displays purchasable power-ups and activation controls.
 */
export default function PowerUpShop({
  cityLevel,
  funds,
  activePowerUps,
  cooldowns,
  positiveTileStreak,
  onActivate
}) {
  const getCooldownSeconds = (powerUp) => {
    if (!powerUp?.cooldownMs) return 0;
    const expiresAt = cooldowns?.[powerUp.id];
    if (!expiresAt) return 0;
    const remainingMs = Math.max(0, expiresAt - Date.now());
    return Math.ceil(remainingMs / 1000);
  };

  const isActive = (powerUpId) =>
    activePowerUps.some((powerUp) => powerUp.id === powerUpId);

  return (
    <div className="powerup-shop">
      {POWER_UP_ORDER.map((powerUpId) => {
        const powerUp = Object.values(POWER_UPS).find((entry) => entry.id === powerUpId);
        if (!powerUp) return null;

        const cost = getPowerUpCost(powerUp, cityLevel);
        const active = isActive(powerUp.id);
        const cooldownSeconds = getCooldownSeconds(powerUp);
        const canAfford = funds >= cost;
        const isAuto = powerUp.auto;
        const durationLabel = getPowerUpDurationLabel(powerUp);
        const disabled =
          isAuto ||
          active ||
          cooldownSeconds > 0 ||
          (!canAfford && cost > 0) ||
          (powerUp.maxPerCity && active);

        let actionLabel = 'Activate';
        if (isAuto) actionLabel = `Auto (${positiveTileStreak}/3)`;
        if (active) actionLabel = 'Active';
        if (cooldownSeconds > 0) actionLabel = `Cooldown ${cooldownSeconds}s`;
        if (!canAfford && cost > 0) actionLabel = 'Not enough funds';

        return (
          <div key={powerUp.id} className="powerup-card">
            <div className="powerup-card-header">
              <div className="powerup-title">
                <span className="powerup-icon">{powerUp.icon}</span>
                <span>{powerUp.name}</span>
              </div>
              {durationLabel && (
                <span className="powerup-duration">{durationLabel}</span>
              )}
            </div>
            <div className="powerup-desc">{powerUp.description}</div>
            <div className="powerup-meta">
              Cost: {cost > 0 ? `$${cost.toLocaleString()}` : 'Free'}
            </div>
            <button
              className="powerup-action"
              onClick={() => onActivate(powerUp.id)}
              disabled={disabled}
            >
              {actionLabel}
            </button>
          </div>
        );
      })}
    </div>
  );
}
