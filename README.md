# Shreya's Portfolio

A modern, animated portfolio with admin panel, backend sync, and multi-device data persistence.

**Live Site**: https://shreyachavn-collab.github.io/portfolio/

## Features

✅ Beautiful animated portfolio (Tailwind CSS + Animate.css)
✅ Admin panel to manage content (About, Education, Experience, Projects, Resume, Social)
✅ Node.js + MongoDB backend for data sync across devices
✅ Responsive design (desktop, tablet, mobile)
✅ GitHub Pages hosting (free)
✅ Fallback to localStorage if backend is unavailable

## Project Structure

```
├── index.html              # Main portfolio page
├── admin.html              # Admin panel (edit mode)
├── login.html              # Admin login page
├── resume.html             # Resume page
├── main.js                 # Frontend interactions
├── admin.js                # Admin panel functionality
└── backend/                # Node.js + MongoDB server
    ├── server.js           # Express server
    ├── models/             # Database schema
    ├── routes/             # API endpoints
    ├── package.json        # Dependencies
    └── README.md           # Backend setup
```

## Getting Started

### 1. View the Live Portfolio
Open: https://shreyachavn-collab.github.io/portfolio/

### 2. Access Admin Panel
- URL: https://shreyachavn-collab.github.io/portfolio/admin.html
- Default login: Check `login.html` for credentials (set in admin panel)
- Edit your content and it will sync to the live portfolio

### 3. Set Up Backend (For Data Sync)
**Important**: Without the backend, edits will only be saved locally in your browser.

Follow the [BACKEND_SETUP.md](./BACKEND_SETUP.md) guide to:
1. Create a free MongoDB database
2. Deploy backend to Render.com (or Heroku/Railway)
3. Connect frontend to backend

## How It Works

**Without Backend** (Current):
- Admin panel saves to browser localStorage
- Updates only visible on that browser/device

**With Backend** (Recommended):
- Admin panel saves to MongoDB via backend
- Updates sync across all devices and browsers
- Portfolio data is persistent and accessible from anywhere

## Tech Stack

**Frontend**:
- HTML5
- TailwindCSS (CDN)
- Animate.css (CDN)
- Vanilla JavaScript

**Backend** (Optional):
- Node.js + Express
- MongoDB
- CORS enabled
- Deploy to Render/Heroku/Railway

## Edit Your Portfolio

1. Go to: https://shreyachavn-collab.github.io/portfolio/admin.html
2. Log in (credentials in login.html)
3. Edit each section:
   - **About**: Name, title, bio, location, profile photo
   - **Education**: Degrees, institutions, years
   - **Experience**: Job titles, companies, descriptions
   - **Projects**: Project names, descriptions, links
   - **Resume**: Text content + optional PDF
   - **Social**: Links to GitHub, LinkedIn, Twitter, Instagram, Email
   - **Settings**: Site title, footer text

4. Click "Save" button for each section
5. Changes appear immediately on the live portfolio

## Customization

### Update Site Title
- In admin panel → Settings → Portfolio Title

### Change Colors
- Edit Tailwind classes in `index.html` (indigo-600 → your color)
- Or search for color values in CSS

### Add Sections
- Add new tabs in `admin.html`
- Create corresponding API endpoint in `backend/routes/portfolio.js`

## Troubleshooting

**Admin panel says "Backend not connected"?**
- Backend is optional - your changes will save to browser localStorage
- To use backend, follow [BACKEND_SETUP.md](./BACKEND_SETUP.md)

**Changes not appearing on live site?**
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Check browser console: F12 → Console tab

**Admin login failing?**
- Check `login.html` for default credentials
- Or reset in localStorage via browser DevTools

## Deployment

### GitHub Pages (Already Set Up ✅)
- Live at: https://shreyachavn-collab.github.io/portfolio/
- Automatically syncs from GitHub main branch

### Backend Deployment
- See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for Render/Heroku setup

## Contributing

This is a personal portfolio - feel free to customize all content!

## License

MIT - Use freely for your portfolio

---

**Questions?** Check the [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed setup instructions.
