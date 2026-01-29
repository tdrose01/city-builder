import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { POWER_UPS, getPowerUpCost } from '../../config/powerUps';
import PowerUpIndicator from '../PowerUpIndicator';
import PowerUpShop from '../PowerUpShop';

describe('power-up configuration', () => {
  test('getPowerUpCost scales active power-ups by city', () => {
    const megaMultiplier = POWER_UPS.MEGA_MULTIPLIER;
    expect(getPowerUpCost(megaMultiplier, 1)).toBe(2000);
    expect(getPowerUpCost(megaMultiplier, 2)).toBe(2800);
  });
});

describe('PowerUpIndicator', () => {
  test('shows active power-ups with remaining rolls', () => {
    render(
      <PowerUpIndicator
        activePowerUps={[{ id: POWER_UPS.MEGA_MULTIPLIER.id, remainingRolls: 1 }]}
      />
    );

    expect(screen.getByText('Mega Multiplier')).toBeInTheDocument();
    expect(screen.getByText('1 roll left')).toBeInTheDocument();
  });
});

describe('PowerUpShop', () => {
  test('shows hot streak as auto-triggered', () => {
    render(
      <PowerUpShop
        cityLevel={1}
        funds={0}
        activePowerUps={[]}
        cooldowns={{}}
        purchasedPowerUps={{}}
        onPurchase={() => {}}
      />
    );

    expect(screen.getAllByText('Auto')[0]).toBeInTheDocument();
  });
});
