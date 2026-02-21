import { useCallback, useEffect } from 'react';
import { useSocialStore } from '../../store/useSocialStore';
import * as friendManager from '../friendManager';

/**
 * useFriends hook - React bridge to FriendManager v2
 * Provides reactive friend data + actions
 */
export function useFriends() {
  // Subscribe to store state
  const friends = useSocialStore((state) => Object.values(state.friends));
  const userProfile = useSocialStore((state) => state.userProfile);
  const friendStreaks = useSocialStore((state) => state.friendStreaks);

  // Sorted friends (memoized computation)
  const sortedFriends = useCallback(() => {
    return [...friends].sort((a, b) => b.netWorth - a.netWorth);
  }, [friends]);

  // Actions
  const addFriend = useCallback((friend) => {
    return friendManager.addFriend(friend);
  }, []);

  const updateFriend = useCallback((id, updates) => {
    friendManager.updateFriend(id, updates);
  }, []);

  const removeFriend = useCallback((id) => {
    friendManager.removeFriend(id);
  }, []);

  const getFriendById = useCallback((id) => {
    return friendManager.getFriendById(id);
  }, []);

  const getFriendStreak = useCallback((id) => {
    return friendManager.getFriendStreak(id);
  }, []);

  // Migration on mount (only once)
  useEffect(() => {
    friendManager.migrateFromV1();
  }, []);

  return {
    friends,
    sortedFriends: sortedFriends(),
    userProfile,
    friendStreaks,
    addFriend,
    updateFriend,
    removeFriend,
    getFriendById,
    getFriendStreak,
    simulateFriendGrowth: friendManager.simulateFriendGrowth,
    getUserInviteCode: friendManager.getUserInviteCode,
    addFriendByCode: friendManager.addFriendByCode,
  };
}
