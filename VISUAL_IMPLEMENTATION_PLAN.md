# City Slacker - Visual Implementation Plan
*Generated: 2026-03-31*
*Target: Monopoly Go Premium Mobile Aesthetic*

---

## Executive Summary

This plan details the technical implementation to transform City Slacker from its current flat CSS aesthetic to a premium 3D mobile game experience matching Monopoly Go quality.

**Current Status:** ~20% complete (Phase 1 CSS polish done)
**Target:** 100% visual spec compliance
**Estimated Effort:** 3-4 implementation phases

---

## Phase 1: Lighting & Environment Foundation ✅ (In Progress via Coder Agent)

### 1.1 Three-Point Lighting Setup

**Current State:** Basic ambient lighting, no directional lights

**Implementation:**
```jsx
// In GameScene.jsx
<Canvas shadows>
  {/* Key Light - Main illumination from top-right */}
  <directionalLight
    position={[10, 15, 5]}
    intensity={1.2}
    castShadow
    shadow-mapSize={[2048, 2048]}
    shadow-camera-far={50}
    shadow-camera-left={-20}
    shadow-camera-right={20}
    shadow-camera-top={20}
    shadow-camera-bottom={-20}
  />
  
  {/* Fill Light - Soften shadows from opposite side */}
  <directionalLight
    position={[-8, 8, -5]}
    intensity={0.4}
    color="#e0e7ff"
  />
  
  {/* Rim Light - Separation from background */}
  <directionalLight
    position={[0, 5, -15]}
    intensity={0.6}
    color="#00f3ff"
  />
  
  {/* Ambient */}
  <ambientLight intensity={0.3} color="#1a1a2e" />
</Canvas>
```

### 1.2 Ambient Occlusion

**Implementation:**
```jsx
import { EffectComposer, SSAO, Bloom } from '@react-three/postprocessing'

<EffectComposer>
  <SSAO
    samples={16}
    radius={0.1}
    intensity={20}
  />
  <Bloom
    intensity={0.5}
    luminanceThreshold={0.8}
  />
</EffectComposer>
```

### 1.3 HDRI Environment

**Implementation:**
```jsx
import { Environment } from '@react-three/drei'

// Option A: Use Kenney sky or generate gradient
<Environment background>
  <mesh>
    <sphereGeometry args={[50, 32, 32]} />
    <meshBasicMaterial color="#0f0f23" side={THREE.BackSide} />
  </mesh>
</Environment>

// Option B: Load HDRI from public/env.hdr
<Environment files="/env.hdr" background />
```

### 1.4 Camera Optimization

**Current Settings:**
- Distance: 17
- Height: 13
- FOV: 42
- Rotation: PI/4 (45°)

**Recommended Changes:**
- Reduce FOV to 35-40 for more dramatic isometric look
- Adjust height to 12 for better tile depth visibility
- Add smooth camera transitions for events

---

## Phase 2: Tile Overhaul

### 2.1 Raised Platform Tiles

**Current Issue:** Tiles are flat RoundedBox with no visual depth

**Solution:** Create tiered tile structure:

```jsx
// New Tile3D structure
<group>
  {/* Base platform */}
  <RoundedBox args={[2.2, 0.15, 2.2]} radius={0.1} position={[0, 0, 0]}>
    <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.3} />
  </RoundedBox>
  
  {/* Main tile surface */}
  <RoundedBox args={[2, 0.2, 2]} radius={0.15} position={[0, 0.175, 0]}>
    <meshStandardMaterial 
      color={tileColor}
      metalness={0.6}
      roughness={0.2}
      emissive={emissiveColor}
      emissiveIntensity={0.2}
    />
  </RoundedBox>
  
  {/* Beveled edge rim */}
  <mesh position={[0, 0.05, 0]}>
    <boxGeometry args={[2.05, 0.1, 2.05]} />
    <meshStandardMaterial color={rimColor} metalness={0.9} roughness={0.1} />
  </mesh>
</group>
```

### 2.2 Tile-Type Materials

| Tile Type | Base Color | Material | Special FX |
|-----------|------------|----------|------------|
| Start | #22c55e | Glossy plastic | Animated glow pulse |
| Funds | Theme color | Matte + building | Kenney building model |
| Lottery | #f59e0b | Glossy with sparkles | Particle emitter |
| Tax | #ef4444 | Matte warning | Glow on hover |
| Jail | #374151 | Stone texture | Bars model overlay |
| Bonus | #fbbf24 | Metallic gold | Confetti particles |
| Fortune | #06b6d4 | Crystal/glass | Inner glow |

### 2.3 Kenney Building Integration

**Available Assets:** 44 GLB models in `/public/kenney-city/Models/GLB format/`

**Recommended Mapping:**
- `building-a.glb` through `building-n.glb` → Property tiles (random selection)
- `building-skyscraper-*.glb` → High-value properties (level 3+)
- `low-detail-building-*.glb` → Background scenery, low-priority tiles
- `detail-awning.glb`, `detail-parasol-*.glb` → Props for upgraded properties

**Implementation:**
```jsx
// In Building.jsx or Tile3D.jsx
import { useGLTF } from '@react-three/drei'

const BUILDING_MAP = {
  1: 'building-a.glb',
  2: 'building-d.glb',
  3: 'building-skyscraper-a.glb',
  // etc.
}

const BuildingModel = ({ level, themeColor }) => {
  const modelPath = `/kenney-city/Models/GLB format/${BUILDING_MAP[level] || 'building-a.glb'}`
  const { scene } = useGLTF(modelPath)
  
  return (
    <primitive 
      object={scene.clone()} 
      scale={0.3}
      position={[0, 0.2, 0]}
    />
  )
}
```

---

## Phase 3: Character Model Integration

### 3.1 Player Pawn Replacement

**Current State:** Primitive colored circle or basic shape

**Available Assets:** 18 Kenney Blocky Characters (GLB with 27 animations each)
- Location: `/public/kenney-characters/Models/GLB format/`
- Files: `character-a.glb` through `character-r.glb`

**Recommended Characters:**
- `character-a.glb` - Default tycoon (business look)
- `character-b.glb` - Alternative outfit
- `character-c.glb` through `character-r.glb` - Unlockable skins

**Implementation:**
```jsx
// PlayerPawn.jsx - Replace current primitive with:
import { useGLTF, useAnimations } from '@react-three/drei'

const PlayerPawn = forwardRef(({ position, isMoving, themeColor }, ref) => {
  const { scene, animations } = useGLTF('/kenney-characters/Models/GLB format/character-a.glb')
  const { actions } = useAnimations(animations, scene)
  
  useEffect(() => {
    if (isMoving) {
      actions['Walk']?.reset().fadeIn(0.2).play()
    } else {
      actions['Idle']?.reset().fadeIn(0.2).play()
    }
  }, [isMoving, actions])
  
  return (
    <primitive 
      ref={ref}
      object={scene}
      position={[position[0], 0.3, position[2]]}
      scale={0.5}
      rotation={[0, Math.PI, 0]}
    />
  )
})
```

### 3.2 Animation States

**Required Animations:**
1. **Idle** - Default standing, subtle breathing
2. **Walk** - Movement animation
3. **Celebrate** - Win/reward moment
4. **Disappointed** - Lose/tax moment

---

## Phase 4: Particle Effects

### 4.1 tsParticles Integration

**Implementation Approach:**
- Use `@react-three/fiber` with `tsParticles` or custom THREE.Points
- Trigger based on game events

**Particle Events:**

| Event | Particle Type | Count | Duration |
|-------|--------------|-------|----------|
| Dice Roll | White/yellow pips | 20 | 0.5s |
| Rent Collected | Gold coins | 50 | 1.0s |
| Property Bought | Confetti (theme color) | 100 | 1.5s |
| Level Up | Fireworks | 150 | 2.0s |
| Land on Chance | Purple sparkles | 30 | 1.0s |
| Go Bonus | Green stars | 75 | 1.5s |

### 4.2 Implementation Example

```jsx
import Particles from 'react-tsparticles'
import { loadConfettiPreset } from 'tsparticles-preset-confetti'

const ParticleManager = ({ eventType }) => {
  const particlesInit = useCallback(async (engine) => {
    await loadConfettiPreset(engine)
  }, [])
  
  if (!eventType) return null
  
  return (
    <Particles
      id={`particles-${eventType}`}
      init={particlesInit}
      options={particleConfigs[eventType]}
    />
  )
}
```

---

## Phase 5: UI Polish

### 5.1 Button Animations (Already Implemented ✅)

Current implementation includes:
- Scale on press (0.95)
- Ripple effect
- Glow on hover

### 5.2 Modal Transitions

**Implementation:**
```css
/* Modal entrance animation */
.modal-enter {
  animation: modalIn 0.3s ease-out;
}

@keyframes modalIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

### 5.3 Currency Counter Animation

**Implementation:**
```jsx
import { useSpring, animated } from '@react-spring/web'

const CurrencyDisplay = ({ value }) => {
  const { number } = useSpring({
    number: value,
    from: { number: 0 }
  })
  
  return (
    <animated.span>
      {number.to(n => Math.floor(n).toLocaleString())}
    </animated.span>
  )
}
```

---

## Implementation Priority Order

### Week 1: Foundation
1. ✅ Lighting overhaul (3-point setup, AO, bloom) - **Coder Agent Running**
2. ✅ HDRI environment or gradient background
3. Camera angle optimization

### Week 2: Core Assets
1. Replace PlayerPawn with Kenney character model
2. Integrate Kenney buildings on property tiles
3. Create raised platform tile structure

### Week 3: Effects
1. tsParticles integration
2. Event-based particle triggers
3. Screen shake for impacts

### Week 4: Polish
1. Modal animations
2. Currency counter animations
3. UI micro-interactions

---

## File Modification Checklist

### Scene3D/
- [ ] `GameScene.jsx` - Add lighting, environment, effects
- [ ] `Board3D.jsx` - Camera optimization, scale adjustments
- [ ] `Tile3D.jsx` - Raised platform structure, materials
- [ ] `PlayerPawn.jsx` - Replace with Kenney character
- [ ] `Building.jsx` - Integrate actual Kenney GLB models

### New Files Needed
- [ ] `Scene3D/Lighting.jsx` - Extracted lighting component
- [ ] `Scene3D/ParticleManager.jsx` - Centralized particle effects
- [ ] `hooks/useAnimations.js` - Animation state management

### Public Assets
- [x] `/kenney-city/` - City buildings (44 GLB files)
- [x] `/kenney-characters/` - Character models (18 GLB files)
- [ ] `/env.hdr` - HDRI environment (optional)

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Visual spec compliance | 20% | 100% |
| 3D asset integration | 0% | 100% |
| Lighting quality | Basic | 3-point + AO + bloom |
| Character model | Primitive circle | Full animated 3D |
| Particle effects | Basic Points | tsParticles system |
| Material quality | Flat colors | PBR with emissive |

---

## Notes

- Kenney assets are CC0 licensed (free for commercial use)
- Character animations: 27 per model (idle, walk, run, jump, etc.)
- Building models: 14 standard + 5 skyscrapers + 15 low-detail
- All GLB files are optimized for web (~100KB each)

---

*This plan should be executed in phases. Do not skip to Phase 4 before completing Phases 1-3.*
