# Django Backend Deployment Guide

Since the API approach had issues, follow these **manual UI steps** to deploy your Django backend on Render.

## Step 1: Connect Your GitHub Repository to Render

1. Go to **https://dashboard.render.com**
2. Sign in with GitHub (or create an account)
3. Click **New** → **Web Service**
4. Select **Connect a new repository** → choose `shreyachavn-collab/portfolio`
5. Click **Connect**

## Step 2: Configure the Web Service

Fill in the following details:

- **Name:** `portfolio-backend`
- **Environment:** `Python 3`
- **Region:** `Oregon` (or your preference)
- **Branch:** `main`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn portfolio_backend.wsgi --bind 0.0.0.0:$PORT`
- **Plan:** `Free` (OK for testing; upgrade later if needed)
- **Root Directory:** `backend_django` ⬅️ **Important!**

## Step 3: Add Environment Variables

In the **Environment** section, add:

```
DJANGO_SECRET_KEY=your-secret-key-here-min-50-chars
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=portfolio-backend.onrender.com
```

To generate a secure secret key, you can:
- Use an online generator (e.g., https://djecrety.ir/)
- Or use Python: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`

## Step 4 (Optional): Add a PostgreSQL Database

If you want persistent data beyond deployments:

1. Click **New** → **PostgreSQL** on the Render dashboard
2. Name it `portfolio-db`, choose free plan
3. Once created, copy the **Internal Database URL**
4. Back in the Web Service, add an env var:
   ```
   DATABASE_URL=<paste-the-internal-db-url-here>
   ```

The Django app is already configured to read `DATABASE_URL` via `dj-database-url`.

## Step 5: Deploy

1. Click **Deploy**
2. Wait 2-5 minutes for the build to complete
3. Once done, Render will show the service URL (e.g., `https://portfolio-backend.onrender.com`)
4. Click the service URL to test: you should see a `{"status": "ok"}` response at `/api/portfolio/health/`

## Step 6: Update Your Frontend

Once the backend is live, update your frontend code:

1. Open `admin.js` and find the `API_BASE` constant
2. Replace the placeholder with your Render service URL:
   ```javascript
   const API_BASE = "https://portfolio-backend.onrender.com/api/portfolio";
   ```
3. Do the same in `index.html` if it has a backend URL reference

4. Commit and push:
   ```bash
   git add admin.js index.html
   git commit -m "chore: set API_BASE to deployed Render backend"
   git push origin main
   ```

## Step 7: Test the Integration

1. Visit your live portfolio: `https://shreyachavn-collab.github.io/portfolio/`
2. Open the admin panel: `https://shreyachavn-collab.github.io/portfolio/admin.html`
3. Add some data (e.g., update About section)
4. Save — it should now POST to your Render backend
5. Refresh the live portfolio — it should fetch from the backend and display your changes

---

## Troubleshooting

- **Build failed:** Check the Render build logs; ensure `backend_django/requirements.txt` is present
- **Service not responding:** Check the start command; ensure root directory is set to `backend_django`
- **Frontend not saving data:** Verify the `API_BASE` URL is correct in `admin.js` and `index.html`
- **CORS issues:** The backend is already configured with `@csrf_exempt` for API endpoints

---

## API Endpoints

Once deployed, you can test these directly:

- **GET `/api/portfolio/`** — Fetch all portfolio data
- **GET `/api/portfolio/health/`** — Health check (returns `{"status": "ok"}`)
- **POST `/api/portfolio/update/<section>/`** — Update a section (about, educations, experiences, projects, social, resume, settings)
- **POST `/api/portfolio/clear/`** — Clear all data

Example POST body for `/api/portfolio/update/about/`:
```json
{
    "name": "Your Name",
    "title": "Your Title",
    "bio": "Your bio here"
}
```

---

## Next Steps

After successful deployment:
- Monitor the backend using Render's logs
- If using SQLite (free Postgres), note that data resets on redeploy; add Postgres for persistence
- Share your live portfolio URL with friends/employers!
