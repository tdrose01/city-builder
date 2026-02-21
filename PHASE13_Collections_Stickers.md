# Phase 13: Collections & Stickers — Design Document

## 1. Executive Summary
Phase 13 transforms "Stickers" from simple reward icons into a core collection and progression mechanic. Players collect stickers into themed "Sets" to earn massive bonuses and prestige.

## 2. Data Models
- **Sticker**: ID, Name, SetID, Rarity (1-5 stars), Image/Emoji.
- **StickerSet**: ID, Name, TotalStickers, CompletionReward (Dice/Funds/Unique Building).
- **StickerAlbum**: Record of owned stickers and quantities (duplicates are used for trading).

## 3. Core Mechanics
- **Pack Opening**: Animations for opening 1, 3, or 5-sticker packs with rarity-based probability.
- **Set Completion**: Automatic detection when a set is full, triggering a "Collection Complete" celebration.
- **Trading Simulation**: Ability to "Send" duplicates to friends (simulated via the Phase 11 friend list) and receive "Sticker Requests."
- **Star Power**: A secondary currency derived from duplicate stickers, used to buy "Vault" packs.

## 4. Task Breakdown
- **Task 1: Sticker Data Architecture**: Define all sticker sets for Season 1.
- **Task 2: Pack Opening Logic**: RNG-based drop logic and UI animation.
- **Task 3: The Sticker Album UI**: A multi-page book interface for browsing sets.
- **Task 4: Trading & Requests**: Integration with the Friend system for sending/receiving.
- **Task 5: Star Power & The Vault**: Duplicate management and high-tier reward exchange.

## 5. File Architecture
- `web/src/data/stickers/stickerData.ts`
- `web/src/store/useStickerStore.ts`
- `web/src/components/StickerAlbum/`
- `web/src/components/StickerPackOpener.jsx`
