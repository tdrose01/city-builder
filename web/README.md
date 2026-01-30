# City Slacker Web Prototype

Quick-start prototype for the City Stacker board loop and sticker collection systems.

## Setup

```
cd web
npm install
npm run dev
```

## Deploy to Netlify (CLI)

```
npm install -g netlify-cli
netlify login

npm run build
npm run deploy:netlify
```

## Smoke Test Checklist

- App loads and board renders in the first 3 seconds.
- Dice roll works and player token moves.
- Funds, shields, and dice counters update after a roll.
- Mission tracker updates after collecting shields.
- City upgrade unlocks and changes the multiplier.

## Gameplay Highlights

- Dice-based board loop with funds, heists, shutdowns, and upgrades.
- High Roller multipliers and doubles bonus.
- Event meter, combo target, mission tracker, and risk bonus.
- Sticker album with common/rare/epic packs.
- Duplicate conversion into Dust + Set Tokens.
- Dust crafting and token redemption for missing stickers.
- Set completion rewards (dice + funds).

## Layout Notes

- Fit-to-screen layout for no-scroll play.
- Run progress collapses into compact chips.
- Sticker album details toggle open when needed.
