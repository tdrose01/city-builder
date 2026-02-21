import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * SocialStore - Single source of truth for all social state
 * Replaces scattered localStorage access with centralized, reactive state
 */

const STORAGE_KEY = 'cs_social_state_v2';

const initialState = {
  friends: {},
  gifts: [],
  visits: [],
  notifications: [],
  dailyGifts: {
    sent: 0,
    received: 0,
    lastReset: 0,
  },
  friendStreaks: {},
  userProfile: {
    id: 'player-1',
    name: 'Player',
    avatar: '😎',
    netWorth: 0,
    level: 1,
  },
};

export const useSocialStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Actions
      setFriends: (friends) => set({ friends }),
      addFriend: (friend) => set((state) => ({
        friends: { ...state.friends, [friend.id]: friend },
      })),
      updateFriend: (id, updates) => set((state) => ({
        friends: {
          ...state.friends,
          [id]: { ...state.friends[id], ...updates, updatedAt: Date.now() },
        },
      })),
      removeFriend: (id) => set((state) => {
        const { [id]: removed, ...rest } = state.friends;
        return { friends: rest };
      }),

      // Gifts
      setGifts: (gifts) => set({ gifts }),
      addGift: (gift) => set((state) => ({
        gifts: [...state.gifts.slice(-99), gift], // Keep last 100
      })),
      updateGift: (id, updates) => set((state) => ({
        gifts: state.gifts.map((g) =>
          g.id === id ? { ...g, ...updates } : g
        ),
      })),

      // Daily limits
      incrementDailySent: () => set((state) => ({
        dailyGifts: { ...state.dailyGifts, sent: state.dailyGifts.sent + 1 },
      })),
      incrementDailyReceived: () => set((state) => ({
        dailyGifts: {
          ...state.dailyGifts,
          received: state.dailyGifts.received + 1,
        },
      })),
      resetDailyGifts: () => set((state) => ({
        dailyGifts: {
          sent: 0,
          received: 0,
          lastReset: Date.now(),
        },
      })),

      // Streaks
      updateFriendStreak: (friendId, streak) => set((state) => ({
        friendStreaks: {
          ...state.friendStreaks,
          [friendId]: { ...streak, updatedAt: Date.now() },
        },
      })),

      // User profile
      setUserProfile: (updates) => set((state) => ({
        userProfile: { ...state.userProfile, ...updates },
      })),

      // Visits
      addVisit: (visit) => set((state) => ({
        visits: [visit, ...state.visits.slice(0, 99)],
      })),
      markVisitsRead: (friendId) => set((state) => ({
        visits: state.visits.map((v) =>
          v.friendId === friendId ? { ...v, isNew: false } : v
        ),
      })),

      // Notifications
      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications.slice(0, 49)],
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true, readAt: Date.now() } : n
        ),
      })),

      // Selectors (derived state)
      getFriendById: (id) => get().friends[id],
      getSortedFriends: () =>
        Object.values(get().friends).sort((a, b) => b.netWorth - a.netWorth),
      getPendingGifts: () =>
        get().gifts.filter(
          (g) =>
            g.toId === get().userProfile.id && !g.claimed && !g.expired
        ),
      getSentGifts: () =>
        get().gifts.filter((g) => g.fromId === get().userProfile.id),
      getReceivedGifts: () =>
        get().gifts.filter((g) => g.toId === get().userProfile.id),

      // Full clear (for testing)
      reset: () => set(initialState),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        friends: state.friends,
        gifts: state.gifts,
        visits: state.visits,
        notifications: state.notifications,
        dailyGifts: state.dailyGifts,
        friendStreaks: state.friendStreaks,
        userProfile: state.userProfile,
      }),
    }
  )
);

// Non-hook helpers for use outside React
export const getSocialState = () => useSocialStore.getState();

export default useSocialStore;
