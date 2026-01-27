import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveGame, loadGame, clearSave, hasSaveData } from '../saveSystem';

describe('saveSystem', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should save game state successfully', () => {
    const gameState = { funds: 1000, dice: 50 };
    const result = saveGame(gameState);
    
    expect(result).toBe(true);
    expect(localStorage.getItem('city_slacker_save_data')).toBeTruthy();
    
    const saved = JSON.parse(localStorage.getItem('city_slacker_save_data'));
    expect(saved.data).toEqual(gameState);
    expect(saved.version).toBe('v1');
    expect(saved.timestamp).toBeTruthy();
  });

  it('should load saved game state', () => {
    const gameState = { funds: 5000, cityLevel: 2 };
    saveGame(gameState);
    
    const loaded = loadGame();
    expect(loaded).toEqual(gameState);
  });

  it('should return null when loading empty save', () => {
    const loaded = loadGame();
    expect(loaded).toBeNull();
  });

  it('should check if save data exists', () => {
    expect(hasSaveData()).toBe(false);
    
    saveGame({ some: 'data' });
    expect(hasSaveData()).toBe(true);
    
    clearSave();
    expect(hasSaveData()).toBe(false);
  });

  it('should clear save data', () => {
    saveGame({ data: 123 });
    expect(hasSaveData()).toBe(true);
    
    const result = clearSave();
    expect(result).toBe(true);
    expect(hasSaveData()).toBe(false);
  });

  it('should handle localStorage errors during save', () => {
    // Mock setItem to throw
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota exceeded');
    });
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const result = saveGame({ data: 'lost' });
    expect(result).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    
    setItemSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('should handle corrupted JSON during load', () => {
    localStorage.setItem('city_slacker_save_data', 'not-json');
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const loaded = loadGame();
    expect(loaded).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
});
