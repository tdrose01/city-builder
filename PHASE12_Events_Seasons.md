

# Phase 12: Events & Seasons — Complete Design Document

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Data Models](#data-models)
3. [File/Component Architecture](#filecomponent-architecture)
4. [Task Breakdown](#task-breakdown)
5. [Integration Plan](#integration-plan)
6. [Success Metrics & KPIs](#success-metrics--kpis)
7. [Risk Assessment](#risk-assessment)

---

## Executive Summary

Phase 12 introduces a layered event and seasons system that drives long-term retention through:
- **Seasonal Themes** (4 per year, 4–6 weeks each) with visual transformations, exclusive rewards, and a tiered Season Pass
- **Limited-Time Events** (1–2 week bursts within a season) with event currency, shops, and unique mechanics
- **Community ("World") Events** where all players contribute toward shared milestones with individual reward tiers
- **Event Calendar UI** providing at-a-glance visibility into what's active, upcoming, and recently ended

All systems are localStorage-first with clearly isolated data shapes designed for future backend migration. The existing `specialEvents` system in the game store is preserved and wrapped — not replaced.

**Estimated Total Effort: 13–17 developer-days across 7 tasks**

---

## Data Models

### Core Enums & Constants

```typescript
// web/src/data/events/eventTypes.ts

export type SeasonId = 'spring' | 'summer' | 'fall' | 'winter';

export type EventLifecycle = 'upcoming' | 'active' | 'ending' | 'completed';

export type EventType = 'seasonal' | 'limited_time' | 'community' | 'flash';

export type EventRewardType =
  | 'building'        // Exclusive landmark/decoration
  | 'sticker'         // Seasonal sticker set
  | 'decoration'      // City decoration
  | 'tile_skin'       // Themed tile variant
  | 'currency'        // Bonus funds/dice
  | 'power_up'        // Power-up grant
  | 'title'           // Player title/badge
  | 'city_theme'      // Full city theme override
  | 'multiplier';     // Temporary income multiplier

export type PassTier = 'free' | 'premium';

export const SEASON_SCHEDULE: Record<SeasonId, { name: string; icon: string; months: number[] }> = {
  spring:  { name: 'Bloom Festival',     icon: '🌸', months: [2, 3, 4] },    // Mar–May
  summer:  { name: 'Solar Surge',        icon: '☀️', months: [5, 6, 7] },    // Jun–Aug
  fall:    { name: 'Harvest Haunting',    icon: '🎃', months: [8, 9, 10] },   // Sep–Nov
  winter:  { name: 'Frost & Fortune',    icon: '❄️', months: [11, 0, 1] },   // Dec–Feb
};

export const EVENT_CURRENCY_TYPES = {
  spring:  { id: 'petals',      name: 'Petals',      icon: '🌷' },
  summer:  { id: 'sunshards',   name: 'Sun Shards',  icon: '🔶' },
  fall:    { id: 'candycorn',   name: 'Candy Corn',   icon: '🍬' },
  winter:  { id: 'snowflakes',  name: 'Snowflakes',  icon: '❄️' },
  generic: { id: 'event_token', name: 'Event Tokens', icon: '🎟️' },
} as const;
```

### Season

```typescript
// web/src/data/events/seasonModel.ts

export interface Season {
  id: string;                          // e.g. "2025-summer"
  seasonId: SeasonId;                  // 'summer'
  name: string;                        // "Solar Surge 2025"
  description: string;
  startDate: string;                   // ISO 8601
  endDate: string;                     // ISO 8601
  lifecycle: EventLifecycle;           // derived at runtime

  // Theming
  theme: SeasonTheme;

  // Currency
  currencyId: string;                  // from EVENT_CURRENCY_TYPES
  currencyEarned: number;              // player's accumulated amount
  currencySpent: number;               // player's spent amount

  // Season Pass
  pass: SeasonPass;

  // Nested events within this season
  eventIds: string[];                  // references to Event.id
  communityEventIds: string[];         // references to CommunityEvent.id
}

export interface SeasonTheme {
  skyboxGradient: [string, string];    // CSS gradient colors for sky
  ambientColor: string;                // hex for ambient light tint
  particleType: 'petals' | 'fireflies' | 'leaves' | 'snow' | null;
  tileOverlayTexture: string | null;   // path to overlay spritesheet
  boardTint: string;                   // hex tint for board surface
  uiAccentColor: string;              // hex for UI highlights
  musicTrackId: string | null;        // future: seasonal BGM
}

export interface SeasonPass {
  tier: PassTier;                      // 'free' or 'premium' (player's tier)
  currentXP: number;
  levels: SeasonPassLevel[];
  maxLevel: number;                    // typically 30-50
}

export interface SeasonPassLevel {
  level: number;                       // 1-based
  xpRequired: number;                  // cumulative XP to reach this level
  freeReward: EventReward | null;      // every ~2-3 levels
  premiumReward: EventReward | null;   // every level for premium
  claimed: { free: boolean; premium: boolean };
}
```

### Event (Limited-Time)

```typescript
// web/src/data/events/eventModel.ts

export interface GameEvent {
  id: string;                          // "halloween-heist-2025"
  type: EventType;
  name: string;
  description: string;
  shortDescription: string;            // for HUD display
  icon: string;                        // emoji or icon path
  seasonId: string | null;             // parent season reference (null = standalone)

  // Timing
  startDate: string;                   // ISO 8601
  endDate: string;
  lifecycle: EventLifecycle;           // derived at runtime

  // Mechanics
  mechanics: EventMechanics;

  // Rewards
  rewards: EventReward[];
  milestoneRewards: EventMilestone[];   // progressive rewards

  // Modifiers (applied while event is active)
  modifiers: EventModifier[];

  // Integration
  missionIds: string[];                // event-specific missions
  shopItems: EventShopItem[];          // event currency shop

  // Visual
  bannerImage: string | null;
  vfxType: 'confetti' | 'fireworks' | 'spooky' | 'sparkle' | null;
  tileOverrides: TileOverride[];       // themed tile appearances
}

export interface EventMechanics {
  // What gameplay mechanic does this event modify?
  type: 'bonus_multiplier' | 'special_tiles' | 'collection' | 'challenge' | 'tournament';

  // Collection events: gather items from tiles
  collectibles?: {
    items: { id: string; name: string; icon: string; rarity: 'common' | 'rare' | 'epic' }[];
    collected: Record<string, number>;  // itemId → count
    goal: Record<string, number>;       // itemId → target
  };

  // Challenge events: complete N tasks
  challenges?: {
    tasks: EventChallenge[];
  };

  // Bonus multiplier events: X% bonus to income/dice/etc
  multiplier?: {
    target: 'income' | 'dice' | 'xp' | 'all';
    value: number;                      // 1.5 = +50%
  };
}

export interface EventChallenge {
  id: string;
  description: string;
  type: 'rolls' | 'funds_earned' | 'buildings_built' | 'heists_won' | 'gifts_sent' | 'tiles_landed';
  target: number;
  progress: number;
  completed: boolean;
  reward: EventReward;
}

export interface EventModifier {
  type: 'income_multiplier' | 'dice_multiplier' | 'shield_bonus' | 'xp_multiplier' | 'rent_reduction';
  value: number;
  description: string;
}

export interface TileOverride {
  tileType: string;                    // matches existing tile types
  skin: string;                        // texture/model variant id
  label?: string;                      // override display name
  particleEffect?: string;
}
```

### EventReward

```typescript
// web/src/data/events/rewardModel.ts

export interface EventReward {
  id: string;
  type: EventRewardType;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

  // What is granted
  payload: {
    buildingId?: string;               // for 'building' type
    stickerId?: string;                // for 'sticker' type
    decorationId?: string;             // for 'decoration' type
    tileSkinId?: string;               // for 'tile_skin' type
    currencyType?: 'funds' | 'dice' | 'event';
    currencyAmount?: number;
    powerUpId?: string;
    powerUpCount?: number;
    multiplierValue?: number;
    multiplierDuration?: number;       // in hours
    titleText?: string;
    themeId?: string;
  };

  // Claiming
  claimed: boolean;
  claimedAt: string | null;

  // Exclusivity
  exclusive: boolean;                  // true = never returns
  seasonId: string | null;             // which season this belongs to
}
```

### EventShopItem

```typescript
export interface EventShopItem {
  id: string;
  reward: EventReward;
  cost: {
    currencyId: string;                // event currency type
    amount: number;
  };
  stock: number | null;                // null = unlimited
  purchased: number;                   // how many player bought
  availableFrom: string | null;        // ISO date, null = always during event
  availableUntil: string | null;
}
```

### CommunityEvent

```typescript
// web/src/data/events/communityEventModel.ts

export interface CommunityEvent {
  id: string;                          // "golden-tower-spring-2025"
  name: string;
  description: string;
  icon: string;
  seasonId: string | null;

  // Timing
  startDate: string;
  endDate: string;
  lifecycle: EventLifecycle;

  // Global Goal
  globalGoal: {
    metric: 'total_funds_earned' | 'total_rolls' | 'total_buildings' | 'total_heists' | 'total_gifts';
    targetValue: number;               // e.g. 10,000,000,000
    currentValue: number;              // simulated aggregate (see note below)
    milestones: CommunityMilestone[];
  };

  // Individual Contribution
  playerContribution: number;
  contributionRewards: ContributionTier[];

  // Display
  bannerImage: string | null;
  progressBarColor: string;
}

export interface CommunityMilestone {
  threshold: number;                   // when global reaches this
  reward: EventReward;                 // everyone gets this
  reached: boolean;
  reachedAt: string | null;
}

export interface ContributionTier {
  minContribution: number;             // player must contribute at least this
  reward: EventReward;
  claimed: boolean;
}

/**
 * NOTE ON COMMUNITY EVENTS (localStorage-first):
 *
 * Since we don't have a real backend, community progress is SIMULATED:
 * - Base rate: clock-based accumulation (X per hour since event start)
 * - Player contribution: added on top of simulated base
 * - Acceleration: player actions speed up the simulated rate slightly
 * - Result: feels like a living community even in single-player
 *
 * Future backend migration: replace simulated base with real aggregation API.
 */
```

### EventCalendar (Player State)

```typescript
// web/src/data/events/calendarModel.ts

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
```

### Event Store Slice

```typescript
// Additions to the Zustand game store (web/src/store/)

export interface EventStoreSlice {
  // State
  eventCalendar: EventCalendarState;

  // Season Actions
  initializeSeason: (seasonId: string) => void;
  advanceSeasonPass: (xpGained: number) => void;
  claimSeasonPassReward: (level: number, tier: PassTier) => void;
  upgradeToPremuimPass: () => void;

  // Event Actions
  activateEvent: (eventId: string) => void;
  completeEventChallenge: (eventId: string, challengeId: string) => void;
  collectEventItem: (eventId: string, itemId: string) => void;
  claimEventMilestone: (eventId: string, milestoneIndex: number) => void;

  // Community Event Actions
  contributeToCommuntiyEvent: (eventId: string, amount: number) => void;
  claimContributionReward: (eventId: string, tierIndex: number) => void;
  simulateCommunityProgress: () => void;  // called on tick

  // Event Shop
  purchaseEventShopItem: (eventId: string, itemId: string) => void;

  // Event Currency
  earnEventCurrency: (currencyId: string, amount: number) => void;
  spendEventCurrency: (currencyId: string, amount: number) => boolean;

  // Event Modifiers (queried by game loop)
  getActiveModifiers: () => EventModifier[];
  getActiveTileOverrides: () => TileOverride[];

  // Lifecycle
  tickEventLifecycles: () => void;     // called every game tick
  checkEventTransitions: () => void;   // upcoming→active, active→ending, etc.
}
```

---

## File/Component Architecture

```
web/src/
├── data/
│   └── events/
│       ├── index.ts                       # barrel exports
│       ├── eventTypes.ts                  # enums, constants, SEASON_SCHEDULE
│       ├── seasonModel.ts                 # Season, SeasonTheme, SeasonPass interfaces
│       ├── eventModel.ts                  # GameEvent, EventMechanics interfaces
│       ├── rewardModel.ts                 # EventReward, EventShopItem interfaces
│       
