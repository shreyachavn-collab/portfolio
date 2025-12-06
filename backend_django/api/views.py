import json
import traceback
from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.core.management import call_command
from django.db.utils import OperationalError
from .models import PortfolioData


def get_single_instance():
    try:
        obj = PortfolioData.objects.first()
    except OperationalError:
        # Database/table missing — try to run migrations and retry once.
        try:
            call_command('migrate', '--noinput')
        except Exception:
            # If migrate fails, return a transient in-memory default instance
            return PortfolioData()
        try:
            obj = PortfolioData.objects.first()
        except Exception:
            return PortfolioData()

    if not obj:
        try:
            obj = PortfolioData.objects.create()
        except Exception:
            # If creation fails (e.g., migrations still missing), return transient object
            return PortfolioData()

    return obj


def index(request):
    try:
        data = get_single_instance()
        resp = {
            'about': json.loads(data.about or '{}'),
            'educations': json.loads(data.educations or '[]'),
            'experiences': json.loads(data.experiences or '[]'),
            'projects': json.loads(data.projects or '[]'),
            'social': json.loads(data.social or '{}'),
            'resume': json.loads(data.resume or '{}'),
            'settings': json.loads(data.settings or '{}'),
            # datetime objects are not JSON serializable; convert to ISO string
            'updated_at': data.updated_at.isoformat() if getattr(data, 'updated_at', None) else None,
        }
        return JsonResponse(resp, safe=False)
    except Exception as e:
        tb = traceback.format_exc()
        # Return error and traceback to help debugging (temporary)
        return JsonResponse({'error': str(e), 'trace': tb}, status=500)


@csrf_exempt
def update_section(request, section):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    try:
        payload = json.loads(request.body.decode('utf-8'))
    except Exception:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    data = get_single_instance()
    if section == 'about':
        data.about = json.dumps(payload)
    elif section == 'educations':
        data.educations = json.dumps(payload)
    elif section == 'experiences':
        data.experiences = json.dumps(payload)
    elif section == 'projects':
        data.projects = json.dumps(payload)
    elif section == 'social':
        data.social = json.dumps(payload)
    elif section == 'resume':
        data.resume = json.dumps(payload)
    elif section == 'settings':
        data.settings = json.dumps(payload)
    else:
        return JsonResponse({'error': 'Unknown section'}, status=400)

    data.save()
    return JsonResponse({'success': True})


@csrf_exempt
def clear_all(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])
    PortfolioData.objects.all().delete()
    PortfolioData.objects.create()
    return JsonResponse({'success': True})


def health(request):
    return JsonResponse({'status': 'ok'})
