# Economy Model Usage

This folder provides CSVs for progression, events, and shop:
- `economy_cities.csv`: per-city summary settings and rewards.
- `economy_tiers.csv`: per-tier upgrade costs by city.
- `economy_assumptions.csv`: shared conversion rates for dice, funds, and sticker packs.
- `event_milestones.csv`: event milestone config.
- `event_milestones_model.csv`: reward pacing math by milestone.
- `event_milestones_tuned_standard.csv`: tuned curve (target ~450 rolls at 10 pts/roll).
- `event_milestones_tuned_soft.csv`: easier curve (target ~320 rolls at 10 pts/roll).
- `event_milestones_tuned_hard.csv`: harder curve (target ~600 rolls at 10 pts/roll).
- `event_milestones_tuned_250_dice.csv`: tuned curve (target ~250 rolls at 10 pts/roll).
- `shop_bundles.csv`: bundle contents and availability.
- `shop_pricing_tiers.csv`: regional price points.
- `shop_value_ratios.csv`: dice-equivalent value per price tier.
- `sticker_albums.csv`: album-level rewards.
- `sticker_sets.csv`: set definitions and rewards.
- `sticker_rarity_odds.csv`: base rarity probabilities.
- `economy_master.csv`: single-file merge of all economy CSVs (for import).
- `session_pacing_model.csv`: milestone pacing by session based on current event points.
- `session_pacing_targets.csv`: adjustable pacing assumptions.
- Web runtime loads CSVs from `web/public/economy`.

## How to Use
1) Import both CSVs into a spreadsheet.
2) In `economy_tiers.csv`, compute `tier_cost` using:
   =base_cost*(1.35^tier_index)*city_multiplier
3) Sum tier costs per city to verify totals against target completion time.
4) Adjust `city_multiplier`, `base_cost`, and `tier_count` to tune pacing.
5) Import `economy_assumptions.csv` into a sheet named `assumptions`.
6) Use `event_milestones_model.csv` to validate reward pacing.
7) Use `shop_value_ratios.csv` to validate value-per-dollar targets (relies on `assumptions` sheet).
8) Use `economy_master.csv` if you want a single-file import (sheet name stored per row).
9) Use `session_pacing_targets.csv` to retune rolls-per-session and points-per-roll.

## Suggested Targets
- Early city completion: 1-2 sessions.
- Mid city completion: 2-4 sessions.
- Late city completion: 4-6 sessions.
- Dice regen: 1 die per 9 minutes, cap 90.

## Tile Reward Tuning
- Funds tile baseline: 0.3% - 0.6% of city total cost.
- Rent tile baseline: 0.6% - 1.0% of city total cost.
- Heist payout: 5% - 15% of bank.
- Shutdown repair: 25% of tier cost.
- Doubles bonus multiplier is set in `economy_assumptions.csv`.

## Notes
- Use a separate sheet for event milestones and sticker rewards.
- Keep all values in soft currency; convert to premium only for shop bundles.
- Add duplicate dust conversion, craft costs, and wildcard meter thresholds to `economy_assumptions.csv`.
