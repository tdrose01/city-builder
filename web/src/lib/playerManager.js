// Player model and turn management
export const PLAYER_PIECES = ['car', 'hat', 'ship', 'dog', 'cat', 'boot'];

export const createPlayer = (id, name, piece, isAI = false) => ({
  id,
  name,
  piece,
  money: 1500,
  position: 0,
  properties: [],
  isAI,
  status: 'ACTIVE',
  jailTurns: 0,
  doublesCount: 0
});

export const createPlayers = (count = 4, names = ['Player 1', 'Player 2', 'Player 3', 'Player 4']) => {
  return Array.from({ length: count }, (_, i) => 
    createPlayer(i, names[i] || `Player ${i + 1}`, PLAYER_PIECES[i], i > 0)
  );
};

export const TurnManager = {
  currentIndex: 0,
  
  getCurrentPlayer(players) {
    return players[this.currentIndex];
  },
  
  nextTurn(players) {
    do {
      this.currentIndex = (this.currentIndex + 1) % players.length;
    } while (players[this.currentIndex]?.status === 'BANKRUPT');
    return this.getCurrentPlayer(players);
  },
  
  reset() {
    this.currentIndex = 0;
  }
};

export const getPlayerNetWorth = (player, tiles) => {
  const propertyValue = player.properties.reduce((sum, tileId) => {
    const tile = tiles.find(t => t?.id === tileId);
    return sum + (tile?.baseValue || 0);
  }, 0);
  return player.money + propertyValue;
};
