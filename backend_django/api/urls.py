from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='portfolio-index'),
    path('update/<str:section>/', views.update_section, name='portfolio-update'),
    path('clear/', views.clear_all, name='portfolio-clear'),
    path('health/', views.health, name='health'),
]
