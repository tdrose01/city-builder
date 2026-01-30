/**
 * Social Configuration & Mock Data
 * Defines structure for friend system and leaderboard generation.
 */

// Possible avatars (emojis for now, could be image URLs later)
const AVATARS = ['🐶', '🐱', '🦊', '🦁', '🐼', '🐨', '🐸', '🐙', '🦄', '🤖', '👽', '👻'];

const NAMES = [
  'CityPlanner', 'DiceKing', 'LuckyRoller', 'UrbanArchitect', 'TycoonTom',
  'MoneyMaker', 'BoardBoss', 'TokenTrader', 'CryptoCity', 'PixelPioneer',
  'SkyHigh', 'MetroMaster', 'GridGuru', 'BlockBuilder', 'StreetSmarts'
];

/**
 * Generates a list of mock friends with random stats around the player's level
 * @param {number} playerLevel - Current city level of the player
 * @param {number} count - Number of friends to generate
 * @returns {Array} List of friend objects
 */
export const generateMockFriends = (playerLevel = 1, count = 5) => {
  const friends = [];
  
  for (let i = 0; i < count; i++) {
    // Randomize level slightly around player
    const levelOffset = Math.floor(Math.random() * 5) - 2; // -2 to +2
    const level = Math.max(1, playerLevel + levelOffset);
    
    // Calculate net worth based on level (exponential scaling approximation)
    const baseWorth = 10000;
    const worthMultiplier = Math.pow(1.4, level - 1);
    const netWorth = Math.floor(baseWorth * worthMultiplier * (0.8 + Math.random() * 0.4));

    friends.push({
      id: `friend_${Date.now()}_${i}`,
      name: NAMES[Math.floor(Math.random() * NAMES.length)],
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      level,
      netWorth,
      lastActive: Date.now() - Math.floor(Math.random() * 86400000), // Within last 24h
      giftSent: false,
      giftReceived: Math.random() > 0.5, // 50% chance they sent you a gift
      isPlayer: false
    });
  }
  
  // Sort by net worth descending
  return friends.sort((a, b) => b.netWorth - a.netWorth);
};

export const SOCIAL_CONFIG = {
  GIFT_DICE_AMOUNT: 5,
  MAX_DAILY_GIFTS_RECEIVED: 5,
  FRIEND_COUNT: 8
};
