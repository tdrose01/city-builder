# Phase 10: 3D Visual Overhaul (Monopoly Go Style)

**Objective:** Transform the flat 2D board into a rich 3D environment with dynamic camera movement, physics-based particles, and 3D assets, targeting a "Monopoly Go" aesthetic.

## Goals
- 🎨 **Visual Upgrade:** Switch from CSS Grid/DOM elements to WebGL (React Three Fiber) for the main board.
- 🚀 **Performance:** Use InstancedMesh for particles to handle 1000+ items at 60fps.
- 🎥 **Camera Juice:** Dynamic camera that follows player movement, zooms on events, and shakes on impact.
- 🧱 **3D Assets:** Replace flat tiles with 3D models/blocks.

## Implementation Plan

### Task 10.1: 3D Infrastructure Setup
- [ ] **Global Canvas:** Refactor `BoardLoop` to wrap the game area in a single `<Canvas>` context.
- [ ] **UI Overlay:** Separate the HUD (buttons, stats) into a distinct layer *above* the Canvas.
- [ ] **Scene Setup:** Add environmental lighting (HDRI), shadows, and a basic ground plane.

### Task 10.2: 3D Board System
- [ ] **Board Component:** Create `Board3D.jsx` to render the 20 tiles in a loop.
- [ ] **Tile Meshes:** Create standard 3D meshes for tiles (Funds, Property, Corner) using `RoundedBox` geometry.
- [ ] **Texture Mapping:** Map existing icons/colors to the 3D surfaces.
- [ ] **Player Pawn:** Replace the CSS pawn with a 3D piece that "hops" (parabolic arc) between tiles.

### Task 10.3: High-Performance VFX (The "Juice")
- [ ] **VFX System:** Create `VFXManager.jsx` using R3F `InstancedMesh`.
- [ ] **Coin Explosion:** Implement physics-based coin fountains (using simple gravity/collision math) for big wins.
- [ ] **Level Up Burst:** 3D confetti/starbursts for upgrades.
- [ ] **Dice Physics:** Integrate existing `ThreeDice` directly into the board scene (instead of a separate overlay).

### Task 10.4: Dynamic Camera
- [ ] **Camera Controller:** Implement a custom camera rig.
- [ ] **Follow Mode:** Camera smoothly tracks player movement.
- [ ] **Impact Shake:** Add screen shake on "Jail", "Shutdown", or heavy landings.
- [ ] **Zoom Events:** Camera zooms in for "Lottery" or "Fortune" reveals.

## Tech Stack
- **Core:** React Three Fiber (R3F), Three.js
- **Helpers:** @react-three/drei (for shapes, text, shadows)
- **Animation:** @react-spring/three (for physics/movement)

## Success Criteria
- [ ] Game runs at 60fps on desktop/mobile.
- [ ] Board is fully 3D with depth and shadows.
- [ ] Particle effects handle >500 objects smoothly.
- [ ] UI remains accessible and usable over the 3D layer.
