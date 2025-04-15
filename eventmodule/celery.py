from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'event_management_system.settings')

app = Celery('eventmodule')

# Use Redis as the broker
app.config_from_object('django.conf:settings', namespace='CELERY')

# Redis broker URL
app.conf.broker_url = 'redis://localhost:6379/0'

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
