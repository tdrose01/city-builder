# Phase 9: Social Features & Advanced Progression

**Track ID:** `phase9_social_progression_20260130`
**Created:** 2026-01-30
**Status:** 🚀 Active
**Estimated Duration:** 10-15 hours

---

## 🎯 Overview

Phase 9 focuses on expanding the game's depth through social interactions and long-term progression systems. The goal is to give players reasons to keep playing beyond individual city completion by introducing meta-goals and social connectivity.

---

## 📋 Goals

### Primary Goals
1.  **Implement Friend System:** Basic leaderboard and mock social interactions.
2.  **Global Prestige System:** A meta-layer that persists across city resets.
3.  **Advanced Mission System:** Weekly and Monthly mission cycles with unique rewards.
4.  **Visual Polish:** Enhanced 3D dice and board animations to match the new depth.

### Success Criteria
- ✅ Friend Leaderboard functional (mock data initially).
- ✅ Global Prestige mechanics working (persisting multipliers).
- ✅ Weekly/Monthly missions implemented and tracking correctly.
- ✅ Visual upgrades applied without performance regression.
- ✅ Tests passing (target: 250+ tests).

---

## 🛠️ Feature Specifications

### Task 9.1: Friend System
- **Leaderboard:** Display "friends" (mock users or local profiles) ranked by City Level and Net Worth.
- **Gifting:** Ability to send/receive "Daily Dice" or "Sticker Packs" (limited per day).
- **Heist Targets:** Prioritize friends for Heist tiles (if implemented in future).

### Task 9.2: Global Prestige
- **Concept:** Unlike Event Prestige which resets event progress, Global Prestige resets the *entire game* (except collectibles) for permanent buffs.
- **Rewards:**
    - Permanent Income Multiplier (e.g., +50% per Global Prestige).
    - Unique "Prestige Skins" for dice or board.
    - Special "Prestige Stickers" only found in this mode.

### Task 9.3: Advanced Missions
- **Weekly Challenges:** Harder goals (e.g., "Roll 1000 times", "Earn $1M") with 7-day timers.
- **Monthly Marathons:** Long-term goals (e.g., "Complete 3 Cities") with massive rewards (Wild Stickers).
- **UI:** A new "Challenges" tab in the Mission Tracker.

### Task 9.4: Visual Polish
- **3D Dice Upgrade:** Better textures, physics tweaks, or more satisfying tumble animations.
- **Board Ambience:** Dynamic lighting or background effects based on real-time (day/night cycle) or city theme.

---

## 📅 Roadmap

| Task | Description | Est. Time |
| :--- | :--- | :--- |
| **9.1** | Friend System & Leaderboards | 3-4h |
| **9.2** | Global Prestige System | 3-4h |
| **9.3** | Advanced Mission Cycles | 3-4h |
| **9.4** | Visual Polish & 3D Dice | 2-3h |

---

## 📚 Related Documents
- [Implementation Plan](./plan.md)
- [Feature Specifications](./spec.md)
