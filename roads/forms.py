from django import forms
from .models import RoadReport
from urllib import request


class RoadReportForm(forms.ModelForm):
    class Meta:
        model = RoadReport
        exclude = ['geom', 'slug', 'date', 'image', 'is_resolved']
    
    # def clean_image