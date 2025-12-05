# Portfolio Backend

Node.js + Express + MongoDB backend API for the portfolio.

## Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Create `.env` file** (copy from `.env.example` and update):
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

3. **Get MongoDB URI:**
   - Go to https://www.mongodb.com/cloud/atlas (free tier)
   - Create a cluster
   - Get the connection string
   - Replace `username:password` with your credentials

4. **Run locally:**
```bash
npm run dev
```

Server will start at `http://localhost:5000`

## API Endpoints

- `GET /api/portfolio` — Get all portfolio data
- `POST /api/portfolio/about` — Update about section
- `POST /api/portfolio/education` — Update education list
- `POST /api/portfolio/experience` — Update experience list
- `POST /api/portfolio/projects` — Update projects list
- `POST /api/portfolio/social` — Update social links
- `POST /api/portfolio/resume` — Update resume
- `POST /api/portfolio/settings` — Update site settings

## Deployment

Deploy to **Render.com** (free):
1. Push code to GitHub
2. Go to https://render.com
3. Connect GitHub repo
4. Set environment variables
5. Deploy

Or use **Heroku**, **Railway**, or **Fly.io**
