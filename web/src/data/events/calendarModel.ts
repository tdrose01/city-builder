// web/src/data/events/calendarModel.ts
import { GameEvent } from './eventModel';
import { CommunityEvent } from './communityEventModel';
import { Season } from './seasonModel';

export interface EventCalendarState {
  // Current season
  activeSeasonId: string | null;

  // All known events (current + upcoming + recent)
  events: Record<string, GameEvent>;
  communityEvents: Record<string, CommunityEvent>;
  seasons: Record<string, Season>;

  // Event currencies
  currencies: Record<string, number>;  // currencyId → balance

  // History
  completedEventIds: string[];
  completedSeasonIds: string[];

  // UI state
  lastViewedAt: string | null;         // for "new" badge
  dismissedNotifications: string[];

  // Settings
  notificationsEnabled: boolean;
}
