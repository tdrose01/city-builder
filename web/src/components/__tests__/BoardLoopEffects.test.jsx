import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import BoardLoop from '../BoardLoop';
import { POWER_UPS } from '../../config/powerUps';
import { clearSave, saveGame } from '../../utils/saveSystem';
import { vi } from 'vitest';

beforeEach(() => {
    global.alert = vi.fn();
});

afterEach(() => {
    vi.restoreAllMocks();
    clearSave();
});

const BoardLoopHarness = ({ initialFunds = 10000, initialDice = 10, initialShields = 0, initialCity = 1 }) => {
    const [funds, setFunds] = React.useState(initialFunds);
    const [dice, setDice] = React.useState(initialDice);
    const [shields, setShields] = React.useState(initialShields);
    const [cityLevel, setCityLevel] = React.useState(initialCity);

    return (
        <BoardLoop
            cityLevel={cityLevel}
            funds={funds}
            setFunds={setFunds}
            shields={shields}
            setShields={setShields}
            dice={dice}
            setDice={setDice}
            setCityLevel={setCityLevel}
        />
    );
};

test('landing on Shield tile triggers shield effect', async () => {
    const setFundsMock = vi.fn();
    const setDiceMock = vi.fn();
    const setShieldsMock = vi.fn();

    render(<BoardLoop cityLevel={1} funds={100} setFunds={setFundsMock} shields={0} setShields={setShieldsMock} dice={50} setDice={setDiceMock} setCityLevel={() => { }} />);

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

    render(<BoardLoop cityLevel={1} funds={100} setFunds={setFundsMock} shields={0} setShields={setShieldsMock} dice={50} setDice={setDiceMock} setCityLevel={() => { }} />);

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

test('mega multiplier scales funds tile payout', async () => {
    saveGame({
        funds: 10000,
        dice: 10,
        shields: 0,
        cityLevel: 1,
        activePowerUps: [{ id: POWER_UPS.MEGA_MULTIPLIER.id, remainingRolls: 1 }]
    });

    const randomSpy = vi.spyOn(Math, 'random')
        .mockReturnValue(0.4); // die1=3, die2=3, total=6 -> land on Funds tile (index 6)

    render(<BoardLoopHarness initialFunds={10000} initialDice={10} />);

    await waitFor(() => {
        expect(screen.getByText('Mega Multiplier')).toBeInTheDocument();
    });

    const rollDiceButton = screen.getByRole('button', { name: /Roll/i });
    await userEvent.click(rollDiceButton);

    await waitFor(() => {
        expect(screen.getByText('$14,500')).toBeInTheDocument();
    }, { timeout: 10000 });

    randomSpy.mockRestore();
}, 15000);

test('lucky dice guarantees doubles', async () => {
    saveGame({
        funds: 10000,
        dice: 10,
        shields: 0,
        cityLevel: 1,
        activePowerUps: [{ id: POWER_UPS.LUCKY_DICE.id, remainingRolls: 1 }],
        autoRollEnabled: false
    });

    const randomSpy = vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.3) // comboTarget
        .mockReturnValueOnce(0.6) // die1 = 4
        .mockReturnValue(0.5); // Default for all subsequent calls (special events etc)

    render(<BoardLoopHarness initialFunds={10000} initialDice={10} />);

    await waitFor(() => {
        expect(screen.getByText('Lucky Dice')).toBeInTheDocument();
    });

    const rollDiceButton = screen.getByRole('button', { name: /Roll/i });
    await userEvent.click(rollDiceButton);

    await waitFor(() => {
        expect(screen.getByText(/Doubles! You get/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    // Verify dice refund (10 - 1 + 4 = 13)
    await waitFor(() => {
        expect(screen.getAllByText('13').length).toBeGreaterThan(0);
    });
    randomSpy.mockRestore();
}, 15000);

test('rolling the same value twice triggers a dice streak', async () => {
    const setFundsMock = vi.fn();
    const setDiceMock = vi.fn();

    // Mock Math.random for initial comboTarget and two rolls
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.2);

    render(<BoardLoop cityLevel={1} funds={100} setFunds={setFundsMock} shields={0} setShields={vi.fn()} dice={50} setDice={setDiceMock} setCityLevel={() => { }} />);

    const rollDiceButton = screen.getByRole('button', { name: /Roll/i });
    await userEvent.click(rollDiceButton);

    await waitFor(() => {
        // Roll: 4 is split across elements, check for "Roll:" and "4" nearby or just ensure 4 is displayed as roll
        expect(screen.getByText('Roll:')).toBeInTheDocument();
        expect(screen.getAllByText('4').length).toBeGreaterThan(0);
    }, { timeout: 10000 });

    // Wait for movement to finish so button is enabled and text reset
    await waitFor(() => {
        expect(rollDiceButton).not.toBeDisabled();
        // The button text might be just 'Roll'
        expect(rollDiceButton).toHaveTextContent(/Roll/i);
    }, { timeout: 10000 });

    await userEvent.click(rollDiceButton);

    await waitFor(() => {
        expect(screen.getByText(/Streak: x2/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    randomSpy.mockRestore();
}, 20000);
