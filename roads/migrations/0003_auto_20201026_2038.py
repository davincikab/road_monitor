# Generated by Django 3.1.1 on 2020-10-26 17:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('roads', '0002_roadreport'),
    ]

    operations = [
        migrations.AddField(
            model_name='roadreport',
            name='is_resolved',
            field=models.BooleanField(default=False, verbose_name='Resolved Report'),
        ),
        migrations.AlterField(
            model_name='roadreport',
            name='date',
            field=models.DateField(auto_now=True, verbose_name='Reported On'),
        ),
    ]