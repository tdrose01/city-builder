import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Sticker, StickerSet, StickerAlbumState } from '../data/stickers/stickerTypes';
import { STICKER_SETS, getStickerById } from '../data/stickers/stickerData';

interface StickerStoreActions {
  addStickers: (stickerIds: string[]) => void;
  claimSetReward: (setId: string) => void;
  getDuplicates: () => Record<string, number>;
  convertDuplicates: () => void;
  isSetComplete: (setId: string) => boolean;
  getProgress: (setId: string) => { current: number; total: number };
  // Trading Actions
  sendSticker: (stickerId: string, friendId: string) => boolean;
  receiveSticker: (stickerId: string) => void;
  // Request Actions
  generateRequest: (friendId: string, stickerId: string) => void;
  fulfillRequest: (requestId: string) => boolean;
  // Vault Actions
  purchaseVaultPack: (packType: 'rare' | 'legendary') => boolean;
}

export interface StickerRequest {
  id: string;
  friendId: string;
  stickerId: string;
  reward: number; // Dice bonus
  expiresAt: string;
}

interface StickerStoreState extends StickerAlbumState, StickerStoreActions {
  requests: StickerRequest[];
}

export const useStickerStore = create<StickerStoreState>()(
  persist(
    (set, get) => ({
      owned: {},
      completedSetIds: [],
      starPower: 0,

      addStickers: (stickerIds: string[]) => {
        set((state) => {
          const newOwned = { ...state.owned };
          stickerIds.forEach((id) => {
            newOwned[id] = (newOwned[id] || 0) + 1;
          });
          return { owned: newOwned };
        });
      },

      isSetComplete: (setId: string) => {
        const set_data = STICKER_SETS.find((s) => s.id === setId);
        if (!set_data) return false;
        const { owned } = get();
        return set_data.stickers.every((s) => owned[s.id] > 0);
      },

      getProgress: (setId: string) => {
        const set_data = STICKER_SETS.find((s) => s.id === setId);
        if (!set_data) return { current: 0, total: 0 };
        const { owned } = get();
        const current = set_data.stickers.filter((s) => owned[s.id] > 0).length;
        return { current, total: set_data.stickers.length };
      },

      claimSetReward: (setId: string) => {
        if (get().isSetComplete(setId) && !get().completedSetIds.includes(setId)) {
          set((state) => ({
            completedSetIds: [...state.completedSetIds, setId],
          }));
          // Rewards are dispatched to the main game store from the component layer
        }
      },

      getDuplicates: () => {
        const { owned } = get();
        const duplicates: Record<string, number> = {};
        Object.entries(owned).forEach(([id, count]) => {
          if (count > 1) {
            duplicates[id] = count - 1;
          }
        });
        return duplicates;
      },

      convertDuplicates: () => {
        const duplicates = get().getDuplicates();
        let totalStarPower = 0;

        Object.entries(duplicates).forEach(([id, count]) => {
          const sticker = getStickerById(id);
          if (sticker) {
            // Star Power based on rarity: 1* = 1, 2* = 3, 3* = 8, 4* = 20, 5* = 50
            const rarityWeight = [0, 1, 3, 8, 20, 50][sticker.rarity];
            totalStarPower += rarityWeight * count;
          }
        });

        set((state) => {
          const newOwned = { ...state.owned };
          Object.keys(duplicates).forEach((id) => {
            newOwned[id] = 1; // Keep only 1 of each
          });
          return {
            owned: newOwned,
            starPower: state.starPower + totalStarPower,
          };
        });
      },

      sendSticker: (stickerId: string, friendId: string) => {
        const { owned } = get();
        if ((owned[stickerId] || 0) > 1) {
          set((state) => ({
            owned: {
              ...state.owned,
              [stickerId]: state.owned[stickerId] - 1
            }
          }));
          console.log(`Sent sticker ${stickerId} to friend ${friendId}`);
          return true;
        }
        return false;
      },

      receiveSticker: (stickerId: string) => {
        set((state) => ({
          owned: {
            ...state.owned,
            [stickerId]: (state.owned[stickerId] || 0) + 1
          }
        }));
      },

      requests: [],

      generateRequest: (friendId: string, stickerId: string) => {
        const id = `req_${Date.now()}_${friendId}`;
        const newRequest: StickerRequest = {
          id,
          friendId,
          stickerId,
          reward: 15, // Default 15 dice bonus
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h expiry
        };

        set((state) => ({
          requests: [...state.requests, newRequest]
        }));
      },

      fulfillRequest: (requestId: string) => {
        const { requests, owned } = get();
        const request = requests.find(r => r.id === requestId);
        
        if (request && (owned[request.stickerId] || 0) > 1) {
          // Fulfill
          set((state) => ({
            owned: {
              ...state.owned,
              [request.stickerId]: state.owned[request.stickerId] - 1
            },
            requests: state.requests.filter(r => r.id !== requestId)
          }));
          console.log(`Fulfilled request ${requestId}. Player earned ${request.reward} dice!`);
          return true;
        }
        return false;
      },

      purchaseVaultPack: (packType: 'rare' | 'legendary') => {
        const { starPower } = get();
        const cost = packType === 'legendary' ? 500 : 100;

        if (starPower >= cost) {
          set((state) => ({
            starPower: state.starPower - cost
          }));
          return true;
        }
        return false;
      }
    }),
    {
      name: 'city-builder-stickers',
    }
  )
);
