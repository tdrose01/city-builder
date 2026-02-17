/**
 * Phase 12: Events & Seasons — Event Data Models
 * GameEvent, EventMechanics, EventChallenge, EventModifier, TileOverride
 */

import type { SeasonId, EventType, EventLifecycle, EventMechanicType, ChallengeType, VfxType, EventModifierType, Rarity } from './eventTypes';
import type { EventReward, EventShopItem } from './rewardModel';

/**
 * Event milestone (progressive reward)
 */
export interface EventMilestone {
  threshold: number; // e.g., 100, 500, 1000 event currency earned
  reward: EventReward;
  reached: boolean;
  reachedAt: string | null; // ISO 8601
}

/**
 * Individual challenge task within an event
 */
export interface EventChallenge {
  id: string;
  description: string;
  type: ChallengeType;
  target: number;
  progress: number;
  completed: boolean;
  reward: EventReward;
}

/**
 * Active event modifier
 */
export interface EventModifier {
  type: EventModifierType;
  value: number;
  description: string;
}

/**
 * Tile visual override for events
 */
export interface TileOverride {
  tileType: string; // matches existing tile types
  skin: string; // texture/model variant id
  label?: string; // override display name
  particleEffect?: string;
}

/**
 * Collection event mechanics
 */
export interface CollectionMechanics {
  items: {
    id: string;
    name: string;
    icon: string;
    rarity: Rarity;
  }[];
  collected: Record<string, number>; // itemId → count
  goal: Record<string, number>; // itemId → target
}

/**
 * Challenge event mechanics
 */
export interface ChallengeMechanics {
  tasks: EventChallenge[];
}

/**
 * Multiplier event mechanics
 */
export interface MultipierMechanics {
  target: 'income' | 'dice' | 'xp' | 'all';
  value: number; // 1.5 = +50%
}

/**
 * Event mechanics union type
 */
export interface EventMechanics {
  type: EventMechanicType;
  collectibles?: CollectionMechanics;
  challenges?: ChallengeMechanics;
  multiplier?: MultipierMechanics;
}

/**
 * Core GameEvent interface for limited-time events
 */
export interface GameEvent {
  id: string; // "halloween-heist-2025"
  type: EventType;
  name: string;
  description: string;
  shortDescription: string; // for HUD display
  icon: string; // emoji or icon path
  seasonId: string | null; // parent season reference (null = standalone)

  // Timing
  startDate: string; // ISO 8601
  endDate: string;
  lifecycle: EventLifecycle; // derived at runtime

  // Mechanics
  mechanics: EventMechanics;

  // Rewards
  rewards: EventReward[];
  milestoneRewards: EventMilestone[];

  // Modifiers (applied while event is active)
  modifiers: EventModifier[];

