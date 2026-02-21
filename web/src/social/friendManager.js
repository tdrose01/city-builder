/**
 * Friend Manager v2 - Event-driven, store-backed
 * Clean boundaries: only friend CRUD + streak tracking
 */

import { useSocialStore } from '../store/useSocialStore';

// Constants
export const SOCIAL_CONFIG = {
  MAX_FRIENDS: 50,
  INVITE_CODE_LENGTH: 8,
};

// Read-only selectors
export const getUserProfile = () => useSocialStore.getState().userProfile;

export const getFriendById = (id) => useSocialStore.getState().getFriendById(id);

export const getFriends = () => Object.values(useSocialStore.getState().friends);

export const getSortedFriends = () => useSocialStore.getState().getSortedFriends();

// Streak helpers
export const getFriendStreak = (friendId) => {
  const streaks = useSocialStore.getState().friendStreaks;
  return (
    streaks[friendId] || {
      current: 0,
      lastExchangeDate: null,
    }
  );
};

// Actions
export const setUserProfile = (updates) => {
  useSocialStore.getState().setUserProfile(updates);
};

export const addFriend = (friend) => {
  const { addFriend: addToStore } = useSocialStore.getState();

  const enrichedFriend = {
    id: friend.id || `friend-${Date.now()}`,
    name: friend.name || 'Friend',
    avatar: friend.avatar || '🧑',
    netWorth: friend.netWorth || 0,
    level: friend.level || 1,
    streak: 0,
    addedAt: Date.now(),
    ...friend,
  };

  addToStore(enrichedFriend);
  return enrichedFriend;
};

export const updateFriend = (id, updates) => {
  useSocialStore.getState().updateFriend(id, updates);
};

export const removeFriend = (id) => {
  useSocialStore.getState().removeFriend(id);
};

export const simulateFriendGrowth = (currentNetWorth) => {
  // Simulate passive growth of friends
  const friends = getFriends();
  const growthFactor = 0.05; // 5% growth per simulation

  friends.forEach((friend) => {
    if (friend.isBot && Math.random() < 0.3) {
      const growth = Math.floor((friend.netWorth || 1000) * growthFactor);
      updateFriend(friend.id, {
        netWorth: (friend.netWorth || 0) + growth,
      });
    }
  });
};

// Invite code helpers
export const getUserInviteCode = () => {
  const profile = getUserProfile();
  return profile.inviteCode || generateInviteCode();
};

const generateInviteCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < SOCIAL_CONFIG.INVITE_CODE_LENGTH; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

export const addFriendByCode = (code) => {
  // Mock implementation - would check server in real app
  const mockFriend = {
    id: `mock-${code}`,
    name: `Friend ${code.slice(0, 4)}`,
    avatar: ['🧑', '👩', '👤', '🤖'][Math.floor(Math.random() * 4)],
    netWorth: 5000 + Math.floor(Math.random() * 5000),
    level: Math.floor(Math.random() * 5) + 1,
    code,
    isBot: true,
  };

  addFriend(mockFriend);
  return mockFriend;
};

// Data migration from old format (v1 to v2)
export const migrateFromV1 = () => {
  const v1Friends = localStorage.getItem('cs_friends_v1');
  if (v1Friends) {
    try {
      const friends = JSON.parse(v1Friends);
      Object.values(friends).forEach((friend) => {
        if (friend.id && !useSocialStore.getState().friends[friend.id]) {
          addFriend(friend);
        }
      });
      // Mark migration complete
      localStorage.setItem('cs_social_migrated_v1', 'true');
    } catch (e) {
      console.error('Migration failed:', e);
    }
  }
};
