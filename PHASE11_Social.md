# Phase 11: Social Features

**Started:** February 13, 2026  
**Status:** In Progress — Task 1 Complete, Tasks 2-3 Spec'd  
**Goal:** 40-60% D7 retention boost via viral social mechanics

---

## Why Social?

Social features drive retention through:
- **Interdependence** — players need friends for optimal progress
- **FOMO** — seeing friends' cities creates engagement pressure
- **Viral coefficient** — invite codes drive organic growth (target >1.2)
- **Daily habits** — gift exchange creates recurring session triggers

---

## Task 1: Friend System + Async City Visits ✅ COMPLETE

### Data Models

```javascript
// User Profile (stored in localStorage PLAYER_KEY)
{
  id: string,              // Device-generated UUID
  inviteCode: string,      // 6-char alphanumeric (no 0, O, I, L)
  name: string,
  avatar: string,          // Emoji
  level: number,
  netWorth: number,
  createdAt: timestamp,
  lastActive: timestamp
}

// Friend (stored in localStorage FRIENDS_KEY)
{
  id: string,
  code: string,            // Their invite code
  name: string,
  avatar: string,
  level: number,
  netWorth: number,
  lastActive: timestamp,
  citySnapshot: Object     // Last known city state
}

// Visitor Log Entry (stored in localStorage VISITOR_LOG_KEY)
{
  id: string,
  friendId: string,
  friendName: string,
  visitedAt: timestamp,
  action: 'view' | 'gift' | 'reaction',
  metadata: Object         // Screenshot data, reaction type, etc.
}

// Gift Record (stored in localStorage GIFTS_KEY)
{
  id: string,
  fromFriendId: string,
  toFriendId: string,
  type: 'dice' | 'funds' | 'shield',
  amount: number,
  sentAt: timestamp,
  claimedAt: timestamp|null
}
```

### API Design (Offline-First)

All operations use localStorage. Future backend migration:
- Add `syncedAt` timestamps to all records
- Deconflict on `code` uniqueness
- Queue offline operations for batched sync

### Invite Code Generation

- 6 characters: `A-Z`, `0-9`
- Exclude ambiguous: `0`, `O`, `I`, `L`
- 34^6 = 1.5B combinations (collision-safe for local scope)

### UI Components

| Component | Purpose |
|-----------|---------|
| `FriendModal` | Add friend via code input |
| `VisitCityModal` | Read-only 3D city viewer |
| `VisitorLog` | Recent visitors list |
| `SocialTab` | Friend list with visit controls |

### Files Created

```
web/src/lib/
├── friendManager.js      # CRUD + invite codes
├── visitManager.js       # Visit logging + snapshots
└── config/social.js      # Updated: real data (was mock)

web/src/components/Social/
├── FriendModal.jsx       # Add friend dialog
├── VisitCityModal.jsx    # 3D city viewer
├── VisitorLog.jsx        # Recent activity
├── SocialTab.jsx         # Updated: real friend data
└── LeaderboardItem.jsx   # Updated: visit controls
```

---

## Task 2: Social Leaderboards

### Implementation Plan

**Effort:** Medium  
**Dependencies:** Task 1 complete ✅

### Features

1. **Global Leaderboard** — All players by net worth
2. **Friends Leaderboard** — Filtered to friend circle
3. **Comparative Stats** — Side-by-side city comparison
4. **Progress Notifications** — "Sarah unlocked Epic Town Hall!"

### Data Model

```javascript
// Leaderboard Entry (computed, not stored)
{
  rank: number,
  playerId: string,
  name: string,
  avatar: string,
  netWorth: number,
  level: number,
  trending: 'up' | 'down' | 'same'
}

// Progress Notification
{
  id: string,
  type: 'friend_milestone' | 'achievement' | 'rank_change',
  actorId: string,
  actorName: string,
  detail: string,
  createdAt: timestamp,
  read: boolean
}
```

### UI Components

- `LeaderboardView` — Main board with tabs
- `CompareCitiesModal` — Side-by-side stats
- `NotificationBell` — Unread progress alerts

---

## Task 3: Gift Exchange + Collaborative Mechanics

### Implementation Plan

**Effort:** Medium  
**Dependencies:** Task 1 complete ✅

### Features

1. **Send Resources** — Dice, Funds, Shields to friends
2. **Help Button** — Assist friend's building (mutual benefit)
3. **Daily Limits** — 5 gifts sent, 5 received daily
4. **Reciprocity Tracking** — Gift history, streaks

### Gift Economy

| Gift Type | Amount | Cooldown |
|-----------|--------|----------|
| Dice | 5 | Daily |
| Funds | ~10% of avg tile reward | Daily |
| Shield | 1 | Weekly |
| Help Action | -5% build time | Per building |

### Data Model

See Gift Record above (Task 1).

### UI Updates

- `LeaderboardItem` — Add "Send Gift" button (exists, needs wiring)
- `SocialTab` — Add gift inbox/outbox tabs
- `BuildingCard` — Add "Help" button when visiting friend's city

---

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| localStorage | Offline-first, zero backend cost for MVP |
| City Snapshots | Friend's city state at last visit (not live) — reduces sync complexity |
| Read-Only Visits | No live multiplayer — simpler animations, no conflict resolution |
| 6-Char Codes | Short enough to share verbally, long enough to avoid collisions |

---

## Success Metrics

- [x] Task 1: Friend System functional
- [ ] Task 1: 50% of users add ≥1 friend (goal)
- [ ] Task 2: Leaderboard drives 10% extra sessions
- [ ] Task 3: Gift exchange creates daily retention hook
- [ ] Overall: D7 retention +20% (target: 40-60%)
