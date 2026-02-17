/**
 * Phase 12: Events & Seasons — Season Data Models
 * Season, SeasonTheme, SeasonPass, and related interfaces
 */

import type { SeasonId, EventLifecycle, PassTier, ParticleType } from './eventTypes';
import type { EventReward } from './rewardModel';

/**
 * Season Theme configuration for visual theming
 */
export interface SeasonTheme {
  skyboxGradient: [string, string]; // CSS gradient colors for sky
  ambientColor: string; // hex for ambient light tint
  particleType: ParticleType; // ambient particle effects
  tileOverlayTexture: string | null; // path to overlay spritesheet
  boardTint: string; // hex tint for board surface
  uiAccentColor: string; // hex for UI highlights
  musicTrackId: string | null; // future: seasonal BGM
}

/**
 * Individual Season Pass level/reward
 */
export interface SeasonPassLevel {
  level: number; // 1-based
  xpRequired: number; // cumulative XP to reach this level
  freeReward: EventReward | null; // every ~2-3 levels
  premiumReward: EventReward | null; // every level for premium
  claimed: {
    free: boolean;
    premium: boolean;
  };
}

/**
 * Season Pass progress and configuration
 */
export interface SeasonPass {
  tier: PassTier; // 'free' or 'premium' (player's tier)
  currentXP: number;
  levels: SeasonPassLevel[];
  maxLevel: number; // typically 30-50
}

/**
 * Core Season interface
 */
export interface Season {
  id: string; // e.g. "2025-summer"
  seasonId: SeasonId; // 'summer'
  name: string; // "Solar Surge 2025"
  description: string;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  lifecycle: EventLifecycle; // derived at runtime

  // Theming
  theme: SeasonTheme;

  // Currency
  currencyId: string; // from EVENT_CURRENCY_TYPES
  currencyEarned: number; // player's accumulated amount
  currencySpent: number; // player's spent amount

  // Season Pass
  pass: SeasonPass;

  // Nested events within this season
  eventIds: string[]; // references to GameEvent.id
  communityEventIds: string[]; // references to CommunityEvent.id
}
