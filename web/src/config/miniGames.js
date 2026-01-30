/**
 * Mini-Games Configuration
 *
 * Defines Slot Machine and Wheel of Fortune mini-games
 * triggered when landing on the Card tile.
 */

import { scaleByCity } from './tileTypes';

// --- Slot Machine ---

export const SLOT_SYMBOLS = ['🍒', '🍋', '🔔', '💎', '7️⃣', '⭐'];

export const SLOT_CONFIG = {
  name: 'Slot Machine',
  icon: '🎰',
  color: '#fbbf24',
  spinCost: (cityLevel) => scaleByCity(1000, cityLevel),
  reelCount: 3,
  spinDuration: 2000,
  reelStaggerMs: 500,
  payouts: {
    match2: 2,
    match3: 10,
    jackpot: 100, // Three 💎
  },
  jackpotSymbol: '💎',
  description: 'Match symbols to win! Three 💎 = JACKPOT!',
};

/**
 * Spin the slot machine reels and determine result
 * @param {number} cityLevel - Current city level
 * @returns {Object} { reels: string[], payout: number, type: string, netGain: number }
 */
export const getSlotResult = (cityLevel) => {
  const cost = SLOT_CONFIG.spinCost(cityLevel);
  const reels = Array.from({ length: 3 }, () =>
    SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]
  );

  const [r1, r2, r3] = reels;

  if (r1 === r2 && r2 === r3) {
    if (r1 === SLOT_CONFIG.jackpotSymbol) {
      return {
        reels,
        payout: cost * SLOT_CONFIG.payouts.jackpot,
        netGain: cost * SLOT_CONFIG.payouts.jackpot - cost,
        type: 'jackpot',
      };
    }
    return {
      reels,
      payout: cost * SLOT_CONFIG.payouts.match3,
      netGain: cost * SLOT_CONFIG.payouts.match3 - cost,
      type: 'match3',
    };
  }

  if (r1 === r2 || r2 === r3 || r1 === r3) {
    return {
      reels,
      payout: cost * SLOT_CONFIG.payouts.match2,
      netGain: cost * SLOT_CONFIG.payouts.match2 - cost,
      type: 'match2',
    };
  }

  return {
    reels,
    payout: 0,
    netGain: -cost,
    type: 'lose',
  };
};

// --- Wheel of Fortune ---

export const WHEEL_SEGMENTS = [
  { id: 'funds_1', label: '$5,000', type: 'funds', getValue: (cl) => scaleByCity(5000, cl), color: '#10b981', weight: 1 },
  { id: 'dice_1', label: '10 Dice', type: 'dice', value: 10, color: '#3b82f6', weight: 1 },
  { id: 'funds_2', label: '$5,000', type: 'funds', getValue: (cl) => scaleByCity(5000, cl), color: '#10b981', weight: 1 },
  { id: 'shield_1', label: '2 Shields', type: 'shields', value: 2, color: '#6366f1', weight: 1 },
  { id: 'power_up_1', label: 'Power-Up', type: 'power_up', color: '#f59e0b', weight: 1 },
  { id: 'sticker_1', label: 'Sticker Pack', type: 'sticker_pack', color: '#ec4899', weight: 1 },
  { id: 'funds_3', label: '$5,000', type: 'funds', getValue: (cl) => scaleByCity(5000, cl), color: '#10b981', weight: 1 },
  { id: 'dice_2', label: '10 Dice', type: 'dice', value: 10, color: '#3b82f6', weight: 1 },
  { id: 'shield_2', label: '2 Shields', type: 'shields', value: 2, color: '#6366f1', weight: 1 },
  { id: 'power_up_2', label: 'Power-Up', type: 'power_up', color: '#f59e0b', weight: 1 },
  { id: 'sticker_2', label: 'Sticker Pack', type: 'sticker_pack', color: '#ec4899', weight: 1 },
  { id: 'bankrupt', label: 'BANKRUPT', type: 'bankrupt', color: '#ef4444', weight: 1 },
];

export const WHEEL_CONFIG = {
  name: 'Wheel of Fortune',
  icon: '🎡',
  color: '#8b5cf6',
  segmentCount: WHEEL_SEGMENTS.length,
  spinDuration: 3000,
  description: 'Spin the wheel for a free prize! Once per city.',
};

/**
 * Select a wheel segment using weighted random
 * @returns {Object} Selected segment with index
 */
export const getWheelResult = () => {
  const totalWeight = WHEEL_SEGMENTS.reduce((sum, s) => sum + s.weight, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < WHEEL_SEGMENTS.length; i++) {
    random -= WHEEL_SEGMENTS[i].weight;
    if (random <= 0) {
      return { segment: WHEEL_SEGMENTS[i], index: i };
    }
  }

  return { segment: WHEEL_SEGMENTS[WHEEL_SEGMENTS.length - 1], index: WHEEL_SEGMENTS.length - 1 };
};
