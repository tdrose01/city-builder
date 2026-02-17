/**
 * Phase 12: Events & Seasons — localStorage Schema
 * Typed getters/setters for event data persistence
 */

import type { EventCalendarState } from './calendarModel';
import { getDefaultCalendarState, isEventCalendarState } from './calendarModel';

// Storage keys
const STORAGE_KEY = 'city_builder_events';
const LAST_MIGRATION_KEY = 'city_builder_events_migration';

/**
 * Get event data from localStorage
 * Returns typed EventCalendarState or default if not found/invalid
 */
export const getEventData = (): EventCalendarState => {
  if (typeof window === 'undefined') {
    return getDefaultCalendarState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getDefaultCalendarState();
    }

    const parsed = JSON.parse(raw);

    if (!isEventCalendarState(parsed)) {
      console.warn('[Events] Invalid data structure in localStorage, resetting');
      return getDefaultCalendarState();
    }

    return parsed;
  } catch (err) {
    console.error('[Events] Failed to load event data:', err);
    return getDefaultCalendarState();
  }
};

/**
 * Save event data to localStorage
 */
export const setEventData = (data: EventCalendarState): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('[Events] Failed to save event data:', err);
    return false;
  }
};

/**
 * Get specific currency balance
 */
export const getCurrencyBalance = (currencyId: string): number => {
  const data = getEventData();
  return data.currencies[currencyId] ?? 0;
};

/**
 * Earn/spend event currency
 * Returns new balance or null on error
 */
export const modifyCurrency = (
  currencyId: string,
  delta: number
): number | null => {
  const data = getEventData();
  const current = data.currencies[currencyId] ?? 0;
  const newBalance = current + delta;

  if (newBalance < 0) {
    return null; // Insufficient funds
  }

  data.currencies[currencyId] = newBalance;
  data.lastViewedAt = new Date().toISOString();

  const saved = setEventData(data);
  return saved ? newBalance : null;
};

/**
 * Earn currency (wrapper for clarity)
 */
export const earnCurrency = (currencyId: string, amount: number): number | null => {
  if (amount <= 0) return null;
  return modifyCurrency(currencyId, amount);
};

/**
 * Spend currency (wrapper with validation)
 */
export const spendCurrency = (currencyId: string, amount: number): number | null => {
  if (amount <= 0) return null;
  return modifyCurrency(currencyId, -amount);
};

/**
 * Add completed event to history
 */
export const addCompletedEvent = (eventId: string): boolean => {
  const data = getEventData();

  if (!data.completedEventIds.includes(eventId)) {
    data.completedEventIds.push(eventId);
    return setEventData(data);
  }

  return true;
};

/**
 * Add completed season to history
 */
export const addCompletedSeason = (seasonId: string): boolean => {
  const data = getEventData();

  if (!data.completedSeasonIds.includes(seasonId)) {
    data.completedSeasonIds.push(seasonId);
    return setEventData(data);
  }

  return true;
};

/**
 * Check if an event is in completed