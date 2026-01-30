/**
 * Game Balance Configuration
 * Centralized tunable parameters for gameplay pacing and economy.
 */

export const INITIAL_STATE = {
  FUNDS: 7500,
  DICE: 50,
  SHIELDS: 1,
  CITY_LEVEL: 1,
  PRESTIGE_LEVEL: 0
};

export const PACING = {
  POINTS_PER_ROLL: 15,
  DOUBLES_BONUS_MULTIPLIER: 0.50, // Rolls * multiplier = extra dice
  ROLL_DELAY: 500, // ms between rolls in autoroll
  MOVE_DELAY_NORMAL: 250, // ms per tile walk
  MOVE_DELAY_FAST: 150, // ms per tile walk for large rolls (>8)
};

export const ECONOMY = {
  START_TILE_PAYOUT_BASE: 2000,
  CITY_MULTIPLIER: 1.4, // Payouts and costs scale by this per city level
  MILESTONE_THRESHOLDS: [15, 30, 50, 75, 100],
  MAX_SHIELDS: 8,
  DICE_TILE_PAYOUT_BASE: 4,
};

export const PRESTIGE = {
  MULTIPLIER_PER_LEVEL: 0.5,
  MAX_MULTIPLIER: 3.0,
  MIN_POINTS_REQUIRED: 120
};

export const GLOBAL_PRESTIGE = {
  MULTIPLIER_PER_LEVEL: 0.5, // +50% per level
  REQUIRED_CITY_LEVEL: 5
};

/**
 * Calculates scaled reward based on prestige level
 * @param {number} baseAmount 
 * @param {number} prestigeLevel 
 * @returns {number}
 */
export const getScaledReward = (baseAmount, prestigeLevel) => {
  const multiplier = Math.min(PRESTIGE.MAX_MULTIPLIER, 1.0 + (prestigeLevel * PRESTIGE.MULTIPLIER_PER_LEVEL));
  return Math.floor(baseAmount * multiplier);
};

/**
 * Calculates global prestige multiplier
 * @param {number} globalPrestigeLevel 
 * @returns {number} Multiplier (e.g., 1.5 for level 1)
 */
export const getGlobalPrestigeMultiplier = (globalPrestigeLevel) => {
  return 1.0 + (globalPrestigeLevel * GLOBAL_PRESTIGE.MULTIPLIER_PER_LEVEL);
};
