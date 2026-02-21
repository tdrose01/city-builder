# Social Manager Refactor Design Doc
**Status:** Planning Phase  
**Goal:** Decouple social features into clean, testable modules with clear boundaries

## Current Pain Points
- social managers (friendManager, giftManager, visitManager) have implicit coupling
- State updates bleed across modules (localStorage reads/writes not centralized)
- Hard to unit test in isolation (too many side effects)
- Notification logic duplicated between managers

## Proposed Architecture

### Core Principle
**Event-driven, read-only queries, explicit writes**

### Module Boundaries

```
social/
├── core/
│   └── SocialStore          # Single source of truth (Zustand-based)
├── managers/
│   ├── FriendManager        # CRUD + offline sync
│   ├── GiftManager          # Send/claim only (no UI logic)
│   ├── VisitManager         # Async visit simulation
│   └── NotificationManager  # Cross-manager event bus
├── repository/
│   └── LocalStorageAdapter  # Abstracted persistence
└── hooks/
    ├── useFriends           # React hook for components
    ├── useGifts
    └── useVisits
```

### Key Changes

1. **SocialStore** (new)
   - Holds `friends`, `gifts`, `visits`, `notifications` maps
   - Exposes selectors only (no raw state mutation from managers)
   - Handles batch updates atomically

2. **Manager Refactors**
   - **FriendManager**: friend CRUD + streak tracking only
   - **GiftManager**: pure functions (sendGift, canSendGift) + event emitter
   - **VisitManager**: async simulation engine, isolated from Gift logic
   - **NotificationManager**: subscribes to store changes, generates alerts

3. **Repository Layer**
   - All localStorage access goes through adapter
   - Easy to swap for Supabase later without touching managers

4. **Event Flow**
   ```
   User Action → Manager Function → SocialStore Update → Repository Save → Notification Trigger
   ```

## Risks & Mitigations
- **Risk:** Breaking existing gift streak logic  
  **Mitigation:** Write comprehensive tests BEFORE touching code (see giftManager.test.js pattern)

- **Risk:** Performance hit from Zustand re-renders  
  **Mitigation:** Use shallow selectors, keep component-level memoization

- **Risk:** Data migration from old storage keys  
  **Mitigation:** Write migration utility (v1 → v2) with feature flags

## Execution Plan

### Phase A (Prep)
- [x] Audit current cross-module dependencies (grep for imports)
- [x] Create SocialStore skeleton with Zustand
- [x] Write LocalStorageAdapter with same API as old direct calls

### Phase B (Migrate)
- [x] Move FriendManager to new pattern (lowest risk)
- [x] Migrate GiftManager (has tests already, safe to move)
- [x] Migrate NotificationManager
- [ ] Migrate VisitManager

**Phase B Progress:**
- ✅ FriendManager migrated to SocialStore pattern
- ✅ Circular dependency with notificationManager fixed (dynamic import)
- ✅ All localStorage calls abstracted through LocalStorageAdapter
- ✅ GiftManager migrated to SocialStore pattern, synced with tests
- ✅ NotificationManager migrated to SocialStore pattern
- ✅ giftManager.test.js passes, API compatibility maintained

### Phase C (Cleanup)
- [ ] Remove old manager files
- [ ] Update SocialTab.jsx to use new hooks
- [ ] Run full smoke tests

## Success Criteria
- [ ] giftManager.test.js passes without modification (API compatibility)
- [ ] Social features work offline same as before
- [ ] No console warnings about state mutations
- [ ] Memory footprint ≤ current (check React DevTools Profiler)

## Deferred (not in this refactor)
- Real-time multiplayer sync (separate project)
- Backend migration (repository layer makes this easy later)
- UI redesign (only architectural changes now)
