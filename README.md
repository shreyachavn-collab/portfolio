# Portfolio (Tailwind + Animate.css)

This is a simple animated portfolio scaffold using Tailwind CSS (via CDN), Animate.css, and a small `main.js` for interaction.

Files added:

- `index.html` — main portfolio page (About, Resume, Education, Experience, Projects, Social)
- `resume.html` — a standalone resume page (download placeholder)
- `main.js` — small JS for animations, smooth scroll, and mobile nav

How to preview:

1. Open `index.html` in your browser by double-clicking it or from PowerShell:

```powershell
Start-Process .\"C:\Users\Admin\Desktop\New folder\index.html\"
```

2. Or serve the folder locally (recommended for relative links):

```powershell
cd 'C:\Users\Admin\Desktop\New folder'; python -m http.server 8000
# Then open http://localhost:8000 in your browser
```

Customize:
- Replace placeholder text (Your Name, City, email).
- Add your real social links in `index.html` under the Social section.
- Replace the resume download placeholder with a real PDF (place in the folder and update the `href` in `resume.html`).

Want me to:
- Add your real content (send text for About, Education, Experience)?
- Generate a downloadable PDF resume from your provided resume text?
- Add icons (Font Awesome) or integrate a contact form?

GitHub Pages rebuild trigger: 2025-12-05T12:06:56.8237116+05:30
