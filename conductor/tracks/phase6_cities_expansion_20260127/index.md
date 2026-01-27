# Phase 6: Multi-City Content Expansion (Cities 3-5)

**Track ID:** `phase6_cities_expansion_20260127`  
**Created:** 2026-01-27  
**Status:** 🚀 Active  
**Estimated Duration:** 6-8 hours

---

## 🎯 Overview

Expand the game with three new cities (Cities 3, 4, and 5), each with unique themes, progressive difficulty, and exponential economic scaling. Build on the existing 2-city foundation to create a richer, more engaging progression system.

---

## 📋 Goals

### Primary Goals
1. **Implement City 3: Crystal Plaza** (Purple theme, 1.96x multiplier)
2. **Implement City 4: Starlight District** (Blue theme, 2.744x multiplier)
3. **Implement City 5: Neon Skyline** (Cyan theme, 3.8416x multiplier)
4. **Ensure smooth progression** from Cities 1-5
5. **Maintain 100% test coverage**

### Success Criteria
- ✅ All 5 cities functional and unlockable
- ✅ Unique visual themes for each city
- ✅ Economic scaling working correctly (1.4x multiplier per city)
- ✅ City transitions smooth and celebratory
- ✅ Tests passing (target: 180+ tests)
- ✅ No performance degradation

---

## 🏙️ City Specifications

### City 3: Crystal Plaza
**Theme:** Luxury, elegance, purple crystals  
**Multiplier:** 1.96x (1.4²)  
**Color:** Purple (#a855f7)  
**Unlock:** Complete all 5 landmarks in City 2

**Aesthetic:**
- Purple and violet color scheme
- Crystal/gem motifs
- Elegant, upscale feel
- Grid pattern: Purple crystalline

### City 4: Starlight District
**Theme:** Night sky, astronomy, cosmic  
**Multiplier:** 2.744x (1.4³)  
**Color:** Blue (#3b82f6)  
**Unlock:** Complete all 5 landmarks in City 3

**Aesthetic:**
- Blue and indigo color scheme
- Star and constellation motifs
- Cosmic, ethereal feel
- Grid pattern: Starry night

### City 5: Neon Skyline
**Theme:** Futuristic, high-tech, electric  
**Multiplier:** 3.8416x (1.4⁴)  
**Color:** Cyan (#06b6d4)  
**Unlock:** Complete all 5 landmarks in City 4

**Aesthetic:**
- Cyan and electric blue
- Neon light motifs
- Futuristic, tech feel
- Grid pattern: Circuit board

---

## 📦 Tasks

### Task 6.1: City 3 - Crystal Plaza (2-3h)
**Priority:** High  
**Dependencies:** None

**Subtasks:**
1. Create city data configuration
2. Define tile layout (20 tiles)
3. Implement purple theme styling
4. Add crystal grid pattern
5. Configure 1.96x multiplier
6. Test unlock from City 2
7. Verify economic scaling
8. Write tests

**Deliverables:**
- City 3 fully playable
- Purple theme applied
- Smooth transition from City 2
- Tests passing

---

### Task 6.2: City 4 - Starlight District (2-3h)
**Priority:** High  
**Dependencies:** Task 6.1

**Subtasks:**
1. Create city data configuration
2. Define tile layout (20 tiles)
3. Implement blue theme styling
4. Add starry grid pattern
5. Configure 2.744x multiplier
6. Test unlock from City 3
7. Verify economic scaling
8. Write tests

**Deliverables:**
- City 4 fully playable
- Blue theme applied
- Smooth transition from City 3
- Tests passing

---

### Task 6.3: City 5 - Neon Skyline (2-3h)
**Priority:** High  
**Dependencies:** Task 6.2

**Subtasks:**
1. Create city data configuration
2. Define tile layout (20 tiles)
3. Implement cyan theme styling
4. Add circuit grid pattern
5. Configure 3.8416x multiplier
6. Test unlock from City 4
7. Verify economic scaling
8. Write tests

**Deliverables:**
- City 5 fully playable
- Cyan theme applied
- Smooth transition from City 4
- Tests passing

---

### Task 6.4: Integration & Polish (1-2h)
**Priority:** Medium  
**Dependencies:** Tasks 6.1, 6.2, 6.3

**Subtasks:**
1. Test full progression (City 1 → City 5)
2. Verify all city transitions work
3. Check economic balance across all cities
4. Update city selector/indicator UI
5. Add completion celebration for City 5
6. Performance testing with 5 cities
7. Update documentation

**Deliverables:**
- Seamless 5-city experience
- All transitions working
- Documentation updated
- Performance maintained

---

## 🎨 Design Specifications

### Color Palettes

**City 3: Crystal Plaza**
- Primary: `#a855f7` (Purple)
- Secondary: `#9333ea` (Violet)
- Glow: `rgba(168, 85, 247, 0.05)`
- Accent: `#c084fc` (Light Purple)

**City 4: Starlight District**
- Primary: `#3b82f6` (Blue)
- Secondary: `#2563eb` (Royal Blue)
- Glow: `rgba(59, 130, 246, 0.05)`
- Accent: `#60a5fa` (Light Blue)

**City 5: Neon Skyline**
- Primary: `#06b6d4` (Cyan)
- Secondary: `#0891b2` (Dark Cyan)
- Glow: `rgba(6, 182, 212, 0.05)`
- Accent: `#22d3ee` (Bright Cyan)

### Grid Patterns

Each city needs a unique grid pattern in `index.css`:

```css
.theme-crystal-plaza .city-grid {
  background-image: 
    linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px);
}

.theme-starlight-district .city-grid {
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
}

.theme-neon-skyline .city-grid {
  background-image: 
    linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
}
```

---

## 🧪 Testing Strategy

### Unit Tests
- City data configuration validation
- Multiplier calculations
- Unlock conditions
- Theme application

### Integration Tests
- Full city progression (1 → 5)
- Economic scaling across cities
- Save/load with 5 cities
- City transition animations

### Performance Tests
- Frame rate with 5 cities
- Memory usage
- Load times
- Animation smoothness

**Target:** 180+ total tests (add ~9 new tests)

---

## 📊 Economic Scaling

| City | Name | Multiplier | Starting Funds* | Landmark Cost** |
|------|------|------------|-----------------|-----------------|
| 1 | Neon Harbor | 1.0x | $7,500 | $1,000 → $16,000 |
| 2 | Deco Heights | 1.4x | $10,500 | $1,400 → $22,400 |
| 3 | Crystal Plaza | 1.96x | $14,700 | $1,960 → $31,360 |
| 4 | Starlight District | 2.744x | $20,580 | $2,744 → $43,904 |
| 5 | Neon Skyline | 3.8416x | $28,812 | $3,842 → $61,466 |

*Starting funds = Base ($7,500) × Multiplier  
**Landmark Level 1 → Level 5 costs

---

## 🎯 Quality Gates

Before marking Phase 6 complete:

- [ ] All 5 cities implemented
- [ ] All city transitions working
- [ ] Economic scaling balanced
- [ ] 180+ tests passing (100%)
- [ ] No performance degradation
- [ ] Documentation updated
- [ ] KNOWLEDGE_BASE.md updated
- [ ] CHANGELOG.md updated

---

## 📚 Related Documents

- [Detailed Plan](./plan.md) - Step-by-step implementation
- [Specifications](./spec.md) - Technical requirements
- [Testing Guide](./testing.md) - Test scenarios

---

## 🎉 Expected Outcome

By the end of Phase 6, players will have:
- ✨ 5 unique cities to explore
- 🎨 Distinct visual themes for each city
- 📈 Progressive difficulty curve
- 🏆 Sense of accomplishment unlocking new cities
- 🎮 10-15 hours of engaging gameplay content

---

**Ready to build an epic multi-city experience! 🏙️✨**
