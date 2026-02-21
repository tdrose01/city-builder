// web/src/data/missions/missionData.ts
import { Mission } from './missionTypes';

export const MISSION_POOL: Mission[] = [
  // Rolls
  { id: 'm-roll-1', type: 'roll', description: 'Roll the dice 20 times', target: 20, reward: { type: 'dice', amount: 15 } },
  { id: 'm-roll-2', type: 'roll', description: 'Roll the dice 50 times', target: 50, reward: { type: 'dice', amount: 40 } },
  
  // Earnings
  { id: 'm-earn-1', type: 'earn', description: 'Earn $10,000 total', target: 10000, reward: { type: 'xp', amount: 100 } },
  { id: 'm-earn-2', type: 'earn', description: 'Earn $50,000 total', target: 50000, reward: { type: 'xp', amount: 250 } },
  
  // Upgrades
  { id: 'm-build-1', type: 'upgrade', description: 'Upgrade 3 Landmarks', target: 3, reward: { type: 'funds', amount: 15000 } },
  
  // Board Tiles
  { id: 'm-funds-1', type: 'funds_tile', description: 'Land on 5 Funds tiles', target: 5, reward: { type: 'dice', amount: 10 } },
  { id: 'm-heist-1', type: 'heist', description: 'Attempt 2 Heists', target: 2, reward: { type: 'sticker_pack', packType: 'green' } },
  { id: 'm-shutdown-1', type: 'shutdown', description: 'Execute 2 Shutdowns', target: 2, reward: { type: 'sticker_pack', packType: 'green' } },
  
  // Social
  { id: 'm-social-1', type: 'sticker_send', description: 'Send 2 Stickers to friends', target: 2, reward: { type: 'xp', amount: 150 } },
  
  // Combo
  { id: 'm-combo-1', type: 'combo', description: 'Reach a 5x Roll Combo', target: 5, reward: { type: 'dice', amount: 20 } }
];

export const getRandomMissions = (count: number = 3): Mission[] => {
  const shuffled = [...MISSION_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
