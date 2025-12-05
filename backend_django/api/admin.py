from django.contrib import admin
from .models import PortfolioData

@admin.register(PortfolioData)
class PortfolioDataAdmin(admin.ModelAdmin):
    list_display = ('id', 'updated_at')
