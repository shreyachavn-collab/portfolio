from django.db import models

class PortfolioData(models.Model):
    # Single row storing JSON-like fields via TextField (store JSON as string)
    about = models.TextField(blank=True, default='')
    educations = models.TextField(blank=True, default='[]')
    experiences = models.TextField(blank=True, default='[]')
    projects = models.TextField(blank=True, default='[]')
    social = models.TextField(blank=True, default='{}')
    resume = models.TextField(blank=True, default='{}')
    settings = models.TextField(blank=True, default='{}')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'PortfolioData (updated {self.updated_at})'
