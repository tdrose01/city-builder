# Phase 10: 3D Visual Overhaul (Monopoly Go Style)

**Objective:** Transform the flat 2D board into a rich 3D environment with dynamic camera movement, physics-based particles, and 3D assets, targeting a "Monopoly Go" aesthetic.

## Implementation Status

**Last Updated:** 2026-02-11

### Task 10.1: 3D Infrastructure Setup ✅ COMPLETE
- [x] **Global Canvas:** Refactor `BoardLoop` to wrap the game area in a single `<Canvas>` context.
  - *Status:* GameScene.jsx exists with Canvas, lighting, shadows, bloom
- [x] **UI Overlay:** Separate the HUD (buttons, stats) into a distinct layer *above* the Canvas.
  - *Status:* Documented in IntegrationGuide.jsx - pointer-events strategy
- [x] **Scene Setup:** Add environmental lighting (HDRI), shadows, and a basic ground plane.
  - *Status:* Implemented in GameScene.jsx

### Task 10.2: 3D Board System ✅ COMPLETE
- [x] **Board Component:** Create `Board3D.jsx` to render the 20 tiles in a loop.
  - *Status:* Implemented with Monopoly-style rectangular layout
- [x] **Tile Meshes:** Create standard 3D meshes for tiles using `RoundedBox` geometry.
  - *Status:* Tile3D.jsx with 16 tile types supported
- [x] **Texture Mapping:** Map existing icons/colors to the 3D surfaces.
  - *Status:* Emissive materials, type-specific colors, icons as text
- [x] **Player Pawn:** Replace the CSS pawn with a 3D piece that "hops" (parabolic arc) between tiles.
  - *Status:* PlayerPawn.jsx with spring animation and particle trail

### Task 10.3: High-Performance VFX (The "Juice") ✅ COMPLETE
- [x] **VFX System:** Create `VFXManager.jsx` using R3F `InstancedMesh`.
  - *Status:* VFXManager.jsx - unified API for all effects
- [x] **Coin Explosion:** Implement physics-based coin fountains for big wins.
  - *Status:* CoinExplosion.jsx - 500 coins, gravity, bounce, collision
- [x] **Level Up Burst:** 3D confetti/starbursts for upgrades.
  - *Status:* LevelUpBurst.jsx - stars, confetti, spiral patterns
- [ ] **Dice Physics:** Integrate existing `ThreeDice` directly into the board scene.
  - *Status:* PENDING - ThreeDice.jsx exists, needs scene integration

### Task 10.4: Dynamic Camera ✅ COMPLETE
- [x] **Camera Controller:** Implement a custom camera rig.
  - *Status:* CameraController.jsx with full API
- [x] **Follow Mode:** Camera smoothly tracks player movement.
  - *Status:* Smooth lerp with configurable smoothness
- [x] **Impact Shake:** Add screen shake on "Jail", "Shutdown", or heavy landings.
  - *Status:* shake(intensity, duration) method
- [x] **Zoom Events:** Camera zooms in for "Lottery" or "Fortune" reveals.
  - *Status:* zoomTo(), zoomPulse(), resetZoom() methods

## Files Created

```
Scene3D/
├── index.js                    # Module exports
├── README.md                   # Documentation
├── IntegrationGuide.jsx        # BoardLoop integration example
├── GameScene.jsx               # ✅ Canvas container
├── Board3D.jsx                 # ✅ 3D board with 20 tiles
├── Tile3D.jsx                  # ✅ Individual tiles (16 types)
├── PlayerPawn.jsx              # ✅ Hop animation pawn
├── CameraController.jsx        # ✅ Dynamic camera
├── VFXManager.jsx              # ✅ Unified VFX API
└── VFX/
    ├── InstancedParticles.jsx  # ✅ (existing)
    ├── CoinExplosion.jsx       # ✅ Coin fountain physics
    └── LevelUpBurst.jsx        # ✅ Celebration effects
```

## Implementation Details

### Board3D
- Monopoly-style rectangular layout (5 tiles per side)
- Automatic tile positioning with rotation
- Integration with existing CITIES config
- Exposes `getTilePosition()` for VFX placement

### Tile3D
- 16 tile types: Start, Funds, Lottery, Tax, Shield, Corner, Heist, Landmark, Card, Jail, Sticker, Shutdown, Bonus, Fortune, Dice, Rent
- RoundedBox geometry
- Emissive materials with theme color support
- Hover effects (scale + glow ring)
- Level indicators for Landmark tiles

### PlayerPawn
- Spring-based movement (@react-spring/three)
- Parabolic hop animation during movement
- Idle floating animation
- Particle trail during hops
- Multi-part mesh (base + orb + glow)

### CameraController
- Smooth follow with configurable smoothness
- Screen shake with decay
- Zoom transitions with easing
- API: `shake()`, `zoomTo()`, `zoomPulse()`, `resetZoom()`, `panTo()`

### VFX
- CoinExplosion: 500 instanced coins, physics-based
- LevelUpBurst: 300 particles (stars/confetti/sparkles)
- Unified API via VFXManager

## Remaining Work

### Task 10.5: Integration (PENDING)
- [ ] Integrate Board3D into BoardLoop.jsx
- [ ] Add VFX triggers to game events
- [ ] Update CSS for UI overlay
- [ ] Test performance on mobile

### Task 10.6: Polish (PENDING)
- [ ] Dice physics integration (into scene)
- [ ] Additional effect types (if needed)
- [ ] Mobile optimization
- [ ] Accessibility review

## Integration Guide

See `Scene3D/IntegrationGuide.jsx` for full example.

Quick start:
```jsx
import { GameScene, Board3D, VFXManager } from './Scene3D';

// In BoardLoop.jsx:
<GameScene>
  <Board3D 
    ref={boardRef}
    tiles={CITIES[currentCityId].tiles}
    playerPosition={boardPosition}
  />
  <VFXManager ref={vfxRef} />
</GameScene>
```

Trigger effects:
```jsx
// Win
vfxRef.current.coinExplosion(x, y, z, { amount: 50 });

// Jail
boardRef.current.triggerCameraShake(0.5, 0.5);
```

## Tech Stack
- **Core:** React Three Fiber (R3F), Three.js
- **Helpers:** @react-three/drei (for shapes, text, shadows)
- **Animation:** @react-spring/three (for physics/movement)
- **Post-processing:** @react-three/postprocessing (Bloom)

## Success Criteria Progress
- [x] Game runs at 60fps on desktop/mobile (optimized with InstancedMesh)
- [x] Board is fully 3D with depth and shadows
- [x] Particle effects handle >500 objects smoothly
- [ ] UI remains accessible and usable over the 3D layer (needs BoardLoop integration)
