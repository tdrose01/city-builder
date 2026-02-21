/**
 * Gift Manager v2 - Store-backed, minimal side effects
 * Pure functions for gift operations
 */

import { useSocialStore } from '../store/useSocialStore';

// Constants
export const GIFT_CONSTANTS = {
  DAILY_GIFTS_LIMIT_SENT: 5,
  DAILY_GIFTS_LIMIT_RECEIVED: 5,
  GIFT_DICE_AMOUNT: 5,
  GIFT_FUNDS_PERCENTAGE: 0.1,
  GIFT_SHIELD_AMOUNT: 1,
};

// Gift types
export const GIFT_TYPES = {
  dice: {
    id: 'dice',
    name: 'Dice Pack',
    emoji: '🎲',
    getValue: () => GIFT_CONSTANTS.GIFT_DICE_AMOUNT,
  },
  funds: {
    id: 'funds',
    name: 'Funds Boost',
    emoji: '💰',
    getValue: (cityLevel = 1) => {
      const base = 1000;
      const mult = Math.pow(1.4, cityLevel - 1);
      return Math.floor(base * mult * GIFT_CONSTANTS.GIFT_FUNDS_PERCENTAGE);
    },
  },
  shield: {
    id: 'shield',
    name: 'Shield',
    emoji: '🛡️',
    getValue: () => GIFT_CONSTANTS.GIFT_SHIELD_AMOUNT,
  },
};

// Getters
export const getAllGifts = () => useSocialStore.getState().gifts;

export const getDailyGiftsCount = () => useSocialStore.getState().dailyGifts;

export const canSendGift = () => {
  const { sent } = useSocialStore.getState().dailyGifts;
  return sent < GIFT_CONSTANTS.DAILY_GIFTS_LIMIT_SENT;
};

export const canReceiveGift = () => {
  const { received } = useSocialStore.getState().dailyGifts;
  return received < GIFT_CONSTANTS.DAILY_GIFTS_LIMIT_RECEIVED;
};

export const getPendingGifts = () =>
  useSocialStore.getState().getPendingGifts();

export const getSentGifts = () =>
  useSocialStore.getState().getSentGifts();

export const getReceivedGifts = () =>
  useSocialStore.getState().getReceivedGifts();

// Daily reset check
export const checkDailyReset = () => {
  const { dailyGifts, resetDailyGifts } = useSocialStore.getState();

  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  if (dailyGifts.lastReset < today) {
    resetDailyGifts();
    return true; // Reset occurred
  }
  return false;
};

// Actions
export const sendGift = (toFriendId, giftType, friendStore) => {
  const { getFriendById } = friendStore || useSocialStore.getState();
  const friend = getFriendById(toFriendId);
  if (!friend) {
    return { success: false, error: 'Friend not found' };
  }

  if (!canSendGift()) {
    return { success: false, error: 'Daily limit reached' };
  }

  const user = useSocialStore.getState().userProfile;
  const config = GIFT_TYPES[giftType];
  if (!config) {
    return { success: false, error: 'Invalid gift type' };
  }

  const gift = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    fromId: user.id,
    fromName: user.name,
    fromAvatar: user.avatar,
    toId: toFriendId,
    toName: friend.name,
    type: giftType,
    value: config.getValue(),
    sentAt: Date.now(),
    claimed: false,
  };

  useSocialStore.getState().addGift(gift);
  useSocialStore.getState().incrementDailySent();

  return { success: true, gift };
};

export const receiveGift = (giftId) => {
  const gift = useSocialStore
    .getState()
    .gifts.find((g) => g.id === giftId);

  if (!gift) {
    return { success: false, error: 'Gift not found' };
  }

  if (gift.claimed) {
    return { success: false, error: 'Already claimed' };
  }

  if (!canReceiveGift()) {
    return { success: false, error: 'Daily receive limit reached' };
  }

  useSocialStore.getState().updateGift(giftId, {
    claimed: true,
    claimedAt: Date.now(),
  });
  useSocialStore.getState().incrementDailyReceived();

  return {
    success: true,
    gift,
    reward: {
      type: gift.type,
      value: gift.value,
    },
  };
};

// Stats
export const getGiftStats = () => {
  const gifts = getAllGifts();
  const user = useSocialStore.getState().userProfile;

  return {
    totalSent: gifts.filter((g) => g.fromId === user.id).length,
    totalReceived: gifts.filter((g) => g.toId === user.id).length,
    pending: getPendingGifts().length,
    daily: getDailyGiftsCount(),
  };
};

// Migration from v1
export const migrateGiftsFromV1 = () => {
  const v1Gifts = localStorage.getItem('cs_gifts_v1');
  if (v1Gifts) {
    try {
      const gifts = JSON.parse(v1Gifts);
      gifts.forEach((gift) => {
        const existing = useSocialStore
          .getState()
          .gifts.find((g) => g.id === gift.id);
        if (!existing) {
          useSocialStore.getState().addGift(gift);
        }
      });
      localStorage.setItem('cs_gifts_migrated_v1', 'true');
    } catch (e) {
      console.error('Gift migration failed:', e);
    }
  }
};
