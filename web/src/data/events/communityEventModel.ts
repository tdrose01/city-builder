/**
 * Phase 12: Events & Seasons — Community Event Data Models
 * CommunityEvent, CommunityMilestone, ContributionTier interfaces
 */

import type { SeasonId, EventLifecycle, CommunityMetric } from './eventTypes';
import type { EventReward } from './rewardModel';

/**
 * Global milestone reachable by community
 */
export interface CommunityMilestone {
  threshold: number; // when global reaches this
  reward: EventReward; // everyone gets this
  reached: boolean;
  reachedAt: string | null; // ISO 8601
}

/**
 * Individual contribution tier reward
 */
export interface ContributionTier {
  minContribution: number; // player must contribute at least this
  reward: EventReward;
  claimed: boolean;
}

/**
 * Global goal structure
 */
export interface GlobalGoal {
  metric: CommunityMetric;
  targetValue: number; // e.g. 10,000,000,000
  currentValue: number; // simulated aggregate
  milestones: CommunityMilestone[];
}

/**
 * Player contribution tracking
 */
export interface PlayerContribution {
  amount: number; // total contributed
  contributionRewards: ContributionTier[];
}

/**
 * Core CommunityEvent interface
 * World events where all players contribute to shared milestones
 */
export interface CommunityEvent {
  id: string; // "golden-tower-spring-2025"
  name: string;
  description: string;
  icon: string;
  seasonId: string | null;

  // Timing
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  lifecycle: EventLifecycle;

  // Global Goal
  globalGoal: GlobalGoal;

  // Individual Contribution
  playerContribution: number;
  contributionRewards: ContributionTier[];

  // Display
  bannerImage: string | null;
  progressBarColor: string;
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
