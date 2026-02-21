// web/src/data/missions/missionTypes.ts

export type MissionType = 
  | 'roll'            // Roll X times
  | 'earn'            // Earn $X total
  | 'upgrade'         // Upgrade X landmarks
  | 'heist'           // Land on X Heist tiles
  | 'shutdown'        // Land on X Shutdown tiles
  | 'sticker_send'    // Send X stickers to friends
  | 'funds_tile'      // Land on X Funds tiles
  | 'combo';          // Reach a X combo

export interface Mission {
  id: string;
  type: MissionType;
  description: string;
  target: number;
  reward: {
    type: 'funds' | 'dice' | 'xp' | 'sticker_pack';
    amount?: number;
    packType?: 'green' | 'blue';
  };
}

export interface ActiveMission extends Mission {
  progress: number;
  completed: boolean;
  claimed: boolean;
}

export interface DailyMissionState {
  activeMissions: ActiveMission[];
  lastResetAt: string;        // ISO timestamp
  currentStreak: number;
  streakClaimedToday: boolean;
  bonusChestClaimed: boolean; // For completing all 3
}
