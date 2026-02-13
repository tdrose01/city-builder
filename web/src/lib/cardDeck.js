// Chance and Community Chest cards
export const CHANCE_CARDS = [
  { id: 0, text: "Advance to Go", action: 'move', target: 0 },
  { id: 1, text: "Go to Jail", action: 'jail' },
  { id: 2, text: "Pay poor tax of $15", action: 'pay', amount: 15 },
  { id: 3, text: "Your building loan matures, collect $150", action: 'receive', amount: 150 },
  { id: 4, text: "Speeding fine $50", action: 'pay', amount: 50 },
  { id: 5, text: "Bank pays you dividend of $50", action: 'receive', amount: 50 },
  { id: 6, text: "Advance to nearest railroad", action: 'move_nearest', group: 'railroad' },
];

export const CHEST_CARDS = [
  { id: 0, text: "Advance to Go", action: 'move', target: 0 },
  { id: 1, text: "Bank error in your favor, collect $200", action: 'receive', amount: 200 },
  { id: 2, text: "Doctor's fee, pay $50", action: 'pay', amount: 50 },
  { id: 3, text: "From sale of stock you get $50", action: 'receive', amount: 50 },
  { id: 4, text: "Get out of jail free", action: 'get_out_of_jail' },
  { id: 5, text: "Go to Jail", action: 'jail' },
  { id: 6, text: "Income tax refund, collect $20", action: 'receive', amount: 20 },
];

export class CardDeck {
  constructor(cards) {
    this.cards = [...cards];
    this.shuffle();
  }
  
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
  
  draw() {
    const card = this.cards.shift();
    if (card) {
      this.cards.push(card);
    }
    return card;
  }
}

export const createChanceDeck = () => new CardDeck(CHANCE_CARDS);
export const createChestDeck = () => new CardDeck(CHEST_CARDS);
