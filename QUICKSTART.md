# Backend Setup Summary for Shreya

## What I've Set Up for You ✅

I've created a complete **Node.js + MongoDB backend** so your portfolio data syncs across all devices and browsers. Here's what was done:

### 1. **Backend Files Created** (in `/backend` folder):
- `server.js` — Main Express server
- `models/PortfolioData.js` — Database schema
- `routes/portfolio.js` — API endpoints (GET, POST data)
- `package.json` — Dependencies (Express, MongoDB, CORS)
- `.env.example` — Environment variable template
- `README.md` — Detailed backend documentation

### 2. **Frontend Updated**:
- `admin.js` — Now sends data to backend instead of localStorage
- `index.html` — Now fetches data from backend (with localStorage fallback)
- Both files fall back to localStorage if backend is unavailable

### 3. **Everything Pushed to GitHub** ✅:
- All files are in: https://github.com/shreyachavn-collab/portfolio

---

## Next Steps (Quick Setup)

### Step 1: Create Free MongoDB Database
1. Go to: **https://www.mongodb.com/cloud/atlas**
2. Sign up (free tier)
3. Create a cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)

### Step 2: Run Backend Locally
```bash
cd backend
npm install
```

Create `backend/.env` file:
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

Then run:
```bash
npm start
```

You should see: `✅ MongoDB connected` and `🚀 Server running on http://localhost:5000`

### Step 3: Test It Works
Open: `http://localhost:5000/api/portfolio`

You should see JSON data.

### Step 4: Deploy Backend (Make It Live)

Choose one (all free):

**Option A: Render.com** (Recommended - easiest)
1. Go to https://render.com
2. Sign up with GitHub
3. Create new "Web Service"
4. Connect your `shreyachavn-collab/portfolio` repository
5. Set:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
6. Add Environment Variable: `MONGODB_URI` = your connection string
7. Deploy!
8. You'll get a URL like: `https://portfolio-backend-xyz.onrender.com`

**Option B: Heroku or Railway** (Also works, slightly more complex)

### Step 5: Update Frontend URLs
Once you have your backend URL, update two files:

**In `admin.js` (around line 3)**:
```javascript
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api/portfolio'
  : 'https://your-deployed-backend-url.onrender.com/api/portfolio'; // Update this!
```

**In `index.html` (around line 309)**:
```javascript
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api/portfolio'
  : 'https://your-deployed-backend-url.onrender.com/api/portfolio'; // Update this!
```

Then commit and push:
```bash
git add admin.js index.html
git commit -m "Update backend API URLs"
git push
```

---

## How It Works After Setup

### ✅ Admin Panel:
- Go to: https://shreyachavn-collab.github.io/portfolio/admin.html
- Log in
- Edit your content (About, Education, Projects, Resume, Social, Settings)
- Click "Save" → data goes to MongoDB backend

### ✅ Live Portfolio:
- Go to: https://shreyachavn-collab.github.io/portfolio/
- Fetches data from MongoDB backend
- Shows your latest edits

### ✅ Any Device:
- Desktop, phone, tablet, different browser
- All see the same data (synced from MongoDB)
- Changes appear instantly across all devices

---

## If You Skip Backend Setup

✅ Portfolio still works!
- Admin panel saves to browser localStorage
- Changes only visible on that browser
- Perfect if you don't need multi-device sync

⚠️ But then:
- Edits on desktop don't appear on phone
- Data lost if browser cache is cleared
- Each device has its own copy

---

## Current Status

| Component | Status | Details |
|-----------|--------|---------|
| Frontend (Portfolio) | ✅ Live | https://shreyachavn-collab.github.io/portfolio/ |
| Admin Panel | ✅ Live | https://shreyachavn-collab.github.io/portfolio/admin.html |
| Backend Code | ✅ Ready | In `/backend` folder on GitHub |
| MongoDB Database | ⏳ Needed | Create at mongodb.com |
| Backend Deployment | ⏳ Needed | Deploy to Render/Heroku |

---

## Files Reference

### Main Files
- `index.html` - Live portfolio page
- `admin.html` - Admin panel (edit content)
- `login.html` - Login page
- `main.js` - Frontend logic
- `admin.js` - Admin panel logic

### Backend
- `backend/server.js` - Express app
- `backend/models/PortfolioData.js` - Database schema
- `backend/routes/portfolio.js` - API routes
- `backend/package.json` - Dependencies

### Documentation
- `README.md` - Main overview
- `BACKEND_SETUP.md` - Detailed backend setup
- `backend/README.md` - Backend documentation

---

## Quick Commands

```bash
# Test backend locally
npm start

# Deploy to Render (after connecting GitHub)
# Just push to GitHub, Render auto-deploys

# View live portfolio
open https://shreyachavn-collab.github.io/portfolio/

# View admin panel
open https://shreyachavn-collab.github.io/portfolio/admin.html

# View backend repo
open https://github.com/shreyachavn-collab/portfolio
```

---

## Support

All documentation is in:
1. `BACKEND_SETUP.md` - Complete backend guide
2. `backend/README.md` - Backend-specific details
3. `README.md` - Overview

If backend gets stuck, you can still:
- Use localStorage (changes saved locally)
- Edit manually in browser DevTools
- Reset with admin panel "Clear All Data" button

Good luck! 🚀
