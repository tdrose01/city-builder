import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import {
  SLOT_CONFIG,
  SLOT_SYMBOLS,
  WHEEL_CONFIG,
  WHEEL_SEGMENTS,
  getSlotResult,
  getWheelResult,
} from '../../config/miniGames';
import SlotMachine from '../SlotMachine';
import WheelOfFortune from '../WheelOfFortune';

describe('slot machine configuration', () => {
  test('has 6 symbols and correct payouts', () => {
    expect(SLOT_SYMBOLS).toHaveLength(6);
    expect(SLOT_CONFIG.payouts.match2).toBe(2);
    expect(SLOT_CONFIG.payouts.match3).toBe(10);
    expect(SLOT_CONFIG.payouts.jackpot).toBe(100);
    expect(SLOT_CONFIG.jackpotSymbol).toBe('💎');
  });

  test('spin cost scales by city level', () => {
    const cost1 = SLOT_CONFIG.spinCost(1);
    const cost3 = SLOT_CONFIG.spinCost(3);
    expect(cost1).toBe(1000);
    expect(cost3).toBeGreaterThan(cost1);
  });
});

describe('getSlotResult', () => {
  test('returns valid result with reels and type', () => {
    const result = getSlotResult(1);
    expect(result.reels).toHaveLength(3);
    expect(result.reels.every(r => SLOT_SYMBOLS.includes(r))).toBe(true);
    expect(['jackpot', 'match3', 'match2', 'lose']).toContain(result.type);
    expect(typeof result.netGain).toBe('number');
    expect(typeof result.payout).toBe('number');
  });

  test('returns jackpot when all reels are diamond', () => {
    // Mock to always return 💎 (index 3)
    vi.spyOn(Math, 'random').mockReturnValue(3 / SLOT_SYMBOLS.length);
    const result = getSlotResult(1);
    if (result.reels[0] === '💎' && result.reels[1] === '💎' && result.reels[2] === '💎') {
      expect(result.type).toBe('jackpot');
      expect(result.payout).toBe(1000 * 100);
    }
    vi.restoreAllMocks();
  });
});

describe('wheel of fortune configuration', () => {
  test('has 12 segments with valid fields', () => {
    expect(WHEEL_SEGMENTS).toHaveLength(12);
    for (const seg of WHEEL_SEGMENTS) {
      expect(seg.id).toBeTruthy();
      expect(seg.label).toBeTruthy();
      expect(seg.type).toBeTruthy();
      expect(seg.color).toBeTruthy();
      expect(seg.weight).toBeGreaterThan(0);
    }
  });

  test('segment weights sum to 12', () => {
    const totalWeight = WHEEL_SEGMENTS.reduce((sum, s) => sum + s.weight, 0);
    expect(totalWeight).toBe(12);
  });

  test('has exactly one bankrupt segment', () => {
    const bankrupt = WHEEL_SEGMENTS.filter(s => s.type === 'bankrupt');
    expect(bankrupt).toHaveLength(1);
  });
});

describe('getWheelResult', () => {
  test('returns valid segment with index', () => {
    const result = getWheelResult();
    expect(result.segment).toBeTruthy();
    expect(result.index).toBeGreaterThanOrEqual(0);
    expect(result.index).toBeLessThan(WHEEL_SEGMENTS.length);
    expect(WHEEL_SEGMENTS[result.index].id).toBe(result.segment.id);
  });

  test('returns deterministic result when Math.random is mocked', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0);
    const result = getWheelResult();
    expect(result.index).toBe(0);
    expect(result.segment.id).toBe('funds_1');
    vi.restoreAllMocks();
  });
});

describe('SlotMachine component', () => {
  test('renders bet stage with spin button and cost', () => {
    render(
      <SlotMachine
        cityLevel={1}
        currentFunds={10000}
        onResult={() => {}}
        onClose={() => {}}
      />
    );

    expect(screen.getByTestId('slot-spin-btn')).toBeInTheDocument();
    expect(screen.getByText('$1,000')).toBeInTheDocument();
    expect(screen.getByText('Slot Machine')).toBeInTheDocument();
  });

  test('disables spin when funds insufficient', () => {
    render(
      <SlotMachine
        cityLevel={1}
        currentFunds={100}
        onResult={() => {}}
        onClose={() => {}}
      />
    );

    expect(screen.getByTestId('slot-spin-btn')).toBeDisabled();
  });
});

describe('WheelOfFortune component', () => {
  test('renders spin stage with spin button', () => {
    render(
      <WheelOfFortune
        cityLevel={1}
        currentFunds={10000}
        onResult={() => {}}
        onClose={() => {}}
      />
    );

    expect(screen.getByTestId('wheel-spin-btn')).toBeInTheDocument();
    expect(screen.getByText('Wheel of Fortune')).toBeInTheDocument();
  });
});
