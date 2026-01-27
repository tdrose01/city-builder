# City Stacker Design Doc (Monopoly Go-inspired)

## Overview
City Stacker is a mobile, dice-driven city builder with a circular board, fast sessions, and long-term collection goals. Players roll dice, move around a board, earn City Funds, and stack floors to complete themed districts. The core feel is light, social, and celebratory with occasional spikes from heists and shutdowns.

## Design Pillars
- Fast, satisfying sessions (30-120 seconds) with frequent rewards.
- Simple agency (roll, boost, choose upgrade) with occasional high-stakes choices.
- Long-term progression through city boards and collections.
- Social friction and delight: raids, shields, and friendly rivalry.

## Core Loop
1) Roll dice -> 2) Move -> 3) Land on tile -> 4) Gain/lose funds or trigger event ->
5) Upgrade a landmark -> 6) Complete city -> 7) Unlock next city.

## Session Structure
- Entry: claim free dice or rewards.
- Action: burst of rolls with occasional multipliers.
- Spend: upgrade buildings and chase goals.
- Exit: event progress, teaser for next reward.

## Mechanics

### Board and Tiles
- Board is a 40-tile loop with 6-8 event tiles, 2-3 utility tiles, and 6-10 economy tiles.
- Example tile mix: Funds, Rent, Bonus, Card, Sticker Pack, Heist, Shutdown, Shield, Free Roll.
- Landed tiles resolve quickly with big feedback and clear payout.

### Dice and Multipliers
- Dice are the primary stamina. Regenerate over time with a cap.
- High Roller mode lets players roll a multiplier for bigger rewards and faster event progress.
- Free rolls are given for completion milestones and daily tasks.
- Doubles grant bonus dice scaled by the roll total (50% multiplier).

### City Funds (Soft Currency)
- Primary upgrade currency used to stack floors on landmarks.
- Earned from tiles, rent, heists, and completion bonuses.
- Spent on upgrades with scaling costs.

### Building and Stacking
- Each city has 5-8 landmarks, each with 3-5 tiers.
- Each tier adds visible floors to the landmark, giving immediate visual feedback.
- Completing all landmarks triggers city completion bonus and unlocks the next city.

### Heists and Shutdowns (PvP-lite)
- Heist: steal a percentage of a target bank based on a mini outcome.
- Shutdown: damage a landmark tier, requiring repair cost for target.
- Shields: limited protection, obtained from tiles and daily rewards.

### Collection Meta (Stickers)
- Sticker packs drop from tiles and event rewards.
- Completing a set grants large dice/fund rewards.
- Duplicates convert to a secondary currency used to trade for missing stickers.
- Duplicate Handling Ideas:
  - Duplicate Dust: convert duplicates into dust to craft a specific missing sticker (higher cost for higher rarity).
  - Wildcard Meter: duplicates fill a meter that grants a wildcard sticker when full.
  - Set Tokens: trade duplicates for set-specific tokens redeemable only within that set.
  - Weekly Duplicate Market: rotating shop offers missing stickers for duplicates plus a small coin fee.
  - Rarity Reroll: combine 3 duplicates of the same rarity to reroll into a random sticker of that rarity.
  - Duplicate Boosters: redeem duplicates for short boosters (event progress, shield, or dice).

#### Prototype Sticker System (Web)
- Pack tiers: common, rare, epic. Each pack opens 1 sticker with tiered rarity weights.
- Duplicates grant Dust + Set Tokens tied to the sticker's set.
- Dust crafts a chosen missing sticker; Set Tokens redeem a random missing sticker in that set.
- Set completion rewards are claimable once (dice + funds).

### Gameplay Fun Enhancers (Short-Session Variety)
- Press-your-luck roll chain: after each roll, players can bank progress or push for a bonus, risking a small loss of this turn's gains.
- Quick combo bonus: optional targets (doubles, matching numbers, exact sums) that pay out if hit within up to 3 rolls.
- Moving shield pickups: collecting a shield spawns a new shield on another property tile to create a chase loop.
- Shutdown skill check: replace pure RNG with a 1-2 second timing bar that slightly boosts payout on success.
- Reroll token: rare consumable that lets players reroll one die to chase event goals.
- Event-driven defense: short events that increase shield spawn rate or allow banked shields for a limited window.

### Prototype UX Layout (Web)
- Fit-to-screen layout for no-scroll play during a session.
- Primary stats and actions grouped in the left column; board in the right column.
- Run progress (event/combo/mission/risk) is collapsible into compact chips.
- Sticker album details are hidden by default and expanded on demand.

## Level Design

### Board Layout Rules
- Place 1-2 high-value tiles every 6-8 spaces to keep excitement.
- Put shields near high-risk zones to reduce frustration.
- Keep a visible rhythm: funds -> event -> funds -> utility -> event.
- Place at least one "choice" tile (press-your-luck or combo target) per quadrant to add agency without slowing turns.
- Seed moving shield pickups on property tiles so the chase loop stays active across the lap.
- Keep shutdown/heist tiles 4-6 spaces apart to avoid consecutive negative spikes.
- Ensure one recovery tile (free roll, bonus, or funds) appears within 3-5 spaces after a high-risk tile.

### City Progression
- Early cities: low costs, fast completion, 5 landmarks x 3 tiers.
- Mid cities: medium costs, 6 landmarks x 4 tiers, more event variety.
- Late cities: higher costs, 7-8 landmarks x 5 tiers, heavier reliance on multipliers.
- Add one new mechanic per band (early: choice tiles, mid: shutdown skill check, late: press-your-luck chain).
- Keep board risk steady: increase rewards more than penalties as cities rise to avoid fatigue.
- Escalate landmark perks slowly: 1 perk in early, 2 in mid, 3 in late cities.
- Event pacing: early cities favor short events, mid cities add multi-stage events, late cities mix long events with frequent mini events.

### Example City Progression (First 5)
City 1: Neon Harbor
  - Landmarks: 5, Tiers: 3, Total Cost: 130k, Completion Reward: 45 dice
  - New Mechanic: Choice tile (press-or-bank mini bonus)
  - Landmark Perks: 1 (e.g., +1 shield cap)
City 2: Deco Heights
  - Landmarks: 5, Tiers: 3, Total Cost: 230k, Completion Reward: 55 dice
  - New Mechanic: Combo target (doubles or exact sum)
  - Landmark Perks: 1 (e.g., +2% heist payout)
City 3: Skybridge Plaza
  - Landmarks: 6, Tiers: 4, Total Cost: 520k, Completion Reward: 70 dice
  - New Mechanic: Shutdown skill check
  - Landmark Perks: 2 (e.g., +1 reroll token per day, +3% event progress)
City 4: Metro Crown
  - Landmarks: 6, Tiers: 4, Total Cost: 840k, Completion Reward: 85 dice
  - New Mechanic: Press-your-luck chain (bank or push)
  - Landmark Perks: 2 (e.g., +1 free roll on doubles, +1 shield refresh)
City 5: Glass District
  - Landmarks: 7, Tiers: 4, Total Cost: 1.45M, Completion Reward: 100 dice
  - New Mechanic: Choice tile + press-your-luck chain combined
  - Landmark Perks: 3 (e.g., +1 max dice cap, +4% heist payout, +5% event progress)

### Landmark Perk Examples
| Perk | Effect |
| --- | --- |
| Shield Cap +1 | Increases max shields by 1. |
| Heist Payout +2% | Increases heist payout by 2%. |
| Reroll Token | Grants 1 reroll token per day. |
| Event Progress +3% | Adds 3% to event progress from tiles. |
| Free Roll on Doubles | On doubles, gain +1 free roll. |
| Shield Refresh | Restores 1 shield on city completion. |
| Dice Cap +1 | Increases max dice cap by 1. |

## Economy and Balancing
- Soft currency inflation should be controlled by upgrade cost scaling.
- Suggested cost curve per tier: base_cost * (1.35 ^ tier_index) * city_multiplier.
- Dice regen target: 1 die per 8-10 minutes, cap 80-100.
- Heist payout target: 5-15% of bank based on roll result.
- Perk value offsets: when adding landmark perks or new roll agency, increase city costs or reduce bonus payouts to keep session length stable.

## Economy Sinks and Sources

### City Funds (Soft Currency)
**Sources (inflows)**
- Board tile payouts: Funds, Bonus, Rent.
- Heist wins.
- Event milestone rewards.
- City completion rewards.
- Sticker set completion rewards.
- Daily/weekly quests and login rewards.

**Sinks (outflows)**
- Landmark upgrades (primary sink).
- Repair costs after shutdowns (secondary sink).
- Limited-time event shops (optional sink).
- Sticker duplicate conversion fees (if using any paid conversion path).

**Target Net per Session**
- Early session (new city): net positive, enough for 1-2 landmark tiers.
- Mid session: near break-even, 0.8-1.2 tiers.
- Late session: slightly negative without multipliers, 0.5-0.9 tiers.

**Numeric Examples (Early City Baseline)**
- Avg roll: 7 (2d6). Tile mix over 10 rolls: 4 funds, 2 rent, 1 bonus, 1 heist, 1 card, 1 utility.
- Base funds per tile: ~360 (0.3% of 120k city target).
- Funds tile: ~2.0k, Rent tile: ~3.0k, Bonus tile: ~0.7k, Heist: ~8-12k (5-10% band).
- 10-roll session gross: ~18k-26k funds (before shutdowns).
- Tier 1 upgrade: ~1.0k; Tier 3: ~1.8k. Net = 1-3 upgrades early, 0.8-1.2 mid.

### Dice (Stamina)
**Sources (inflows)**
- Time regen.
- City completion rewards.
- Event milestone rewards.
- Daily/weekly rewards.
- Ad rewards (optional).
- Purchases.

**Sinks (outflows)**
- Rolls.
- High Roller multipliers (consume multiple dice per roll).

**Target Net per Session**
- Standard play: -6 to -12 dice per 60-120s session.
- High Roller: -15 to -30 dice per 60-120s session.

**Numeric Examples**
- 8-12 rolls per short session.
- Standard: 1 dice per roll; expected gains 1-4 dice from tiles/events -> net -6 to -12.
- High Roller x2/x3: 2-3 dice per roll; expected gains 2-6 dice -> net -15 to -30.

### Shields
**Sources (inflows)**
- Shield tiles.
- Daily rewards and event rewards.
- Landmark perks.

**Sinks (outflows)**
- Consumed on shutdown defense.
- Shield cap overflow (excess lost).

**Target Net per Session**
- Neutral: steady-state around 50-80% of cap during regular play.

### Stickers and Duplicates
**Sources (inflows)**
- Sticker packs from tiles and events.
- Purchases.

**Sinks (outflows)**
- Duplicate conversion to dust/tokens.
- Trading (if enabled).
- Pack opening (consumes pack inventory).

**Target Net per Session**
- 1-3 stickers per short session (mix of duplicates and new).

## Monetization Loops

### Primary
- Dice packs: most direct conversion from frustration to spend.
- High Roller boosts: time-limited multiplier windows for bigger progress.

### Secondary
- Sticker packs: scarcity-driven collection spend.
- Event pass: free track + premium track with dice and sticker bonuses.
- City completion bundles: offered after completing a city or landmark.

### Gentle Monetization
- Optional rewarded ads for small dice refills or shield restores.
- "Comeback" offers after a failed heist or shutdown.

## Live Ops and Events
- Weekly main event with milestone rewards (dice, stickers, funds).
- 2-3 rotating mini events with specific tile goals.
- Seasonal sticker albums with unique final rewards.

## Art Style (Monopoly Go-inspired, City Stacker flavor)
- Theme: Neon-Noir Art Deco with clean, toy-like 3D forms.
- Board: isometric diorama with strong silhouettes and glowing accents.
- Materials: glossy plastics, glass, and metallic trims.
- UI: glass-morphism panels, neon borders, chunky buttons.
- VFX: confetti, coin bursts, neon trails on rolls and upgrades.
- Palette: Neon Blue #00f3ff, Neon Pink #d946ef, Urban Black #0f172a, Gold #fbbf24.

## Audio Notes
- Bright dice roll clicks, coin showers, short chimes for upgrades.
- Tension stingers for heists and shutdowns.

## Success Metrics (Targets)
- D1 retention: 35-45%
- D7 retention: 15-20%
- Average session length: 60-120 seconds
- ARPDAU target: $0.10-$0.25

## MVP Scope
- Board loop, dice system, 3 cities, basic building tiers.
- One PvP interaction (heist) and shields.
- Sticker collection with one album.
- Basic store with dice packs.
