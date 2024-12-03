from django.db import models

class Attender(models.Model):
    attender_username=models.CharField(max_length=50)
    attender_email= models.CharField(max_length=50)
    attender_password=models.CharField(max_length=50)
    
