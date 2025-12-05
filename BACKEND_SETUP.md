# Portfolio Backend Setup Guide

Your backend is now ready to sync portfolio data across all devices! Here's how to set it up:

## Quick Start (3 steps)

### Step 1: Get MongoDB Free Database
1. Go to **https://www.mongodb.com/cloud/atlas** (free tier)
2. Sign up / Log in
3. Create a cluster (free tier)
4. Get your connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`)

### Step 2: Set Up Backend Locally
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

Replace `your-username` and `your-password` with your MongoDB credentials.

### Step 3: Run Backend Locally
```bash
npm start
```

You should see:
```
✅ MongoDB connected
🚀 Server running on http://localhost:5000
```

## Test Backend

Open your browser to: `http://localhost:5000/api/portfolio`

You should see JSON data like:
```json
{
  "_id": "...",
  "aboutData": {...},
  "educations": [...],
  "experiences": [...],
  "projects": [...]
}
```

## Deploy Backend (Make it Live)

Your backend needs to be deployed so the live portfolio can access it from any device.

### Option A: Deploy to Render.com (Recommended, Free)

1. **Push backend to GitHub** (already done! ✅)

2. **Go to https://render.com**
   - Sign up with GitHub
   - Click "New +"  → "Web Service"
   - Connect your `shreyachavn-collab/portfolio` repository
   - Select the repository

3. **Configure Deploy**
   - Name: `portfolio-backend` (or any name)
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Leave Node version as default

4. **Add Environment Variables**
   - Click "Environment"
   - Add new variable:
     - Key: `MONGODB_URI`
     - Value: (your MongoDB connection string from Step 1)
   - Add another:
     - Key: `NODE_ENV`
     - Value: `production`
   - Save

5. **Deploy**
   - Click "Create Web Service"
   - Wait ~2-5 minutes for deployment
   - You'll get a URL like: `https://portfolio-backend-xyz.onrender.com`

### Option B: Deploy to Heroku

1. Install Heroku CLI
2. Run: `heroku login`
3. Run: `heroku create portfolio-backend`
4. Set environment variables: `heroku config:set MONGODB_URI="your-string"`
5. Run: `git push heroku main`

### Option C: Deploy to Railway.app (Also Free)

Similar to Render - connect GitHub, add environment variables, deploy.

---

## Update Frontend with Backend URL

Once your backend is live, update `admin.js` and `index.html`:

### In `admin.js` (line 3):
```javascript
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api/portfolio'
  : 'https://your-deployed-backend-url.onrender.com/api/portfolio'; // Update this!
```

### In `index.html` (around line 309):
```javascript
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api/portfolio'
  : 'https://your-deployed-backend-url.onrender.com/api/portfolio'; // Update this!
```

Commit and push:
```bash
git add admin.js index.html
git commit -m "Update backend API URLs for production"
git push
```

---

## How It Works

✅ **Admin Panel** (edit mode): `https://shreyachavn-collab.github.io/portfolio/admin.html`
  - Saves to backend
  - Falls back to localStorage if backend is down

✅ **Live Portfolio** (view mode): `https://shreyachavn-collab.github.io/portfolio/`
  - Fetches from backend
  - Falls back to sample/localStorage data if backend is down

✅ **All Devices**: Any device/browser can view the updated portfolio (synced from backend)

---

## Troubleshooting

**Admin says "Backend not connected"?**
- Check backend is running locally: `npm start`
- Or check deployed backend URL is correct in `admin.js`

**MongoDB connection error?**
- Check your MongoDB URI is correct
- Make sure IP whitelist includes your server (Render/Heroku)
- In MongoDB Atlas: Network Access → Add IP "0.0.0.0" for testing

**Data not syncing?**
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console for errors (F12)
- Make sure backend and frontend have same API_BASE URL

---

## Next Steps

1. ✅ Create MongoDB database
2. ✅ Run backend locally (`npm start`)
3. ✅ Deploy backend to Render/Heroku
4. ✅ Update API URLs in `admin.js` and `index.html`
5. ✅ Test: Add data in admin panel, see it on live site from another device

Need help? Check the backend logs on your hosting platform!
