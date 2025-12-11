# Shreya Chavan — Portfolio

This is a simple portfolio scaffold with a public site (`index.html`) and an admin panel (`admin.html`) with optional cross-device sync via GitHub Gist.

Features:
- About, Resume, Experience, Projects, Skills, Certifications, Social links
- Animated UI using Tailwind CSS (CDN) and Animate.css
- Admin panel to add / edit / delete sections (data saved in browser `localStorage`)
- **Sync across devices using GitHub Gist** (optional)

How to run (static-only)
1. Open `index.html` in your browser to view the public portfolio.
2. Open `admin.html` in your browser to edit content. Changes persist in your browser's localStorage.

Sync across devices (GitHub Gist)
To sync your portfolio data across multiple devices (phone, laptop, tablet, etc.):

1. **Create a GitHub personal access token**:
   - Go to https://github.com/settings/tokens/new
   - Select only the `gist` scope
   - Generate the token and copy it (you'll paste it once per device)

2. **In the Admin Panel**:
   - Scroll down to the "Sync Across Devices (GitHub Gist)" section
   - Paste your GitHub token in the "GitHub Token" field
   - Click "Save to Gist" to create a new gist (the Gist ID will auto-populate)
   - On other devices, enter the same token and Gist ID, then click "Load from Gist" to sync

3. **Workflow**:
   - After editing on any device, click "Save to Gist" to upload
   - On another device, click "Load from Gist" to download the latest data
   - Data is stored in a private GitHub Gist (not publicly visible)

Notes
- This project works entirely as a static site — no local server required. Open `index.html` and `admin.html` directly in your browser.
- All edits made in `admin.html` are saved to your browser's `localStorage` under the key `portfolioData`.
- Profile pictures uploaded via the admin panel are saved as Data URLs inside the stored JSON. Use small images for performance.
- To back up or move your portfolio locally, export the `localStorage` value or use your browser's devtools to copy the `portfolioData` JSON.
- The GitHub token and Gist ID are stored in `localStorage` on each device so you don't have to re-enter them.

If you later decide you want a server-backed setup (to persist data across devices or create user accounts), I can add a backend — but this repository currently operates without a local server by default.

Docker / Deploy the Flask server
Although the site runs as static pages with `localStorage` by default, I included an optional Flask server in `server/` that can serve the site and persist data in SQLite. If you want to deploy this server (so your data is available from any device), here's how to build and run with Docker.

Build and run locally with Docker:

```powershell
cd c:/Users/Admin/Desktop/portfolio2
docker build -t shreya-portfolio .
docker run -p 5000:5000 --rm --name shreya-portfolio shreya-portfolio
```

Then open `http://localhost:5000`.

Deploy to a container host (Render / Railway / Fly / any Docker host):
- Push this repository to GitHub.
- Create a new web service on your host using the GitHub repo and set the build command (if required) to build the Docker image. The Dockerfile in the project root will run the Flask app with Gunicorn and expose port `5000`.

Notes about the server option:
- The Flask server stores portfolio data in `portfolio.db` (SQLite) in the project root inside the container; when deploying to hosted services you should configure persistent storage or use a managed DB if you need backups.
- Uploaded images are saved into the `uploads/` folder (the `.dockerignore` excludes local `uploads/` from the image build).
- If you'd like, I can prepare a deployment guide for a specific provider (Render, Railway, Heroku, or Docker Compose for a VPS).

Firebase integration (optional)
1. Create a Firebase project at https://console.firebase.google.com/ and enable **Firestore** (in native mode).
2. In Project Settings -> Your apps, add a Web app and copy the config object.
3. Create `js/firebase-config.js` in this repo (copy `js/firebase-config.template.js`) and paste your config as the default export.
4. Deploy the site to GitHub Pages (or open `index.html`/`admin.html` locally). When `js/firebase-config.js` is present the site will automatically use Firestore to read/write portfolio data and sync between devices.

Notes:
- Firestore rules: since this site writes directly from the client you'll want to control access. For a simple public portfolio you may allow read access and restrict writes with a simple token or use Firebase Authentication. I can help set up rules or auth if you want secure write access.
- The client stores a local copy in `localStorage` for offline fallback; Firestore is used when available.
