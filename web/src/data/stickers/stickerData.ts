// web/src/data/stickers/stickerData.ts
import { StickerSet } from './stickerTypes';

export const STICKER_SETS: StickerSet[] = [
  {
    id: 'set-summer-vibes',
    name: 'Summer Vibes',
    description: 'The heat is on in City Slacker!',
    reward: { type: 'dice', amount: 250 },
    stickers: [
      { id: 'stk-summer-1', setId: 'set-summer-vibes', name: 'Beach Ball', icon: '🏐', rarity: 1, description: 'Bouncy fun!' },
      { id: 'stk-summer-2', setId: 'set-summer-vibes', name: 'Ice Cream', icon: '🍦', rarity: 1, description: 'Cool down.' },
      { id: 'stk-summer-3', setId: 'set-summer-vibes', name: 'Sunnies', icon: '🕶️', rarity: 2, description: 'Too cool for school.' },
      { id: 'stk-summer-4', setId: 'set-summer-vibes', name: 'Surfboard', icon: '🏄', rarity: 3, description: 'Catch a wave.' },
      { id: 'stk-summer-5', setId: 'set-summer-vibes', name: 'Golden Sun', icon: '🌞', rarity: 4, description: 'The ultimate shine.' }
    ]
  },
  {
    id: 'set-city-life',
    name: 'City Life',
    description: 'Daily hustle and bustle.',
    reward: { type: 'funds', amount: 50000 },
    stickers: [
      { id: 'stk-city-1', setId: 'set-city-life', name: 'Taxi Cab', icon: '🚕', rarity: 1, description: 'Going uptown?' },
      { id: 'stk-city-2', setId: 'set-city-life', name: 'Hotdog Stand', icon: '🌭', rarity: 2, description: 'Street side snack.' },
      { id: 'stk-city-3', setId: 'set-city-life', name: 'Subway Map', icon: '🗺️', rarity: 2, description: 'Don\'t get lost.' },
      { id: 'stk-city-4', setId: 'set-city-life', name: 'Skyscraper', icon: '🏙️', rarity: 4, description: 'Reach for the clouds.' },
      { id: 'stk-city-5', setId: 'set-city-life', name: 'City Key', icon: '🔑', rarity: 5, description: 'Unlock the potential.' }
    ]
  },
  {
    id: 'set-urban-critters',
    name: 'Urban Critters',
    description: 'The real owners of the city.',
    reward: { type: 'power_up', id: 'mega_multiplier', amount: 3 },
    stickers: [
      { id: 'stk-critter-1', setId: 'set-urban-critters', name: 'Trash Raccoon', icon: '🦝', rarity: 2, description: 'King of the bin.' },
      { id: 'stk-critter-2', setId: 'set-urban-critters', name: 'Pigeon', icon: '🐦', rarity: 2, description: 'Sky rat or city bird?' },
      { id: 'stk-critter-3', setId: 'set-urban-critters', name: 'Stray Cat', icon: '🐈', rarity: 3, description: 'Always watching.' },
      { id: 'stk-critter-4', setId: 'set-urban-critters', name: 'Fox', icon: '🦊', rarity: 4, description: 'Nighttime visitor.' },
      { id: 'stk-critter-5', setId: 'set-urban-critters', name: 'Golden Rat', icon: '🐀', rarity: 5, description: 'Pure street legend.' }
    ]
  }
];

export const getStickerById = (id: string) => {
  for (const set of STICKER_SETS) {
    const found = set.stickers.find(s => s.id === id);
    if (found) return found;
  }
  return null;
};
