import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MasteryBonus {
  type: 'start_payout' | 'max_shields' | 'xp_boost' | 'dice_discount' | 'event_boost';
  value: number;
}

interface MasteryStore {
  masteredLandmarks: Record<string, boolean>; // key format: "cityIndex-tileId"
  addMastery: (cityId: number, tileId: number) => void;
  getMasteryBuffs: (citiesConfig: any) => Record<string, number>;
}

export const useMasteryStore = create<MasteryStore>()(
  persist(
    (set, get) => ({
      masteredLandmarks: {},

      addMastery: (cityId, tileId) => {
        const key = `${cityId}-${tileId}`;
        set((state) => ({
          masteredLandmarks: { ...state.masteredLandmarks, [key]: true }
        }));
      },

      getMasteryBuffs: (citiesConfig) => {
        const { masteredLandmarks } = get();
        const buffs: Record<string, number> = {
          start_payout: 0,
          max_shields: 0,
          xp_boost: 0,
          dice_discount: 0,
          event_boost: 0
        };

        Object.keys(masteredLandmarks).forEach(key => {
          const [cityId, tileId] = key.split('-').map(Number);
          const landmark = citiesConfig[cityId]?.tiles.find((t: any) => t.id === tileId);
          
          if (landmark?.masteryBonus) {
            buffs[landmark.masteryBonus.type] += landmark.masteryBonus.value;
          }
        });

        return buffs;
      }
    }),
    {
      name: 'city-builder-mastery',
    }
  )
);
