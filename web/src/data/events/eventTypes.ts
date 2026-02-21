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
