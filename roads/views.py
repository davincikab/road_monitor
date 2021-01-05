from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.db.models import Count, Sum
from django.contrib.gis.db.models.functions import Length
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.files.base import ContentFile
from django.utils.text import slugify
from django.db.models.functions import ExtractYear

# template 
from django.views.generic.base import TemplateView

# serializer
from django.core.serializers import serialize
from django.contrib.gis.geos import GEOSGeometry

#models
from .models import RoadReport, Road, Wards, Municipality, RoadCondition, Roads, Development, Bridges
from .forms import RoadReportForm

# utils
import base64
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

class DashboardView(LoginRequiredMixin, TemplateView):
    login_url = "/user/login/"
    template_name = "roads/dashboard.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['road_count'] = Roads.objects.all().count()
        context['contractors_count'] = Development.objects.values("contractor").annotate(Count("contractor", distinct=True)).count()
        context['contractors'] = Development.objects.values("contractor").annotate(contracts_count=Count("contractor"))
        context['materials'] = Roads.objects.values("surface").annotate(material_count=Count("surface"))
        context['road_authorities'] = Roads.objects.values("authority").annotate(material_count=Count("authority"))
        context['roads_length'] = Roads.objects.values("geom").annotate(length=Length("geom")).values("length")
        context['total_length'] = reduce((lambda x, y: x +y), [r['length'].km for r in context["roads_length"]])
        context['conct_sum'] = Development.objects.exclude(conct_sum__isnull = True).values("conct_sum")
        print(context['conct_sum'])
        
        context['total_cost'] = reduce((lambda x, y: x +y), [r['conct_sum'] for r in context["conct_sum"]])
        print(context['total_cost'])
        return context

def get_graph_data(request):
    construction = Development.objects.annotate(year=ExtractYear('start_date')).values('year').annotate(count=Count('year'))
    maintenance = Development.objects.values('maint_type').annotate(count=Count("maint_type"))
    surface = Roads.objects.values('surface').annotate(count=Count("surface"))
    road_class = Roads.objects.values('road_class').annotate(count=Count("road_class"))

    construction = [c for c in construction]
    maintenance = [m for m in maintenance]
    surface = [s for s in surface]
    road_class = [st for st in road_class]

    return HttpResponse(json.dumps({'construction':construction, 'maintenance':maintenance, 'surface':surface,'road_class':road_class}))

def get_roads_data(request):
   data = {
       'road':serialize('geojson', Roads.objects.all()),
       'road_condition': serialize('geojson', RoadCondition.objects.all()),
       'development':serialize('geojson', Development.objects.all()),
       'bridges':serialize('geojson', Bridges.objects.all())
   }

   return JsonResponse(data)

def wards_data(request):
    ward = serialize('geojson', Wards.objects.all())
    municipality = serialize('geojson', Municipality.objects.all())
    
    # serializer
    return HttpResponse(json.dumps([ward, municipality]))

def roads_data(request):
    data = serialize('geojson', Road.objects.all())

    # serializer
    return HttpResponse(data)



# report road condition
def report_road_condition(request):
    if request.method == "POST":
        # print(request.POST)
        form = RoadReportForm(request.POST)

        if form.is_valid():
            geom = request.POST.get('geom')
            report = form.save(commit=False)
            report.geom = GEOSGeometry(f'POINT ({geom})')

            image_data = request.POST.get('image-data')
            image_format, imgstr = image_data.split(';base64,')
            ext = image_format.split('/')[-1]
            image_name = slugify(report.title) + '.' + ext

            report.image.save(image_name, ContentFile(base64.b64decode(imgstr)), save=True)

            report.save()

            return JsonResponse({'message':"success"})
        else:
            return JsonResponse({'errors':form.errors})
    else:
        form = RoadReportForm()
    
    return render(request, 'roads/road_report.html',{'form':form})


# request points
def get_report_data(request):
    road_reports = serialize('geojson', RoadReport.objects.all())
    return HttpResponse(road_reports)


# Update to work with Django Rest Framework
# Update the dashboard