# 🛠️ Developer Guide - City Slacker

Complete guide for developers working on the City Slacker project.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Project Architecture](#project-architecture)
3. [Development Workflow](#development-workflow)
4. [Component Guide](#component-guide)
5. [Testing Guide](#testing-guide)
6. [Performance Best Practices](#performance-best-practices)
7. [Audio System](#audio-system)
8. [Animation System](#animation-system)
9. [State Management](#state-management)
10. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm 9+** (comes with Node)
- **Git** for version control
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - Vitest Test Explorer

### Initial Setup

```powershell
# Clone repository
git clone https://github.com/tdrose01/city-builder.git
cd city-builder/web

# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser
# Navigate to http://localhost:5173
```

### Development Commands

```powershell
# Development
npm run dev              # Start dev server (hot reload)
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm test                 # Run all tests
npm run test:ui          # Visual test UI
npm run test:coverage    # Generate coverage report

# Linting
npm run lint             # Check for linting errors
npm run lint:fix         # Auto-fix linting errors
```

---

## 🏗️ Project Architecture

### Directory Structure

```
web/
├── src/
│   ├── components/           # React components
│   │   ├── BoardLoop.jsx    # Main game loop (2000+ lines)
│   │   ├── ThreeDice.jsx    # 3D dice rendering
│   │   ├── CityTransition.jsx    # City unlock animations
│   │   ├── ParticleEffect.jsx    # Particle system
│   │   ├── AudioControls.jsx     # Audio UI
│   │   ├── MissionTracker.jsx    # Mission system
│   │   ├── EventProgress.jsx     # Event milestones
│   │   ├── SaveManager.jsx       # Save/load UI
│   │   ├── Notification.jsx      # Toast notifications
│   │   ├── TextPop.jsx           # Floating text effects
│   │   ├── ConfirmDialog.jsx     # Confirmation dialogs
│   │   └── __tests__/            # Component tests
│   ├── utils/                # Utility functions
│   │   ├── audioManager.js       # Audio system
│   │   ├── performanceMonitor.js # Performance tracking
│   │   └── __tests__/            # Utility tests
│   ├── App.jsx               # Root component
│   ├── index.css             # Global styles
│   └── main.jsx              # Entry point
├── public/                   # Static assets
├── tests/                    # E2E tests (Playwright)
├── package.json              # Dependencies
├── vite.config.js            # Vite configuration
└── vitest.config.js          # Test configuration
```

### Key Technologies

- **React 19.2**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Declarative animation library
- **Three.js / React Three Fiber**: 3D rendering for dice
- **Vitest**: Fast unit test runner
- **Playwright**: E2E testing framework
- **Web Audio API**: Sound synthesis

---

## 💻 Development Workflow

### AI Agent Guidelines

This project uses AI coding agents. **Always follow [AGENTS.md](./AGENTS.md):**

1. **Read before writing** - Understand existing patterns
2. **Small diffs** - Minimal, focused changes
3. **Test everything** - Add/update tests for changes
4. **No drive-by refactors** - Stay focused on task
5. **Database migrations** - Use migration files for schema changes

### Git Workflow

```powershell
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm test

# Stage and commit
git add .
git commit -m "feat: Add your feature description"

# Push to remote
git push -u origin feature/your-feature-name

# Create pull request on GitHub
```

### Commit Message Format

Follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Formatting, no code change
- `refactor:` Code change that neither fixes bug nor adds feature
- `perf:` Performance improvement
- `test:` Adding/updating tests
- `chore:` Maintenance tasks

Example: `feat: Add city transition animations with particle effects`

---

## 🧩 Component Guide

### BoardLoop.jsx - Main Game Component

**Purpose**: Central game loop managing all game state and logic.

**Key Responsibilities**:
- Dice rolling and player movement
- Tile effects (funds, upgrades, bonuses)
- Mission and event tracking
- Save/load game state
- City progression
- Animation triggers

**State Management**:
```javascript
// Player state
const [playerPosition, setPlayerPosition] = useState(0);
const [funds, setFunds] = useState(7500);
const [dice, setDice] = useState(50);

// City state
const [cityLevel, setCityLevel] = useState(1);
const [tiles, setTiles] = useState(CITY_1_TILES);

// Mission/Event state
const [missions, setMissions] = useState([...]);
const [milestones, setMilestones] = useState([...]);

// Animation state
const [activeParticles, setActiveParticles] = useState([]);
const [cityTransitionActive, setCityTransitionActive] = useState(false);
```

**Adding New Features**:

1. Add state variables at top of component
2. Create handler functions for user actions
3. Integrate with existing game loop
4. Add save/load support
5. Write tests

Example - Adding a new tile effect:

```javascript
// 1. Add to tile data
const tiles = [
  { id: 1, type: 'NEW_TYPE', label: 'New Effect', payout: 1000 }
];

// 2. Handle in tile effect logic
const handleTileEffect = (tile) => {
  if (tile.type === 'NEW_TYPE') {
    // Your logic here
    setFunds(prev => prev + tile.payout);
    addNotification('New effect triggered!', 'success');
    addParticleEffect('confetti', playerPosition);
  }
};

// 3. Add to save state
const saveGame = () => {
  const gameState = {
    // ... existing state
    newFeatureData: yourNewData
  };
  localStorage.setItem('citySlackerSave', JSON.stringify(gameState));
};
```

---

### CityTransition.jsx - City Unlock Animations

**Purpose**: Smooth, celebratory transitions when unlocking new cities.

**Props**:
```javascript
{
  isActive: boolean,        // Trigger animation
  cityLevel: number,        // Target city (1-35)
  onComplete: () => void    // Callback when done
}
```

**Usage**:
```javascript
<CityTransition
  isActive={cityTransitionActive}
  cityLevel={targetCity}
  onComplete={handleCityTransitionComplete}
/>
```

**Customization**:
- Edit `CITY_CELEBRATION_CONFIG` for city-specific effects
- Adjust animation timing in component (default: 4s total)
- Modify stages: fadeIn (0.5s) → celebrate (2s) → cityReveal (1s) → fadeOut (0.5s)

---

### ParticleEffect.jsx - Particle System

**Purpose**: Reusable particle effects for celebrations and feedback.

**Props**:
```javascript
{
  type: string,              // 'burst' | 'confetti' | 'stars' | 'sparkles' | 'coins' | 'fireworks' | 'trail'
  x: number,                 // Center X position (px)
  y: number,                 // Center Y position (px)
  cityLevel: number,         // For city-specific colors (optional)
  colors: string[],          // Custom colors (optional)
  count: number,             // Particle count (default varies by type)
  size: number,              // Particle size in pixels (default: 8)
  duration: number,          // Animation duration in seconds (default: 1.5)
  distance: number,          // Spread distance (default: 100)
  spread: number,            // Spread angle in degrees (default: 360)
  onComplete: () => void     // Cleanup callback
}
```

**Usage Examples**:

```javascript
// Simple burst
<ParticleEffect
  type="burst"
  x={500}
  y={300}
  onComplete={() => console.log('Burst done')}
/>

// Custom confetti
<ParticleEffect
  type="confetti"
  x={centerX}
  y={centerY}
  colors={['#ff0000', '#00ff00', '#0000ff']}
  count={50}
  duration={2}
  onComplete={removeParticle}
/>

// City-themed stars
<ParticleEffect
  type="stars"
  x={posX}
  y={posY}
  cityLevel={2}  // Uses Deco Heights colors
  count={20}
/>
```

**Adding New Particle Types**:

1. Edit `PARTICLE_TYPES` object in component:
```javascript
myNewType: {
  shape: 'circle',  // 'circle' | 'rectangle' | 'star' | 'sparkle'
  animation: (distance, angle, duration) => ({
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    rotate: [0, 360],
    scale: [1, 0],
    opacity: [1, 0]
  }),
  defaultCount: 30,
  defaultDuration: 1.5
}
```

2. Use in BoardLoop:
```javascript
addParticleEffect('myNewType', position);
```

---

### AudioControls.jsx + audioManager.js - Audio System

**Purpose**: Game audio with volume controls and persistence.

**AudioManager API**:

```javascript
import audioManager from '../utils/audioManager';

// Initialize (call on first user interaction)
await audioManager.init();

// Play sound effects
audioManager.playSFX('diceRoll');
audioManager.playSFX('upgrade');
audioManager.playSFX('funds');
audioManager.playSFX('cityUnlock');
audioManager.playSFX('milestone');
audioManager.playSFX('click');
audioManager.playSFX('success');
audioManager.playSFX('doubles');

// Volume control
audioManager.setVolume('master', 0.7);  // 0-1
audioManager.setVolume('sfx', 0.8);

// Mute toggle
audioManager.toggleMute();
audioManager.setMuted(true);

// Get settings
const settings = audioManager.getSettings();
// { volumes: { master: 0.7, sfx: 0.6 }, muted: false }

// Cleanup (on unmount)
audioManager.dispose();
```

**Adding New Sound Effects**:

1. Add method in `AudioManager` class:
```javascript
playMyNewSound() {
  if (!this.initialized || this.muted) return;

  try {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);

    // Configure sound
    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.5
    );

    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.5);
  } catch (error) {
    console.error('Error playing myNewSound:', error);
  }
}
```

2. Add to `playSFX` switch:
```javascript
playSFX(type) {
  switch (type) {
    // ... existing cases
    case 'myNewSound':
      this.playMyNewSound();
      break;
  }
}
```

3. Use in game:
```javascript
audioManager.playSFX('myNewSound');
```

---

## 🧪 Testing Guide

### Test Structure

```
web/src/
├── components/
│   ├── __tests__/
│   │   ├── BoardLoop.test.jsx           # Main game tests
│   │   ├── BoardLoopEffects.test.jsx    # Tile effect tests
│   │   ├── BoardLoopPersistence.test.jsx # Save/load tests
│   │   ├── CityTransition.test.jsx      # Animation tests
│   │   ├── ParticleEffect.test.jsx      # Particle tests
│   │   └── ...
└── utils/
    └── __tests__/
        ├── audioManager.test.js          # Audio tests
        └── ...
```

### Writing Tests

**Component Test Template**:

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('should render correctly', () => {
      render(<MyComponent />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle button click', async () => {
      const user = userEvent.setup();
      const mockCallback = vi.fn();
      
      render(<MyComponent onClick={mockCallback} />);
      
      await user.click(screen.getByRole('button'));
      
      expect(mockCallback).toHaveBeenCalledOnce();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing props gracefully', () => {
      render(<MyComponent />);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
```

**Utility Test Template**:

```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import MyUtility from '../myUtility';

describe('MyUtility', () => {
  let utility;

  beforeEach(() => {
    utility = new MyUtility();
  });

  afterEach(() => {
    utility.cleanup();
  });

  it('should initialize with defaults', () => {
    expect(utility.value).toBe(0);
  });

  it('should perform calculation', () => {
    const result = utility.calculate(5, 10);
    expect(result).toBe(15);
  });
});
```

### Running Tests

```powershell
# Run all tests
npm test

# Watch mode (re-run on changes)
npm test -- --watch

# Run specific file
npm test BoardLoop

# Run with coverage
npm run test:coverage

# Visual test UI (recommended)
npm run test:ui
```

### Test Best Practices

1. **Test behavior, not implementation**
   - ✅ `expect(button).toBeDisabled()`
   - ❌ `expect(component.state.disabled).toBe(true)`

2. **Use user-centric queries**
   - ✅ `screen.getByRole('button', { name: 'Roll Dice' })`
   - ❌ `container.querySelector('.dice-button')`

3. **Mock external dependencies**
   ```javascript
   vi.mock('../utils/audioManager', () => ({
     default: {
       playSFX: vi.fn(),
       init: vi.fn()
     }
   }));
   ```

4. **Test accessibility**
   ```javascript
   expect(button).toHaveAttribute('aria-label', 'Roll dice');
   ```

5. **Clean up after tests**
   ```javascript
   beforeEach(() => {
     vi.clearAllMocks();
     localStorage.clear();
   });
   ```

---

## ⚡ Performance Best Practices

### React Optimization

**1. Use React.memo for expensive components**:

```javascript
import { memo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  // Heavy rendering logic
  return <div>{data}</div>;
});
```

**2. Memoize callbacks with useCallback**:

```javascript
const handleClick = useCallback(() => {
  // Handler logic
}, [dependency]);
```

**3. Memoize computed values with useMemo**:

```javascript
const expensiveValue = useMemo(() => {
  return heavyComputation(data);
}, [data]);
```

**4. Avoid inline object/array creation in props**:

```javascript
// ❌ Bad - creates new object every render
<Component style={{ color: 'red' }} />

// ✅ Good - stable reference
const style = { color: 'red' };
<Component style={style} />
```

### Animation Performance

**1. Use GPU-accelerated properties**:

```javascript
// ✅ GPU-accelerated
transform: 'translateX(100px)'
opacity: 0.5

// ❌ CPU-bound (triggers layout)
left: '100px'
width: '200px'
```

**2. Use `will-change` for frequent animations**:

```css
.animated-element {
  will-change: transform, opacity;
}
```

**3. Limit particle counts**:

```javascript
// Respect reduced-motion preference
const particleCount = prefersReducedMotion ? 10 : 50;
```

### Performance Monitoring

Use the built-in `PerformanceMonitor`:

```javascript
import performanceMonitor from '../utils/performanceMonitor';

// Start monitoring (auto-starts in dev)
performanceMonitor.start();

// Track component renders
performanceMonitor.trackRender('MyComponent');

// Get performance report
const report = performanceMonitor.getReport();
console.log('FPS:', report.fps);
console.log('Memory:', report.memory);

// Stop monitoring
performanceMonitor.stop();
```

---

## 🔊 Audio System

### Architecture

```
Web Audio API
    ↓
AudioContext
    ↓
MasterGain ← AudioManager manages this
    ↓
SFXGain ← Volume controls
    ↓
Individual sounds (OscillatorNode + GainNode)
```

### Sound Synthesis

Each sound uses oscillators and gain envelopes:

```javascript
// Example: Simple beep
const osc = audioContext.createOscillator();
const gain = audioContext.createGain();

osc.connect(gain);
gain.connect(sfxGain);

// Frequency (pitch)
osc.frequency.setValueAtTime(440, audioContext.currentTime);

// Volume envelope (fade out)
gain.gain.setValueAtTime(0.3, audioContext.currentTime);
gain.gain.exponentialRampToValueAtTime(
  0.01,
  audioContext.currentTime + 0.5
);

osc.start();
osc.stop(audioContext.currentTime + 0.5);
```

### Browser Autoplay Policy

Browsers block audio until user interaction:

```javascript
// Initialize on first click/keypress
document.addEventListener('click', () => {
  audioManager.init();
}, { once: true });
```

---

## 🎨 Animation System

### Framer Motion Basics

```javascript
import { motion } from 'framer-motion';

// Simple animation
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
>
  Content
</motion.div>

// With variants
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
/>
```

### Animation Timing

```javascript
<motion.div
  animate={{ x: 100 }}
  transition={{
    duration: 0.5,
    ease: 'easeInOut',
    delay: 0.2
  }}
/>
```

### Accessibility

Always respect reduced-motion:

```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const duration = prefersReducedMotion ? 0.1 : 0.5;
```

---

## 💾 State Management

### Local Storage

Game state persists automatically:

```javascript
// Save
const saveGame = () => {
  const state = {
    version: 'v1',
    player: { funds, dice, position },
    cities: { level, tiles },
    missions,
    events
  };
  localStorage.setItem('citySlackerSave', JSON.stringify(state));
};

// Load
const loadGame = () => {
  const saved = localStorage.getItem('citySlackerSave');
  if (!saved) return null;
  
  const state = JSON.parse(saved);
  
  // Version check and migration
  if (state.version !== 'v1') {
    return migrateState(state);
  }
  
  return state;
};
```

### State Patterns

**1. Derive state when possible**:

```javascript
// ❌ Don't store derived state
const [total, setTotal] = useState(0);
useEffect(() => {
  setTotal(items.reduce((sum, item) => sum + item.value, 0));
}, [items]);

// ✅ Compute on render
const total = items.reduce((sum, item) => sum + item.value, 0);
```

**2. Batch state updates**:

```javascript
// ❌ Multiple updates = multiple renders
setFunds(prev => prev + 1000);
setDice(prev => prev + 10);
setNotification('Reward claimed!');

// ✅ Batch with React 18 automatic batching
// (Already optimized in React 18+)
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Tests failing with "window.matchMedia is not a function"

**Solution**: Mock in test setup:

```javascript
beforeEach(() => {
  window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  }));
});
```

#### 2. Audio not playing

**Causes**:
- AudioManager not initialized
- Browser autoplay blocking
- User hasn't interacted with page

**Solution**:
```javascript
// Ensure init on user interaction
document.addEventListener('click', () => {
  audioManager.init();
}, { once: true });
```

#### 3. Animations laggy

**Causes**:
- Too many particles
- Non-GPU properties
- Not using React.memo

**Solutions**:
- Reduce particle counts
- Use transform/opacity only
- Wrap components in `memo()`
- Check performance monitor

#### 4. Save data lost

**Causes**:
- localStorage quota exceeded
- Incognito/private mode
- Browser clear data

**Solution**: Add error handling:
```javascript
try {
  localStorage.setItem('key', data);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    console.error('Storage full');
  }
}
```

### Debug Tools

**React DevTools**: Inspect component tree, props, state
**Performance Monitor**: Track FPS and memory
**Vitest UI**: Visual test debugging
**Browser DevTools > Performance**: Profile animations

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Three.js Docs](https://threejs.org/docs/)
- [Web Audio API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Vitest Docs](https://vitest.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)

---

## 🤝 Getting Help

- **Project Issues**: [GitHub Issues](https://github.com/tdrose01/city-builder/issues)
- **Documentation**: Check `/docs` folder
- **Knowledge Base**: [KNOWLEDGE_BASE.md](./KNOWLEDGE_BASE.md)
- **Code Guidelines**: [AGENTS.md](./AGENTS.md)

---

**Last Updated**: 2026-01-27 (Phase 5 Complete)
