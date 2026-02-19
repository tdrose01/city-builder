/**
 * Phase 12: Events & Seasons — Seed Data
 * Sample seasons, events, and rewards for development
 * DECISIONS APPLIED:
 * - Season Pass: $2.99 Generous tier (Decision #2)
 * - First Event: Cooperative shared monument (Decision #3)
 */
import type { Season } from './seasonModel';
import type { GameEvent } from './eventModel';
import type { CommunityEvent } from './communityEventModel';
import type { EventReward } from './rewardModel';
import type { EventCalendarState } from './calendarModel';

// Currency config for Winter 2025
const WINTER_CURRENCY_ID = 'snowflakes';
export const CURRENCY_CONFIG = {
  [WINTER_CURRENCY_ID]: {
    id: WINTER_CURRENCY_ID,
    name: 'Snowflakes',
    icon: '❄️',
  },
};

const createReward = (overrides: Partial<EventReward> & Pick<EventReward, 'id' | 'type' | 'name'>): EventReward => ({
  description: '',
  icon: '🎁',
  rarity: 'common',
  payload: {},
  claimed: false,
  claimedAt: null,
  exclusive: false,
  seasonId: null,
  ...overrides,
});

const createMilestoneReward = (overrides: Partial<EventReward> & Pick<EventReward, 'id' | 'type' | 'name'>): EventReward =>
  createReward({ rarity: 'uncommon', ...overrides });

// Sample Season Pass Rewards
const WINTER_PASS_REWARDS: Record<string, EventReward> = {
  freeL1: createReward({
    id: 'winter-2025-free-1', type: 'currency', name: 'Starter Funds',
    description: '500 Funds to get you started', icon: '💰', rarity: 'common',
    payload: { currencyType: 'funds', currencyAmount: 500 },
  }),
  freeL5: createReward({
    id: 'winter-2025-free-5', type: 'sticker', name: 'Snowflake Sticker',
    description: 'Winter themed sticker', icon: '❄️', rarity: 'uncommon',
    payload: { stickerId: 'winter-snowflake' },
  }),
  freeL10: createReward({
    id: 'winter-2025-free-10', type: 'decoration', name: 'Ice Sculpture',
    description: 'Decorate your city with ice', icon: '🧊', rarity: 'rare',
    payload: { decorationId: 'winter-ice-sculpture' },
  }),
  freeL15: createReward({
    id: 'winter-2025-free-15', type: 'currency', name: 'Dice Pack',
    description: '3 bonus dice', icon: '🎲', rarity: 'uncommon',
    payload: { currencyType: 'dice', currencyAmount: 3 },
  }),
  freeL20: createReward({
    id: 'winter-2025-free-20', type: 'title', name: 'Snow Dabbler',
    description: 'Limited title for winter participants', icon: '👤', rarity: 'uncommon',
    payload: { titleText: 'Snow Dabbler' },
  }),
  freeL30: createReward({
    id: 'winter-2025-free-30', type: 'building', name: 'Cozy Cabin',
    description: 'A warm winter retreat', icon: '🏠', rarity: 'epic',
    payload: { buildingId: 'winter-cozy-cabin' },
  }),
  premiumL1: createReward({
    id: 'winter-2025-premium-1', type: 'currency', name: 'Premium Starter Pack',
    description: '2000 Funds + 5 Dice (Value: $2.99)', icon: '💎', rarity: 'rare',
    payload: { currencyType: 'funds', currencyAmount: 2000 },
  }),
  premiumL3: createReward({
    id: 'winter-2025-premium-3', type: 'power_up', name: 'Frozen Multiplier',
    description: '2x income for 2 hours', icon: '⚡', rarity: 'rare',
    payload: { powerUpId: 'income-boost', powerUpCount: 1, multiplierValue: 2, multiplierDuration: 2 },
  }),
  premiumL5: createReward({
    id: 'winter-2025-premium-5', type: 'tile_skin', name: 'Frosted Tiles',
    description: 'Winter-themed tile appearance', icon: '🔷', rarity: 'epic',
    payload: { tileSkinId: 'winter-frosted' },
  }),
  premiumL10: createReward({
    id: 'winter-2025-premium-10', type: 'currency', name: 'Event Currency Bonus',
    description: `500 ${CURRENCY_CONFIG[WINTER_CURRENCY_ID].name}`, icon: CURRENCY_CONFIG[WINTER_CURRENCY_ID].icon, rarity: 'rare',
    payload: { currencyType: 'event', currencyAmount: 500 },
  }),
  premiumL15: createReward({
    id: 'winter-2025-premium-15', type: 'decoration', name: 'Northern Lights',
    description: 'Atmospheric city decoration', icon: '🌌', rarity: 'legendary',
    payload: { decorationId: 'winter-northern-lights' },
  }),
  premiumL20: createReward({
    id: 'winter-2025-premium-20', type: 'city_theme', name: 'Winter Wonderland Theme',
    description: 'Full city theme override', icon: '🏔️', rarity: 'legendary',
    payload: { themeId: 'winter-wonderland' },
  }),
  premiumL30: createReward({
    id: 'winter-2025-premium-30', type: 'building', name: 'Ice Palace',
    description: 'Exclusive legendary landmark', icon: '🏰', rarity: 'legendary',
    payload: { buildingId: 'winter-ice-palace' }, exclusive: true,
  }),
};

const buildPassLevels = () => {
  const levels = [];
  for (let i = 1; i <= 30; i++) {
    const xpRequired = i * 100;
    const freeReward = i % 5 === 0 ? (WINTER_PASS_REWARDS[`freeL${i}`] ?? null) : null;
    const premiumReward = WINTER_PASS_REWARDS[`premiumL${i}`] ?? null;
    levels.push({ level: i, xpRequired, freeReward, premiumReward, claimed: { free: false, premium: false } });
  }
  return levels;
};

export const SEED_SEASON_WINTER_2025: Season = {
  id: '2025-winter', seasonId: 'winter', name: 'Frost & Fortune',
  description: 'A cozy winter season with exclusive rewards. Build the Community Monument together!',
  startDate: '2025-12-01T00:00:00Z', endDate: '2026-02-28T23:59:59Z', lifecycle: 'upcoming',
  theme: {
    skyboxGradient: ['#1a1a2e', '#16213e'], ambientColor: '#e8f4f8', particleType: 'snow',
    tileOverlayTexture: '/assets/tiles/winter-overlay.png', boardTint: '#d4e5ed',
    uiAccentColor: '#00d4ff', musicTrackId: 'winter-ambient',
  },
  currencyId: WINTER_CURRENCY_ID, currencyEarned: 0, currencySpent: 0,
  pass: { tier: 'free', currentXP: 0, levels: buildPassLevels(), maxLevel: 30 },
  eventIds: ['winter-daily-challenges-2025', 'cozy-collection-2025'],
  communityEventIds: ['community-monument-winter-2025'],
};

export const SEED_EVENT_DAILY_CHALLENGES: GameEvent = {
  id: 'winter-daily-challenges-2025', type: 'seasonal', name: 'Daily Winter Challenges',
  description: 'Complete daily tasks to earn Snowflakes and bonus rewards',
  shortDescription: 'Daily tasks for Snowflakes', icon: '📋', seasonId: '2025-winter',
  startDate: '2025-12-01T00:00:00Z', endDate: '2026-02-28T23:59:59Z', lifecycle: 'upcoming',
  mechanics: { type: 'challenge' }, rewards: [], milestoneRewards: [],
  modifiers: [{ type: 'xp_multiplier', value: 1.5, description: '50% bonus XP during Winter 2025' }],
};

export const SEED_EVENT_COZY_COLLECTION: GameEvent = {
  id: 'cozy-collection-2025', type: 'seasonal', name: 'Cozy Collection',
  description: 'Collect warm items scattered across the board',
  shortDescription: 'Find cozy items for rewards', icon: '🧣', seasonId: '2025-winter',
  startDate: '2025-12-15T00:00:00Z', endDate: '2026-01-15T23:59:59Z', lifecycle: 'upcoming',
  mechanics: { type: 'collection' }, rewards: [], milestoneRewards: [], modifiers: [],
};

export const SEED_COMMUNITY_EVENT_MONUMENT: CommunityEvent = {
  id: 'community-monument-winter-2025', name: 'Crystal Spire Monument',
  description: 'Join all players to build the Crystal Spire! Everyone contributes, everyone wins milestone rewards.',
  icon: '💎', seasonId: '2025-winter',
  startDate: '2025-12-20T00:00:00Z', endDate: '2026-01-31T23:59:59Z', lifecycle: 'upcoming',
  globalGoal: {
    metric: 'total_funds_earned', targetValue: 1000000000000, currentValue: 0,
    milestones: [
      { threshold: 100000000000, reward: createMilestoneReward({
        id: 'monument-r1', type: 'currency', name: 'Community Funds',
        description: '10,000 bonus funds', icon: '💰', payload: { currencyType: 'funds', currencyAmount: 10000 }
      }), reached: false, reachedAt: null },
      { threshold: 250000000000, reward: createMilestoneReward({
        id: 'monument-r2', type: 'decoration', name: 'Crystal Fragment',
        description: 'Monument piece decoration', icon: '💎', rarity: 'rare', payload: { decorationId: 'crystal-fragment-1' } }), reached: false, reachedAt: null },
      { threshold: 500000000000, reward: createMilestoneReward({
        id: 'monument-r3', type: 'sticker', name: 'Crystal Spire Badge',
        description: 'Limited community event badge', icon: '🏅', rarity: 'epic',
        payload: { stickerId: 'crystal-spire-badge' } }), reached: false, reachedAt: null },
      { threshold: 750000000000, reward: createMilestoneReward({
        id: 'monument-r4', type: 'title', name: 'Monument Builder',
        description: 'Title for monument contributors', icon: '🏗️', rarity: 'legendary',
        payload: { titleText: 'Monument Builder' } }), reached: false, reachedAt: null },
      { threshold: 1000000000000, reward: createMilestoneReward({
        id: 'monument-r5', type: 'building', name: 'Crystal Spire',
        description: 'Legendary cooperative monument building', icon: '🏰', rarity: 'legendary',
        payload: { buildingId: 'crystal-spire-landmark' } }), reached: false, reachedAt: null },
    ],
  },
  playerContribution: 0,
  contributionRewards: [
    { minContribution: 1000, reward: createMilestoneReward({
      id: 'contrib-r1', type: 'currency', name: 'Contributor Bonus',
      description: '1,000 funds for contributing', icon: '💰', payload: { currencyType: 'funds', currencyAmount: 1000 }
    }), claimed: false },
    { minContribution: 10000, reward: createMilestoneReward({
      id: 'contrib-r2', type: 'sticker', name: 'Contributor Badge',
      description: 'Badge for active contributors', icon: '🌟', rarity: 'rare',
      payload: { stickerId: 'contributor-badge' } }), claimed: false },
  ],
  bannerImage: '/assets/events/crystal-spire-banner.png', progressBarColor: '#00d4ff',
};

// Export all seed data
export const SEED_DATA = {
  season: SEED_SEASON_WINTER_2025,
  events: [SEED_EVENT_DAILY_CHALLENGES, SEED_EVENT_COZY_COLLECTION],
  communityEvent: SEED_COMMUNITY_EVENT_MONUMENT,
};
