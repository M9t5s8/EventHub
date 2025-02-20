# Generated by Django 5.1.3 on 2025-02-03 06:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eventmodule', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='event_image',
            field=models.ImageField(blank=True, null=True, upload_to='Images/event_images/'),
        ),
        migrations.AddField(
            model_name='event',
            name='has_ticket',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='event',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='event',
            name='ticket_price',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
    ]
