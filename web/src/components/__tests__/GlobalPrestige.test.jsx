import { describe, test, expect, vi, beforeEach } from 'vitest';
import { getGlobalPrestigeMultiplier, GLOBAL_PRESTIGE } from '../../config/gameBalance';

describe('Global Prestige System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Configuration & Helpers', () => {
    test('getGlobalPrestigeMultiplier returns correct values', () => {
      // Level 0 should be 1.0x
      expect(getGlobalPrestigeMultiplier(0)).toBe(1.0);
      
      // Level 1 should be 1.5x (if multiplier is 0.5)
      expect(getGlobalPrestigeMultiplier(1)).toBe(1.0 + GLOBAL_PRESTIGE.MULTIPLIER_PER_LEVEL);
      
      // Level 2 should be 2.0x
      expect(getGlobalPrestigeMultiplier(2)).toBe(1.0 + (GLOBAL_PRESTIGE.MULTIPLIER_PER_LEVEL * 2));
    });

    test('Required city level is 5', () => {
      expect(GLOBAL_PRESTIGE.REQUIRED_CITY_LEVEL).toBe(5);
    });
  });
});
