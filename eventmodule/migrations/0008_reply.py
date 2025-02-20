# Generated by Django 5.1.3 on 2025-02-10 15:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eventhub_user', '0004_alter_customuser_profile_picture'),
        ('eventmodule', '0007_comment'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reply',
            fields=[
                ('reply_id', models.AutoField(primary_key=True, serialize=False)),
                ('content', models.TextField()),
                ('replied_at', models.DateTimeField(auto_now_add=True)),
                ('comment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='replies', to='eventmodule.comment')),
                ('dislikes', models.ManyToManyField(blank=True, related_name='disliked_replies', to='eventhub_user.customuser')),
                ('likes', models.ManyToManyField(blank=True, related_name='liked_replies', to='eventhub_user.customuser')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_replies', to='eventhub_user.customuser')),
            ],
        ),
    ]
