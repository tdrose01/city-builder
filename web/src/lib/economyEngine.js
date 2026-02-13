// Money and property transactions
export const PASS_GO_BONUS = 200;

export const transferMoney = (from, to, amount) => {
  if (from.money < amount) return { success: false, error: 'Insufficient funds' };
  from.money -= amount;
  to.money += amount;
  return { success: true, from: from.id, to: to.id, amount };
};

export const addMoney = (player, amount) => {
  player.money += amount;
  return { success: true, player: player.id, amount };
};

export const deductMoney = (player, amount) => {
  if (player.money < amount) return { success: false, error: 'Insufficient funds' };
  player.money -= amount;
  return { success: true, player: player.id, amount };
};

export const calculateRent = (tile, owner, tiles) => {
  if (!tile || tile.type !== 'property' || !owner) return 0;
  
  const baseRent = tile.rent || tile.baseValue * 0.1;
  const monopoly = checkMonopoly(owner, tile.group, tiles);
  const buildingCount = tile.buildings || 0;
  
  let multiplier = 1;
  if (monopoly) multiplier = 2;
  if (buildingCount > 0) multiplier *= (1 + buildingCount * 0.5);
  
  return Math.floor(baseRent * multiplier);
};

export const checkMonopoly = (player, group, tiles) => {
  if (!group || !tiles) return false;
  const groupTiles = tiles.filter(t => t?.group === group && t?.type === 'property');
  const ownedCount = groupTiles.filter(t => player.properties.includes(t.id)).length;
  return ownedCount === groupTiles.length;
};

export const purchaseProperty = (player, tile) => {
  if (tile.owner || tile.type !== 'property') return { success: false };
  const result = deductMoney(player, tile.baseValue);
  if (!result.success) return { success: false, error: 'Not enough money' };
  
  player.properties.push(tile.id);
  tile.owner = player.id;
  return { success: true, player: player.id, tile: tile.id };
};

export const checkPassGo = (oldPosition, newPosition) => {
  return oldPosition > newPosition;
};
