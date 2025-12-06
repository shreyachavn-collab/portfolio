Simple Flask backend for portfolio

Endpoints:
- GET  /api/portfolio/          -> returns portfolio JSON
- POST /api/portfolio/update/<section>/  -> update a section (about, educations, experiences, projects, social, resume, settings)
- POST /api/portfolio/clear/    -> reset data
- GET  /api/portfolio/health/   -> health check

To run locally:

python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py

To deploy on Render:
- Create a new Web Service using the repo, point root to `backend_simple/` and use the default build/start commands or a Procfile.
