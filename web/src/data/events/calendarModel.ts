/**
 * Phase 12: Events & Seasons — Calendar State Model
 * EventCalendarState for Zustand store integration
 */

import type { Season } from './seasonModel';
import type { GameEvent } from './eventModel';
import type { CommunityEvent } from './communityEventModel';

/**
 * Complete event calendar state
 * This is the shape stored in the Zustand game store
 */
export interface EventCalendarState {
  // Current season
  activeSeasonId: string | null;

  // All known events (current + upcoming + recent)
  events: Record<string, GameEvent>;
  communityEvents: Record<string, CommunityEvent>;
  seasons: Record<string, Season>;

  // Event currencies
  currencies: Record<string, number>; // currencyId → balance

  // History
  completedEventIds: string[];
  completedSeasonIds: string[];

  // UI state
  lastViewedAt: string | null; // for "new" badge
  dismissedNotifications: string[];

  // Settings
  notificationsEnabled: boolean;
}

/**
 * Default/initial calendar state
 */
export const getDefaultCalendarState = (): EventCalendarState => ({
  activeSeasonId: null,
  events: {},
  communityEvents: {},
  seasons: {},
  currencies: {},
  completedEventIds: [],
  completedSeasonIds: [],
  lastViewedAt: null,
  dismissedNotifications: [],
  notificationsEnabled: true,
});

/**
 * Type guard for EventCalendarState
 */
export const isEventCalendarState = (obj: unknown): obj is EventCalendarState => {
  if (typeof obj !== 'object' || obj === null) return false;
  const state = obj as EventCalendarState;
  return (
    typeof state.activeSeasonId === 'string' || state.activeSeasonId === null) &&
    typeof state.events === 'object' &&
    typeof state.communityEvents === 'object' &&
    typeof state.seasons === 'object' &&
    typeof state.currencies === 'object' &&
    Array.isArray(state.completedEventIds) &&
    Array.isArray(state.completedSeasonIds)
  );
};
