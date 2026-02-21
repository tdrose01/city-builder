import { Season, SeasonPassLevel } from './seasonModel';
import { SeasonId } from './eventTypes';

const generateSolarSurgeLevels = (): SeasonPassLevel[] => {
  const levels: SeasonPassLevel[] = [];
  
  for (let i = 1; i <= 20; i++) {
    levels.push({
      level: i,
      xpRequired: i * 1000, // Linear progression for now
      freeReward: i % 2 === 0 ? {
        id: `ss-free-${i}`,
        type: i % 4 === 0 ? 'building' : 'currency',
        name: i % 4 === 0 ? 'Solar Panel' : 'Bonus Funds',
        description: 'Harvest the sun!',
        icon: i % 4 === 0 ? '☀️' : '💰',
        rarity: i > 15 ? 'rare' : 'common',
        payload: i % 4 === 0 ? { buildingId: 'solar_panel_1' } : { currencyType: 'funds', currencyAmount: 500 * i },
        claimed: false,
        claimedAt: null,
        exclusive: false,
        seasonId: '2025-summer'
      } : null,
      premiumReward: {
        id: `ss-prem-${i}`,
        type: i % 5 === 0 ? 'building' : 'currency',
        name: i % 5 === 0 ? 'Sun Temple' : 'Bonus Dice',
        description: 'Premium solar power!',
        icon: i % 5 === 0 ? '⛩️' : '🎲',
        rarity: i > 10 ? 'epic' : 'uncommon',
        payload: i % 5 === 0 ? { buildingId: 'sun_temple_v1' } : { currencyType: 'dice', currencyAmount: 10 + i },
        claimed: false,
        claimedAt: null,
        exclusive: true,
        seasonId: '2025-summer'
      },
      claimed: {
        free: false,
        premium: false
      }
    });
  }
  
  return levels;
};

export const INITIAL_SEASON: Season = {
  id: '2025-summer',
  seasonId: 'summer' as SeasonId,
  name: 'Solar Surge 2025',
  description: 'Harness the heat of the summer to build the ultimate sun-powered city!',
  startDate: '2025-06-01T00:00:00Z',
  endDate: '2025-08-31T23:59:59Z',
  lifecycle: 'active',
  theme: {
    skyboxGradient: ['#ff9e22', '#ff4500'],
    ambientColor: '#ffe4b5',
    particleType: 'fireflies',
    tileOverlayTexture: null,
    boardTint: '#ffdb58',
    uiAccentColor: '#ff8c00',
    musicTrackId: 'summer_groove'
  },
  currencyId: 'sunshards',
  currencyEarned: 0,
  currencySpent: 0,
  pass: {
    tier: 'free',
    currentXP: 0,
    levels: generateSolarSurgeLevels(),
    maxLevel: 20
  },
  eventIds: [],
  communityEventIds: []
};
