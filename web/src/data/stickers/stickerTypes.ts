// web/src/data/stickers/stickerTypes.ts

export type StickerRarity = 1 | 2 | 3 | 4 | 5; // 1-star to 5-star

export interface Sticker {
  id: string;
  setId: string;
  name: string;
  icon: string;         // Emoji or asset path
  rarity: StickerRarity;
  description: string;
}

export interface StickerSet {
  id: string;
  name: string;
  description: string;
  stickers: Sticker[];
  reward: {
    type: 'funds' | 'dice' | 'building' | 'power_up';
    amount?: number;
    id?: string;        // for building/power_up
  };
}

export interface StickerAlbumState {
  owned: Record<string, number>; // stickerId -> count (to handle duplicates)
  completedSetIds: string[];
  starPower: number;             // Currency from duplicates
}
