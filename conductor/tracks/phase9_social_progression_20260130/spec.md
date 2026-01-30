# Phase 9 Specifications: Social & Advanced Progression

## 1. Friend System

### Overview
A simulated social layer to create a sense of competition and community. Since there's no backend yet, this will use mock data and local state.

### Mechanics
- **Leaderboard:**
    - Generates 5-10 "bot" friends with randomized names and avatars.
    - Tracks their City Level, Net Worth, and last active time.
    - The player's rank updates dynamically as they progress.
- **Gifting:**
    - Players can send 1 Gift (5 Dice) to each friend daily.
    - Players can receive up to 5 Gifts (25 Dice total) daily.
    - Cooldown resets at midnight (simulated or real-time).

### UI/UX
- New "Social" tab in the HUD.
- List view for Leaderboard with "Send" buttons.
- Notification badge on Social tab when gifts are available.

## 2. Global Prestige

### Overview
A high-stakes reset mechanic for end-game players.

### Triggers
- Requires completing City 5 (Neon Skyline).
- Requires Player Level 50 (or equivalent metric).

### Effects
- **Resets:** City Level to 1, Funds to Start, Landmarks to 0.
- **Keeps:** Stickers, Artifacts (if any), Friend Progress.
- **Gains:**
    - **Prestige Star:** Displayed next to name.
    - **Permanent Multiplier:** +50% to all Funds/Dice rewards.
    - **Golden Dice Skin:** Visual upgrade.

### UI/UX
- Dramatic "Prestige" modal in the City Info panel.
- Confirmation dialog with clear "What you keep / What you lose" list.
- Post-prestige celebration sequence.

## 3. Advanced Missions

### Overview
Longer-term engagement loops.

### Structure
- **Daily:** (Existing system - infinitely resettable).
- **Weekly:**
    - 3 Objectives (e.g., "Upgrade 50 Landmarks", "Win 5 Lotteries").
    - Reward: 100 Dice + 1 Rare Pack.
    - Resets every 7 days.
- **Monthly:**
    - 1 Major Objective (e.g., "Complete 2 Cities").
    - Reward: 500 Dice + 1 Epic Pack + Unique Board Theme.
    - Resets every 30 days.

### UI/UX
- Expand Mission Tracker to have sub-tabs: "Daily", "Weekly", "Monthly".
- Progress bars for long-term goals.
- Timer countdowns for expiry.

## 4. Visual Polish

### 3D Dice
- Enhance `ThreeDice.jsx` with:
    - Better lighting/materials (React Three Fiber).
    - "Critical Roll" effect (fire/glow) for high stakes rolls.

### Board Ambience
- Dynamic background gradients that shift slowly over time.
- "Night Mode" toggle or auto-detect based on system preference.
