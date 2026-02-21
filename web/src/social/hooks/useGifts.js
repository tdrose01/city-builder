import { useCallback, useEffect } from 'react';
import { useSocialStore } from '../../store/useSocialStore';
import * as giftManager from '../giftManager';

/**
 * useGifts hook - React bridge to GiftManager v2
 * Provides reactive gift data + actions with daily limits
 */
export function useGifts() {
  // Subscribe to store slices
  const gifts = useSocialStore((state) => state.gifts);
  const dailyGifts = useSocialStore((state) => state.dailyGifts);
  const userProfile = useSocialStore((state) => state.userProfile);

  // Derived state (computed from store)
  const pendingGifts = useCallback(() => {
    return gifts.filter(
      (g) => g.toId === userProfile.id && !g.claimed && !g.expired
    );
  }, [gifts, userProfile.id]);

  const sentGifts = useCallback(() => {
    return gifts.filter((g) => g.fromId === userProfile.id);
  }, [gifts, userProfile.id]);

  const receivedGifts = useCallback(() => {
    return gifts.filter((g) => g.toId === userProfile.id);
  }, [gifts, userProfile.id]);

  // Check daily reset
  useEffect(() => {
    giftManager.checkDailyReset();
  }, []);

  // Migration on mount
  useEffect(() => {
    giftManager.migrateGiftsFromV1();
  }, []);

  // Actions
  const sendGift = useCallback((toFriendId, giftType, friendStore) => {
    return giftManager.sendGift(toFriendId, giftType, friendStore);
  }, []);

  const receiveGift = useCallback((giftId) => {
    return giftManager.receiveGift(giftId);
  }, []);

  const canSend = useCallback(() => {
    return giftManager.canSendGift();
  }, []);

  const canReceive = useCallback(() => {
    return giftManager.canReceiveGift();
  }, []);

  const getStats = useCallback(() => {
    return giftManager.getGiftStats();
  }, []);

  return {
    gifts,
    pendingGifts: pendingGifts(),
    sentGifts: sentGifts(),
    receivedGifts: receivedGifts(),
    dailyGifts,
    canSend: canSend(),
    canReceive: canReceive(),
    GIFT_TYPES: giftManager.GIFT_TYPES,
    GIFT_CONSTANTS: giftManager.GIFT_CONSTANTS,
    sendGift,
    receiveGift,
    getStats,
    checkDailyReset: giftManager.checkDailyReset,
  };
}
