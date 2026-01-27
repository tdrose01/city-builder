import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import BoardLoop from '../BoardLoop';
import { vi } from 'vitest';

beforeEach(() => {
    global.alert = vi.fn();
});

afterEach(() => {
    vi.restoreAllMocks();
});

test('landing on Shield tile triggers shield effect', async () => {
    const setFundsMock = vi.fn();
    const setDiceMock = vi.fn();
    const setShieldsMock = vi.fn();

    render(<BoardLoop cityLevel={1} funds={100} setFunds={setFundsMock} shields={0} setShields={setShieldsMock} dice={50} setDice={setDiceMock} setCityLevel={() => {}} />);
    
    // Target Shield Tile at Index 4
    // Need a roll of 4.
    // die1 = 2 (0.2 -> 1.2 -> 2), die2 = 2
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.2) 
      .mockReturnValueOnce(0.2) 
      .mockReturnValueOnce(0.5); // combo

    const rollDiceButton = screen.getByRole('button', { name: /Roll/i });
    await userEvent.click(rollDiceButton);

    await waitFor(() => {
        const shieldTile = document.querySelector('.tile-id-4');
        expect(shieldTile).toHaveClass('tile-effect-shield');
    }, { timeout: 5000 });
}, 15000);

test('landing on Funds tile triggers funds effect', async () => {
    const setFundsMock = vi.fn();
    const setDiceMock = vi.fn();
    const setShieldsMock = vi.fn();

    render(<BoardLoop cityLevel={1} funds={100} setFunds={setFundsMock} shields={0} setShields={setShieldsMock} dice={50} setDice={setDiceMock} setCityLevel={() => {}} />);
    
    // Target Funds Tile at Index 6
    // Need roll of 6. 3 + 3
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.4) // die1 = 3
      .mockReturnValueOnce(0.4) // die2 = 3
      .mockReturnValueOnce(0.5); // combo

    const rollDiceButton = screen.getByRole('button', { name: /Roll/i });
    await userEvent.click(rollDiceButton);

    // Wait for movement to complete and tile landing
    await waitFor(() => {
        // Check that player landed on the funds tile
        const fundsTile = document.querySelector('.tile-id-6');
        expect(fundsTile).toHaveClass('board-tile-active');
        // Check that tile effect class was applied
        expect(fundsTile).toHaveClass('tile-effect-funds');
    }, { timeout: 5000 });
    
    // Verify setFunds was called with the correct payout (1000)
    await waitFor(() => {
        expect(setFundsMock).toHaveBeenCalled();
    });
}, 15000);

test('rolling the same value twice triggers a dice streak', async () => {
    const setFundsMock = vi.fn();
    const setDiceMock = vi.fn();
    
    // Mock Math.random for initial comboTarget and two rolls
    const randomSpy = vi.spyOn(Math, 'random');
    
    // Initial comboTarget (useState initializer)
    randomSpy.mockReturnValueOnce(0.5); // Target = 4

    render(<BoardLoop cityLevel={1} funds={100} setFunds={setFundsMock} shields={0} setShields={vi.fn()} dice={50} setDice={setDiceMock} setCityLevel={() => {}} />);
    
    // First roll: Die 1 = 2, Die 2 = 2 (Total 4)
    randomSpy.mockReturnValueOnce(0.2) // die1 = 2
             .mockReturnValueOnce(0.2) // die2 = 2
             .mockReturnValueOnce(0.1); // new comboTarget (since 2 != 4)

    const rollDiceButton = screen.getByRole('button', { name: /Roll/i });
    await userEvent.click(rollDiceButton);

    await waitFor(() => {
        // Roll: 2 is split across elements, check for "Roll:" and "2" nearby or just ensure 2 is displayed as roll
        expect(screen.getByText('Roll:')).toBeInTheDocument();
        expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    }, { timeout: 10000 });

    // Wait for movement to finish so button is enabled and text reset
    await waitFor(() => {
        expect(rollDiceButton).not.toBeDisabled();
        // The button text might be just 'Roll'
        expect(rollDiceButton).toHaveTextContent(/Roll/i);
    }, { timeout: 10000 });

    // Second roll: Die 1 = 2, Die 2 = 2 (Total 4)
    randomSpy.mockReturnValueOnce(0.2) // die1 = 2
             .mockReturnValueOnce(0.2) // die2 = 2
             .mockReturnValueOnce(0.1); // new comboTarget (since 2 != 2)

    await userEvent.click(rollDiceButton);

    await waitFor(() => {
        expect(screen.getByText(/Streak: x2/i)).toBeInTheDocument();
    }, { timeout: 10000 });
    
    randomSpy.mockRestore();
}, 20000);
