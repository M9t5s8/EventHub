# Generated by Django 5.1.3 on 2025-02-03 07:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eventmodule', '0002_event_event_image_event_has_ticket_event_is_active_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='event_image',
            field=models.ImageField(blank=True, null=True, upload_to='event_images/'),
        ),
    ]
