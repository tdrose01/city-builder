import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import {
  CITY_WIDE_EVENTS,
  RANDOM_EVENTS,
  MILESTONE_EVENTS,
  EVENT_TRIGGER,
  selectCityWideEvent,
  selectRandomEvent,
  checkMilestoneEvents,
} from '../../config/specialEvents';
import SpecialEventModal from '../SpecialEventModal';

describe('city-wide event configuration', () => {
  test('all city-wide events have required fields', () => {
    expect(CITY_WIDE_EVENTS.length).toBeGreaterThanOrEqual(4);
    for (const event of CITY_WIDE_EVENTS) {
      expect(event.id).toBeTruthy();
      expect(event.name).toBeTruthy();
      expect(event.icon).toBeTruthy();
      expect(event.description).toBeTruthy();
      expect(event.duration).toBeGreaterThan(0);
      expect(event.effects).toBeTruthy();
      expect(event.color).toBeTruthy();
      expect(event.sound).toBeTruthy();
    }
  });
});

describe('random event configuration', () => {
  test('all random events have required fields', () => {
    expect(RANDOM_EVENTS.length).toBeGreaterThanOrEqual(6);
    for (const event of RANDOM_EVENTS) {
      expect(event.id).toBeTruthy();
      expect(event.name).toBeTruthy();
      expect(event.icon).toBeTruthy();
      expect(event.effect).toBeTruthy();
      expect(event.effect.type).toBeTruthy();
      expect(event.weight).toBeGreaterThan(0);
    }
  });

  test('random event weights sum correctly', () => {
    const totalWeight = RANDOM_EVENTS.reduce((sum, e) => sum + e.weight, 0);
    expect(totalWeight).toBe(100);
  });
});

describe('selectCityWideEvent', () => {
  test('returns a valid city-wide event', () => {
    const ids = CITY_WIDE_EVENTS.map(e => e.id);
    const event = selectCityWideEvent();
    expect(ids).toContain(event.id);
    expect(event.duration).toBeGreaterThan(0);
  });
});

describe('selectRandomEvent', () => {
  test('returns a valid random event', () => {
    const ids = RANDOM_EVENTS.map(e => e.id);
    const event = selectRandomEvent();
    expect(ids).toContain(event.id);
  });

  test('returns deterministic event when Math.random is mocked', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.0);
    const event = selectRandomEvent();
    expect(event.id).toBe('bank_error');
    vi.restoreAllMocks();
  });
});

describe('checkMilestoneEvents', () => {
  test('triggers roll milestone at interval boundary', () => {
    const interval = MILESTONE_EVENTS.ROLLS.interval;
    const triggered = checkMilestoneEvents(interval, 0, interval - 1, 0);
    expect(triggered).toHaveLength(1);
    expect(triggered[0].id).toBe('milestone_rolls');
  });

  test('triggers upgrade milestone at interval boundary', () => {
    const interval = MILESTONE_EVENTS.UPGRADES.interval;
    const triggered = checkMilestoneEvents(0, interval, 0, interval - 1);
    expect(triggered).toHaveLength(1);
    expect(triggered[0].id).toBe('milestone_upgrades');
  });

  test('returns empty array when no milestone crossed', () => {
    const triggered = checkMilestoneEvents(25, 5, 25, 5);
    expect(triggered).toHaveLength(0);
  });

  test('triggers both milestones simultaneously', () => {
    const rollInterval = MILESTONE_EVENTS.ROLLS.interval;
    const upgradeInterval = MILESTONE_EVENTS.UPGRADES.interval;
    const triggered = checkMilestoneEvents(rollInterval, upgradeInterval, rollInterval - 1, upgradeInterval - 1);
    expect(triggered).toHaveLength(2);
  });
});

describe('SpecialEventModal', () => {
  test('renders city-wide event with modal and dismiss button', () => {
    const event = {
      category: 'city_wide',
      name: 'Golden Hour',
      icon: '☀️',
      description: 'All rewards doubled!',
      duration: 10,
      color: '#fbbf24',
      sound: null,
    };

    render(<SpecialEventModal event={event} onClose={() => {}} />);

    expect(screen.getByText('Golden Hour')).toBeInTheDocument();
    expect(screen.getByText('All rewards doubled!')).toBeInTheDocument();
    expect(screen.getByText('Lasts 10 rolls')).toBeInTheDocument();
    expect(screen.getByTestId('special-event-dismiss')).toBeInTheDocument();
  });

  test('renders random event as compact toast', () => {
    const event = {
      category: 'random',
      name: 'Bank Error',
      icon: '🏦',
      description: 'A bank error in your favor!',
      effectText: '+$1,500',
      color: '#10b981',
      sound: null,
    };

    render(<SpecialEventModal event={event} onClose={() => {}} />);

    expect(screen.getByText('Bank Error')).toBeInTheDocument();
    expect(screen.getByText('+$1,500')).toBeInTheDocument();
    expect(screen.getByTestId('special-event-toast')).toBeInTheDocument();
  });

  test('calls onClose when dismiss button clicked for city-wide event', async () => {
    const onClose = vi.fn();
    const event = {
      category: 'city_wide',
      name: 'Tax Holiday',
      icon: '🏖️',
      description: 'No taxes!',
      duration: 5,
      color: '#10b981',
      sound: null,
    };

    render(<SpecialEventModal event={event} onClose={onClose} />);
    await userEvent.click(screen.getByTestId('special-event-dismiss'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('event trigger constants', () => {
  test('trigger constants are within expected ranges', () => {
    expect(EVENT_TRIGGER.CITY_WIDE_CHANCE).toBeGreaterThan(0);
    expect(EVENT_TRIGGER.CITY_WIDE_CHANCE).toBeLessThanOrEqual(0.1);
    expect(EVENT_TRIGGER.CITY_WIDE_COOLDOWN).toBeGreaterThanOrEqual(10);
    expect(EVENT_TRIGGER.RANDOM_EVENT_CHANCE).toBeGreaterThan(0);
    expect(EVENT_TRIGGER.RANDOM_EVENT_CHANCE).toBeLessThanOrEqual(0.2);
  });
});

describe('random event value scaling', () => {
  test('bank error getValue scales by city level', () => {
    const bankError = RANDOM_EVENTS.find(e => e.id === 'bank_error');
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const city1Value = bankError.effect.getValue(1);
    const city3Value = bankError.effect.getValue(3);
    expect(city3Value).toBeGreaterThan(city1Value);
    vi.restoreAllMocks();
  });

  test('pickpocket getMaxLoss scales by city level', () => {
    const pickpocket = RANDOM_EVENTS.find(e => e.id === 'pickpocket');
    const city1Max = pickpocket.effect.getMaxLoss(1);
    const city3Max = pickpocket.effect.getMaxLoss(3);
    expect(city3Max).toBeGreaterThan(city1Max);
  });
});
