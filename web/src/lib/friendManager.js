/**
 * Friend Manager
 * Handles friend CRUD, invite codes, and city snapshots
 * Offline-first: uses localStorage
 */

import { notifyFriendMilestone } from './notificationManager';

const FRIENDS_KEY = 'cs_friends_v1';
const INVITE_CODE_KEY = 'cs_player_code_v1';
const USER_PROFILE_KEY = 'cs_user_profile_v1';

// Valid characters for invite codes (excludes 0, O, I, L)
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

/**
 * Get or create user's invite code
 * @returns {string} User's invite code
 */
export const getUserInviteCode = () => {
  let code = localStorage.getItem(INVITE_CODE_KEY);
  if (!code) {
    code = generateInviteCode();
    // Check for collision (unlikely but possible)
    while (checkCodeExistsInFriends(code)) {
      code = generateInviteCode();
    }
    localStorage.setItem(INVITE_CODE_KEY, code);
  }
  return code;
};

/**
 * Check if a code already exists in friends list
 * @param {string} code - Code to check
 * @returns {boolean}
 */
const checkCodeExistsInFriends = (code) => {
  const friends = getFriends();
  return friends.some(f => f.code === code);
};

/**
 * Get user's profile (creates if missing)
 * @returns {Object} User profile
 */
export const getUserProfile = () => {
  const profile = localStorage.getItem(USER_PROFILE_KEY);
  if (!profile) {
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
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(newProfile));
    return newProfile;
  }
  return JSON.parse(profile);
};

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 * @returns {Object} Updated profile
 */
export const updateUserProfile = (updates) => {
  const profile = getUserProfile();
  const updated = { ...profile, ...updates, lastActive: Date.now() };
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * Get all friends
 * @returns {Array} List of friends
 */
export const getFriends = () => {
  const friends = localStorage.getItem(FRIENDS_KEY);
  return friends ? JSON.parse(friends) : [];
};

/**
 * Add a friend by invite code
 * @param {string} code - Friend's invite code
 * @param {Object} friendData - Friend data (from QR scan or manual entry)
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
  
  friends.push(newFriend);
  localStorage.setItem(FRIENDS_KEY, JSON.stringify(friends));
  
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
  localStorage.setItem(FRIENDS_KEY, JSON.stringify(filtered));
  return filtered.length < friends.length;
};

/**
 * Update friend's data (e.g., after visiting their city)
 * @param {string} friendId - Friend's ID
 * @param {Object} updates - Data updates
 * @returns {Object|null} Updated friend or null
 */
export const updateFriend = (friendId, updates) => {
  const friends = getFriends();
  const index = friends.findIndex(f => f.id === friendId);
  if (index === -1) return null;
  
  friends[index] = { ...friends[index], ...updates, lastActive: Date.now() };
  localStorage.setItem(FRIENDS_KEY, JSON.stringify(friends));
  return friends[index];
};

/**
 * Save friend's city snapshot
 * @param {string} friendId - Friend's ID
 * @param {Object} cityData - City state snapshot
 * @returns {Object|null} Updated friend
 */
export const saveFriendCitySnapshot = (friendId, cityData) => {
  return updateFriend(friendId, {
    citySnapshot: {
      ...cityData,
      capturedAt: Date.now()
    }
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
  localStorage.removeItem(FRIENDS_KEY);
};

/**
 * Get friend count
 * @returns {number}
 */
export const getFriendCount = () => {
  return getFriends().length;
};

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
 * Makes the leaderboard feel alive by progressing simulated friends
 * @param {number} playerLevel - Current player level to keep friends relevant
 */
export const simulateFriendGrowth = (playerLevel = 1) => {
  const friends = getFriends();
  let updated = false;

  const updatedFriends = friends.map(friend => {
    // 30% chance of a "growth spurt" per simulation run
    if (Math.random() < 0.3) {
      updated = true;
      const oldLevel = friend.level;
      
      // Friends stay roughly in the player's orbit (Level range: playerLevel +/- 3)
      const targetLevel = Math.max(1, playerLevel + (Math.floor(Math.random() * 7) - 3));
      
      // Simulate leveling up if behind target
      if (friend.level < targetLevel) {
        friend.level += 1;
        friend.netWorth += Math.floor(Math.random() * 5000 * friend.level);
        
        // Notify the player of significant progress
        if (friend.level > oldLevel) {
          notifyFriendMilestone(friend, 'level_up', friend.level.toString());
        }
      } else {
        // Just increase net worth
        friend.netWorth += Math.floor(Math.random() * 2000 * friend.level);
      }
      
      friend.lastActive = Date.now();
    }
    return friend;
  });

  if (updated) {
    localStorage.setItem(FRIENDS_KEY, JSON.stringify(updatedFriends));
  }
  return updatedFriends;
};
