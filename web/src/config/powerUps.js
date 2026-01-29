export const POWER_UPS = {
  HOT_STREAK: {
    id: 'hot_streak',
    name: 'Hot Streak',
    icon: '🔥',
    type: 'passive',
    cost: 0,
    duration: 5,
    effect: { fundsMultiplier: 1.5 },
    trigger: { consecutivePositiveTiles: 3 },
    description: '+50% funds for 5 rolls after 3 positive tiles',
  },
  MEGA_MULTIPLIER: {
    id: 'mega_multiplier',
    name: 'Mega Multiplier',
    icon: '💪',
    type: 'active',
    cost: (cityLevel) => 2000 * Math.pow(1.4, cityLevel - 1),
    duration: 1,
    effect: { rewardMultiplier: 3 },
    cooldown: 0,
    description: '3x rewards on next roll',
  },
  SHIELD_STORM: {
    id: 'shield_storm',
    name: 'Shield Storm',
    icon: '🛡️',
    type: 'active',
    cost: (cityLevel) => 1500 * Math.pow(1.4, cityLevel - 1),
    effect: { shields: 3 },
    cooldown: 30,
    description: 'Gain 3 shields instantly',
  },
  LUCKY_DICE: {
    id: 'lucky_dice',
    name: 'Lucky Dice',
    icon: '🎲',
    type: 'active',
    cost: (cityLevel) => 3000 * Math.pow(1.4, cityLevel - 1),
    effect: { guaranteeDoubles: true },
    duration: 1,
    description: 'Next roll is guaranteed doubles',
  },
  SPEED_BOOST: {
    id: 'speed_boost',
    name: 'Speed Boost',
    icon: '🏃',
    type: 'passive',
    cost: (cityLevel) => 2500 * Math.pow(1.4, cityLevel - 1),
    duration: 10,
    effect: { diceCostMultiplier: 0.5 },
    description: 'Rolls cost 50% less dice for 10 rolls',
  },
  MONEY_MAGNET: {
    id: 'money_magnet',
    name: 'Money Magnet',
    icon: '💰',
    type: 'passive',
    cost: (cityLevel) => 5000 * Math.pow(1.4, cityLevel - 1),
    duration: Infinity,
    effect: { fundsFromFundsTiles: 1.25 },
    maxPerCity: 1,
    description: '+25% funds from Funds tiles for entire city',
  },
};

export const getPowerUpCost = (powerUp, cityLevel) => {
  if (!powerUp) return 0;
  if (typeof powerUp.cost === 'function') {
    return Math.round(powerUp.cost(cityLevel));
  }
  return powerUp.cost ?? 0;
};

export const getPowerUpDurationLabel = (duration) => {
  if (duration === Infinity) return 'City';
  if (!duration) return 'Instant';
  return `${duration} roll${duration === 1 ? '' : 's'}`;
};
