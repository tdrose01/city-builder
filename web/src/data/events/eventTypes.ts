/**
 * Phase 12: Events & Seasons — Core Types and Constants
 * Base enums and constants for the event system
 */

export type SeasonId = 'spring' | 'summer' | 'fall' | 'winter';

export type EventLifecycle = 'upcoming' | 'active' | 'ending' | 'completed';

export type EventType = 'seasonal' | 'limited_time' | 'community' | 'flash';

export type EventRewardType =
  | 'building' // Exclusive landmark/decoration
  | 'sticker' // Seasonal sticker set
  | 'decoration' // City decoration
  | 'tile_skin' // Themed tile variant
  | 'currency' // Bonus funds/dice
  | 'power_up' // Power-up grant
  | 'title' // Player title/badge
  | 'city_theme' // Full city theme override
  | 'multiplier'; // Temporary income multiplier

export type PassTier = 'free' | 'premium';

export type EventModifierType =
  | 'income_multiplier'
  | 'dice_multiplier'
  | 'shield_bonus'
  | 'xp_multiplier'
  | 'rent_reduction';

export type ParticleType = 'petals' | 'fireflies' | 'leaves' | 'snow' | null;

export type EventMechanicType =
  | 'bonus_multiplier'
  | 'special_tiles'
  | 'collection'
  | 'challenge'
  | 'tournament';

export type ChallengeType =
  | 'rolls'
  | 'funds_earned'
  | 'buildings_built'
  | 'heists_won'
  | 'gifts_sent'
  | 'tiles_landed';

export type CommunityMetric =
  | 'total_funds_earned'
  | 'total_rolls'
  | 'total_buildings'
  | 'total_heists'
  | 'total_gifts';

// Season schedule configuration
export interface SeasonScheduleItem {
  name: string;
  icon: string;
  months: number[]; // 0-11 (Jan = 0)
}

export const SEASON_SCHEDULE: Record<SeasonId, SeasonScheduleItem> = {
  spring: { name: 'Bloom Festival', icon: '🌸', months: [2, 3, 4] }, // Mar-May
  summer: { name: 'Solar Surge', icon: '☀️', months: [5, 6, 7] }, // Jun-Aug
  fall: { name: 'Harvest Haunting', icon: '🎃', months: [8, 9, 10] }, // Sep-Nov
  winter: { name: 'Frost & Fortune', icon: '❄️', months: [11, 0, 1] }, // Dec-Feb
};

// Event currency types per season
export interface EventCurrencyConfig {
  id: string;
  name: string;
  icon: string;
}

export const EVENT_CURRENCY_TYPES: Record<SeasonId | 'generic', EventCurrencyConfig> = {
  spring: { id: 'petals', name: 'Petals', icon: '🌷' },
  summer: { id: 'sunshards', name: 'Sun Shards', icon: '🔶' },
  fall: { id: 'candycorn', name: 'Candy Corn', icon: '🍬' },
  winter: { id: 'snowflakes', name: 'Snowflakes', icon: '❄️' },
  generic: { id: 'event_token', name: 'Event Tokens', icon: '🎟️' },
};

// Rarity tiers
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// VFX types
export type VfxType = 'confetti' | 'fireworks' | 'spooky' | 'sparkle' | null;
