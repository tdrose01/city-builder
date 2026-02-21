import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('./friendManager', () => ({
  getUserProfile: vi.fn(() => ({ id: 'player-1', name: 'Tom', avatar: '😎' })),
  updateUserProfile: vi.fn(),
  getFriendById: vi.fn((id) => ({ id, name: 'Alex', avatar: '🧑‍🚀' })),
  updateFriend: vi.fn(),
  getFriends: vi.fn(() => []),
}))

vi.mock('./notificationManager', () => ({
  addNotification: vi.fn(),
  NOTIFICATION_TYPES: {
    GIFT_RECEIVED: 'GIFT_RECEIVED',
  },
}))

import {
  GIFT_CONSTANTS,
  checkDailyReset,
  getDailyGiftsCount,
  canSendGift,
  canReceiveGift,
  sendGift,
  receiveGift,
  getAllGifts,
} from './giftManager'

describe('giftManager daily limits + flow', () => {
  beforeEach(() => {
    const store = {}
    vi.stubGlobal('localStorage', {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v) },
      removeItem: (k) => { delete store[k] },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]) },
    })

    vi.stubGlobal('crypto', {
      randomUUID: () => 'gift-uuid-1',
    })
  })

  it('resets daily counters when no reset exists', () => {
    const didReset = checkDailyReset()
    expect(didReset).toBe(true)

    const counts = getDailyGiftsCount()
    expect(counts.sent).toBe(0)
    expect(counts.received).toBe(0)
  })

  it('blocks sending once daily sent limit is reached', () => {
    localStorage.setItem('cs_gifts_daily_sent_v1', String(GIFT_CONSTANTS.DAILY_GIFTS_LIMIT_SENT))
    localStorage.setItem('cs_gifts_last_reset_v1', String(Date.UTC(2099, 0, 1)))

    expect(canSendGift()).toBe(false)
  })

  it('blocks receiving once daily received limit is reached', () => {
    localStorage.setItem('cs_gifts_daily_received_v1', String(GIFT_CONSTANTS.DAILY_GIFTS_LIMIT_RECEIVED))
    localStorage.setItem('cs_gifts_last_reset_v1', String(Date.UTC(2099, 0, 1)))

    expect(canReceiveGift()).toBe(false)
  })

  it('sends a gift and increments sent count', () => {
    // ensure no auto-reset override during this test
    localStorage.setItem('cs_gifts_last_reset_v1', String(Date.UTC(2099, 0, 1)))

    const result = sendGift('friend-1', 'dice', 1)
    expect(result.success).toBe(true)

    const counts = getDailyGiftsCount()
    expect(counts.sent).toBe(1)

    const all = getAllGifts()
    expect(all).toHaveLength(1)
    expect(all[0].id).toBe('gift-uuid-1')
    expect(all[0].type).toBe('dice')
  })

  it('claims a pending gift and increments received count', () => {
    localStorage.setItem('cs_gifts_last_reset_v1', String(Date.UTC(2099, 0, 1)))

    sendGift('friend-1', 'dice', 1)

    const claim = receiveGift('gift-uuid-1')
    expect(claim.success).toBe(true)
    expect(claim.reward.type).toBe('dice')

    const counts = getDailyGiftsCount()
    expect(counts.received).toBe(1)
  })
})
