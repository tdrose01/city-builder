// web/src/data/events/eventModel.ts
import { EventLifecycle, EventType } from './eventTypes';
import { EventReward, EventMilestone, EventShopItem } from './rewardModel';

export interface GameEvent {
  id: string;                          // "halloween-heist-2025"
  type: EventType;
  name: string;
  description: string;
  shortDescription: string;            // for HUD display
  icon: string;                        // emoji or icon path
  seasonId: string | null;             // parent season reference

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

  // Challenge events: complete tasks
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
