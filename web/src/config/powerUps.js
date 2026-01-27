import { scaleByCity } from './tileTypes';

/**
 * Power-Up Configuration
 *
 * Defines purchasable and automatic power-ups for Phase 8.
 * Costs scale by city level using the same 1.4x multiplier.
 */
export const POWER_UPS = {
  HOT_STREAK: {
    id: 'hot_streak',
    name: 'Hot Streak',
    icon: '🔥',
    type: 'passive',
    cost: 0,
    duration: 5, // rolls
    trigger: { positiveTiles: 3 },
    effect: { fundsMultiplier: 1.5 },
    auto: true,
    description: '+50% funds rewards for 5 rolls after 3 positive tiles'
  },
  MEGA_MULTIPLIER: {
    id: 'mega_multiplier',
    name: 'Mega Multiplier',
    icon: '💪',
    type: 'active',
    cost: (cityLevel) => scaleByCity(2000, cityLevel),
    duration: 1, // next roll only
    effect: { rewardMultiplier: 3 },
    description: '3x rewards on next roll'
  },
  SHIELD_STORM: {
    id: 'shield_storm',
    name: 'Shield Storm',
    icon: '🛡️',
    type: 'active',
    cost: (cityLevel) => scaleByCity(1500, cityLevel),
    cooldownMs: 30000,
    effect: { shields: 3 },
    apply: 'instant',
    description: 'Gain 3 shields instantly'
  },
  LUCKY_DICE: {
    id: 'lucky_dice',
    name: 'Lucky Dice',
    icon: '🎲',
    type: 'active',
    cost: (cityLevel) => scaleByCity(3000, cityLevel),
    duration: 1,
    effect: { guaranteeDoubles: true },
    description: 'Next roll is guaranteed doubles'
  },
  SPEED_BOOST: {
    id: 'speed_boost',
    name: 'Speed Boost',
    icon: '🏃',
    type: 'passive',
    cost: (cityLevel) => scaleByCity(2500, cityLevel),
    duration: 10, // rolls
    effect: { diceCostMultiplier: 0.5 },
    description: 'Rolls cost 50% less dice for 10 rolls'
  },
  MONEY_MAGNET: {
    id: 'money_magnet',
    name: 'Money Magnet',
    icon: '💰',
    type: 'passive',
    cost: (cityLevel) => scaleByCity(5000, cityLevel),
    duration: Infinity, // entire city
    maxPerCity: 1,
    effect: { fundsTileMultiplier: 1.25 },
    description: '+25% funds from Funds tiles for this city'
  }
};

export const POWER_UP_ORDER = [
  POWER_UPS.MEGA_MULTIPLIER.id,
  POWER_UPS.LUCKY_DICE.id,
  POWER_UPS.SHIELD_STORM.id,
  POWER_UPS.SPEED_BOOST.id,
  POWER_UPS.MONEY_MAGNET.id,
  POWER_UPS.HOT_STREAK.id
];

export const getPowerUpCost = (powerUp, cityLevel) => {
  if (!powerUp) return 0;
  if (typeof powerUp.cost === 'function') {
    return Math.round(powerUp.cost(cityLevel));
  }
  return Math.round(powerUp.cost || 0);
};

export const getPowerUpDurationLabel = (powerUp) => {
  if (!powerUp) return '';
  if (powerUp.duration === Infinity) return 'City';
  if (powerUp.duration) return `${powerUp.duration} rolls`;
  return '';
};

export default POWER_UPS;
