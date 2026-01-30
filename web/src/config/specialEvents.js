/**
 * Special Events Configuration
 *
 * Defines three categories of dynamic gameplay events:
 * 1. City-Wide Events - Rare temporary buffs affecting all gameplay
 * 2. Random Events - Common per-roll effects with immediate impact
 * 3. Milestone Events - Triggered on cumulative achievement thresholds
 */

import { scaleByCity } from './tileTypes';

// --- City-Wide Events ---

export const CITY_WIDE_EVENTS = [
  {
    id: 'golden_hour',
    name: 'Golden Hour',
    icon: '☀️',
    description: 'All rewards doubled for the next 10 rolls!',
    duration: 10,
    effects: { rewardMultiplier: 2.0 },
    color: '#fbbf24',
    particle: 'coins',
    sound: 'achievement',
  },
  {
    id: 'tax_holiday',
    name: 'Tax Holiday',
    icon: '🏖️',
    description: 'No taxes or rent for 5 rolls!',
    duration: 5,
    effects: { blockTax: true, blockRent: true },
    color: '#10b981',
    particle: 'confetti',
    sound: 'achievement',
  },
  {
    id: 'sticker_frenzy',
    name: 'Sticker Frenzy',
    icon: '🎉',
    description: 'Double sticker drops for 15 rolls!',
    duration: 15,
    effects: { stickerMultiplier: 2 },
    color: '#ec4899',
    particle: 'stars',
    sound: 'achievement',
  },
  {
    id: 'jackpot_day',
    name: 'Jackpot Day',
    icon: '🎰',
    description: 'Lottery always wins for 3 rolls!',
    duration: 3,
    effects: { guaranteeLotteryWin: true },
    color: '#f59e0b',
    particle: 'fireworks',
    sound: 'achievement',
  },
];

// --- Random Events ---

export const RANDOM_EVENTS = [
  {
    id: 'bank_error',
    name: 'Bank Error',
    icon: '🏦',
    type: 'positive',
    description: 'A bank error in your favor!',
    effect: {
      type: 'ADD_FUNDS',
      getValue: (cityLevel) => {
        const min = scaleByCity(500, cityLevel);
        const max = scaleByCity(2000, cityLevel);
        return Math.round(min + Math.random() * (max - min));
      },
    },
    weight: 20,
    particle: 'coins',
    sound: 'success',
  },
  {
    id: 'street_performer',
    name: 'Street Performer',
    icon: '🎭',
    type: 'neutral',
    description: 'Entertained by a street performer! Skip a turn but earn tips.',
    effect: {
      type: 'SKIP_AND_GAIN',
      getSkipTurns: () => 1,
      getFundsValue: (cityLevel) => scaleByCity(1000, cityLevel),
    },
    weight: 15,
    particle: 'sparkles',
    sound: 'success',
  },
  {
    id: 'parade',
    name: 'Parade',
    icon: '🎊',
    type: 'positive',
    description: 'A parade carries you forward 5 spaces!',
    effect: {
      type: 'TELEPORT',
      value: 5,
    },
    weight: 15,
    particle: 'confetti',
    sound: 'teleport',
  },
  {
    id: 'construction',
    name: 'Construction',
    icon: '🚧',
    type: 'negative',
    description: 'Road construction blocks upgrades this turn.',
    effect: {
      type: 'BLOCK_UPGRADE',
    },
    weight: 15,
    particle: null,
    sound: 'error',
  },
  {
    id: 'lucky_find',
    name: 'Lucky Find',
    icon: '🍀',
    type: 'positive',
    description: 'You found a random power-up!',
    effect: {
      type: 'GRANT_POWER_UP',
    },
    weight: 10,
    particle: 'stars',
    sound: 'achievement',
  },
  {
    id: 'pickpocket',
    name: 'Pickpocket',
    icon: '🕵️',
    type: 'negative',
    description: 'A pickpocket stole some of your funds!',
    effect: {
      type: 'LOSE_PERCENT_FUNDS',
      percent: 0.10,
      getMaxLoss: (cityLevel) => scaleByCity(1000, cityLevel),
    },
    weight: 25,
    particle: null,
    sound: 'error',
  },
];

// --- Milestone Events ---

export const MILESTONE_EVENTS = {
  ROLLS: {
    id: 'milestone_rolls',
    name: 'Roll Milestone',
    icon: '🎁',
    description: 'Bonus reward chest!',
    interval: 50,
    reward: {
      type: 'CHEST',
      getFunds: (cityLevel) => scaleByCity(3000, cityLevel),
      dice: 5,
      shields: 1,
    },
    particle: 'fireworks',
    sound: 'milestone',
  },
  UPGRADES: {
    id: 'milestone_upgrades',
    name: 'Builder Milestone',
    icon: '🏗️',
    description: 'Special sticker pack earned!',
    interval: 10,
    reward: {
      type: 'STICKER_PACK',
      packs: 1,
    },
    particle: 'confetti',
    sound: 'milestone',
  },
};

// --- Trigger Constants ---

export const EVENT_TRIGGER = {
  CITY_WIDE_CHANCE: 0.03,
  CITY_WIDE_COOLDOWN: 20,
  RANDOM_EVENT_CHANCE: 0.05,
};

// --- Selection Functions ---

/**
 * Select a random city-wide event
 * @returns {Object} Selected city-wide event
 */
export const selectCityWideEvent = () => {
  const index = Math.floor(Math.random() * CITY_WIDE_EVENTS.length);
  return CITY_WIDE_EVENTS[index];
};

/**
 * Select a random event from the weighted pool
 * @returns {Object} Selected random event
 */
export const selectRandomEvent = () => {
  const totalWeight = RANDOM_EVENTS.reduce((sum, e) => sum + e.weight, 0);
  let random = Math.random() * totalWeight;

  for (const event of RANDOM_EVENTS) {
    random -= event.weight;
    if (random <= 0) return event;
  }

  return RANDOM_EVENTS[RANDOM_EVENTS.length - 1];
};

/**
 * Check which milestone events should trigger
 * @param {number} totalRolls - Current total rolls
 * @param {number} totalUpgrades - Current total upgrades
 * @param {number} lastMilestoneRolls - Last milestone-claimed roll count
 * @param {number} lastMilestoneUpgrades - Last milestone-claimed upgrade count
 * @returns {Object[]} Array of milestone events to trigger
 */
export const checkMilestoneEvents = (totalRolls, totalUpgrades, lastMilestoneRolls, lastMilestoneUpgrades) => {
  const triggered = [];

  const rollInterval = MILESTONE_EVENTS.ROLLS.interval;
  if (totalRolls > 0 && Math.floor(totalRolls / rollInterval) > Math.floor(lastMilestoneRolls / rollInterval)) {
    triggered.push(MILESTONE_EVENTS.ROLLS);
  }

  const upgradeInterval = MILESTONE_EVENTS.UPGRADES.interval;
  if (totalUpgrades > 0 && Math.floor(totalUpgrades / upgradeInterval) > Math.floor(lastMilestoneUpgrades / upgradeInterval)) {
    triggered.push(MILESTONE_EVENTS.UPGRADES);
  }

  return triggered;
};
