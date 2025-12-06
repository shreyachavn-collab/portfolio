import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_backend.settings')
application = get_wsgi_application()

# Ensure migrations applied on startup (db tables created).
try:
    from django.core.management import call_command
    call_command('migrate', '--noinput')
except Exception:
    import sys, traceback
    traceback.print_exc(file=sys.stderr)
