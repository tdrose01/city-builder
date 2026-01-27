import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, afterEach } from 'vitest';
import {
  scaleByCity,
  LOTTERY_CONFIG,
  FORTUNE_CONFIG,
  selectFortuneEvent
} from '../../config/tileTypes';
import LotteryTile from '../LotteryTile';

describe('Tile type configs', () => {
  test('scaleByCity applies 1.4x scaling per level', () => {
    expect(scaleByCity(500, 1)).toBe(500);
    expect(scaleByCity(500, 2)).toBe(700);
    expect(scaleByCity(500, 3)).toBe(Math.round(500 * Math.pow(1.4, 2)));
  });

  test('lottery odds sum to 1', () => {
    const totalChance = LOTTERY_CONFIG.smallWinChance +
      LOTTERY_CONFIG.jackpotChance +
      LOTTERY_CONFIG.loseChance;
    expect(totalChance).toBeCloseTo(1, 5);
  });

  test('fortune event weights sum to 100', () => {
    const totalWeight = FORTUNE_CONFIG.events.reduce((sum, event) => sum + event.weight, 0);
    expect(totalWeight).toBe(100);
  });

  test('selectFortuneEvent returns a valid event', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    const event = selectFortuneEvent();
    expect(FORTUNE_CONFIG.events).toContain(event);
    expect(event.id).toBe(FORTUNE_CONFIG.events[0].id);
    randomSpy.mockRestore();
  });
});

describe('LotteryTile', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('disables purchase when funds are insufficient', () => {
    render(
      <LotteryTile
        cityLevel={1}
        currentFunds={0}
        onResult={vi.fn()}
        onClose={vi.fn()}
      />
    );

    const purchaseButton = screen.getByRole('button', { name: /not enough funds/i });
    expect(purchaseButton).toBeDisabled();
  });
});
