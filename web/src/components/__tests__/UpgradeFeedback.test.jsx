import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import BoardLoop from '../BoardLoop';
import { vi } from 'vitest';

beforeEach(() => {
    global.alert = vi.fn();
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
        left: 100,
        top: 100,
        width: 50,
        height: 50,
        right: 150,
        bottom: 150,
    }));
});

afterEach(() => {
    vi.restoreAllMocks();
});

test('upgrading landmark triggers text pop', async () => {
    const setFundsMock = vi.fn();

    // Start with enough funds (upgrade cost 1000)
    // Land on Upgrade (index 8)
    // Roll 4 + 4 = 8
    vi.spyOn(Math, 'random')
        .mockReturnValue(0.5); // die1=4, die2=4, total=8 -> land on Landmark (index 8)

    render(<BoardLoop cityLevel={1} funds={2000} setFunds={setFundsMock} shields={0} setShields={() => { }} dice={50} setDice={() => { }} setCityLevel={() => { }} />);

    // Roll to land on City Hall
    const rollDiceButton = screen.getByRole('button', { name: /Roll/i });
    await userEvent.click(rollDiceButton);

    // Wait for move to finish
    await waitFor(() => {
        expect(screen.getByText(/Tile:/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Upgrade/i).length).toBeGreaterThan(0);
    }, { timeout: 5000 });

    // Find upgrade button - wait for it to appear with correct text
    await waitFor(() => {
        const upgradeButton = screen.getByRole('button', { name: /0.*1.*1k/i });
        expect(upgradeButton).not.toBeDisabled();
        userEvent.click(upgradeButton);
    }, { timeout: 10000 });

    // Check for TextPop "LEVEL UP!"
    await waitFor(() => {
        expect(screen.getByText('LEVEL UP!')).toBeInTheDocument();
    });
}, 15000);
