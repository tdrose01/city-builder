# City Slacker - Active Bugs

## [ACTIVE] Bug #1: Game screen flashes then disappears
**Reported:** 2026-02-17  
**Severity:** 🔴 High  
**Status:** Open / Needs Investigation

### Description
Game screen appears briefly on load, then disappears completely. User cannot interact with game.

### Environment
- **URL:** https://4094cc31.city-slacker.pages.dev
- **Platform:** Cloudflare Pages
- **Last Deploy:** commit `71211cb` (title update)

### Possible Causes
1. **WebGL initialization failure** - Three.js canvas crashes after render
2. **React error boundary** - Missing error boundary causes white screen
3. **State management** - Store initialization crashes
4. **Shader compilation** - WebGL shaders fail on certain devices
5. **Bundle error** - JS chunk fails to load

### Debug Steps Needed
```bash
# 1. Test locally
cd web && npm run dev

# 2. Check console errors
# Open browser DevTools → Console tab

# 3. Verify WebGL support
# Visit: https://get.webgl.org/

# 4. Test different browsers
# Chrome, Firefox, Safari - all should be tested
```

### Related Commits
- `71211cb` - Title update (most recent)
- `213e3c4` - Test timing fixes
- `44a8e92` - CI/CD workflow

### Next Actions
- [ ] Check browser console for errors
- [ ] Test on local dev server
- [ ] Verify WebGL support
- [ ] Check Cloudflare Pages Functions logs
- [ ] Add error boundary to React app
- [ ] Test mobile vs desktop

---

## [RESOLVED] Previous Issues

### Bug: Netlify build minutes exceeded
**Status:** ✅ Resolved (2026-02-16)  
**Fix:** Migrated to Cloudflare Pages

### Bug: Deploy authentication failing
**Status:** ✅ Resolved (2026-02-16)  
**Fix:** Updated API token permissions

---

## Reporting New Bugs

Template:
```markdown
## [STATUS] Brief description
**Reported:** YYYY-MM-DD
**Severity:** 🔴 High / 🟡 Medium / 🟢 Low
**Status:** Open / In Progress / Resolved

### Description
What happened?

### Steps to Reproduce
1. Step 1
2. Step 2

### Expected vs Actual
- Expected: ...
- Actual: ...

### Environment
- URL:
- Browser:
- Device:

### Related
- Commit: `abc1234`
- Files: `web/src/...`
```
