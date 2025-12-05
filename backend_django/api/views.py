import json
from django.http import JsonResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from .models import PortfolioData


def get_single_instance():
    obj = PortfolioData.objects.first()
    if not obj:
        obj = PortfolioData.objects.create()
    return obj


def index(request):
    data = get_single_instance()
    resp = {
        'about': json.loads(data.about or '{}'),
        'educations': json.loads(data.educations or '[]'),
        'experiences': json.loads(data.experiences or '[]'),
        'projects': json.loads(data.projects or '[]'),
        'social': json.loads(data.social or '{}'),
        'resume': json.loads(data.resume or '{}'),
        'settings': json.loads(data.settings or '{}'),
        'updated_at': data.updated_at,
    }
    return JsonResponse(resp, safe=False)


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
