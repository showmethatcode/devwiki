# Generated by Django 3.1 on 2020-08-16 08:58

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('wiki', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TermRelated',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('term', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wiki.term')),
            ],
        ),
        migrations.CreateModel(
            name='TermRevision',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(verbose_name='설명')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='시간')),
                ('term', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wiki.term', verbose_name='용어')),
            ],
        ),
        migrations.DeleteModel(
            name='Termitem',
        ),
        migrations.AddField(
            model_name='termrelated',
            name='term_revision',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='wiki.termrevision'),
        ),
    ]
