from django.urls import path
from .views import home

# application namspace
app_name = "roads"

urlpatterns = [
    path("", home, name="home")
]
