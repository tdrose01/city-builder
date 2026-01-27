import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import BoardLoop from '../BoardLoop';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the saveSystem utils
vi.mock('../../utils/saveSystem', () => ({
  saveGame: vi.fn(),
  loadGame: vi.fn(),
  hasSaveData: vi.fn(),
  clearSave: vi.fn(),
  isStorageAvailable: vi.fn(() => true)
}));

describe('Save Management UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show reset confirmation and clear state on confirm', async () => {
    const setFunds = vi.fn();
    const setDice = vi.fn();

    render(
      <BoardLoop
        cityLevel={1}
        funds={10000}
        setFunds={setFunds}
        dice={100}
        setDice={setDice}
        shields={1}
        setShields={vi.fn()}
        setCityLevel={vi.fn()}
      />
    );

    const resetButton = screen.getByRole('button', { name: /Reset/i });
    await userEvent.click(resetButton);

    // Check for confirmation dialog text
    expect(screen.getByText(/RESET ALL PROGRESS/i)).toBeInTheDocument();

    const confirmResetButton = screen.getByRole('button', { name: /RESET EVERYTHING/i });
    await userEvent.click(confirmResetButton);

    // Verify state reset calls
    expect(setFunds).toHaveBeenCalledWith(7500); // Default funds
    expect(setDice).toHaveBeenCalledWith(50);   // Default dice

    // Check for success notification
    expect(screen.getByText(/New Game Started!/i)).toBeInTheDocument();
  });
});
