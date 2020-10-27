from django.contrib.gis import admin 
from .models import RoadReport, Road, Wards, Municipality

# Register your models here.
@admin.register(Road)
class RoadAdmin(admin.GeoModelAdmin):
    search_fields = ["name", "material", "contractor", "road_struc"]
    list_display = ["name", "contractor", "maintenanc", "constructi"]
    list_filter = ["contractor", "material", "road_struc"]

def mark_as_resolved(modeladmin, request, queryset):
    queryset.update(is_resolved=True)

mark_as_resolved.short_description = "Mark as resolved"

@admin.register(RoadReport)
class RoadReportAdmin(admin.GeoModelAdmin):
    search_fields = ["title", "description"]
    list_display = ["title", "date"]
    list_filter = ["is_resolved", "report_type"]
    actions = [mark_as_resolved]