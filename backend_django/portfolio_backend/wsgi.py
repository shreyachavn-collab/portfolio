import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_backend.settings')
application = get_wsgi_application()

# Temporary: ensure migrations are applied on startup in the deployed environment.
# This helps create the `api_portfoliodata` table when the release/migrate step
# doesn't run for any reason. Remove after the deployment is healthy.
try:
	from django.core.management import call_command
	call_command('migrate', '--noinput')
except Exception:
	# Print traceback to stderr but don't stop the app from starting.
	import sys, traceback
	traceback.print_exc(file=sys.stderr)
