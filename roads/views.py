from django.shortcuts import render
from django.http import HttpResponse
from django.db.models import Count, Sum
from django.contrib.gis.db.models.functions import Length

# template 
from django.views.generic.base import TemplateView

# serializer
from django.core.serializers import serialize

#models
from .models import Wards, Road, Municipality

# utils
import json
from functools import reduce

# Create your views here.
class LandingView(TemplateView):
    template_name = "roads/landing.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
    

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

class DashboardView(TemplateView):
    template_name = "roads/dashboard.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['road_count'] = Road.objects.all().count()
        context['contractors_count'] = Road.objects.values("contractor").annotate(Count("contractor", distinct=True)).count()
        context['contractors'] = Road.objects.values("contractor").annotate(contracts_count=Count("contractor"))
        context['materials'] = Road.objects.values("material").annotate(material_count=Count("material"))
        context['road_authorities'] = Road.objects.values("authority").annotate(material_count=Count("authority"))
        context['roads_length'] = Road.objects.values("geom").annotate(length=Length("geom")).values("length")
        context['total_length'] = reduce((lambda x, y: x +y), [r['length'].km for r in context["roads_length"]])
        context['total_cost'] = context['total_length']  * 1300000
        return context

def get_graph_data(request):
    construction = Road.objects.values('constructi').annotate(count=Count("constructi"))
    maintenance = Road.objects.values('maintenanc').annotate(count=Count("maintenanc"))
    surface = Road.objects.values('maintenanc').annotate(count=Count("maintenanc"))
    structure = Road.objects.values('road_struc').annotate(count=Count("road_struc"))

    construction = [c for c in construction]
    maintenance = [m for m in maintenance]
    surface = [s for s in surface]
    structure = [st for st in structure]

    return HttpResponse(json.dumps({'construction':construction, 'maintenance':maintenance, 'surface':surface,'structure':structure}))


def wards_data(request):
    ward = serialize('geojson', Wards.objects.all())
    municipality = serialize('geojson', Municipality.objects.all())
    
    # serializer
    return HttpResponse(json.dumps([ward, municipality]))

def roads_data(request):
    data = serialize('geojson', Road.objects.all())

    # serializer
    return HttpResponse(data)

