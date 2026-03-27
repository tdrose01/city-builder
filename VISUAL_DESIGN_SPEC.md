# City Slacker - Visual Design Spec
*Target: Monopoly Go Premium Mobile Aesthetic*
*Created: 2026-03-27*

---

## 1. Art Direction

### Core Aesthetic: "Vibrant City Playground"

**The Vibe:** A cheerful, polished world where every tap feels satisfying. Think board game meets animated city—colorful, tactile, and alive. Not realistic, but believable within its own stylized universe.

**Key Principles:**
- **Depth over flatness** - Everything has volume, shadow, and presence
- **Celebration of progress** - Upgrades, wins, and milestones get visual fanfare
- **Tactile satisfaction** - Materials feel real (glossy, metallic, fabric textures)
- **Character personality** - The player piece is a character, not a token
- **Environmental storytelling** - Each city has mood, lighting, and identity

---

## 2. Board Design

### Tile Architecture

**The Goal:** Replace flat CSS boxes with 3D tiles that have presence and personality.

**Tile Structure:**
- **Base**: Raised platform (0.2 units height) with beveled edges
- **Surface**: Material texture varies by tile type (see below)
- **Border**: Subtle glow rim (color matches property group)
- **Label**: Floating text above tile, not painted on surface

**Tile Types & Materials:**

| Tile Type | Material | Color Tone | Special FX |
|-----------|----------|------------|------------|
| Property (Brown/Purple) | Matte painted wood | Warm earth tones | Subtle wood grain texture |
| Property (Light Blue) | Smooth plastic | Soft sky blue | Light gloss reflection |
| Property (Pink/Orange) | Glossy ceramic | Vibrant coral/pink | High shine, color gradient |
| Property (Red/Yellow) | Metallic enamel | Bold primary colors | Metallic flake sparkle |
| Property (Green/Blue) | Polished stone | Deep rich tones | Marble-like veining |
| Railroad | Brushed metal | Gunmetal gray | Industrial rivets, steam vents |
| Utility | Glass/translucent | Electric blue/green | Inner glow pulse |
| Chance | mystery purple | Deep violet with gold | Floating question mark, sparkle particles |
| Community Chest | Treasure gold | Antique gold | Lid slightly ajar, glow inside |
| Jail | Stone/iron | Cold gray | Bars, rust streaks, atmospheric fog |
| Free Parking | Luxury | Metallic red | Car silhouette, spotlight effect |
| Go | Celebration banner | Green with gold accents | Animated arrow, sparkle trail |
| Tax | Warning red | Angry red | Calculator/money bag icons |

### Board Layout

**Perspective:** 3D isometric tilt (30-45° angle), not flat top-down

**Board Shape:** Rounded rectangle with corner tiles larger than edge tiles

**Visual Features:**
- Board sits on a "table" surface with depth
- Shadow casting from tiles onto board surface
- Center of board can display city landmark or logo
- Board edge has raised rim (like a picture frame)

---

## 3. Character/Token Design

### Player Piece: "The Tycoon"

**Design Philosophy:** A stylized character, not a generic game piece. Think mascot energy—someone players can identify with.

**Visual Design:**
- **Style**: Low-poly 3D character (Kenney blocky style)
- **Proportions**: Slightly exaggerated head, compact body
- **Default Look**: Business casual, confident pose
- **Animations:**
  - Idle: Subtle breathing, weight shift, checking watch
  - Moving: Bouncy walk cycle with arm swing
  - Celebrating: Fist pump, jump, sparkle burst
  - Disappointed: Slumped shoulders, head shake
- **Customization slots:**
  - Outfit colors (primary/secondary)
  - Accessory (hat, glasses, tie)
  - Trail effect (footprints, sparkles, smoke)

### Visitor Avatars

**Replace emojis with:**
- **Option A**: Stylized 2D portraits (circular, with subtle shadow)
- **Option B**: Mini 3D character busts (like player piece, but smaller)
- **Animation**: Subtle bobbing, glow pulse when active

---

## 4. Lighting Strategy

### Per-City Lighting Moods

Each city/board theme gets distinct lighting:

| City Theme | Primary Light | Secondary Light | Ambient | Mood |
|------------|--------------|-----------------|---------|------|
| Neon Harbor | Blue (#00f3ff) | Purple (#d946ef) | Deep blue-gray | Cyberpunk nightlife |
| Deco Heights | Gold (#fbbf24) | Warm white | Soft cream | 1920s luxury |
| Boardwalk Bay | Sunset orange | Pink accent | Warm sand | Beach resort |
| Tech Valley | Clean white | Cyan accent | Cool gray | Modern startup |
| Rustic Junction | Warm amber | Dusty brown | Earthy tan | Country town |
| Frost Peak | Icy blue | White | Pale silver | Winter wonderland |
| Ember City | Deep red | Orange glow | Smoky gray | Industrial warmth |

### Lighting Techniques

- **3-point lighting**: Key light (main), fill light (shadows), rim light (separation)
- **Vignette**: Subtle darkening at screen edges
- **Bloom**: Emissive materials glow and bloom
- **Ambient occlusion**: Contact shadows for depth
- **HDRI environment**: Sky reflections on metallic surfaces

---

## 5. UI Visual Language

### Design Principles

- **Game HUD, not dashboard** - UI feels like part of the game world
- **Custom iconography** - No generic SVGs; every icon designed for the game
- **Satisfying feedback** - Every tap has visual response

### UI Components

**Buttons:**
- **Primary**: Rounded rectangle, gradient fill, subtle inner glow
- **Pressed**: Scale down to 0.95, darken 10%, ripple effect from touch point
- **Disabled**: Desaturated, 50% opacity, no glow

**Icons:**
- **Style**: Line + fill hybrid, consistent 2px stroke
- **Size**: 24x24 standard, 32x32 for primary actions
- **Animation**: Gentle scale pulse when interactive

**Overlays/Modals:**
- **Background**: Semi-transparent dark (#000000aa)
- **Modal card**: Rounded corners (16px), subtle drop shadow
- **Animation**: Scale from 0.8 to 1.0 with ease-out

**Currency Displays:**
- **Coins**: Gold coin icon, number with comma separators
- **Cash**: Green money icon, abbreviated (1.2M, 5.4K)
- **Animation**: Number increments with easing, coin sprite falls in

---

## 6. Particle Effects Catalog

### When to Use Particles

| Event | Particle Type | Color | Duration | Intensity |
|-------|--------------|-------|----------|-----------|
| Dice roll | Dice pips scatter | White/yellow | 0.5s | Medium |
| Rent collected | Coin shower | Gold | 1.0s | High |
| Property bought | Confetti burst | Property color | 1.5s | High |
| Level up | Fireworks | Multicolor | 2.0s | Very high |
| Land on Chance | Sparkle spiral | Purple/gold | 1.0s | Medium |
| Jail entry | Dust cloud | Gray | 0.5s | Low |
| Go bonus | Star explosion | Green/gold | 1.5s | High |
| Upgrade building | Construction dust | Brown/gray | 0.8s | Medium |
| Bankrupt | Deflated particles | Gray, falling | 2.0s | Low |

### Implementation Notes

- Use **tsParticles** with React Three Fiber integration
- Particle count: 20-50 for subtle, 100-200 for celebrations
- Add screen shake for high-intensity effects
- Pair with sound effects for maximum impact

---

## 7. Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Brand Green | #22c55e | Primary actions, Go tile, money earned |
| Brand Gold | #fbbf24 | Currency, rewards, premium features |
| Brand Blue | #3b82f6 | Secondary actions, information |

### Secondary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Property Brown | #8B4513 | Brown property group |
| Property Blue | #0077BE | Blue property group |
| Property Pink | #FF69B4 | Pink property group |
| Property Orange | #FF8C00 | Orange property group |
| Property Red | #DC143C | Red property group |
| Property Yellow | #FFD700 | Yellow property group |
| Property Green | #228B22 | Green property group |
| Property Purple | #800080 | Purple property group |

### UI Colors

| Name | Hex | Usage |
|------|-----|-------|
| Background Dark | #0f0f23 | Main game background |
| Card Dark | #1a1a2e | Modal/card backgrounds |
| Card Light | #16213e | Secondary cards |
| Text Primary | #ffffff | Main text |
| Text Secondary | #a0a0b0 | Secondary text |
| Text Muted | #606080 | Disabled/hint text |

### Accent Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success | #10b981 | Confirmations, wins |
| Warning | #f59e0b | Alerts, low funds |
| Error | #ef4444 | Errors, bankrupt |
| Info | #06b6d4 | Tips, information |

---

## 8. Typography

### Font Recommendations

**Primary Display Font:** `Fredoka One` or `Baloo 2`
- Bold, rounded, playful
- Use for: Headings, currency, big numbers

**Secondary UI Font:** `Nunito` or `Quicksand`
- Clean, readable, friendly
- Use for: Body text, buttons, labels

**Monospace (Numbers):** `JetBrains Mono` or `Fira Code`
- For currency displays, counters
- Keeps numbers aligned

### Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Heading 1 | 32px | 700 | 1.2 |
| Heading 2 | 24px | 600 | 1.3 |
| Body | 16px | 400 | 1.5 |
| Caption | 12px | 400 | 1.4 |
| Currency | 28px | 700 | 1.0 |

---

## 9. Animation Principles

### Core Timing

- **Fast interactions**: 150-200ms (button presses, toggles)
- **Standard transitions**: 300-400ms (modals, screens)
- **Celebratory moments**: 500-1000ms (wins, rewards)

### Easing Curves

- **Ease-out**: Most UI (fast start, slow end)
- **Ease-in-out**: Modals, panels (smooth both ways)
- **Spring/bounce**: Celebrations, character animations

### Animation Guidelines

1. **Anticipation**: Before a big move, slight backward motion
2. **Overshoot**: Settle slightly past target, then back
3. **Follow-through**: Elements don't stop instantly; have trailing motion
4. **Secondary motion**: Background elements react to main action
5. **Stagger**: Multiple elements animate with slight delays

### Example: Dice Roll Animation

```
1. Anticipation: Dice pull back slightly (50ms)
2. Launch: Dice fly up with rotation (200ms)
3. Air time: Dice tumble mid-air (300ms)
4. Landing: Dice bounce on surface (150ms)
5. Settle: Dice wobble to final position (100ms)
6. Reveal: Glow pulse on result (200ms)
Total: ~1000ms
```

---

## 10. Implementation Checklist

### Phase 1: Foundation
- [ ] Replace CSS tiles with 3D tile prefabs
- [ ] Implement basic lighting setup
- [ ] Add ambient occlusion
- [ ] Set up HDRI environment

### Phase 2: Assets
- [ ] Import Kenney city kit models
- [ ] Create property tile variations
- [ ] Design player character model
- [ ] Create tile type prefabs (Jail, Chance, etc.)

### Phase 3: Polish
- [ ] Implement tsParticles for effects
- [ ] Add button press animations
- [ ] Create celebration sequences
- [ ] Add character idle/move animations

### Phase 4: UI Overhaul
- [ ] Replace generic icons with custom set
- [ ] Implement modal animations
- [ ] Add currency counter animations
- [ ] Design reward popup system

---

## 11. Reference Images

*To be added: Screenshots of Monopoly Go for visual reference*

**Key Screens to Reference:**
1. Board view (isometric angle, tile depth)
2. Dice roll (particle burst, animation)
3. Property card (material quality, typography)
4. Reward popup (celebration, coin shower)
5. Character/token design (personality, animation)

---

*This spec should guide all visual decisions for the game. When in doubt, ask: "Would this look at home in Monopoly Go?"*
