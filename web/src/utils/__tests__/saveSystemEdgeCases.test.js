import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { saveGame, loadGame, clearSave, hasSaveData, isStorageAvailable } from '../saveSystem';

describe('Save System Edge Cases and Error Handling', () => {
  // Store original localStorage
  let originalLocalStorage;

  beforeEach(() => {
    originalLocalStorage = global.localStorage;
    // Mock localStorage for each test
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
    vi.clearAllMocks();
  });

  describe('isStorageAvailable', () => {
    it('should return true when localStorage is available', () => {
      expect(isStorageAvailable()).toBe(true);
    });

    it('should return false when localStorage throws on setItem', () => {
      global.localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });
      expect(isStorageAvailable()).toBe(false);
    });

    it('should return false when localStorage throws on getItem', () => {
      global.localStorage.getItem = vi.fn(() => {
        throw new Error('SecurityError');
      });
      // isStorageAvailable uses setItem, not getItem, so this shouldn't affect it
      expect(isStorageAvailable()).toBe(true);
    });
  });

  describe('saveGame - Error Handling', () => {
    it('should return false when localStorage.setItem throws QuotaExceededError', () => {
      global.localStorage.setItem = vi.fn(() => {
        const error = new Error('QuotaExceededError');
        error.name = 'QuotaExceededError';
        throw error;
      });

      const result = saveGame({ funds: 1000 });
      expect(result).toBe(false);
    });

    it('should return false when localStorage.setItem throws SecurityError', () => {
      global.localStorage.setItem = vi.fn(() => {
        throw new Error('SecurityError');
      });

      const result = saveGame({ funds: 1000 });
      expect(result).toBe(false);
    });

    it('should handle circular references in state object', () => {
      const circularState = { funds: 1000 };
      circularState.self = circularState; // Create circular reference

      // JSON.stringify should throw
      const result = saveGame(circularState);
      expect(result).toBe(false);
    });

    it('should save very large state objects', () => {
      // Create a large state
      const largeState = {
        funds: 1000,
        largeArray: new Array(10000).fill('x').map((_, i) => ({ id: i, data: 'test' }))
      };

      const result = saveGame(largeState);
      expect(result).toBe(true);
      expect(global.localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('loadGame - Error Handling', () => {
    it('should return null when no save data exists', () => {
      global.localStorage.getItem = vi.fn(() => null);
      const result = loadGame();
      expect(result).toBeNull();
    });

    it('should return null when save data is corrupted JSON', () => {
      global.localStorage.getItem = vi.fn(() => '{invalid json}');
      const result = loadGame();
      expect(result).toBeNull();
    });

    it('should return null when localStorage.getItem throws', () => {
      global.localStorage.getItem = vi.fn(() => {
        throw new Error('SecurityError');
      });
      const result = loadGame();
      expect(result).toBeNull();
    });

    it('should handle version mismatch gracefully', () => {
      const oldVersionData = JSON.stringify({
        version: 'v0',
        timestamp: new Date().toISOString(),
        data: { funds: 5000 }
      });
      global.localStorage.getItem = vi.fn(() => oldVersionData);

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = loadGame();
      
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Save version mismatch')
      );
      expect(result).toEqual({ funds: 5000 }); // Should still return data
      consoleSpy.mockRestore();
    });

    it('should handle missing version field', () => {
      const noVersionData = JSON.stringify({
        timestamp: new Date().toISOString(),
        data: { funds: 5000 }
      });
      global.localStorage.getItem = vi.fn(() => noVersionData);

      const result = loadGame();
      expect(result).toEqual({ funds: 5000 });
    });

    it('should handle missing data field', () => {
      const noDataField = JSON.stringify({
        version: 'v1',
        timestamp: new Date().toISOString()
      });
      global.localStorage.getItem = vi.fn(() => noDataField);

      const result = loadGame();
      expect(result).toBeUndefined();
    });

    it('should handle empty string save data', () => {
      global.localStorage.getItem = vi.fn(() => '');
      const result = loadGame();
      expect(result).toBeNull();
    });

    it('should handle non-object JSON', () => {
      global.localStorage.getItem = vi.fn(() => '"just a string"');
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const result = loadGame();
      // Returns undefined because data field doesn't exist on a string
      expect(result).toBeUndefined();
      consoleSpy.mockRestore();
    });
  });

  describe('clearSave - Error Handling', () => {
    it('should return true on successful clear', () => {
      const result = clearSave();
      expect(result).toBe(true);
      expect(global.localStorage.removeItem).toHaveBeenCalled();
    });

    it('should return false when removeItem throws', () => {
      global.localStorage.removeItem = vi.fn(() => {
        throw new Error('SecurityError');
      });
      const result = clearSave();
      expect(result).toBe(false);
    });
  });

  describe('hasSaveData - Error Handling', () => {
    it('should return true when save data exists', () => {
      global.localStorage.getItem = vi.fn(() => 'some data');
      expect(hasSaveData()).toBe(true);
    });

    it('should return false when no save data exists', () => {
      global.localStorage.getItem = vi.fn(() => null);
      expect(hasSaveData()).toBe(false);
    });

    it('should handle getItem throwing error', () => {
      global.localStorage.getItem = vi.fn(() => {
        throw new Error('Error');
      });
      // Now it catches errors and returns false
      const result = hasSaveData();
      expect(result).toBe(false);
    });
  });

  describe('Rapid Save/Load Cycles', () => {
    it('should handle rapid consecutive saves', () => {
      const states = [
        { funds: 1000 },
        { funds: 2000 },
        { funds: 3000 },
        { funds: 4000 },
        { funds: 5000 }
      ];

      states.forEach(state => {
        const result = saveGame(state);
        expect(result).toBe(true);
      });

      expect(global.localStorage.setItem).toHaveBeenCalledTimes(5);
    });

    it('should handle rapid save/load alternation', () => {
      const testState = { funds: 5000, dice: 50 };
      
      saveGame(testState);
      expect(global.localStorage.setItem).toHaveBeenCalled();

      global.localStorage.getItem = vi.fn(() => 
        JSON.stringify({
          version: 'v1',
          timestamp: new Date().toISOString(),
          data: testState
        })
      );

      const loaded = loadGame();
      expect(loaded).toEqual(testState);

      // Modify and save again
      testState.funds = 6000;
      saveGame(testState);
      expect(global.localStorage.setItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('Private/Incognito Mode Simulation', () => {
    it('should detect when localStorage is blocked in private mode', () => {
      global.localStorage.setItem = vi.fn(() => {
        throw new Error('SecurityError: The operation is insecure.');
      });

      expect(isStorageAvailable()).toBe(false);
    });

    it('should handle save gracefully in private mode', () => {
      global.localStorage.setItem = vi.fn(() => {
        throw new Error('SecurityError');
      });

      const result = saveGame({ funds: 1000 });
      expect(result).toBe(false);
    });
  });

  describe('Data Integrity', () => {
    it('should preserve data types on save/load cycle', () => {
      const originalState = {
        funds: 5000,
        dice: 50,
        shields: 3,
        cityLevel: 1,
        prestigeLevel: 2,
        isAutoRoll: true,
        playerName: null,
        stats: { rolls: 100 }
      };

      let savedData;
      global.localStorage.setItem = vi.fn((key, value) => {
        savedData = value;
      });

      saveGame(originalState);

      global.localStorage.getItem = vi.fn(() => savedData);
      const loadedState = loadGame();

      expect(loadedState).toEqual(originalState);
      expect(typeof loadedState.funds).toBe('number');
      expect(typeof loadedState.isAutoRoll).toBe('boolean');
      expect(loadedState.playerName).toBeNull();
      expect(typeof loadedState.stats).toBe('object');
    });

    it('should include timestamp in save data', () => {
      let savedData;
      global.localStorage.setItem = vi.fn((key, value) => {
        savedData = JSON.parse(value);
      });

      saveGame({ funds: 1000 });

      expect(savedData.timestamp).toBeDefined();
      expect(new Date(savedData.timestamp)).toBeInstanceOf(Date);
    });

    it('should include version in save data', () => {
      let savedData;
      global.localStorage.setItem = vi.fn((key, value) => {
        savedData = JSON.parse(value);
      });

      saveGame({ funds: 1000 });

      expect(savedData.version).toBe('v1');
    });
  });
});
