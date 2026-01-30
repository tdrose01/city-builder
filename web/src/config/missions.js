export const DAILY_MISSIONS = [
  { id: 'd1', description: "Roll the dice 10 times", target: 10, type: 'rolls', reward: { type: 'dice', amount: 5 } },
  { id: 'd2', description: "Upgrade a landmark", target: 1, type: 'upgrades', reward: { type: 'funds', amount: 1500 } },
  { id: 'd3', description: "Collect 5 shields", target: 5, type: 'shields', reward: { type: 'shields', amount: 2 } },
  { id: 'd4', description: "Land on a Funds tile 3 times", target: 3, type: 'fundsTiles', reward: { type: 'funds', amount: 2000 } },
];

export const WEEKLY_MISSIONS = [
  { id: 'w1', description: "Roll the dice 500 times", target: 500, type: 'rolls', reward: { type: 'dice', amount: 100 } },
  { id: 'w2', description: "Upgrade landmarks 50 times", target: 50, type: 'upgrades', reward: { type: 'funds', amount: 50000 } },
  { id: 'w3', description: "Complete 10 Daily Cycles", target: 10, type: 'dailyCycles', reward: { type: 'sticker_pack', amount: 1 } },
];

export const MONTHLY_MISSIONS = [
  { id: 'm1', description: "Roll the dice 2000 times", target: 2000, type: 'rolls', reward: { type: 'dice', amount: 500 } },
  { id: 'm2', description: "Earn 1000 Shields", target: 1000, type: 'shields', reward: { type: 'shields', amount: 50 } },
  { id: 'm3', description: "Complete 50 Daily Cycles", target: 50, type: 'dailyCycles', reward: { type: 'sticker_pack', amount: 5 } },
];
