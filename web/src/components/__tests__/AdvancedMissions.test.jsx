import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MissionTracker from '../MissionTracker';

describe('Advanced Mission System', () => {
  const defaultProps = {
    rolls: 100,
    upgrades: 10,
    shieldsCollected: 5,
    currentShields: 5,
    fundsTilesLanded: 20,
    missionResetCount: 0,
    missionState: {
      daily: { startRolls: 0, startUpgrades: 0, completed: [], resetCount: 0 },
      weekly: { startRolls: 0, startUpgrades: 0, completed: [] },
      monthly: { startRolls: 0, startUpgrades: 0, completed: [] }
    },
    setMissionState: vi.fn(),
    onMissionComplete: vi.fn(),
    onAllMissionsComplete: vi.fn(),
    onResetAvailable: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders daily missions by default', () => {
    render(<MissionTracker {...defaultProps} />);
    expect(screen.getByText('Roll the dice 10 times')).toBeInTheDocument();
    expect(screen.getByText('Cycle 1')).toBeInTheDocument();
  });

  test('switches tabs to weekly and monthly', () => {
    render(<MissionTracker {...defaultProps} />);
    
    // Switch to Weekly
    fireEvent.click(screen.getByText('weekly'));
    expect(screen.getByText('Roll the dice 500 times')).toBeInTheDocument();
    
    // Switch to Monthly
    fireEvent.click(screen.getByText('monthly'));
    expect(screen.getByText('Roll the dice 2000 times')).toBeInTheDocument();
  });

  test('calculates progress correctly based on start values', () => {
    // Determine progress relative to start values
    const props = {
      ...defaultProps,
      rolls: 150,
      missionState: {
        ...defaultProps.missionState,
        daily: { ...defaultProps.missionState.daily, startRolls: 100 }, // Started at 100
        weekly: { ...defaultProps.missionState.weekly, startRolls: 50 } // Started at 50
      }
    };

    render(<MissionTracker {...props} />);
    
    // Daily progress: 150 - 100 = 50. Target 10. Completed.
    // Weekly progress: 150 - 50 = 100. Target 500. Current 100.
    
    fireEvent.click(screen.getByText('weekly'));
    // Finding specific text might be tricky with the progress display structure
    // Let's inspect the DOM structure in our mental model
    // 100 / 500
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  test('calls onMissionComplete when a mission finishes', () => {
    const setMissionState = vi.fn();
    const onMissionComplete = vi.fn();
    
    const props = {
      ...defaultProps,
      rolls: 9, // Almost done (target 10)
      setMissionState,
      onMissionComplete
    };

    const { rerender } = render(<MissionTracker {...props} />);
    
    // Update props to complete
    const newProps = { ...props, rolls: 10 };
    rerender(<MissionTracker {...newProps} />);
    
    // Should trigger update
    expect(setMissionState).toHaveBeenCalled();
    expect(onMissionComplete).toHaveBeenCalled();
  });

  test('uses current shields when higher than collected for shield missions', async () => {
    const setMissionState = vi.fn();
    const onMissionComplete = vi.fn();

    const props = {
      ...defaultProps,
      rolls: 0,
      upgrades: 0,
      shieldsCollected: 0,
      currentShields: 8,
      fundsTilesLanded: 0,
      missionState: {
        daily: { startRolls: 0, startUpgrades: 0, startShields: 0, startFundsTiles: 0, completed: [], resetCount: 0 },
        weekly: { startRolls: 0, startUpgrades: 0, startDailyCycles: 0, completed: [] },
        monthly: { startRolls: 0, startUpgrades: 0, startDailyCycles: 0, completed: [] }
      },
      setMissionState,
      onMissionComplete
    };

    render(<MissionTracker {...props} />);

    await waitFor(() => {
      expect(onMissionComplete).toHaveBeenCalledTimes(1);
    });

    expect(onMissionComplete).toHaveBeenCalledWith({ type: 'shields', amount: 2 });
  });
});
