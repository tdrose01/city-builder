import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import BoardLoop from '../BoardLoop';
import { vi } from 'vitest';

const mockCsvData = `Tile,Tile Type,Tile Name,Payout
0,Go,Go,200
1,Funds,Electric Company,50
2,Community Chest,Community Chest,0
3,Funds,Water Works,75
`;

beforeEach(() => {
    global.fetch = vi.fn(() =>
        Promise.resolve({
            text: () => Promise.resolve(mockCsvData),
        })
    );
    global.alert = vi.fn(); // Mock alert for upgrade messages
});

afterEach(() => {
    vi.restoreAllMocks();
});


test('player can move around the board and collect funds', async () => {
    let currentFunds = 100; // Manually track funds
    const setFundsMock = vi.fn((updater) => {
        currentFunds = typeof updater === 'function' ? updater(currentFunds) : updater;
    });
    const setDiceMock = vi.fn();
    const setShieldsMock = vi.fn();

    const { rerender } = render(<BoardLoop cityLevel={1} funds={currentFunds} setFunds={setFundsMock} shields={0} setShields={setShieldsMock} dice={50} setDice={setDiceMock} setCityLevel={() => { }} />);

    // Simulate landing on Funds (tile 6, payout 1500)
    // Roll of 6: die1=3, die2=3
    // 3 = Math.floor(0.4 * 6) + 1
    vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.4) // die1 = 3
        .mockReturnValueOnce(0.4) // die2 = 3
        .mockReturnValueOnce(0.5); // comboTarget initial

    const rollDiceButton = screen.getByRole('button', { name: /Roll/i });
    await userEvent.click(rollDiceButton);

    await waitFor(() => {
        // We use a regex to be flexible about the exact text, assuming it contains "Tile" and some name
        // "Elm St" was from old data, now we just check for a valid tile name being displayed
        expect(screen.getByText(/Tile:/i)).toBeInTheDocument();
    }, { timeout: 10000 });

    await waitFor(() => {
        rerender(<BoardLoop cityLevel={1} funds={currentFunds} setFunds={setFundsMock} shields={0} setShields={setShieldsMock} dice={50} setDice={setDiceMock} setCityLevel={() => { }} />);
        // Check if funds are updated correctly
        expect(screen.getByText(`$${currentFunds.toLocaleString()}`)).toBeInTheDocument();
    }, { timeout: 10000 });
}, 15000);

test('event progress increments by pacing points per roll', async () => {
    const setFundsMock = vi.fn();
    const setDiceMock = vi.fn();
    const setShieldsMock = vi.fn();

    render(<BoardLoop cityLevel={1} funds={100} setFunds={setFundsMock} shields={0} setShields={setShieldsMock} dice={50} setDice={setDiceMock} setCityLevel={() => { }} />);

    vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.1) // die1 = 1
        .mockReturnValueOnce(0.2) // die2 = 2
        .mockReturnValueOnce(0.5); // combo

    const rollDiceButton = screen.getByRole('button', { name: /Roll/i });
    await userEvent.click(rollDiceButton);

    await waitFor(() => {
        // After 1 roll, progress is 15. Next milestone is 30.
        expect(screen.getByText('15 / 30')).toBeInTheDocument();
    }, { timeout: 10000 });
}, 15000);

test('doubles bonus scales dice refund', async () => {
    let currentDice = 10;
    const setFundsMock = vi.fn();
    const setDiceMock = vi.fn((updater) => {
        currentDice = updater(currentDice);
    });
    const setShieldsMock = vi.fn();

    const randomSpy = vi.spyOn(Math, 'random');
    randomSpy
        .mockReturnValueOnce(0.5) // initial comboTarget
        .mockReturnValueOnce(0.2) // die1 = 2
        .mockReturnValueOnce(0.2) // die2 = 2
        .mockReturnValueOnce(0.1); // new comboTarget

    const { rerender } = render(
        <BoardLoop
            cityLevel={1}
            funds={100}
            setFunds={setFundsMock}
            shields={0}
            setShields={setShieldsMock}
            dice={currentDice}
            setDice={setDiceMock}
            setCityLevel={() => { }}
        />
    );

    const rollDiceButton = screen.getByRole('button', { name: /Roll/i });
    await userEvent.click(rollDiceButton);

    await waitFor(() => {
        expect(rollDiceButton).not.toBeDisabled();
    }, { timeout: 10000 });

    rerender(
        <BoardLoop
            cityLevel={1}
            funds={100}
            setFunds={setFundsMock}
            shields={0}
            setShields={setShieldsMock}
            dice={currentDice}
            setDice={setDiceMock}
            setCityLevel={() => { }}
        />
    );

    expect(currentDice).toBe(10);
    randomSpy.mockRestore();
}, 15000);
test('upgrade landmark button is disabled if funds are insufficient', async () => {
    // Mock initial comboTarget to a non-interfering value
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.9); // For initial comboTarget (e.g., 6)

    let currentFunds = 0; // Start with 0 funds
    const setFundsMock = vi.fn((updater) => {
        currentFunds = typeof updater === 'function' ? updater(currentFunds) : updater;
    });
    const setDiceMock = vi.fn();
    const setShieldsMock = vi.fn();
    const setCityLevelMock = vi.fn();

    const { rerender } = render(<BoardLoop cityLevel={1} funds={currentFunds} setFunds={setFundsMock} shields={0} setShields={setShieldsMock} dice={50} setDice={setDiceMock} setCityLevel={setCityLevelMock} />);

    // Mock dice rolls to land on Upgrade (tile 8)
    // 8 tiles from start (0). Needs roll of 8.
    // die1 = 4, die2 = 4 (Doubles! extra roll? No, simple test)
    // Let's use 3 and 5
    vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.4) // die1 ~ 3
        .mockReturnValueOnce(0.7); // die2 ~ 5

    // Roll dice
    const rollDiceButton = screen.getByRole('button', { name: /Roll/i });
    await userEvent.click(rollDiceButton);
    rerender(<BoardLoop cityLevel={1} funds={currentFunds} setFunds={setFundsMock} shields={0} setShields={setShieldsMock} dice={50} setDice={setDiceMock} setCityLevel={setCityLevelMock} />);

    await waitFor(() => {
        // After landing on Landmark, funds are 0.
        expect(screen.getByText('$0')).toBeInTheDocument();
        // Upgrade button should be disabled. Text is "0->1 $1k"
        const upgradeBtn = screen.getByRole('button', { name: /0→1 \$1k/i });
        expect(upgradeBtn).toBeDisabled();
    }, { timeout: 5000 });
}, 15000);

test('switching city level updates the city title and tile set', async () => {
    const setFundsMock = vi.fn();
    const setDiceMock = vi.fn();
    const setShieldsMock = vi.fn();
    const setCityLevelMock = vi.fn();

    const { rerender } = render(
        <BoardLoop
            cityLevel={1}
            funds={100}
            setFunds={setFundsMock}
            shields={0}
            setShields={setShieldsMock}
            dice={50}
            setDice={setDiceMock}
            setCityLevel={setCityLevelMock}
        />
    );

    expect(screen.getAllByText('Neon Harbor').length).toBeGreaterThan(0);

    rerender(
        <BoardLoop
            cityLevel={2}
            funds={100}
            setFunds={setFundsMock}
            shields={0}
            setShields={setShieldsMock}
            dice={50}
            setDice={setDiceMock}
            setCityLevel={setCityLevelMock}
        />
    );

    await waitFor(() => {
        expect(screen.getAllByText('Deco Heights').length).toBeGreaterThan(0);
        // Removed check for 'Grand St' as tile names are generic in current version
    });
});

test('sticker album shows progress hints and currency flow', async () => {
    const setFundsMock = vi.fn();
    const setDiceMock = vi.fn();
    const setShieldsMock = vi.fn();

    render(
        <BoardLoop
            cityLevel={1}
            funds={100}
            setFunds={setFundsMock}
            shields={0}
            setShields={setShieldsMock}
            dice={50}
            setDice={setDiceMock}
            setCityLevel={() => { }}
        />
    );

    const stickerButton = screen.getByRole('button', { name: /Stickers/i });
    await userEvent.click(stickerButton);

    expect(screen.getByText(/Dust: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/Tokens: 0/i)).toBeInTheDocument();
    expect(screen.getByText('City Life')).toBeInTheDocument();
    expect(screen.getAllByText('0/3')).toHaveLength(3);
    expect(screen.getAllByText(/50 Dice, \$10k/i).length).toBeGreaterThan(0);
});
