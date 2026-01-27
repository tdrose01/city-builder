/**
 * Tests for Phase 8 New Tile Types
 * 
 * Tests configuration and logic for:
 * - Lottery tile
 * - Tax tile
 * - Jail tile
 * - Fortune tile
 */

import { describe, test, expect } from 'vitest';
import {
  LOTTERY_CONFIG,
  TAX_CONFIG,
  JAIL_CONFIG,
  FORTUNE_CONFIG,
  scaleByCity,
  selectFortuneEvent,
  TILE_TYPES
} from '../../config/tileTypes';

describe('Tile Type Configuration', () => {
  describe('scaleByCity function', () => {
    test('scales values correctly by city level', () => {
      const baseValue = 500;
      
      expect(scaleByCity(baseValue, 1)).toBe(500);      // 500 * 1.4^0 = 500
      expect(scaleByCity(baseValue, 2)).toBe(700);      // 500 * 1.4^1 = 700
      expect(scaleByCity(baseValue, 3)).toBe(980);      // 500 * 1.4^2 = 980
      expect(scaleByCity(baseValue, 4)).toBe(1372);     // 500 * 1.4^3 = 1372
      expect(scaleByCity(baseValue, 5)).toBe(1921);     // 500 * 1.4^4 = 1921
    });

    test('handles edge cases', () => {
      expect(scaleByCity(0, 1)).toBe(0);
      expect(scaleByCity(100, 1)).toBe(100);
      expect(scaleByCity(1000, 5)).toBe(3842);
    });
  });

  describe('TILE_TYPES export', () => {
    test('exports all four tile types', () => {
      expect(TILE_TYPES).toHaveProperty('LOTTERY');
      expect(TILE_TYPES).toHaveProperty('TAX');
      expect(TILE_TYPES).toHaveProperty('JAIL');
      expect(TILE_TYPES).toHaveProperty('FORTUNE');
    });

    test('tile configs match individual exports', () => {
      expect(TILE_TYPES.LOTTERY).toBe(LOTTERY_CONFIG);
      expect(TILE_TYPES.TAX).toBe(TAX_CONFIG);
      expect(TILE_TYPES.JAIL).toBe(JAIL_CONFIG);
      expect(TILE_TYPES.FORTUNE).toBe(FORTUNE_CONFIG);
    });
  });
});

describe('Lottery Tile Configuration', () => {
  test('has correct base properties', () => {
    expect(LOTTERY_CONFIG.name).toBe('Lottery');
    expect(LOTTERY_CONFIG.icon).toBe('🎰');
    expect(LOTTERY_CONFIG.color).toBe('#fbbf24');
  });

  test('ticket cost scales correctly', () => {
    expect(LOTTERY_CONFIG.ticketCost(1)).toBe(500);
    expect(LOTTERY_CONFIG.ticketCost(2)).toBe(700);
    expect(LOTTERY_CONFIG.ticketCost(3)).toBe(980);
    expect(LOTTERY_CONFIG.ticketCost(4)).toBe(1372);
    expect(LOTTERY_CONFIG.ticketCost(5)).toBe(1921);
  });

  test('probabilities add up to 100%', () => {
    const { smallWinChance, jackpotChance, loseChance } = LOTTERY_CONFIG;
    expect(smallWinChance + jackpotChance + loseChance).toBe(1.0);
  });

  test('has correct win probabilities', () => {
    expect(LOTTERY_CONFIG.smallWinChance).toBe(0.20);   // 20%
    expect(LOTTERY_CONFIG.jackpotChance).toBe(0.05);    // 5%
    expect(LOTTERY_CONFIG.loseChance).toBe(0.75);       // 75%
  });

  test('has correct multipliers', () => {
    expect(LOTTERY_CONFIG.smallWinMultiplier).toBe(10);
    expect(LOTTERY_CONFIG.jackpotMultiplier).toBe(100);
  });

  test('expected value is slightly positive', () => {
    // EV = (0.20 * 10) + (0.05 * 100) + (0.75 * 0) - 1 (ticket cost)
    // EV = 2 + 5 + 0 - 1 = 6x return - 100% cost = 6x - 1 = 5x net
    // So for every $100 spent, expect ~$700 back = $600 profit
    const ticketCost = LOTTERY_CONFIG.ticketCost(1);
    const smallWinPayout = ticketCost * LOTTERY_CONFIG.smallWinMultiplier;
    const jackpotPayout = ticketCost * LOTTERY_CONFIG.jackpotMultiplier;
    
    const expectedReturn = 
      (LOTTERY_CONFIG.smallWinChance * smallWinPayout) +
      (LOTTERY_CONFIG.jackpotChance * jackpotPayout) +
      (LOTTERY_CONFIG.loseChance * 0);
    
    const expectedValue = expectedReturn - ticketCost;
    expect(expectedValue).toBeGreaterThan(0); // Positive EV
    expect(expectedValue).toBe(3000); // $3,000 expected profit per ticket (7x - 1x = 6x net)
  });
});

describe('Tax Tile Configuration', () => {
  test('has correct base properties', () => {
    expect(TAX_CONFIG.name).toBe('Tax');
    expect(TAX_CONFIG.icon).toBe('💸');
    expect(TAX_CONFIG.color).toBe('#ef4444');
  });

  test('has correct tax rate', () => {
    expect(TAX_CONFIG.taxRate).toBe(0.10); // 10%
  });

  test('has minimum tax', () => {
    expect(TAX_CONFIG.minTax).toBe(100);
  });

  test('max tax scales by city', () => {
    expect(TAX_CONFIG.maxTax(1)).toBe(5000);
    expect(TAX_CONFIG.maxTax(2)).toBe(7000);
    expect(TAX_CONFIG.maxTax(3)).toBe(9800);
    expect(TAX_CONFIG.maxTax(4)).toBe(13720);
    expect(TAX_CONFIG.maxTax(5)).toBe(19208);
  });

  test('can be blocked by power-up', () => {
    expect(TAX_CONFIG.blockableByPowerUp).toBe('tax_haven');
  });
});

describe('Jail Tile Configuration', () => {
  test('has correct base properties', () => {
    expect(JAIL_CONFIG.name).toBe('Jail');
    expect(JAIL_CONFIG.icon).toBe('🔒');
    expect(JAIL_CONFIG.color).toBe('#6b7280');
  });

  test('has correct turn skip count', () => {
    expect(JAIL_CONFIG.turnsToSkip).toBe(3);
  });

  test('bail cost scales by city', () => {
    expect(JAIL_CONFIG.bailCost(1)).toBe(1000);
    expect(JAIL_CONFIG.bailCost(2)).toBe(1400);
    expect(JAIL_CONFIG.bailCost(3)).toBe(1960);
    expect(JAIL_CONFIG.bailCost(4)).toBe(2744);
    expect(JAIL_CONFIG.bailCost(5)).toBe(3842);
  });

  test('doubles escape is guaranteed', () => {
    expect(JAIL_CONFIG.doublesEscapeChance).toBe(1.0); // 100%
  });

  test('can use card to escape', () => {
    expect(JAIL_CONFIG.cardEscape).toBe(true);
  });

  test('allows 3 rolls in jail', () => {
    expect(JAIL_CONFIG.rollsAllowedInJail).toBe(3);
  });
});

describe('Fortune Tile Configuration', () => {
  test('has correct base properties', () => {
    expect(FORTUNE_CONFIG.name).toBe('Fortune');
    expect(FORTUNE_CONFIG.icon).toBe('🔮');
    expect(FORTUNE_CONFIG.color).toBe('#a855f7');
  });

  test('has 10 events', () => {
    expect(FORTUNE_CONFIG.events).toHaveLength(10);
  });

  test('events have required properties', () => {
    FORTUNE_CONFIG.events.forEach((event) => {
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('type');
      expect(event).toHaveProperty('name');
      expect(event).toHaveProperty('description');
      expect(event).toHaveProperty('weight');
      expect(event).toHaveProperty('effect');
      
      expect(typeof event.id).toBe('string');
      expect(['positive', 'neutral', 'negative']).toContain(event.type);
      expect(typeof event.name).toBe('string');
      expect(typeof event.weight).toBe('number');
      expect(event.weight).toBeGreaterThan(0);
    });
  });

  test('event weights add up to 100', () => {
    const totalWeight = FORTUNE_CONFIG.events.reduce(
      (sum, event) => sum + event.weight,
      0
    );
    expect(totalWeight).toBe(100);
  });

  test('positive events have 60% total weight', () => {
    const positiveWeight = FORTUNE_CONFIG.events
      .filter(e => e.type === 'positive')
      .reduce((sum, e) => sum + e.weight, 0);
    expect(positiveWeight).toBe(60);
  });

  test('neutral events have 30% total weight', () => {
    const neutralWeight = FORTUNE_CONFIG.events
      .filter(e => e.type === 'neutral')
      .reduce((sum, e) => sum + e.weight, 0);
    expect(neutralWeight).toBe(30);
  });

  test('negative events have 10% total weight', () => {
    const negativeWeight = FORTUNE_CONFIG.events
      .filter(e => e.type === 'negative')
      .reduce((sum, e) => sum + e.weight, 0);
    expect(negativeWeight).toBe(10);
  });

  test('has 4 positive events', () => {
    const positiveEvents = FORTUNE_CONFIG.events.filter(e => e.type === 'positive');
    expect(positiveEvents).toHaveLength(4);
  });

  test('has 4 neutral events', () => {
    const neutralEvents = FORTUNE_CONFIG.events.filter(e => e.type === 'neutral');
    expect(neutralEvents).toHaveLength(4);
  });

  test('has 2 negative events', () => {
    const negativeEvents = FORTUNE_CONFIG.events.filter(e => e.type === 'negative');
    expect(negativeEvents).toHaveLength(2);
  });
});

describe('selectFortuneEvent function', () => {
  test('always returns an event', () => {
    for (let i = 0; i < 100; i++) {
      const event = selectFortuneEvent();
      expect(event).toBeDefined();
      expect(event).toHaveProperty('id');
      expect(event).toHaveProperty('type');
    }
  });

  test('returns events with correct distribution (statistical test)', () => {
    const iterations = 10000;
    const counts = {
      positive: 0,
      neutral: 0,
      negative: 0
    };

    for (let i = 0; i < iterations; i++) {
      const event = selectFortuneEvent();
      counts[event.type]++;
    }

    // Check that distribution is roughly correct (within 5% margin)
    const positivePercent = (counts.positive / iterations) * 100;
    const neutralPercent = (counts.neutral / iterations) * 100;
    const negativePercent = (counts.negative / iterations) * 100;

    expect(positivePercent).toBeGreaterThan(55);
    expect(positivePercent).toBeLessThan(65);
    
    expect(neutralPercent).toBeGreaterThan(25);
    expect(neutralPercent).toBeLessThan(35);
    
    expect(negativePercent).toBeGreaterThan(5);
    expect(negativePercent).toBeLessThan(15);
  });

  test('can return all events over many iterations', () => {
    const seenEvents = new Set();
    const totalEvents = FORTUNE_CONFIG.events.length;

    // Run enough iterations to likely see all events
    for (let i = 0; i < 1000; i++) {
      const event = selectFortuneEvent();
      seenEvents.add(event.id);
    }

    // Should see most events (allow for rare events to not appear)
    expect(seenEvents.size).toBeGreaterThanOrEqual(totalEvents - 2);
  });
});

describe('Fortune Event Effects', () => {
  test('ADD_FUNDS events scale with city level', () => {
    const bonusFundsEvents = FORTUNE_CONFIG.events.filter(
      e => e.effect.type === 'ADD_FUNDS'
    );

    bonusFundsEvents.forEach(event => {
      const value1 = event.effect.getValue(1);
      const value5 = event.effect.getValue(5);
      
      expect(value5).toBeGreaterThan(value1);
      expect(value5 / value1).toBeCloseTo(3.8416, 1); // 1.4^4
    });
  });

  test('LOSE_FUNDS events scale with city level', () => {
    const loseFundsEvents = FORTUNE_CONFIG.events.filter(
      e => e.effect.type === 'LOSE_FUNDS'
    );

    loseFundsEvents.forEach(event => {
      const value1 = event.effect.getValue(1);
      const value5 = event.effect.getValue(5);
      
      expect(value5).toBeGreaterThan(value1);
      expect(event.effect.minimum).toBe(0); // Can't go below 0 funds
    });
  });

  test('ADD_DICE events have fixed values', () => {
    const diceEvents = FORTUNE_CONFIG.events.filter(
      e => e.effect.type === 'ADD_DICE'
    );

    diceEvents.forEach(event => {
      expect(typeof event.effect.value).toBe('number');
      expect(event.effect.value).toBeGreaterThan(0);
    });
  });

  test('ADD_SHIELDS events have fixed values', () => {
    const shieldEvents = FORTUNE_CONFIG.events.filter(
      e => e.effect.type === 'ADD_SHIELDS'
    );

    shieldEvents.forEach(event => {
      expect(typeof event.effect.value).toBe('number');
      expect(event.effect.value).toBeGreaterThan(0);
    });
  });
});
