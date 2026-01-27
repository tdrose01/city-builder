# 🏙️ City Slacker - Monopoly-Inspired City Builder

A React-based idle/incremental city-building game inspired by Monopoly GO, featuring 35 unique cities, sticker collections, and engaging progression mechanics.

## ✨ Features

### 🎮 Core Gameplay
- **35 Unique Cities**: Progress through increasingly challenging cities with unique themes (5 cities currently implemented!)
  - 🌊 **City 1: Neon Harbor** - Cyan neon theme (1.0x multiplier)
  - 🏛️ **City 2: Deco Heights** - Art Deco gold theme (1.4x multiplier)
  - 💎 **City 3: Crystal Plaza** - Luxury purple theme (1.96x multiplier)
  - ⭐ **City 4: Starlight District** - Cosmic blue theme (2.744x multiplier)
  - 🌆 **City 5: Neon Skyline** - Futuristic emerald theme (3.8416x multiplier)
- **Dynamic Board Mechanics**: Roll dice, land on tiles, earn resources
- **Diverse Tile Types**: 14+ tile types including Lottery 🎰, Tax 💸, Jail 🔒, Fortune 🔮, and more
- **Landmark Upgrades**: Build and upgrade 5 landmarks per city
- **Mission System**: Complete missions for rewards and progression
- **Event System**: Milestone-based events with prestige mechanics
- **Sticker Collections**: Collect and trade stickers across themed albums

### 🎨 Recent Updates
- **Phase 8: Gameplay Enhancement** (IN PROGRESS! 🚧)
  - 4 new interactive tile types: Lottery 🎰, Tax 💸, Jail 🔒, Fortune 🔮
  - Economic scaling system for all new tiles
  - Animated modals with framer-motion
  - Fortune events: 13 weighted random outcomes
- **Phase 6: Multi-City Expansion**
  - 5 fully playable cities with exponential economic scaling (1.4x per city)
  - Unique visual themes and grid patterns for each city
  - Comprehensive multi-city test coverage
- **Phase 5: Polish & Enhancement**
  - Enhanced City Transitions with multi-stage celebration animations
  - Advanced Particle System (7 particle types: burst, confetti, stars, sparkles, coins, fireworks, trail)
  - Synthesized Audio System (8 sound effects using Web Audio API)
  - Performance Optimizations (React.memo, performance monitoring, optimized rendering)
- **Comprehensive Testing**: 190+ tests with 100% pass rate

### 🎨 Visual Effects
- **3D Dice Rolling**: Three.js-powered animated dice
- **Particle Effects**: Context-aware celebrations (confetti, stars, sparkles, coins, fireworks)
- **Smooth Animations**: Framer Motion for fluid transitions
- **City-Specific Themes**: Unique color palettes for each city

### 🔊 Audio
- **Sound Effects**: Dice rolls, upgrades, achievements, city unlocks
- **Volume Controls**: Separate master, music, and SFX controls
- **Mute Toggle**: Quick mute/unmute with persistence
- **Accessibility**: Respects prefers-reduced-motion

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for web app)
- PostgreSQL (optional, for future backend features)
- Windows (for full-stack development)

### Run the Game (Web Only)

```powershell
# Navigate to web directory
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:5173 to play!

### Run Tests

```powershell
cd web
npm test
```

### Build for Production

```powershell
cd web
npm run build
npm run preview  # Preview production build
```

## 📁 Project Structure

```
city-builder/
├── web/                    # React frontend (main game)
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── BoardLoop.jsx          # Main game loop
│   │   │   ├── CityTransition.jsx     # City unlock animations
│   │   │   ├── ParticleEffect.jsx     # Particle system
│   │   │   ├── AudioControls.jsx      # Audio UI
│   │   │   └── __tests__/             # Component tests
│   │   ├── utils/         # Utilities
│   │   │   ├── audioManager.js        # Audio system
│   │   │   ├── performanceMonitor.js  # Performance tracking
│   │   │   └── __tests__/             # Utility tests
│   │   └── index.css      # Global styles
│   └── package.json
├── apps/                   # Future backend services
│   ├── api-node/          # Node.js API (planned)
│   ├── api-dotnet/        # .NET API (planned)
│   └── worker-python/     # Python worker (planned)
├── db/                     # Database migrations
├── conductor/             # Development tracks
├── scripts/               # Build/deployment scripts
└── docs/                  # Documentation

## 🎮 How to Play

1. **Roll the Dice**: Click "Roll Dice" to move around the board
2. **Land on Tiles**: Different tiles provide different effects:
   - 💰 **Funds**: Earn money
   - 🏛️ **Landmark**: Upgrade your city landmarks
   - 🎲 **Bonus Dice**: Earn extra dice rolls
   - 🛡️ **Shield**: Protect your city from heists
   - 🃏 **Sticker**: Collect stickers for albums
   - 🚨 **Heist**: Attack other players' cities (multiplayer, coming soon)
3. **Upgrade Landmarks**: Use funds to upgrade your 5 city landmarks
4. **Complete Missions**: Finish missions to earn rewards
5. **Reach Milestones**: Progress through event milestones
6. **Unlock Cities**: Max all landmarks to unlock the next city
7. **Prestige**: Reset event progress for enhanced rewards

### Controls
- **Autoroll**: Toggle automatic rolling for continuous gameplay
- **Audio Controls**: Adjust volume or mute sounds
- **Reset**: Confirm dialog to restart your progress (bottom-left)

## 🧪 Testing

**Test Coverage: 171 tests, 100% passing**

```powershell
cd web
npm test              # Run all tests
npm run test:ui       # Visual test UI
npm run test:coverage # Coverage report
```

Test suites:
- City Transitions: 25 tests
- Particle Effects: 31 tests
- Audio Manager: 42 tests
- BoardLoop: 30+ tests
- Save System: 27 tests
- Session Analytics: 7 tests
- 3D Dice: 9+ tests

## 🛠️ Technology Stack

### Frontend
- **React 19.2**: UI framework
- **Vite**: Build tool & dev server
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animation library
- **Three.js / React Three Fiber**: 3D dice rendering
- **Vitest**: Unit testing
- **Playwright**: E2E testing

### Backend (Planned)
- **Node.js/Express**: API server
- **.NET Core**: Alternative API
- **Python**: Background workers
- **PostgreSQL**: Database

## 📊 Game Balance

- **Starting Resources**: 50 dice, $7,500 funds
- **Cities**: 35 total (currently 2 implemented)
- **Landmarks per City**: 5 upgradeable
- **Missions**: 5 per set (infinitely repeatable)
- **Event Milestones**: 5 per event with prestige system
- **Sticker Sets**: 180 total stickers across themed albums

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` (if using backend):

```env
PGHOST=localhost
PGPORT=5432
PGDATABASE=city-builder_dev
PGUSER=postgres
PGPASSWORD=your_password
```

### Audio Settings
Audio preferences are saved to localStorage:
- Master volume
- SFX volume
- Mute state

### Game Save
Progress is automatically saved to localStorage:
- Player position
- Funds & dice
- Landmark levels
- Mission progress
- Event progress
- Sticker collection

## 📚 Documentation

- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [AGENTS.md](./AGENTS.md) - AI coding agent guidelines
- [KNOWLEDGE_BASE.md](./KNOWLEDGE_BASE.md) - Project knowledge & history
- [GDD.md](./GDD.md) - Game Design Document
- [PRD.md](./PRD.md) - Product Requirements
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - Development roadmap

## 🚧 Current Status

**Phase 5: Content Polish & Enhancement - COMPLETE (100%)**

✅ All tasks complete:
- Task 5.1: Enhanced City Transitions
- Task 5.2: Particle Effect Enhancements
- Task 5.3: Audio System
- Task 5.4: Performance Optimization
- Task 5.5: Additional Test Coverage
- Task 5.6: Documentation Polish

**Next Phase**: Phase 6 - Multi-city Content (Cities 3-5)

## 🤝 Contributing

This project follows strict AI agent guidelines. See [AGENTS.md](./AGENTS.md) for:
- Code quality standards
- Testing requirements
- Git workflow
- Database migration procedures

## 📝 License

[MIT License](./LICENSE)

## 🎯 Roadmap

### Completed
- ✅ Phase 1: Core board mechanics & dice rolling
- ✅ Phase 2: City 1 & 2 implementation
- ✅ Phase 3: Mission & event systems
- ✅ Phase 4: Save system & persistence
- ✅ Phase 5: Polish & enhancement

### Upcoming
- 🔄 Phase 6: Cities 3-5 (Las Vegas, Tokyo, Paris themes)
- 🔄 Phase 7: Sticker system expansion
- 🔄 Phase 8: Multiplayer foundation
- 🔄 Phase 9: Backend integration
- 🔄 Phase 10: Production deployment

## 🐛 Known Issues

None! All tests passing. 🎉

## 💬 Support

For issues or questions, check:
- [GitHub Issues](https://github.com/tdrose01/city-builder/issues)
- Project documentation in `/docs`
- Knowledge base: [KNOWLEDGE_BASE.md](./KNOWLEDGE_BASE.md)
