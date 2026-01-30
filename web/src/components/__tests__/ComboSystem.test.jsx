import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import BoardLoop from '../BoardLoop';
import { INITIAL_STATE } from '../../config/gameBalance';

import ComboTracker from '../ComboTracker';

// Mock audioManager
vi.mock('../../utils/audioManager', () => ({
  default: {
    playSFX: vi.fn(),
    init: vi.fn(),
  },
}));

// Mock ThreeDice to avoid WebGL issues in tests
vi.mock('../ThreeDice', () => ({
  default: () => <div data-testid="three-dice">ThreeDice</div>,
}));

// Mock ParticleEffect
vi.mock('../ParticleEffect', () => ({
  default: () => <div data-testid="particle-effect">ParticleEffect</div>,
}));

describe('Enhanced Combo System', () => {
  const mockProps = {
    cityLevel: 1,
    funds: 10000,
    setFunds: vi.fn(),
    shields: 1,
    setShields: vi.fn(),
    dice: 100,
    setDice: vi.fn(),
    setCityLevel: vi.fn(),
  };

  const getComboMultiplier = (count) => {
    if (count <= 1) return 1.0;
    if (count === 2) return 1.1;
    if (count === 3) return 1.25;
    if (count === 4) return 1.5;
    return 2.0;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('ComboTracker Component', () => {
    test('does not render when count is 1 or less', () => {
      const { container } = render(
        <ComboTracker 
          comboChain={{ type: 'Funds', count: 1 }} 
          getComboMultiplier={getComboMultiplier} 
        />
      );
      expect(container.firstChild).toBeNull();
    });

    test('renders correctly when count is greater than 1', () => {
      render(
        <ComboTracker 
          comboChain={{ type: 'Funds', count: 2 }} 
          getComboMultiplier={getComboMultiplier} 
        />
      );
      expect(screen.getByText(/FUNDS CHAIN/i)).toBeInTheDocument();
      expect(screen.getByText(/2/)).toBeInTheDocument();
      expect(screen.getByText(/x1.10/)).toBeInTheDocument();
    });

    test('shows bonus power-up message at count 5', () => {
      render(
        <ComboTracker 
          comboChain={{ type: 'Funds', count: 5 }} 
          getComboMultiplier={getComboMultiplier} 
        />
      );
      expect(screen.getByText(/POWER-UP GRANTED!/i)).toBeInTheDocument();
      expect(screen.getByText(/x2.00/)).toBeInTheDocument();
    });
  });

  describe('Combo Logic', () => {
    test('calculates combo bonus correctly', () => {
      expect(getComboMultiplier(1)).toBe(1.0);
      expect(getComboMultiplier(2)).toBe(1.1);
      expect(getComboMultiplier(3)).toBe(1.25);
      expect(getComboMultiplier(4)).toBe(1.5);
      expect(getComboMultiplier(5)).toBe(2.0);
    });
  });
});
