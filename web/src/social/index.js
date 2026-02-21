/**
 * Social Module v2 - Centralized exports
 * Phase A: Store + Lean Managers
 */

// Store (always import from here)
export { useSocialStore, getSocialState } from '../store/useSocialStore';

// Managers
export * as friendManager from './friendManager';
export * as giftManager from './giftManager';

// Migration utilities
export const migrateAllFromV1 = () => {
  const { migrateFromV1 } = require('./friendManager');
  const { migrateGiftsFromV1 } = require('./giftManager');

  migrateFromV1();
  migrateGiftsFromV1();
};

// React hooks for components
export { useFriends } from './hooks/useFriends';
export { useGifts } from './hooks/useGifts';
