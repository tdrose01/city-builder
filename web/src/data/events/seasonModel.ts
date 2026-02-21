// web/src/data/events/seasonModel.ts
import { SeasonId, EventLifecycle, PassTier, EventRewardType } from './eventTypes';
import { EventReward } from './rewardModel';

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
  musicTrackId: string | null;
}

export interface SeasonPass {
  tier: PassTier;                      // 'free' or 'premium'
  currentXP: number;
  levels: SeasonPassLevel[];
  maxLevel: number;
}

export interface SeasonPassLevel {
  level: number;                       // 1-based
  xpRequired: number;                  // cumulative XP to reach this level
  freeReward: EventReward | null;      
  premiumReward: EventReward | null;   
  claimed: { free: boolean; premium: boolean };
}
