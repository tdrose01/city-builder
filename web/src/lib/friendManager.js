/**
 * Friend Manager (Event-Driven Refactor)
 * Compatible API surface with Phase A architecture
 * Now uses SocialStore as single source of truth
 */

import { useSocialStore } from '../social/core/SocialStore';
import { storageAdapter } from '../social/repository/LocalStorageAdapter';

// Dynamic import for notificationManager to break circular dependency
const notifyFriendMilestone = async (...args) => {
  const { notifyFriendMilestone: notify } = await import('./notificationManager');
  return notify(...args);
};

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/**
 * Generate a random invite code
 * @returns {string} 6-character invite code
 */
export const generateInviteCode = () => {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return code;
};

const checkCodeExistsInFriends = (code) => {
  const friends = getFriends();
  return friends.some(f => f.code === code.toUpperCase().trim());
};

/**
 * Get or create user's invite code
 * @returns {string} User's invite code
 */
export const getUserInviteCode = () => {
  const store = useSocialStore.getState();
  if (store.inviteCode) return store.inviteCode;
  
  let code = storageAdapter.getInviteCode();
  if (!code) {
    code = generateInviteCode();
    while (checkCodeExistsInFriends(code)) {
      code = generateInviteCode();
    }
    storageAdapter.setInviteCode(code);
    useSocialStore.setState({ inviteCode: code });
  } else {
    useSocialStore.setState({ inviteCode: code });
  }
  return code;
};

/**
 * Get user's profile (creates if missing)
 * @returns {Object} User profile
 */
export const getUserProfile = () => {
  const store = useSocialStore.getState();
  if (store.profile) return store.profile;
  
  const profile = storageAdapter.getUserProfile();
  if (profile) {
    useSocialStore.setState({ profile });
    return profile;
  }
  
  const newProfile = {
    id: crypto.randomUUID(),
    inviteCode: getUserInviteCode(),
    name: 'Player',
    avatar: '😎',
    level: 1,
    netWorth: 0,
    createdAt: Date.now(),
    lastActive: Date.now()
  };
  storageAdapter.setUserProfile(newProfile);
  useSocialStore.setState({ profile: newProfile });
  return newProfile;
};

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 * @returns {Object} Updated profile
 */
export const updateUserProfile = (updates) => {
  const current = getUserProfile();
  const updated = { ...current, ...updates, lastActive: Date.now() };
  storageAdapter.setUserProfile(updated);
  useSocialStore.setState({ profile: updated });
  return updated;
};

/**
 * Get all friends
 * @returns {Array} List of friends
 */
export const getFriends = () => {
  const store = useSocialStore.getState();
  return store.friends || [];
};

/**
 * Add a friend by invite code
 * @param {string} code - Friend's invite code
 * @param {Object} friendData - Friend data
 * @returns {Object} {success: boolean, friend: Object|null, error: string|null}
 */
export const addFriendByCode = (code, friendData = {}) => {
  code = code.toUpperCase().trim();
  const userCode = getUserInviteCode();
  
  if (code === userCode) {
    return { success: false, error: 'Cannot add yourself' };
  }
  
  const friends = getFriends();
  if (friends.some(f => f.code === code)) {
    return { success: false, error: 'Already friends' };
  }
  
  const newFriend = {
    id: crypto.randomUUID(),
    code,
    name: friendData.name || `Friend ${friends.length + 1}`,
    avatar: friendData.avatar || '🤖',
    level: friendData.level || 1,
    netWorth: friendData.netWorth || 0,
    lastActive: Date.now(),
    citySnapshot: friendData.citySnapshot || null
  };
  
  const updatedFriends = [...friends, newFriend];
  useSocialStore.getState().updateFriends(updatedFriends);
  
  return { success: true, friend: newFriend };
};

/**
 * Remove a friend
 * @param {string} friendId - Friend's ID
 * @returns {boolean} Success
 */
export const removeFriend = (friendId) => {
  const friends = getFriends();
  const filtered = friends.filter(f => f.id !== friendId);
  const removed = filtered.length < friends.length;
  
  if (removed) {
    useSocialStore.getState().updateFriends(filtered);
  }
  return removed;
};

/**
 * Update friend's data
 * @param {string} friendId - Friend's ID
 * @param {Object} updates - Data updates
 * @returns {Object|null} Updated friend or null
 */
export const updateFriend = (friendId, updates) => {
  const friends = getFriends();
  const index = friends.findIndex(f => f.id === friendId);
  if (index === -1) return null;
  
  const updatedFriend = { ...friends[index], ...updates, lastActive: Date.now() };
  const updatedFriends = [...friends];
  updatedFriends[index] = updatedFriend;
  
  useSocialStore.getState().updateFriends(updatedFriends);
  return updatedFriend;
};

/**
 * Save friend's city snapshot
 * @param {string} friendId - Friend's ID
 * @param {Object} cityData - City state snapshot
 * @returns {Object|null} Updated friend
 */
export const saveFriendCitySnapshot = (friendId, cityData) => {
  return updateFriend(friendId, {
    citySnapshot: { ...cityData, capturedAt: Date.now() }
  });
};

/**
 * Get friend by ID
 * @param {string} friendId - Friend's ID
 * @returns {Object|null}
 */
export const getFriendById = (friendId) => {
  const friends = getFriends();
  return friends.find(f => f.id === friendId) || null;
};

/**
 * Get sorted friends list (by net worth desc)
 * @returns {Array}
 */
export const getSortedFriends = () => {
  const friends = getFriends();
  return [...friends].sort((a, b) => b.netWorth - a.netWorth);
};

/**
 * Generate shareable invite link/text
 * @returns {string}
 */
export const getInviteText = () => {
  const code = getUserInviteCode();
  return `Join my city! Code: ${code}`;
};

/**
 * Clear all friend data (for testing)
 */
export const clearFriends = () => {
  useSocialStore.getState().updateFriends([]);
};

/**
 * Get friend count
 * @returns {number}
 */
export const getFriendCount = () => getFriends().length;

/**
 * Check if user can add more friends
 * @param {number} max - Max friends allowed
 * @returns {boolean}
 */
export const canAddMoreFriends = (max = 100) => {
  return getFriendCount() < max;
};

/**
 * Simulate background growth for friends
 * Now uses SocialStore for atomic updates
 * @param {number} playerLevel - Current player level
 */
export const simulateFriendGrowth = (playerLevel = 1) => {
  const friends = getFriends();
  let updated = false;
  const notifications = [];
  
  const updatedFriends = friends.map(friend => {
    if (Math.random() < 0.3) {
      updated = true;
      const oldLevel = friend.level;
      const targetLevel = Math.max(1, playerLevel + (Math.floor(Math.random() * 7) - 3));
      
      if (friend.level < targetLevel) {
        friend.level += 1;
        friend.netWorth += Math.floor(Math.random() * 5000 * friend.level);
        if (friend.level > oldLevel) {
          notifications.push({ friend, type: 'level_up', value: friend.level.toString() });
        }
      } else {
        friend.netWorth += Math.floor(Math.random() * 2000 * friend.level);
      }
      friend.lastActive = Date.now();
    }
    return friend;
  });
  
  if (updated) {
    useSocialStore.getState().updateFriends(updatedFriends);
    // Fire notifications async
    notifications.forEach(n => notifyFriendMilestone(n.friend, n.type, n.value));
  }
  
  return updatedFriends;
};