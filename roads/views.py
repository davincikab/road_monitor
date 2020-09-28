from django.shortcuts import render
from django.http import HttpResponse

# serializer
from django.core.serializers import serialize

#models
from .models import Wards, Road, Municipality

# utils
import json

# Create your views here.
def home(request):
    return HttpResponse("Home Coming")

def wards_data(request):
    ward = serialize('geojson', Wards.objects.all())
    municipality = serialize('geojson', Municipality.objects.all())
    
    # serializer
    return HttpResponse(json.dumps([ward, municipality]))

def roads_data(request):
    data = serialize('geojson', Road.objects.all())

    # serializer
    return HttpResponse(data)

