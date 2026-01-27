# How to Open This Project Correctly

## ⚠️ IMPORTANT: Workspace Root Directory

The correct workspace root for this project is:
```
C:\city-slacker\
```

**NOT:**
```
C:\city-slacker\city-slacker\  ❌ WRONG!
```

---

## 🎯 For Cursor / VS Code Users

### Option 1: Use the Workspace File (Recommended)
1. Open Cursor/VS Code
2. File → Open Workspace from File
3. Select: `C:\city-slacker\city-slacker.code-workspace`

This will:
- Open the correct root directory
- Hide the old Unity project folder
- Set up proper folder structure
- Configure recommended settings

### Option 2: Open Folder Directly
1. Open Cursor/VS Code
2. File → Open Folder
3. Navigate to: `C:\city-slacker\`
4. **Make sure you're in the folder that contains:**
   - `web/` directory
   - `conductor/` directory
   - `CURRENT_PHASE.md`
   - `README.md`

### Option 3: Command Line
```bash
# Navigate to the correct directory
cd C:\city-slacker

# Open in Cursor
cursor .

# Or open in VS Code
code .
```

---

## ✅ How to Verify You're in the Right Place

After opening, check your workspace root. You should see:

```
C:\city-slacker\
├── .cursorrules                    ← AI agent config
├── CURRENT_PHASE.md                ← Entry point
├── README.md                       ← Project overview
├── STATUS.md                       ← Current state
├── web/                            ← Active development
├── conductor/                      ← Project management
└── city-slacker.code-workspace     ← Workspace file
```

---

## 🚨 If You Opened the Wrong Directory

If Cursor/VS Code opened `C:\city-slacker\city-slacker\`:

1. **Close the workspace:** File → Close Workspace
2. **Follow Option 1 or 2 above** to open correctly
3. **Clear recent files** if it keeps opening wrong location:
   - File → Open Recent → Clear Recently Opened

---

## 🤖 For AI Agents

If you're an AI agent and you're seeing this file:

1. **Check your workspace root path**
2. **If it's `C:\city-slacker\city-slacker\`:** You're in the wrong place
3. **Request the user to reopen the project** using the instructions above
4. **Once in correct location:** Read `CURRENT_PHASE.md` to begin

---

## 📋 Quick Start After Opening Correctly

Once you're in `C:\city-slacker\`:

1. **Read:** `CURRENT_PHASE.md` for current phase context
2. **Navigate:** `cd web` for active development
3. **Install:** `npm install` (first time only)
4. **Develop:** `npm run dev` to start dev server
5. **Test:** `npm test` to run test suite

---

## 🔧 Troubleshooting

### Problem: Cursor keeps opening city-slacker/city-slacker/
**Solution:**
1. Close Cursor completely
2. Delete: `%APPDATA%\Cursor\User\workspaceStorage\` (clear cache)
3. Open using workspace file: `city-slacker.code-workspace`

### Problem: Can't find web/ directory
**Solution:** You're in the wrong directory. Navigate up one level:
```bash
cd ..
pwd  # Should show: C:\city-slacker
```

### Problem: AI agent is confused about project structure
**Solution:** 
1. Ensure workspace root is `C:\city-slacker\`
2. Read `.cursorrules` file (AI agents should auto-detect)
3. Read `CURRENT_PHASE.md` for complete context

---

## 📞 Need Help?

If you're still having issues:
1. Check the workspace root path in your editor's status bar
2. Ensure it shows: `C:\city-slacker\` (not `C:\city-slacker\city-slacker\`)
3. Use the workspace file for guaranteed correct setup

---

**Remember: The active project is the React web prototype in `C:\city-slacker\web\`, not the Unity project!**
