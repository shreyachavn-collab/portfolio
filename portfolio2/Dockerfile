FROM python:3.11-slim

WORKDIR /app

# Install system deps required for some Python packages (kept minimal)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy project
COPY . /app

# Install Python deps (server requirements file)
RUN python -m pip install --upgrade pip && \
    python -m pip install --no-cache-dir -r server/requirements.txt

ENV PYTHONUNBUFFERED=1
ENV FLASK_ENV=production

EXPOSE 5000

# Use Gunicorn to run the Flask app that lives in server/app.py
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "server.app:app", "--workers", "3", "--threads", "4"]
