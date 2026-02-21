# Phase 14: Daily Goals & Missions — Design Document

## 1. Executive Summary
Phase 14 introduces a structured daily loop. Players are given 3 random "Daily Missions" that reset every 24 hours. Completing all three grants a "Bonus Chest" and contributes to a "Daily Streak."

## 2. Data Models
- **Mission**: ID, Description, Type (Roll/Earn/Build/Heist), Target, Current Progress, Completed (bool), Reward (Dice/Funds/XP).
- **DailyState**: ActiveMissions[], LastResetTimestamp, CurrentStreak, StreakClaimedToday (bool).

## 3. Core Mechanics
- **Daily Reset**: Logic to check the system clock and generate new random missions if 24h have passed.
- **Mission Tracking**: Real-time progress updates hooked into the `BoardLoop` actions.
- **Streak System**: Scaling rewards for 2, 5, 10, and 30-day completion streaks.
- **Mission Rerolling**: Ability to swap one mission per day for a small cost (Funds).

## 4. Task Breakdown
- **Task 1: Mission Data Architecture**: Define the task registry and state models.
- **Task 2: The Daily Reset Engine**: Logic for time-based generation and streaks.
- **Task 3: Mission Board UI**: A new panel in the sidebar or a standalone modal.
- **Task 4: Gameplay Integration**: Connecting every board action to mission progress.
- **Task 5: Streak Logic & Rewards**: Progression tracking for consecutive days.

## 5. File Architecture
- `web/src/data/missions/missionData.ts`
- `web/src/store/useMissionStore.ts`
- `web/src/components/Missions/MissionBoard.jsx`
