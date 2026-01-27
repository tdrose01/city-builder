import { render, screen, act } from '@testing-library/react';
import React from 'react';
import BoardLoop from '../BoardLoop';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the saveSystem utils
vi.mock('../../utils/saveSystem', () => ({
  saveGame: vi.fn(),
  loadGame: vi.fn(),
  hasSaveData: vi.fn(),
  isStorageAvailable: vi.fn(() => true)
}));

import { saveGame, loadGame } from '../../utils/saveSystem';

describe('BoardLoop Persistence Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should load saved state on mount', async () => {
    const savedState = {
      funds: 99999,
      dice: 123,
      cityLevel: 1,
      eventProgress: 50
    };
    loadGame.mockReturnValue(savedState);

    const setFunds = vi.fn();
    const setDice = vi.fn();
    const setShields = vi.fn();
    const setCityLevel = vi.fn();

    render(
      <BoardLoop 
        cityLevel={1} 
        funds={5000} 
        setFunds={setFunds} 
        dice={50} 
        setDice={setDice} 
        shields={1} 
        setShields={setShields} 
        setCityLevel={setCityLevel} 
      />
    );

    // Verify setters called with saved values
    expect(setFunds).toHaveBeenCalledWith(99999);
    expect(setDice).toHaveBeenCalledWith(123);
    expect(setCityLevel).toHaveBeenCalledWith(1);
    
    // Check if "Game Loaded!" notification appears (via text in DOM)
    expect(screen.getByText(/Game Loaded!/i)).toBeInTheDocument();
  });

  it('should trigger debounced save when funds change', async () => {
    loadGame.mockReturnValue(null);
    
    const { rerender } = render(
      <BoardLoop 
        cityLevel={1} 
        funds={5000} 
        setFunds={vi.fn()} 
        dice={50} 
        setDice={vi.fn()} 
        shields={1} 
        setShields={vi.fn()} 
        setCityLevel={vi.fn()} 
      />
    );

    // Trigger state change by rerendering with new prop (simulating setter update)
    rerender(
      <BoardLoop 
        cityLevel={1} 
        funds={6000} 
        setFunds={vi.fn()} 
        dice={50} 
        setDice={vi.fn()} 
        shields={1} 
        setShields={vi.fn()} 
        setCityLevel={vi.fn()} 
      />
    );

    // Save should NOT be called immediately
    expect(saveGame).not.toHaveBeenCalled();

    // Fast-forward 2 seconds
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Verify save called with correct data
    expect(saveGame).toHaveBeenCalledWith(expect.objectContaining({
      funds: 6000,
      dice: 50
    }));
  });
});
