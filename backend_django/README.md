Django + SQLite backend for portfolio

Quick start

1. Create a Python virtualenv and install dependencies

```bash
cd backend_django
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

2. Run migrations and start server

```bash
python manage.py migrate
python manage.py createsuperuser  # optional for Django admin
python manage.py runserver
```

3. API endpoints

- GET  /api/portfolio/               — get full portfolio JSON
- POST /api/portfolio/update/<sect>/ — update a section (about, educations, experiences, projects, social, resume, settings)
- POST /api/portfolio/clear/         — clear data (resets to empty)

Notes
- Uses SQLite (`db.sqlite3`) by default so no DB setup required
- Admin panel available at `/admin/` after `createsuperuser`
- Update your frontend `admin.js` and `index.html` to point to the deployed URL when you deploy this backend
