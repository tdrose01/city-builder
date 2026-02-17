/**
 * Phase 12: Events & Seasons — Reward Data Models
 * EventReward and EventShopItem interfaces
 */

import type { EventRewardType, Rarity } from './eventTypes';

/**
 * Event reward payload - varies by reward type
 */
export interface EventRewardPayload {
  buildingId?: string; // for 'building' type
  stickerId?: string; // for 'sticker' type
  decorationId?: string; // for 'decoration' type
  tileSkinId?: string; // for 'tile_skin' type
  currencyType?: 'funds' | 'dice' | 'event';
  currencyAmount?: number;
  powerUpId?: string;
  powerUpCount?: number;
  multiplierValue?: number;
  multiplierDuration?: number; // in hours
  titleText?: string;
  themeId?: string;
}

/**
 * Core EventReward interface
 */
export interface EventReward {
  id: string;
  type: EventRewardType;
  name: string;
  description: string;
  icon: string;
  rarity: Rarity;

  // What is granted
  payload: EventRewardPayload;

  // Claiming
  claimed: boolean;
  claimedAt: string | null; // ISO 8601

  // Exclusivity
  exclusive: boolean; // true = never returns
  seasonId: string | null; // which season this belongs to
}

/**
 * Event currency cost structure
 */
export interface EventShopCost {
  currencyId: string; // event currency type
  amount: number;
}

/**
 * Event Shop item (purchasable with event currency)
 */
export interface EventShopItem {
  id: string;
  reward: EventReward;
  cost: EventShopCost;
  stock: number | null; // null = unlimited
  purchased: number; // how many player bought
  availableFrom: string | null; // ISO date, null = always during event
  availableUntil: string | null; // ISO date
}
