/**
 * Gift Manager (Event-Driven Refactor)
 * Compatible API surface with Phase A architecture
 * Uses SocialStore for state management
 */

import { useSocialStore } from '../social/core/SocialStore';
import storageAdapter, { STORAGE_KEYS } from '../social/repository/LocalStorageAdapter';
import { getUserProfile, getFriendById, updateFriend, getFriends } from './friendManager';

// Gift economy constants
export const GIFT_CONSTANTS = {
  DAILY_GIFTS_LIMIT_SENT: 5,
  DAILY_GIFTS_LIMIT_RECEIVED: 5,
  GIFT_DICE_AMOUNT: 5,
  GIFT_FUNDS_PERCENTAGE: 0.1, // 10% of avg tile reward
  GIFT_SHIELD_AMOUNT: 1,
  GIFT_SHIELD_COST_WEEKS: 1 // Shields cost weeks of streak
};

// Gift types configuration
export const GIFT_TYPES = {
  dice: {
    id: 'dice',
    name: 'Dice Pack',
    emoji: '🎲',
    description: '5 Extra dice',
    getValue: () => GIFT_CONSTANTS.GIFT_DICE_AMOUNT
  },
  funds: {
    id: 'funds',
    name: 'Funds Boost',
    emoji: '💰',
    description: '10% of average tile reward',
    getValue: (cityLevel = 1) => {
      // Base tile reward scales with city level
      const baseReward = 1000;
      const levelMultiplier = Math.pow(1.4, cityLevel - 1);
      return Math.floor(baseReward * levelMultiplier * GIFT_CONSTANTS.GIFT_FUNDS_PERCENTAGE);
    }
  },
  shield: {
    id: 'shield',
    name: 'Shield Charge',
    emoji: '🛡️',
    description: '1 Shield unit',
    getValue: () => GIFT_CONSTANTS.GIFT_SHIELD_AMOUNT
  },
  sticker_pack: {
    id: 'sticker_pack',
    name: 'Sticker Pack',
    emoji: '🎁',
    description: 'Contains 3 stickers!',
    getValue: () => ({ type: 'green', count: 3 })
  }
};

// Dynamic import for notificationManager to break circular dependency
const notifyGiftReceived = async (data) => {
  try {
    const { addNotification, NOTIFICATION_TYPES } = await import('./notificationManager');
    await addNotification(NOTIFICATION_TYPES.GIFT_RECEIVED, data);
  } catch (e) {
    console.warn('Failed to notify gift received', e);
  }
};

/**
 * Get the current UTC midnight timestamp
 * @returns {number}
 */
const getUTCMidnight = () => {
  const now = new Date();
  const utcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return utcMidnight;
};

/**
 * Helper to resync state from storage for tests that modify localStorage directly
 */
const resyncStateFromStorage = () => {
  const sent = parseInt(storageAdapter.getString(STORAGE_KEYS.GIFTS_DAILY_SENT, '0'));
  const received = parseInt(storageAdapter.getString(STORAGE_KEYS.GIFTS_DAILY_RECEIVED, '0'));
  const lastReset = storageAdapter.getString(STORAGE_KEYS.GIFTS_LAST_RESET, null);
  
  useSocialStore.setState({
    dailyGiftsSent: sent,
    dailyGiftsReceived: received,
    giftsLastReset: lastReset
  });
  
  return { sent, received, lastReset };
};

/**
 * Check and reset daily limits if needed (resets at midnight UTC)
 */
export const checkDailyReset = () => {
  const { lastReset } = resyncStateFromStorage();
  const currentUTCMidnight = getUTCMidnight();
  
  if (!lastReset || parseInt(lastReset) < currentUTCMidnight) {
    useSocialStore.setState({
      dailyGiftsSent: 0,
      dailyGiftsReceived: 0,
      giftsLastReset: currentUTCMidnight.toString()
    });
    // Write directly to storage adapter to persist limits
    storageAdapter.setString(STORAGE_KEYS.GIFTS_DAILY_SENT, '0');
    storageAdapter.setString(STORAGE_KEYS.GIFTS_DAILY_RECEIVED, '0');
    storageAdapter.setString(STORAGE_KEYS.GIFTS_LAST_RESET, currentUTCMidnight.toString());
    return true; // Reset occurred
  }
  return false; // No reset needed
};

/**
 * Get daily gifts count
 * @returns {Object} { sent: number, received: number }
 */
export const getDailyGiftsCount = () => {
  checkDailyReset();
  const store = useSocialStore.getState();
  return { sent: store.dailyGiftsSent, received: store.dailyGiftsReceived };
};

/**
 * Get all gifts (sent and received)
 * @returns {Array}
 */
export const getAllGifts = () => {
  return useSocialStore.getState().gifts || [];
};

/**
 * Get pending gifts (received but not yet claimed)
 * @returns {Array}
 */
export const getPendingGifts = () => {
  const gifts = getAllGifts();
  const profile = getUserProfile();
  if (!profile) return [];
  return gifts.filter(g => g.toId === profile.id && !g.claimed && !g.expired);
};

/**
 * Get sent gifts history
 * @returns {Array}
 */
export const getSentGifts = () => {
  const gifts = getAllGifts();
  const profile = getUserProfile();
  if (!profile) return [];
  return gifts.filter(g => g.fromId === profile.id);
};

/**
 * Get received gifts history
 * @returns {Array}
 */
export const getReceivedGifts = () => {
  const gifts = getAllGifts();
  const profile = getUserProfile();
  if (!profile) return [];
  return gifts.filter(g => g.toId === profile.id);
};

/**
 * Check if user can send more gifts today
 * @returns {boolean}
 */
export const canSendGift = () => {
  const { sent } = getDailyGiftsCount();
  return sent < GIFT_CONSTANTS.DAILY_GIFTS_LIMIT_SENT;
};

/**
 * Check if user can receive more gifts today
 * @returns {boolean}
 */
export const canReceiveGift = () => {
  const { received } = getDailyGiftsCount();
  return received < GIFT_CONSTANTS.DAILY_GIFTS_LIMIT_RECEIVED;
};

/**
 * Get all friend streaks
 * @returns {Object} Map of friendId -> streak data
 */
export const getFriendStreaks = () => {
  return useSocialStore.getState().friendStreaks || {};
};

/**
 * Get streak with specific friend
 * @param {string} friendId
 * @returns {Object} { current: number, lastExchangeDate: number }
 */
export const getFriendStreak = (friendId) => {
  const streaks = getFriendStreaks();
  return streaks[friendId] || { current: 0, lastExchangeDate: null };
};

/**
 * Update streak with a friend
 * @param {string} friendId
 * @param {string} action - 'send' or 'receive'
 */
const updateFriendStreak = (friendId, action) => {
  const streaks = getFriendStreaks();
  const now = Date.now();
  const today = new Date(now).setHours(0, 0, 0, 0);
  
  let streak = streaks[friendId] || { current: 0, lastExchangeDate: null };
  
  // Check if this is a new day from last exchange
  const lastExchangeDay = streak.lastExchangeDate ? new Date(streak.lastExchangeDate).setHours(0, 0, 0, 0) : null;
  
  if (lastExchangeDay === null || today > lastExchangeDay) {
    // First exchange of the day - increment streak
    streak.current += 1;
    streak.lastExchangeDate = now;
  }
  
  const updatedStreaks = { ...streaks, [friendId]: streak };
  
  // Update state and persistent storage
  useSocialStore.setState({ friendStreaks: updatedStreaks });
  storageAdapter.setFriendStreaks(updatedStreaks);
  
  return streak;
};

/**
 * Send a gift to a friend
 * @param {string} toFriendId - Friend's ID
 * @param {string} giftType - 'dice', 'funds', or 'shield'
 * @param {number} cityLevel - Current city level for funds calculation
 * @returns {Object} { success: boolean, gift: Object|null, error: string|null }
 */
export const sendGift = (toFriendId, giftType, cityLevel = 1) => {
  // Check daily limit
  if (!canSendGift()) {
    return { success: false, error: 'Daily gift limit reached (5/5)' };
  }
  
  // Validate gift type
  const giftConfig = GIFT_TYPES[giftType];
  if (!giftConfig) {
    return { success: false, error: 'Invalid gift type' };
  }
  
  // Get friend
  const friend = getFriendById(toFriendId);
  if (!friend) {
    return { success: false, error: 'Friend not found' };
  }
  
  const userProfile = getUserProfile();
  
  // Create gift record
  const gift = {
    id: crypto.randomUUID(),
    fromId: userProfile.id,
    fromName: userProfile.name,
    fromAvatar: userProfile.avatar,
    toId: toFriendId,
    toName: friend.name,
    type: giftType,
    value: giftConfig.getValue(cityLevel),
    sentAt: Date.now(),
    claimed: false,
    expired: false,
    streakBefore: getFriendStreak(toFriendId).current
  };
  
  // Save gift
  const gifts = [...getAllGifts()];
  gifts.push(gift);
  
  // Limit stored gifts to last 100
  if (gifts.length > 100) {
    gifts.splice(0, gifts.length - 100);
  }
  
  useSocialStore.getState().updateGifts(gifts);
  
  // Increment daily sent count
  const store = useSocialStore.getState();
  const newSent = store.dailyGiftsSent + 1;
  useSocialStore.setState({ dailyGiftsSent: newSent });
  storageAdapter.setString(STORAGE_KEYS.GIFTS_DAILY_SENT, newSent.toString());
  
  // Update streak
  const streak = updateFriendStreak(toFriendId, 'send');
  
  // Update friend record with gift sent flag
  updateFriend(toFriendId, { 
    lastGiftSentAt: Date.now(),
    streak: streak.current
  });
  
  return { success: true, gift, streak };
};

/**
 * Receive/claim a gift
 * @param {string} giftId
 * @returns {Object} { success: boolean, gift: Object|null, error: string|null, reward: Object|null }
 */
export const receiveGift = (giftId) => {
  // Check daily limit
  if (!canReceiveGift()) {
    return { success: false, error: 'Daily receive limit reached (5/5)' };
  }
  
  const gifts = [...getAllGifts()];
  const giftIndex = gifts.findIndex(g => g.id === giftId);
  
  if (giftIndex === -1) {
    return { success: false, error: 'Gift not found' };
  }
  
  const gift = gifts[giftIndex];
  
  // Check if already claimed
  if (gift.claimed) {
    return { success: false, error: 'Gift already claimed' };
  }
  
  // Mark as claimed
  gift.claimed = true;
  gift.claimedAt = Date.now();
  gifts[giftIndex] = gift;
  useSocialStore.getState().updateGifts(gifts);
  
  // Increment daily received count
  const store = useSocialStore.getState();
  const newReceived = store.dailyGiftsReceived + 1;
  useSocialStore.setState({ dailyGiftsReceived: newReceived });
  storageAdapter.setString(STORAGE_KEYS.GIFTS_DAILY_RECEIVED, newReceived.toString());
  
  // Update streak with sender
  const streak = updateFriendStreak(gift.fromId, 'receive');
  
  // Return reward info
  const reward = {
    type: gift.type,
    value: gift.value,
    fromName: gift.fromName,
    streak: streak.current
  };
  
  return { success: true, gift, streak, reward };
};

/**
 * Get gift statistics
 * @returns {Object}
 */
export const getGiftStats = () => {
  const gifts = getAllGifts();
  const profile = getUserProfile();
  
  return {
    totalSent: gifts.filter(g => g.fromId === profile.id).length,
    totalReceived: gifts.filter(g => g.toId === profile.id).length,
    pendingCount: getPendingGifts().length,
    streaks: getFriendStreaks(),
    daily: getDailyGiftsCount()
  };
};

/**
 * Simulate incoming gifts from friends (Reciprocity Engine)
 * High Frequency version: ~75% chance per active friend
 */
export const simulateIncomingGifts = (cityLevel = 1) => {
  const friends = getFriends();
  const userProfile = getUserProfile();
  const { received } = getDailyGiftsCount();
  const streaks = getFriendStreaks();
  
  let remainingCapacity = GIFT_CONSTANTS.DAILY_GIFTS_LIMIT_RECEIVED - received;
  if (remainingCapacity <= 0) return [];

  const incomingGifts = [];
  const gifts = [...getAllGifts()];

  // Filter for friends you've interacted with (sent gifts to)
  const activeFriends = friends
    .filter(f => f.lastGiftSentAt)
    .sort((a, b) => (streaks[b.id]?.current || 0) - (streaks[a.id]?.current || 0));

  for (const friend of activeFriends) {
    if (remainingCapacity <= 0) break;

    // High Frequency: 75% base chance + streak bonus
    const streak = streaks[friend.id]?.current || 0;
    const chance = 0.75 + (streak * 0.05);
    
    if (Math.random() < chance) {
      // Determine gift type based on streak
      let giftType = 'funds';
      const roll = Math.random();
      
      if (streak >= 7 && roll > 0.4) giftType = 'sticker_pack';
      else if (streak >= 3 && roll > 0.6) giftType = 'dice';
      else if (roll > 0.8) giftType = 'shield';
      else if (roll > 0.5) giftType = 'dice';

      const giftConfig = GIFT_TYPES[giftType];
      
      const gift = {
        id: crypto.randomUUID(),
        fromId: friend.id,
        fromName: friend.name,
        fromAvatar: friend.avatar,
        toId: userProfile.id,
        toName: userProfile.name,
        type: giftType,
        value: giftConfig.getValue(cityLevel),
        sentAt: Date.now() - Math.floor(Math.random() * 3600000), // Randomized in last hour
        claimed: false,
        expired: false,
        isSimulated: true
      };

      gifts.push(gift);
      incomingGifts.push(gift);
      remainingCapacity--;

      // Notify the player
      notifyGiftReceived({
        title: 'Gift Received!',
        message: `${friend.name} sent you ${giftConfig.name}!`,
        friendId: friend.id,
        friendName: friend.name,
        giftId: gift.id,
        giftType: giftType,
        emoji: giftConfig.emoji
      });
    }
  }

  if (incomingGifts.length > 0) {
    useSocialStore.getState().updateGifts(gifts.slice(-100));
    // Note: We don't increment GIFTS_DAILY_RECEIVED here because it's incremented when the user CLAIMS it in receiveGift()
    // This allows the user to see them in the UI before they count against the limit.
  }

  return incomingGifts;
};