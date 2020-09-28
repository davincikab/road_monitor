from django.shortcuts import render
from django.http import HttpResponse

# template 
from django.views.generic.base import TemplateView

# serializer
from django.core.serializers import serialize

#models
from .models import Wards, Road, Municipality

# utils
import json

# Create your views here.
def home(request):
    return HttpResponse("Home Coming")

class HomeView(TemplateView):
    template_name = "roads/home.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # context["data"] = roads_data(self.request)
        return context
 

class MapView(TemplateView):
    template_name = "roads/map.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # context["data"] = roads_data(self.request)
        return context
    
def wards_data(request):
    ward = serialize('geojson', Wards.objects.all())
    municipality = serialize('geojson', Municipality.objects.all())
    
    # serializer
    return HttpResponse(json.dumps([ward, municipality]))

def roads_data(request):
    data = serialize('geojson', Road.objects.all())

    # serializer
    return HttpResponse(data)

