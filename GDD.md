# City Stacker Game Design Document (GDD)

## 1. Product Summary
- Genre: Mobile board-based city builder
- Platform: iOS, Android
- Session: 60-120 seconds (Target achieved: ~86s avg)
- Audience: casual builders, collectors, social competition
- Core feel: fast, colorful, social, celebratory

## 2. Vision and Pillars
- Fast rewards: every roll yields visible progress.
- Simple choices: roll, boost, upgrade, collect.
- Social friction: heists, shutdowns, shields.
- Long-term goals: city completion and sticker albums.

## 3. Core Loop
1) Roll dice -> 2) Move -> 3) Resolve tile -> 4) Earn spendable funds ->
5) Upgrade landmark -> 6) Complete city -> 7) Unlock next city.

Secondary loop: collect stickers -> complete sets -> earn dice/funds.

## 4. Game Systems

### 4.1 Board System
- Board loop with visible tiles and a center HUD.
- Tile mix (baseline):
  - Funds x12
  - Rent x6
  - Bonus x4
  - Card x2
  - Event x6 (Heist x3, Shutdown x2, Mini x1)
  - Shield x3
  - Utility x2 (Free Roll x1, Dice Boost x1)
  - Sticker Pack x2
  - Social/Travel x3
  - Wild/Seasonal x2
- Card tiles draw a quick event (funds, dice, shield, sticker, or repair bill).
- Tile spawn cadence: high-value tiles every 6-8 tiles.

### 4.2 Dice System
- Dice is stamina, regen over time with a cap.
- Default: 1 die per 9 minutes, cap 90.
- High Roller: 5x-20x optional multiplier for burst sessions.
- Free dice sources: daily login, events, city completion, album completion.
- Doubles rule: rolling doubles grants bonus dice equal to 50% of the roll total (tunable in `gameBalance.js`).

### 4.3 Currency
- City Funds (soft currency): upgrades, repairs, some events.
- Gold (premium currency): dice packs, sticker packs, skips.
- Sticker Dust (secondary): craft missing stickers and fill wildcard meter.

### 4.4 Building and Upgrades
- Each city: 5-8 landmarks, 3-5 tiers.
- Each tier adds visible floors or attached assets.
- Upgrade cost grows per tier and per city multiplier.
- Completing all landmarks unlocks next city.

### 4.5 Heists
- Triggered on Heist tiles.
- Heist outcome table:
  - Small: 5% bank
  - Medium: 10% bank
  - Big: 15% bank
- Mini outcome choice or quick animation (no deep mini-game in MVP).

### 4.6 Shutdowns
- Triggered on Shutdown tiles.
- If target unshielded: reduce 1 tier durability.
- Repair cost: 25% of tier upgrade cost.

### 4.7 Shields
- Shield tiles grant 1 shield, max 3.
- Shields block shutdowns, consumed on hit.

### 4.8 Sticker Collection
- Sticker packs: common, rare, epic.
- Duplicates convert to Sticker Dust.
- Complete set: large dice/fund reward.
- Complete album: premium reward and city theme cosmetic.
- Duplicate System Flow (draft, tune in economy model):
  - Dust per duplicate: Common 10, Rare 30, Epic 100.
  - Craft missing sticker: Common 100, Rare 300, Epic 1000 dust.
  - Wildcard meter: +10/+30/+100 points per dupe, 1000 points grants 1 wildcard sticker.
  - Rarity reroll: combine 3 duplicates of same rarity for 1 random sticker of that rarity.
  - Weekly duplicate market: 3 rotating missing stickers purchasable with dust + small City Funds fee.

### 4.9 Events and Live Ops
- Weekly main event with milestone rewards.
- 2-3 rotating mini events with tile-specific goals.
- Seasonal album cadence (4-8 weeks).

## 5. Economy Design
- Soft currency costs rise by tier and city multiplier.
- Earnings tuned to complete early cities in 1-2 sessions and later in 3-6.
- Dice scarcity drives event participation and spend.
- See `ECONOMY_MODEL_README.md` and `economy_*.csv`.

## 6. Progression
- City completion unlocks the next city and increases earnings.
- Player level tracks lifetime milestones and unlocks bundles.
- Sticker albums provide a long-term progression layer.

## 7. UX Flows

### 7.1 First-Time User Experience (FTUE)
1) Intro cinematic -> 2) First roll -> 3) First upgrade ->
4) First sticker pack -> 5) Free dice reward -> 6) Shop peek.

### 7.2 Return Session
1) Claim free dice -> 2) Event progress summary -> 3) Roll loop ->
4) Upgrade prompt -> 5) Exit teaser.

### 7.3 Monetization Prompts
- Dice low: offer dice pack or ad.
- City complete: city bundle.
- Event milestones: premium track upgrade.

## 8. UI Screens (Wireframe Notes)
- Home/Board: board center HUD with dice left, shields, roll button, roll total, and stop tile.
- Upgrade panel: modal with tier preview and cost.
- Sticker album: grid with set progress and rewards.
- Shop: dice packs, sticker packs, limited-time bundles.
- Event hub: current events with progress bars and milestones.
- Social: friends list, recent heists, shields status.

## 9. Art Direction
- Style: Neon-Noir Art Deco with glossy, toy-like 3D.
- Board: isometric, readable, saturated accents.
- UI: glass panels, neon borders, chunky buttons.
- VFX: confetti, spark trails, coin bursts.
- Palette: #00f3ff, #d946ef, #0f172a, #fbbf24.

## 10. Audio Direction
- Crisp dice roll clicks, coin showers.
- Short stingers for heists/shutdowns.
- Upgrade "chime" and celebratory stingers.
- Doubles stinger (short, high-pitched).

## 11. Analytics and KPIs
- Events: roll_start, roll_result, tile_resolve, upgrade_start, upgrade_complete,
  city_complete, heist_start, heist_result, shutdown_start, shutdown_result,
  shield_gain, shield_consume, sticker_pack_open, sticker_set_complete,
  album_complete, purchase_start, purchase_complete.
- Targets: D1 35-45%, D7 15-20%, session 60-120s, ARPDAU $0.10-$0.25.

## 12. Tech Requirements
- Engine: Unity (C#).
- Backend: Firestore.
- Live ops config: remote-configurable events and offers.
- Save: cloud + local fallback.

## 13. Content Pipeline
- City definitions: landmarks, tiers, costs, rewards.
- Tile config: per board layout and event weights.
- Sticker sets: 5-9 sets per album, rarity tiers.
- Offers: bundles with time windows and triggers.

## 14. Risks and Mitigations
- Progress too slow: adjust base rewards and dice cap.
- PvP frustration: keep shields generous early.
- Inflation: adjust city multipliers and repair rates.

## 15. MVP Scope
- Web board loop with dice economy, heist/shields, doubles bonus, and basic city upgrades.

## 16. Gameplay Plan

### 16.1 Core Loop and Objectives
1) Roll dice -> 2) Move token -> 3) Resolve tile -> 4) Earn/lose City Funds ->
5) Upgrade landmark -> 6) Complete city -> 7) Unlock next city.

- Short-term: maximize rolls per session and convert rolls into City Funds.
- Mid-term: upgrade landmarks to complete the current city.
- Long-term: progress through cities, complete sticker sets, and accumulate resources.

### 16.2 Session Flow (30–120s)
1) Entry: start with dice + recap of last reward.
2) Action: roll chain with visual tile rewards.
3) Spend: upgrade landmark (or save).
4) Exit: show completion progress and tease next reward.

### 16.3 Progression Structure
- Each city has 5–7 landmarks with 3–5 tiers.
- Tier cost formula: `base_cost * (1.35 ^ tier_index) * city_multiplier`.
- Completion rewards: City Funds + dice (kept modest to avoid inflation).
- Pacing targets: early 1–2 sessions, mid 2–4, late 4–6.

### 16.4 Economy Rules
- Funds tile: `baseFunds + roll * funds_per_die * funds_roll_multiplier`.
- Rent tile: `baseFunds * rent_multiplier + roll * funds_per_die * rent_roll_multiplier`.
- Bonus tile: `baseFunds * bonus_multiplier`.
- Start tile: `baseFunds * start_bonus_multiplier`.
- Heist: random payout 5–15% of city total.
- Shutdown: lose `tier_cost * shutdown_repair_pct` unless shielded.
- Free Dice: `free_dice_bonus` dice.
- Doubles: bonus dice `roll * doubles_bonus_multiplier`.

### 16.5 Events and Live Ops
- Weekly main event with 20 milestones.
- 2–3 short mini-events targeting specific tiles.
- Seasonal sticker album refresh every 4–8 weeks.

### 16.6 Monetization Touchpoints (Optional)
- Dice packs when low on dice.
- Event pass premium track.
- Sticker packs and city completion bundles.
- Out of scope: deep PvP leagues, advanced mini-games, live tournaments.
