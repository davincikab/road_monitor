from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include("roads.urls")),
    path("user/", include("user.urls")),
]

admin.site.site_header = "Road Monitor"
admin.site.site_title = "Road Monitor Administration"
admin.site.index_title = "Road Monitor"