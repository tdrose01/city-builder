/**
 * Social Adapter - Backward compatibility layer
 * Re-exports new managers with old API signatures
 * Allows gradual migration without breaking existing components
 */

// Re-export from new location with same API
export {
  getUserProfile,
  getFriendById,
  getFriends,
  getSortedFriends,
  addFriend,
  updateFriend,
  simulateFriendGrowth,
  getUserInviteCode,
  addFriendByCode,
} from '../social/friendManager';

export {
  GIFT_TYPES,
  GIFT_CONSTANTS,
  getAllGifts,
  getDailyGiftsCount,
  getPendingGifts,
  getSentGifts,
  getReceivedGifts,
  canSendGift,
  canReceiveGift,
  checkDailyReset,
  sendGift,
  receiveGift,
  getGiftStats,
} from '../social/giftManager';

// Streak helpers
export { getFriendStreak } from '../social/friendManager';

// Migration trigger (run once on app init)
import { migrateAllFromV1 } from '../social';
export { migrateAllFromV1 };
