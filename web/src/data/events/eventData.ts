// web/src/data/events/eventData.ts
import { GameEvent } from './eventModel';
import { CommunityEvent } from './communityEventModel';

const now = new Date();
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

export const FLASH_GOLD_RUSH: GameEvent = {
  id: 'flash-gold-rush-001',
  type: 'flash',
  name: 'Gold Rush',
  description: 'Income is doubled for all players!',
  shortDescription: '2x INCOME ACTIVE',
  icon: '💰',
  seasonId: 'solar-surge-2025',
  startDate: now.toISOString(),
  endDate: oneHourLater.toISOString(),
  lifecycle: 'active',
  mechanics: {
    type: 'bonus_multiplier',
    multiplier: { target: 'income', value: 2.0 }
  },
  rewards: [],
  milestoneRewards: [],
  modifiers: [{ type: 'income_multiplier', value: 2.0, description: 'Flash Event: 2x Income' }],
  missionIds: [],
  shopItems: [
    {
      id: 'shop-gold-dice',
      cost: { currencyId: 'sunshards', amount: 50 },
      stock: 5,
      purchased: 0,
      availableFrom: null,
      availableUntil: null,
      reward: {
        id: 'rew-gold-dice',
        type: 'currency',
        name: 'Flash Dice Pack',
        description: '25 Bonus Dice',
        icon: '🎲',
        rarity: 'rare',
        payload: { currencyType: 'dice', currencyAmount: 25 },
        claimed: false, claimedAt: null, exclusive: false, seasonId: 'solar-surge-2025'
      }
    }
  ],
  bannerImage: null,
  vfxType: 'confetti',
  tileOverrides: []
};

export const HALLOWEEN_COLLECTION: GameEvent = {
  id: 'halloween-collection-2025',
  type: 'limited_time',
  name: 'Halloween Candy Hunt',
  description: 'Collect Spooky Candy from Funds tiles!',
  shortDescription: 'CANDY HUNT ACTIVE',
  icon: '🎃',
  seasonId: 'solar-surge-2025',
  startDate: now.toISOString(),
  endDate: oneWeekLater.toISOString(),
  lifecycle: 'active',
  mechanics: {
    type: 'collection',
    collectibles: {
      items: [{ id: 'candy-01', name: 'Spooky Candy', icon: '🍬', rarity: 'common' }],
      collected: { 'candy-01': 0 },
      goal: { 'candy-01': 20 }
    }
  },
  rewards: [],
  milestoneRewards: [
    {
      threshold: 10,
      reached: false,
      reward: {
        id: 'reward-candy-1',
        type: 'currency',
        name: 'Sweet Bonus',
        description: '10,000 Funds',
        icon: '💰',
        rarity: 'uncommon',
        payload: { currencyType: 'funds', currencyAmount: 10000 },
        claimed: false, claimedAt: null, exclusive: false, seasonId: 'solar-surge-2025'
      }
    }
  ],
  modifiers: [],
  missionIds: [],
  shopItems: [
    {
      id: 'shop-spooky-funds',
      cost: { currencyId: 'candycorn', amount: 5 },
      stock: 10,
      purchased: 0,
      availableFrom: null,
      availableUntil: null,
      reward: {
        id: 'rew-spooky-funds',
        type: 'currency',
        name: 'Grave Robbers Plunder',
        description: '5,000 Funds',
        icon: '💰',
        rarity: 'common',
        payload: { currencyType: 'funds', currencyAmount: 5000 },
        claimed: false, claimedAt: null, exclusive: false, seasonId: 'solar-surge-2025'
      }
    }
  ],
  bannerImage: null,
  vfxType: 'spooky',
  tileOverrides: [{ tileType: 'Funds', skin: 'spooky-funds', label: 'CANDY TILE' }]
};

export const COMMUNITY_RESTORATION: CommunityEvent = {
  id: 'community-restoration-2025',
  name: 'Landmark Restoration',
  description: 'Raise 50 Billion Funds to restore the Ancient Archive!',
  icon: '🏛️',
  seasonId: 'solar-surge-2025',
  startDate: now.toISOString(),
  endDate: oneWeekLater.toISOString(),
  lifecycle: 'active',
  globalGoal: {
    metric: 'total_funds_earned',
    targetValue: 50000000000,
    currentValue: 12500000000,
    milestones: [
      {
        threshold: 15000000000,
        reached: false,
        reachedAt: null,
        reward: {
          id: 'comm-milestone-1',
          type: 'currency',
          name: 'Global Bonus: Dice',
          description: 'Everyone gets 30 Dice!',
          icon: '🎲',
          rarity: 'uncommon',
          payload: { currencyType: 'dice', currencyAmount: 30 },
          claimed: false, claimedAt: null, exclusive: false, seasonId: 'solar-surge-2025'
        }
      }
    ]
  },
  playerContribution: 0,
  contributionRewards: [
    {
      minContribution: 100000,
      claimed: false,
      reward: {
        id: 'player-tier-1',
        type: 'title',
        name: 'Restorer Badge',
        description: 'Exclusive "Restorer" Title',
        icon: '🎖️',
        rarity: 'rare',
        payload: { titleText: 'Restorer' },
        claimed: false, claimedAt: null, exclusive: true, seasonId: 'solar-surge-2025'
      }
    }
  ],
  bannerImage: null,
  progressBarColor: '#fbbf24'
};
