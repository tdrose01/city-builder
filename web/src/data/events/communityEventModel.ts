// web/src/data/events/communityEventModel.ts
import { EventLifecycle } from './eventTypes';
import { EventReward } from './rewardModel';

export interface CommunityEvent {
  id: string;                          // "golden-tower-spring-2025"
  name: string;
  description: string;
  icon: string;
  seasonId: string | null;

  // Timing
  startDate: string;
  endDate: string;
  lifecycle: EventLifecycle;

  // Global Goal
  globalGoal: {
    metric: 'total_funds_earned' | 'total_rolls' | 'total_buildings' | 'total_heists' | 'total_gifts';
    targetValue: number;               // e.g. 10,000,000,000
    currentValue: number;              // simulated aggregate
    milestones: CommunityMilestone[];
  };

  // Individual Contribution
  playerContribution: number;
  contributionRewards: ContributionTier[];

  // Display
  bannerImage: string | null;
  progressBarColor: string;
}

export interface CommunityMilestone {
  threshold: number;                   // when global reaches this
  reward: EventReward;                 // everyone gets this
  reached: boolean;
  reachedAt: string | null;
}

export interface ContributionTier {
  minContribution: number;             // player must contribute at least this
  reward: EventReward;
  claimed: boolean;
}
