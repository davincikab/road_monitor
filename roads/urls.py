from django.urls import path
from .views import roads_data, wards_data, MapView, HomeView, LandingView, DashboardView,  \
    get_graph_data, report_road_condition, get_report_data

from django.conf import settings
from django.conf.urls.static import static

# application namspace
app_name = "roads"

urlpatterns = [

    # data views
    path("roads/", roads_data, name="roads"),
    path("other_data/", wards_data, name="wards"),
    path("dashboard_data/", get_graph_data, name="graph-data"),

    # template views
    path("", LandingView.as_view(), name="landing"),
    path("home/", HomeView.as_view(), name="home"),
    path("map/", MapView.as_view(), name="map"),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    path("road_report_condition/", report_road_condition, name="road-condition"),
    path("road_report_data/", get_report_data , name="report-data")
]

# configure static and media files
if settings.DEBUG:
    urlpatterns +=  static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns +=  static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
