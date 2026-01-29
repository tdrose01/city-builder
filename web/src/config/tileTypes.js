/**
 * Tile Type Configurations
 * 
 * Defines all tile types in City Slacker, including gameplay mechanics,
 * visual properties, and economic scaling by city level.
 * 
 * New Tile Types (Phase 8):
 * - Lottery: Chance-based gambling tile
 * - Tax: Percentage-based funds deduction
 * - Jail: Turn-skipping penalty tile
 * - Fortune: Random event generator
 */

/**
 * Calculate scaled value based on city level
 * @param {number} baseValue - Base value at City 1
 * @param {number} cityLevel - Current city level (1-5)
 * @returns {number} Scaled value
 */
export const scaleByCity = (baseValue, cityLevel) => {
  return Math.round(baseValue * Math.pow(1.4, cityLevel - 1));
};

/**
 * Lottery Tile Configuration
 * 
 * A gambling tile where players purchase lottery tickets with a chance to win.
 * Odds and payouts are fixed, but ticket cost scales with city level.
 */
export const LOTTERY_CONFIG = {
  name: 'Lottery',
  icon: '🎰',
  color: '#fbbf24', // Gold
  
  // Economic scaling
  ticketCost: (cityLevel) => scaleByCity(500, cityLevel),
  
  // Win probabilities
  smallWinChance: 0.20,      // 20% chance for small win
  smallWinMultiplier: 10,    // 10x ticket cost
  jackpotChance: 0.05,       // 5% chance for jackpot
  jackpotMultiplier: 100,    // 100x ticket cost
  loseChance: 0.75,          // 75% chance to lose (100% - 20% - 5%)
  
  description: 'Try your luck! Buy a ticket for a chance to win big.',
  
  // Animation timing
  scratchDuration: 2000,  // ms
};

/**
 * Tax Tile Configuration
 * 
 * Players must pay a percentage of their current funds as tax.
 * Has min/max bounds to keep it fair at all stages of the game.
 */
export const TAX_CONFIG = {
  name: 'Tax',
  icon: '💸',
  color: '#ef4444', // Red
  
  // Tax calculation
  taxRate: 0.10,  // 10% of current funds
  minTax: 100,
  maxTax: (cityLevel) => scaleByCity(5000, cityLevel),
  
  // Can be blocked by Tax Haven power-up
  blockableByPowerUp: 'tax_haven',
  
  description: 'Pay 10% of your funds in taxes (min $100, max varies by city)',
};

/**
 * Jail Tile Configuration
 * 
 * Players are sent to jail and must either:
 * - Pay bail
 * - Roll doubles to escape
 * - Use a "Get Out of Jail Free" card
 */
export const JAIL_CONFIG = {
  name: 'Jail',
  icon: '🔒',
  color: '#6b7280', // Gray
  
  // Penalty
  turnsToSkip: 3,  // Base turns skipped if not escaped
  
  // Escape options
  bailCost: (cityLevel) => scaleByCity(1000, cityLevel),
  doublesEscapeChance: 1.0,  // 100% escape if roll doubles
  cardEscape: true,          // Can use Get Out of Jail Free card
  
  // Each turn in jail, player can attempt to roll doubles
  rollsAllowedInJail: 3,
  
  description: 'Caught! Pay bail, roll doubles, or use a card to escape.',
};

/**
 * Fortune Tile Configuration
 * 
 * Triggers a random event from a weighted pool.
 * Events are categorized as positive, neutral, or negative.
 */
export const FORTUNE_CONFIG = {
  name: 'Fortune',
  icon: '🔮',
  color: '#a855f7', // Purple
  
  description: 'A twist of fate! Random events await...',
  
  /**
   * Event pool with weighted probabilities
   * Total weight: 100
   * - Positive events: 60 weight (60%)
   * - Neutral events: 30 weight (30%)
   * - Negative events: 10 weight (10%)
   */
  events: [
    // POSITIVE EVENTS (60 total weight)
    {
      id: 'bonus_funds_large',
      type: 'positive',
      name: 'Lucky Find!',
      description: 'You found a briefcase full of cash!',
      weight: 18,
      effect: {
        type: 'ADD_FUNDS',
        getValue: (cityLevel) => scaleByCity(2000, cityLevel),
      },
      particle: 'coins',
      sound: 'success',
    },
    {
      id: 'bonus_funds_small',
      type: 'positive',
      name: 'Street Tip',
      description: 'A friendly local gave you some cash.',
      weight: 14,
      effect: {
        type: 'ADD_FUNDS',
        getValue: (cityLevel) => scaleByCity(1000, cityLevel),
      },
      particle: 'sparkles',
      sound: 'success',
    },
    {
      id: 'free_dice',
      type: 'positive',
      name: 'Dice Delivery',
      description: 'A delivery truck dropped dice!',
      weight: 12,
      effect: {
        type: 'ADD_DICE',
        value: 5,
      },
      particle: 'stars',
      sound: 'success',
    },
    {
      id: 'shield_bonus',
      type: 'positive',
      name: 'Protection Charm',
      description: 'You found protective shields!',
      weight: 8,
      effect: {
        type: 'ADD_SHIELDS',
        value: 2,
      },
      particle: 'burst',
      sound: 'success',
    },
    {
      id: 'tax_haven',
      type: 'positive',
      name: 'Tax Haven',
      description: 'Your next tax payment is waived.',
      weight: 4,
      effect: {
        type: 'ACTIVATE_TAX_HAVEN',
      },
      particle: 'sparkles',
      sound: 'success',
    },
    {
      id: 'jail_free_card',
      type: 'positive',
      name: 'Get Out of Jail Free',
      description: 'Keep this card for your next jail visit.',
      weight: 4,
      effect: {
        type: 'ADD_JAIL_FREE_CARD',
      },
      particle: 'stars',
      sound: 'achievement',
    },
    
    // NEUTRAL EVENTS (30 total weight)
    {
      id: 'teleport_forward',
      type: 'neutral',
      name: 'Wormhole',
      description: 'Teleported forward 5 spaces!',
      weight: 10,
      effect: {
        type: 'TELEPORT',
        value: 5,
      },
      particle: 'sparkles',
      sound: 'teleport',
    },
    {
      id: 'teleport_backward',
      type: 'neutral',
      name: 'Time Warp',
      description: 'Warped backward 3 spaces.',
      weight: 8,
      effect: {
        type: 'TELEPORT',
        value: -3,
      },
      particle: 'sparkles',
      sound: 'teleport',
    },
    {
      id: 'swap_position',
      type: 'neutral',
      name: 'Dimension Shift',
      description: 'Swapped to a random tile!',
      weight: 7,
      effect: {
        type: 'RANDOM_TELEPORT',
      },
      particle: 'burst',
      sound: 'teleport',
    },
    {
      id: 'nothing',
      type: 'neutral',
      name: 'False Alarm',
      description: 'Nothing happened...',
      weight: 5,
      effect: {
        type: 'NONE',
      },
      particle: null,
      sound: null,
    },
    
    // NEGATIVE EVENTS (10 total weight)
    {
      id: 'lose_funds',
      type: 'negative',
      name: 'Pickpocket!',
      description: 'Someone stole your money!',
      weight: 5,
      effect: {
        type: 'LOSE_FUNDS',
        getValue: (cityLevel) => scaleByCity(1000, cityLevel),
        minimum: 0,  // Can't go below $0
      },
      particle: null,
      sound: 'error',
    },
    {
      id: 'skip_turn',
      type: 'negative',
      name: 'Stuck in Traffic',
      description: 'Skip your next turn.',
      weight: 5,
      effect: {
        type: 'SKIP_TURNS',
        value: 1,
      },
      particle: null,
      sound: 'error',
    },
  ],
  
  // Animation timing
  revealDuration: 1500,  // ms
};

/**
 * Get all tile type configurations
 * @returns {Object} All tile configs
 */
export const TILE_TYPES = {
  LOTTERY: LOTTERY_CONFIG,
  TAX: TAX_CONFIG,
  JAIL: JAIL_CONFIG,
  FORTUNE: FORTUNE_CONFIG,
};

/**
 * Select a random Fortune event based on weighted probabilities
 * @returns {Object} Selected event
 */
export const selectFortuneEvent = () => {
  const events = FORTUNE_CONFIG.events;
  const totalWeight = events.reduce((sum, event) => sum + event.weight, 0);
  
  let random = Math.random() * totalWeight;
  
  for (const event of events) {
    random -= event.weight;
    if (random <= 0) {
      return event;
    }
  }
  
  // Fallback (should never reach here)
  return events[events.length - 1];
};

export default TILE_TYPES;
