# Implementation Plan - Implement Enhanced Tile Effects and Gameplay Polish

## Phase 1: Tile and Upgrade Effects [checkpoint: 69ee4b0]
- [x] Task: Implement unique visual feedback for tile types 0218a9a
    - [x] Create CSS animations/classes for different tile landing effects (Shield, Heist, Shutdown)
    - [x] Update `BoardLoop.jsx` to trigger specific effects based on `landedTile.type`
    - [x] Verify each tile type triggers its unique effect on land
- [x] Task: Enhance landmark upgrade feedback bbfeab2
    - [x] Implement a particle burst or celebratory text pop component
    - [x] Trigger the celebration at the landmark's tile position on successful upgrade
    - [x] Verify funds pulse and upgrade celebration fire simultaneously
- [x] Task: Conductor - User Manual Verification 'Phase 1: Tile and Upgrade Effects' (Protocol in workflow.md)

## Phase 2: 3D Dice and HUD Polish [checkpoint: 2c8371e]
- [x] Task: Ground the 3D dice visuals 738708a
    - [x] Add a contact shadow or floor blur to the `ThreeDice` component
    - [x] Adjust lighting to ensure dice read clearly against the "glass" board
    - [x] Verify dice feel connected to the board surface
- [x] Task: Reinforce HUD callouts c504908
    - [x] Add visual badges or highlights for dice streaks in the board HUD
    - [x] Implement short-lived "floating text" or pulses for currency gains
    - [x] Verify HUD updates are readable and align with the Neon Harbor aesthetic
- [x] Task: Conductor - User Manual Verification 'Phase 2: 3D Dice and HUD Polish' (Protocol in workflow.md) 2c8371e

## Phase 3: Movement and Transition Polish [checkpoint: 5236d39]
- [x] Task: Smooth player token transitions 28e2767
    - [x] Implement a path-following animation for the player piece between tiles
    - [x] Add a subtle "hop" or "squash and stretch" effect to the token on landing
    - [x] Verify movement feels fluid and not instantaneous
- [x] Task: Board backdrop evolution c537ae4
    - [x] Update background lighting intensity based on `totalUpgrades`
    - [x] Add a "city glow" effect that increases as the player level increases
    - [x] Verify the visual atmosphere reflects project progression
- [x] Task: Conductor - User Manual Verification 'Phase 3: Movement and Transition Polish' (Protocol in workflow.md) 5236d39
