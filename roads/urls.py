from django.urls import path
from .views import roads_data, wards_data, MapView, HomeView, LandingView, DashboardView

from django.conf import settings
from django.conf.urls.static import static

# application namspace
app_name = "roads"

urlpatterns = [

    # data views
    path("roads/", roads_data, name="roads"),
    path("other_data/", wards_data, name="wards"),

    # template views
    path("", LandingView.as_view(), name="landing"),
    path("home/", HomeView.as_view(), name="home"),
    path("map/", MapView.as_view(), name="map"),
    path("dashboard/", DashboardView.as_view(), name="dashboard"),
]

# configure static anf media files
if settings.DEBUG:
    urlpatterns +=  static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
