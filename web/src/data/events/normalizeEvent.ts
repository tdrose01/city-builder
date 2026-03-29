// web/src/data/events/normalizeEvent.ts
import { GameEvent } from './eventModel';
import { CommunityEvent } from './communityEventModel';
import { EventType, EventLifecycle } from './eventTypes';
import { EventReward } from './rewardModel';
import { EventMechanics } from './eventModel';
import { EventModifier } from './eventModel';
import { TileOverride } from './eventModel';
import { EventMilestone } from './rewardModel';
import { CommunityMilestone } from './communityEventModel';
import { ContributionTier } from './communityEventModel';
import { EventShopItem } from './rewardModel';

/**
 * Type alias for a fully normalized event (either GameEvent or CommunityEvent)
 */
export type NormalizedEvent = GameEvent | CommunityEvent;

/**
 * Normalizes an event object to ensure it has a string id and safe defaults for all required fields.
 * Works for both GameEvent and CommunityEvent types.
 * @param event - The event to normalize (can be partial)
 * @returns The normalized event with string id and safe defaults
 */
export function normalizeEvent<T extends Partial<GameEvent> | Partial<CommunityEvent>>(event: T): T {
  if (!event) {
    // Return a minimal valid event if null/undefined
    return {
      id: generateId(),
      // We'll fill in required fields based on type detection below
    } as T;
  }

  const normalized = { ...event };

  // Ensure id is a string
  if (normalized.id == null || typeof normalized.id !== 'string') {
    normalized.id = generateId();
  }

  // Determine event type by checking for fields that exist in one but not the other
  // GameEvent specific fields: type, mechanics, rewards, milestoneRewards, modifiers, missionIds, shopItems, vfxType, tileOverrides
  // CommunityEvent specific fields: globalGoal, playerContribution, contributionRewards, progressBarColor
  const isGameEvent = ('type' in normalized && 
                      'mechanics' in normalized && 
                      'rewards' in normalized &&
                      'modifiers' in normalized);
  const isCommunityEvent = ('globalGoal' in normalized &&
                           'playerContribution' in normalized &&
                           'contributionRewards' in normalized);

  if (isGameEvent) {
    // Normalize GameEvent
    normalizeGameEvent(normalized as Partial<GameEvent>);
  } else if (isCommunityEvent) {
    // Normalize CommunityEvent
    normalizeCommunityEvent(normalized as Partial<CommunityEvent>);
  } else {
    // If we can't determine type, treat as GameEvent with minimal defaults
    normalizeGameEvent(normalized as Partial<GameEvent>);
  }

  return normalized;
}

/**
 * Generate a unique ID string
 */
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Normalize GameEvent with safe defaults
 */
function normalizeGameEvent(event: Partial<GameEvent>): void {
  // Required fields with safe defaults
  if (event.type == null) event.type = 'limited_time' as const;
  if (event.name == null) event.name = 'Unnamed Event';
  if (event.description == null) event.description = '';
  if (event.shortDescription == null) event.shortDescription = '';
  if (event.icon == null) event.icon = '🎉';
  if (event.seasonId == null) event.seasonId = null;
  if (event.startDate == null) event.startDate = new Date().toISOString();
  if (event.endDate == null) event.endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days from now
  if (event.lifecycle == null) event.lifecycle = 'upcoming' as const;
  
  // Mechanics
  if (event.mechanics == null) {
    event.mechanics = {
      type: 'bonus_multiplier',
      multiplier: {
        target: 'income' as const,
        value: 1.0
      }
    };
  } else {
    // Ensure mechanics subfields
    if (event.mechanics.type == null) event.mechanics.type = 'bonus_multiplier';
    if (event.mechanics.type === 'bonus_multiplier' && event.mechanics.multiplier == null) {
      event.mechanics.multiplier = {
        target: 'income' as const,
        value: 1.0
      };
    }
    // For other types, we could add more default logic, but for now just ensure the type is set
  }

  // Arrays
  if (event.rewards == null) event.rewards = [];
  if (event.milestoneRewards == null) event.milestoneRewards = [];
  if (event.modifiers == null) event.modifiers = [];
  if (event.missionIds == null) event.missionIds = [];
  if (event.shopItems == null) event.shopItems = [];
  if (event.tileOverrides == null) event.tileOverrides = [];

  // Other fields
  if (event.bannerImage == null) event.bannerImage = null;
  if (event.vfxType == null) event.vfxType = null;
}

/**
 * Normalize CommunityEvent with safe defaults
 */
function normalizeCommunityEvent(event: Partial<CommunityEvent>): void {
  // Required fields with safe defaults
  if (event.name == null) event.name = 'Unnamed Community Event';
  if (event.description == null) event.description = '';
  if (event.icon == null) event.icon = '🤝';
  if (event.seasonId == null) event.seasonId = null;
  if (event.startDate == null) event.startDate = new Date().toISOString();
  if (event.endDate == null) event.endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days from now
  if (event.lifecycle == null) event.lifecycle = 'upcoming' as const;
  
  // Global Goal
  if (event.globalGoal == null) {
    event.globalGoal = {
      metric: 'total_funds_earned' as const,
      targetValue: 1000000,
      currentValue: 0,
      milestones: []
    };
  } else {
    if (event.globalGoal.metric == null) event.globalGoal.metric = 'total_funds_earned' as const;
    if (event.globalGoal.targetValue == null) event.globalGoal.targetValue = 1000000;
    if (event.globalGoal.currentValue == null) event.globalGoal.currentValue = 0;
    if (event.globalGoal.milestones == null) event.globalGoal.milestones = [];
  }
  
  // Individual Contribution
  if (event.playerContribution == null) event.playerContribution = 0;
  if (event.contributionRewards == null) event.contributionRewards = [];
  
  // Display
  if (event.bannerImage == null) event.bannerImage = null;
  if (event.progressBarColor == null) event.progressBarColor = '#3B82F6'; // blue-500
}