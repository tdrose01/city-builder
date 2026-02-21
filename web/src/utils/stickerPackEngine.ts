// web/src/utils/stickerPackEngine.ts
import { STICKER_SETS } from '../data/stickers/stickerData';
import { Sticker, StickerRarity } from '../data/stickers/stickerTypes';

export type PackType = 'green' | 'blue' | 'purple'; // Common, Rare, Legendary

const RARITY_CHANCES: Record<PackType, Record<number, number>> = {
  green: { 1: 0.80, 2: 0.95, 3: 0.99, 4: 1.00, 5: 1.00 },
  blue: { 1: 0.40, 2: 0.70, 3: 0.90, 4: 0.98, 5: 1.00 },
  purple: { 1: 0.00, 2: 0.20, 3: 0.60, 4: 0.90, 5: 1.00 }
};

export const generatePack = (type: PackType, count: number = 3): Sticker[] => {
  const allStickers = STICKER_SETS.flatMap(s => s.stickers);
  const pack: Sticker[] = [];

  for (let i = 0; i < count; i++) {
    const roll = Math.random();
    let selectedRarity: StickerRarity = 1;

    const chances = RARITY_CHANCES[type];
    if (roll < chances[1]) selectedRarity = 1;
    else if (roll < chances[2]) selectedRarity = 2;
    else if (roll < chances[3]) selectedRarity = 3;
    else if (roll < chances[4]) selectedRarity = 4;
    else selectedRarity = 5;

    // Filter stickers by rarity
    const pool = allStickers.filter(s => s.rarity === selectedRarity);
    
    // Fallback if pool is empty (shouldn't happen with our data)
    const validPool = pool.length > 0 ? pool : allStickers.filter(s => s.rarity < selectedRarity);
    
    const sticker = validPool[Math.floor(Math.random() * validPool.length)];
    pack.push(sticker);
  }

  return pack;
};
