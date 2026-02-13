// Core game mechanics
export const GAME_STATES = {
  SETUP: 'SETUP',
  ROLL: 'ROLL',
  MOVE: 'MOVE',
  ACTION: 'ACTION',
  TURN_END: 'TURN_END',
  GAME_OVER: 'GAME_OVER'
};

export const rollDice = () => ({
  die1: Math.floor(Math.random() * 6) + 1,
  die2: Math.floor(Math.random() * 6) + 1
});

export const isDoubles = (dice) => dice.die1 === dice.die2;

export const movePlayer = (player, steps, boardSize = 40) => {
  const oldPos = player.position;
  player.position = (player.position + steps) % boardSize;
  return { oldPos, newPos: player.position, passedGo: oldPos > player.position };
};

export const goToJail = (player) => {
  player.position = 10;
  player.jailTurns = 3;
  player.doublesCount = 0;
  return { success: true };
};

export const processJailTurn = (player, dice) => {
  if (player.jailTurns <= 0) return { inJail: false };
  
  player.jailTurns--;
  
  if (isDoubles(dice)) {
    player.jailTurns = 0;
    return { inJail: false, reason: 'Doubles', canMove: dice.die1 + dice.die2 };
  }
  
  if (player.jailTurns === 0) {
    return { inJail: false, reason: 'Paid', fine: 50 };
  }
  
  return { inJail: true, turnsLeft: player.jailTurns };
};

import { calculateRent } from './economyEngine.js';

export const handleTileLanding = (player, tile, players, tiles) => {
  if (!tile) return { type: 'empty' };
  
  if (tile.type === 'property' && tile.owner && tile.owner !== player.id) {
    const owner = players.find(p => p.id === tile.owner);
    const rent = calculateRent(tile, owner, tiles);
    return { type: 'rent', tile, owner, rent, player };
  }
  
  if (tile.type === 'property' && !tile.owner) {
    return { type: 'purchase', tile, player };
  }
  
  if (tile.id === 30) {
    goToJail(player);
    return { type: 'jail', player };
  }
  
  if (tile.type === 'chance' || tile.type === 'chest') {
    return { type: 'card', cardType: tile.type };
  }
  
  return { type: 'special', tile };
};
