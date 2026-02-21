import { create } from 'zustand';
import { storageAdapter } from '../repository/LocalStorageAdapter';

// Create the Zustand store
export const useSocialStore = create((set, get) => ({
  // --- State ---
  friends: [],
  profile: null,
  inviteCode: null,
  
  gifts: [],
  friendStreaks: {},
  dailyGiftsSent: 0,
  dailyGiftsReceived: 0,
  giftsLastReset: null,

  notifications: [],
  
  visitorLog: [],
  visitHistory: [],

  // --- Initializer ---
  init: () => {
    // Load all data from storage adapter
    set({
      friends: storageAdapter.getFriends(),
      profile: storageAdapter.getUserProfile(),
      inviteCode: storageAdapter.getInviteCode(),
      
      gifts: storageAdapter.getGifts(),
      friendStreaks: storageAdapter.getFriendStreaks(),
      dailyGiftsSent: parseInt(storageAdapter.getString(storageAdapter.STORAGE_KEYS?.GIFTS_DAILY_SENT || 'cs_gifts_daily_sent_v1', '0')),
      dailyGiftsReceived: parseInt(storageAdapter.getString(storageAdapter.STORAGE_KEYS?.GIFTS_DAILY_RECEIVED || 'cs_gifts_daily_received_v1', '0')),
      giftsLastReset: storageAdapter.getString(storageAdapter.STORAGE_KEYS?.GIFTS_LAST_RESET || 'cs_gifts_last_reset_v1', null),
      
      notifications: storageAdapter.getNotifications(),
      
      visitorLog: storageAdapter.getVisitorLog(),
      visitHistory: storageAdapter.getVisitHistory(),
    });
  },

  // --- Actions ---
  // These will be called by the Managers to update the store and storage together
  
  // Example batch update function for managers
  updateFriends: (newFriends) => {
    set({ friends: newFriends });
    storageAdapter.setFriends(newFriends);
  },

  updateProfile: (newProfile) => {
    set({ profile: newProfile });
    storageAdapter.setUserProfile(newProfile);
  },

  updateGifts: (newGifts) => {
    set({ gifts: newGifts });
    storageAdapter.setGifts(newGifts);
  },

  updateNotifications: (newNotifications) => {
    set({ notifications: newNotifications });
    storageAdapter.setNotifications(newNotifications);
  },
  
  updateVisits: (log, history) => {
    set({ visitorLog: log, visitHistory: history });
    storageAdapter.setVisitorLog(log);
    storageAdapter.setVisitHistory(history);
  }
}));

// Initialize store on import
useSocialStore.getState().init();

// Selectors for React components (to prevent unnecessary re-renders)
export const selectFriends = (state) => state.friends;
export const selectProfile = (state) => state.profile;
export const selectGifts = (state) => state.gifts;
export const selectNotifications = (state) => state.notifications;
export const selectVisitorLog = (state) => state.visitorLog;
