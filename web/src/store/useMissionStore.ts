import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DailyMissionState, ActiveMission, MissionType } from '../data/missions/missionTypes';
import { getRandomMissions } from '../data/missions/missionData';

interface MissionStoreActions {
  checkDailyReset: () => void;
  updateMissionProgress: (type: MissionType, amount: number) => void;
  claimMissionReward: (missionId: string) => ActiveMission | null;
  claimBonusChest: () => boolean;
  rerollMission: (missionId: string, cost: number) => boolean;
  claimStreakReward: (milestone: number) => { type: string, amount: number, packType?: string } | null;
}

export const STREAK_MILESTONES = [
  { day: 2, reward: { type: 'dice', amount: 25 } },
  { day: 7, reward: { type: 'dice', amount: 100, packType: 'green' } },
  { day: 14, reward: { type: 'xp', amount: 1000, packType: 'blue' } },
  { day: 30, reward: { type: 'dice', amount: 500, packType: 'purple' } }
];

interface MissionStoreState extends DailyMissionState, MissionStoreActions {
  claimedStreakMilestones: number[];
}

export const useMissionStore = create<MissionStoreState>()(
  persist(
    (set, get) => ({
      activeMissions: [],
      lastResetAt: new Date(0).toISOString(), // Never reset
      currentStreak: 0,
      streakClaimedToday: false,
      bonusChestClaimed: false,
      claimedStreakMilestones: [],

      checkDailyReset: () => {
        const now = new Date();
        const lastReset = new Date(get().lastResetAt);
        
        // Check if it's a new calendar day
        const isNewDay = now.toDateString() !== lastReset.toDateString();

        if (isNewDay) {
          const { bonusChestClaimed, currentStreak } = get();
          
          // Determine if streak should continue or break
          // Streak breaks if they didn't finish yesterday's missions
          let nextStreak = currentStreak;
          if (!bonusChestClaimed && currentStreak > 0) {
            nextStreak = 0;
            console.log("Streak broken! Missions not completed yesterday.");
          }

          const newMissions = getRandomMissions(3).map(m => ({
            ...m,
            progress: 0,
            completed: false,
            claimed: false
          }));

          set({
            activeMissions: newMissions,
            lastResetAt: now.toISOString(),
            bonusChestClaimed: false,
            currentStreak: nextStreak,
            claimedStreakMilestones: nextStreak === 0 ? [] : get().claimedStreakMilestones
          });
          console.log("Daily missions reset!");
        }
      },

      updateMissionProgress: (type: MissionType, amount: number) => {
        set((state) => {
          let changed = false;
          const updatedMissions = state.activeMissions.map(m => {
            if (m.type === type && !m.completed) {
              const newProgress = Math.min(m.target, m.progress + amount);
              if (newProgress !== m.progress) {
                changed = true;
                return {
                  ...m,
                  progress: newProgress,
                  completed: newProgress >= m.target
                };
              }
            }
            return m;
          });

          return changed ? { activeMissions: updatedMissions } : state;
        });
      },

      claimMissionReward: (missionId: string) => {
        const { activeMissions } = get();
        const mission = activeMissions.find(m => m.id === missionId);

        if (mission && mission.completed && !mission.claimed) {
          const updatedMissions = activeMissions.map(m => 
            m.id === missionId ? { ...m, claimed: true } : m
          );
          
          set({ activeMissions: updatedMissions });
          return mission;
        }
        return null;
      },

      claimBonusChest: () => {
        const { activeMissions, bonusChestClaimed } = get();
        const allCompleted = activeMissions.every(m => m.completed);

        if (allCompleted && !bonusChestClaimed) {
          set((state) => ({
            bonusChestClaimed: true,
            currentStreak: state.currentStreak + 1
          }));
          return true;
        }
        return false;
      },

      rerollMission: (missionId: string, cost: number) => {
        // Implementation for rerolling a specific mission
        const { activeMissions } = get();
        const newMissions = getRandomMissions(1);
        const updated = activeMissions.map(m => 
          m.id === missionId ? { ...newMissions[0], progress: 0, completed: false, claimed: false } : m
        );
        
        set({ activeMissions: updated });
        return true;
      }
    }),
    {
      name: 'city-builder-missions',
    }
  )
);
