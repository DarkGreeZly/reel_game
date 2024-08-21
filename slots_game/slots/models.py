from django.db import models

class OneTimeLinkModel(models.Model):
    onetime_url = models.CharField(max_length=36)
