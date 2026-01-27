import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, afterEach } from 'vitest';
import PowerUpShop from '../PowerUpShop';
import PowerUpIndicator from '../PowerUpIndicator';
import { POWER_UPS, getPowerUpCost, getPowerUpDurationLabel } from '../../config/powerUps';
import { scaleByCity } from '../../config/tileTypes';

describe('power-up helpers', () => {
  test('getPowerUpCost scales costs by city level', () => {
    const expected = scaleByCity(2000, 2);
    expect(getPowerUpCost(POWER_UPS.MEGA_MULTIPLIER, 2)).toBe(expected);
    expect(getPowerUpCost(POWER_UPS.HOT_STREAK, 1)).toBe(0);
  });

  test('getPowerUpDurationLabel formats durations', () => {
    expect(getPowerUpDurationLabel(POWER_UPS.HOT_STREAK)).toBe('5 rolls');
    expect(getPowerUpDurationLabel(POWER_UPS.MONEY_MAGNET)).toBe('City');
    expect(getPowerUpDurationLabel(null)).toBe('');
  });
});

describe('PowerUpShop', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('disables purchases when funds are insufficient', () => {
    render(
      <PowerUpShop
        cityLevel={1}
        funds={0}
        activePowerUps={[]}
        cooldowns={{}}
        positiveTileStreak={0}
        onActivate={vi.fn()}
      />
    );

    const disabledButtons = screen.getAllByRole('button', { name: /not enough funds/i });
    expect(disabledButtons.length).toBeGreaterThan(0);
    disabledButtons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  test('shows cooldown label when a power-up is cooling down', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1000);

    render(
      <PowerUpShop
        cityLevel={1}
        funds={10000}
        activePowerUps={[]}
        cooldowns={{ [POWER_UPS.SHIELD_STORM.id]: 11000 }}
        positiveTileStreak={1}
        onActivate={vi.fn()}
      />
    );

    const cooldownButton = screen.getByRole('button', { name: /cooldown 10s/i });
    expect(cooldownButton).toBeDisabled();
  });

  test('marks power-ups as active when already enabled', () => {
    render(
      <PowerUpShop
        cityLevel={1}
        funds={10000}
        activePowerUps={[{ id: POWER_UPS.SPEED_BOOST.id, remainingRolls: 3 }]}
        cooldowns={{}}
        positiveTileStreak={2}
        onActivate={vi.fn()}
      />
    );

    const activeButton = screen.getByRole('button', { name: /active/i });
    expect(activeButton).toBeDisabled();
  });
});

describe('PowerUpIndicator', () => {
  test('shows empty state when no power-ups are active', () => {
    render(
      <PowerUpIndicator
        activePowerUps={[]}
        hasTaxHavenPowerUp={false}
        hasJailFreeCard={false}
        themeColor="#fbbf24"
      />
    );

    expect(screen.getByText(/none active/i)).toBeInTheDocument();
  });

  test('renders active power-ups and special effects', () => {
    render(
      <PowerUpIndicator
        activePowerUps={[{ id: POWER_UPS.MEGA_MULTIPLIER.id, remainingRolls: 1 }]}
        hasTaxHavenPowerUp
        hasJailFreeCard
        themeColor="#fbbf24"
      />
    );

    expect(screen.getByText('Mega Multiplier')).toBeInTheDocument();
    expect(screen.getByText('Tax Haven')).toBeInTheDocument();
    expect(screen.getByText('Jail Free')).toBeInTheDocument();
  });
});
