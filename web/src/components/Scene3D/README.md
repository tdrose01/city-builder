# Scene3D Module

3D Visual Overhaul for City-Builder Game (Phase 10)

## Overview

This module transforms the flat 2D board into a rich 3D environment using **React Three Fiber** and **Three.js**. Targets "Monopoly Go" aesthetic with dynamic camera, physics-based particles, and polished 3D assets.

## Architecture

```
Scene3D/
├── index.js              # Module exports
├── README.md             # This file
├── IntegrationGuide.jsx  # BoardLoop integration example
├── GameScene.jsx         # Global Canvas container
├── Board3D.jsx           # 20-tile 3D board
├── Tile3D.jsx            # Individual tile components
├── PlayerPawn.jsx        # Player piece with hop animation
├── CameraController.jsx  # Dynamic camera (follow, shake, zoom)
├── DiceRig.jsx           # 3D dice rolling rig
├── VFXManager.jsx        # Unified effects API
├── VFX/
│   ├── InstancedParticles.jsx  # Generic particle system
│   ├── CoinExplosion.jsx       # Coin fountain physics
│   └── LevelUpBurst.jsx        # Celebration effects
```

## Components

### GameScene
Entry point. Wraps everything in `<Canvas>` with lighting, shadows, and post-processing (Bloom).

```jsx
import { GameScene } from './Scene3D';

<GameScene>
  <Board3D tiles={tiles} playerPosition={5} />
</GameScene>
```

### Board3D
Monopoly-style rectangular board with 20 tiles. Handles tile positioning, player movement, and camera integration.

**Features:**
- Automatic tile positioning (5 per side)
- Tile type rendering (16 types)
- Player pawn animation
- Camera controller integration

### Tile3D
Individual tiles with:
- `RoundedBox` geometry
- Type-specific materials (emissive, metalness)
- Floating animation
- Hover effects
- Level indicators for landmarks

### PlayerPawn
3D player piece with parabolic hop animation.

**Animation:**
- Spring-based movement
- Parabolic arc during hops
- Idle floating
- Spin during movement
- Particle trail

### CameraController
Dynamic camera with "juice":
- Follow mode (smooth tracking)
- Screen shake (Jail, Shutdown events)
- Zoom events (Lottery, Fortune reveals)
- Reset/pan methods

### DiceRig
3D dice integrated into the scene:
- Physics-based rolling animation
- Settles on correct face
- Glow effects during roll
- Positioned relative to board

### VFX System

#### CoinExplosion
High-performance coin physics:
- 500 coin instances
- Gravity, bounce, drag
- Gold/silver variants
- Floor collision

#### LevelUpBurst
Celebration effects:
- Stars, confetti, sparkles
- Color palettes (gold, rainbow, neon)
- Spiral and fountain patterns

#### InstancedParticles
Generic particle system for custom effects.

## Usage

### Basic Setup

```jsx
import { 
  GameScene, 
  Board3D, 
  VFXManager 
} from './Scene3D';

function Game() {
  const vfxRef = useRef();
  const boardRef = useRef();
  
  return (
    <GameScene>
      <Board3D 
        ref={boardRef}
        tiles={gameTiles}
        playerPosition={currentPos}
        playerTargetPosition={targetPos}
        isMoving={isMoving}
        themeColor="#00f3ff"
      />
      <VFXManager ref={vfxRef} />
    </GameScene>
  );
}
```

### Triggering Effects

```jsx
// Coin explosion
vfxRef.current.coinExplosion(x, y, z, {
  amount: 50,
  power: 8,
  spread: 1.5
});

// Level up burst
vfxRef.current.levelUp(x, y, z, {
  colors: 'gold',
  amount: 100
});

// Full celebration
vfxRef.current.celebration(x, y, z);

// Camera shake
boardRef.current.triggerCameraShake(0.5, 0.8);

// Zoom to tile
boardRef.current.zoomToTile(5, 1.5);
```

## Tile Types Supported

| Type | Color | Icon | Special |
|------|-------|------|---------|
| Start | Green | ★ | Corner |
| Funds | Theme | 💰 | Payout label |
| Lottery | Amber | 🎰 | | |
| Tax | Red | 💸 | | |
| Shield | Blue | 🛡️ | | |
| Corner | Purple | 🎁 | Corner |
| Heist | Brown | 🦹 | | |
| Landmark | Teal | 🏛️ | Level indicators |
| Card | Pink | 🃏 | | |
| Jail | Gray | ⛓️ | Corner |
| Sticker | Violet | 📖 | | |
| Shutdown | Red | ⚡ | | |
| Bonus | Amber | 🎉 | | |
| Fortune | Cyan | 🔮 | | |
| Dice | Indigo | 🎲 | | |
| Rent | Lime | 🏠 | | |

## Performance

- **InstancedMesh**: Single draw call for particles
- **Frustum culling**: Automatic via R3F
- **Shadow optimization**: Contact shadows, PCF soft
- **dpr**: [1, 2] for high-res screens
- **Target**: 60fps on desktop/mobile

## Integration with BoardLoop

To integrate into existing game:

1. Import Scene3D components
2. Replace DOM board with `<Board3D />`
3. Move existing tile handlers to `onTileClick`
4. Wire up VFX on win events
5. Toggle CameraController on special events

See Phase 10 plan for migration strategy.
