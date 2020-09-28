from django.urls import path
from .views import home, roads_data, wards_data

# application namspace
app_name = "roads"

urlpatterns = [
    path("", home, name="home"),
    path("roads/", roads_data, name="roads"),
    path("other_data/", wards_data, name="wards"),
]
