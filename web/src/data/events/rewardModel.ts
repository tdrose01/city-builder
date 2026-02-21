// web/src/data/events/rewardModel.ts
import { EventRewardType, PassTier } from './eventTypes';

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

export interface EventMilestone {
  threshold: number;
  reward: EventReward;
  reached: boolean;
}
